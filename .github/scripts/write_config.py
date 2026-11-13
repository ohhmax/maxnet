#!/usr/bin/env python3
"""Writes minimal OpenWrt .config for JioRouter AX6000
Supports both Qualcomm IPQ95xx and MediaTek Filogic architectures:
- Qualcomm: JIDU6811, JIDU6911, JIDU6611, JIDU6411, JIDU6111
- MediaTek: JIDU6801, JIDU6401, JIDU6601, JIDU6701, JIDU6201, JIDU6101, JIDU6J01
Specialized build: USB 3.0 High-Speed Mobile Tethering + ADB + LAN + Port 80 Web Monitor
"""
import sys
import argparse

parser = argparse.ArgumentParser(description="Generate OpenWrt .config for MAXNET Router OS")
parser.add_argument("output", nargs="?", default=".config", help="Output .config path")
parser.add_argument("--target", choices=["qualcommbe", "mediatek"], default="qualcommbe", help="Hardware SoC target")
args = parser.parse_args()

common_packages = [
    # Explicitly strip kernel debug symbols & bloat to keep vmlinux lean & fast
    "CONFIG_KALLSYMS_ALL=n",
    "CONFIG_DEBUG_INFO=n",
    "CONFIG_DEBUG_INFO_NONE=y",
    "CONFIG_DYNAMIC_DEBUG=n",
    "CONFIG_SLUB_DEBUG=n",
    "CONFIG_DEBUG_BUGVERBOSE=n",
    "CONFIG_LOCK_DEBUGGING_SUPPORT=n",

    # GPIO, LEDs, Buttons & Triggers
    "CONFIG_PACKAGE_kmod-leds-gpio=y",
    "CONFIG_PACKAGE_kmod-gpio-button-hotplug=y",
    "CONFIG_PACKAGE_kmod-ledtrig-netdev=y",

    # High-Performance USB 3.0 & Mobile Tethering Stack (RNDIS + NCM + CDC Ether)
    "CONFIG_PACKAGE_kmod-usb3=y",
    "CONFIG_PACKAGE_kmod-usb-net=y",
    "CONFIG_PACKAGE_kmod-usb-net-rndis=y",
    "CONFIG_PACKAGE_kmod-usb-net-cdc-ether=y",
    "CONFIG_PACKAGE_kmod-usb-net-cdc-ncm=y",

    # USB Storage, Automount, & Filesystems (Samba4, NTFS-3G, exFAT, EXT4, F2FS)
    "CONFIG_PACKAGE_kmod-usb-storage=y",
    "CONFIG_PACKAGE_kmod-usb-storage-uas=y",
    "CONFIG_PACKAGE_kmod-fs-vfat=y",
    "CONFIG_PACKAGE_kmod-fs-ntfs3=y",
    "CONFIG_PACKAGE_kmod-fs-exfat=y",
    "CONFIG_PACKAGE_kmod-fs-ext4=y",
    "CONFIG_PACKAGE_kmod-fs-f2fs=y",
    "CONFIG_PACKAGE_kmod-fuse=y",
    "CONFIG_PACKAGE_block-mount=y",
    "CONFIG_PACKAGE_ntfs-3g=y",
    "CONFIG_PACKAGE_samba4-server=y",
    "CONFIG_PACKAGE_samba4-libs=y",
    "CONFIG_PACKAGE_samba4-utils=y",

    # Android Debug Bridge (ADB)
    "CONFIG_PACKAGE_adb=y",

    # Networking, Firewall & Hardware Flow Offloading
    "CONFIG_PACKAGE_firewall4=y",
    "CONFIG_PACKAGE_nftables=y",
    "CONFIG_PACKAGE_kmod-nft-offload=y",

    # Lightweight Web Monitor (Port 80 Dashboard) & Terminal
    "CONFIG_PACKAGE_uhttpd=y",
    "CONFIG_PACKAGE_ttyd=y",

    # JSON processing & CLI utilities
    "CONFIG_PACKAGE_jq=y",

    # CLI Management & System tools (NO LuCI WebUI)
    "CONFIG_PACKAGE_busybox=y",
    "CONFIG_PACKAGE_dropbear=y",
    "CONFIG_PACKAGE_mtd=y",
    "CONFIG_PACKAGE_uboot-envtools=y",
    "CONFIG_PACKAGE_ethtool=y",
    "CONFIG_PACKAGE_iperf3=y",
    "CONFIG_PACKAGE_htop=y",
    "CONFIG_PACKAGE_curl=y",
]

if args.target == "qualcommbe":
    target_config = [
        "CONFIG_TARGET_qualcommbe=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6811=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6911=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6611=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6411=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6111=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jio_jidu6811=y",
        "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jio_jidu6911=y",
        "CONFIG_TARGET_ROOTFS_INITRAMFS=y",
        "CONFIG_TARGET_INITRAMFS_FORCE=y",
        "CONFIG_KERNEL_GZIP=y",
        "CONFIG_DEVEL=y",
        "CONFIG_CCACHE=y",

        # Qualcomm DWC3 USB Controller
        "CONFIG_PACKAGE_kmod-usb-dwc3=y",
        "CONFIG_PACKAGE_kmod-usb-dwc3-qcom=y",

        # Essential built-in SoC clock controllers, ethernet & PPE flow acceleration
        "CONFIG_PACKAGE_kmod-qcom-gcc-ipq9574=y",
        "CONFIG_PACKAGE_kmod-qcom-nsscc-ipq9574=y",
        "CONFIG_PACKAGE_kmod-pcs-qcom-ipq9574=y",
        "CONFIG_PACKAGE_kmod-qcom-ppe=y",
        "CONFIG_PACKAGE_kmod-shortcut-fe=y",
        "CONFIG_PACKAGE_kmod-shortcut-fe-cm=y",

        # Strip unneeded Wi-Fi firmware
        "CONFIG_PACKAGE_kmod-ath11k=n",
        "CONFIG_PACKAGE_kmod-ath11k-ahb=n",
        "CONFIG_PACKAGE_kmod-ath11k-pci=n",
        "CONFIG_PACKAGE_kmod-mac80211=n",
        "CONFIG_PACKAGE_kmod-cfg80211=n",
        "CONFIG_PACKAGE_ath11k-firmware-ipq9574=n",
        "CONFIG_PACKAGE_ath11k-firmware-qcn9074=n",
        "CONFIG_PACKAGE_wireless-regdb=n",
        "CONFIG_PACKAGE_wpad-basic=n",
        "CONFIG_PACKAGE_wpad=n",
        "CONFIG_QCOM_Q6V5_WCSS=n",
    ]
else: # mediatek
    target_config = [
        "CONFIG_TARGET_mediatek=y",
        "CONFIG_TARGET_mediatek_filogic=y",
        "CONFIG_TARGET_mediatek_filogic_DEVICE_jiorouter_ax6000-jidu6j01=y",
        "CONFIG_TARGET_mediatek_filogic_DEVICE_jiorouter_ax6000-jidu6101=y",
        "CONFIG_TARGET_mediatek_filogic_DEVICE_jiorouter_ax6000-jidu6801=y",
        "CONFIG_TARGET_mediatek_filogic_DEVICE_jiorouter_ax6000-jidu6401=y",
        "CONFIG_TARGET_ROOTFS_INITRAMFS=y",
        "CONFIG_DEVEL=y",
        "CONFIG_CCACHE=y",

        # MediaTek Ethernet & Switch support
        "CONFIG_PACKAGE_kmod-mt753x=y",
        "CONFIG_PACKAGE_kmod-hwmon-pwmfan=y",
    ]

full_config = target_config + common_packages

with open(args.output, 'w') as f:
    f.write('\n'.join(full_config) + '\n')

print(f"Written {args.output} for target {args.target}")
