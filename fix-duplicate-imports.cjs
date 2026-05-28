const fs = require('fs');
const path = require('path');

function fixDuplicateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix duplicate React imports
    const reactImportRegex = /import React from ['"]react['"];?\s*\n\s*import React from ['"]react['"];?/g;
    if (reactImportRegex.test(content)) {
      content = content.replace(reactImportRegex, 'import React from \'react\';');
      modified = true;
    }

    // Fix duplicate Navigation imports
    const navigationImportRegex = /import Navigation from ['"][^'"]*Navigation['"];?\s*\n\s*import Navigation from ['"][^'"]*Navigation['"];?/g;
    if (navigationImportRegex.test(content)) {
      content = content.replace(navigationImportRegex, (match) => {
        const lines = match.split('\n');
        return lines[0];
      });
      modified = true;
    }

    // Fix duplicate Footer imports
    const footerImportRegex = /import Footer from ['"][^'"]*Footer['"];?\s*\n\s*import Footer from ['"][^'"]*Footer['"];?/g;
    if (footerImportRegex.test(content)) {
      content = content.replace(footerImportRegex, (match) => {
        const lines = match.split('\n');
        return lines[0];
      });
      modified = true;
    }

    // Fix duplicate export default statements
    const exportDefaultRegex = /export default \w+;\s*\n\s*export default \w+;/g;
    if (exportDefaultRegex.test(content)) {
      content = content.replace(exportDefaultRegex, (match) => {
        const lines = match.split('\n');
        return lines[0];
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Find all .tsx files in the app directory
const appDir = path.join(__dirname, 'app');
const tsxFiles = findTsxFiles(appDir);

console.log(`Found ${tsxFiles.length} .tsx files`);

let fixedCount = 0;
for (const file of tsxFiles) {
  if (fixDuplicateImports(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files`);