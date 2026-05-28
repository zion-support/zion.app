import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixMissingTargetImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if the file uses Target but doesn't import it
    if (content.includes('icon: Target') && !content.includes('import { Target }')) {
      // Find the lucide-react import line
      const lucideImportMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/);
      
      if (lucideImportMatch) {
        // Add Target to the existing import
        const existingImports = lucideImportMatch[1].trim();
        const newImports = existingImports + ', Target';
        const newImportLine = `import { ${newImports} } from 'lucide-react';`;
        content = content.replace(lucideImportMatch[0], newImportLine);
        modified = true;
      } else {
        // Add a new import line after the 'use client' directive
        const useClientMatch = content.match(/('use client';?\s*\n)/);
        if (useClientMatch) {
          content = content.replace(useClientMatch[0], useClientMatch[0] + "import { Target } from 'lucide-react';\n");
          modified = true;
        } else {
          // Add at the beginning
          content = "import { Target } from 'lucide-react';\n" + content;
          modified = true;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added Target import: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixMissingTargetImport(filePath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

console.log('Starting missing Target import fixes...');
const appDir = path.join(__dirname, 'app');
const totalFixed = processDirectory(appDir);
console.log(`Added Target import to ${totalFixed} files`);
console.log('Missing Target import fixes completed!');