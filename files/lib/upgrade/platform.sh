PART_NAME=firmware
REQUIRE_IMAGE_METADATA=1

RAMFS_COPY_BIN='fw_printenv fw_setenv head'
RAMFS_COPY_DATA='/etc/fw_env.config /var/lock/fw_printenv.lock'

jidu_initial_setup()
{
	[ "$(rootfs_type)" = "tmpfs" ] || return 0

	local mtdnum="$(find_mtd_index 0:APPSBLENV)"
	if [ ! "$mtdnum" ]; then
		return 0
	fi

	echo "/dev/mtd$mtdnum 0x0 0x40000 0x20000" > /etc/fw_env.config

	# Program U-Boot environment for OpenWrt UBI boot
	fw_setenv mtdids 'nand0=nand0' 2>/dev/null || true
	fw_setenv mtdparts 'mtdparts=nand0:0xe100000@0x1700000(ubi)' 2>/dev/null || true
	fw_setenv bootcmd 'ubi part ubi; ubi read 0x44000000 kernel; bootm 0x44000000' 2>/dev/null || true
	fw_setenv bootargs 'console=ttyMSM0,115200n8 ubi.mtd=ubi root=/dev/ubiblock0_1 rootfstype=squashfs' 2>/dev/null || true
}

platform_pre_upgrade() {
	return 0
}

platform_do_upgrade() {
	local board=$(board_name)

	case "$board" in
	jio,jidu6*|jiorouter,ax6000-jidu6*|*jidu6*)
		jidu_initial_setup
		CI_UBIPART="ubi"
		nand_do_upgrade "$1"
		;;
	*)
		if grep -q '"ubi"' /proc/mtd 2>/dev/null; then
			CI_UBIPART="ubi"
			nand_do_upgrade "$1"
		else
			default_do_upgrade "$1"
		fi
		;;
	esac
}

platform_check_image() {
	local board=$(board_name)
	local board_clean="${board//,/_}"

	case "$board" in
	jio,jidu6*|jiorouter,ax6000-jidu6*|*jidu6*)
		nand_do_platform_check "jio_jidu6911" "$1" || \
		nand_do_platform_check "jio_jidu6811" "$1" || \
		nand_do_platform_check "jio_jidu6611" "$1" || \
		nand_do_platform_check "jio_jidu6411" "$1" || \
		nand_do_platform_check "jio_jidu6111" "$1" || \
		nand_do_platform_check "$board_clean" "$1" || \
		nand_do_platform_check "$board" "$1"
		return $?
		;;
	*)
		if grep -q '"ubi"' /proc/mtd 2>/dev/null; then
			nand_do_platform_check "$board_clean" "$1" || \
			nand_do_platform_check "$board" "$1" || return 0
		else
			return 0
		fi
		;;
	esac
}
