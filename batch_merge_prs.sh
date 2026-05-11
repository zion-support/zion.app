#!/bin/bash

# Batch script to merge multiple PRs efficiently
set -e

echo "Starting batch PR merge process..."

# Get list of open PR numbers (first 5 to start)
PR_NUMBERS=$(curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/Zion-Holdings/zion.app/pulls?state=open&per_page=5" | grep -o '"number": [0-9]*' | sed 's/"number": //')

echo "Processing PRs: $PR_NUMBERS"

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
    if ! git fetch origin "$head_ref"; then
        echo "Failed to fetch branch $head_ref, skipping PR #$pr_num"
        continue
    fi
    
    # Try to merge
    echo "Attempting to merge $head_ref into main..."
    if git merge "origin/$head_ref" --no-edit; then
        echo "Successfully merged $head_ref"
        # Push the changes
        git push origin main
        echo "Pushed changes to main for PR #$pr_num"
    else
        echo "Merge failed for $head_ref, attempting conflict resolution..."
        
        # Check if there are conflicts
        if git status | grep -q "both modified\|deleted by"; then
            echo "Conflicts detected, attempting to resolve..."
            
            # Use our version for most conflicts
            git checkout --ours . || true
            
            # Keep important files that might be deleted
            git add app/page-new.tsx app/page-optimized.tsx || true
            
            # Add all resolved files
            git add .
            
            # Commit the resolution
            if git commit -m "Resolve merge conflicts for PR #$pr_num - $head_ref"; then
                echo "Successfully resolved conflicts for PR #$pr_num"
                git push origin main
                echo "Pushed resolved changes for PR #$pr_num"
            else
                echo "Failed to commit resolution for PR #$pr_num"
                git merge --abort
            fi
        else
            echo "Merge failed for other reasons, aborting..."
            git merge --abort
        fi
    fi
    
    echo "Completed processing PR #$pr_num"
    echo "---"
    
    # Small delay to avoid rate limiting
    sleep 2
done

echo "Batch PR processing completed!"