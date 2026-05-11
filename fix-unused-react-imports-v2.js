#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files in the app directory
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

let fixedCount = 0;

files.forEach(file => {
  try {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has unused React import
    const lines = content.split('\n');
    let hasUnusedReactImport = false;
    let reactImportLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Look for React import on line 2 (index 1)
      if (i === 1 && (line === "import React from 'react';" || line === 'import React from "react";')) {
        hasUnusedReactImport = true;
        reactImportLine = i;
        break;
      }
    }
    
    if (hasUnusedReactImport) {
      // Remove the React import line
      lines.splice(reactImportLine, 1);
      const newContent = lines.join('\n');
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} files with unused React imports.`);