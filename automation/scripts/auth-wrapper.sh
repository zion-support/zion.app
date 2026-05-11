#!/bin/bash
# OpenClaw Agent Auth Wrapper
# Prevents restart loops when OpenRouter credentials are missing

set -e

AGENT_NAME="${1:-unknown}"
shift || true
MESSAGE="$*"

# Check for auth errors in recent runs
LOG_FILE="/tmp/${AGENT_NAME}-auth-failures.log"
if [[ -f "$LOG_FILE" ]]; then
    FAIL_COUNT=$(cat "$LOG_FILE" | wc -l)
    if [[ $FAIL_COUNT -ge 3 ]]; then
        echo "[$AGENT_NAME] Skipping due to repeated auth failures ($FAIL_COUNT)" >&2
        echo '{"skipped":true,"reason":"auth_backoff","authCount":'${FAIL_COUNT}'}'
        exit 0
    fi
fi

# Run the agent
OUTPUT=$(openclaw agent --agent main --message "$MESSAGE" --thinking low --timeout 90 --json 2>&1)
EXIT_CODE=$?

if [[ $EXIT_CODE -ne 0 ]] || echo "$OUTPUT" | grep -qiE 'openrouter.*api key|authentication failed|missing.*credential|no.*api[-_]?key|401.*unauthorized|config.*auth'; then
    echo "[$AGENT_NAME] Auth failure detected" >&2
    mkdir -p /tmp
    echo "failure" >> "$LOG_FILE"
    echo '{"authFailed":true,"skipped":true}''
    exit 0
fi

# Success - clear failure log
rm -f "$LOG_FILE"
echo "$OUTPUT"
