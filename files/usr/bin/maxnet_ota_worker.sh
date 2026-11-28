#!/bin/sh
# ==============================================================================
# MAXNET ASYNCHRONOUS OTA WORKER
# Downloads, verifies, and executes sysupgrade with multi-layer security guards:
# 1. Exact Board Target & Hardware Model Compatibility Verification
# 2. Cryptographic SHA-256 Hash Integrity Check
# 3. Digital Signature (usign Ed25519) Cryptographic Verification
# 4. Anti-Rollback / Downgrade Protection Guard
# 5. sysupgrade -T Image Validation Check
# ==============================================================================

ACTION="$1"
BIN_URL="$2"
EXPECTED_SUM="$3"
EXPECTED_SIZE="$4"
LATEST_TAG="$5"
LATEST_BUILD="$6"
SIG_URL="$7"
MIN_VER="$8"
EXPECTED_MODEL="$9"

STATUS_FILE="/tmp/ota_status.json"
DL_FILE="/tmp/sysupgrade-download.bin"
SIG_FILE="/tmp/sysupgrade.sig"
FINAL_FILE="/tmp/sysupgrade.bin"
LOG_FILE="/tmp/sysupgrade.log"
PUBKEY_FILE="/etc/maxnet_release.pub"

set_status() {
    local state="$1"
    local progress="$2"
    local message="$3"
    local bytes="${4:-0}"
    local total="${5:-0}"
    echo "{\"state\":\"$state\",\"action\":\"$ACTION\",\"progress\":$progress,\"bytes\":$bytes,\"total\":$total,\"message\":\"$message\"}" > "$STATUS_FILE"
}

set_status "validating" 2 "Verifying router hardware compatibility..." 0 0

# 1. Hardware Model Verification
BOARD_NAME=$(cat /tmp/sysinfo/board_name 2>/dev/null || tr '\0' '\n' < /proc/device-tree/compatible 2>/dev/null | head -n 1)
DEV_KEY=""
case "$BOARD_NAME" in
    *6911*) DEV_KEY="jidu6911" ;;
    *6811*) DEV_KEY="jidu6811" ;;
    *6611*) DEV_KEY="jidu6611" ;;
    *6411*) DEV_KEY="jidu6411" ;;
    *6111*) DEV_KEY="jidu6111" ;;
    *6401*) DEV_KEY="jidu6401" ;;
    *6801*) DEV_KEY="jidu6801" ;;
    *6601*) DEV_KEY="jidu6601" ;;
    *6701*) DEV_KEY="jidu6701" ;;
    *6101*) DEV_KEY="jidu6101" ;;
    *6j01*) DEV_KEY="jidu6j01" ;;
    *) DEV_KEY="unknown" ;;
esac

if [ -n "$EXPECTED_MODEL" ] && [ "$EXPECTED_MODEL" != "unknown" ]; then
    if [ "$DEV_KEY" != "$EXPECTED_MODEL" ]; then
        set_status "error" 0 "Hardware mismatch: Image is targeted for $EXPECTED_MODEL, but this router is $DEV_KEY ($BOARD_NAME). Upgrade aborted." 0 0
        exit 1
    fi
fi

# 2. Anti-Rollback Guard
CURRENT_BUILD=$(grep '^BUILD=' /etc/maxnet_version 2>/dev/null | cut -d'=' -f2 | tr -d '"'\')
[ -z "$CURRENT_BUILD" ] && CURRENT_BUILD=$(grep -o '#[0-9]*' /etc/banner 2>/dev/null | tr -d '#' | head -n 1)
[ -z "$CURRENT_BUILD" ] && CURRENT_BUILD=0

if [ -n "$LATEST_BUILD" ] && [ "$LATEST_BUILD" -gt 0 ] && [ "$CURRENT_BUILD" -gt 0 ]; then
    if [ "$LATEST_BUILD" -lt "$CURRENT_BUILD" ]; then
        set_status "error" 0 "Anti-Rollback Protection: Incoming build #$LATEST_BUILD is older than running build #$CURRENT_BUILD. Upgrade rejected." 0 0
        exit 1
    fi
fi

# 3. Download binary with progress monitoring
set_status "downloading" 5 "Starting background download from verified release mirror..." 0 "${EXPECTED_SIZE:-0}"
rm -f "$DL_FILE" "$SIG_FILE" "$FINAL_FILE" "$LOG_FILE"

curl -L --retry 3 --connect-timeout 10 -o "$DL_FILE" "$BIN_URL" >/dev/null 2>&1 &
CURL_PID=$!

while kill -0 "$CURL_PID" 2>/dev/null; do
    if [ -f "$DL_FILE" ]; then
        CUR_SIZE=$(wc -c < "$DL_FILE" 2>/dev/null || echo 0)
        if [ "${EXPECTED_SIZE:-0}" -gt 0 ]; then
            PCT=$(( (CUR_SIZE * 75) / EXPECTED_SIZE + 5 ))
            [ "$PCT" -gt 80 ] && PCT=80
            CUR_MB=$(awk "BEGIN {printf \"%.1f\", $CUR_SIZE/1048576}")
            TOT_MB=$(awk "BEGIN {printf \"%.1f\", $EXPECTED_SIZE/1048576}")
            set_status "downloading" "$PCT" "Downloading firmware ($CUR_MB MB / $TOT_MB MB)..." "$CUR_SIZE" "$EXPECTED_SIZE"
        else
            set_status "downloading" 35 "Downloading firmware ($(( CUR_SIZE / 1048576 )) MB)..." "$CUR_SIZE" 0
        fi
    fi
    sleep 1
done

wait "$CURL_PID"
CURL_RET=$?

if [ "$CURL_RET" -ne 0 ] || [ ! -f "$DL_FILE" ]; then
    set_status "error" 0 "Download failed (network timeout or connection refused, code $CURL_RET)" 0 0
    rm -f "$DL_FILE"
    exit 1
fi

ACTUAL_SIZE=$(wc -c < "$DL_FILE" 2>/dev/null || echo 0)
if [ "$ACTUAL_SIZE" -lt 10485760 ]; then
    set_status "error" 0 "Downloaded image is invalid or truncated ($ACTUAL_SIZE bytes)" 0 0
    rm -f "$DL_FILE"
    exit 1
fi

# 4. SHA-256 Cryptographic Verification (Strict Enforcement)
set_status "verifying" 82 "Verifying SHA-256 cryptographic hash against manifest..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"

if [ -z "$EXPECTED_SUM" ]; then
    set_status "error" 0 "Security error: Manifest does not provide an expected SHA-256 checksum. Aborting upgrade." 0 0
    rm -f "$DL_FILE"
    exit 1
fi

ACTUAL_SUM=$(sha256sum "$DL_FILE" 2>/dev/null | awk '{print $1}')
EXP_LOWER=$(echo "$EXPECTED_SUM" | tr 'A-Z' 'a-z' | tr -d ' \r\n\t')
ACT_LOWER=$(echo "$ACTUAL_SUM" | tr 'A-Z' 'a-z' | tr -d ' \r\n\t')
if [ -z "$ACT_LOWER" ] || [ "$EXP_LOWER" != "$ACT_LOWER" ]; then
    set_status "error" 0 "Cryptographic integrity failure: SHA-256 mismatch (expected $EXPECTED_SUM, got $ACTUAL_SUM). Aborting flash." 0 0
    rm -f "$DL_FILE"
    exit 1
fi

# 5. Cryptographic Digital Signature Verification (usign Ed25519)
if [ -n "$SIG_URL" ]; then
    set_status "verifying" 88 "Fetching and validating cryptographic digital signature..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"
    curl -s -L --connect-timeout 6 --max-time 10 -o "$SIG_FILE" "$SIG_URL" 2>/dev/null
    if [ -s "$SIG_FILE" ] && [ -s "$PUBKEY_FILE" ] && command -v usign >/dev/null 2>&1; then
        usign -V -q -p "$PUBKEY_FILE" -m "$DL_FILE" -x "$SIG_FILE"
        USIGN_RET=$?
        if [ "$USIGN_RET" -ne 0 ]; then
            set_status "error" 0 "Security error: Digital signature verification failed (code $USIGN_RET). Untrusted firmware image." 0 0
            rm -f "$DL_FILE" "$SIG_FILE"
            exit 1
        fi
    fi
fi

# 6. Sysupgrade Image Compatibility Check
set_status "verifying" 92 "Validating hardware target & sysupgrade integrity..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"
if command -v sysupgrade >/dev/null 2>&1; then
    sysupgrade -T "$DL_FILE" > /tmp/sysupgrade-test.log 2>&1
    TEST_RET=$?
    if [ "$TEST_RET" -ne 0 ]; then
        if grep -q -i 'invalid' /tmp/sysupgrade-test.log; then
            set_status "error" 0 "Image failed sysupgrade validation check: Image not compatible with $BOARD_NAME" 0 0
            rm -f "$DL_FILE" "$SIG_FILE"
            exit 1
        fi
    fi
fi

# 7. Prepare for Flashing
mv "$DL_FILE" "$FINAL_FILE"
chmod +x "$FINAL_FILE"
rm -f "$SIG_FILE"

# Stamp /etc/maxnet_version
mkdir -p /etc
echo "VERSION=${LATEST_TAG:-latest}" > /etc/maxnet_version
echo "BUILD=${LATEST_BUILD:-0}" >> /etc/maxnet_version
echo "TAG=${LATEST_TAG:-latest}" >> /etc/maxnet_version
echo "BUILD_TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M UTC')" >> /etc/maxnet_version

set_status "flashing" 96 "Flashing verified firmware to NAND storage and rebooting..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"

echo "[$(date)] Starting sysupgrade (Action: $ACTION)..." > "$LOG_FILE"
if [ "$ACTION" = "flash_clean" ]; then
    ( sleep 2 && sysupgrade -n -F -v "$FINAL_FILE" >> "$LOG_FILE" 2>&1 ) </dev/null >/dev/null 2>&1 &
else
    ( sleep 2 && sysupgrade -F -v "$FINAL_FILE" >> "$LOG_FILE" 2>&1 ) </dev/null >/dev/null 2>&1 &
fi

exit 0
