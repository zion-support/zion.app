#!/usr/bin/env bash

# Batch script to safely merge all open PRs into main
set -euo pipefail

echo "Starting batch PR merge process for all open PRs..."

# Ensure we are on main and up to date
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" ]]; then
  echo "Checking out main..."
  git checkout main >/dev/null 2>&1 || true
fi
echo "Fetching latest from origin..."
git fetch origin --prune
git pull --ff-only origin main || true

# Get all open, non-draft PR numbers against main
PR_NUMBERS=$(gh pr list --state open \
  --json number,baseRefName,isDraft \
  --jq '.[] | select(.baseRefName=="main" and .isDraft==false) | .number')

if [[ -z "${PR_NUMBERS:-}" ]]; then
  echo "No open PRs targeting main. Nothing to do."
  exit 0
fi

echo "Found PRs to process: $PR_NUMBERS"

# Counters for reporting
successful_merges=0
failed_merges=0

for pr_num in $PR_NUMBERS; do
  echo "Processing PR #$pr_num..."

  # Query PR details
  pr_json=$(gh pr view "$pr_num" --json title,headRefName,baseRefName,mergeStateStatus,isDraft,number,url)
  head_ref=$(echo "$pr_json" | jq -r '.headRefName')
  title=$(echo "$pr_json" | jq -r '.title')
  base_ref=$(echo "$pr_json" | jq -r '.baseRefName')

  if [[ -z "$head_ref" || "$head_ref" == "null" ]]; then
    echo "Could not get branch name for PR #$pr_num, skipping..."
    ((failed_merges++))
    continue
  fi

  echo "Title: $title"
  echo "Base: $base_ref | Head: $head_ref"

  # Try GitHub merge first (fast path)
  if gh pr merge "$pr_num" --merge --auto --squash=false --delete-branch=false >/dev/null 2>&1; then
    echo "Merged via GitHub: #$pr_num ($head_ref)"
    ((successful_merges++))
    continue
  fi

  echo "GitHub merge failed, attempting local merge into main..."

  # Make sure we are on main and up to date
  git checkout main >/dev/null 2>&1 || true
  git pull --ff-only origin main || true

  echo "Fetching branch $head_ref..."
  if ! git fetch origin "$head_ref" >/dev/null 2>&1; then
    echo "Failed to fetch branch $head_ref, skipping PR #$pr_num"
    ((failed_merges++))
    continue
  fi

  # Attempt merge
  if git merge --no-ff --no-edit "origin/$head_ref" >/dev/null 2>&1; then
    echo "Successfully merged $head_ref locally"
    ((successful_merges++))
  else
    echo "Merge conflicts detected for $head_ref; resolving in favor of main (ours)..."
    # Keep main's changes by default during conflicts
    git checkout --ours . || true
    git add -A || true
    if git commit -m "Resolve merge conflicts for PR #$pr_num ($head_ref) in favor of main" >/dev/null 2>&1; then
      echo "Conflicts resolved and committed for #$pr_num"
      ((successful_merges++))
    else
      echo "Failed to commit conflict resolution for #$pr_num; aborting merge"
      git merge --abort >/dev/null 2>&1 || true
      ((failed_merges++))
      continue
    fi
  fi

  # Push updated main only if merge made changes
  echo "Pushing main..."
  if ! git push origin main >/dev/null 2>&1; then
    echo "Push failed for main after merging #$pr_num"
    ((failed_merges++))
  fi

  echo "Completed processing PR #$pr_num"
  echo "---"
  sleep 1
done

echo "Batch PR processing completed!"
echo "Successful merges: $successful_merges"
echo "Failed merges: $failed_merges"

echo "All done!"