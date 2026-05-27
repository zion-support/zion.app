import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to remove 'use client' directive from page files
function removeClientDirective(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove 'use client' directive
    content = content.replace(/^'use client';\s*\n?/gm, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed 'use client' from: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  // Get all page.tsx files
  const files = await glob('app/**/page.tsx', { cwd: '/workspace' });

  console.log(`Found ${files.length} page files to fix`);

  let fixedCount = 0;
  files.forEach(file => {
    const fullPath = path.join('/workspace', file);
    if (removeClientDirective(fullPath)) {
      fixedCount++;
    }
  });

  console.log(`Fixed ${fixedCount} out of ${files.length} files`);
}

main().catch(console.error);