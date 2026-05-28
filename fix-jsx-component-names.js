import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to fix JSX component names in a page file
function fixPageFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file doesn't need fixing
    if (!content.match(/<[a-z][a-zA-Z0-9]*Page/) && !content.match(/function\s+[a-z][a-zA-Z0-9]*Page\(\)/)) {
      return false;
    }
    
    let fixedContent = content;
    
    // Find the function name and fix it
    const functionMatch = fixedContent.match(/function\s+([a-z][a-zA-Z0-9]*Page)\(\)/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      const capitalizedFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
      
      // Replace the function declaration
      fixedContent = fixedContent.replace(
        new RegExp(`function\\s+${functionName}\\(\\)`, 'g'),
        `function ${capitalizedFunctionName}()`
      );
      
      // Replace the JSX usage
      fixedContent = fixedContent.replace(
        new RegExp(`<${functionName}\\s+{\\.\\.\\.props}\\s*\\/>`, 'g'),
        `<${capitalizedFunctionName} {...props} />`
      );
    }
    
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  // Find all page.tsx files in the app directory
  const pageFiles = await glob('app/**/page.tsx');

  console.log(`Found ${pageFiles.length} page files to check...`);

  let fixedCount = 0;
  let skippedCount = 0;

  pageFiles.forEach(filePath => {
    if (fixPageFile(filePath)) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  });

  console.log(`\nSummary:`);
  console.log(`- Fixed: ${fixedCount} files`);
  console.log(`- Skipped: ${skippedCount} files`);
  console.log(`- Total: ${pageFiles.length} files`);
}

main().catch(console.error);