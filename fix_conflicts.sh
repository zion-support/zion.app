#!/bin/bash

# Script to fix all remaining merge conflict markers
set -e

echo "Fixing remaining merge conflict markers..."

# Find all files with conflict markers
CONFLICT_FILES=$(find app -name "*.tsx" -o -name "*.ts" | xargs grep -l "<<<<<<< HEAD" 2>/dev/null || true)

if [ -z "$CONFLICT_FILES" ]; then
    echo "No conflict markers found."
    exit 0
fi

echo "Found files with conflicts: $CONFLICT_FILES"

for file in $CONFLICT_FILES; do
    echo "Fixing conflicts in $file..."
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file to resolve conflicts by choosing our version (HEAD)
    awk '
    /^<<<<<<< HEAD/ { in_ours = 1; next }
    /^=======/ { in_ours = 0; in_theirs = 1; next }
    /^>>>>>>> / { in_theirs = 0; next }
    in_ours || (!in_ours && !in_theirs) { print }
    ' "$file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    echo "Fixed conflicts in $file"
done

echo "All conflict markers resolved!"