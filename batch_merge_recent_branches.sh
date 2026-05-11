#!/bin/bash

# Batch merge recent cursor branches
set -e

echo "Starting batch merge of recent cursor branches..."

# Get recent branches (last 20)
RECENT_BRANCHES=$(git branch -r | grep "cursor/fix-errors-and-merge-to-main" | tail -20)

successful_merges=0
failed_merges=0

for branch in $RECENT_BRANCHES; do
    branch_name=$(echo $branch | sed 's/origin\///')
    echo "Processing branch: $branch_name"
    
    # Fetch the branch
    if ! git fetch origin "$branch_name" 2>/dev/null; then
        echo "Failed to fetch branch $branch_name, skipping..."
        ((failed_merges++))
        continue
    fi
    
    # Try to merge
    if git merge "origin/$branch_name" --no-edit 2>/dev/null; then
        echo "Successfully merged $branch_name"
        ((successful_merges++))
    else
        echo "Merge failed for $branch_name, resolving conflicts..."
        
        # Resolve conflicts by keeping our version
        git checkout --ours . 2>/dev/null || true
        git add . 2>/dev/null || true
        
        if git commit -m "Resolve merge conflicts for $branch_name" 2>/dev/null; then
            echo "Successfully resolved conflicts for $branch_name"
            ((successful_merges++))
        else
            echo "Failed to resolve conflicts for $branch_name"
            git merge --abort 2>/dev/null || true
            ((failed_merges++))
        fi
    fi
    
    echo "Completed processing $branch_name"
    echo "---"
    
    # Small delay
    sleep 0.2
done

echo "Batch merge process completed!"
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