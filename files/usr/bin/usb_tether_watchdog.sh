#!/bin/sh
# USB 3.0 Tethering Self-Healing Watchdog (Intelligent State Guard & High-Speed Protocol Orchestrator)
export HOME=/root
export ADB_MDNS_OPENSCREEN=0

FAIL_COUNT=0

while true; do
    sleep 10

    # If no USB tether interface (usb0, ncm0) and no ADB device connected, skip recovery!
    if ! ifconfig usb0 >/dev/null 2>&1 && ! ifconfig ncm0 >/dev/null 2>&1 && ! adb devices 2>/dev/null | grep -q "device$"; then
        FAIL_COUNT=0
        continue
    fi

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

        # Try DHCP lease renewal first if interface exists
        if ifconfig "$TETH_IF" >/dev/null 2>&1; then
            ethtool -K "$TETH_IF" gro on 2>/dev/null || true
            ifconfig "$TETH_IF" txqueuelen 10000 2>/dev/null || true
            ifup wan_usb
            sleep 4
            if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
                logger -t usb_watchdog "Recovered via ifup wan_usb"
                FAIL_COUNT=0
                continue
            fi
        fi

        # Check phone status via ADB
        if adb devices 2>/dev/null | grep -q "device$"; then
            USB_STATE=$(adb shell getprop sys.usb.state 2>/dev/null)
            logger -t usb_watchdog "Phone ADB detected. sys.usb.state: $USB_STATE"

            case "$USB_STATE" in
                *rndis*|*ncm*)
                    logger -t usb_watchdog "Tethering protocol active on handset ($USB_STATE). Refreshing interface..."
                    ifup wan_usb
                    ;;
                *)
                    # Check USB port speed standard (>=5000 is USB 3.0 SuperSpeed)
                    USB_SPEED=$(cat /sys/bus/usb/devices/*-*/speed 2>/dev/null | sort -n | tail -n 1)
                    CONF_PROTO=$(uci -q get usb_wan.global.tether_proto)
                    if [ -z "$CONF_PROTO" ]; then
                        if [ -n "$USB_SPEED" ] && [ "$USB_SPEED" -ge 5000 ] 2>/dev/null; then
                            CONF_PROTO="ncm"
                        else
                            CONF_PROTO="rndis"
                        fi
                    fi

                    logger -t usb_watchdog "Enabling USB tethering (speed: ${USB_SPEED}M, preferred proto: $CONF_PROTO)..."
                    adb shell svc power stayon true 2>/dev/null || true
                    adb shell settings put global stay_on_while_plugged_in 7 2>/dev/null || true
                    adb shell dumpsys deviceidle disable 2>/dev/null || true
                    adb shell settings put global tether_offload_disabled 0 2>/dev/null || true

                    NCM_ACTIVE=0
                    if [ "$CONF_PROTO" = "ncm" ]; then
                        logger -t usb_watchdog "Attempting high-speed CDC-NCM tethering mode via svc usb..."
                        adb shell svc usb setFunctions ncm >/dev/null 2>&1
                        sleep 3
                        NEW_STATE=$(adb shell getprop sys.usb.state 2>/dev/null)
                        case "$NEW_STATE" in
                            *ncm*)
                                for check in 1 2 3; do
                                    if ifconfig usb0 >/dev/null 2>&1 || ifconfig ncm0 >/dev/null 2>&1; then
                                        ifup wan_usb 2>/dev/null || true
                                        sleep 1
                                        if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
                                            logger -t usb_watchdog "High-speed CDC-NCM link active and verified."
                                            NCM_ACTIVE=1
                                            break
                                        fi
                                    fi
                                    sleep 1
                                done
                                ;;
                        esac
                    fi

                    # If NCM was not preferred or handset lacks NCM IpServer, establish high-speed optimized RNDIS
                    if [ "$NCM_ACTIVE" -eq 0 ]; then
                        [ "$CONF_PROTO" = "ncm" ] && logger -t usb_watchdog "Handset requires RNDIS tethering mode. Activating high-speed RNDIS..."
                        adb shell svc usb setFunctions rndis >/dev/null 2>&1 || true
                        adb shell am force-stop com.android.settings >/dev/null 2>&1
                        adb shell input keyevent 224 >/dev/null 2>&1
                        adb shell am start -a android.settings.TETHER_SETTINGS >/dev/null 2>&1
                        sleep 2
                        adb shell input tap 931 873
                        sleep 2
                        CHECK_STATE=$(adb shell getprop sys.usb.state 2>/dev/null)
                        case "$CHECK_STATE" in
                            *rndis*) ;;
                            *)
                                adb shell input tap 540 873
                                sleep 2
                                ;;
                        esac
                    fi
                    ifup wan_usb
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
