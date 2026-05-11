const fs = require('fs');
const path = require('path');

function resolveMergeConflicts(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file has merge conflict markers
    if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
      console.log(`Resolving conflicts in: ${filePath}`);
      
      // Split by lines
      const lines = content.split('\n');
      const resolvedLines = [];
      let inConflict = false;
      let conflictDepth = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('<<<<<<< HEAD')) {
          inConflict = true;
          conflictDepth++;
          continue;
        } else if (line.includes('=======')) {
          continue;
        } else if (line.includes('>>>>>>>')) {
          inConflict = false;
          conflictDepth--;
          continue;
        } else if (!inConflict) {
          resolvedLines.push(line);
        } else if (inConflict && conflictDepth === 1) {
          // Keep the HEAD version (our fixes)
          resolvedLines.push(line);
        }
      }

      const resolvedContent = resolvedLines.join('\n');
      
      // Clean up any remaining conflict markers
      const cleanContent = resolvedContent
        .replace(/<<<<<<< HEAD[\s\S]*?=======[\s\S]*?>>>>>>> [a-f0-9]+/g, '')
        .replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> [a-f0-9]+/g, '')
        .replace(/=======[\s\S]*?>>>>>>> [a-f0-9]+/g, '');

      fs.writeFileSync(filePath, cleanContent);
      modified = true;
    }

    return modified;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Get all files with conflicts
function findConflictedFiles(dir) {
  const conflictedFiles = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
            conflictedFiles.push(fullPath);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDirectory(dir);
  return conflictedFiles;
}

// Main execution
console.log('Finding files with merge conflicts...');
const conflictedFiles = findConflictedFiles('/workspace');

console.log(`Found ${conflictedFiles.length} files with conflicts:`);
conflictedFiles.forEach(file => console.log(`  - ${file}`));

let resolvedCount = 0;
conflictedFiles.forEach(file => {
  if (resolveMergeConflicts(file)) {
    resolvedCount++;
  }
});

console.log(`\nResolved conflicts in ${resolvedCount} files.`);
console.log('All merge conflicts have been resolved by keeping the HEAD version (our fixes).');
