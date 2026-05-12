#!/usr/bin/env bash
# coordination-heartbeat-to-kleber.sh — sends 5-min Telegram updates
# Runs forever; sources .env for TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID

COORD_DIR="/root/.openclaw/workspace/coordination"
ENV_FILE="${COORD_DIR}/.env"
STATUS="${COORD_DIR}/status.md"
TASKS="${COORD_DIR}/active-tasks.md"
INBOX="${COORD_DIR}/inbox.md"

# Load credentials
if [ -f "$ENV_FILE" ]; then
  set -a; source "$ENV_FILE"; set +a
else
  echo "❌ No .env found — exiting"
  exit 1
fi

# Validate Telegram vars
if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "❌ Telegram credentials missing — exiting"
  exit 1
fi

send_telegram() {
  local text="$1"
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -F "chat_id=${TELEGRAM_CHAT_ID}" \
    -F "text=${text}" \
    -F "parse_mode=Markdown" > /dev/null 2>&1
}

# Build status summary
build_summary() {
  local hermes_status=$(head -1 "$STATUS")
  local pending=$(grep -c "⏳ Pending" "$TASKS" 2>/dev/null || echo 0)
  local inprog=$(grep -c "🔄 In Progress" "$TASKS" 2>/dev/null || echo 0)
  local done=$(grep -c "✅ Done" "$TASKS" 2>/dev/null || echo 0)
  local inbox_last=$(tail -3 "$INBOX" | head -1)
  local ts=$(date '+%Y-%m-%d %H:%M UTC')

  cat <<EOF
🤖 *Hermes Coordination — 5min heartbeat*

*Time:* ${ts}
*Agent:* ${hermes_status}
*Tasks:* 🙋${inprog} active | ⏳${pending} queued | ✅${done} done

*Latest inbox:*
${inbox_last:+${inbox_last}}
EOF
}

# Main loop
while true; do
  summary=$(build_summary)
  send_telegram "$summary"
  echo "[$(date '+%H:%M')] Telegram update sent"
  sleep 300  # 5 minutes
done
