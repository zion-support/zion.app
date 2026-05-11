const fs = require('fs');
const path = require('path');

// Function to fix all common issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix broken JSX syntax
    if (content.includes('<\\n {...props} />')) {
      content = content.replace(/<\s*\\n\s*\{\.\.\.props\}\s*\/>/g, '<Component {...props} />');
      modified = true;
    }

    // Fix duplicate metadata exports
    const lines = content.split('\\n');
    const metadataLines = [];
    let inMetadata = false;
    let metadataCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim().startsWith('export const metadata = {')) {
        if (metadataCount === 0) {
          metadataLines.push(i);
          inMetadata = true;
          metadataCount++;
        } else {
          // Skip duplicate metadata
          inMetadata = false;
        }
      } else if (inMetadata && line.trim() === '};') {
        inMetadata = false;
      } else if (inMetadata) {
        metadataLines.push(i);
      }
    }

    if (metadataCount > 1) {
      // Remove duplicate metadata blocks
      const newLines = [];
      let skipUntil = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (i === skipUntil) {
          skipUntil = -1;
          continue;
        }
        
        if (line.trim().startsWith('export const metadata = {') && !metadataLines.includes(i)) {
          // Skip this metadata block
          skipUntil = i;
          while (skipUntil < lines.length && !lines[skipUntil].trim().endsWith('};')) {
            skipUntil++;
          }
          skipUntil++;
          continue;
        }
        
        newLines.push(lines[i]);
      }
      
      content = newLines.join('\\n');
      modified = true;
    }

    // Fix import path issues
    if (content.includes("from '../components/ErrorBoundary'")) {
      content = content.replace("from '../components/ErrorBoundary'", "from '../../components/ErrorBoundary'");
      modified = true;
    }

    if (modified) {
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
        if (fixFile(filePath)) {
          fixedCount++;
          console.log(`Fixed: ${filePath}`);
        }
      }
    }
  }
  
  processDirectory(dir);
  return fixedCount;
}

// Main execution
console.log('Starting comprehensive fix...');
const fixedCount = fixAllFiles('./app');
console.log(`Fixed ${fixedCount} files`);
console.log('Done!');