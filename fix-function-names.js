import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files in the micro-saas-services directory
const files = await glob('app/micro-saas-services/**/*.{ts,tsx}', { cwd: '/workspace' });

console.log(`Found ${files.length} files to check`);

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join('/workspace', file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Extract the page name from the file path
    const pageName = path.basename(file, '.tsx');
    const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
    
    // Fix function name from pagePage to proper component name
    if (content.includes('function pagePage()')) {
      content = content.replace('function pagePage()', `function ${componentName}()`);
      content = content.replace(`<pagePage`, `<${componentName}`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${file} -> ${componentName}`);
      fixedCount++;
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`Fixed ${fixedCount} files`);