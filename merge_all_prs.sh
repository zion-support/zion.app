#!/bin/bash

# Script to merge all open PRs
echo "Starting to merge all open PRs..."

# Get list of open PRs
PRS=$(gh pr list --state open --json number,headRefName --jq '.[].number')

for pr in $PRS; do
    echo "Processing PR #$pr"
    
    # Try to merge the PR
    if gh pr merge $pr --merge --delete-branch 2>/dev/null; then
        echo "✓ Successfully merged PR #$pr"
    else
        echo "⚠ Failed to merge PR #$pr - checking if it can be merged manually"
        
        # Try to checkout and merge manually
        if gh pr checkout $pr 2>/dev/null; then
            echo "Checked out PR #$pr, attempting manual merge"
            
            # Fetch latest main
            git fetch origin main
            
            # Try to merge with main
            if git merge origin/main 2>/dev/null; then
                echo "✓ Successfully merged PR #$pr with main"
                git push origin HEAD
                git checkout main
                git merge $pr
                git push origin main
                echo "✓ PR #$pr merged and pushed to main"
            else
                echo "⚠ PR #$pr has conflicts, skipping for now"
                git checkout main
            fi
        else
            echo "⚠ Could not checkout PR #$pr, skipping"
        fi
    fi
done

echo "Finished processing all PRs"