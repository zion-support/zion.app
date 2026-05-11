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

  // Check if file imports ErrorBoundary but doesn't use it
  const hasErrorBoundaryImport = content.includes('import ErrorBoundary');
  const usesErrorBoundary = content.includes('<ErrorBoundary') || content.includes('ErrorBoundary(');

  if (hasErrorBoundaryImport && !usesErrorBoundary) {
    // Remove the ErrorBoundary import line
    content = content.replace(/import ErrorBoundary[^;]+;\n?/g, '');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    fixedCount++;
    console.log(`Removed unused ErrorBoundary import from: ${filePath}`);
  }
});

console.log(`Fixed ${fixedCount} files with unused ErrorBoundary imports`);