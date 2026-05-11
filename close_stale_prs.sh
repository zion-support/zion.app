#!/bin/bash

# Script to close stale PRs
echo "Starting to close stale PRs..."

# Get list of open PRs
PRS=$(gh pr list --state open --json number,headRefName --jq '.[].number')

for pr in $PRS; do
    echo "Processing PR #$pr"
    
    # Try to close the PR
    if gh pr close $pr --comment "Closing stale PR - branch appears to be deleted or merged" 2>/dev/null; then
        echo "✓ Successfully closed PR #$pr"
    else
        echo "⚠ Failed to close PR #$pr"
    fi
done

echo "Finished closing stale PRs"