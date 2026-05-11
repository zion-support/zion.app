const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix all remaining issues
function fixAllIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove duplicate export statements
    const lines = content.split('\n');
    const exportLines = [];
    const otherLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('export default')) {
        exportLines.push({ line, index: i });
      } else {
        otherLines.push({ line, index: i });
      }
    }
    
    // If there are multiple export default statements, keep only the first one
    if (exportLines.length > 1) {
      const firstExport = exportLines[0];
      const newLines = lines.filter((line, index) => {
        if (line.trim().startsWith('export default')) {
          return index === firstExport.index;
        }
        return true;
      });
      content = newLines.join('\n');
      modified = true;
    }
    
    // Fix orphaned export default statements
    if (content.includes('export default;')) {
      content = content.replace('export default;\n', '');
      modified = true;
    }
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed issues in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixAllIssues(file)) {
    fixedCount++;
  }
});

console.log(`Fixed issues in ${fixedCount} files.`);