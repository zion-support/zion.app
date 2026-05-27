const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix unused variables and function names
function fixUnusedVars(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix unused function names that are defined but not used (like PageNamePage)
    const unusedFunctionPattern = /function\s+(\w+Page)\s*\([^)]*\)\s*{[\s\S]*?}\s*export\s+default\s+\1;/g;
    const match = content.match(unusedFunctionPattern);
    if (match) {
      // Replace with anonymous function export
      content = content.replace(unusedFunctionPattern, (match, funcName) => {
        return match.replace(`function ${funcName}`, 'function').replace(`export default ${funcName}`, 'export default');
      });
      modified = true;
    }
    
    // Fix unused variable declarations with underscore prefix
    const unusedVarPatterns = [
      /const\s+(\w+Page)\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?};\s*export\s+default\s+\1;/g,
      /function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?}\s*export\s+default\s+\1;/g
    ];
    
    unusedVarPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, (match, varName) => {
          return match.replace(`const ${varName}`, 'const').replace(`function ${varName}`, 'function').replace(`export default ${varName}`, 'export default');
        });
        modified = true;
      }
    });
    
    // Fix unused props parameters
    content = content.replace(/\(_props\)/g, '()');
    content = content.replace(/\(props\)/g, '()');
    
    // Fix unused imports in type definitions
    content = content.replace(/import\s*{\s*ReactNode\s*}\s*from\s*['"]react['"];\n?/g, '');
    content = content.replace(/import\s*{\s*PerformanceEventTiming\s*}\s*from\s*['"]web-vitals['"];\n?/g, '');
    content = content.replace(/import\s*{\s*LayoutShift\s*}\s*from\s*['"]web-vitals['"];\n?/g, '');
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed unused variables in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files that might have unused variables
const files = glob.sync('app/**/*.{ts,tsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixUnusedVars(file)) {
    fixedCount++;
  }
});

console.log(`Fixed unused variables in ${fixedCount} files.`);