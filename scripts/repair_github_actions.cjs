#!/bin/bash
# GitHub Actions Auto-Repair System
# Automatically fixes failing workflows by updating configurations

set -e

# Configuration
REPAIR_LOG="/Users/kleberalcatrao/.openclaw/workspace/logs/github-actions-repair.log"
WORKFLOWS_DIR="/Users/kleberalcatrao/.openclaw/workspace/.github/workflows"

# Log function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$REPAIR_LOG"
}

# Common fixes for failing workflows
apply_common_fixes() {
  local workflow_file="$1"
  
  log "Applying common fixes to $workflow_file"
  
  # Fix 1: Update Node.js version to current LTS
  sed -i 's/node-version: \[16.x\]/node-version: [20.x]/g' "$workflow_file"
  sed -i 's/node-version: \[18.x\]/node-version: [20.x]/g' "$workflow_file"
  
  # Fix 2: Update actions/checkout to v4
  sed -i 's/actions\/checkout@v2/actions\/checkout@v4/g' "$workflow_file"
  sed -i 's/actions\/checkout@v3/actions\/checkout@v4/g' "$workflow_file"
  
  # Fix 3: Update actions/setup-node to v4
  sed -i 's/actions\/setup-node@v2/actions\/setup-node@v4/g' "$workflow_file"
  sed -i 's/actions\/setup-node@v3/actions\/setup-node@v4/g' "$workflow_file"
  
  # Fix 4: Add timeout to prevent hanging jobs
  if ! grep -q "timeout-minutes:" "$workflow_file"; then
    sed -i '/steps:/a \ \ \ \ timeout-minutes: 30' "$workflow_file"
  fi
  
  # Fix 5: Ensure proper permissions for GITHUB_TOKEN
  if ! grep -q "permissions:" "$workflow_file" && grep -q "on:" "$workflow_file"; then
    sed -i '/on:/a \ \ permissions:\n\ \ \ contents: read\n\ \ \ issues: write\n\ \ \ pull-requests: write' "$workflow_file"
  fi
  
  log "Applied fixes to $workflow_file"
}

# Check and repair failing workflows
repair_failures() {
  local workflow_name="$1"
  local workflow_file="$WORKFLOWS_DIR/$workflow_name.yml"
  
  if [ ! -f "$workflow_file" ]; then
    log "Workflow file not found: $workflow_file"
    return 1
  fi
  
  # Get recent failures
  local recent_failures
  recent_failures=$(gh run list --limit 10 --json status,conclusion,displayTitle,createdAt,databaseId \
    | jq -r --arg workflow "$workflow_name" '.[] | select(.displayTitle | test($workflow) and (.conclusion == "failure" or .conclusion == "cancelled")) | .databaseId' || true)
  
  if [ -z "$recent_failures" ]; then
    log "No recent failures found for $workflow_name"
    return 0
  fi
  
  log "Found ${#recent_failures[@]} recent failures for $workflow_name. Attempting repair..."
  
  # Apply fixes
  apply_common_fixes "$workflow_file"
  
  # Commit and push changes
  git add "$workflow_file"
  git commit -m "chore: auto-fix $workflow_name workflow [skip ci]" || true
  git push origin HEAD || true
  
  # Re-run the workflow
  gh workflow run "$workflow_name.yml" --ref main || true
  
  log "Repair completed for $workflow_name"
}

# Main repair function
log "Starting GitHub Actions auto-repair process..."

# Critical workflows to monitor and repair
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
)

for workflow in "${CRITICAL_WORKFLOWS[@]}"; do
  if [ -f "$WORKFLOWS_DIR/$workflow.yml" ]; then
    repair_failures "$workflow"
  else
    log "Workflow file not found: $workflow.yml (skipping)"
  fi
done

log "Auto-repair process completed."
