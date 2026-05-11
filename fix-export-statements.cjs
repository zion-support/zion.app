const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix orphaned export statements
function fixExportStatements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix orphaned export default statements
    if (content.includes('export default;')) {
      // Find the function name before the export
      const functionMatch = content.match(/export default function (\w+)\(/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        content = content.replace('export default;', `export default ${functionName};`);
        modified = true;
      } else {
        // If no function name found, remove the orphaned export
        content = content.replace('export default;\n', '');
        modified = true;
      }
    }
    
    // Fix function declarations without names
    content = content.replace(/^function\(\)\s*{/gm, 'export default function Page() {');
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed export statements in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files that might have export issues
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixExportStatements(file)) {
    fixedCount++;
  }
});

console.log(`Fixed export statements in ${fixedCount} files.`);