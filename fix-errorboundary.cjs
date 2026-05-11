const fs = require('fs');
const path = require('path');

// Function to fix ErrorBoundary issues in a file
function fixErrorBoundary(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has ErrorBoundary usage
    if (content.includes('ErrorBoundary')) {
      // Remove the Wrapped function pattern and ErrorBoundary usage
      content = content.replace(
        /export default function Wrapped\(props: \{ \[key: string\]: unknown \}\) \{\s*return \(\s*<ErrorBoundary>\s*<[^>]+Page \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/gs,
        ''
      );
      
      // Remove any remaining ErrorBoundary references
      content = content.replace(/<ErrorBoundary>/g, '');
      content = content.replace(/<\/ErrorBoundary>/g, '');
      
      // Clean up any extra whitespace
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      // Write the fixed content back
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
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
  if (fixErrorBoundary(file)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} files with ErrorBoundary issues`);
