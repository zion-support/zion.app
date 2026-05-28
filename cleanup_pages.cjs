const fs = require('fs');
const path = require('path');

function cleanupPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove duplicate metadata declarations
  const metadataRegex = /export const metadata = \{[\s\S]*?\};/g;
  const matches = content.match(metadataRegex);
  if (matches && matches.length > 1) {
    // Keep only the first metadata declaration
    content = content.replace(metadataRegex, (match, offset) => {
      return offset === content.indexOf(match) ? match : '';
    });
  }
  
  // Remove 'use client' if it appears after metadata
  content = content.replace(/\nexport const metadata[\s\S]*?\};\n;\n'use client';\n/, '\nexport const metadata = {\n  title: \'Page | Zion Tech Group\',\n  description: \'Professional page services by Zion Tech Group\',\n  keywords: \'page, technology, services\',\n  openGraph: {\n    title: \'Page | Zion Tech Group\',\n    description: \'Professional page services by Zion Tech Group\',\n    type: \'website\',\n  },\n};\n');
  
  // Remove duplicate semicolons
  content = content.replace(/;;+/g, ';');
  
  // Remove unused imports
  content = content.replace(/import.*ErrorBoundary.*\n/g, '');
  content = content.replace(/import Head from 'next\/head'\n/g, '');
  content = content.replace(/import Footer from '\.\.\/components\/Footer'\n/g, '');
  
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
pageFiles.forEach(cleanupPage);
console.log(`Cleaned up ${pageFiles.length} page files`);
