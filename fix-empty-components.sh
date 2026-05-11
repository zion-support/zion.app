#!/bin/bash

echo "Fixing empty components..."

# Find all component files that only have export default statements
find app/components -name "*.tsx" -exec sh -c '
  file="$1"
  if [ -f "$file" ]; then
    # Check if file only contains export default statement
    if [ $(wc -l < "$file") -eq 1 ] && grep -q "export default" "$file"; then
      echo "Fixing $file"
      
      # Extract component name from export statement
      component_name=$(grep "export default" "$file" | sed "s/export default //" | sed "s/;//")
      
      # Create proper component
      cat > "$file" << COMPONENT_EOF
'use client';

import React from 'react';

const $component_name: React.FC = () => {
  return (
    <div className="$component_name-container">
      <h2>$component_name Component</h2>
      <p>$component_name component placeholder</p>
    </div>
  );
};

export default $component_name;
COMPONENT_EOF
    fi
  fi
' _ {} \;

echo "Empty components fixed!"
