import fs from 'fs';
import { glob } from 'glob';

// Pattern to match duplicate metadata declarations
const duplicateMetadataPattern = /export const metadata = \{[^}]+\};\s*;\s*'use client';\s*import[^}]+export const metadata = \{[^}]+\};\s*;\s*import[^}]+export const metadata = \{[^}]+\};\s*;/g;

// Pattern to match multiple metadata declarations
const multipleMetadataPattern = /export const metadata = \{[^}]+\};\s*;\s*export const metadata = \{[^}]+\};\s*;\s*export const metadata = \{[^}]+\};\s*;/g;

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix duplicate metadata declarations
    if (content.includes('export const metadata') && content.split('export const metadata').length > 2) {
      const lines = content.split('\n');
      const cleanLines = [];
      let metadataCount = 0;
      let inMetadata = false;
      let imports = new Set();
      let hasUseClient = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes("'use client'")) {
          if (!hasUseClient) {
            cleanLines.push(line);
            hasUseClient = true;
          }
        } else if (line.startsWith('import ') && !inMetadata) {
          const importLine = line.replace(/;\s*$/, '');
          if (!imports.has(importLine)) {
            cleanLines.push(importLine + ';');
            imports.add(importLine);
          }
        } else if (line.includes('export const metadata')) {
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
        } else if (!inMetadata && !line.includes('export const metadata') && !line.includes(';')) {
          cleanLines.push(line);
        }
      }
      
      content = cleanLines.join('\n');
      modified = true;
    }

    // Fix missing Page component reference
    if (content.includes('export default function Wrapped') && content.includes('<Page {...props} />') && !content.includes('function Page()')) {
      // Extract the main component name from the file path
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const componentName = fileName.replace('.tsx', '').replace('.ts', '');
      const capitalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
      
      // Find the main content and wrap it in a Page function
      const lines = content.split('\n');
      const newLines = [];
      let inMainContent = false;
      let braceCount = 0;
      let mainContentStart = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('function ') && !line.includes('export default function Wrapped')) {
          // This is the main component function
          newLines.push(`function ${capitalizedName}() {`);
          inMainContent = true;
          mainContentStart = i;
          braceCount = 1;
        } else if (inMainContent) {
          if (line.includes('{')) braceCount++;
          if (line.includes('}')) braceCount--;
          
          if (braceCount === 0) {
            newLines.push(line);
            inMainContent = false;
          } else {
            newLines.push(line);
          }
        } else if (!line.includes('export default function Wrapped')) {
          newLines.push(line);
        }
      }
      
      // Add the export wrapper
      newLines.push('');
      newLines.push(`export default function Wrapped(props: any) {`);
      newLines.push(`  return (`);
      newLines.push(`    <ErrorBoundary>`);
      newLines.push(`      <${capitalizedName} {...props} />`);
      newLines.push(`    </ErrorBoundary>`);
      newLines.push(`  );`);
      newLines.push(`}`);
      
      content = newLines.join('\n');
      modified = true;
    }

    // Fix unused variable declarations
    if (content.includes('pagePage')) {
      content = content.replace(/pagePage/g, 'Page');
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