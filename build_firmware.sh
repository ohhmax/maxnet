#!/usr/bin/env bash
# ==============================================================================
# MAXNET OPENWRT LOCAL MULTI-DEVICE FIRMWARE BUILD ENGINE
# Supports both Qualcomm (JIDU6811/6911/6611/6411/6111) and MediaTek (JIDU6801/6401/6101/6j01)
# Usage:
#   ./build_firmware.sh qualcommbe   (or jidu6811 / jidu6911)
#   ./build_firmware.sh mediatek     (or jidu6801 / jidu6401)
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
CUSTOM_DIR="${SCRIPT_DIR}"
BUILD_DIR="${BASE_DIR}/openwrt"

REQ_TARGET="${1:-qualcommbe}"

case "$REQ_TARGET" in
    *6801*|*6401*|*6101*|*6j01*|*mediatek*|*filogic*)
        TARGET_ARCH="mediatek"
        TARGET_NAME="MediaTek Filogic (JIDU6801 / JIDU6401 / JIDU6101 / JIDU6J01)"
        BIN_SUBDIR="bin/targets/mediatek/filogic"
        ;;
    *)
        TARGET_ARCH="qualcommbe"
        TARGET_NAME="Qualcomm IPQ95xx (JIDU6811 / JIDU6911 / JIDU6611 / JIDU6411 / JIDU6111)"
        BIN_SUBDIR="bin/targets/qualcommbe/ipq95xx"
        ;;
esac

echo "========================================================"
echo " [*] MAXNET OPENWRT FIRMWARE BUILD ENGINE"
echo " [*] Selected Architecture: ${TARGET_NAME}"
echo "========================================================"

if [ ! -d "${BUILD_DIR}/.git" ]; then
    echo "[*] Cloning OpenWrt shallow repository..."
    git clone --depth 1 https://github.com/openwrt/openwrt.git "${BUILD_DIR}"
fi

cd "${BUILD_DIR}"

echo "[*] Compiling verified modern MAXNET UI..."
if [ -d "${CUSTOM_DIR}/frontend" ]; then
    (
        cd "${CUSTOM_DIR}/frontend"
        npm run build
    )

    DIST_INDEX="${CUSTOM_DIR}/files/www/dist/index.html"
    if [ ! -s "${DIST_INDEX}" ] || [ ! -d "${CUSTOM_DIR}/files/www/dist/assets" ]; then
        echo "[!] CRITICAL ERROR: Frontend build produced invalid or missing dist artifacts!"
        exit 1
    fi

    INDEX_SIZE=$(stat -c%s "${DIST_INDEX}" 2>/dev/null || stat -f%z "${DIST_INDEX}")
    if [ "${INDEX_SIZE}" -lt 1000 ]; then
        echo "[!] CRITICAL ERROR: dist/index.html size (${INDEX_SIZE}B) indicates incomplete skeleton!"
        exit 1
    fi

    echo "[*] Syncing verified modern distribution into files/www/..."
    cp -a "${CUSTOM_DIR}/files/www/dist/." "${CUSTOM_DIR}/files/www/"
fi

echo "[*] Normalizing overlay permissions (0755 for CGI/dirs, 0644 for assets)..."
chmod -R 0755 "${CUSTOM_DIR}/files/www/cgi-bin"
chmod 0755 "${CUSTOM_DIR}/files/www/cgi-bin/"*
find "${CUSTOM_DIR}/files/www" -type d -exec chmod 0755 {} +
find "${CUSTOM_DIR}/files/www" -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.svg" -o -name "*.gz" \) -exec chmod 0644 {} +

cp -r "${CUSTOM_DIR}/files" "${BUILD_DIR}/"

if [ "$TARGET_ARCH" = "qualcommbe" ]; then
    echo "[*] Syncing Qualcomm IPQ95xx DTS files & patches..."
    mkdir -p "${BUILD_DIR}/target/linux/qualcommbe/dts/qcom/"
    cp -r "${CUSTOM_DIR}/target/linux/qualcommbe/"* "${BUILD_DIR}/target/linux/qualcommbe/"

    echo "[*] Stripping debug symbols in target config-6.18..."
    sed -i 's/CONFIG_DEBUG_INFO=y/# CONFIG_DEBUG_INFO is not set\nCONFIG_DEBUG_INFO_NONE=y/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_DEBUG_BUGVERBOSE=y/# CONFIG_DEBUG_BUGVERBOSE is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_LOCK_DEBUGGING_SUPPORT=y/# CONFIG_LOCK_DEBUGGING_SUPPORT is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_ARM64_PTR_AUTH=y/# CONFIG_ARM64_PTR_AUTH is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_ARM64_PTR_AUTH_KERNEL=y/# CONFIG_ARM64_PTR_AUTH_KERNEL is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_ARM64_GCS=y/# CONFIG_ARM64_GCS is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
    sed -i 's/CONFIG_ARM64_SVE=y/# CONFIG_ARM64_SVE is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true

    echo "[*] Registering Qualcomm IPQ95xx device profiles..."
    python3 "${CUSTOM_DIR}/.github/scripts/add_device.py" target/linux/qualcommbe/image/ipq95xx.mk
elif [ "$TARGET_ARCH" = "mediatek" ]; then
    echo "[*] Syncing MediaTek Filogic DTS files..."
    mkdir -p "${BUILD_DIR}/target/linux/mediatek/dts/"
    cp -r "${CUSTOM_DIR}/target/linux/mediatek/dts/"* "${BUILD_DIR}/target/linux/mediatek/dts/"

    echo "[*] Registering MediaTek Filogic device profiles..."
    python3 "${CUSTOM_DIR}/.github/scripts/add_device_mediatek.py" target/linux/mediatek/image/filogic.mk
fi

echo "[*] Updating and installing OpenWrt package feeds..."
./scripts/feeds update -a
./scripts/feeds install -a

rm -rf tmp

echo "[*] Configuring .config for ${TARGET_ARCH}..."
python3 "${CUSTOM_DIR}/.github/scripts/write_config.py" .config --target "$TARGET_ARCH"
make defconfig
python3 "${CUSTOM_DIR}/.github/scripts/write_config.py" .config --target "$TARGET_ARCH"
make defconfig

echo "[*] Downloading sources..."
make download -j$(nproc)

echo "[*] Compiling OpenWrt Firmware for ${TARGET_NAME}..."
make -j$(nproc) || make -j1 V=s

echo "========================================================"
echo " [+] BUILD COMPLETE! Binaries located in:"
echo "      ${BUILD_DIR}/${BIN_SUBDIR}/"
echo "========================================================"
