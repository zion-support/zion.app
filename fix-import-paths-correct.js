#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to fix import paths based on directory depth
function fixImportPath(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calculate the relative path to components directory
    const fileDir = path.dirname(filePath);
    const componentsDir = path.join(process.cwd(), 'app', 'components');
    const relativePath = path.relative(fileDir, componentsDir);
    const importPath = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes
    
    // Fix the import statement
    content = content.replace(
      /import ErrorBoundary from '[^']*';/,
      `import ErrorBoundary from '${importPath}/ErrorBoundary';`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed import path in: ${filePath} -> ${importPath}/ErrorBoundary`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to fix all page files
function fixAllImportPaths() {
  const pageFiles = [
    'app/page.tsx',
    'app/offline/page.tsx',
    'app/5g-data-analytics/page.tsx',
    'app/5g-edge-computing/page.tsx',
    'app/5g-implementation/page.tsx',
    'app/5g-iot-solutions/page.tsx',
    'app/about/page.tsx',
    'app/accessibility-page/page.tsx',
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
    'app/zion-ai-database-optimizer/page.tsx',
    'app/micro-saas-services/page.tsx',
    'app/micro-saas-services/ai-analytics-dashboard/page.tsx',
    'app/micro-saas-services/ai-chatbot-builder/page.tsx',
    'app/micro-saas-services/ai-content-generator/page.tsx',
    'app/micro-saas-services/ai-email-assistant/page.tsx',
    'app/micro-saas-services/ai-lead-generation/page.tsx'
  ];

  pageFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      fixImportPath(fullPath);
    }
  });
}

// Main execution
console.log('Starting correct import path fixes...');
fixAllImportPaths();
console.log('Correct import path fixes completed!');