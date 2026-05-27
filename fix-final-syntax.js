import fs from 'fs';
import { glob } from 'glob';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix missing semicolons after return statements
    if (content.includes('  )\n}') && !content.includes('  );\n}')) {
      content = content.replace(/ {2}\)\n}/g, '  );\n}');
      modified = true;
    }

    // Fix missing closing braces for export functions
    if (content.includes('export default function Wrapped') && !content.includes('  );')) {
      content = content.replace(
        /export default function Wrapped\(props: any\) \{\s*return \(\s*<ErrorBoundary>\s*<Page \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\)\s*\}/g,
        `export default function Wrapped(props: any) {
  return (
    <ErrorBoundary>
      <Page {...props} />
    </ErrorBoundary>
  );
}`
      );
      modified = true;
    }

    // Fix specific syntax errors in micro-saas pages
    if (filePath.includes('micro-saas-services')) {
      // Remove any malformed syntax and fix the structure
      const lines = content.split('\n');
      const cleanLines = [];
      let inExport = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('export default function Wrapped')) {
          cleanLines.push('export default function Wrapped(props: any) {');
          cleanLines.push('  return (');
          cleanLines.push('    <ErrorBoundary>');
          cleanLines.push('      <Page {...props} />');
          cleanLines.push('    </ErrorBoundary>');
          cleanLines.push('  );');
          cleanLines.push('}');
          inExport = true;
          break;
        } else if (!inExport) {
          cleanLines.push(line);
        }
      }
      
      if (inExport) {
        content = cleanLines.join('\n');
        modified = true;
      }
    }

    // Fix missing commas in object literals
    if (content.includes('  },\n  }')) {
      content = content.replace(/ {2}\},\n {2}\}/g, '  }\n}');
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