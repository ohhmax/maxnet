#!/usr/bin/env bash
# ==============================================================================
# MAXNET OPENWRT UI BUILD & LIVE HOT-SYNC PIPELINE
# Verified production builder & atomic sync to router root@10.0.0.1
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"
FILES_WWW_DIR="${SCRIPT_DIR}/files/www"
DIST_DIR="${FILES_WWW_DIR}/dist"

ROUTER_IP="${1:-10.0.0.1}"
ROUTER_PASS="${ROUTER_PASS:-maxmax}"

echo "========================================================"
echo " [*] MAXNET PRODUCTION BUILD PIPELINE"
echo "========================================================"

# Step 1: Execute Modern Vite Build
if [ ! -d "${FRONTEND_DIR}" ]; then
    echo "[!] ERROR: Frontend directory ${FRONTEND_DIR} not found!"
    exit 1
fi

echo "[*] Compiling verified modern bundle in frontend/..."
(
    cd "${FRONTEND_DIR}"
    npm run build
)

# Step 2: Strict Assertion Gates on Build Artifacts
echo "[*] Validating distribution artifacts in files/www/dist/..."
if [ ! -d "${DIST_DIR}" ]; then
    echo "[!] CRITICAL ERROR: ${DIST_DIR} does not exist!"
    exit 1
fi

if [ ! -s "${DIST_DIR}/index.html" ]; then
    echo "[!] CRITICAL ERROR: ${DIST_DIR}/index.html is missing or empty!"
    exit 1
fi

INDEX_SIZE=$(stat -c%s "${DIST_DIR}/index.html" 2>/dev/null || stat -f%z "${DIST_DIR}/index.html")
if [ "${INDEX_SIZE}" -lt 1000 ]; then
    echo "[!] CRITICAL ERROR: dist/index.html size (${INDEX_SIZE}B) indicates stripped skeleton!"
    echo "    Expected verified cybernetic entry point (> 1000B)."
    exit 1
fi

if [ ! -d "${DIST_DIR}/assets" ] || [ -z "$(ls -A "${DIST_DIR}/assets" 2>/dev/null)" ]; then
    echo "[!] CRITICAL ERROR: ${DIST_DIR}/assets/ is missing or empty!"
    exit 1
fi

# Step 3: Ensure Gzip Pre-Compression Siblings Exist
echo "[*] Verifying pre-compressed .gz assets..."
for f in "${DIST_DIR}/index.html" "${DIST_DIR}/assets"/*.js "${DIST_DIR}/assets"/*.css; do
    if [ -f "$f" ] && [ ! -f "${f}.gz" ]; then
        gzip -k -9 -f "$f"
    fi
done

# Step 4: Synchronize to Local Firmware Overlay (files/www/)
echo "[*] Synchronizing verified assets to local firmware tree: ${FILES_WWW_DIR}..."
cp -a "${DIST_DIR}/." "${FILES_WWW_DIR}/"

# Normalize local permissions
chmod -R 0755 "${FILES_WWW_DIR}/cgi-bin"
chmod 0755 "${FILES_WWW_DIR}/cgi-bin/"*
find "${FILES_WWW_DIR}" -type d -exec chmod 0755 {} +
find "${FILES_WWW_DIR}" -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.svg" -o -name "*.gz" \) -exec chmod 0644 {} +

# Step 5: Hot-Sync Deployment to Target Router via scp -O
echo "========================================================"
echo " [*] DEPLOYING VERIFIED ASSETS TO ROUTER: root@${ROUTER_IP}:/www/"
echo "========================================================"

SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=4 -o StrictHostKeyChecking=no)
SCP_CMD=(scp -O -p -r)

# Pre-determine whether SSH key auth works
SSH_AUTH_MODE="key"
if ! ssh "${SSH_OPTS[@]}" "root@${ROUTER_IP}" exit 2>/dev/null; then
    if command -v sshpass >/dev/null 2>&1; then
        SSH_AUTH_MODE="sshpass"
    else
        SSH_AUTH_MODE="direct"
    fi
fi

run_scp() {
    local dst="${@: -1}"
    local srcs=("${@:1:$#-1}")
    if [ "${SSH_AUTH_MODE}" = "key" ]; then
        "${SCP_CMD[@]}" "${SSH_OPTS[@]}" "${srcs[@]}" "root@${ROUTER_IP}:${dst}"
    elif [ "${SSH_AUTH_MODE}" = "sshpass" ]; then
        sshpass -p "${ROUTER_PASS}" "${SCP_CMD[@]}" -o StrictHostKeyChecking=no "${srcs[@]}" "root@${ROUTER_IP}:${dst}"
    else
        "${SCP_CMD[@]}" "${srcs[@]}" "root@${ROUTER_IP}:${dst}"
    fi
}

run_ssh() {
    local cmd="$1"
    if [ "${SSH_AUTH_MODE}" = "key" ]; then
        ssh "${SSH_OPTS[@]}" "root@${ROUTER_IP}" "${cmd}"
    elif [ "${SSH_AUTH_MODE}" = "sshpass" ]; then
        sshpass -p "${ROUTER_PASS}" ssh -o StrictHostKeyChecking=no "root@${ROUTER_IP}" "${cmd}"
    else
        ssh "root@${ROUTER_IP}" "${cmd}"
    fi
}

# 5A. Deploy Web UI Bundle (dist) and CGI Endpoints atomically via tar
echo "[*] Hot-syncing dist/ web assets and CGI endpoints via atomic stream..."
tar -cf - -C "${DIST_DIR}" . | run_ssh "tar -xf - -C /www/"
tar -cf - -C "${FILES_WWW_DIR}" cgi-bin | run_ssh "tar -xf - -C /www/"

# Synchronize index.html and index.htm
run_ssh "cp -f /www/index.html /www/index.htm 2>/dev/null || true"

# 5B. Deploy Terminal Interface & Certs if present
if [ -f "${FILES_WWW_DIR}/ttyd.html" ]; then
    tar -cf - -C "${FILES_WWW_DIR}" ttyd.html | run_ssh "tar -xf - -C /www/"
fi
for cert in "${FILES_WWW_DIR}"/*.crt "${FILES_WWW_DIR}"/*.mobileconfig; do
    if [ -f "$cert" ]; then
        cert_name="$(basename "$cert")"
        tar -cf - -C "${FILES_WWW_DIR}" "$cert_name" | run_ssh "tar -xf - -C /www/"
    fi
done

# Step 6: Normalize Remote Permissions on Router
echo "[*] Normalizing router /www permissions (0755 for CGI/dirs, 0644 for assets)..."
run_ssh "
    chmod -R 0755 /www/cgi-bin /www/assets 2>/dev/null || true
    chmod 0755 /www/cgi-bin/* 2>/dev/null || true
    find /www -type d -exec chmod 0755 {} + 2>/dev/null || true
    find /www -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.gz' \) -exec chmod 0644 {} + 2>/dev/null || true
"

# Step 7: Live Service Verification
echo "[*] Performing live HTTP health verification against http://${ROUTER_IP}/..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${ROUTER_IP}/" || echo "000")
if [ "${HTTP_CODE}" != "200" ]; then
    echo "[!] WARNING: Root page returned HTTP status ${HTTP_CODE}!"
else
    echo "    [✓] HTTP 200 OK received from http://${ROUTER_IP}/"
fi

STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${ROUTER_IP}/cgi-bin/status" || echo "000")
if [ "${STATUS_CODE}" != "200" ]; then
    echo "[!] WARNING: /cgi-bin/status returned HTTP status ${STATUS_CODE}!"
else
    echo "    [✓] HTTP 200 OK received from http://${ROUTER_IP}/cgi-bin/status"
fi

echo "========================================================"
echo " [+] SUCCESS: MAXNET UI Verified & Deployed to http://${ROUTER_IP}/"
echo "========================================================"
