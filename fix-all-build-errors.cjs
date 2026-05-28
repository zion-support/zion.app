const fs = require('fs');
const path = require('path');

// Function to fix common build errors
function fixBuildErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix onClick syntax errors
    if (content.includes('onClick={() = aria-label=')) {
      content = content.replace(/onClick=\{\(\) = aria-label="[^"]*"> ([^}]+)\}/g, 'onClick={() => $1}');
      modified = true;
    }

    // Fix broken JSX syntax like < {...props} />
    if (content.includes('< {...props} />')) {
      content = content.replace(/<\s*\{\.\.\.props\}\s*\/>/g, '<Component {...props} />');
      modified = true;
    }

    // Fix duplicate metadata exports
    const metadataRegex = /export const metadata = \{[\s\S]*?\};\s*;\s*import[\s\S]*?export const metadata = \{[\s\S]*?\};/g;
    if (metadataRegex.test(content)) {
      content = content.replace(metadataRegex, (match) => {
        const firstMetadata = match.match(/export const metadata = \{[\s\S]*?\};/)[0];
        const rest = match.replace(/export const metadata = \{[\s\S]*?\};\s*;\s*/, '');
        return firstMetadata + '\n' + rest;
      });
      modified = true;
    }

    // Fix import path issues
    if (content.includes("from '@/components/ErrorBoundary'")) {
      content = content.replace("from '@/components/ErrorBoundary'", "from '../components/ErrorBoundary'");
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
        if (fixBuildErrors(filePath)) {
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
console.log('Starting to fix build errors...');
const fixedCount = fixAllFiles('./app');
console.log(`Fixed ${fixedCount} files`);
console.log('Done!');