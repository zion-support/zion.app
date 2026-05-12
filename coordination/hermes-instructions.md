# Hermes-Agent Coordination Instructions

## 1️⃣ Workspace & Files

All files are under **/root/.openclaw/workspace/coordination**:

| File | Purpose |
|---------------------|----------------------------------------------------|
| `inbox.md` | Incoming messages / tasks for the agent (read-only for the agent, prepend replies). |
| `outbox.md` | Agent-to-human messages (write-only for the agent, human reads). |
| `status.md` | Current status line (e.g., "online, idle, working on X"). |
| `active-tasks.md` | Simple task table – see format below. |
| `hermes-instructions.md` | **This file** – contains the protocol the agent must follow. |

**Log file:** `~/.hermes/memory/coordination.log` – every read/write is appended here with a timestamp.

---

## 2️⃣ Polling Loop (the core of the agent)

```bash
#!/usr/bin/env bash
# hermes-poller.sh – run forever (or under a systemd/pm2 service)

COORD_DIR="/root/.openclaw/workspace/coordination"
INBOX="${COORD_DIR}/inbox.md"
OUTBOX="${COORD_DIR}/outbox.md"
STATUS="${COORD_DIR}/status.md"
TASKS="${COORD_DIR}/active-tasks.md"
LOG="${HOME}/.hermes/memory/coordination.log"

# Helper – write a line to the log with timestamp
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

# 1️⃣ Initialise – post initial status & acknowledgement
echo "🤖 Hermes Agent online – awaiting instructions" > "$STATUS"
log "Wrote initial status"

# Acknowledge receipt in inbox (prepend a line)
tmp=$(mktemp)
printf "✅ Received coordination file list (inbox/outbox/status/active-tasks) – ready.\n$(cat "$INBOX")" > "$tmp"
mv "$tmp" "$INBOX"
log "Acknowledged receipt in inbox.md"

# 2️⃣ Main loop – every 30 s
while true; do
  # ----------- READ OUTBOX (human replies) -----------------
  if [ -s "$OUTBOX" ]; then
    # Grab the whole file, then clear it (human will repopulate)
    OUT_CONTENT=$(cat "$OUTBOX")
    > "$OUTBOX"
    log "Read outbox.md – content:\n$OUT_CONTENT"

    # Simple command parsing – you can extend this as needed
    case "$OUT_CONTENT" in
      "STATUS" )
        # Human asked for status → write to status.md
        echo "🤖 Hermes Agent is online – last heartbeat $(date '+%H:%M:%S')" > "$STATUS"
        log "Wrote status in response to human request"
        ;;
      "TASK "* )
        # Human gave a new task, e.g. "TASK 123: run audit"
        # Append to active-tasks.md (see format below)
        printf "%s\n" "$OUT_CONTENT" >> "$TASKS"
        log "Appended new task to active-tasks.md"
        ;;
      * )
        # Unrecognised message – just echo back
        tmp=$(mktemp)
        printf "🤖 Got your note:\n%s\n" "$OUT_CONTENT" > "$tmp"
        cat "$tmp" "$INBOX" > "$INBOX.tmp"
        mv "$INBOX.tmp" "$INBOX"
        log "Reply-written to inbox.md (unrecognised command)"
        ;;
    esac
  fi

  # ----------- OPTIONAL: AUTOMATED SUB‑TASKS ----------------
  # Example: if a file run_audit.trigger appears, fire a script.
  if [ -f "${COORD_DIR}/run_audit.trigger" ]; then
    rm "${COORD_DIR}/run_audit.trigger"
    /usr/local/bin/hermes-audit.sh >> "$LOG" 2>&1
    log "Executed audit script via trigger"
  fi

  sleep 30
done
```

---

## 3️⃣ File Formats

### inbox.md (agent writes *at the top* of the file)

```
✅ Received coordination file list (inbox/outbox/status/active-tasks) – ready.
[Optional reply #2 – newest]
[Older entries…]

*Only prepend – never erase older lines; they act as a running log.*
```

### outbox.md (human writes, agent reads)

```
STATUS?  # ask the agent to write its current status
TASK 202 – run security_scanner.sh  # give a new task
NOTE Remember to review the PR once it opens.

*The human can overwrite the whole file each time; the agent clears it after reading.*
```

### status.md (single-line status)

```
🤖 Hermes Agent online – last heartbeat 14:32

*Agent overwrites the whole file each time it wants to broadcast a new status.*
```

### active‑tasks.md (simple markdown table)

```markdown
## 📋 Task Board

| ID | Task | Owner | Status | Created | Notes |
|----|------|-------|--------|---------|-------|
| #001 | Run nightly dependency scanner | Hermes | ✅ Done | 2024-05-11 | Completed successfully |
| #002 | Warm API cache (cache_warmup) | Hermes | 🔄 In Progress | 2024-05-11 | Cache warming, 60% done |
| #003 | Respond to support tickets | Hermes | ⏳ Pending | 2024-05-11 | 3 tickets pending |

**Status legend:** ✅ Done / 🔄 In Progress / ⏳ Pending / ⏸️ Blocked / ❌ Cancelled
```

*Agent adds a new row when it receives a TASK … line from outbox.md. It can also update the Status column (e.g., completed, failed).*

---

## 4️⃣ Credentials — PLACEHOLDER VALUES (replace before first run)

| Service | Variable name (exported in the poller) | Placeholder | Where to set it |
|---------|----------------------------------------|-------------|-----------------|
| GitHub API (for gh CLI) | `GITHUB_TOKEN` | `ghp_XXXXXXXXXXXXXXXXXXXX` | Add to `~/.bashrc` or a `.env` file sourced by the poller. |
| Telegram Bot (to send messages) | `TELEGRAM_BOT_TOKEN` | `123456:ABCDEF...` | Same as above. |
| Telegram Chat ID (where the bot should post) | `TELEGRAM_CHAT_ID` | `-1001234567890` | Same as above. |
| Google Workspace (SMTP for sending mail) | `GMAIL_USER` / `GMAIL_PASS` | `kleber@ziontechgroup.com` / `app-specific-password` | Same as above. |
| Any other API keys (e.g., Stripe, SendGrid) | `STRIPE_SK`, `SENDGRID_API_KEY` | `sk_test_…` / `SG.….` | Same as above. |

**How to set them (example with .env):**

```bash
cat > /root/.openclaw/workspace/coordination/.env <<EOF
export GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXX
export TELEGRAM_BOT_TOKEN=123456:ABCDEF...
export TELEGRAM_CHAT_ID=-1001234567890
export GMAIL_USER=kleber@ziontechgroup.com
export GMAIL_PASS=app-specific-password
EOF
```

Then source the `.env` in the poller script:

```bash
source "${COORD_DIR}/.env"
```

> **Never commit the .env file** to the repo. Keep it outside version control (it lives only on the VM).

---

## 5️⃣ First-Run Checklist

1. **Create the coordination folder** (already exists):
   ```bash
   mkdir -p /root/.openclaw/workspace/coordination
   touch inbox.md outbox.md status.md active-tasks.md
   ```
2. **Place the credential file** (.env) in the same folder (source it from poller).
3. **Copy the poller script** (hermes-poller.sh) into the home directory, `chmod +x`.
4. **Start the poller** (recommended under pm2 so it restarts automatically):
   ```bash
   pm2 start ~/hermes-poller.sh --name hermes-poller
   pm2 save  # persist across reboots
   ```
   Alternatively: `nohup ~/hermes-poller.sh &`
5. **Verify** that status.md now contains something like:
   ```
   🤖 Hermes Agent online – awaiting instructions
   ```
6. **Check the log** (`~/.hermes/memory/coordination.log`) for the "Acknowledged receipt" entry.

If those steps succeed, you'll see the agent's acknowledgement as the *first line* in inbox.md. From there you can write commands to outbox.md and watch the agent respond.

---

## 6️⃣ Example Interaction

**Human (Kleber) writes to `outbox.md`:**
```
STATUS
```

**Hermes Agent (within 30 seconds) updates `status.md`:**
```
🤖 Hermes Agent online – last heartbeat 14:32
```

**Human writes to `outbox.md`:**
```
TASK 101 – Review PR #42 on GitHub repo ziontechgroup/main
```

**Hermes Agent:**
- Appends to `active-tasks.md`:
  ```
  | #101 | Review PR #42 on GitHub | Hermes | ⏳ Pending | 2026-05-11 | PR: ziontechgroup/main#42 |
  ```
- Prepends to `inbox.md`:
  ```
  📝 Task #101 received – will review PR #42 on ziontechgroup/main.
  ✅ Received previous inbox content...
  ```

**Agent then executes the task (using `gh` CLI with `GITHUB_TOKEN`) and updates task status to `🔄 In Progress` → `✅ Done`.**

---

## 7️⃣ Troubleshooting

| Symptom | Fix |
|---------|-----|
| No status updates | Check `hermes-poller.sh` is running (`ps aux | grep hermes`) |
| Log file not created | Create `~/.hermes/memory/` directory first |
| Can't write to files | Ensure permissions: files should be `644`, dirs `755` |
| Missed messages | Agent clears `outbox.md` after each read — human must rewrite to send new commands |

---

## 8️⃣ Integration Notes

**KiloClaw (main agent) will:**
- Read `inbox.md` for Hermes messages
- Respond by writing to `outbox.md`
- Update `active-tasks.md` when claiming/completing tasks
- Respect Hermes capacity signals from `status.md`

**Hermes Agent should:**
- Never edit `inbox.md` except to prepend replies
- Never clear `outbox.md` — KiloClaw handles that
- Keep `status.md` fresh (update every 30s heartbeat)
- Mark tasks promptly when done

---

## 9️⃣ Telegram Status Updates (Optional — Self-Push)

If you want to send your own Telegram updates directly (without an external heartbeat script), add this to your poller:

**Requirements:**
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in your `.env` file
- `curl` and `jq` installed

**Add to your script (after sourcing .env):**

```bash
send_telegram() {
  local text="$1"
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -F "chat_id=${TELEGRAM_CHAT_ID}" \
    -F "text=${text}" \
    -F "parse_mode=Markdown" > /dev/null 2>&1
}

build_telegram_summary() {
  local pending=$(grep -c "⏳ Pending" "$TASKS" 2>/dev/null || echo 0)
  local inprog=$(grep -c "🔄 In Progress" "$TASKS" 2>/dev/null || echo 0)
  local done=$(grep -c "✅ Done" "$TASKS" 2>/dev/null || echo 0)
  local hermes=$(head -1 "$STATUS")
  cat <<EOF
🤖 *Hermes Status — $(date '+%H:%M UTC')*

${hermes}
*Tasks:* 🙋${inprog} active | ⏳${pending} queued | ✅${done} done
EOF
}

# Inside your loop, after the 5-min self-status check:
if [ $((now - LAST_SELF_STATUS)) -ge $SELF_STATUS_INTERVAL ]; then
  build_telegram_summary | send_telegram
  LAST_SELF_STATUS=$now
fi
```

**Important:** `TELEGRAM_CHAT_ID` must be a **numeric user ID** (e.g., `8435383377`), **not** a bot username like `@Neo_kleber_bot`. Telegram forbids bot-to-bot messaging.

---

**🚀 You're ready! Start the poller and check `status.md` within 30 seconds to confirm it's live.**
