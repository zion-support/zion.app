import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files in the app directory
const files = await glob('app/**/*.tsx', { cwd: process.cwd() });

let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file contains merge conflict markers
  if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
    // Remove merge conflict markers and keep the HEAD version
    content = content.replace(/<<<<<<< HEAD\n/g, '');
    content = content.replace(/=======\n/g, '');
    content = content.replace(/>>>>>>> [^\n]+\n/g, '');
    
    // Clean up any remaining empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed merge conflicts in: ${filePath}`);
  }
});

console.log(`Fixed ${fixedCount} files with merge conflicts`);