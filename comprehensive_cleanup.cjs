const fs = require('fs');
const path = require('path');

function comprehensiveCleanup(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove unused imports
  content = content.replace(/import { ErrorBoundary } from '@\/components\/ErrorBoundary';\n/g, '');
  content = content.replace(/import { Metadata } from 'next';\n/g, '');
  content = content.replace(/import Head from 'next\/head';\n/g, '');
  content = content.replace(/import Footer from '@\/components\/Footer';\n/g, '');
  
  // Remove Head and Footer JSX elements
  content = content.replace(/<Head>[\s\S]*?<\/Head>/g, '');
  content = content.replace(/<Footer \/>/g, '');
  
  // Fix corrupted function names
  content = content.replace(/function Page[a-zA-Z0-9]+\(\)/g, 'function Page()');
  content = content.replace(/Page[a-zA-Z0-9]+\.displayName[\s\S]*?;/g, '');
  
  // Remove multiple export default statements, keep only the last one
  const exportMatches = content.match(/export default [^;]+;/g);
  if (exportMatches && exportMatches.length > 1) {
    // Remove all but the last export default
    const lastExport = exportMatches[exportMatches.length - 1];
    content = content.replace(/export default [^;]+;/g, '');
    content += '\n' + lastExport;
  }
  
  // Ensure there's only one export default Page
  if (!content.includes('export default Page')) {
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
    comprehensiveCleanup(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log(`Comprehensive cleanup completed on ${fixedCount} files`);
