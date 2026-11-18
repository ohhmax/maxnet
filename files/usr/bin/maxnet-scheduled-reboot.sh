#!/bin/sh
# Daily reboot scheduler; only acts on explicit persistent UCI enablement.
run_scheduled_reboot_check() {
    ENABLED=$(uci -q get system.maxnet_settings.auto_reboot_enabled)
    REBOOT_TIME=$(uci -q get system.maxnet_settings.auto_reboot_time)
    [ "$ENABLED" = 1 ] || return 0
    printf '%s' "$REBOOT_TIME" | grep -Eq '^([01][0-9]|2[0-3]):[0-5][0-9]$' || return 0

    NOW=$(date '+%H:%M' 2>/dev/null)
    TODAY=$(date '+%Y-%m-%d' 2>/dev/null)
    MARKER=/etc/maxnet_auto_reboot_last_date
    LAST=$(cat "$MARKER" 2>/dev/null)
    if [ "$NOW" = "$REBOOT_TIME" ] && [ "$LAST" != "$TODAY" ]; then
        printf '%s\n' "$TODAY" > "$MARKER" || return 1
        logger -t maxnet-scheduled-reboot "Executing configured daily reboot at $REBOOT_TIME"
        sync
        /sbin/reboot
    fi
}

if [ "${1:-}" = --check ]; then
    run_scheduled_reboot_check
    exit $?
fi

while :; do
    run_scheduled_reboot_check
    sleep 15
done
