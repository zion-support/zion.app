#!/bin/bash
# Auto-sync trigger script - triggers immediate sync via GitHub API
# Usage: ./automation/trigger-auto-sync.sh

set -e

REPO_OWNER="Zion-Holdings"
REPO_NAME="zion.app"
GITHUB_API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}"

# Check for GH_TOKEN
if [ -z "$GH_TOKEN" ]; then
  echo "⚠️  GH_TOKEN not set. Using GITHUB_TOKEN if available..."
  if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN or GITHUB_TOKEN environment variable required"
    exit 1
  fi
  GH_TOKEN="$GITHUB_TOKEN"
fi

echo "🚀 Triggering auto-sync workflow..."

# Trigger workflow dispatch
RESPONSE=$(curl -s -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token ${GH_TOKEN}" \
  "${GITHUB_API_URL}/actions/workflows/auto-sync.yml/dispatches" \
  -d '{"ref":"main"}')

if [ $? -eq 0 ]; then
  echo "✅ Auto-sync workflow triggered successfully"
  echo "📊 Check status: https://github.com/${REPO_OWNER}/${REPO_NAME}/actions"
else
  echo "❌ Failed to trigger workflow"
  echo "$RESPONSE"
  exit 1
fi

