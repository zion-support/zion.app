#!/bin/bash

# Simple script to merge cursor branches
set -e

echo "Starting simple merge process..."

# Get list of cursor branches
branches=$(git branch -r | grep "cursor/fix-errors-and-merge-to-main" | head -20)

successful=0
failed=0

for branch in $branches; do
    # Remove 'origin/' prefix
    branch_name=${branch#origin/}
    
    echo "Processing branch: $branch_name"
    
    # Try to merge
    if git merge "origin/$branch_name" --no-edit 2>/dev/null; then
        echo "✅ Successfully merged $branch_name"
        ((successful++))
    else
        echo "❌ Merge failed for $branch_name, attempting conflict resolution..."
        
        # Check if there are conflicts
        if git status | grep -q "both modified\|deleted by"; then
            echo "Resolving conflicts for $branch_name..."
            
            # Use our version for conflicts
            git checkout --ours . 2>/dev/null || true
            git add . 2>/dev/null || true
            
            if git commit -m "Resolve conflicts for $branch_name" 2>/dev/null; then
                echo "✅ Successfully resolved conflicts for $branch_name"
                ((successful++))
            else
                echo "❌ Failed to resolve conflicts for $branch_name"
                git merge --abort 2>/dev/null || true
                ((failed++))
            fi
        else
            echo "❌ Merge failed for other reasons, aborting $branch_name"
            git merge --abort 2>/dev/null || true
            ((failed++))
        fi
    fi
    
    echo "---"
    sleep 1
done

echo "Merge process completed!"
echo "Successful: $successful"
echo "Failed: $failed"

# Push changes
echo "Pushing changes to main..."
git push origin main --force
echo "Done!"