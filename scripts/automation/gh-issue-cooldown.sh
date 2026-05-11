#!/usr/bin/env bash
# Reusable GitHub issue helpers for workflows: source this file in a run step.
# Requires: gh CLI, GH_TOKEN or GITHUB_TOKEN
#
# Usage:
#   source scripts/automation/gh-issue-cooldown.sh
#   n=$(gh_issue_find_open_by_title_prefix "PM2 SLO breach")
#   [[ -n "$n" ]] && echo "Open issue #$n"

set -euo pipefail

gh_issue_find_open_by_title_prefix() {
  local prefix="$1"
  gh issue list --state open --search "in:title ${prefix}" --limit 1 --json number --jq '.[0].number // empty' 2>/dev/null || true
}

# Returns 0 (true) if last matching issue was updated within HOURS (default 6).
gh_issue_recent_activity_hours() {
  local title_search="$1"
  local hours="${2:-6}"
  local updated
  updated=$(gh issue list --state all --search "in:title ${title_search}" --limit 1 --json updatedAt --jq '.[0].updatedAt // empty' 2>/dev/null || true)
  if [[ -z "$updated" ]]; then
    return 1
  fi
  node -e "const v=process.argv[1]; const h=Number(process.argv[2]); const ageH=(Date.now()-new Date(v).getTime())/3600000; process.exit(ageH < h ? 0 : 1)" "$updated" "$hours"
}

# Cooldown hours from incident registry (repo root). Run from GitHub Actions checkout root.
gh_issue_cooldown_hours_from_registry() {
  node -p "try{const j=require('./automation/reports/incident-suppression-registry-latest.json');Number(j.recommendedCooldownHours||j.cooldownHours||6)}catch(e){6}"
}

# EMA open-incident load from registry (for logs / adaptive alerts). Prints empty string if missing.
gh_issue_registry_ema_open() {
  node -p "try{const j=require('./automation/reports/incident-suppression-registry-latest.json');const e=j.noise&&j.noise.emaOpenIncidents;Number.isFinite(Number(e))?String(e):''}catch(e){''}"
}
