#!/bin/sh
# MAXNET Automated Crash Loop & Fallback Recovery Guard
# Intercepts boot failures, counts consecutive reboots, and automatically triggers
# failsafe recovery mode if an unhandled panic/watchdog NOC error occurs.

do_boot_recovery() {
	local bc=0
	if command -v fw_printenv >/dev/null 2>&1; then
		bc=$(fw_printenv bootcount 2>/dev/null | awk -F= '{print $2}')
	fi
	[ -z "$bc" ] && bc=0

	# Guard against non-numeric values
	case "$bc" in
		''|*[!0-9]*) bc=0 ;;
	esac

	# Trigger fallback if router failed to boot 3 times in a row
	if [ "$bc" -ge 3 ]; then
		echo "==========================================================" > /dev/kmsg 2>/dev/null || true
		echo "CRITICAL: BOOT CRASH LOOP DETECTED (count=$bc)!" > /dev/kmsg 2>/dev/null || true
		echo "AUTOMATIC FALLBACK RECOVERY ACTIVATED!" > /dev/kmsg 2>/dev/null || true
		echo "==========================================================" > /dev/kmsg 2>/dev/null || true

		# Reset bootcount to prevent infinite lock
		command -v fw_setenv >/dev/null 2>&1 && fw_setenv bootcount 0 2>/dev/null || true

		# Force OpenWrt failsafe mode
		export FAILSAFE=true
		touch /tmp/failsafe
		touch /tmp/failsafe_recovery_triggered

		# Flash LED indicator
		for p in /sys/class/leds/*red*/brightness; do
			[ -w "$p" ] && echo 1 > "$p" 2>/dev/null || true
		done
		return 0
	fi

	# Increment bootcount for current boot attempt
	local next_bc=$((bc + 1))
	if command -v fw_setenv >/dev/null 2>&1; then
		fw_setenv bootcount "$next_bc" 2>/dev/null || true
	fi
	echo "MAXNET Recovery Guard: bootcount=$next_bc (threshold=3)" > /dev/kmsg 2>/dev/null || true
}

boot_hook_add preinit_main do_boot_recovery
