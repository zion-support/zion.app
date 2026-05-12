#!/usr/bin/env bash
# scripts/uptime-monitor.sh - Autonomous uptime monitor with Telegram alerts
# Runs every 5 minutes via cron or GitHub Actions
# Uses only free tools: curl, bash, jq

set -euo pipefail

APP_URL="${APP_URL:-http://localhost:3000/}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-8435383377}"
STATE_FILE="${STATE_FILE:-$HOME/.hermes/state/uptime-last-status}"
LOG_FILE="${LOG_FILE:-$HOME/.hermes/memory/uptime-monitor.log}"
TIMEOUT=10

mkdir -p "$(dirname "$STATE_FILE")" "$(dirname "$LOG_FILE")"

log() {
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" | tee -a "$LOG_FILE"
}

send_alert() {
  local message="$1"
  if [[ -n "$TELEGRAM_BOT_TOKEN" ]]; then
    curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=${message}" \
      -d "parse_mode=Markdown" \
      --max-time 10 || log "WARN: Telegram alert failed"
  fi
}

# Check health endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$APP_URL" 2>/dev/null || echo "000")
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Read previous state
PREV_STATUS="unknown"
if [[ -f "$STATE_FILE" ]]; then
  PREV_STATUS=$(cat "$STATE_FILE" 2>/dev/null || echo "unknown")
fi

if [[ "$HTTP_CODE" == "200" ]]; then
  CURRENT_STATUS="up"
  log "OK: App responding with HTTP $HTTP_CODE"

  # Alert on recovery
  if [[ "$PREV_STATUS" == "down" ]]; then
    send_alert "✅ *App Recovered*\nThe app at $APP_URL is back online.\nTime: $CURRENT_TIME\nPreviously down since last check."
  fi
else
  CURRENT_STATUS="down"
  log "FAIL: App returned HTTP $HTTP_CODE"

  # Alert on new outage only (avoid spam)
  if [[ "$PREV_STATUS" != "down" ]]; then
    send_alert "🚨 *App Down!*\nThe app at $APP_URL is not responding.\nHTTP Code: $HTTP_CODE\nTime: $CURRENT_TIME"
  fi
fi

# Save state for next run
echo "$CURRENT_STATUS" > "$STATE_FILE"

# Log summary every 10th run (every 50 min)
RUN_COUNT_FILE="${STATE_FILE}.count"
COUNT=$(cat "$RUN_COUNT_FILE" 2>/dev/null || echo "0")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$RUN_COUNT_FILE"

if (( COUNT % 10 == 0 )); then
  UPTIME_PCT=$(grep -c "OK:" "$LOG_FILE" 2>/dev/null || echo "0")
  TOTAL_CHECKS=$(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")
  log "SUMMARY: $UPTIME_PCT/$TOTAL_CHECKS checks passed (${UPTIME_PCT:-0}% uptime)"
fi

exit 0