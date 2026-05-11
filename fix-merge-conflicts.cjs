const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all files with merge conflicts
const files = glob.sync('app/**/*.tsx', { cwd: __dirname });

console.log(`Found ${files.length} files to check for merge conflicts`);

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
    console.log(`Fixing merge conflicts in: ${file}`);
    
    // Basic merge conflict resolution - take the newer version (after =======)
    let fixedContent = content
      .replace(/<<<<<<< HEAD[\s\S]*?=======\s*/, '')
      .replace(/>>>>>>> [^\n]*\n?/g, '')
      .replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> [^\n]*\n?/g, '');
    
    // Clean up any remaining conflict markers
    fixedContent = fixedContent
      .replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> [^\n]*\n?/g, '')
      .replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> [^\n]*\n?/g, '')
      .replace(/=======[\s\S]*?>>>>>>> [^\n]*\n?/g, '');
    
    // Clean up any malformed imports
    fixedContent = fixedContent
      .replace(/import\s+React\s+from\s+'react'\s*;\s*;\s*/g, "import React from 'react';\n")
      .replace(/import\s+React\s+from\s+'react'\s*\n\s*;\s*/g, "import React from 'react';\n")
      .replace(/;\s*import/g, ';\nimport')
      .replace(/;\s*const/g, ';\nconst')
      .replace(/;\s*function/g, ';\nfunction')
      .replace(/;\s*export/g, ';\nexport');
    
    // Ensure proper import structure
    const lines = fixedContent.split('\n');
    const importLines = [];
    const otherLines = [];
    let inImports = true;
    
    for (const line of lines) {
      if (inImports && (line.trim().startsWith('import ') || line.trim().startsWith("'use client'") || line.trim() === '')) {
        importLines.push(line);
      } else {
        inImports = false;
        otherLines.push(line);
      }
    }
    
    // Clean up import lines
    const cleanImports = importLines
      .filter(line => line.trim() !== '')
      .map(line => line.trim())
      .filter((line, index, arr) => arr.indexOf(line) === index) // remove duplicates
      .join('\n');
    
    fixedContent = cleanImports + '\n\n' + otherLines.join('\n');
    
    fs.writeFileSync(filePath, fixedContent);
    fixedCount++;
  }
});

console.log(`Fixed merge conflicts in ${fixedCount} files`);