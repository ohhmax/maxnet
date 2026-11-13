# MAXNET Router OS

MAXNET is an enterprise-grade, high-performance OpenWrt-based firmware distribution engineered for the JioRouter AX6000 Gateway and AirFiber IDU Series. It combines high-throughput routing, USB 3.0 mobile tethering, multi-WAN load balancing, automated storage sharing, and a modern reactive cybernetic WebUI.

---

## 1. Supported Hardware Models

MAXNET supports both Qualcomm IPQ95xx and MediaTek Filogic 830 SoC architectures across all Jio IDU gateway revisions.

### Qualcomm IPQ95xx Family (64-bit Quad-Core ARM Cortex-A73)

| Model Name | Board ID / Device Tree | Target SoC | Canonical Sysupgrade Binary |
| :--- | :--- | :--- | :--- |
| **JIDU6811** | `jiorouter,ax6000-jidu6j11-6811` | Qualcomm IPQ9574 | `maxnet-jidu6811-sysupgrade.bin` |
| **JIDU6911** | `jiorouter,ax6000-jidu6j11-6911` | Qualcomm IPQ9574 | `maxnet-jidu6911-sysupgrade.bin` |
| **JIDU6611** | `jiorouter,ax6000-jidu6j11-6611` | Qualcomm IPQ9574 | `maxnet-jidu6611-sysupgrade.bin` |
| **JIDU6411** | `jiorouter,ax6000-jidu6j11-6411` | Qualcomm IPQ9574 | `maxnet-jidu6411-sysupgrade.bin` |
| **JIDU6111** | `jiorouter,ax6000-jidu6j11-6111` | Qualcomm IPQ9574 | `maxnet-jidu6111-sysupgrade.bin` |
| **JIO JIDU6811** | `jio,jidu6811` | Qualcomm IPQ9574 | `maxnet-jidu6811-sysupgrade.bin` |
| **JIO JIDU6911** | `jio,jidu6911` | Qualcomm IPQ9574 | `maxnet-jidu6911-sysupgrade.bin` |

### MediaTek Filogic 830 Family (64-bit Quad-Core ARM Cortex-A53)

| Model Name | Board ID / Device Tree | Target SoC | Canonical Sysupgrade Binary |
| :--- | :--- | :--- | :--- |
| **JIDU6801** | `jiorouter,ax6000-jidu6801` | MediaTek MT7986A | `maxnet-jidu6801-sysupgrade.bin` |
| **JIDU6401** | `jiorouter,ax6000-jidu6401` | MediaTek MT7986A | `maxnet-jidu6401-sysupgrade.bin` |
| **JIDU6101** | `jiorouter,ax6000-jidu6101` | MediaTek MT7986A | `maxnet-jidu6101-sysupgrade.bin` |
| **JIDU6601** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` |
| **JIDU6701** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` |
| **JIDU6201** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` |
| **JIDU6J01** | `jiorouter,ax6000-jidu6j01` | MediaTek MT7986A | `maxnet-jidu6j01-sysupgrade.bin` |

---

## 2. Core Features & Architecture

- **High-Speed Mobile Tethering**: Integrated support for USB 3.0 high-speed interfaces running RNDIS, CDC-NCM, CDC-Ether, QMI, and MBIM drivers for Android 5G smartphones and LTE modems.
- **Dual-Modem USB WAN Load Balancing**: Multi-interface failover daemon (`multilinkd`) enabling round-robin and weighted load balancing across multiple connected cellular modems.
- **Android Debug Bridge (ADB) Telemetry**: Real-time handset battery level, temperature, CPU utilization, signal metrics (RSRP/RSRQ/SINR), and 5G network band reporting directly inside the dashboard.
- **Storage & File Sharing**:
  - Auto-mounting hotplug block engine (`50-pendrive-smb`) supporting NTFS (NTFS-3G), FAT32, exFAT, EXT4, and F2FS.
  - Samba 4 storage server pre-configured with secure credentials and zero NetBIOS overhead.
  - Custom DUFS WebDAV server running on port 5000 with dedicated MAXNET file explorer UI.
- **Cybernetic WebUI**:
  - Built with Vite 8, Preact, TypeScript, and Tailwind CSS.
  - Single-bundle deployment with dynamic lazy-loading modules.
  - Full Dark/Light mode support with zero layout shift.
  - Gzip pre-compressed static assets served directly through `uhttpd`.
- **Integrated Terminal**: Embedded `ttyd` web terminal on port 7681 with xterm.js integration and transparent cybernetic styling.
- **Automated Webhooks & Telegram Notifications**:
  - Multi-service alerting (Telegram, Discord, Slack, custom webhook).
  - Compact lockscreen-friendly formatting designed to display critical network status in lockscreen preview banners.
- **Universal Model-Aware OTA Updater**:
  - In-router CGI updater dynamically queries `https://api.github.com/repos/ohhmax/maxnet/releases`.
  - Reads `/tmp/sysinfo/board_name` and automatically pulls the model-matched sysupgrade binary with SHA256 integrity validation.

---

## 3. Project Directory Structure

```text
maxnet/
|-- .github/
|   |-- scripts/
|   |   |-- add_device.py                 # Qualcomm IPQ95xx profile injector
|   |   |-- add_device_mediatek.py        # MediaTek Filogic profile injector
|   |   |-- generate_release_manifest.py  # Release aggregator & manifest generator
|   |   |-- split_sysupgrade.py           # Sysupgrade image processor
|   |   `-- write_config.py               # Dynamic OpenWrt Kconfig generator
|   `-- workflows/
|       `-- maxnet.yml                    # Multi-architecture CI/CD matrix build workflow
|-- files/                                # OpenWrt RootFS Overlay
|   |-- etc/
|   |   |-- config/                       # Pre-configured network, samba4, ttyd, usb_wan
|   |   |-- hotplug.d/                    # USB tethering & USB pendrive automount hooks
|   |   |-- init.d/                       # Daemons: dufs, multilinkd, trafficd, watchdogs
|   |   `-- uci-defaults/                 # First-boot automatic setup routines
|   |-- usr/bin/                          # Custom executables, adb-wrapper, dufs, daemons
|   `-- www/                              # Web server root
|       |-- cgi-bin/                      # 23 High-performance shell/JSON backend endpoints
|       |-- dist/                         # Vite production build distribution
|       `-- dufs-assets/                  # Custom DUFS WebDAV user interface assets
|-- frontend/                             # Modern WebUI Source Code
|   |-- src/                              # TypeScript / CSS / JS source files
|   |-- public/                           # Static public assets (icons, certs, terminal)
|   |-- package.json                      # Dependencies and scripts
|   |-- tailwind.config.js                # Tailwind CSS design tokens
|   |-- tsconfig.json                     # TypeScript compilation config
|   `-- vite.config.ts                    # Build pipeline with gzip precompression
|-- target/                               # OpenWrt Target Trees
|   |-- linux/mediatek/dts/               # MediaTek MT7986A device tree sources
|   `-- linux/qualcommbe/                 # Qualcomm IPQ95xx DTS and kernel patches
|-- build_firmware.sh                     # Local multi-architecture build engine
|-- deploy-web.sh                         # 1-second atomic live UI deployment to router
`-- README.md                             # Comprehensive project documentation
```

---

## 4. Frontend Development & Workflow

The frontend source code is located in [frontend/](file:///home/max/Projects/maxnet/frontend/).

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

### Development Server

To run a live local development server with hot-reload and proxy to a physical router at `10.0.0.1`:

```bash
cd frontend
npm install
npm run dev
```

The dev server will launch on `http://localhost:3000` and proxy all `/cgi-bin/*` API calls to `http://10.0.0.1`.

### Production Compilation

To compile production assets:

```bash
cd frontend
npm run build
```

This compiles optimized bundles to `files/www/dist/` and automatically creates gzip `.gz` pre-compressed siblings.

### Live 1-Command Deployment to Router

To compile the frontend and deploy it directly to a running router via atomic tar stream over SSH:

```bash
./deploy-web.sh 10.0.0.1
```

---

## 5. Automated CI/CD Firmware Pipeline

The GitHub Actions workflow [.github/workflows/maxnet.yml](file:///home/max/Projects/maxnet/.github/workflows/maxnet.yml) executes a full automated pipeline on every push to `main`:

1. **Frontend Compilation**: Automatically installs Node.js, compiles the Vite frontend, generates gzip pre-compressed assets, and syncs them to `files/www/`.
2. **Matrix Compilation**:
   - `qualcommbe` worker compiles firmware for Qualcomm IPQ95xx models.
   - `mediatek` worker compiles firmware for MediaTek Filogic models.
3. **Artifact Aggregation**: Harvests sysupgrade binaries from both architecture builds.
4. **Manifest Generation**: Generates `manifest.json` mapping each router model to its corresponding binary URL and SHA256 checksum.
5. **Universal Release Publication**: Creates a tagged GitHub Release with all sysupgrade binaries, `sha256sums`, and `manifest.json`.

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

## 7. Model-Aware In-Router OTA Updates

Routers running MAXNET automatically query the release feed:

```bash
# Check for updates from router CLI
/www/cgi-bin/update check

# Apply update for the active hardware model
/www/cgi-bin/update flash
```

The update script determines the exact router hardware from `/tmp/sysinfo/board_name`, matches the entry in `manifest.json`, downloads the corresponding sysupgrade image to `/tmp/`, verifies its SHA256 checksum, and safely executes `sysupgrade -n /tmp/sysupgrade.bin`.
