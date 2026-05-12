#!/usr/bin/env bash
# hermes-poller.sh v2.4 — enhanced with GitHub Actions run monitoring
set -euo pipefail

COORD_DIR="/root/.openclaw/workspace/coordination"
INBOX="${COORD_DIR}/inbox.md"
OUTBOX="${COORD_DIR}/outbox.md"
STATUS="${COORD_DIR}/status.md"
TASKS="${COORD_DIR}/active-tasks.md"
LOG="${HOME}/.hermes/memory/coordination.log"
CLAIM_FLAG="${COORD_DIR}/.hermes_claimed"
CHECK_ACTIONS_SCRIPT="${COORD_DIR}/check-github-actions-runs.sh"

# Ensure single instance
LOCKDIR="/tmp/hermes-poller.lock"
if ! mkdir "$LOCKDIR" 2>/dev/null; then
  echo "Another Hermes instance is running (lock held)" >&2
  exit 1
fi
trap 'rm -rf "$LOCKDIR"; exit' INT TERM EXIT

mkdir -p "$(dirname "$LOG")"
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

# Source .env and set Telegram vars
if [ -f "${COORD_DIR}/.env" ]; then
  set -a; source "${COORD_DIR}/.env"; set +a
  log "Sourced .env"
fi

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"
HAS_TELEGRAM=false
if [ -n "${TELEGRAM_BOT_TOKEN}" ] && [ -n "${TELEGRAM_CHAT_ID}" ]; then
  HAS_TELEGRAM=true
fi

# Update a task row by ID
update_task() {
  local id="$1"; local newstat="$2"; local notes="$3"
  # Escape slashes and pipes for sed
  local nEsc="${notes//\\//\\\\/}"
  sed -i -E "/\| #${id} \|/s/\|[^|]*\|/| ${newstat} |/; /\| #${id} \|/s/(\| [^|]*\|[^|]*\|)[^|]*/\\1 ${nEsc} |/" "$TASKS" 2>/dev/null || true
  log "Task #${id} → ${newstat}"
}

# Auto-claim all pending Hermes tasks
auto_claim() {
  [ -f "$TASKS" ] || return
  while IFS= read -r line; do
    [[ "$line" =~ \|#[[:space:]]*([0-9]+) ]] || continue
    tid="${BASH_REMATCH[1]}"
    if echo "$line" | grep -q "| Hermes | ⏳ Pending"; then
      update_task "$tid" "🔄 In Progress" "Auto-claimed $(date '+%H:%M')"
    fi
  done < <(grep -E '\| *Hermes *\| *⏳ Pending' "$TASKS")
}

# Check GitHub Actions run status via API and update task
check_workflow_run() {
  local wf_file="$1"      # e.g. accessibility-audit.yml
  local task_id="$2"
  local result
  if [ ! -x "$CHECK_ACTIONS_SCRIPT" ]; then
    log "check script missing, skipping ${wf_file}"
    return
  fi
  result="$(${CHECK_ACTIONS_SCRIPT} "${wf_file}" 24 2>/dev/null || echo '{"error":"script_failed"}')"
  local latest_id latest_status latest_concl runs_count
  latest_id=$(echo "$result" | jq -r '.latest_run_id // "none"')
  latest_status=$(echo "$result" | jq -r '.latest_status // "none"')
  latest_concl=$(echo "$result" | jq -r '.latest_conclusion // "none"')
  runs_count=$(echo "$result" | jq -r '.runs_last_24h // 0')

  local alert=""
  if [ "$latest_id" = "none" ] || [ "$latest_status" = "none" ]; then
    alert="❌ No runs found in last 24h"
  elif [ "$latest_concl" != "success" ]; then
    if [ "$latest_concl" = "failure" ] || [ "$latest_concl" = "cancelled" ]; then
      alert="⚠️ Last run ${latest_concl} (ID:${latest_id})"
    else
      alert="⏳ Last run still ${latest_status}"
    fi
  fi

  if [ -n "$alert" ]; then
    log "Workflow ${wf_file}: ${alert}"
    update_task "${task_id}" "⚠️ Needs Attention" "${alert} — $(date '+%H:%M')"
    printf "\n[$(date '+%H:%M')] %s | %s" "${wf_file}" "${alert}" >> "$INBOX"
  else
    update_task "${task_id}" "🔄 In Progress" "Last run: ${latest_concl} (${latest_id}) — $(date '+%H:%M')"
  fi
}

# Send Telegram status update directly
telegram_send() {
  [ "$HAS_TELEGRAM" = true ] || return 0
  local pending=$(grep -c "⏳ Pending" "$TASKS" 2>/dev/null || echo 0)
  local inprog=$(grep -c "🔄 In Progress" "$TASKS" 2>/dev/null || echo 0)
  local done=$(grep -c "✅ Done" "$TASKS" 2>/dev/null || echo 0)
  local status_line
  status_line=$(head -1 "$STATUS")
  local msg
  msg=$(cat <<EOF
🤖 *Hermes Status — $(date '+%H:%M UTC')*

${status_line}
*Tasks:* 🙋${inprog} active | ⏳${pending} queued | ✅${done} done
EOF
)
  local resp
  resp=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -F "chat_id=${TELEGRAM_CHAT_ID}" \
    -F "text=${msg}" \
    -F "parse_mode=Markdown" 2>&1)
  local ok
  ok=$(echo "$resp" | jq -r '.ok // false' 2>/dev/null)
  if [ "$ok" != "true" ]; then
    log "Telegram send failed: $resp"
  fi
}

# ---- Init ----
echo "🤖 Hermes Agent online – $(date '+%Y-%m-%d %H:%M:%S')" > "$STATUS"
# Initialize inbox with greeting if empty
if [ ! -s "$INBOX" ]; then
  printf "✅ Hermes Agent bootstrapped – %s\nAwaiting instructions…\n" "$(date '+%Y-%m-%d %H:%M:%S')" > "$INBOX.tmp"
  mv "$INBOX.tmp" "$INBOX"
fi
log "Initialized"

# Auto-claim once at startup
if [ ! -f "$CLAIM_FLAG" ]; then
  auto_claim
  touch "$CLAIM_FLAG"
fi

SELF_STATUS_INTERVAL=300
LAST_SELF_STATUS=$(date +%s)
LAST_ACTIONS_CHECK=$(date +%s)   # separate from self-status
ACTIONS_CHECK_INTERVAL=300       # also every 5 min (but independent)

# ---- Loop ----
while true; do
  now=$(date +%s)

  # 1. Outbox (every cycle)
  if [ -s "$OUTBOX" ]; then
    OUT_CONTENT=$(head -1 "$OUTBOX" | tr -d '\n')
    : > "$OUTBOX"
    log "Outbox: ${OUT_CONTENT:0:120}"

    case "$OUT_CONTENT" in
      "STATUS")
        echo "🤖 Hermes — heartbeat $(date '+%H:%M')" > "$STATUS"
        ;;
      "TASK "*)
        tdesc="${OUT_CONTENT#TASK }"
        printf "\n| #%s | %s | Hermes | ⏳ Pending | %s | %s |\n" "$(date '+%s')" "$tdesc" "$(date '+%Y-%m-%d')" "Outbox task" >> "$TASKS"
        echo "🤖 Hermes — task added: $tdesc" > "$STATUS"
        ;;
      "CLAIM_TASKS")
        auto_claim
        echo "🤖 Hermes — claim cycle done" > "$STATUS"
        ;;
      "REPORT_STATUS")
        p=$(grep -c "⏳ Pending" "$TASKS" 2>/dev/null || true)
        i=$(grep -c "🔄 In Progress" "$TASKS" 2>/dev/null || true)
        d=$(grep -c "✅ Done" "$TASKS" 2>/dev/null || true)
        echo "📊 Hermes — 🙋${i} | ⏳${p} | ✅${d}" > "$STATUS"
        ;;
      "SEND_TELEGRAM")
        telegram_send
        echo "🤖 Hermes — telegram sent" > "$STATUS"
        ;;
      *)
        printf "✅ Received: %s\n" "$OUT_CONTENT" > "$INBOX.tmp"
        cat "$INBOX.tmp" "$INBOX" > "$INBOX.tmp2" && mv "$INBOX.tmp2" "$INBOX"
        rm -f "$INBOX.tmp"
        echo "🤖 Hermes — msg: ${OUT_CONTENT:0:60}" > "$STATUS"
        ;;
    esac
  fi

  # 2. Periodic self-status (5 min)
  if [ $((now - LAST_SELF_STATUS)) -ge $SELF_STATUS_INTERVAL ]; then
    p=$(grep -c "⏳ Pending" "$TASKS" 2>/dev/null || true)
    i=$(grep -c "🔄 In Progress" "$TASKS" 2>/dev/null || true)
    echo "🤖 Hermes Agent — heartbeat | ${i} active | ⏳ ${p} queued | $(date '+%H:%M')" > "$STATUS"
    LAST_SELF_STATUS=$now
    log "Self-status heartbeat"
    telegram_send
  fi

  # 3. GitHub Actions run monitoring (every 5 min, offset by 15s from self-status to stagger)
  if [ $((now - LAST_ACTIONS_CHECK)) -ge $ACTIONS_CHECK_INTERVAL ]; then
    if grep -q "| #17 .*Hermes.*🔄 In Progress" "$TASKS" 2>/dev/null; then
      check_workflow_run "accessibility-audit.yml" 17
    fi
    if grep -q "| #18 .*Hermes.*🔄 In Progress" "$TASKS" 2>/dev/null; then
      check_workflow_run "bundle-size-monitor.yml" 18
    fi
    LAST_ACTIONS_CHECK=$now
    log "GitHub Actions check cycle"
  fi

  sleep 30
done
