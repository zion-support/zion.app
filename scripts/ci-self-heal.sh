#!/usr/bin/env bash
# scripts/ci-self-heal.sh - Autonomous CI/CD Self-Healing Guardian
# Uses free tools: git, curl, jq, bash
# Autonomous: runs via cron/GitHub Actions, rolls back failed deployments

set -euo pipefail

# Configuration
REPO_DIR="${REPO_DIR:-/Users/klebergarciaalcatrao/.openclaw/workspace/zion-app}"
WORKFLOWS_DIR="${REPO_DIR}/.github/workflows"
LAST_SUCCESSFUL_COMMIT_FILE="${STATE_DIR:-$HOME/.hermes/state}/last-successful-commit"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-8435383377}"
MAX_ATTEMPTS=3  # Max rollback attempts

# Ensure state file exists
mkdir -p "$(dirname "$LAST_SUCCESSFUL_COMMIT_FILE")"
touch "$LAST_SUCCESSFUL_COMMIT_FILE"

# Function: Get latest successful deployment commit
get_last_successful_commit() {
  if [[ -f "$LAST_SUCCESSFUL_COMMIT_FILE" ]]; then
    cat "$LAST_SUCCESSFUL_COMMIT_FILE"
  else
    echo "HEAD"
  fi
}

# Function: Determine current commit SHA
get_current_commit() {
  git -C "$REPO_DIR" rev-parse HEAD
}

# Function: Check if a GitHub Actions workflow failed recently
check_failed_workflow() {
  # Check recent failed workflow runs in the last hour
  local failed_runs
  failed_runs=$(curl -sf -H "Authorization: token ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO}/actions/runs?per_page=5" 2>/dev/null | \
    jq -r '.workflow_runs[] | select(.conclusion=="failure") | .created_at')
  
  if [[ -n "$failed_runs" ]]; then
    # Check if any failed run is within the last hour
    local now_epoch=$(date +%s)
    while IFS= read -r run_created; do
      local run_epoch=$(date -d "$run_created" +%s 2>/dev/null)
      if (( now_epoch - run_epoch < 3600 )); then  # Within last hour
        echo "$run_created"
        return 0
      fi
    done <<< "$failed_runs"
  fi
  return 1
}

# Main Execution
log() { echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" >> "$HOME/.hermes/memory/ci-self-heal.log"; }

current_commit=$(get_current_commit)
last_successful=$(get_last_successful_commit)

if [[ "$current_commit" != "$last_successful" ]]; then
  log "New commit detected: $current_commit (last successful: $last_successful)"
  
  # Run validation (placeholder: could call test scripts)
  # Simulate a test run
  if ./scripts/ci-validation-check.sh 2>/dev/null; then
    log "✅ Validation passed for new commit"
    # Update last successful commit
    echo "$current_commit" > "$LAST_SUCCESSFUL_COMMIT_FILE"
  else
    log "❌ Validation failed for new commit"
    
    # Attempt rollback up to MAX_ATTEMPTS times
    attempt=0
    while [[ $attempt -lt $MAX_ATTEMPTS ]]; do
      attempt=$((attempt + 1))
      previous_commit=$(git -C "$REPO_DIR" rev-list -n 1 "$current_commit~$attempt" 2>/dev/null)
      if [[ -n "$previous_commit" ]]; then
        log "Attempt $attempt: Rolling back to $previous_commit"
        git -C "$REPO_DIR" reset --hard "$previous_commit"
        git -C "$REPO_DIR" push --force "origin" "${BRANCH_NAME:-main}"
        
        # Run validation on rolled-back commit
        if ./scripts/ci-validation-check.sh; then
          log "✅ Rollback successful after $attempt attempt(s)"
          echo "$previous_commit" > "$LAST_SUCCESSFUL_COMMIT_FILE"
          # Send Telegram alert: rollback successful
          if [[ -n "$TELEGRAM_BOT_TOKEN" ]]; then
            curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
              -d "chat_id=${TELEGRAM_CHAT_ID}" \
              -d "text=🛠️ Rollback successful after $attempt attempt(s)%0ARollback to commit $previous_commit" \
              --max-time 10 || true
          fi
          exit 0
        fi
      else
        log "No previous commits to roll back to"
        break
      fi
    done
    
    # If we get here, rollbacks failed
    log "❌ Rollback attempts failed"
    if [[ -n "$TELEGRAM_BOT_TOKEN" ]]; then
      curl -sf -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=⚠️ Rollback attempts failed for new commit%0AFailed to restore previous stable version" \
        --max-time 10 || true
    fi
    exit 1
  fi
else
  log "No new commit detected"
fi

log "CI Self-Heal cycle complete"