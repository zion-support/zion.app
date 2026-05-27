const fs = require('fs');
const path = require('path');

function fixRemainingIssues(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add Metadata import if it's used but not imported
  if (content.includes('Metadata') && !content.includes('import { Metadata }')) {
    content = 'import { Metadata } from \'next\';\n' + content;
  }
  
  // Remove remaining unused imports
  content = content.replace(/import ErrorBoundary from '\.\.\/components\/ErrorBoundary';\n?/g, '');
  content = content.replace(/import { ErrorBoundary } from '@\/components\/ErrorBoundary';\n?/g, '');
  content = content.replace(/import { ErrorBoundary } from '\.\.\/components\/ErrorBoundary';\n?/g, '');
  content = content.replace(/import Footer from '\.\.\/components\/Footer';\n?/g, '');
  content = content.replace(/import { Footer } from '@\/components\/Footer';\n?/g, '');
  content = content.replace(/import { Footer } from '\.\.\/components\/Footer';\n?/g, '');
  
  // Clean up empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
}

// Find all page.tsx files
const findPageFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (item === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
};

const pageFiles = findPageFiles('./app');
let fixedCount = 0;

pageFiles.forEach(file => {
  try {
    fixRemainingIssues(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log(`Fixed remaining issues in ${fixedCount} files`);
