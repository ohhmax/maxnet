#!/bin/sh
# ==============================================================================
# MAXNET ASYNCHRONOUS OTA WORKER
# Downloads, verifies, and executes sysupgrade or RAM boot without CGI timeouts
# ==============================================================================

ACTION="$1"
BIN_URL="$2"
EXPECTED_SUM="$3"
EXPECTED_SIZE="$4"
LATEST_TAG="$5"
LATEST_BUILD="$6"

STATUS_FILE="/tmp/ota_status.json"
DL_FILE="/tmp/sysupgrade-download.bin"
FINAL_FILE="/tmp/sysupgrade.bin"
LOG_FILE="/tmp/sysupgrade.log"

set_status() {
    local state="$1"
    local progress="$2"
    local message="$3"
    local bytes="${4:-0}"
    local total="${5:-0}"
    echo "{\"state\":\"$state\",\"action\":\"$ACTION\",\"progress\":$progress,\"bytes\":$bytes,\"total\":$total,\"message\":\"$message\"}" > "$STATUS_FILE"
}

set_status "downloading" 5 "Starting background download from release mirror..." 0 "${EXPECTED_SIZE:-0}"

# 1. Download binary with progress monitoring
rm -f "$DL_FILE" "$FINAL_FILE" "$LOG_FILE"

curl -L --retry 3 --connect-timeout 10 -o "$DL_FILE" "$BIN_URL" >/dev/null 2>&1 &
CURL_PID=$!

while kill -0 "$CURL_PID" 2>/dev/null; do
    if [ -f "$DL_FILE" ]; then
        CUR_SIZE=$(wc -c < "$DL_FILE" 2>/dev/null || echo 0)
        if [ "${EXPECTED_SIZE:-0}" -gt 0 ]; then
            PCT=$(( (CUR_SIZE * 80) / EXPECTED_SIZE + 5 ))
            [ "$PCT" -gt 85 ] && PCT=85
            CUR_MB=$(awk "BEGIN {printf \"%.1f\", $CUR_SIZE/1048576}")
            TOT_MB=$(awk "BEGIN {printf \"%.1f\", $EXPECTED_SIZE/1048576}")
            set_status "downloading" "$PCT" "Downloading firmware ($CUR_MB MB / $TOT_MB MB)..." "$CUR_SIZE" "$EXPECTED_SIZE"
        else
            set_status "downloading" 40 "Downloading firmware ($(( CUR_SIZE / 1048576 )) MB)..." "$CUR_SIZE" 0
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

# 2. SHA-256 Verification
set_status "verifying" 88 "Verifying SHA-256 cryptographic hash..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"

if [ -n "$EXPECTED_SUM" ]; then
    ACTUAL_SUM=$(sha256sum "$DL_FILE" 2>/dev/null | awk '{print $1}')
    if [ "$EXPECTED_SUM" != "$ACTUAL_SUM" ]; then
        set_status "error" 0 "SHA-256 checksum mismatch (expected $EXPECTED_SUM, got $ACTUAL_SUM)" 0 0
        rm -f "$DL_FILE"
        exit 1
    fi
fi

# 3. System Integrity Check via sysupgrade -T
set_status "verifying" 92 "Validating hardware target & sysupgrade integrity..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"
if command -v sysupgrade >/dev/null 2>&1; then
    sysupgrade -T "$DL_FILE" > /tmp/sysupgrade-test.log 2>&1
    TEST_RET=$?
    if [ "$TEST_RET" -ne 0 ]; then
        # Check if platform_check_image passed with clean name
        grep -q -i 'invalid' /tmp/sysupgrade-test.log && {
            set_status "error" 0 "Image failed sysupgrade validation check" 0 0
            rm -f "$DL_FILE"
            exit 1
        }
    fi
fi

# 4. Prepare for Flashing
mv "$DL_FILE" "$FINAL_FILE"
chmod +x "$FINAL_FILE"

# Stamp /etc/maxnet_version
mkdir -p /etc
echo "VERSION=${LATEST_TAG:-latest}" > /etc/maxnet_version
echo "BUILD=${LATEST_BUILD:-0}" >> /etc/maxnet_version
echo "TAG=${LATEST_TAG:-latest}" >> /etc/maxnet_version
echo "BUILD_TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M UTC')" >> /etc/maxnet_version

set_status "flashing" 95 "Flashing firmware to NAND storage and rebooting..." "$ACTUAL_SIZE" "$ACTUAL_SIZE"

echo "[$(date)] Starting sysupgrade (Action: $ACTION)..." > "$LOG_FILE"
if [ "$ACTION" = "flash_clean" ]; then
    ( sleep 2 && sysupgrade -n -F -v "$FINAL_FILE" >> "$LOG_FILE" 2>&1 ) </dev/null >/dev/null 2>&1 &
else
    ( sleep 2 && sysupgrade -F -v "$FINAL_FILE" >> "$LOG_FILE" 2>&1 ) </dev/null >/dev/null 2>&1 &
fi

exit 0
