#!/bin/sh
# ==============================================================================
# MAXNET OS 2-HOUR 5-MINUTE RECURRING HEALTH & KERNEL LOG WATCHDOG DAEMON
# Engineered & Developed by Mahendra Mali - Max (c) 2026
# Donation & Support via UPI: 9824584454@ybl
# ==============================================================================

AUDIT_LOG="/var/log/maxnet_health_audit.log"
WEBHOOK_URL="http://127.0.0.1/cgi-bin/webhooks"
CONF_FILE="/etc/maxnet_webhooks.json"

mkdir -p /var/log

dispatch_alert() {
    title="$1"
    msg="$2"
    level="$3"
    ev_type="$4"

    [ ! -f "$CONF_FILE" ] && return
    m_en=$(jq -r '.master_enabled // false' "$CONF_FILE" 2>/dev/null)
    [ "$m_en" != "true" ] && return

    payload=$(jq -c -n --arg t "$title" --arg m "$msg" --arg l "$level" --arg et "$ev_type" \
        '{action:"dispatch", title:$t, message:$m, level:$l, event_type:$et}')
    
    ( curl -s -m 6 -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1 ) &
}

CYCLE=0
MAX_CYCLES=24  # 24 cycles of 5 minutes = 120 minutes (2 Hours)

log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$AUDIT_LOG"
}

log_msg "=== MAXNET 2-HOUR HEALTH & KERNEL MONITOR STARTED (5-Min Intervals) ==="

while [ "$CYCLE" -lt "$MAX_CYCLES" ]; do
    CYCLE=$((CYCLE + 1))
    TS=$(date '+%Y-%m-%d %H:%M:%S')

    # 1. CPU Utilization & Load Average
    LOAD=$(cat /proc/loadavg | awk '{print $1", "$2", "$3}')
    
    # Calculate CPU % from /proc/stat
    read -r cpu u n s i io irq sirq st _ < /proc/stat
    prev_idle=$i
    prev_total=$((u + n + s + i + io + irq + sirq + st))
    sleep 1
    read -r cpu u n s i io irq sirq st _ < /proc/stat
    curr_idle=$i
    curr_total=$((u + n + s + i + io + irq + sirq + st))
    diff_idle=$((curr_idle - prev_idle))
    diff_total=$((curr_total - prev_total))
    if [ "$diff_total" -gt 0 ]; then
        CPU_USAGE=$((100 * (diff_total - diff_idle) / diff_total))
    else
        CPU_USAGE=0
    fi

    # 2. Memory Utilization
    MEM_TOTAL=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
    MEM_FREE=$(awk '/MemFree/ {print $2}' /proc/meminfo)
    MEM_AVAIL=$(awk '/MemAvailable/ {print $2}' /proc/meminfo 2>/dev/null || echo "$MEM_FREE")
    MEM_USED=$(( (MEM_TOTAL - MEM_AVAIL) * 100 / MEM_TOTAL ))

    # 3. Kernel Log Audit (dmesg)
    DMESG_ERRS=$(dmesg | tail -n 100 | grep -iE 'kernel panic|fatal|oom-killer|segmentation fault|out of memory' | tail -n 5)
    DMESG_WARNS=$(dmesg | tail -n 50 | grep -iE 'warn|error|fail' | grep -v -iE 'loop|link' | tail -n 3)

    # 4. System Log Audit (logread)
    LOGREAD_ERRS=$(logread | tail -n 100 | grep -iE 'syntax error|crash|terminated abnormally|bad substitution' | tail -n 5)

    # 5. Core Services Health Check
    PROC_UHTTPD=$(pgrep uhttpd >/dev/null && echo "OK" || echo "DOWN")
    PROC_MONITOR=$(pgrep -f maxnet_alert_monitor.sh >/dev/null && echo "OK" || echo "DOWN")
    PROC_DNSMASQ=$(pgrep dnsmasq >/dev/null && echo "OK" || echo "DOWN")

    # 6. Physical Port Carriers
    CARRIER_LAN=""
    for p in /sys/class/net/lan*; do
        [ -d "$p" ] || continue
        pname=$(basename "$p")
        cstate=$(cat "$p/carrier" 2>/dev/null || echo 0)
        CARRIER_LAN="$CARRIER_LAN $pname:$cstate"
    done

    # Write audit block
    cat << EOF >> "$AUDIT_LOG"
--------------------------------------------------------------------------------
[CYCLE $CYCLE / $MAX_CYCLES] - $TS
CPU Usage: ${CPU_USAGE}% | Load: $LOAD | RAM Used: ${MEM_USED}% (${MEM_AVAIL}kB free)
Core Daemons: uhttpd=$PROC_UHTTPD, alert_monitor=$PROC_MONITOR, dnsmasq=$PROC_DNSMASQ
LAN Carriers: $CARRIER_LAN
Kernel Errors: ${DMESG_ERRS:-None detected}
Kernel Warnings: ${DMESG_WARNS:-None detected}
System Log Errors: ${LOGREAD_ERRS:-None detected}
--------------------------------------------------------------------------------
EOF

    # Anomaly Detection & Webhook Triggers
    if [ "$CPU_USAGE" -gt 45 ]; then
        dispatch_alert "CPU Spike Detected (${CPU_USAGE}%)" "MAXNET CPU spike at ${CPU_USAGE}%. Load: ${LOAD}. System under high load." "warning" "cpu_spike"
    fi

    if [ -n "$DMESG_ERRS" ]; then
        dispatch_alert "Kernel Anomaly Detected" "Kernel log report: ${DMESG_ERRS}" "danger" "system_error"
    fi

    if [ "$PROC_UHTTPD" = "DOWN" ] || [ "$PROC_MONITOR" = "DOWN" ]; then
        dispatch_alert "Core Daemon Down" "Service failure detected: uhttpd=$PROC_UHTTPD, monitor=$PROC_MONITOR" "danger" "system_error"
    fi

    # Wait 300s (5 minutes) for next cycle, minus the 1s sleep in CPU calculation
    if [ "$CYCLE" -lt "$MAX_CYCLES" ]; then
        sleep 299
    fi
done

log_msg "=== 2-HOUR AUDIT COMPLETE: 24 CYCLES (100% SUCCESSFUL) ==="
EOF
