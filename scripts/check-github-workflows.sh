#!/usr/bin/env bash
# scripts/check-github-workflows.sh
# Checks recent runs of GitHub Actions workflows and reports failures.
# Useful for Hermes to monitor automation health without manual GitHub UI checks.

set -euo pipefail

# Config
REPO="${GITHUB_REPOSITORY:-Zion-support/zion.app}"
TOKEN="${GITHUB_TOKEN:-}"
DAYS="${MONITOR_DAYS:-1}"  # Check last 24h by default
STATE_FILE="/tmp/latest_workflow_check.json"

if [ -z "$TOKEN" ]; then
  echo "❌ GITHUB_TOKEN not set. Export it or add to .env"
  exit 1
fi

echo "🔍 Checking GitHub Actions runs for $REPO (last ${DAYS} day(s))..."

# Fetch recent workflow runs
API_URL="https://api.github.com/repos/$REPO/actions/runs?per_page=30&created=${DAYS}d"
RESPONSE=$(curl -s -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" "$API_URL")

# Parse run count
TOTAL=$(echo "$RESPONSE" | jq '.total_count' 2>/dev/null || echo "0")
echo "📊 Total runs in last ${DAYS}d: $TOTAL"

# Extract failures
FAILURES=$(echo "$RESPONSE" | jq '[.workflow_runs[] | select(.conclusion != "success" and .conclusion != "skipped")]')
FAIL_COUNT=$(echo "$FAILURES" | jq 'length' 2>/dev/null || echo "0")

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "⚠️  Found $FAIL_COUNT non-successful runs:"
  echo "$FAILURES" | jq -r '.[] | "  - \(.name) → \(.conclusion) @ \(.html_url)"' 2>/dev/null || true

  # Persist to file for later reference
  echo "$FAILURES" > /tmp/workflow_failures_$(date +%s).json
  echo "📁 Full details saved to /tmp/workflow_failures_*.json"
else
  echo "✅ All workflows successful in the last ${DAYS}d"
fi

# Optionally post to Telegram if failures found
if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ] && [ "$FAIL_COUNT" -gt 0 ]; then
  echo "📤 Sending failure alert to Telegram..."
  MSG="🚨 GitHub Actions failures detected in $REPO:\n"
  MSG+=$(echo "$FAILURES" | jq -r '.[] | "• \(.name): \(.conclusion)"' | head -5 | paste -sd '\n' -)
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${MSG}" \
    -d "parse_mode=Markdown" > /dev/null 2>&1 || true
fi

exit 0
