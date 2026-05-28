const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to remove unused imports from a file
function fixUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove unused ErrorBoundary imports
    if (content.includes("import { ErrorBoundary } from '../components/ErrorBoundary';") && 
        !content.includes('<ErrorBoundary') && 
        !content.includes('ErrorBoundary(')) {
      content = content.replace(/import { ErrorBoundary } from '\.\.\/components\/ErrorBoundary';\n?/g, '');
      modified = true;
    }
    
    // Remove unused Navigation imports
    if (content.includes("import Navigation from '../components/Navigation';") && 
        !content.includes('<Navigation') && 
        !content.includes('Navigation(')) {
      content = content.replace(/import Navigation from '\.\.\/components\/Navigation';\n?/g, '');
      modified = true;
    }
    
    // Remove unused Footer imports
    if (content.includes("import Footer from '../components/Footer';") && 
        !content.includes('<Footer') && 
        !content.includes('Footer(')) {
      content = content.replace(/import Footer from '\.\.\/components\/Footer';\n?/g, '');
      modified = true;
    }
    
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

// Find all TypeScript/TSX files in the app directory
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixUnusedImports(file)) {
    fixedCount++;
  }
});

console.log(`Fixed unused imports in ${fixedCount} files.`);