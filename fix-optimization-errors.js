#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix duplicate metadata exports
    if (content.includes('export const metadata')) {
      const metadataMatches = content.match(/export const metadata = \{[\s\S]*?\};/g);
      if (metadataMatches && metadataMatches.length > 1) {
        // Keep only the first metadata export
        const firstMetadata = metadataMatches[0];
        content = content.replace(/export const metadata = \{[\s\S]*?\};/g, '');
        content = firstMetadata + '\n' + content;
        modified = true;
      }
    }
    
    // Fix useCallback issues - remove incorrect useCallback usage
    if (content.includes('useCallback')) {
      // Remove useCallback from non-hook contexts
      content = content.replace(
        /const \w+ = useCallback\([^)]*\), \[dependencies\]\);/g,
        (match) => {
          const varName = match.match(/const (\w+) = useCallback/)[1];
          const callbackBody = match.match(/useCallback\(([^)]*)\)/)[1];
          return `const ${varName} = ${callbackBody};`;
        }
      );
      
      // Fix useCallback with undefined dependencies
      content = content.replace(
        /useCallback\([^)]*\), \[dependencies\]\)/g,
        (match) => {
          const callbackBody = match.match(/useCallback\(([^)]*)\)/)[1];
          return callbackBody;
        }
      );
      
      modified = true;
    }
    
    // Fix React.memo issues
    if (content.includes('React.memo')) {
      // Fix malformed React.memo usage
      content = content.replace(
        /const \w+ = React\.memo\(function \w+\([^)]*\)\s*\{[\s\S]*?\}\s*\)/g,
        (match) => {
          const varName = match.match(/const (\w+) = React\.memo/)[1];
          const functionBody = match.match(/React\.memo\(function \w+\([^)]*\)\s*(\{[\s\S]*?\})/)[1];
          return `function ${varName}${functionBody}`;
        }
      );
      modified = true;
    }
    
    // Fix parsing errors - remove malformed code
    content = content.replace(/\n\s*\)\s*$/gm, '');
    content = content.replace(/\n\s*\)\s*\n/g, '\n');
    
    // Fix empty block statements
    content = content.replace(/\{\s*\}/g, '{ /* empty */ }');
    
    // Fix missing imports
    if (content.includes('useCallback') && !content.includes("import { useCallback }")) {
      if (content.includes("import React")) {
        content = content.replace(
          /import React[^;]*;/,
          'import React, { useCallback, useMemo } from "react";'
        );
      } else {
        content = 'import { useCallback, useMemo } from "react";\n' + content;
      }
      modified = true;
    }
    
    // Remove metadata from client components
    if (content.includes('"use client"') && content.includes('export const metadata')) {
      content = content.replace(/export const metadata = \{[\s\S]*?\};\n?/g, '');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixedCount += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixFile(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('🔧 Fixing optimization errors...');
const fixedCount = processDirectory('./app');
console.log(`✅ Fixed ${fixedCount} files`);