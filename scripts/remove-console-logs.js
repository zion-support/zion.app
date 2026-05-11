#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Files to exclude from console.log removal
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/__tests__/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/scripts/**',
  '**/backup*/**',
  '**/disabled*/**',
  '**/api-disabled/**',
  '**/api.disabled/**'
];

// Get all TypeScript and JavaScript files
const files = await glob('**/*.{ts,tsx,js,jsx}', {
  ignore: excludePatterns,
  cwd: process.cwd()
});

let totalRemoved = 0;
let filesProcessed = 0;

console.log('🧹 Removing console.log statements from production code...\n');

for (const file of files) {
  try {
    const filePath = path.resolve(file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove console.log, console.warn, console.error statements
    // But keep console.error in development mode checks
    const originalContent = content;
    
    const newContent = content
      // Remove standalone console.log statements
      .replace(/^\s*console\.log\([^)]*\);\s*$/gm, '')
      // Remove console.warn statements
      .replace(/^\s*console\.warn\([^)]*\);\s*$/gm, '')
      // Remove console.info statements
      .replace(/^\s*console\.info\([^)]*\);\s*$/gm, '')
      // Remove console.debug statements
      .replace(/^\s*console\.debug\([^)]*\);\s*$/gm, '')
      // Remove console.log in catch blocks (but keep error handling)
      .replace(/console\.log\([^)]*\);\s*$/gm, '')
      // Remove console.log in then/catch chains
      .replace(/\.then\([^)]*console\.log[^)]*\)/g, '.then(() => {})')
      .replace(/\.catch\([^)]*console\.log[^)]*\)/g, '.catch(() => {})')
      // Clean up empty lines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove empty catch blocks
      .replace(/catch\s*\(\s*[^)]*\s*\)\s*{\s*}\s*/g, 'catch () {}');

    // Count removed statements
    const removedCount = (originalContent.match(/console\.(log|warn|info|debug)\(/g) || []).length;
    
    if (removedCount > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ ${file}: Removed ${removedCount} console statement(s)`);
      totalRemoved += removedCount;
    }
    
    filesProcessed++;
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log(`\n🎉 Console log cleanup complete!`);
console.log(`📊 Files processed: ${filesProcessed}`);
console.log(`🗑️  Total console statements removed: ${totalRemoved}`);
console.log(`\n💡 Note: console.error statements in development mode checks were preserved.`);
