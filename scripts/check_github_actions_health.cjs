#!/bin/bash
# GitHub Actions Health Monitor - Checks for failing workflows
# Part of the autonomous automation system

set -e

# Configuration
HEALTH_CHECK_LOG="/Users/kleberalcatrao/.openclaw/workspace/logs/github-actions-health.log"
MAX_FAILURES_BEFORE_ALERT=3
WEBHOOK_URL="${TELEGRAM_WEBHOOK_URL:-}"  # Optional: Telegram alert webhook

# Log function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$HEALTH_CHECK_LOG"
}

# Check for failures in the last 24 hours
check_failures() {
  local workflow_name="$1"
  local failure_count
  
  failure_count=$(gh run list --limit 50 --json status,conclusion,displayTitle,createdAt \
    | jq -r --arg workflow "$workflow_name" '.[] | select(.displayTitle | test($workflow)) | .conclusion' \
    | grep -c -E 'failure|cancelled' || true)
  
  echo "$failure_count"
}

# Main health check
log "Starting GitHub Actions health check..."

# Workflows to monitor (critical ones)
CRITICAL_WORKFLOWS=(
  "ai-build-fixer"
  "ai-continuous-improvement"
  "ai-seo-monitor"
  "ai-content-organizer"
  "ai-broken-link-fixer"
  "ai-performance-optimizer"
  "ai-app-improvement-specialist"
  "deploy-on-push"
  "ci-cd"
  "production-health-monitor"
)

FAILED_WORKFLOWS=()

for workflow in "${CRITICAL_WORKFLOWS[@]}"; do
  failures=$(check_failures "$workflow")
  if [ "$failures" -ge 1 ]; then
    FAILED_WORKFLOWS+=("$workflow ($failures failures)")
    log "⚠️  Workflow '$workflow' has $failures recent failures"
  else
    log "✅ Workflow '$workflow' is healthy"
  fi
done

# Alert if any critical workflow is failing
if [ ${#FAILED_WORKFLOWS[@]} -gt 0 ]; then
  alert_message="🚨 GitHub Actions Health Alert\n\nFailing workflows detected:\n"
  for failed in "${FAILED_WORKFLOWS[@]}"; do
    alert_message+="• $failed\n"
  done
  
  log "ALERT: $alert_message"
  
  # Send Telegram alert if webhook configured
  if [ -n "$WEBHOOK_URL" ]; then
    curl -s -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{\"text\":\"$alert_message\"}" > /dev/null
  fi
fi

log "Health check completed. Total failures: ${#FAILED_WORKFLOWS[@]}"
