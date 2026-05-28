import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to fix JSX components in a page file
function fixPageFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file doesn't need fixing
    if (!content.match(/<[a-z][a-zA-Z0-9]*Page/) && !content.match(/function\s+[a-zA-Z][a-zA-Z0-9]*Page\(\)/)) {
      return false;
    }
    
    let fixedContent = content;
    
    // Find the function name
    const functionMatch = fixedContent.match(/function\s+([a-zA-Z][a-zA-Z0-9]*Page)\(\)/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      
      // Fix JSX component usage
      fixedContent = fixedContent.replace(
        new RegExp(`<${functionName}\\s+{\\.\\.\\.props}\\s*\\/>`, 'g'),
        `<${functionName} {...props} />`
      );
      
      // Fix JSX component usage with different patterns
      fixedContent = fixedContent.replace(
        new RegExp(`<${functionName}\\s+{props}\\s*\\/>`, 'g'),
        `<${functionName} {...props} />`
      );
    }
    
    // Fix import paths for nested directories
    if (filePath.includes('/micro-saas-services/') || filePath.includes('/it-services/')) {
      fixedContent = fixedContent.replace(
        /import ErrorBoundary from ['"]\.\.\/components\/ErrorBoundary['"]/g,
        'import ErrorBoundary from "../../components/ErrorBoundary"'
      );
      fixedContent = fixedContent.replace(
        /import Navigation from ['"]\.\.\/components\/Navigation['"]/g,
        'import Navigation from "../../components/Navigation"'
      );
      fixedContent = fixedContent.replace(
        /import Footer from ['"]\.\.\/components\/Footer['"]/g,
        'import Footer from "../../components/Footer"'
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