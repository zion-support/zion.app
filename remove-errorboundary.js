import fs from 'fs';
import { glob } from 'glob';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove ErrorBoundary import and wrapper
    if (content.includes('import ErrorBoundary from')) {
      content = content.replace(/import ErrorBoundary from ['"][^'"]+['"];\s*\n/g, '');
      modified = true;
    }

    // Remove ErrorBoundary wrapper from export
    if (content.includes('export default function Wrapped(props: any) {')) {
      content = content.replace(
        /export default function Wrapped\(props: any\) \{\s*return \(\s*<ErrorBoundary>\s*<[^>]+ \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/g,
        'export default Page;'
      );
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