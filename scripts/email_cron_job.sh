#!/usr/bin/env bash
#
# email_cron_job.sh — Companion wrapper for email_auto_responder.py
#
# Handles token checking and renewal before delegating to the Python
# auto-responder. Designed to be called from cron.
#
# Usage:
#   ./email_cron_job.sh              # dry-run (default)
#   ./email_cron_job.sh --send       # send mode
#   ./email_cron_job.sh --send --max-emails 5
#
# Cron example (runs every 30 minutes during business hours):
#   */30 8-18 * * 1-5 /Users/klebergarciaalcatrao/scripts/email_cron_job.sh --send >> /Users/klebergarciaalcatrao/data/email_cron.log 2>&1
#

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOME_DIR="/Users/klebergarciaalcatrao"
PYTHON_SCRIPT="${SCRIPT_DIR}/email_auto_responder.py"
TOKEN_FILE="${HOME_DIR}/.openclaw/workspace/gog_tokens.json"
GOG_CLI="/opt/homebrew/bin/gog"
GOG_ACCOUNT="${GOG_ACCOUNT:-kleber@ziontechgroup.com}"
LOG_FILE="${HOME_DIR}/data/email_cron.log"
VENV_PYTHON="${SCRIPT_DIR}/.venv/bin/python3"

# Use venv python if available, else system python
if [ -x "${VENV_PYTHON}" ]; then
    PYTHON="${VENV_PYTHON}"
elif command -v python3 &>/dev/null; then
    PYTHON="python3"
else
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ERROR: python3 not found" >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Load access token from gog_tokens.json into GOG_ACCESS_TOKEN
# This lets gog CLI use our OAuth tokens without separate auth setup
# ---------------------------------------------------------------------------
if [ -z "${GOG_ACCESS_TOKEN:-}" ] && [ -f "${TOKEN_FILE}" ]; then
    _tok=$(python3 -c "
import json
try:
    with open('${TOKEN_FILE}', 'r') as f:
        d = json.load(f)
    t = d.get('access_token', '')
    if t:
        print(t)
except:
    pass
" 2>/dev/null)
    if [ -n "${_tok}" ]; then
        GOG_ACCESS_TOKEN="${_tok}"
        export GOG_ACCESS_TOKEN
    fi
fi

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

log() {
    local msg="[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"
    echo "${msg}" >> "${LOG_FILE}" 2>/dev/null || true
    echo "${msg}"
}

# ---------------------------------------------------------------------------
# Token Check
# ---------------------------------------------------------------------------

check_token() {
    log "Checking gog token status..."

    if [ ! -f "${TOKEN_FILE}" ]; then
        log "ERROR: Token file not found at ${TOKEN_FILE}"
        return 1
    fi

    local expiry
    expiry=$(${PYTHON} -c "
import json, sys
try:
    with open('${TOKEN_FILE}', 'r') as f:
        d = json.load(f)
    print(d.get('expiry', ''))
except Exception as e:
    print('', file=sys.stderr)
    sys.exit(1)
" 2>/dev/null) || {
        log "ERROR: Cannot parse token file"
        return 1
    }

    if [ -z "${expiry}" ]; then
        log "WARNING: No expiry field in token file — assuming expired"
        return 1
    fi

    local now_epoch expiry_epoch
    now_epoch=$(date -u +%s)
    expiry_epoch=$(${PYTHON} -c "
from datetime import datetime, timezone
try:
    dt = datetime.fromisoformat('${expiry}'.replace('Z', '+00:00'))
    print(int(dt.timestamp()))
except:
    print(0)
" 2>/dev/null) || expiry_epoch=0

    if [ "${expiry_epoch}" -le "${now_epoch}" ]; then
        log "ERROR: Token expired on ${expiry}. Please renew before running."
        return 1
    fi

    local remaining=$(( (expiry_epoch - now_epoch) / 3600 ))
    log "Token valid for ${remaining}h (expires: ${expiry})"
    return 0
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
    local send_mode_flag=""
    local -a EXTRA_ARGS=()

    while [ $# -gt 0 ]; do
        case "$1" in
            --send)
                send_mode_flag="--send"
                shift
                ;;
            --max-emails)
                EXTRA_ARGS+=("--max-emails" "$2")
                shift 2
                ;;
            --verbose)
                EXTRA_ARGS+=("--verbose")
                shift
                ;;
            --json-output)
                EXTRA_ARGS+=("--json-output")
                shift
                ;;
            --skip-token-check)
                SKIP_TOKEN_CHECK=1
                shift
                ;;
            *)
                EXTRA_ARGS+=("$1")
                shift
                ;;
        esac
    done

    : "${SKIP_TOKEN_CHECK:=0}"
    : "${EXTRA_ARGS[@]:=}"

    log "========================================="
    log "Email Cron Job starting"
    log "Mode: $([ -n "${send_mode_flag}" ] && echo 'SEND' || echo 'DRY-RUN')"
    log "========================================="

    if [ "${SKIP_TOKEN_CHECK}" -ne 1 ]; then
        if ! check_token; then
            log "ABORT: Token check failed. Use --skip-token-check to bypass."
            exit 1
        fi
    else
        log "SKIP: Token check bypassed (--skip-token-check)"
    fi

    if [ ! -x "${GOG_CLI}" ]; then
        log "ERROR: gog CLI not found at ${GOG_CLI}"
        exit 1
    fi

    if [ ! -f "${PYTHON_SCRIPT}" ]; then
        log "ERROR: Python script not found at ${PYTHON_SCRIPT}"
        exit 1
    fi

    log "Running: ${PYTHON} ${PYTHON_SCRIPT} ${send_mode_flag} --json-output ${EXTRA_ARGS[*]}"

    set +e
    OUTPUT=$(
        "${PYTHON}" "${PYTHON_SCRIPT}" \
            ${send_mode_flag:+"${send_mode_flag}"} \
            --json-output \
            "${EXTRA_ARGS[@]:+${EXTRA_ARGS[@]}}" \
            --skip-token-check \
            2>> "${LOG_FILE}"
    )
    EXIT_CODE=$?
    set -e

    if [ ${EXIT_CODE} -eq 0 ]; then
        log "SUCCESS: Auto-responder completed"
        if [ -n "${OUTPUT}" ]; then
            local summary
            summary=$(echo "${OUTPUT}" | ${PYTHON} -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(f\"  Total: {d.get('total_fetched', '?')}  Replied: {d.get('replied', '?')}  Skipped: {d.get('skipped', '?')}  Errors: {d.get('errors', '?')}\")
except:
    pass
" 2>/dev/null) || true
            [ -n "${summary}" ] && log "${summary}"
        fi
    else
        log "ERROR: Auto-responder exited with code ${EXIT_CODE}"
        [ -n "${OUTPUT}" ] && log "Output: ${OUTPUT}"
        exit ${EXIT_CODE}
    fi

    log "========================================="
    log "Email Cron Job finished"
    log "========================================="
}

main "$@"
