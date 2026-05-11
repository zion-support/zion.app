#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TypeScript/TSX files in the app directory
function getAllTsxFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix "use client" directive placement
function fixUseClient(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file has "use client" directive
    if (content.includes("'use client'")) {
      const lines = content.split('\n');
      
      // Find the "use client" line
      const useClientIndex = lines.findIndex(line => line.includes("'use client'"));
      
      if (useClientIndex > 0) {
        // Move "use client" to the top
        const useClientLine = lines[useClientIndex];
        lines.splice(useClientIndex, 1);
        lines.unshift(useClientLine);
        
        content = lines.join('\n');
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed use client directive: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('Starting use client directive fixes...');

const appDir = path.join(__dirname, 'app');
const files = getAllTsxFiles(appDir);

console.log(`Found ${files.length} TypeScript/TSX files`);

files.forEach(fixUseClient);

console.log('Use client directive fixes completed!');