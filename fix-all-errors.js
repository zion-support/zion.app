import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files in the app directory
const files = await glob('app/**/*.{ts,tsx}', { cwd: '/workspace' });

console.log(`Found ${files.length} files to check`);

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join('/workspace', file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import path for ErrorBoundary
    if (content.includes("import { ErrorBoundary } from '@/components/ErrorBoundary'")) {
      content = content.replace(
        "import { ErrorBoundary } from '@/components/ErrorBoundary'",
        "import ErrorBoundary from '@/components/ErrorBoundary'"
      );
      modified = true;
    }
    
    // Remove duplicate metadata exports
    const metadataPattern = /export const metadata = \{[^}]*\};/g;
    const metadataMatches = content.match(metadataPattern);
    
    if (metadataMatches && metadataMatches.length > 1) {
      // Keep only the first metadata export
      const firstMetadata = metadataMatches[0];
      content = content.replace(metadataPattern, '');
      content = firstMetadata + '\n' + content;
      modified = true;
    }
    
    // Fix malformed JSX with pagePage
    if (content.includes('<pagePage')) {
      // Extract the component name from the function declaration
      const componentMatch = content.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      
      content = content.replace(/<pagePage/g, `<${componentName}`);
      modified = true;
    }
    
    // Fix unused variable declarations
    if (content.includes('const pagePage')) {
      const componentMatch = content.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      
      content = content.replace(/const pagePage = /g, `const ${componentName} = `);
      content = content.replace(/<pagePage/g, `<${componentName}`);
      modified = true;
    }
    
    // Fix props type annotation
    if (content.includes('export default function Wrapped(props)')) {
      content = content.replace(
        'export default function Wrapped(props)',
        'export default function Wrapped(props: any)'
      );
      modified = true;
    }
    
    // Clean up any remaining syntax issues
    content = content.replace(/;\s*;/g, ';'); // Remove double semicolons
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive newlines
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${file}`);
      fixedCount++;
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`Fixed ${fixedCount} files`);