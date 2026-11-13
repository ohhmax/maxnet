# MAXNET Router OS

MAXNET is an enterprise-grade, high-performance OpenWrt distribution engineered specifically for the JioRouter AX6000 and AirFiber IDU Series. It combines high-throughput routing, dual-modem USB 3.0 mobile tethering, multi-link load balancing, automated storage sharing, and a modern reactive cybernetic WebUI.

---

## 1. Supported Hardware Models & Release Images

MAXNET supports both Qualcomm IPQ95xx and MediaTek Filogic 830 SoC architectures across all Jio IDU gateway revisions.

### Qualcomm IPQ95xx Family (64-bit Quad-Core ARM Cortex-A73)

| Model Name | Board ID / Device Tree | Target SoC | Permanent Sysupgrade Binary | Safe RAM-Boot (.itb) Image |
| :--- | :--- | :--- | :--- | :--- |
| **JIDU6811** | `jiorouter,ax6000-jidu6j11-6811` | Qualcomm IPQ9574 | `maxnet-jidu6811-sysupgrade.bin` | `maxnet-jidu6811-initramfs.itb` |
| **JIDU6911** | `jiorouter,ax6000-jidu6j11-6911` | Qualcomm IPQ9574 | `maxnet-jidu6911-sysupgrade.bin` | `maxnet-jidu6911-initramfs.itb` |
| **JIDU6611** | `jiorouter,ax6000-jidu6j11-6611` | Qualcomm IPQ9574 | `maxnet-jidu6611-sysupgrade.bin` | `maxnet-jidu6611-initramfs.itb` |
| **JIDU6411** | `jiorouter,ax6000-jidu6j11-6411` | Qualcomm IPQ9574 | `maxnet-jidu6411-sysupgrade.bin` | `maxnet-jidu6411-initramfs.itb` |
| **JIDU6111** | `jiorouter,ax6000-jidu6j11-6111` | Qualcomm IPQ9574 | `maxnet-jidu6111-sysupgrade.bin` | `maxnet-jidu6111-initramfs.itb` |
| **JIO JIDU6811** | `jio,jidu6811` | Qualcomm IPQ9574 | `maxnet-jidu6811-sysupgrade.bin` | `maxnet-jidu6811-initramfs.itb` |
| **JIO JIDU6911** | `jio,jidu6911` | Qualcomm IPQ9574 | `maxnet-jidu6911-sysupgrade.bin` | `maxnet-jidu6911-initramfs.itb` |

### MediaTek Filogic 830 Family (64-bit Quad-Core ARM Cortex-A53)

| Model Name | Board ID / Device Tree | Target SoC | Permanent Sysupgrade Binary | Safe RAM-Boot (.itb) Image |
| :--- | :--- | :--- | :--- | :--- |
| **JIDU6801** | `jiorouter,ax6000-jidu6801` | MediaTek MT7986A | `maxnet-jidu6801-sysupgrade.bin` | `maxnet-jidu6801-initramfs.itb` |
| **JIDU6401** | `jiorouter,ax6000-jidu6401` | MediaTek MT7986A | `maxnet-jidu6401-sysupgrade.bin` | `maxnet-jidu6401-initramfs.itb` |
| **JIDU6101** | `jiorouter,ax6000-jidu6101` | MediaTek MT7986A | `maxnet-jidu6101-sysupgrade.bin` | `maxnet-jidu6101-initramfs.itb` |
| **JIDU6601** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6701** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6201** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |
| **JIDU6J01** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` | `maxnet-jidu6j01-initramfs.itb` |

---

## 2. Visual Interface & Screenshots

### Desktop View

#### Dark Cybernetic Mode
![Desktop Dark Mode](file:///home/max/Projects/maxnet/docs/images/desktop_dark.png)
*Interactive multi-layer network topology canvas with real-time bandwidth conduits and hardware telemetry.*

#### Light Minimalist Mode
![Desktop Light Mode](file:///home/max/Projects/maxnet/docs/images/desktop_light.png)
*Clean high-contrast theme engineered for brightly lit environments.*

---

### Mobile View

| Mobile Dark Mode | Mobile Light Mode |
| :---: | :---: |
| ![Mobile Dark](file:///home/max/Projects/maxnet/docs/images/mobile_dark.png) | ![Mobile Light](file:///home/max/Projects/maxnet/docs/images/mobile_light.png) |
| *Compact touch-optimized topology navigation* | *Responsive settings and system management* |

---

### Key Operational Subsystems

| Direct Terminal CLI | USB WAN Load Balancing | Automated Webhook Alerts |
| :---: | :---: | :---: |
| ![Terminal](file:///home/max/Projects/maxnet/docs/images/terminal.png) | ![USB WAN](file:///home/max/Projects/maxnet/docs/images/usb_wan.png) | ![Webhooks](file:///home/max/Projects/maxnet/docs/images/webhooks.png) |
| *Full root terminal over WebSocket* | *Real-time dual modem tethering* | *Multi-channel notification engine* |

---

## 3. First-Time Flashing Guide via U-Boot

If your router is currently running stock Jio firmware or needs a fresh recovery install, use U-Boot with serial console access to flash MAXNET.

### Step 1: Serial Console Connection (UART)
1. Disconnect power from the router.
2. Connect a USB-to-UART serial adapter (3.3V TTL logic level) to the router header pins:
   - **GND** -> GND
   - **TX** -> RX on adapter
   - **RX** -> TX on adapter
   - **DO NOT connect VCC/3.3V power pin.**
3. Launch a serial terminal on your host machine:
   ```bash
   picocom -b 115200 -d 8 -p n -f n /dev/ttyUSB0
   ```
4. Power on the router and interrupt the boot counter by pressing `Enter` or `Space` repeatedly until you reach the `IPQ9574#` or `MT7986#` prompt.

---

### Step 2: Host TFTP Server Setup
1. Assign a static IP address to your computer Ethernet interface:
   - **IP Address**: `192.168.1.10`
   - **Subnet Mask**: `255.255.255.0`
   - **Gateway**: `192.168.1.1`
2. Connect an Ethernet cable directly from your host PC to **LAN Port 1** on the router.
3. Install and run a TFTP server (e.g. `tftpd-hpa` on Linux or `Tftpd64` on Windows).
4. Download the corresponding `.itb` (RAM-boot) and `.bin` (sysupgrade) files for your model from the [GitHub Releases](https://github.com/ohhmax/maxnet/releases) page and place them in your TFTP server directory.

---

### Step 3: Safe RAM Boot via .itb (Test Without Modifying Flash)

Before modifying the router flash memory, you can safely boot MAXNET directly into RAM. This does not alter existing partitions. If you power cycle the router, it returns untouched.

#### For Qualcomm IPQ9574 Models (JIDU6811, 6911, 6611, 6411, 6111):
```text
IPQ9574# setenv ipaddr 192.168.1.1
IPQ9574# setenv serverip 192.168.1.10
IPQ9574# ping 192.168.1.10
host 192.168.1.10 is alive

IPQ9574# tftpboot 0x44000000 maxnet-jidu6811-initramfs.itb
IPQ9574# bootm 0x44000000
```

#### For MediaTek MT7986A Filogic Models (JIDU6801, 6401, 6101, 6j01):
```text
MT7986# setenv ipaddr 192.168.1.1
MT7986# setenv serverip 192.168.1.10
MT7986# ping 192.168.1.10
host 192.168.1.10 is alive

MT7986# tftpboot 0x46000000 maxnet-jidu6401-initramfs.itb
MT7986# bootm 0x46000000
```

The router will load the kernel and rootfs into system RAM. In 30 to 45 seconds, the MAXNET WebUI will be accessible at:
```text
http://10.0.0.1 (or http://192.168.1.1)
Username: root
Password: (empty or default 1024)
```

---

### Step 4: Permanent Installation (Writing to Flash)

Once the router is running via RAM-boot, you can permanently write MAXNET to flash using standard `sysupgrade`:

1. Transfer the matching sysupgrade binary to the router `/tmp/` directory from your computer:
   ```bash
   cat maxnet-jidu6811-sysupgrade.bin | ssh root@10.0.0.1 "cat > /tmp/sysupgrade.bin"
   ```
2. Execute the sysupgrade command:
   ```bash
   ssh root@10.0.0.1 "sysupgrade -n -F -v /tmp/sysupgrade.bin"
   ```
3. The router will verify image headers, erase flash partitions, write the new filesystem, and reboot into permanent MAXNET OS.

---

## 4. In-Router Automated OTA Updates

Routers running MAXNET feature an automated, model-specific update engine integrated into both the WebUI and the CLI.

| Firmware Upgrade Modal | Live Flashing & Countdown |
| :---: | :---: |
| ![Firmware Modal](file:///home/max/Projects/maxnet/docs/images/firmware_flash_modal.png) | ![Flashing Progress](file:///home/max/Projects/maxnet/docs/images/firmware_flashing_progress.png) |
| *Version comparison and flash options* | *Real-time progress and reconnect ping* |

### WebUI Update Flow
1. Navigate to **System -> Maintenance -> Firmware Update**.
2. Click **Check Latest Updates**. The router contacts the release manifest at `https://github.com/ohhmax/maxnet/releases`.
3. When an update is available:
   - The status changes to show the latest build version.
   - The right-side check button morphs into a glowing **Flash Update** action button.
4. Clicking the Flash button opens the **Firmware Upgrade Modal**:
   - Compares the installed version against the latest build.
   - Displays detected hardware board target and cryptographic SHA256 checksum.
   - Provides two flash options:
     - **Keep Settings & Update**: Retains existing Wi-Fi keys, DHCP leases, and network configurations (`sysupgrade -F -v`).
     - **Clean Flash (Factory Reset)**: Wipes all configuration partitions for a completely fresh install (`sysupgrade -n -F -v`).
5. A live countdown and reconnect monitor guides the process until the router finishes rebooting.

### CLI Update Execution
```bash
# Query update status:
/www/cgi-bin/update check

# Apply update preserving settings:
/www/cgi-bin/update flash

# Apply clean update (factory reset):
/www/cgi-bin/update flash_clean
```

---

## 5. Frontend Development & Workflow

The frontend source code is located in [frontend/](file:///home/max/Projects/maxnet/frontend/).

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Local Development
```bash
cd frontend
npm install
npm run dev
```
The dev server launches on `http://localhost:3000` and proxies all `/cgi-bin/*` API calls to `http://10.0.0.1`.

### Production Build
```bash
cd frontend
npm run build
```
Builds production assets to [files/www/dist/](file:///home/max/Projects/maxnet/files/www/dist/) and creates pre-compressed `.gz` siblings.

### Atomic 1-Command Live Deployment to Router
```bash
./deploy-web.sh 10.0.0.1
```
Compiles the Vite bundle and streams all assets and CGI endpoints atomically via SSH to the router.

---

## 6. Local Firmware Build

To build OpenWrt firmware locally on Linux:

```bash
# Build for Qualcomm IPQ95xx (JIDU6811, 6911, 6611, 6411, 6111)
./build_firmware.sh qualcommbe

# Build for MediaTek Filogic (JIDU6801, 6401, 6101, 6j01)
./build_firmware.sh mediatek
```

Compiled images will be located in:
- Qualcomm: `../openwrt/bin/targets/qualcommbe/ipq95xx/`
- MediaTek: `../openwrt/bin/targets/mediatek/filogic/`

---

## 7. CI/CD Automated Workflow

The GitHub Actions workflow [.github/workflows/maxnet.yml](file:///home/max/Projects/maxnet/.github/workflows/maxnet.yml) runs on every push:
1. **Frontend Compilation**: Builds the Vite frontend and synchronizes distribution bundles to `files/www/`.
2. **Matrix Compilation**: Compiles OpenWrt images for both `qualcommbe` and `mediatek` SoC targets.
3. **Artifact Aggregation**: Harvests both `.bin` sysupgrade files and `.itb` ram-boot files.
4. **Manifest Generation**: Generates `manifest.json` mapping each router model to its corresponding download URL and SHA256 sum.
5. **Universal Release Publication**: Publishes a tagged release with all canonical binaries, ram-boot images, and verification manifests.
