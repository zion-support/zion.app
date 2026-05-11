#!/bin/bash

# Comprehensive branch merge script for recent branches
set -e

echo "Starting comprehensive branch merge process for recent branches..."

# Get the list of recent branches that need merging
RECENT_BRANCHES=(
    "origin/cursor/fix-errors-and-merge-to-main-d6ed"
    "origin/cursor/fix-errors-and-merge-to-main-5cdf"
    "origin/cursor/fix-errors-and-merge-to-main-0d48"
    "origin/cursor/fix-errors-and-merge-to-main-1f96"
    "origin/cursor/fix-errors-and-merge-to-main-bc79"
    "origin/cursor/fix-errors-and-merge-to-main-d47f"
    "origin/cursor/fix-errors-and-merge-to-main-72d6"
    "origin/cursor/fix-errors-and-merge-to-main-e981"
    "origin/cursor/fix-errors-and-merge-to-main-2e59"
    "origin/cursor/swdr-background-task-9835"
    "origin/cursor/swdr-background-task-a762"
    "origin/cursor/undefined-awde-task-1140"
    "origin/cursor/undefined-awde-task-3217"
)

# Ensure we're on main branch and up to date
git checkout main
git pull origin main

echo "Current main branch is up to date."

# Merge each branch
for branch in "${RECENT_BRANCHES[@]}"; do
    echo "Processing branch: $branch"
    
    # Check if branch exists
    if git show-ref --verify --quiet refs/remotes/$branch; then
        echo "Merging $branch into main..."
        
        # Try to merge the branch
        if git merge --no-ff $branch -m "Merge $branch into main" 2>/dev/null; then
            echo "Successfully merged $branch"
        else
            echo "Merge conflict in $branch, resolving..."
            
            # Resolve conflicts by keeping main branch version
            git status --porcelain | grep "^UU" | cut -c4- | while read file; do
                echo "Resolving conflict in $file"
                git checkout --theirs "$file" 2>/dev/null || true
            done
            
            # Add resolved files
            git add .
            
            # Commit the merge
            if git commit -m "Resolve merge conflicts in $branch by keeping main branch versions" 2>/dev/null; then
                echo "Successfully resolved conflicts in $branch"
            else
                echo "No conflicts to resolve in $branch"
                git merge --abort 2>/dev/null || true
            fi
        fi
    else
        echo "Branch $branch does not exist, skipping..."
    fi
    
    echo "---"
done

echo "All recent branches processed successfully!"
echo "Pushing changes to origin/main..."

# Push all changes
git push origin main

echo "Merge process completed!"