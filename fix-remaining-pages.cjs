const fs = require('fs');
const path = require('path');

// Find all page.tsx files that need fixing
const findPageFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (item.name === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
};

const pageFiles = findPageFiles('./app');

console.log(`Found ${pageFiles.length} page files to check...`);

let fixedCount = 0;

for (const filePath of pageFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file needs fixing
    const needsNavigationImport = content.includes('<Navigation') && !content.includes('import Navigation');
    const needsFooterImport = content.includes('<Footer') && !content.includes('import Footer');
    const hasFunctionNotExported = content.includes('function ') && !content.includes('export default function');
    const hasWrapperFunction = content.includes('export default function Wrapped');
    
    if (needsNavigationImport || needsFooterImport || hasFunctionNotExported || hasWrapperFunction) {
      console.log(`Fixing ${filePath}...`);
      
      let newContent = content;
      
      // Add imports if missing
      if (needsNavigationImport || needsFooterImport) {
        const importLines = [];
        if (needsNavigationImport) {
          const relativePath = path.relative(path.dirname(filePath), './app/components').replace(/\\/g, '/');
          importLines.push(`import Navigation from '${relativePath}/Navigation';`);
        }
        if (needsFooterImport) {
          const relativePath = path.relative(path.dirname(filePath), './app/components').replace(/\\/g, '/');
          importLines.push(`import Footer from '${relativePath}/Footer';`);
        }
        
        // Add imports after existing imports
        const importMatch = newContent.match(/^(import.*?;[\s\n]*)+/m);
        if (importMatch) {
          newContent = newContent.replace(importMatch[0], importMatch[0] + importLines.join('\n') + '\n');
        } else {
          newContent = importLines.join('\n') + '\n\n' + newContent;
        }
      }
      
      // Fix function exports
      if (hasFunctionNotExported) {
        newContent = newContent.replace(/^function (\w+Page)\(/m, 'export default function $1(');
      }
      
      // Remove wrapper functions
      if (hasWrapperFunction) {
        newContent = newContent.replace(/\nexport default function Wrapped\(props: \{ \[key: string\]: unknown \}\) \{\s*return \(\s*<ErrorBoundary>\s*<[^>]+Page \{\\.\\.\\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/s, '');
      }
      
      // Remove unused ErrorBoundary imports
      if (newContent.includes('import ErrorBoundary') && !newContent.includes('<ErrorBoundary')) {
        newContent = newContent.replace(/import ErrorBoundary from '[^']+';[\s\n]*/g, '');
      }
      
      fs.writeFileSync(filePath, newContent);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`Fixed ${fixedCount} files`);