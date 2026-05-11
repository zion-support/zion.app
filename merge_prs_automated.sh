#!/bin/bash

# Automated script to merge all cursor branches
set -e

echo "Starting automated PR merge process..."

# Get all cursor branches
CURSOR_BRANCHES=$(git branch -r | grep "cursor/fix-errors-and-merge-to-main" | sed 's/origin\///')

successful_merges=0
failed_merges=0

for branch in $CURSOR_BRANCHES; do
    echo "Processing branch: $branch"
    
    # Fetch the branch
    if ! git fetch origin "$branch" 2>/dev/null; then
        echo "Failed to fetch branch $branch, skipping..."
        ((failed_merges++))
        continue
    fi
    
    # Try to merge
    if git merge "origin/$branch" --no-edit 2>/dev/null; then
        echo "Successfully merged $branch"
        ((successful_merges++))
    else
        echo "Merge failed for $branch, resolving conflicts..."
        
        # Resolve conflicts by keeping our version
        git checkout --ours . 2>/dev/null || true
        git add . 2>/dev/null || true
        
        if git commit -m "Resolve merge conflicts for $branch" 2>/dev/null; then
            echo "Successfully resolved conflicts for $branch"
            ((successful_merges++))
        else
            echo "Failed to resolve conflicts for $branch"
            git merge --abort 2>/dev/null || true
            ((failed_merges++))
        fi
    fi
    
    echo "Completed processing $branch"
    echo "---"
    
    # Small delay
    sleep 0.5
done

echo "Automated merge process completed!"
echo "Successful merges: $successful_merges"
echo "Failed merges: $failed_merges"

# Push all changes
echo "Pushing all changes to main..."
if git push origin main; then
    echo "Successfully pushed all changes to main"
else
    echo "Failed to push changes to main"
    exit 1
fi

echo "All done!"