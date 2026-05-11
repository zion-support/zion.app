#!/bin/bash

echo "Resolving all merge conflicts by accepting incoming changes..."

# Find all conflicted files
conflicted_files=$(git status --porcelain | grep "^UU\|^AA\|^DD" | awk '{print $2}')

if [ -n "$conflicted_files" ]; then
    echo "Found conflicted files:"
    echo "$conflicted_files"
    
    # For each conflicted file, accept the incoming version
    for file in $conflicted_files; do
        echo "Resolving conflicts in $file..."
        git checkout --theirs "$file"
        git add "$file"
    done
    
    # Commit the merge
    git commit --no-edit
    echo "✅ Successfully resolved all conflicts and completed merge"
else
    echo "No conflicted files found"
fi