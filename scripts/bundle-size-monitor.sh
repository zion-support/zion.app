#!/usr/bin/env bash
# scripts/bundle-size-monitor.sh
# Monitors JavaScript bundle size and enforces a growth budget.
# Compares current build against a baseline (previous successful build).
# Fails or posts PR comment if growth exceeds threshold (default: 2%).

set -euo pipefail

# Config
THRESHOLD_PERCENT="${THRESHOLD_PERCENT:-2}"  # Max allowed growth %
BASELINE_FILE="${BASELINE_FILE:-.bundle-size-baseline.json}"
REPORT_FILE="${REPORT_FILE:-bundle-analysis.json}"
CURRENT_STATS="${CURRENT_STATS:-bundle-stats.json}"

echo "📊 Starting bundle size monitoring (threshold: ${THRESHOLD_PERCENT}%)"

# Ensure we have a baseline
if [ ! -f "$BASELINE_FILE" ]; then
  echo "⚠️  No baseline found. Creating initial baseline from current build..."
  if [ -f "$REPORT_FILE" ]; then
    cp "$REPORT_FILE" "$BASELINE_FILE"
    echo "✅ Baseline saved to $BASELINE_FILE"
    exit 0
  else
    echo "❌ No bundle report found at $REPORT_FILE. Build the project first."
    exit 1
  fi
fi

# Check current report exists
if [ ! -f "$REPORT_FILE" ]; then
  echo "❌ Current bundle report not found at $REPORT_FILE"
  echo "   Make sure the build produced a report (next-bundle-analyzer or similar)"
  exit 1
fi

# Extract total JS size from reports (in bytes)
# Assumes next-bundle-analyzer format: { "totalBytes": 123456, ... }
get_total_bytes() {
  local file="$1"
  if command -v jq &> /dev/null; then
    jq -r '.totalBytes // .assets | map(select(.name | test("\\.js$"))) | map(.size) | add' "$file" 2>/dev/null || echo "0"
  else
    # Fallback: grep for approximate size (less accurate)
    grep -o '"totalBytes":[0-9]*' "$file" 2>/dev/null | head -1 | cut -d: -f2 || echo "0"
  fi
}

BASELINE_BYTES=$(get_total_bytes "$BASELINE_FILE")
CURRENT_BYTES=$(get_total_bytes "$REPORT_FILE")

echo "📦 Baseline: ${BASELINE_BYTES} bytes"
echo "📦 Current:  ${CURRENT_BYTES} bytes"

if [ "$BASELINE_BYTES" = "0" ] || [ "$CURRENT_BYTES" = "0" ]; then
  echo "❌ Could not determine bundle sizes (missing data)"
  exit 1
fi

# Calculate growth
DIFF=$((CURRENT_BYTES - BASELINE_BYTES))
if [ "$DIFF" -lt 0 ]; then
  DIFF_ABS=$(( -DIFF ))
  echo "✅ Bundle size decreased by ${DIFF_ABS} bytes"
  # Update baseline to new smaller size
  cp "$REPORT_FILE" "$BASELINE_FILE"
  echo "🔄 Baseline updated to smaller size"
  exit 0
fi

GROWTH_PERCENT=$(awk "BEGIN {printf \"%.2f\", ($DIFF / $BASELINE_BYTES) * 100}")
echo "📈 Growth: ${DIFF} bytes (${GROWTH_PERCENT}%)"

# Check threshold
if awk "BEGIN {exit !(${GROWTH_PERCENT} > ${THRESHOLD_PERCENT})}"; then
  echo "❌ Bundle growth exceeds ${THRESHOLD_PERCENT}% threshold!"

  # Post PR comment if available
  if [ -n "${GITHUB_TOKEN:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ] && [ -n "${GITHUB_PULL_NUMBER:-}" ]; then
    echo "💬 Posting failure notice to PR..."
    BODY="🚨 **Bundle size monitor failed**\n\nCurrent bundle grew by **${GROWTH_PERCENT}%** (allowed: ${THRESHOLD_PERCENT}%).\n\nBaseline: ${BASELINE_BYTES} bytes\nCurrent:  ${CURRENT_BYTES} bytes\nIncrease: ${DIFF} bytes\n\nPlease optimize the bundle or request a threshold increase."
    if command -v gh &> /dev/null; then
      gh pr comment "$GITHUB_PULL_NUMBER" --body "$BODY" || true
    fi
  fi

  exit 1
else
  echo "✅ Bundle growth within acceptable budget (${GROWTH_PERCENT}% ≤ ${THRESHOLD_PERCENT}%)"
  # Update baseline to current for next comparison
  cp "$REPORT_FILE" "$BASELINE_FILE"
  echo "🔄 Baseline updated"
  exit 0
fi
