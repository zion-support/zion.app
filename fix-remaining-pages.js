import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Pattern to match files with syntax errors
const errorPattern = /export default function Wrapped\s*\(\s*props\s*\)\s*\{\s*return\s*\(\s*<ErrorBoundary>\s*<\s*\{\.\.\.props\}\s*\/>\s*<\/ErrorBoundary>\s*\);\s*\}/;

// Pattern to match malformed onClick handlers
const onClickPattern = /onClick=\{\(\)\s*=\s*aria-label="Button">\s*([^}]+)\}/g;

// Pattern to match malformed export statements
const exportPattern = /export default function Wrapped\s*\(\s*props\s*\)\s*\{\s*return\s*\(\s*<ErrorBoundary>\s*<\s*\{\.\.\.props\}\s*\/>\s*<\/ErrorBoundary>\s*\);\s*\}/g;

// Pattern to match duplicate metadata exports
const duplicateMetadataPattern = /export const metadata = \{[^}]+\};\s*;\s*'use client';\s*import[^}]+export const metadata = \{[^}]+\};\s*;\s*import[^}]+export const metadata = \{[^}]+\};\s*;/g;

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix malformed onClick handlers
    if (onClickPattern.test(content)) {
      content = content.replace(onClickPattern, (match, handler) => {
        modified = true;
        return `onClick={() => ${handler.trim()}}`;
      });
    }

    // Fix malformed export statements
    if (exportPattern.test(content)) {
      content = content.replace(exportPattern, (match) => {
        modified = true;
        return `export default function Wrapped(props: any) {
  return (
    <ErrorBoundary>
      <Page {...props} />
    </ErrorBoundary>
  );
}`;
      });
    }

    // Fix duplicate metadata and imports
    if (duplicateMetadataPattern.test(content)) {
      // Extract the actual page content and create a clean version
      const lines = content.split('\n');
      const cleanLines = [];
      let inMetadata = false;
      let metadataCount = 0;
      let imports = new Set();
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('export const metadata')) {
          if (metadataCount === 0) {
            cleanLines.push(line);
            inMetadata = true;
            metadataCount++;
          } else {
            // Skip duplicate metadata
            while (i < lines.length && !lines[i].includes('};')) {
              i++;
            }
            inMetadata = false;
          }
        } else if (inMetadata && line.includes('};')) {
          cleanLines.push(line);
          inMetadata = false;
        } else if (line.startsWith('import ') && !inMetadata) {
          const importLine = line.replace(/;\s*$/, '');
          if (!imports.has(importLine)) {
            cleanLines.push(importLine + ';');
            imports.add(importLine);
          }
        } else if (!inMetadata && !line.includes('export const metadata') && !line.includes(';')) {
          cleanLines.push(line);
        }
      }
      
      content = cleanLines.join('\n');
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