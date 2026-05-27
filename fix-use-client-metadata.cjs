const fs = require('fs');
const path = require('path');

// Function to fix use client + metadata export conflicts
function fixUseClientMetadataConflicts(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has both "use client" and export metadata
    if (content.includes("'use client'") && content.includes('export const metadata')) {
      console.log(`Fixing ${filePath}`);
      
      // Remove the "use client" directive
      content = content.replace(/'use client';\n?/g, '');
      
      // Write the fixed content back
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix all TSX files
function fixAllFiles(dir) {
  let fixedCount = 0;
  
  function processDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.tsx')) {
        if (fixUseClientMetadataConflicts(filePath)) {
          fixedCount++;
        }
      }
    }
  }
  
  processDirectory(dir);
  return fixedCount;
}

// Main execution
console.log('Starting to fix use client + metadata export conflicts...');
const fixedCount = fixAllFiles('./app');
console.log(`Fixed ${fixedCount} files`);
console.log('Done!');