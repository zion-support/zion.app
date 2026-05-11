import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all 5G pages
const files = await glob('app/5g-*/page.tsx', { cwd: process.cwd() });

let fixedCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file uses Navigation or Footer but doesn't import them
  const usesNavigation = content.includes('<Navigation') || content.includes('<Navigation />');
  const usesFooter = content.includes('<Footer') || content.includes('<Footer />');
  const hasNavigationImport = content.includes('import Navigation');
  const hasFooterImport = content.includes('import Footer');

  if ((usesNavigation || usesFooter) && (!hasNavigationImport || !hasFooterImport)) {
    // Find the line with the first import
    const lines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      } else if (lines[i].startsWith('function ') || lines[i].startsWith('const ')) {
        break;
      }
    }

    // Build import statements
    let imports = [];
    if (usesNavigation && !hasNavigationImport) {
      imports.push("import Navigation from '../components/Navigation';");
    }
    if (usesFooter && !hasFooterImport) {
      imports.push("import Footer from '../components/Footer';");
    }

    if (imports.length > 0) {
      // Insert imports
      lines.splice(insertIndex, 0, ...imports);
      content = lines.join('\n');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Fixed imports in: ${filePath}`);
  }
});

console.log(`Fixed ${fixedCount} 5G pages with missing imports`);