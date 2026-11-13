#!/bin/sh
# ==============================================================================
# MAXNET ENTERPRISE MULTI-WAN BONDING & INTERNET HEALTH DAEMON
# High-Performance ECMP L4 Multipath Routing for USB Tethering & Ethernet WAN
# Zero CPU Overhead | Parallel Health Probes | Flow-Balanced Aggregation
# ==============================================================================

STATUS_FILE="/tmp/multilink_status.json"
PREV_STATS="/tmp/multilink_prev.tmp"
ACTIVE_SIG_FILE="/tmp/multilink_active_sig.tmp"

# Configure Linux kernel FIB for Layer 4 Multipath (IP + Port hashing)
sysctl -w net.ipv4.fib_multipath_hash_policy=1 >/dev/null 2>&1
sysctl -w net.ipv4.fib_multipath_use_neigh=1 >/dev/null 2>&1

get_speed_type() {
    dev="$1"
    if [ "$dev" = "wan" ]; then
        echo "wan"
        return
    fi
    usb_spd=$(cat /sys/class/net/$dev/device/../speed 2>/dev/null || cat /sys/class/net/$dev/device/speed 2>/dev/null || echo "480")
    if [ "$usb_spd" -ge 5000 ]; then
        echo "usb3"
    elif [ "$usb_spd" -le 12 ]; then
        echo "usb1"
    else
        echo "usb2"
    fi
}

get_dev_model() {
    dev="$1"
    if [ "$dev" = "wan" ]; then
        echo "Gigabit Ethernet WAN"
        return
    fi
    ser=$(cat /sys/class/net/$dev/device/../serial 2>/dev/null || cat /sys/class/net/$dev/device/serial 2>/dev/null)
    case "$ser" in
        *RZCW6090G4J*) echo "Samsung Galaxy S21 FE 5G"; return ;;
        *8d7a382466f6*) echo "Xiaomi Mi A3"; return ;;
        *4e1c1cf*) echo "OPPO A37"; return ;;
    esac
    prod=$(cat /sys/class/net/$dev/device/../product 2>/dev/null || cat /sys/class/net/$dev/device/product 2>/dev/null)
    manuf=$(cat /sys/class/net/$dev/device/../manufacturer 2>/dev/null || cat /sys/class/net/$dev/device/manufacturer 2>/dev/null)
    if [ -n "$prod" ]; then
        name="$manuf $prod"
        echo "$name" | sed 's/  */ /g' | sed 's/SAMSUNG SAMSUNG_Android/Samsung Android/g'
    else
        echo "USB Modem ($dev)"
    fi
}

get_gateway() {
    dev="$1"
    # 1. From pre-fetched ubus dump (zero additional socket overhead)
    if [ -n "$UBUS_DUMP" ]; then
        gw=$(echo "$UBUS_DUMP" | jq -r --arg d "$dev" '.interface[] | select(.device == $d or .l3_device == $d) | (.route[]? | select(.target == "0.0.0.0") | .nexthop) // (.inactive.route[]? | select(.target == "0.0.0.0") | .nexthop) // .data.dhcpserver // empty' 2>/dev/null | head -n 1)
        if [ -n "$gw" ] && [ "$gw" != "null" ]; then
            echo "$gw"
            return
        fi
    fi
    # 2. Try direct kernel route lookup
    gw=$(ip route show dev "$dev" 2>/dev/null | awk '/default via/ {print $3}' | head -n 1)
    if [ -n "$gw" ]; then
        echo "$gw"
        return
    fi
    # 3. Try udhcpc lease
    if [ -f "/var/run/udhcpc-$dev.leases" ]; then
        gw=$(awk -F= '/router/ {print $2}' "/var/run/udhcpc-$dev.leases" 2>/dev/null | head -n 1)
        if [ -n "$gw" ]; then
            echo "$gw"
            return
        fi
    fi
    # 4. Fallback: Android standard subnet gateway (.129 or .1)
    ip_addr=$(ip -4 a show dev "$dev" 2>/dev/null | awk '/inet / {print $2}' | awk -F'/' '{print $1}' | head -n 1)
    if [ -n "$ip_addr" ]; then
        prefix=$(echo "$ip_addr" | awk -F. '{print $1"."$2"."$3}')
        if [ "$prefix" = "192.168.42" ]; then
            echo "192.168.42.129"
            return
        fi
        echo "${prefix}.1"
        return
    fi
    echo ""
}

while true; do
    NOW=$(date +%s)
    UBUS_DUMP=$(ubus call network.interface dump 2>/dev/null)
    PREV_TIME=0
    [ -f "$PREV_STATS" ] && PREV_TIME=$(awk '/__TIME__/ {print $2}' "$PREV_STATS")
    TIME_DELTA=$((NOW - PREV_TIME))
    [ "$TIME_DELTA" -le 0 ] && TIME_DELTA=1

    CANDIDATE_DEVS=""

    # Check Ethernet WAN
    if [ -d "/sys/class/net/wan" ]; then
        wan_carrier=$(cat /sys/class/net/wan/carrier 2>/dev/null || echo "0")
        [ "$wan_carrier" = "1" ] && CANDIDATE_DEVS="wan"
    fi

    # Check USB / tether interfaces
    for d in /sys/class/net/usb* /sys/class/net/rndis* /sys/class/net/eth*; do
        [ -d "$d" ] || continue
        iname=$(basename "$d")
        case "$iname" in
            lan*|br-lan|lo|wan) continue ;;
        esac
        CANDIDATE_DEVS="$CANDIDATE_DEVS $iname"
    done
    CANDIDATE_DEVS=$(echo "$CANDIDATE_DEVS" | xargs)

    # Parallel Internet Health Probe (1 probe packet per link, timeout 1s)
    for iface in $CANDIDATE_DEVS; do
        (
            carrier=$(cat /sys/class/net/$iface/carrier 2>/dev/null || echo "0")
            ip_addr=$(ip -4 a show dev "$iface" 2>/dev/null | awk '/inet / {print $2}' | awk -F'/' '{print $1}' | head -n 1)
            gw=$(get_gateway "$iface")
            health="0"
            if [ "$carrier" = "1" ] && [ -n "$ip_addr" ] && [ -n "$gw" ]; then
                tbl_id=100
                case "$iface" in
                    usb0) tbl_id=100 ;;
                    usb1) tbl_id=101 ;;
                    usb2) tbl_id=102 ;;
                    usb3) tbl_id=103 ;;
                    usb4) tbl_id=104 ;;
                    usb5) tbl_id=105 ;;
                    wan)  tbl_id=99 ;;
                esac
                ip route replace default via "$gw" dev "$iface" table $tbl_id 2>/dev/null
                ip rule add from "$ip_addr" table $tbl_id priority $tbl_id 2>/dev/null || true
                if ping -c 1 -W 1 -I "$ip_addr" 1.1.1.1 >/dev/null 2>&1 || ping -c 1 -W 1 -I "$ip_addr" 8.8.8.8 >/dev/null 2>&1; then
                    health="1"
                fi
            fi
            echo "$health" > "/tmp/health_$iface.tmp"
        ) &
    done
    wait

    # Build Links Data & Evaluate Online Gateways
    ONLINE_DEVS=""
    ONLINE_GW_PARTS=""
    SINGLE_GW=""
    SINGLE_DEV=""
    ONLINE_COUNT=0
    TOTAL_SLOTS=0
    LINKS_JSON="["
    first=1

    for iface in $CANDIDATE_DEVS; do
        TOTAL_SLOTS=$((TOTAL_SLOTS + 1))
        carrier=$(cat /sys/class/net/$iface/carrier 2>/dev/null || echo "0")
        ip_addr=$(ip -4 a show dev "$iface" 2>/dev/null | awk '/inet / {print $2}' | awk -F'/' '{print $1}' | head -n 1)
        gw=$(get_gateway "$iface")
        stype=$(get_speed_type "$iface")
        model=$(get_dev_model "$iface")

        health="0"
        [ -f "/tmp/health_$iface.tmp" ] && health=$(cat "/tmp/health_$iface.tmp")

        if [ "$health" = "1" ]; then
            st="CONNECTED"
            ONLINE_COUNT=$((ONLINE_COUNT + 1))
            ONLINE_DEVS="$ONLINE_DEVS $iface"
            
            # Dynamic weighting for proportionate bandwidth aggregation (e.g. 500M 5G + 50M 4G):
            # USB 3.0 / 5G gets weight 5, USB 2.0 / 4G gets weight 1
            weight=1
            if [ "$stype" = "usb3" ] || [ "$stype" = "wan" ]; then
                weight=5
            elif echo "$model" | grep -qi -E 'samsung|5g|nr'; then
                weight=5
            fi

            ONLINE_GW_PARTS="$ONLINE_GW_PARTS nexthop via $gw dev $iface weight $weight"
            SINGLE_GW="$gw"
            SINGLE_DEV="$iface"
        elif [ -n "$ip_addr" ] && [ "$carrier" = "1" ]; then
            st="NO_INTERNET"
            # Purge lingering default routes for no-internet interfaces
            ip route del default via "$gw" dev "$iface" 2>/dev/null
        else
            st="STANDBY"
            ip route del default dev "$iface" 2>/dev/null
        fi

        rx_b=$(cat /sys/class/net/$iface/statistics/rx_bytes 2>/dev/null || echo 0)
        tx_b=$(cat /sys/class/net/$iface/statistics/tx_bytes 2>/dev/null || echo 0)
        tot_b=$((rx_b + tx_b))

        prev_tot=0
        [ -f "$PREV_STATS" ] && prev_tot=$(awk -v dev="$iface" '$1==dev {print $2}' "$PREV_STATS" 2>/dev/null)
        rate_bps=0
        if [ "$prev_tot" -gt 0 ] && [ "$tot_b" -ge "$prev_tot" ]; then
            rate_bps=$(( (tot_b - prev_tot) * 8 / TIME_DELTA ))
        fi
        rate_mbps=$(awk -v r="$rate_bps" 'BEGIN {printf "%.1f", r / 1000000}')

        slot_label="USB"
        [ "$stype" = "usb3" ] && slot_label="USB 3.0"
        [ "$stype" = "usb2" ] && slot_label="USB 2.0"
        [ "$stype" = "wan" ] && slot_label="Gigabit WAN"

        item="{\"id\":\"$iface\",\"slot\":$TOTAL_SLOTS,\"label\":\"$slot_label #$TOTAL_SLOTS\",\"type\":\"$stype\",\"status\":\"$st\",\"model\":\"$model\",\"ip\":\"${ip_addr:---}\",\"gw\":\"${gw:---}\",\"speed_mbps\":$rate_mbps,\"rx_bytes\":$rx_b,\"tx_bytes\":$tx_b}"

        [ "$first" -eq 0 ] && LINKS_JSON="$LINKS_JSON,"
        LINKS_JSON="$LINKS_JSON$item"
        first=0
    done
    LINKS_JSON="$LINKS_JSON]"

    # Record traffic stats for rate calculations
    echo "__TIME__ $NOW" > "$PREV_STATS.new"
    for iface in $CANDIDATE_DEVS; do
        rx_b=$(cat /sys/class/net/$iface/statistics/rx_bytes 2>/dev/null || echo 0)
        tx_b=$(cat /sys/class/net/$iface/statistics/tx_bytes 2>/dev/null || echo 0)
        echo "$iface $((rx_b + tx_b))" >> "$PREV_STATS.new"
    done
    mv "$PREV_STATS.new" "$PREV_STATS"

    # Install / Update Dynamic Route only if state changed
    CURR_SIG=""
    if [ "$ONLINE_COUNT" -gt 1 ]; then
        MODE="ECMP L4 BALANCED"
        CURR_SIG="ECMP:$ONLINE_GW_PARTS"
    elif [ "$ONLINE_COUNT" -eq 1 ]; then
        MODE="FAILOVER SINGLE ACTIVE"
        CURR_SIG="SINGLE:via $SINGLE_GW dev $SINGLE_DEV"
    else
        MODE="OFFLINE"
        CURR_SIG="OFFLINE"
    fi

    PREV_SIG=""
    [ -f "$ACTIVE_SIG_FILE" ] && PREV_SIG=$(cat "$ACTIVE_SIG_FILE" 2>/dev/null)

    # Reapply route only if signature changed or kernel default route is missing
    ROUTE_EXISTS=$(ip route show default 2>/dev/null | grep -E 'nexthop|via')
    if [ "$CURR_SIG" != "$PREV_SIG" ] || [ -z "$ROUTE_EXISTS" ]; then
        if [ "$ONLINE_COUNT" -gt 1 ]; then
            ip route replace default scope global $ONLINE_GW_PARTS 2>/dev/null
        elif [ "$ONLINE_COUNT" -eq 1 ]; then
            ip route replace default scope global via "$SINGLE_GW" dev "$SINGLE_DEV" 2>/dev/null
        fi
        echo "$CURR_SIG" > "$ACTIVE_SIG_FILE"
    fi

    TOTAL_COMBINED_MBPS=$(echo "$LINKS_JSON" | jq '[.[].speed_mbps] | add' 2>/dev/null || echo "0.0")
    [ -z "$TOTAL_COMBINED_MBPS" ] && TOTAL_COMBINED_MBPS=0.0
    TOTAL_COMBINED_MBPS=$(awk -v t="$TOTAL_COMBINED_MBPS" 'BEGIN {printf "%.1f", t}')

    cat << JSON > "$STATUS_FILE.tmp"
{
  "updated_at": $NOW,
  "active_count": $ONLINE_COUNT,
  "total_slots": $TOTAL_SLOTS,
  "mode": "$MODE",
  "combined_speed_mbps": $TOTAL_COMBINED_MBPS,
  "links": $LINKS_JSON
}
JSON
    mv "$STATUS_FILE.tmp" "$STATUS_FILE"

    sleep 2
done
