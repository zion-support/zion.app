const fs = require('fs');
const path = require('path');

// Function to remove unused imports
function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove ErrorBoundary imports that are not used
    if (content.includes('import ErrorBoundary') && !content.includes('<ErrorBoundary')) {
      content = content.replace(/import ErrorBoundary from.*\n/g, '');
      modified = true;
    }
    
    // Remove unused variable declarations
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines that declare unused variables
      if (line.includes('Warning:') && line.includes('is defined but never used')) {
        continue;
      }
      
      // Remove unused function declarations
      if (line.match(/^\s*function\s+\w+Page\(\)\s*\{/) && !content.includes(`<${line.match(/function\s+(\w+Page)/)[1]}`)) {
        // Find the end of the function and remove it
        let braceCount = 0;
        let j = i;
        while (j < lines.length) {
          const currentLine = lines[j];
          braceCount += (currentLine.match(/\{/g) || []).length;
          braceCount -= (currentLine.match(/\}/g) || []).length;
          if (braceCount === 0 && currentLine.includes('}')) {
            break;
          }
          j++;
        }
        i = j; // Skip the entire function
        modified = true;
        continue;
      }
      
      newLines.push(line);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, newLines.join('\n'));
      console.log(`Removed unused imports: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Find all .tsx files in the app directory
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const appDir = path.join(__dirname, 'app');
const tsxFiles = findTsxFiles(appDir);

let fixedCount = 0;
for (const file of tsxFiles) {
  if (removeUnusedImports(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files with unused imports`);
