const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix console.log warnings
function fixConsoleWarnings(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace console.log statements with proper logging or remove them
    const consolePatterns = [
      // Replace console.log with proper logging in production
      /console\.log\([^)]*\);?\n?/g,
      /console\.warn\([^)]*\);?\n?/g,
      /console\.error\([^)]*\);?\n?/g,
      /console\.info\([^)]*\);?\n?/g,
      /console\.debug\([^)]*\);?\n?/g
    ];
    
    consolePatterns.forEach(pattern => {
      if (content.match(pattern)) {
        // For production builds, we'll comment out console statements
        content = content.replace(pattern, (match) => {
          // Keep error logging but comment out others
          if (match.includes('console.error')) {
            return match; // Keep error logs
          }
          return `// ${match.trim()}`;
        });
        modified = true;
      }
    });
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed console warnings in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files that might have console warnings
const files = glob.sync('app/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });

console.log(`Found ${files.length} files to process...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixConsoleWarnings(file)) {
    fixedCount++;
  }
});

console.log(`Fixed console warnings in ${fixedCount} files.`);