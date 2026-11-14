<div align="center">

# MAXNET Router OS
### Universal High-Performance OpenWrt Distribution for JioRouter AX6000 & AirFiber IDU Series
#### Supports Qualcomm IPQ9574 / IPQ9554 & MediaTek MT7986A Filogic 830

Official enterprise-grade OpenWrt **Linux 6.18 (AArch64 64-bit)** firmware engineered for high-throughput routing, dual-modem SuperSpeed USB 3.0 tethering, multi-link load balancing, ADB modem telemetry, automated Samba/DUFS storage, dual-band Wi-Fi 6 (160 MHz), and a modern reactive cybernetic WebUI.

[![Build Status](https://github.com/ohhmax/maxnet/actions/workflows/maxnet.yml/badge.svg)](https://github.com/ohhmax/maxnet/actions/workflows/maxnet.yml)
[![Release](https://img.shields.io/github/v/release/ohhmax/maxnet?color=blue&label=release)](https://github.com/ohhmax/maxnet/releases/latest)
[![License](https://img.shields.io/github/license/ohhmax/maxnet?color=lightgrey)](LICENSE)

</div>

---

## Table of Contents

1. [Architectural Comparison: MaxNet vs Stock Jio vs Standard OpenWrt](#1-architectural-comparison-maxnet-vs-stock-jio-vs-standard-openwrt)
2. [Hardware Specifications & Supported Device Matrix](#2-hardware-specifications--supported-device-matrix)
   - [Qualcomm IPQ95xx Family (ARM Cortex-A73)](#qualcomm-ipq95xx-family-arm-cortex-a73)
   - [MediaTek Filogic 830 Family (ARM Cortex-A53)](#mediatek-filogic-830-family-arm-cortex-a53)
   - [Default Firmware Settings & Access](#default-firmware-settings--access)
3. [Visual Interface & Light Mode Gallery](#3-visual-interface--light-mode-gallery)
   - [Desktop Dashboard Overview](#desktop-dashboard-overview)
   - [Android-Style Settings Hub](#android-style-settings-hub)
   - [Wi-Fi 6 Dual-Band Management](#wi-fi-6-dual-band-management)
   - [Network & LAN Configuration](#network--lan-configuration)
   - [SuperSpeed USB WAN Gateway](#superspeed-usb-wan-gateway)
   - [Real-Time Webhook Engine](#real-time-webhook-engine)
   - [Hardened Web Terminal CLI](#hardened-web-terminal-cli)
   - [Firmware Upgrade & Safe RAM Boot Modal](#firmware-upgrade--safe-ram-boot-modal)
   - [Samba 4 & DUFS Storage Engine](#samba-4--dufs-storage-engine)
   - [ADB 5G Modem Management](#adb-5g-modem-management)
   - [System Maintenance & Recovery](#system-maintenance--recovery)
   - [Responsive Touch-First Mobile Layout](#responsive-touch-first-mobile-layout)
4. [Flashing & Installation Guide for Qualcomm Devices (IPQ9574 / IPQ9554)](#4-flashing--installation-guide-for-qualcomm-devices-ipq9574--ipq9554)
   - [Step 4.1: Hardware Serial UART Connection & Pinouts](#step-41-hardware-serial-uart-connection--pinouts)
   - [Step 4.2: U-Boot Login & Password Retrieval](#step-42-u-boot-login--password-retrieval)
   - [Step 4.3: Host PC Network & TFTP Server Setup](#step-43-host-pc-network--tftp-server-setup)
   - [Method A: Fast SSH Flash (For Devices Already Running OpenWrt)](#method-a-fast-ssh-flash-for-devices-already-running-openwrt)
   - [Method B: Safe RAM Boot via TFTP (First-Time Flash from Stock Jio)](#method-b-safe-ram-boot-via-tftp-first-time-flash-from-stock-jio)
   - [Step 4.4: Permanent Flash from RAM Boot Mode](#step-44-permanent-flash-from-ram-boot-mode)
   - [Step 4.5: Permanent U-Boot Autoboot Configuration](#step-45-permanent-u-boot-autoboot-configuration)
5. [Flashing & Installation Guide for MediaTek Devices (MT7986A Filogic 830)](#5-flashing--installation-guide-for-mediatek-devices-mt7986a-filogic-830)
   - [Method 1: Web Failsafe Recovery (No Serial Cable Required)](#method-1-web-failsafe-recovery-no-serial-cable-required)
   - [Method 2: Serial UART TFTP RAM Boot](#method-2-serial-uart-tftp-ram-boot)
   - [Permanent U-Boot Autoboot Configuration (MediaTek)](#permanent-u-boot-autoboot-configuration-mediatek)
6. [Core Engineering & Subsystem Innovations](#6-core-engineering--subsystem-innovations)
   - [SuperSpeed USB 3.0 Multi-Packet Aggregation](#superspeed-usb-30-multi-packet-aggregation)
   - [High-Pressure Memory Management & OOM Shield](#high-pressure-memory-management--oom-shield)
   - [Qualcomm PPE Hardware Acceleration & Multi-Core Packet Steering](#qualcomm-ppe-hardware-acceleration--multi-core-packet-steering)
   - [Dual-Band Wi-Fi 6 Engine (ath11k FW Mode 2)](#dual-band-wi-fi-6-engine-ath11k-fw-mode-2)
   - [Android Debug Bridge (ADB) Integration](#android-debug-bridge-adb-integration)
   - [Dynamic USB Storage Hotplug & Dual File Server](#dynamic-usb-storage-hotplug--dual-file-server)
   - [Embedded Web Terminal CLI](#embedded-web-terminal-cli)
7. [In-Router Automated OTA Updates](#7-in-router-automated-ota-updates)
   - [WebUI One-Click Update Flow](#webui-one-click-update-flow)
   - [Command-Line OTA Execution](#command-line-ota-execution)
   - [Cryptographic Verification](#cryptographic-verification)
8. [CLI Commands & Administration Quick Reference](#8-cli-commands--administration-quick-reference)
9. [Local Compilation & CI/CD Pipeline](#9-local-compilation--cicd-pipeline)
10. [Troubleshooting & Frequently Asked Questions](#10-troubleshooting--frequently-asked-questions)

---

## 1. Architectural Comparison: MaxNet vs Stock Jio vs Standard OpenWrt

| Technical Feature | Stock Jio Firmware | Standard OpenWrt (LuCI) | MaxNet OS (Linux 6.18) |
| :--- | :--- | :--- | :--- |
| **Linux Kernel** | 5.4 / 4.4 (Outdated, proprietary) | 6.6 LTS (Generic) | **Linux 6.18 (AArch64)** tuned for IPQ9574 & MT7986A |
| **WebUI Architecture** | Slow closed-source portal | Heavy server-rendered Lua (LuCI) | **Ultra-Fast Single Page App (Vanilla JS/CSS, <80ms load)** |
| **UI Load Latency** | 2500 ms – 4000 ms | 800 ms – 1500 ms | **< 80 ms (Zero Lua overhead, pure JSON micro-endpoints)** |
| **Wi-Fi 6 Performance** | Locked channels, no 160MHz | Standard cfg80211, complex setup | **Dual-band 160MHz 4x4 MU-MIMO, WPA3-SAE, zero-collision kconfig** |
| **Free RAM on 512MB** | ~80 MB – 110 MB (< 25% free) | ~140 MB – 170 MB (~35% free) | **~180 MB – 240 MB (> 50% available memory)** |
| **Memory Optimization** | Generic Linux defaults (OOM risk) | Stock page cache settings | **`vfs_cache_pressure=200`, `min_free_kbytes=24576`, ath11k FW mode 2** |
| **Process Memory Ceiling** | No process isolation | Unbounded memory per daemon | **Tailscale Go ceiling `GOMEMLIMIT=16MiB`, dynamic on-demand Samba** |
| **USB 3.0 5G Tethering** | Disabled / Non-functional | Suffers `EVENT_RX_KILL` at >45 MB/s | **SuperSpeed 5000 Mbps with Multi-Packet Aggregation patches** |
| **ADB Modem Telemetry** | Not available | Requires manual compilation | **Built-in ADB daemon + UI for live RSRP, SINR, band & battery** |
| **Flash Recovery Risk** | High (risk of permanent brick) | Requires manual TFTP recovery | **Safe RAM Boot (`.itb` FIT image): test without touching NAND** |
| **Storage Sharing** | Disabled / Proprietary | Samba 4 always running (~25MB RAM) | **Dynamic hotplug: Samba 4 runs ONLY when USB drive is connected** |
| **File Browser** | None | LuCI filemanager (slow) | **DUFS Web file server + WebDAV on port 5000 (open access)** |
| **Default Passwords** | Random ISP password on label | `root` with no password | **Zero-password out of the box (SSH, WebUI, Samba, DUFS)** |
| **Default SSIDs** | `JioFiber-XXXX` (Locked) | `OpenWrt` | **`Maxnet_2.4Ghz` & `Maxnet_5Ghz` (Instant connect)** |
| **OTA Update Engine** | Locked remote ISP pushes | Manual image download & upload | **Real-time automated OTA client with SHA-256 verification** |

---

## 2. Hardware Specifications & Supported Device Matrix

MAXNET includes custom Device Trees, pinout configurations, and board profiles tailored specifically for both Qualcomm and MediaTek hardware revisions of the Jio IDU router series.

### Qualcomm IPQ95xx Family (ARM Cortex-A73)

- **CPU**: Qualcomm IPQ9574 / IPQ9554 (Quad-Core ARM Cortex-A73 @ 2.2 GHz, 64-bit AArch64)
- **RAM**: 512 MB DDR4 @ 1600 MHz
- **Flash Storage**: 256 MB Winbond SPI Serial NAND (`W25N02KWZEIR`) with UBI / UBIFS
- **Switch Hardware**: 1x 2.5G/1G WAN (Blue Port) + 4x Gigabit LAN (Yellow Ports, `lan1`–`lan4`) with Qualcomm PPE Hardware Offload
- **USB 3.0 Subsystem**: SuperSpeed 5000 Mbps (`dwc3-qcom`), MTU 1500, Multi-Packet Aggregation enabled
- **Wi-Fi Radios**: Qualcomm QCN9074 (5 GHz 4x4 160MHz) + IPQ9574 internal radio (2.4 GHz 4x4) via `ath11k`

| Model Name | Board ID / DTS Target | Canonical Sysupgrade Binary | Safe RAM-Boot (.itb) Image |
| :--- | :--- | :--- | :--- |
| **JIDU6811** | `jiorouter,ax6000-jidu6j11-6811` | `maxnet-jidu6811-sysupgrade.bin` | `maxnet-jidu6811-initramfs.itb` |
| **JIDU6911** | `jiorouter,ax6000-jidu6j11-6911` | `maxnet-jidu6911-sysupgrade.bin` | `maxnet-jidu6911-initramfs.itb` |
| **JIDU6611** | `jiorouter,ax6000-jidu6j11-6611` | `maxnet-jidu6611-sysupgrade.bin` | `maxnet-jidu6611-initramfs.itb` |
| **JIDU6411** | `jiorouter,ax6000-jidu6j11-6411` | `maxnet-jidu6411-sysupgrade.bin` | `maxnet-jidu6411-initramfs.itb` |
| **JIDU6111** | `jiorouter,ax6000-jidu6j11-6111` | `maxnet-jidu6111-sysupgrade.bin` | `maxnet-jidu6111-initramfs.itb` |
| **JIO JIDU6811** | `jio,jidu6811` | `maxnet-jidu6811-sysupgrade.bin` | `maxnet-jidu6811-initramfs.itb` |
| **JIO JIDU6911** | `jio,jidu6911` | `maxnet-jidu6911-sysupgrade.bin` | `maxnet-jidu6911-initramfs.itb` |

### MediaTek Filogic 830 Family (ARM Cortex-A53)

- **CPU**: MediaTek MT7986A Filogic 830 (Quad-Core ARM Cortex-A53 @ 2.0 GHz, 64-bit AArch64)
- **RAM**: 512 MB DDR4 RAM
- **Flash Storage**: 256 MB SPI NAND / eMMC
- **Switch Hardware**: 1x 2.5G WAN + 4x Gigabit LAN via MT7531 Gigabit Switch with Hardware Flow Offload
- **USB Subsystem**: USB 3.0 / USB 2.0 Host controller

| Model Name | Board ID / DTS Target | Canonical Sysupgrade Binary | Safe RAM-Boot (.itb) Image |
| :--- | :--- | :--- | :--- |
| **JIDU6801** | `jiorouter,ax6000-jidu6801` | `maxnet-jidu6801-sysupgrade.bin` | `maxnet-jidu6801-initramfs.itb` |
| **JIDU6401** | `jiorouter,ax6000-jidu6401` | `maxnet-jidu6401-sysupgrade.bin` | `maxnet-jidu6401-initramfs.itb` |
| **JIDU6101** | `jiorouter,ax6000-jidu6101` | `maxnet-jidu6101-sysupgrade.bin` | `maxnet-jidu6101-initramfs.itb` |
| **JIDU6601** | `jiorouter,ax6000-jidu6j01` | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6701** | `jiorouter,ax6000-jidu6j01` | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6201** | `jiorouter,ax6000-jidu6j01` | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6J01** | `jiorouter,ax6000-jidu6j01` | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |

### Default Firmware Settings & Access

| Parameter | Default Value | Notes |
| :--- | :--- | :--- |
| **Router Gateway IP** | `10.0.0.1` | Subnet: `255.255.255.0` (`/24`), Secondary Alias: `10.0.0.254` |
| **Web Dashboard** | `http://10.0.0.1/` | Port 80, instant 1-click passwordless login |
| **SSH Terminal** | `ssh root@10.0.0.1` | Port 22, Dropbear server (No password required) |
| **Web Terminal CLI** | `http://10.0.0.1/#setting=acc-terminal-cli` | Embedded `ttyd` interactive console inside WebUI |
| **DUFS File Server** | `http://10.0.0.1:5000/` | Open/anonymous WebDAV file server (No password required) |
| **Samba 4 File Share** | `\\10.0.0.1\share` | Auto-detects pendrives with guest access |
| **2.4 GHz Wi-Fi SSID** | `Maxnet_2.4Ghz` | Open / Unsecured out-of-the-box for instant initial configuration |
| **5 GHz Wi-Fi SSID** | `Maxnet_5Ghz` | High-throughput 160MHz channel width ready |
| **Primary WAN Interface** | `wan_usb` (`usb0`) | Automatic DHCP client for USB 3.0 mobile tethering |

---

## 3. Visual Interface & Light Mode Gallery

The MAXNET user interface is built as a pure, responsive, single-page application (SPA). It renders instantly without the clunky page refreshes or slow Lua execution of stock OpenWrt LuCI. All screenshots below are presented in the clean, high-contrast **Light Mode**.

### Desktop Dashboard Overview

![Desktop Dashboard](docs/images/desktop_light.png)

- **Interactive Topology Graph**: Real-time visual network graph mapping all connected LAN clients, Wi-Fi nodes, switch ports, and WAN gateways.
- **End-to-End Multi-Link Bandwidth Pipeline**: Visual conduit illustrating live throughput speeds across USB 3.0 WAN, Ethernet ports, and wireless interfaces.
- **Hardware Telemetry Bar**: Instant hardware gauges for CPU usage percentage, memory utilization, and SoC thermals.

### Android-Style Settings Hub

![Settings Hub](docs/images/settings_hub_light.png)

- **Categorized Configuration Hub**: Clean list of modular settings including Wi-Fi, Network, USB WAN, Webhooks, Terminal, Firmware Upgrade, and Storage.
- **Live Search Filtering**: Search any setting by keyword with instant results.
- **Lightweight Modals**: Edit IP addresses, subnets, and hostnames without leaving the current view.

### Wi-Fi 6 Dual-Band Management

![Wi-Fi Settings](docs/images/wifi_settings_light.png)

- **Independent Dual-Band Controls**: Individual configuration tiles for `Maxnet_2.4Ghz` and `Maxnet_5Ghz`.
- **Password Visibility Eye Toggle**: Show or hide the WPA2/WPA3 password with a single tap.
- **Channel Width & Transmission Power**: Full control over 20/40/80/160 MHz channel bonding and transmit power (dBm).

### Network & LAN Configuration

![Network Settings](docs/images/network_settings_light.png)

- **Gateway IP & Subnet**: Configure router IP address (`10.0.0.1`), subnet mask (`255.255.255.0`), and MTU size.
- **DHCP Server Range**: Fine-tune start IP (`10.0.0.100`), address limit (`150`), and lease durations.
- **Client Lease History**: Track client connection history with customizable retention periods (e.g., 15 days).

### SuperSpeed USB WAN Gateway

![USB WAN Settings](docs/images/usb_wan_light.png)

- **Dual-Modem Tethering**: Connect two 5G smartphones or cellular dongles simultaneously via USB 3.0 and USB 2.0.
- **Multi-Packet Aggregation Monitor**: Displays SuperSpeed 5000 Mbps link state, packet counts, and zero error rates.
- **Multi-Link Load Balancing**: Dynamic packet steering and automatic 1.5-second failover.

### Real-Time Webhook Engine

![Webhooks Settings](docs/images/webhooks_light.png)

- **Multi-Platform Dispatch**: Dispatch instant alerts to Telegram, Discord, Pushover, or custom HTTP REST endpoints.
- **Trigger Events**: Send notifications on WAN link state changes, high temperature warnings, or new client connections.
- **Zero Background Overhead**: Event-driven notification execution with zero idle memory consumption.

### Hardened Web Terminal CLI

![Web Terminal](docs/images/terminal_light.png)

- **Direct In-Browser Console**: Powered by `ttyd` over secure WebSocket connection.
- **Full Shell Capabilities**: Run `htop`, `dmesg`, `uci`, `iw`, and package management commands directly inside the browser.
- **Zero Client Dependencies**: Works seamlessly across desktop and mobile browsers without requiring third-party SSH clients.

### Firmware Upgrade & Safe RAM Boot Modal

![Firmware Upgrade](docs/images/firmware_upgrade_light.png)

- **Automated Semantic Version Check**: Compares installed version against latest GitHub Release.
- **Hardware Architecture Detection**: Resolves the exact board model (e.g., `Jio JIDU6911`, `Qualcomm IPQ9574`) and downloads the verified image.
- **Two Flash Modes**: Choose **Keep Settings & Update** or **Clean Flash (Factory Reset)** with live progress tracking.

### Samba 4 & DUFS Storage Engine

![Storage Settings](docs/images/smb_storage_light.png)

- **Dynamic USB Automount**: Automatically mounts external flash drives and SSDs formatted in NTFS, exFAT, EXT4, and FAT32.
- **On-Demand Samba 4**: Zero memory consumption when no drive is plugged in; starts instantly on USB insert.
- **DUFS Web Server**: High-speed WebDAV file sharing interface accessible on port 5000.

### ADB 5G Modem Management

![ADB Device Settings](docs/images/adb_device_light.png)

- **Live 5G Radio Metrics**: Query active 5G NR band (e.g., Band n77 3.5 GHz), RSRP signal level, and SINR ratios.
- **Battery & Thermal Protection**: Monitor phone battery level, charging voltage, and battery temperature to prevent overheating.
- **Remote Device Control**: Reboot phone or restart tethering interfaces directly from the router dashboard.

### System Maintenance & Recovery

![System Maintenance](docs/images/maintenance_light.png)

- **One-Click Maintenance Actions**: Reboot router, Power Cycle USB ports (VBUS toggle), and Restart Network services.
- **Cache & Conntrack Flushing**: Flush DNS caches and connection tracking tables with a single tap.
- **Configuration Backup & Restore**: Export system archives (`.tar.gz`) or execute factory reset with a safety countdown.

### Responsive Touch-First Mobile Layout

![Mobile View](docs/images/mobile_light.png)

- **Optimized for Handhelds**: Fully responsive interface adapted for smartphones (e.g., iPhone, Android) with smooth touch navigation.
- **Collapsible Setting Cards**: Easy vertical accordion navigation with haptic feedback.
- **High-Contrast Typography**: Clear readability in daylight without eye fatigue.

---

## 4. Flashing & Installation Guide for Qualcomm Devices (IPQ9574 / IPQ9554)

*(Applies to Jio AirFiber IDU Models: JIDU6811, JIDU6911, JIDU6611, JIDU6411, JIDU6111)*

### Step 4.1: Hardware Serial UART Connection & Pinouts

1. Disconnect the power adapter from the router.
2. Open the router casing to access the 4-pin UART serial header on the mainboard:
   - **GND** -> Connect to serial adapter GND
   - **TX** -> Connect to serial adapter RX
   - **RX** -> Connect to serial adapter TX
   - **VCC (3.3V)** -> **LEAVE DISCONNECTED**. Connecting power to the serial header will damage the board.
3. Plug your USB-to-UART serial adapter (set to 3.3V TTL logic level) into your PC.
4. Open a serial terminal on your host machine:

```bash
picocom -b 115200 -d 8 -p n -f n /dev/ttyUSB0
```

5. Connect the router power adapter. As bootloader messages scroll, repeatedly press `Enter` or `Space` to stop autoboot. You will arrive at the prompt:

```text
IPQ9574#
```

---

### Step 4.2: U-Boot Login & Password Retrieval

Factory Jio IDU routers prompt for a password when autoboot is interrupted:
- **Username**: `root`
- **Password Calculation**: Take the **MD5 hash of the router MAC address or Serial Number** (printed on the bottom barcode label, uppercase, without colons):

```bash
echo -n "A0B1C2D3E4F5" | md5sum | cut -d ' ' -f 1
```

Copy the 32-character hexadecimal string and paste it into the password prompt.

---

### Step 4.3: Host PC Network & TFTP Server Setup

1. Assign a static IP address to your PC Ethernet network interface:
   - **IP Address**: `192.168.1.2`
   - **Subnet Mask**: `255.255.255.0` (`/24`)
   - **Default Gateway**: `192.168.1.1`
2. Connect an Ethernet cable directly from your PC to **LAN Port 4** (or LAN Port 1) on the router.
3. Start a TFTP server on your PC (`tftpd-hpa` on Linux or `Tftpd64` on Windows).
4. Download the model-matched files from [GitHub Releases](https://github.com/ohhmax/maxnet/releases):
   - Safe RAM-boot file: `maxnet-jidu6911-initramfs.itb`
   - Permanent sysupgrade file: `maxnet-jidu6911-sysupgrade.bin`
5. Place both files in your TFTP server root directory (e.g., `/srv/tftp/`).
6. If using Linux, temporarily disable firewalls that block TFTP UDP port 69:

```bash
sudo ufw disable
```

---

### Method A: Fast SSH Flash (For Devices Already Running OpenWrt)

If your router is already running an earlier version of OpenWrt or MAXNET:

1. Download the sysupgrade binary to the router `/tmp` directory:

```bash
curl -sL https://github.com/ohhmax/maxnet/releases/latest/download/maxnet-jidu6911-sysupgrade.bin -o /tmp/sysupgrade.bin
```

2. Execute the flash command (keeping current configuration):

```bash
sysupgrade -v -F /tmp/sysupgrade.bin
```

3. Alternatively, execute a clean flash (factory reset):

```bash
sysupgrade -v -n -F /tmp/sysupgrade.bin
```

---

### Method B: Safe RAM Boot via TFTP (First-Time Flash from Stock Jio)

Execute each command below **one by one** at the `IPQ9574#` prompt:

Command 1: Set router IP address:

```text
setenv ipaddr 192.168.1.10
```

Command 2: Set TFTP server IP address:

```text
setenv serverip 192.168.1.2
```

Command 3: Verify network connectivity to TFTP server:

```text
ping 192.168.1.2
```

*(Ensure the output displays: `host 192.168.1.2 is alive`).*

Command 4: Disable CPU caches for stable kernel handoff:

```text
dcache off; icache off
```

Command 5: Unset FDT high relocation:

```text
setenv fdt_high
```

Command 6: Unset initrd high relocation:

```text
setenv initrd_high
```

Command 7: Set kernel boot arguments:

```text
setenv bootargs "console=ttyMSM0,115200n8 earlycon"
```

Command 8: Download the RAM boot image into DDR4 memory:

```text
tftpboot 0x46000000 maxnet-jidu6911-initramfs.itb
```

Command 9: Boot the kernel directly from RAM:

```text
bootm 0x46000000
```

The router will boot directly into MAXNET in RAM (~25 seconds). Flash memory is completely untouched in this mode.

---

### Step 4.4: Permanent Flash from RAM Boot Mode

Once the router boots into RAM mode, connect via SSH or open the WebUI at `http://10.0.0.1/`:

Command 1: Transfer the sysupgrade image to the router `/tmp` directory:

```bash
cat maxnet-jidu6911-sysupgrade.bin | ssh root@10.0.0.1 "cat > /tmp/sysupgrade.bin"
```

Command 2: Write the firmware permanently to NAND storage:

```bash
ssh root@10.0.0.1 "sysupgrade -F -v -n /tmp/sysupgrade.bin"
```

The router writes the SPI NAND flash partitions and reboots automatically within 30 seconds.

---

### Step 4.5: Permanent U-Boot Autoboot Configuration

Interrupt U-Boot at the `IPQ9574#` prompt and execute each command **one by one**:

Command 1: Set permanent autoboot command:

```text
setenv bootcmd "ubi part ubi; ubi read 0x44000000 kernel; bootm 0x44000000"
```

Command 2: Clear FDT relocation:

```text
setenv fdt_high
```

Command 3: Clear initrd relocation:

```text
setenv initrd_high
```

Command 4: Save environment variables to NAND flash:

```text
saveenv
```

Command 5: Reboot the system:

```text
reset
```

Your Qualcomm Jio router will now automatically boot MAXNET in 1 second on every power cycle.

---

## 5. Flashing & Installation Guide for MediaTek Devices (MT7986A Filogic 830)

*(Applies to Jio AirFiber IDU Models: JIDU6801, JIDU6401, JIDU6601, JIDU6701, JIDU6101, JIDU6J01)*

### Method 1: Web Failsafe Recovery (No Serial Cable Required)

MediaTek Filogic 830 features a built-in HTTP recovery server embedded inside U-Boot:

1. Power off the router.
2. Press and hold the physical **RESET** button on the rear panel.
3. While holding the RESET button, plug in the power adapter.
4. Continue holding RESET for **8 to 10 seconds** until the Ethernet LAN LEDs flash rapidly, then release the button.
5. Connect your PC via Ethernet cable to **LAN Port 1**. Set your PC static IP to `192.168.1.2` (Subnet: `255.255.255.0`, Gateway: `192.168.1.1`).
6. Open your web browser and navigate to:

```text
http://192.168.1.1
```

7. The MediaTek Web Failsafe Recovery interface will load. Click **Browse / Choose File**, select `maxnet-jidu6801-sysupgrade.bin`, and click **Upload & Update Firmware**.
8. Wait ~90 seconds while the image is written to flash. The router reboots automatically into MAXNET.

---

### Method 2: Serial UART TFTP RAM Boot

If you prefer UART console access or need to test RAM boot first:

1. Connect UART (3.3V TTL, 115200 8N1) and interrupt autoboot at the `MT7986#` (or `Filogic#`) prompt.
2. Configure network and verify TFTP reachability:

Command 1: Set router IP:

```text
setenv ipaddr 192.168.1.1
```

Command 2: Set TFTP server IP:

```text
setenv serverip 192.168.1.2
```

Command 3: Verify ping:

```text
ping 192.168.1.2
```

Command 4: Download RAM boot image into memory (**DO NOT run `dcache off` on MediaTek**):

```text
tftpboot 0x46000000 maxnet-jidu6801-initramfs.itb
```

Command 5: Boot image:

```text
bootm 0x46000000
```

Command 6: Once booted into RAM (`10.0.0.1` reachable), transfer sysupgrade:

```bash
cat maxnet-jidu6801-sysupgrade.bin | ssh root@10.0.0.1 "cat > /tmp/sysupgrade.bin"
```

Command 7: Execute permanent sysupgrade:

```bash
ssh root@10.0.0.1 "sysupgrade -F -v -n /tmp/sysupgrade.bin"
```

---

### Permanent U-Boot Autoboot Configuration (MediaTek)

Execute at the `MT7986#` prompt:

Command 1: Set autoboot:

```text
setenv bootcmd "bootm"
```

Command 2: Save environment:

```text
saveenv
```

Command 3: Reboot router:

```text
reset
```

---

## 6. Core Engineering & Subsystem Innovations

### SuperSpeed USB 3.0 Multi-Packet Aggregation

Stock Linux kernels (`rndis_host.c`) assume a 1:1 mapping between USB bulk transfers and network packets (`sk_buff`). Modern 5G smartphones (such as Samsung Galaxy devices on Android 14/15/16) concatenate dozens of Ethernet frames into single 32 KB transfers with trailing zero-padding. Standard drivers flag trailing zeros as length errors, accumulating `rx_errors` and halting the interface with `EVENT_RX_KILL`.

MAXNET embeds two kernel patches resolving this:
1. **`0800-net-usb-rndis_host-support-superspeed-aggregation.patch`**:
   - Enables `FLAG_MULTI_PACKET` on the RNDIS device descriptor.
   - Implements a frame-extraction loop in `rndis_rx_fixup()` that unpacks each frame into its own `sk_buff` and terminates gracefully on padding zeros.
2. **`0801-net-usb-usbnet-prevent-rx-queue-starvation.patch`**:
   - Expands SuperSpeed `rx_qlen` to **32 URBs (~1 MB depth)** and `tx_qlen` to 64 URBs.
   - Refills the RX ring immediately when `dev->rxq.qlen == 0`, eliminating controller deadlocks during heavy line-rate bursts.
   - Tested and verified at full wire speed (>450 Mbps) with **0 packet drops and 0 errors across millions of packets**.

---

### High-Pressure Memory Management & OOM Shield

Routers equipped with 512MB RAM often face out-of-memory (OOM) kernel panics when running multiple daemons, Wi-Fi drivers, and packet queues. MAXNET deploys a comprehensive memory guard architecture:

1. **Virtual Memory & Cache Reclaim Tuning (`/etc/sysctl.d/99-memory-oom-guard.conf`)**:
   - `vm.vfs_cache_pressure = 200`: Reclaims dentries and inode caches twice as aggressively as default Linux, keeping physical RAM free for networking buffers.
   - `vm.min_free_kbytes = 24576`: Reserves a dedicated 24 MB watermark for atomic driver allocations (ath11k skbs, DMA descriptors, and packet rings).
   - `vm.swappiness = 90`: Actively swaps idle anonymous pages into compressed ZRAM swap space (221 MB).
2. **Process Memory Ceilings**:
   - Tailscale Go runtime constrained via `GOMEMLIMIT=16MiB GODEBUG=madvdontneed=1` in `/etc/init.d/tailscale`, reducing memory footprint from 28 MB down to ~12-16 MB.
3. **Dynamic On-Demand Daemons**:
   - Samba 4 is disabled on boot and starts dynamically **only** when an external USB drive is mounted by hotplug, saving 25 MB of RAM 100% of the time during standard routing.

---

### Qualcomm PPE Hardware Acceleration & Multi-Core Packet Steering

- **Qualcomm PPE (Packet Processing Engine)**: Hardware NAT offload for IPQ9574 routing all 4 yellow LAN ports (`lan1`–`lan4`) and the 2.5G blue WAN port at wire speed with `< 1%` CPU utilization.
- **Packet Steering across 4 Cores**: Network IRQs and softirqs are distributed across all 4 ARM Cortex-A73 cores (`uci set network.@globals[0].packet_steering='1'`).
- **Conntrack Capacity**: Scaled to 65,536 entries with optimized connection timeouts (`net.netfilter.nf_conntrack_max = 65536`).
- **TCP Acceleration**: TCP Fast Open enabled (`net.ipv4.tcp_fastopen = 3`) with socket buffer auto-tuning up to 16 MB (`net.core.rmem_max = 16777216`).

---

### Dual-Band Wi-Fi 6 Engine (ath11k FW Mode 2)

- **Qualcomm ath11k Drivers**: Backported wireless stack running on Linux 6.18.
- **FW Memory Mode 2**: Configures Wi-Fi firmware memory structures in low-overhead mode (8 VDEVs, 128 peers, no coldboot memory bloat), saving over 80 MB of RAM compared to generic drivers.
- **160 MHz Channel Bonding**: High-throughput 4x4 MU-MIMO on 5 GHz band delivering up to 4.8 Gbps PHY link rates.
- **Default SSIDs**: Pre-configured as `Maxnet_2.4Ghz` and `Maxnet_5Ghz` with 1-click password visibility in WebUI.

---

### Android Debug Bridge (ADB) Integration

MAXNET integrates a native ADB client and daemon directly in rootfs:
- Passwordless USB debugging with pre-installed router authorization keys.
- Real-time telemetry: battery temperature, battery health, voltage, CPU load, and 5G signal metrics (RSRP, RSRQ, SINR, 5G NR band).
- Remote management commands: SMS inbox viewing, contact lookup, phone reboot, and screen captures.

---

### Dynamic USB Storage Hotplug & Dual File Server

- **Automated Filesystem Detection**: Hotplug daemon (`50-pendrive-smb`) detects USB storage drives formatted in NTFS (via `ntfs-3g`), exFAT, FAT32, EXT4, and F2FS.
- **Samba 4 File Share**: Automatically exposes `/mnt/pendrive` to Windows, Mac, and Linux clients with guest access.
- **DUFS Web Server**: Lightweight Rust-powered file server running on port 5000 with a dedicated MAXNET file browser interface.

---

### Embedded Web Terminal CLI

- Embedded `ttyd` interactive console with xterm.js integration.
- Direct root terminal over WebSocket accessible inside the WebUI at `http://10.0.0.1/#setting=acc-terminal-cli`.
- Full shell access for real-time monitoring and administrative commands.

---

## 7. In-Router Automated OTA Updates

MAXNET includes an automated update client querying releases at `https://github.com/ohhmax/maxnet/releases`.

### WebUI One-Click Update Flow

1. Navigate to **Settings -> Firmware Update**.
2. Click **Check Latest Updates**.
3. When an update is detected, the version comparison, target board, and SHA-256 hash are displayed.
4. Click **Flash Update** to trigger `maxnet_ota_worker.sh` in the background.
5. The live countdown and reconnect monitor automatically tracks the reboot and refreshes the page when the router is back online.

### Command-Line OTA Execution

Command 1: Check for updates:

```bash
/www/cgi-bin/update check
```

Command 2: Apply update (keeping current settings):

```bash
/www/cgi-bin/update flash
```

Command 3: Apply clean update (factory reset):

```bash
/www/cgi-bin/update flash_clean
```

### Cryptographic Verification

Every release publishes a verified `manifest.json` and `sha256sums`. The router verifies the cryptographic SHA-256 hash before writing to storage.

---

## 8. CLI Commands & Administration Quick Reference

### System & Memory Diagnostics

Command 1: Check memory consumption and swap:

```bash
free -m
```

Command 2: Check system uptime and quad-core load average:

```bash
uptime
```

Command 3: Check Wi-Fi interfaces:

```bash
iw dev
```

Command 4: Check Wi-Fi subsystem status:

```bash
ubus call network.wireless status
```

Command 5: Check socket statistics:

```bash
cat /proc/net/sockstat
```

---

### Connected ADB Device Management

Command 1: Verify connected phone:

```bash
adb devices
```

Command 2: Query active 5G cell details & signal metrics:

```bash
adb shell "dumpsys telephony.registry | grep -m 1 mCellInfo="
```

Command 3: Query phone battery & thermals:

```bash
adb shell "dumpsys battery | head -n 15"
```

Command 4: Reboot phone remotely:

```bash
adb reboot
```

---

## 9. Local Compilation & CI/CD Pipeline

### Local Firmware Compilation

Command 1: Build for Qualcomm IPQ95xx:

```bash
./build_firmware.sh qualcommbe
```

Command 2: Build for MediaTek Filogic:

```bash
./build_firmware.sh mediatek
```

Compiled images are generated at:
- Qualcomm: `../openwrt/bin/targets/qualcommbe/ipq95xx/`
- MediaTek: `../openwrt/bin/targets/mediatek/filogic/`

### Automated CI/CD Workflow

The GitHub Actions workflow [.github/workflows/maxnet.yml](.github/workflows/maxnet.yml) runs on every push:
1. Compiles modern Vite frontend and generates gzip pre-compressed assets.
2. Compiles OpenWrt images for both `qualcommbe` and `mediatek` targets in parallel.
3. Harvests `.bin` sysupgrades and `.itb` ram-boot images.
4. Generates `manifest.json` with cryptographic SHA-256 checksums.
5. Publishes a multi-architecture GitHub Release automatically.

---

## 10. Troubleshooting & Frequently Asked Questions

#### Q: U-Boot reports `Console buffer overflow occured!!` or truncates pasted commands?
**A**: U-Boot serial console input buffers have a strict line length limit (~64 characters). Do not paste long concatenated commands in a single line. Enter each command individually as shown in the guide.

#### Q: TFTP transfer times out (`T T T T T`)?
**A**:
1. Confirm host PC Ethernet static IP is set to `192.168.1.2/24`.
2. Temporarily disable host firewalls: `sudo ufw disable` (Linux) or disable Windows Defender Firewall.
3. Verify TFTP service status: `sudo systemctl status tftpd-hpa`.

#### Q: LuCI reports `invalid sysupgrade file Image check failed`?
**A**: When migrating from stock firmware or initial RAM boot, OpenWrt metadata does not find existing board profiles in flash. Check the **Force upgrade** (`-F`) checkbox or pass `-F` via CLI.

#### Q: Can I change the router LAN IP?
**A**: Edit `/etc/config/network`:

```bash
uci set network.lan.ipaddr="192.168.1.1"
```

```bash
uci commit network
```

```bash
/etc/init.d/network restart
```

---

<div align="center">
Engineered for zero-compromise stability, low memory footprint, and wire-speed routing.
</div>
