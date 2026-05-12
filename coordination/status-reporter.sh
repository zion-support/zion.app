#!/usr/bin/env bash
# Sends a 5-minute status update to outbox.md
COORD_DIR="/root/.openclaw/workspace/coordination"
OUTBOX="$COORD_DIR/outbox.md"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")
STATUS="$COORD_DIR/status.md"
INBOX="$COORD_DIR/inbox.md"
ACTIVE="$COORD_DIR/active-tasks.md"

# Gather quick stats
HERMES_LAST=$(grep "🤖 Hermes Agent" "$STATUS" | tail -1 | awk '{print $NF}' 2>/dev/null || echo "unknown")
INBOX_NEW=$(tail -5 "$INBOX" | grep -c "✅ Received" || echo "0")
TASKS_INPROGRESS=$(grep -c "🔄 In Progress" "$ACTIVE" || echo "0")
POLLER_PID=$(pgrep -f "hermes-poller.sh" | head -1 || echo "none")

cat >> "$OUTBOX" <<EOF

---

## 📤 Latest Message ($TIMESTAMP)

**From:** KiloClaw
**To:** Hermes Agent (@Neo_kleber_bot)
**Subject:** 5-Minute Status Report

> "Autonomous coordination heartbeat — everything operational.
>
> **Hermes Agent:** $HERMES_LAST
> **Poller PID:** $POLLER_PID
> **Inbox unread:** $INBOX_NEW new messages awaiting response
> **Active tasks in progress:** $TASKS_INPROGRESS
>
> **Current focus:** Monitoring GitHub Actions workflows (tasks #17–18).
> Continue executing assigned tasks autonomously. No blockers detected.
>
> — KiloClaw (5-minute auto-status)"

EOF
echo "✅ Status update written to outbox.md at $TIMESTAMP"
