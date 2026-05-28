const fs = require('fs');
const path = require('path');

// CommonJS setup

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let fixedLines = [];
    let seenImports = new Set();
    let seenExports = new Set();
    // let inFunction = false;
    let functionName = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip duplicate React imports
      if (line.includes("import React from 'react';")) {
        if (!seenImports.has('React')) {
          fixedLines.push(line);
          seenImports.add('React');
        }
        continue;
      }
      
      // Skip duplicate component imports
      if (line.includes("import Footer from") || line.includes("import Navigation from")) {
        const componentName = line.includes('Footer') ? 'Footer' : 'Navigation';
        if (!seenImports.has(componentName)) {
          fixedLines.push(line);
          seenImports.add(componentName);
        }
        continue;
      }
      
      // Skip duplicate ErrorBoundary imports
      if (line.includes("import ErrorBoundary from")) {
        if (!seenImports.has('ErrorBoundary')) {
          fixedLines.push(line);
          seenImports.add('ErrorBoundary');
        }
        continue;
      }
      
      // Skip duplicate lucide-react imports
      if (line.includes("from 'lucide-react'")) {
        if (!seenImports.has('lucide-react')) {
          fixedLines.push(line);
          seenImports.add('lucide-react');
        }
        continue;
      }
      
      // Handle function declarations
      if (line.includes('export default function') && !line.includes('Wrapped')) {
        const match = line.match(/export default function (\w+)/);
        if (match) {
          functionName = match[1];
          fixedLines.push(`function ${functionName}()`);
          inFunction = true;  
          continue;
        }
      }
      
      // Handle Wrapped function - only keep one
      if (line.includes('export default function Wrapped')) {
        if (!seenExports.has('Wrapped')) {
          fixedLines.push(line);
          seenExports.add('Wrapped');
        }
        continue;
      }
      
      // Skip other duplicate exports
      if (line.includes('export default function') && line.includes('Wrapped')) {
        continue;
      }
      
      fixedLines.push(line);
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, fixedLines.join('\n'));
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      fixFile(filePath);
    }
  }
}

// Start fixing from the app directory
walkDir('./app');
console.log('Import fixing completed!');