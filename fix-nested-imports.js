import fs from 'fs';
import { glob } from 'glob';

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix imports for nested directories (2 levels deep)
    if (filePath.includes('micro-saas-services/') || filePath.includes('it-services/')) {
      if (content.includes("import { ErrorBoundary } from '../components/ErrorBoundary'")) {
        content = content.replace(
          "import { ErrorBoundary } from '../components/ErrorBoundary';",
          "import { ErrorBoundary } from '../../components/ErrorBoundary';"
        );
        modified = true;
      }
      
      if (content.includes("import Footer from '../components/Footer'")) {
        content = content.replace(
          "import Footer from '../components/Footer';",
          "import Footer from '../../components/Footer';"
        );
        modified = true;
      }
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