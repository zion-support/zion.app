#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CommonJS setup
const __filename = require.resolve('./fix-all-duplicates.cjs');
const __dirname = path.dirname(__filename);
const glob = require('glob');

// Find all TypeScript/TSX files in the app directory
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: __dirname });

console.log(`Found ${files.length} TypeScript files to check...`);

let fixedFiles = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split content into lines
  const lines = content.split('\n');
  const newLines = [];
  const seenImports = new Set();
  let inImportBlock = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is an import line
    if (line.trim().startsWith('import ')) {
      if (seenImports.has(line.trim())) {
        // Skip duplicate import
        console.log(`Removing duplicate import in ${file}: ${line.trim()}`);
        continue;
      } else {
        seenImports.add(line.trim());
        newLines.push(line);
      }
    } else if (line.trim() === '' && inImportBlock) {
      // Empty line in import block - keep it
      newLines.push(line);
    } else {
      // Not an import line - we're out of the import block
      inImportBlock = false;
      newLines.push(line);
    }
  }
  
  const newContent = newLines.join('\n');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    fixedFiles++;
    console.log(`Fixed duplicate imports in: ${file}`);
  }
});

console.log(`\nFixed duplicate imports in ${fixedFiles} files.`);