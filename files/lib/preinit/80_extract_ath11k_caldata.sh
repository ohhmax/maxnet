#!/bin/sh

do_extract_ath11k_caldata() {
	. /lib/functions.sh

	local art=""
	if command -v find_mtd_chardev >/dev/null 2>&1; then
		art=$(find_mtd_chardev "0:ART")
	fi
	[ -z "$art" ] && [ -c /dev/mtd20ro ] && art="/dev/mtd20ro"
	[ -z "$art" ] && [ -e /dev/mtd20 ] && art="/dev/mtd20"
	[ -z "$art" ] && return 0

	mkdir -p /lib/firmware/ath11k/IPQ9574/hw1.0
	mkdir -p /lib/firmware/ath11k/QCN9074/hw1.0

	# 2.4 GHz IPQ9574 AHB calibration data at offset 0x1000 (128 KB)
	if [ ! -s /lib/firmware/ath11k/IPQ9574/hw1.0/cal-ahb-c000000.wifi.bin ]; then
		dd if=$art of=/lib/firmware/ath11k/IPQ9574/hw1.0/cal-ahb-c000000.wifi.bin bs=4096 skip=1 count=32 2>/dev/null
	fi

	# 5 GHz QCN9074 PCIe calibration data at offset 0x4c000 (128 KB)
	if [ ! -s /lib/firmware/ath11k/QCN9074/hw1.0/cal-pci-0001:01:00.0.bin ]; then
		dd if=$art of=/lib/firmware/ath11k/QCN9074/hw1.0/cal-pci-0001:01:00.0.bin bs=4096 skip=76 count=32 2>/dev/null
	fi

	# Create variant aliases for all board naming conventions
	for b in "jio,jidu6811" "jio,jidu6911" "jio,jidu6611" "jio,jidu6411" "jio,jidu6111" \
	         "jiorouter,ax6000-jidu6j11-6811" "jiorouter,ax6000-jidu6j11-6911" \
	         "jiorouter,ax6000-jidu6j11-6611" "jiorouter,ax6000-jidu6j11-6411" \
	         "jiorouter,ax6000-jidu6j11-6111" "JIDU6J11-6811" "JIDU6J11-6911"; do
		ln -sf cal-ahb-c000000.wifi.bin "/lib/firmware/ath11k/IPQ9574/hw1.0/cal-ahb-c000000.wifi-${b}.bin" 2>/dev/null || true
		ln -sf cal-pci-0001:01:00.0.bin "/lib/firmware/ath11k/QCN9074/hw1.0/cal-pci-0001:01:00.0-${b}.bin" 2>/dev/null || true
	done

	# Mount 0:BDF if bdwlan board data files missing
	local bdf=""
	if command -v find_mtd_part >/dev/null 2>&1; then
		bdf=$(find_mtd_part "0:BDF")
	fi
	[ -z "$bdf" ] && [ -b /dev/mtdblock26 ] && bdf="/dev/mtdblock26"
	if [ -n "$bdf" ] && [ ! -s /lib/firmware/ath11k/IPQ9574/hw1.0/board.bin ]; then
		mkdir -p /tmp/bdf_mnt
		if mount -t squashfs -o ro "$bdf" /tmp/bdf_mnt 2>/dev/null; then
			[ -f /tmp/bdf_mnt/IPQ9574/bdwlan.b30 ] && cp /tmp/bdf_mnt/IPQ9574/bdwlan.b30 /lib/firmware/ath11k/IPQ9574/hw1.0/board.bin 2>/dev/null
			[ -f /tmp/bdf_mnt/qcn9000/bdwlan.bb7 ] && cp /tmp/bdf_mnt/qcn9000/bdwlan.bb7 /lib/firmware/ath11k/QCN9074/hw1.0/board.bin 2>/dev/null
			umount /tmp/bdf_mnt 2>/dev/null || true
		fi
		rmdir /tmp/bdf_mnt 2>/dev/null || true
	fi

	# Ensure board-2.bin aliases exist
	[ -f /lib/firmware/ath11k/IPQ9574/hw1.0/board.bin ] && ln -sf board.bin /lib/firmware/ath11k/IPQ9574/hw1.0/board-2.bin 2>/dev/null || true
	[ -f /lib/firmware/ath11k/QCN9074/hw1.0/board.bin ] && [ ! -f /lib/firmware/ath11k/QCN9074/hw1.0/board-2.bin ] && ln -sf board.bin /lib/firmware/ath11k/QCN9074/hw1.0/board-2.bin 2>/dev/null || true

	# Cross-symlink /lib/firmware/IPQ9574 <-> /lib/firmware/ath11k/IPQ9574/hw1.0
	if [ -d /lib/firmware/IPQ9574 ]; then
		for f in /lib/firmware/IPQ9574/*; do
			[ -f "$f" ] && ln -sf "$f" "/lib/firmware/ath11k/IPQ9574/hw1.0/$(basename "$f")" 2>/dev/null || true
		done
		ln -sf /lib/firmware/ath11k/IPQ9574/hw1.0 /lib/firmware/IPQ9574/hw1.0 2>/dev/null || true
		ln -sf /lib/firmware/ath11k/IPQ9574/hw1.0/board.bin /lib/firmware/IPQ9574/board.bin 2>/dev/null || true
	fi
}

type boot_hook_add >/dev/null 2>&1 && boot_hook_add preinit_main do_extract_ath11k_caldata
