const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix orphaned export statements
function fixOrphanedExports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix orphaned export default statements
    if (content.includes('export default;')) {
      // Get the function name from the function declaration
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
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed orphaned exports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files that might have orphaned exports
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixOrphanedExports(file)) {
    fixedCount++;
  }
});

console.log(`Fixed orphaned exports in ${fixedCount} files.`);