import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to fix import paths in a file
function fixImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calculate the correct relative path based on file depth
    const relativePath = path.relative(path.dirname(filePath), '/workspace/app/components');
    const errorBoundaryPath = path.join(relativePath, 'ErrorBoundary').replace(/\\/g, '/');
    const footerPath = path.join(relativePath, 'Footer').replace(/\\/g, '/');
    
    // Fix ErrorBoundary import
    content = content.replace(
      /import ErrorBoundary from '\.\.\/components\/ErrorBoundary';/g,
      `import ErrorBoundary from '${errorBoundaryPath}';`
    );
    
    // Fix Footer import
    content = content.replace(
      /import Footer from '\.\.\/components\/Footer';/g,
      `import Footer from '${footerPath}';`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  // Get all page.tsx files
  const files = await glob('app/**/page.tsx', { cwd: '/workspace' });

  console.log(`Found ${files.length} page files to fix imports`);

  let fixedCount = 0;
  files.forEach(file => {
    const fullPath = path.join('/workspace', file);
    if (fixImportPaths(fullPath)) {
      fixedCount++;
    }
  });

  console.log(`Fixed imports in ${fixedCount} out of ${files.length} files`);
}

main().catch(console.error);