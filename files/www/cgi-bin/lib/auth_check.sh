#!/bin/sh
# ==============================================================================
# MAXNET ENTERPRISE CGI AUTHENTICATION GUARDIAN
# POSIX-Compliant Central Session Authorization Verifier
# Copyright (c) 2026 Mahendra Mali - Max. All Rights Reserved.
# ==============================================================================

SESS_DIR="${SESS_DIR:-/tmp/sessions}"
AUTH_IDLE_TIMEOUT=1800 # 30 minutes idle timeout

send_unauthorized() {
    printf "Status: 401 Unauthorized\r\n"
    printf "Content-Type: application/json\r\n"
    printf "Cache-Control: no-cache, no-store, must-revalidate\r\n\r\n"
    printf '{"error":"Unauthorized","message":"Authentication required or session expired"}\n'
    exit 0
}

require_auth() {
    # Allow preflight OPTIONS requests cleanly
    if [ "${REQUEST_METHOD:-}" = "OPTIONS" ]; then
        printf "Status: 204 No Content\r\n"
        printf "Content-Type: text/plain\r\n\r\n"
        exit 0
    fi

    AUTH_TOKEN=""

    # 1. Check Authorization header (Bearer <token> or raw token)
    if [ -n "${HTTP_AUTHORIZATION:-}" ]; then
        AUTH_TOKEN=$(printf "%s" "$HTTP_AUTHORIZATION" | sed -e 's/^[bB][eE][aA][rR][eE][rR][ ]*//' -e 's/[ ]*$//')
    fi

    # 2. Check X-Session-Token header
    if [ -z "$AUTH_TOKEN" ] && [ -n "${HTTP_X_SESSION_TOKEN:-}" ]; then
        AUTH_TOKEN="$HTTP_X_SESSION_TOKEN"
    fi

    # 3. Check query string (?token=...)
    if [ -z "$AUTH_TOKEN" ] && [ -n "${QUERY_STRING:-}" ]; then
        AUTH_TOKEN=$(printf "%s" "$QUERY_STRING" | sed -n 's/^.*token=\([^&]*\).*$/\1/p')
    fi

    # 4. Check JSON body for POST requests if token not yet found
    if [ -z "$AUTH_TOKEN" ] && [ "${REQUEST_METHOD:-}" = "POST" ] && [ -n "${CONTENT_LENGTH:-}" ] && [ "${CONTENT_LENGTH:-0}" -gt 0 ]; then
        if [ -z "${POST_DATA:-}" ]; then
            POST_DATA=$(head -c "$CONTENT_LENGTH" 2>/dev/null)
            export POST_DATA
        fi
        if [ -n "$POST_DATA" ]; then
            if command -v jq >/dev/null 2>&1; then
                AUTH_TOKEN=$(printf "%s" "$POST_DATA" | jq -r '.token // empty' 2>/dev/null)
            fi
            if [ -z "$AUTH_TOKEN" ]; then
                AUTH_TOKEN=$(printf "%s" "$POST_DATA" | sed -n 's/.*"token"[ ]*:[ ]*"\([a-f0-9]*\)".*/\1/p')
            fi
        fi
    fi

    # Strict token format validation: exactly 32 hex characters
    if [ -z "$AUTH_TOKEN" ] || ! printf "%s" "$AUTH_TOKEN" | grep -Eq '^[a-f0-9]{32}$'; then
        send_unauthorized
    fi

    SESS_FILE="$SESS_DIR/$AUTH_TOKEN"
    if [ ! -f "$SESS_FILE" ] || [ ! -s "$SESS_FILE" ]; then
        send_unauthorized
    fi

    # Check session expiration (idle timeout 30 min)
    NOW=$(date +%s)
    LAST_ACTIVE=""
    if command -v jq >/dev/null 2>&1; then
        LAST_ACTIVE=$(jq -r '.last_active // .created // 0' "$SESS_FILE" 2>/dev/null)
    fi
    if [ -z "$LAST_ACTIVE" ] || [ "$LAST_ACTIVE" = "0" ]; then
        LAST_ACTIVE=$(awk -F: '/"last_active"/{gsub(/[^0-9]/,"",$2); print $2}' "$SESS_FILE" 2>/dev/null)
    fi
    [ -z "$LAST_ACTIVE" ] && LAST_ACTIVE=0

    IDLE_SEC=$((NOW - LAST_ACTIVE))
    if [ "$IDLE_SEC" -gt "$AUTH_IDLE_TIMEOUT" ] || [ "$IDLE_SEC" -lt 0 ]; then
        rm -f "$SESS_FILE"
        send_unauthorized
    fi

    # Refresh last_active in session file
    TMP_SESS="$SESS_DIR/.tmp_$AUTH_TOKEN"
    if command -v jq >/dev/null 2>&1; then
        jq --argjson now "$NOW" '.last_active = $now' "$SESS_FILE" > "$TMP_SESS" 2>/dev/null && mv -f "$TMP_SESS" "$SESS_FILE"
    fi

    export CURRENT_AUTH_TOKEN="$AUTH_TOKEN"
    return 0
}
