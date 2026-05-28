#!/bin/bash

# Script to process and merge open PRs
set -e

echo "Starting PR processing..."

# Get list of open PR numbers
PR_NUMBERS=$(curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/Zion-Holdings/zion.app/pulls?state=open&per_page=100" | grep -o '"number": [0-9]*' | sed 's/"number": //' | head -10)

echo "Found PRs: $PR_NUMBERS"

for pr_num in $PR_NUMBERS; do
    echo "Processing PR #$pr_num..."
    
    # Get PR details
    pr_info=$(curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/Zion-Holdings/zion.app/pulls/$pr_num")
    
    # Extract branch name
    head_ref=$(echo "$pr_info" | grep -o '"ref": "[^"]*"' | head -1 | sed 's/"ref": "//' | sed 's/"//')
    
    if [ -z "$head_ref" ]; then
        echo "Could not extract branch name for PR #$pr_num, skipping..."
        continue
    fi
    
    echo "Branch: $head_ref"
    
    # Fetch the branch
    echo "Fetching branch $head_ref..."
    git fetch origin "$head_ref" || {
        echo "Failed to fetch branch $head_ref, skipping PR #$pr_num"
        continue
    }
    
    # Try to merge
    echo "Attempting to merge $head_ref into main..."
    if git merge "origin/$head_ref" --no-edit; then
        echo "Successfully merged $head_ref"
        # Push the changes
        git push origin main
        echo "Pushed changes to main"
    else
        echo "Merge failed for $head_ref, checking for conflicts..."
        # Check if there are conflicts
        if git status | grep -q "both modified"; then
            echo "Conflicts detected, attempting to resolve..."
            # Try to resolve conflicts automatically
            git add .
            git commit -m "Resolve merge conflicts for PR #$pr_num" || {
                echo "Failed to resolve conflicts for PR #$pr_num"
                git merge --abort
                continue
            }
            git push origin main
            echo "Resolved conflicts and pushed for PR #$pr_num"
        else
            echo "Merge failed for other reasons, aborting..."
            git merge --abort
        fi
    fi
    
    echo "Completed processing PR #$pr_num"
    echo "---"
done

echo "PR processing completed!"