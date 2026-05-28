import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const files = await glob('app/**/*.tsx', { cwd: process.cwd() });
let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file has merge conflicts
  if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
    console.log(`Resolving conflicts in: ${filePath}`);
    
    // Remove all merge conflict markers and keep the content from our branch (after =======)
    const lines = content.split('\n');
    const resolvedLines = [];
    let inConflict = false;
    let keepContent = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('<<<<<<< HEAD')) {
        inConflict = true;
        keepContent = false;
        continue;
      }
      
      if (line.includes('=======')) {
        keepContent = true;
        continue;
      }
      
      if (line.includes('>>>>>>>')) {
        inConflict = false;
        keepContent = false;
        continue;
      }
      
      if (!inConflict || keepContent) {
        resolvedLines.push(line);
      }
    }
    
    content = resolvedLines.join('\n');
    
    // Clean up any remaining conflict markers
    content = content.replace(/<<<<<<< HEAD\n?/g, '');
    content = content.replace(/=======\n?/g, '');
    content = content.replace(/>>>>>>> [^\n]+\n?/g, '');
    
    // Clean up extra newlines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed: ${filePath}`);
  }
});

console.log(`Resolved conflicts in ${fixedCount} files`);