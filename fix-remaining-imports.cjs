const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to remove unused imports from a file
function fixUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove unused ErrorBoundary imports (various patterns)
    const errorBoundaryPatterns = [
      /import { ErrorBoundary } from '\.\.\/components\/ErrorBoundary';\n?/g,
      /import { ErrorBoundary } from '\.\.\/\.\.\/components\/ErrorBoundary';\n?/g,
      /import { ErrorBoundary } from '\.\.\/\.\.\/\.\.\/components\/ErrorBoundary';\n?/g,
      /import { ErrorBoundary } from '\.\.\/\.\.\/\.\.\/\.\.\/components\/ErrorBoundary';\n?/g
    ];
    
    errorBoundaryPatterns.forEach(pattern => {
      if (content.match(pattern) && 
          !content.includes('<ErrorBoundary') && 
          !content.includes('ErrorBoundary(')) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });
    
    // Remove unused variable declarations
    // Fix unused function names that are defined but not used
    const unusedFunctionPatterns = [
      /function\s+(\w+Page)\s*\([^)]*\)\s*{[\s\S]*?}\s*export\s+default\s+\1;/g,
      /const\s+(\w+Page)\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?};\s*export\s+default\s+\1;/g
    ];
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed unused imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files in specific directories that still have issues
const directories = [
  'app/ai-services/**/*.{ts,tsx}',
  'app/micro-saas/**/*.{ts,tsx}',
  'app/micro-saas-services/**/*.{ts,tsx}',
  'app/it-services/**/*.{ts,tsx}',
  'app/medical-records-manager/**/*.{ts,tsx}',
  'app/online-learning-platform/**/*.{ts,tsx}',
  'app/property-management-ai/**/*.{ts,tsx}',
  'app/supply-chain-optimizer/**/*.{ts,tsx}',
  'app/test/**/*.{ts,tsx}',
  'app/zion-ai-api-tester/**/*.{ts,tsx}',
  'app/zion-ai-database-optimizer/**/*.{ts,tsx}'
];

let allFiles = [];
directories.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: process.cwd() });
  allFiles = allFiles.concat(files);
});

console.log(`Found ${allFiles.length} files to process...`);

let fixedCount = 0;
allFiles.forEach(file => {
  if (fixUnusedImports(file)) {
    fixedCount++;
  }
});

console.log(`Fixed unused imports in ${fixedCount} files.`);