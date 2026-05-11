const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Remove duplicate imports by keeping only the first occurrence
    const lines = content.split('\n');
    const seenImports = new Set();
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if it's an import statement
      if (line.startsWith('import ')) {
        // Extract the import name (what's being imported)
        const importMatch = line.match(/import\s+(\w+)/);
        if (importMatch) {
          const importName = importMatch[1];
          if (seenImports.has(importName)) {
            // Skip duplicate import
            modified = true;
            continue;
          } else {
            seenImports.add(importName);
          }
        }
      }
      
      newLines.push(lines[i]);
    }
    
    if (modified) {
      content = newLines.join('\n');
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
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files`);