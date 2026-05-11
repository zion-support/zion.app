#!/usr/bin/env bash
# scripts/accessibility-audit.sh
# Runs pa11y on the built site and outputs a concise accessibility report.
# Expects the built site to be served locally or available as static files.

set -euo pipefail

# Configurable: port where the built site is served locally
PORT="${PORT:-3000}"
BASE_URL="${BASE_URL:-http://localhost:$PORT}"

echo "🌐 Starting accessibility audit against $BASE_URL"

# Ensure the site is built and running (you may need to start it beforehand)
# This script assumes a dev server is already up on $PORT.

# Install pa11y if not present
if ! command -v pa11y &> /dev/null; then
  echo "📦 Installing pa11y..."
  npm install -g pa11y
fi

# Run pa11y with a concise output format
REPORT_FILE="accessibility-audit-report.json"
echo "🔍 Running pa11y scan..."
pa11y --timeout 60000 --reporter json "$BASE_URL" > "$REPORT_FILE" || true

# Summarize results
if [ -f "$REPORT_FILE" ]; then
  ERRORS=$(jq '[.[] | select(.type == "error")] | length' "$REPORT_FILE" 2>/dev/null || echo 0)
  WARNINGS=$(jq '[.[] | select(.type == "warning")] | length' "$REPORT_FILE" 2>/dev/null || echo 0)
  echo "📊 Accessibility report: $ERRORS errors, $WARNINGS warnings"
  echo "📄 Full report saved to $REPORT_FILE"
else
  echo "❌ No report generated"
fi

# Optionally, post the summary as a PR comment if GITHUB_TOKEN is available
if [ -n "${GITHUB_TOKEN:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ]; then
  echo "💬 Posting summary to GitHub..."
  SUMMARY="Accessibility audit completed — $ERRORS errors, $WARNINGS warnings. See [full report]($REPORT_FILE)."
  # Use gh CLI if available
  if command -v gh &> /dev/null; then
    gh pr comment "$GITHUB_PULL_NUMBER" --body "$SUMMARY" || true
  else
    echo "⚠️  gh CLI not available – skipping PR comment"
  fi
fi

echo "✅ Accessibility audit done"
