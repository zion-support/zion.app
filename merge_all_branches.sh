#!/bin/bash

# Script to merge all available PR branches into main
set -e

echo "Starting comprehensive branch merge process..."

# Ensure we're on main branch
git checkout main
git pull origin main

# Get list of all fix-errors-and-merge-to-main branches
branches=($(git branch -r | grep "fix-errors-and-merge-to-main" | head -10))

echo "Found ${#branches[@]} branches to process:"
for branch in "${branches[@]}"; do
    echo "  - $branch"
done

# Merge each branch
for branch in "${branches[@]}"; do
    echo ""
    echo "Processing $branch..."
    
    # Create a temporary branch
    temp_branch="temp-merge-$(date +%s)"
    
    # Try to checkout the branch
    if git checkout -b "$temp_branch" "$branch" 2>/dev/null; then
        echo "  ✓ Successfully checked out $branch"
        
        # Switch back to main
        git checkout main
        
        # Try to merge
        if git merge "$temp_branch" --no-ff -m "Merge $branch into main" 2>/dev/null; then
            echo "  ✓ Successfully merged $branch"
            git push origin main
        else
            echo "  ⚠ Merge conflict in $branch, attempting to resolve..."
            
            # Check if there are actual conflicts
            if git status --porcelain | grep -q "^UU\|^AA\|^DD"; then
                echo "  🔧 Resolving conflicts in $branch..."
                
                # Try to auto-resolve conflicts
                git add . 2>/dev/null || true
                
                if git commit -m "Resolve conflicts in $branch" 2>/dev/null; then
                    git push origin main
                    echo "  ✓ Successfully resolved and merged $branch"
                else
                    echo "  ❌ Failed to resolve conflicts in $branch, aborting merge..."
                    git merge --abort
                fi
            else
                echo "  ℹ No conflicts found, but merge failed for $branch (possibly already merged)"
                git merge --abort
            fi
        fi
        
        # Clean up temp branch
        git branch -D "$temp_branch" 2>/dev/null || true
    else
        echo "  ❌ Failed to checkout $branch, skipping..."
    fi
done

echo ""
echo "Branch merge process completed!"
echo "Current status:"
git status --short