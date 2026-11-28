#!/bin/sh
# USB 3.0 Tethering Self-Healing Watchdog (Intelligent State Guard & High-Speed Protocol Orchestrator)
export HOME=/root
export ADB_MDNS_OPENSCREEN=0

FAIL_COUNT=0
LAST_V6_SOLICIT=0

ensure_usb_ipv6() {
    local _if
    for _if in usb0 usb1 usb2 usb3 usb4 usb5 ncm0; do
        [ -d "/sys/class/net/$_if" ] || continue
        [ "$(cat /sys/class/net/$_if/carrier 2>/dev/null || echo 0)" = "1" ] || continue
        if [ "$(cat /proc/sys/net/ipv6/conf/$_if/accept_ra 2>/dev/null || echo 0)" != "2" ]; then
            sysctl -w "net.ipv6.conf.$_if.disable_ipv6=0" >/dev/null 2>&1 || true
            sysctl -w "net.ipv6.conf.$_if.accept_ra=2" >/dev/null 2>&1 || true
            sysctl -w "net.ipv6.conf.$_if.accept_ra_defrtr=1" >/dev/null 2>&1 || true
            sysctl -w "net.ipv6.conf.$_if.accept_ra_pinfo=1" >/dev/null 2>&1 || true
            sysctl -w "net.ipv6.conf.$_if.router_solicitations=3" >/dev/null 2>&1 || true
            ip link set "$_if" allmulticast on 2>/dev/null || true
            logger -t usb_watchdog "Restored accept_ra=2 on $_if"
        fi
        if ! ip -6 route show dev "$_if" 2>/dev/null | grep -q '^default'; then
            now_s=$(date +%s 2>/dev/null || echo 0)
            if [ $((now_s - LAST_V6_SOLICIT)) -ge 45 ]; then
                LAST_V6_SOLICIT="$now_s"
                logger -t usb_watchdog "No IPv6 default route on $_if; soliciting router advertisement..."
                sysctl -w "net.ipv6.conf.$_if.disable_ipv6=1" >/dev/null 2>&1 || true
                sysctl -w "net.ipv6.conf.$_if.disable_ipv6=0" >/dev/null 2>&1 || true
                sysctl -w "net.ipv6.conf.$_if.accept_ra=2" >/dev/null 2>&1 || true
                sysctl -w "net.ipv6.conf.$_if.accept_ra_defrtr=1" >/dev/null 2>&1 || true
                sysctl -w "net.ipv6.conf.$_if.accept_ra_pinfo=1" >/dev/null 2>&1 || true
                sysctl -w "net.ipv6.conf.$_if.router_solicitations=3" >/dev/null 2>&1 || true
                ip link set "$_if" allmulticast on 2>/dev/null || true
            fi
        fi
    done
}

while true; do
    sleep 10

    # If no USB tether interface (usb0, ncm0) and no ADB device connected, skip recovery!
    if ! ifconfig usb0 >/dev/null 2>&1 && ! ifconfig ncm0 >/dev/null 2>&1 && ! adb devices 2>/dev/null | grep -q "device$"; then
        FAIL_COUNT=0
        continue
    fi

    # Keep IPv6 RA / default route alive continuously across carrier/netifd transitions
    ensure_usb_ipv6

    # 1. Check if external internet is alive
    if ping -c 2 -W 3 8.8.8.8 >/dev/null 2>&1; then
        FAIL_COUNT=0
        continue
    fi

    # 2. Check if local phone gateway is alive (from ip route)
    GW=$(ip route show default dev usb0 2>/dev/null | awk '{print $3}' | head -n 1)
    [ -z "$GW" ] && GW=$(ip route show default dev ncm0 2>/dev/null | awk '{print $3}' | head -n 1)
    if [ -n "$GW" ] && ping -c 1 -W 2 "$GW" >/dev/null 2>&1; then
        # USB link to phone is healthy; WAN cellular is just temporarily latent/busy
        FAIL_COUNT=0
        continue
    fi

    FAIL_COUNT=$((FAIL_COUNT + 1))
    logger -t usb_watchdog "Gateway/Internet ping failed (fail count: $FAIL_COUNT)"

    # Require 2 consecutive failures (~20s) before taking recovery actions
    if [ "$FAIL_COUNT" -ge 2 ]; then
        logger -t usb_watchdog "Link genuinely down, initiating recovery..."

        # Determine active or available tether interface
        TETH_IF="usb0"
        ifconfig ncm0 >/dev/null 2>&1 && TETH_IF="ncm0"

        # Detect wedged USB3 rndis_host / cdc_ncm TX watchdog stall before retrying DHCP
        USB_BUS_NODE=$(readlink -f "/sys/class/net/$TETH_IF/device/../.." 2>/dev/null)
        TETH_GW=$(ip -4 route show dev "$TETH_IF" 2>/dev/null | awk '/^default/{print $3; exit}')
        TETH_HAS_IP=$(ip -4 -o addr show dev "$TETH_IF" 2>/dev/null | awk 'NR==1{print $4}')
        TETH_CARRIER=$(cat "/sys/class/net/$TETH_IF/carrier" 2>/dev/null || echo 0)

        if [ -n "$USB_BUS_NODE" ] && [ -f "$USB_BUS_NODE/authorized" ]; then
            if dmesg 2>/dev/null | tail -n 30 | grep -qE "${TETH_IF}: NETDEV WATCHDOG: transmit queue|xhci-hcd.*(ERROR|timed out)"; then
                if [ -z "$TETH_GW" ] || ! ping -c 1 -W 2 "$TETH_GW" >/dev/null 2>&1; then
                    logger -t usb_watchdog "Detected kernel USB TX stall on $TETH_IF; power-cycling USB endpoint authorization..."
                    echo 0 > "$USB_BUS_NODE/authorized" 2>/dev/null
                    sleep 2
                    echo 1 > "$USB_BUS_NODE/authorized" 2>/dev/null
                    sleep 8
                    ifup wan_usb 2>/dev/null
                    sleep 10
                    if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1 || ping -c 1 -W 2 1.1.1.1 >/dev/null 2>&1; then
                        logger -t usb_watchdog "Recovered from TX stall via USB re-authorization"
                        FAIL_COUNT=0
                        continue
                    fi
                fi
            fi
        fi

        # Only renew DHCP if interface has carrier; avoid killing an in-progress udhcpc every 4s
        if ifconfig "$TETH_IF" >/dev/null 2>&1; then
            ethtool -K "$TETH_IF" gro on 2>/dev/null || true
            ip link set dev "$TETH_IF" txqueuelen 1000 2>/dev/null || true
            if [ "$TETH_CARRIER" = "1" ] && [ -n "$TETH_GW" ] && ping -c 1 -W 2 "$TETH_GW" >/dev/null 2>&1; then
                logger -t usb_watchdog "Phone gateway $TETH_GW is reachable on $TETH_IF; cellular uplink settling, skipping WAN teardown."
                if ping -c 1 -W 3 8.8.8.8 >/dev/null 2>&1 || ping -c 1 -W 3 1.1.1.1 >/dev/null 2>&1; then
                    FAIL_COUNT=0
                    continue
                fi
            elif [ "$TETH_CARRIER" = "1" ]; then
                if pgrep -f "udhcpc.*-i $TETH_IF" >/dev/null 2>&1 && [ -z "$TETH_HAS_IP" ]; then
                    logger -t usb_watchdog "Waiting 8s for active udhcpc DHCP lease on $TETH_IF..."
                    sleep 8
                else
                    ifup wan_usb
                    sleep 10
                fi
                if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1 || ping -c 1 -W 2 1.1.1.1 >/dev/null 2>&1; then
                    logger -t usb_watchdog "Recovered via DHCP on wan_usb"
                    FAIL_COUNT=0
                    continue
                fi
            fi
        fi

        # Check phone status via ADB
        if adb devices 2>/dev/null | grep -q "device$"; then
            ADB_SER=$(adb get-serialno 2>/dev/null | tr -d '\r\n ')
            [ -z "$ADB_SER" ] && ADB_SER="default"
            USB_STATE=$(adb shell getprop sys.usb.state 2>/dev/null | tr -d '\r\n ')
            TETH_DUMP=$(adb shell dumpsys tethering 2>/dev/null)
            CONF_PROTO=$(uci -q get usb_wan.global.tether_proto || echo "ncm")
            TARGET_PROTO="rndis"
            if [ "$CONF_PROTO" = "ncm" ] || [ "$CONF_PROTO" = "auto" ]; then
                if echo "$TETH_DUMP" | grep -q "tetherableNcmRegexs: \[\]" || [ -f "/tmp/usb_ncm_unsupported_${ADB_SER}" ]; then
                    TARGET_PROTO="rndis"
                    if [ ! -f "/tmp/usb_ncm_unsupported_${ADB_SER}" ]; then
                        touch "/tmp/usb_ncm_unsupported_${ADB_SER}"
                        logger -t usb_watchdog "Handset $ADB_SER reports tetherableNcmRegexs: []; using USB 3.0 SuperSpeed RNDIS"
                    fi
                else
                    TARGET_PROTO="ncm"
                fi
            fi
            TETH_ACTIVE=0
            echo "$TETH_DUMP" | grep -qE "(rndis|ncm|usb)[0-9]+ - TetheredState" && TETH_ACTIVE=1
            logger -t usb_watchdog "Phone ADB detected ($ADB_SER). sys.usb.state=$USB_STATE tethered=$TETH_ACTIVE target=$TARGET_PROTO"

            case "$USB_STATE" in
                *rndis*|*ncm*)
                    if [ "$TETH_ACTIVE" -eq 1 ] && [ "$(cat /sys/class/net/$TETH_IF/carrier 2>/dev/null || echo 0)" = "1" ]; then
                        if [ "$TARGET_PROTO" = "ncm" ] && ! echo "$USB_STATE" | grep -q "ncm"; then
                            logger -t usb_watchdog "Upgrading active USB 3.0 tether from RNDIS to high-speed CDC-NCM..."
                            adb shell svc usb setFunctions ncm 2>/dev/null
                            sleep 6
                            if [ "$(cat /sys/class/net/$TETH_IF/carrier 2>/dev/null || echo 0)" != "1" ]; then
                                logger -t usb_watchdog "CDC-NCM had no carrier on $ADB_SER; reverting to SuperSpeed RNDIS"
                                touch "/tmp/usb_ncm_unsupported_${ADB_SER}"
                                adb shell svc usb setFunctions rndis 2>/dev/null
                                sleep 6
                            fi
                        fi
                        if ! ip -4 -o addr show dev "$TETH_IF" >/dev/null 2>&1 || [ -z "$(ip -4 -o addr show dev "$TETH_IF" 2>/dev/null)" ]; then
                            ifup wan_usb
                            sleep 10
                        fi
                    else
                        logger -t usb_watchdog "USB function $USB_STATE active without TetheredState/carrier (post-reboot deadlock); re-arming $TARGET_PROTO..."
                        adb shell svc power stayon true 2>/dev/null || true
                        adb shell settings put global stay_on_while_plugged_in 7 2>/dev/null || true
                        adb shell settings put global tether_offload_disabled 0 2>/dev/null || true
                        adb shell "svc usb setFunctions $TARGET_PROTO; am start -a android.settings.TETHER_SETTINGS" >/dev/null 2>&1
                        sleep 5
                        if ! adb shell dumpsys tethering 2>/dev/null | grep -qE "(rndis|ncm|usb)[0-9]+ - TetheredState"; then
                            adb shell "input keyevent 224; am start -a android.settings.TETHER_SETTINGS; sleep 2; input tap 931 873; sleep 1" >/dev/null 2>&1
                            if ! adb shell dumpsys tethering 2>/dev/null | grep -qE "(rndis|ncm|usb)[0-9]+ - TetheredState"; then
                                adb shell "input tap 540 873" >/dev/null 2>&1
                            fi
                            sleep 4
                        fi
                        if [ "$TARGET_PROTO" = "ncm" ] && [ "$(cat /sys/class/net/$TETH_IF/carrier 2>/dev/null || echo 0)" != "1" ]; then
                            logger -t usb_watchdog "CDC-NCM did not establish carrier on $ADB_SER; falling back to SuperSpeed RNDIS"
                            touch "/tmp/usb_ncm_unsupported_${ADB_SER}"
                            adb shell "svc usb setFunctions rndis; am start -a android.settings.TETHER_SETTINGS" >/dev/null 2>&1
                            sleep 6
                        fi
                        ifup wan_usb
                        sleep 10
                    fi
                    ;;
                *)
                    logger -t usb_watchdog "No tethering USB function active ($USB_STATE); starting $TARGET_PROTO..."
                    adb shell svc power stayon true 2>/dev/null || true
                    adb shell settings put global stay_on_while_plugged_in 7 2>/dev/null || true
                    adb shell dumpsys deviceidle disable 2>/dev/null || true
                    adb shell settings put global tether_offload_disabled 0 2>/dev/null || true
                    adb shell "svc usb setFunctions $TARGET_PROTO; am start -a android.settings.TETHER_SETTINGS" >/dev/null 2>&1
                    sleep 5
                    if ! adb shell dumpsys tethering 2>/dev/null | grep -qE "(rndis|ncm|usb)[0-9]+ - TetheredState"; then
                        adb shell "am force-stop com.android.settings; input keyevent 224; am start -a android.settings.TETHER_SETTINGS; sleep 2; input tap 931 873; sleep 1" >/dev/null 2>&1
                        if ! adb shell dumpsys tethering 2>/dev/null | grep -qE "(rndis|ncm|usb)[0-9]+ - TetheredState"; then
                            adb shell "input tap 540 873" >/dev/null 2>&1
                        fi
                        sleep 4
                    fi
                    if [ "$TARGET_PROTO" = "ncm" ] && [ "$(cat /sys/class/net/$TETH_IF/carrier 2>/dev/null || echo 0)" != "1" ]; then
                        touch "/tmp/usb_ncm_unsupported_${ADB_SER}"
                        adb shell "svc usb setFunctions rndis; am start -a android.settings.TETHER_SETTINGS" >/dev/null 2>&1
                        sleep 6
                    fi
                    ifup wan_usb
                    sleep 10
                    ;;
            esac
        fi

        # If still down after soft recovery, perform USB bus rebind ONLY if no interface exists AND NO ADB handset is physically attached
        HAS_ANY_DEV=$(adb devices 2>/dev/null | tail -n +2 | grep -v '^$' | wc -l)
        if ! ifconfig usb0 >/dev/null 2>&1 && ! ifconfig ncm0 >/dev/null 2>&1 && [ "$HAS_ANY_DEV" -eq 0 ]; then
            logger -t usb_watchdog "No USB tethering interface and no ADB device detected. Attempting USB bus recovery..."
            for usbdev in /sys/bus/usb/drivers/usb/*-*; do
                [ -d "$usbdev" ] || continue
                dname=$(basename "$usbdev")
                logger -t usb_watchdog "Rebinding USB device $dname"
                echo "$dname" > /sys/bus/usb/drivers/usb/unbind 2>/dev/null || true
                sleep 1
                echo "$dname" > /sys/bus/usb/drivers/usb/bind 2>/dev/null || true
            done
            sleep 3
            ifup wan_usb
        fi

        FAIL_COUNT=0
        sleep 10
    fi
done
