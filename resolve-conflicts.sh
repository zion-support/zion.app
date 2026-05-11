#!/bin/bash

echo "Resolving all merge conflicts by accepting main branch changes..."

# Get list of all conflicted files
conflicted_files=$(git status --porcelain | grep '^UU\|^AA\|^DD' | cut -c4-)

echo "Found $(echo "$conflicted_files" | wc -l) conflicted files"

for file in $conflicted_files; do
    echo "Resolving conflicts in: $file"
    
    # Use our version (main branch) for all conflicts
    git checkout --ours "$file" 2>/dev/null || true
    git add "$file" 2>/dev/null || true
done

echo "All conflicts resolved!"
