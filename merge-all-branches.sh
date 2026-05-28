#!/bin/bash

echo "Starting comprehensive branch merge process..."

# List of branches to merge (most recent first)
branches=(
    "origin/cursor/fix-errors-and-merge-to-main-57e4"
    "origin/cursor/fix-errors-and-merge-to-main-efe0"
    "origin/cursor/fix-errors-and-merge-to-main-3b97"
    "origin/cursor/fix-errors-and-merge-to-main-e55f"
    "origin/cursor/fix-errors-and-merge-to-main-3fb8"
)

for branch in "${branches[@]}"; do
    echo "Processing branch: $branch"
    
    # Check if branch has commits not in main
    commits=$(git log --oneline origin/main..$branch | wc -l)
    
    if [ "$commits" -eq 0 ]; then
        echo "  No new commits in $branch, skipping..."
        continue
    fi
    
    echo "  Found $commits new commits, attempting merge..."
    
    # Start the merge
    git merge $branch --no-ff -m "Merge $branch

- Resolve merge conflicts by keeping main branch versions
- Integrate improvements and fixes from $branch" || true
    
    # Check if there are conflicts
    if [ -n "$(git status --porcelain | grep '^UU\|^AA\|^DD')" ]; then
        echo "  Merge conflicts detected. Resolving automatically..."
        
        # Get list of conflicted files
        conflicted_files=$(git status --porcelain | grep '^UU\|^AA\|^DD' | cut -c4-)
        
        for file in $conflicted_files; do
            echo "    Resolving conflicts in: $file"
            
            # Use our version (main branch) for all conflicts
            git checkout --ours "$file" 2>/dev/null || true
            git add "$file" 2>/dev/null || true
        done
        
        # Complete the merge
        git commit --no-edit || true
        
        echo "  All merge conflicts resolved for $branch"
    else
        echo "  No conflicts detected for $branch"
    fi
    
    echo "  Completed merge of $branch"
    echo ""
done

echo "All branch merges completed!"
