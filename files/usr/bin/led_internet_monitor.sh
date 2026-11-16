#!/bin/sh
# MAXNET OS LED Internet Monitor
# Red: Boot/Error | Blue Blink: Awaiting Uplink | Green: Internet Online

CONF_FILE="/etc/maxnet_hardware.json"

find_led_path() {
    local color="$1"
    for p in /sys/class/leds/${color}:status /sys/class/leds/*${color}* /sys/class/leds/led-${color}; do
        if [ -d "$p" ]; then
            echo "$p"
            return 0
        fi
    done
    return 1
}

LED_GREEN=$(find_led_path "green")
LED_BLUE=$(find_led_path "blue")
LED_RED=$(find_led_path "red")

set_led_mode() {
    local p="$1"
    local mode="$2"
    [ -z "$p" ] || [ ! -d "$p" ] && return

    case "$mode" in
        on|solid)
            echo none > "$p/trigger" 2>/dev/null
            echo 1 > "$p/brightness" 2>/dev/null
            ;;
        off|none)
            echo none > "$p/trigger" 2>/dev/null
            echo 0 > "$p/brightness" 2>/dev/null
            ;;
        blink|timer)
            echo timer > "$p/trigger" 2>/dev/null
            echo 500 > "$p/delay_on" 2>/dev/null
            echo 500 > "$p/delay_off" 2>/dev/null
            ;;
        heartbeat)
            echo heartbeat > "$p/trigger" 2>/dev/null
            ;;
    esac
}

led_state_online() {
    set_led_mode "$LED_RED" off
    set_led_mode "$LED_BLUE" off
    set_led_mode "$LED_GREEN" on
}

led_state_waiting() {
    set_led_mode "$LED_RED" off
    set_led_mode "$LED_GREEN" off
    set_led_mode "$LED_BLUE" blink
}

led_state_error() {
    set_led_mode "$LED_GREEN" off
    set_led_mode "$LED_BLUE" off
    set_led_mode "$LED_RED" on
}

apply_manual_leds() {
    [ ! -f "$CONF_FILE" ] && return
    R_TRIG=$(jq -r '.led_manual.red // "none"' "$CONF_FILE" 2>/dev/null)
    G_TRIG=$(jq -r '.led_manual.green // "none"' "$CONF_FILE" 2>/dev/null)
    B_TRIG=$(jq -r '.led_manual.blue // "none"' "$CONF_FILE" 2>/dev/null)

    set_led_mode "$LED_RED" "$R_TRIG"
    set_led_mode "$LED_GREEN" "$G_TRIG"
    set_led_mode "$LED_BLUE" "$B_TRIG"
}

check_connectivity() {
    # 1. Check if default gateway interface exists
    if ! ip route show default 2>/dev/null | grep -q default; then
        return 1
    fi

    # 2. Multilink daemon status if active
    if [ -f "/tmp/multilink_status.json" ]; then
        if grep -q '"active_count": [1-9]' "/tmp/multilink_status.json" 2>/dev/null; then
            return 0
        fi
    fi

    # 3. Probe DNS endpoints (1s timeout)
    if ping -c 1 -W 1 -q 1.1.1.1 >/dev/null 2>&1 || ping -c 1 -W 1 -q 8.8.8.8 >/dev/null 2>&1; then
        return 0
    fi

    return 1
}

# Initial State: Blue Blinking (Awaiting Internet)
led_state_waiting

FAIL_COUNT=0
MAX_FAIL=3

while true; do
    [ -z "$LED_GREEN" ] && LED_GREEN=$(find_led_path "green")
    [ -z "$LED_BLUE" ] && LED_BLUE=$(find_led_path "blue")
    [ -z "$LED_RED" ] && LED_RED=$(find_led_path "red")

    LED_AUTO=true
    [ -f "$CONF_FILE" ] && LED_AUTO=$(jq -r '.led_auto // true' "$CONF_FILE" 2>/dev/null)

    if [ "$LED_AUTO" = "false" ]; then
        apply_manual_leds
    else
        if check_connectivity; then
            FAIL_COUNT=0
            led_state_online
        else
            FAIL_COUNT=$((FAIL_COUNT + 1))
            if [ "$FAIL_COUNT" -ge "$MAX_FAIL" ]; then
                led_state_error
            else
                led_state_waiting
            fi
        fi
    fi

    sleep 5
done
