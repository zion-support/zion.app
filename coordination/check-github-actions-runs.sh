#!/usr/bin/env bash
# check-github-actions-runs.sh — query GitHub Actions run status via API
# Requires GITHUB_TOKEN in environment
# Usage: check-github-actions-runs.sh <workflow-filename> <hours-back>
# Example: check-github-actions-runs.sh accessibility-audit.yml 24

set -euo pipefail

WORKFLOW_FILE="$1"
HOURS_BACK="${2:-24}"  # default: last 24 hours

# Load token from .env if not already present
if [ -z "${GITHUB_TOKEN:-}" ]; then
  ENV_FILE="/root/.openclaw/workspace/coordination/.env"
  if [ -f "$ENV_FILE" ]; then
    set -a; source "$ENV_FILE"; set +a
  fi
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN not set"
  exit 2
fi

REPO="Zion-support/zion.app"
SINCE=$(date -u -d "-${HOURS_BACK} hours" '+%Y-%m-%dT%H:%M:%SZ')

# Get workflow ID from filename
WORKFLOW_ID=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}" | jq -r '.id')

if [ -z "$WORKFLOW_ID" ] || [ "$WORKFLOW_ID" = "null" ]; then
  echo "❌ Workflow not found: ${WORKFLOW_FILE}"
  exit 3
fi

# Get recent runs for this workflow
RUNS_JSON=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_ID}/runs?per_page=10")

# Extract latest run
LATEST_ID=$(echo "$RUNS_JSON" | jq -r '.workflow_runs[0].id // "none"')
LATEST_STATUS=$(echo "$RUNS_JSON" | jq -r '.workflow_runs[0].status // "none"')
LATEST_CONCL=$(echo "$RUNS_JSON" | jq -r '.workflow_runs[0].conclusion // "none"')
LATEST_CREATED=$(echo "$RUNS_JSON" | jq -r '.workflow_runs[0].created_at // "none"')

# Filter by time
RUN_COUNT=$(echo "$RUNS_JSON" | jq '[.workflow_runs[] | select(.created_at >= "'"$SINCE"'")] | length')

# Output structured result
cat <<EOF
{
  "workflow": "${WORKFLOW_FILE}",
  "workflow_id": ${WORKFLOW_ID},
  "latest_run_id": ${LATEST_ID},
  "latest_status": "${LATEST_STATUS}",
  "latest_conclusion": "${LATEST_CONCL}",
  "latest_created": "${LATEST_CREATED}",
  "runs_last_${HOURS_BACK}h": ${RUN_COUNT}
}
EOF
