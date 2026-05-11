const fs = require('fs');
const path = require('path');

// CommonJS setup
const __filename = require.resolve('./fix-errorboundary-imports.cjs');
const __dirname = path.dirname(__filename);

// Function to fix ErrorBoundary imports in a file
function fixErrorBoundaryImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file uses ErrorBoundary but doesn't import it
    if (content.includes('ErrorBoundary') && !content.includes('import ErrorBoundary')) {
      // Add the import statement after the first import
      const lines = content.split('\n');
      let importIndex = -1;
      
      // Find the last import statement
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          importIndex = i;
        }
      }
      
      if (importIndex !== -1) {
        // Add the ErrorBoundary import after the last import
        lines.splice(importIndex + 1, 0, "import ErrorBoundary from '../components/GlobalErrorBoundary';");
        content = lines.join('\n');
        
        // Write the file back
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ErrorBoundary import in: ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all .tsx files
function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') && !item.includes('node_modules')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
const appDir = path.join(__dirname, 'app');
const tsxFiles = findTsxFiles(appDir);

console.log(`Found ${tsxFiles.length} .tsx files to check`);

let fixedCount = 0;
for (const file of tsxFiles) {
  if (fixErrorBoundaryImport(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ErrorBoundary imports in ${fixedCount} files`);