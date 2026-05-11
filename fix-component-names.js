import fs from 'fs';
import { glob } from 'glob';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix component names in export statements
    if (content.includes('export default Page;')) {
      // Extract the actual component name from the file
      const lines = content.split('\n');
      let componentName = 'Page';
      
      for (const line of lines) {
        if (line.includes('function ') && !line.includes('export default')) {
          const match = line.match(/function\s+(\w+)\s*\(/);
          if (match) {
            componentName = match[1];
            break;
          }
        }
      }
      
      content = content.replace('export default Page;', `export default ${componentName};`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  // Find all TypeScript/TSX files in the app directory
  const files = await glob('app/**/*.{ts,tsx}');

  let fixedCount = 0;
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });

  console.log(`Fixed ${fixedCount} files`);
}

main().catch(console.error);