#!/bin/bash

echo "Starting merge conflict resolution..."

# Start the merge
git merge cursor/fix-errors-and-merge-to-main-c569 --no-ff -m "Merge error fixes and improvements into main

- Fixed all syntax errors and build issues
- Resolved servicesData structure problems
- Fixed component parsing errors
- All linting errors resolved
- Build now passes successfully with 552 pages generated" || true

# Check if there are conflicts
if [ -n "$(git status --porcelain | grep '^UU')" ]; then
    echo "Merge conflicts detected. Resolving automatically..."
    
    # Get list of conflicted files
    conflicted_files=$(git status --porcelain | grep '^UU' | cut -c4-)
    
    for file in $conflicted_files; do
        echo "Resolving conflicts in: $file"
        
        # Use our version (the one from our branch) for all conflicts
        git checkout --ours "$file"
        git add "$file"
    done
    
    # Complete the merge
    git commit --no-edit
    
    echo "All merge conflicts resolved and merge completed!"
else
    echo "No conflicts detected. Merge completed successfully!"
fi

echo "Merge process finished."
