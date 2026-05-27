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

  // Check if file contains ErrorBoundary references
  if (content.includes('ErrorBoundary')) {
    // Remove ErrorBoundary wrapper pattern
    const errorBoundaryPattern = /export default function Wrapped\(props: \{ \[key: string\]: unknown \}\) \{\s*return \(\s*<ErrorBoundary>\s*<[^>]+ \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/g;
    
    if (errorBoundaryPattern.test(content)) {
      // Extract the component name from the ErrorBoundary wrapper
      const match = content.match(/<([A-Za-z][A-Za-z0-9]*[A-Za-z0-9]*) \{\.\.\.props\} \/>/);
      if (match) {
        const componentName = match[1];
        content = content.replace(errorBoundaryPattern, `export default ${componentName};`);
        modified = true;
      }
    }

    // Also remove any standalone ErrorBoundary references
    content = content.replace(/<ErrorBoundary>\s*<[^>]+ \{\.\.\.props\} \/>\s*<\/ErrorBoundary>/g, '');
    content = content.replace(/export default function Wrapped\(props: \{ \[key: string\]: unknown \}\) \{\s*return \(\s*<ErrorBoundary>\s*<[^>]+ \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/g, '');

    if (modified) {
      fs.writeFileSync(fullPath, content);
      fixedCount++;
      console.log(`Fixed: ${filePath}`);
    }
  }
});

console.log(`Fixed ${fixedCount} files with ErrorBoundary issues`);