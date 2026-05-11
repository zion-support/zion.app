#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of files to fix with their correct component names
const filesToFix = [
  {
    file: 'app/legal-document-manager/page.tsx',
    componentName: 'LegalDocumentManagerPage',
    exportName: 'LegalDocumentManagerPage'
  },
  {
    file: 'app/medical-records-manager/page.tsx',
    componentName: 'MedicalRecordsManagerPage',
    exportName: 'MedicalRecordsManagerPage'
  },
  {
    file: 'app/online-learning-platform/page.tsx',
    componentName: 'OnlineLearningPlatformPage',
    exportName: 'OnlineLearningPlatformPage'
  },
  {
    file: 'app/property-management-ai/page.tsx',
    componentName: 'PropertyManagementAIPage',
    exportName: 'PropertyManagementAIPage'
  },
  {
    file: 'app/supply-chain-optimizer/page.tsx',
    componentName: 'SupplyChainOptimizerPage',
    exportName: 'SupplyChainOptimizerPage'
  },
  {
    file: 'app/test/page.tsx',
    componentName: 'TestPage',
    exportName: 'TestPage'
  },
  {
    file: 'app/page-optimized.tsx',
    componentName: 'PageOptimized',
    exportName: 'PageOptimized'
  }
];

function fixPageComponent(filePath, componentName, exportName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace PagePage with the correct component name
    content = content.replace(/const PagePage: React\.FC = \(\) => \{/g, `const ${componentName}: React.FC = () => {`);
    
    // Replace export default PagePage with the correct export
    content = content.replace(/export default PagePage;/g, `export default ${exportName};`);
    
    // Remove unused imports
    content = content.replace(/import Navigation from '\.\.\/\.\.\/components\/Navigation'\n/g, '');
    content = content.replace(/import Footer from '\.\.\/\.\.\/components\/Footer'\n/g, '');
    content = content.replace(/import Navigation from '\.\/components\/Navigation'\n/g, '');
    content = content.replace(/import Footer from '\.\/components\/Footer'\n/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Fix all page components
console.log('Fixing page components...');
let fixedCount = 0;

for (const fileInfo of filesToFix) {
  if (fixPageComponent(fileInfo.file, fileInfo.componentName, fileInfo.exportName)) {
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} page components`);