const fs = require('fs');
const path = require('path');

// Fix remaining import paths and add proper typing
const filesToFix = [
  'app/about/page.tsx',
  'app/accessibility-page/page.tsx',
  'app/legal-document-manager/page.tsx',
  'app/medical-records-manager/page.tsx',
  'app/micro-saas-services/page.tsx',
  'app/offline/page.tsx',
  'app/online-learning-platform/page.tsx',
  'app/property-management-ai/page.tsx',
  'app/supply-chain-optimizer/page.tsx',
  'app/test/page.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix import paths based on file location
    if (filePath.includes('micro-saas-services/')) {
      content = content.replace(
        /import ErrorBoundary from '\.\.\/components\/ErrorBoundary'/g,
        "import ErrorBoundary from '../../components/ErrorBoundary'"
      );
    } else if (filePath.includes('it-services/')) {
      content = content.replace(
        /import ErrorBoundary from '\.\/components\/ErrorBoundary'/g,
        "import ErrorBoundary from '../../components/ErrorBoundary'"
      );
    } else {
      content = content.replace(
        /import ErrorBoundary from '\.\/components\/ErrorBoundary'/g,
        "import ErrorBoundary from '../components/ErrorBoundary'"
      );
    }
    
    // Add proper typing for props parameter
    content = content.replace(
      /export default function Wrapped\(props\)/g,
      'export default function Wrapped(props: any)'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixFile);

console.log('All remaining files fixed!');