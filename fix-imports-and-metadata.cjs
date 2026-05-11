const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'app/5g-edge-computing/page.tsx',
  'app/5g-implementation/page.tsx', 
  'app/5g-iot-solutions/page.tsx',
  'app/accessibility-page/page.tsx',
  'app/about/page.tsx',
  'app/offline/page.tsx',
  'app/page.tsx',
  'app/micro-saas-services/ai-analytics-dashboard/page.tsx',
  'app/micro-saas-services/ai-chatbot-builder/page.tsx',
  'app/micro-saas-services/ai-content-generator/page.tsx',
  'app/micro-saas-services/ai-email-assistant/page.tsx',
  'app/micro-saas-services/ai-lead-generation/page.tsx',
  'app/micro-saas-services/page.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix ErrorBoundary import
    content = content.replace(/import { ErrorBoundary } from '@\/components\/ErrorBoundary'/, "import ErrorBoundary from '../components/ErrorBoundary'");
    content = content.replace(/import ErrorBoundary from '@\/components\/ErrorBoundary'/, "import ErrorBoundary from '../components/ErrorBoundary'");
    
    // Remove duplicate metadata declarations
    const metadataRegex = /export const metadata = \{[\s\S]*?\};/g;
    const matches = content.match(metadataRegex);
    if (matches && matches.length > 1) {
      // Keep only the first metadata declaration
      content = content.replace(metadataRegex, (match, index) => {
        return index === 0 ? match : '';
      });
    }
    
    // Remove unused variables
    content = content.replace(/const Page = .*?;/g, '');
    content = content.replace(/const pagePage = .*?;/g, '');
    
    // Fix component names in Wrapped functions
    const componentName = path.basename(path.dirname(filePath)).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/\s/g, '') + 'Page';
    content = content.replace(/<[A-Za-z]+Page \{\.\.\.props\} \/>/g, `<Page {...props} />`);
    
    // Add proper type annotation for props
    content = content.replace(/function Wrapped\(props\)/g, 'function Wrapped(props: any)');
    
    // Clean up extra semicolons and empty lines
    content = content.replace(/;;/g, ';');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixFile);
console.log('All files fixed!');