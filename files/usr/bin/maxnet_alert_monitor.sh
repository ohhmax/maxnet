#!/bin/sh
# ==============================================================================
# MAXNET OS 24/7 AUTONOMOUS HARDWARE & NETWORK ALERT MONITOR DAEMON
# Zero-overhead sysfs carrier & USB event polling | Immediate webhook dispatch
# ==============================================================================

CONF_FILE="/etc/maxnet_webhooks.json"

get_friendly_name() {
    ser="$1"
    mfg="$2"
    prod="$3"
    case "$ser" in
        *RZCW6090G4J*) echo "Samsung Galaxy S21 FE 5G"; return ;;
        *8d7a382466f6*) echo "Xiaomi Mi A3"; return ;;
        *4e1c1cf*) echo "OPPO A37"; return ;;
    esac
    case "$prod" in
        *SAMSUNG*|*Galaxy*) echo "Samsung Smartphone"; return ;;
        *Mi*|*laurel*|*Redmi*|*POCO*) echo "Xiaomi / POCO Phone"; return ;;
        *iPhone*|*Apple*) echo "Apple iPhone Tether"; return ;;
    esac
    if [ -n "$mfg" ] && [ -n "$prod" ]; then
        echo "$mfg $prod"
    elif [ -n "$prod" ]; then
        echo "$prod"
    else
        echo "USB Device"
    fi
}

dispatch() {
    title="$1"
    msg="$2"
    level="$3"
    ev_type="$4"

    [ ! -f "$CONF_FILE" ] && return
    m_en=$(jq -r '.master_enabled // false' "$CONF_FILE" 2>/dev/null)
    [ "$m_en" != "true" ] && return

    e_en=$(jq -r ".events.${ev_type} // true" "$CONF_FILE" 2>/dev/null)
    [ "$e_en" != "true" ] && return

    payload=$(jq -c -n --arg t "$title" --arg m "$msg" --arg l "$level" --arg et "$ev_type" \
        '{action:"dispatch", title:$t, message:$m, level:$l, event_type:$et}')
    
    ( curl -s -m 8 -X POST "http://127.0.0.1/cgi-bin/webhooks" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1 ) &
}

# 1. Power / Startup Notification
UPTIME_SEC=$(awk '{print int($1)}' /proc/uptime 2>/dev/null || echo 0)
if [ "$UPTIME_SEC" -lt 180 ]; then
    UPTIME_FMT=$(uptime | awk -F'up ' '{print $2}' | awk -F',' '{print $1}')
    dispatch "Router Startup & Power Restored" "MAXNET Gateway has booted up. System uptime: ${UPTIME_FMT:-just now}." "info" "power_event"
fi

# Initial State: USB Devices
scan_usb_devices() {
    out=""
    for u in /sys/bus/usb/devices/*; do
        [ -f "$u/devnum" ] || continue
        b="$(basename "$u")"
        case "$b" in *:*) continue;; usb*) continue;; esac
        ser=$(cat "$u/serial" 2>/dev/null || echo "$b")
        prod=$(cat "$u/product" 2>/dev/null)
        mfg=$(cat "$u/manufacturer" 2>/dev/null)
        fname=$(get_friendly_name "$ser" "$mfg" "$prod")
        clean_fname=$(echo "$fname" | tr ' ' '_')
        out="$out ${b}@${clean_fname}"
    done
    echo "$out"
}

PREV_USB=$(scan_usb_devices)

# Initial State: LAN Carrier Ports
scan_lan_ports() {
    out=""
    for p in /sys/class/net/lan*; do
        [ -d "$p" ] || continue
        port_name=$(basename "$p")
        c=$(cat "$p/carrier" 2>/dev/null || echo 0)
        out="$out ${port_name}:$c"
    done
    echo "$out"
}

PREV_PORTS=$(scan_lan_ports)

PREV_INTERNET=1
PREV_CUSTOM_IP_STATE=1
CUSTOM_IP_FAIL_COUNT=0

while true; do
    # ------------------ A. USB & PHONE HOTPLUG ------------------
    CURR_USB=$(scan_usb_devices)

    # Check for disconnected devices
    for old_dev in $PREV_USB; do
        [ -z "$old_dev" ] && continue
        dev_id="${old_dev%%@*}"
        dev_name=$(echo "${old_dev#*@}" | tr '_' ' ')
        if ! echo "$CURR_USB" | grep -q "${dev_id}@"; then
            dispatch "USB Device Disconnected" "Phone or USB modem (${dev_name}) was disconnected from router USB port." "warning" "usb_plugged"
        fi
    done

    # Check for newly connected devices
    for new_dev in $CURR_USB; do
        [ -z "$new_dev" ] && continue
        dev_id="${new_dev%%@*}"
        dev_name=$(echo "${new_dev#*@}" | tr '_' ' ')
        if ! echo "$PREV_USB" | grep -q "${dev_id}@"; then
            dispatch "USB Device Connected: $dev_name" "New USB hardware attached to router port (${dev_name})." "info" "usb_plugged"
        fi
    done
    PREV_USB="$CURR_USB"

    # ------------------ B. LAN ETHERNET CABLES ------------------
    CURR_PORTS=$(scan_lan_ports)
    for port_info in $CURR_PORTS; do
        [ -z "$port_info" ] && continue
        port_name="${port_info%%:*}"
        c="${port_info#*:}"
        prev_c=$(echo "$PREV_PORTS" | grep -o "${port_name}:[0-9]" | cut -d: -f2)
        if [ -n "$prev_c" ] && [ "$prev_c" != "$c" ]; then
            p_up=$(echo "$port_name" | tr 'a-z' 'A-Z')
            if [ "$c" = "1" ]; then
                spd=$(cat "/sys/class/net/${port_name}/speed" 2>/dev/null || echo 1000)
                dispatch "Ethernet Cable Plugged: $p_up" "Physical Ethernet link established on $p_up at ${spd} Mbps." "info" "lan_plugged"
            else
                dispatch "Ethernet Cable Unplugged: $p_up" "Physical Ethernet link disconnected on port $p_up." "warning" "lan_plugged"
            fi
        fi
    done
    PREV_PORTS="$CURR_PORTS"

    # ------------------ C. CUSTOM IP WATCHDOG ------------------
    if [ -f "$CONF_FILE" ]; then
        TARGET_IP=$(jq -r '.custom_ip_target // empty' "$CONF_FILE" 2>/dev/null)
        if [ -n "$TARGET_IP" ]; then
            if ping -c 1 -W 1 "$TARGET_IP" >/dev/null 2>&1; then
                CUSTOM_IP_FAIL_COUNT=0
                if [ "$PREV_CUSTOM_IP_STATE" -eq 0 ]; then
                    PREV_CUSTOM_IP_STATE=1
                    dispatch "Monitored Host Online: $TARGET_IP" "Target host device $TARGET_IP is back online and responding." "info" "custom_ip"
                fi
            else
                CUSTOM_IP_FAIL_COUNT=$((CUSTOM_IP_FAIL_COUNT + 1))
                if [ "$CUSTOM_IP_FAIL_COUNT" -ge 2 ] && [ "$PREV_CUSTOM_IP_STATE" -eq 1 ]; then
                    PREV_CUSTOM_IP_STATE=0
                    dispatch "Monitored Host Offline: $TARGET_IP" "Target host device $TARGET_IP has gone OFFLINE or stopped responding on the network." "danger" "custom_ip"
                fi
            fi
        fi
    fi

    # ------------------ D. WAN / INTERNET WATCHDOG ------------------
    if ping -c 1 -W 1 1.1.1.1 >/dev/null 2>&1 || ping -c 1 -W 1 8.8.8.8 >/dev/null 2>&1; then
        if [ "$PREV_INTERNET" -eq 0 ]; then
            PREV_INTERNET=1
            dispatch "Internet Connection Restored" "Broadband WAN internet connection re-established and online." "info" "wan_disconnect"
        fi
    else
        if [ "$PREV_INTERNET" -eq 1 ]; then
            PREV_INTERNET=0
            dispatch "Internet Connection Lost" "Broadband WAN / USB gateway dropped. Internet is currently unreachable." "danger" "wan_disconnect"
        fi
    fi

    sleep 2
done
