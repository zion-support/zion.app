import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files in the app directory
const files = await glob('app/**/*.tsx', { cwd: process.cwd() });

let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file uses Navigation or Footer but doesn't import them
  const usesNavigation = content.includes('<Navigation') || content.includes('<Navigation />');
  const usesFooter = content.includes('<Footer') || content.includes('<Footer />');
  const hasNavigationImport = content.includes('import Navigation');
  const hasFooterImport = content.includes('import Footer');
  const hasReactImport = content.includes('import React');

  if ((usesNavigation || usesFooter) && (!hasNavigationImport || !hasFooterImport)) {
    // Find the line with export const metadata or the first import
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find where to insert imports
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith("'use client'")) {
        insertIndex = i + 1;
      } else if (lines[i].startsWith('export const metadata')) {
        insertIndex = i;
        break;
      }
    }

    // Build import statements
    let imports = [];
    if (!hasReactImport) {
      imports.push("import React from 'react';");
    }
    if (usesNavigation && !hasNavigationImport) {
      const relativePath = filePath.includes('/') ? '../'.repeat(filePath.split('/').length - 2) + 'components/Navigation' : './components/Navigation';
      imports.push(`import Navigation from '${relativePath}';`);
    }
    if (usesFooter && !hasFooterImport) {
      const relativePath = filePath.includes('/') ? '../'.repeat(filePath.split('/').length - 2) + 'components/Footer' : './components/Footer';
      imports.push(`import Footer from '${relativePath}';`);
    }

    if (imports.length > 0) {
      // Insert imports
      lines.splice(insertIndex, 0, ...imports);
      content = lines.join('\n');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed imports in: ${filePath}`);
  }
});

console.log(`Fixed ${fixedCount} files with missing imports`);