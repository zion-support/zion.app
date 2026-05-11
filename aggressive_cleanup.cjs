const fs = require('fs');
const path = require('path');

function aggressiveCleanup(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all problematic imports
  content = content.replace(/import { ErrorBoundary } from '@\/components\/ErrorBoundary';\n?/g, '');
  content = content.replace(/import { Footer } from '@\/components\/Footer';\n?/g, '');
  content = content.replace(/import { Metadata } from 'next';\n?/g, '');
  content = content.replace(/import Head from 'next\/head';\n?/g, '');
  content = content.replace(/import Footer from '@\/components\/Footer';\n?/g, '');
  
  // Remove any remaining Head and Footer references
  content = content.replace(/<Head>[\s\S]*?<\/Head>/g, '');
  content = content.replace(/<Footer \/>/g, '');
  content = content.replace(/<Footer>/g, '');
  content = content.replace(/<\/Footer>/g, '');
  
  // Fix function names
  content = content.replace(/function [A-Za-z]+Page\(\)/g, 'function Page()');
  content = content.replace(/function [A-Za-z]+Page\(\)/g, 'function Page()');
  
  // Remove any displayName properties
  content = content.replace(/[A-Za-z]+Page\.displayName[\s\S]*?;/g, '');
  
  // Ensure only one export default Page
  const exportMatches = content.match(/export default [^;]+;/g);
  if (exportMatches && exportMatches.length > 1) {
    content = content.replace(/export default [^;]+;/g, '');
    content += '\nexport default Page;';
  } else if (!content.includes('export default Page')) {
    content = content.replace(/export default [^;]+;/g, 'export default Page;');
  }
  
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
    aggressiveCleanup(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log(`Aggressive cleanup completed on ${fixedCount} files`);
