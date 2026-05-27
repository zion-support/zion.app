const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
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

// Files with multiple metadata declarations
const metadataFiles = [
  'app/ai-powered-devops/page.tsx',
  'app/ai-powered-email-analyzer/page.tsx',
  'app/it-services/cybersecurity-audit/page.tsx',
  'app/legal-document-manager/page.tsx',
  'app/medical-records-manager/page.tsx',
  'app/online-learning-platform/page.tsx',
  'app/property-management-ai/page.tsx',
  'app/supply-chain-optimizer/page.tsx',
  'app/test/page.tsx',
  'app/zion-ai-api-tester/page.tsx',
  'app/zion-ai-database-optimizer/page.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix ErrorBoundary import path for micro-saas services
    if (filePath.includes('micro-saas-services')) {
      content = content.replace(/import ErrorBoundary from '\.\.\/components\/ErrorBoundary'/, "import ErrorBoundary from '../../components/ErrorBoundary'");
    }
    
    // Remove unused variable declarations
    content = content.replace(/const [A-Za-z]+Page = .*?;/g, '');
    content = content.replace(/const pagePage = .*?;/g, '');
    
    // Fix component names in Wrapped functions - use the actual component name
    const componentName = path.basename(path.dirname(filePath)).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/\s/g, '') + 'Page';
    
    // For specific files, use the correct component name
    if (filePath.includes('about')) {
      content = content.replace(/<Page \{\.\.\.props\} \/>/g, '<AboutPage {...props} />');
    } else if (filePath.includes('offline')) {
      content = content.replace(/<Page \{\.\.\.props\} \/>/g, '<OfflinePage {...props} />');
    } else if (filePath.includes('page.tsx') && !filePath.includes('micro-saas')) {
      content = content.replace(/<Page \{\.\.\.props\} \/>/g, '<HomePage {...props} />');
    } else {
      content = content.replace(/<Page \{\.\.\.props\} \/>/g, `<${componentName} {...props} />`);
    }
    
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

function fixMetadataFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove duplicate metadata declarations
    const metadataRegex = /export const metadata = \{[\s\S]*?\};/g;
    const matches = content.match(metadataRegex);
    if (matches && matches.length > 1) {
      // Keep only the first metadata declaration
      content = content.replace(metadataRegex, (match, index) => {
        return index === 0 ? match : '';
      });
    }
    
    // Clean up extra semicolons and empty lines
    content = content.replace(/;;/g, ';');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed metadata: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing metadata in ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixFile);
metadataFiles.forEach(fixMetadataFile);
console.log('All files fixed!');