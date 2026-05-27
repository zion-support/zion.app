import fs from 'fs';
import { glob } from 'glob';

// Function to fix specific files with known issues
function fixSpecificFiles() {
  const filesToFix = [
    'app/5g-data-analytics/page.tsx',
    'app/5g-edge-computing/page.tsx',
    'app/5g-implementation/page.tsx',
    'app/5g-iot-solutions/page.tsx',
    'app/accessibility-page/page.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused imports
      content = content.replace("import React from 'react'\n", '');
      content = content.replace("import Link from 'next/link'\n", '');
      content = content.replace("import { ArrowRight } from 'lucide-react'\n", '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix files with multiple unused icon imports
function fixIconImportFiles() {
  const filesToFix = [
    'app/ai-powered-devops/page.tsx',
    'app/ai-powered-email-analyzer/page.tsx',
    'app/ecommerce-analytics-pro/page.tsx',
    'app/error.tsx',
    'app/global-error.tsx',
    'app/loading.tsx',
    'app/it-services/cybersecurity-audit/page.tsx',
    'app/legal-document-manager/page.tsx',
    'app/medical-records-manager/page.tsx',
    'app/online-learning-platform/page.tsx',
    'app/property-management-ai/page.tsx',
    'app/supply-chain-optimizer/page.tsx',
    'app/test/page.tsx',
    'app/page-new.tsx',
    'app/page-optimized.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove the entire unused icon import line
      const iconImportRegex = /import \{ Star, Clock, Zap, Shield, Globe, Database, Users, Settings, Check \} from 'lucide-react';\n/g;
      content = content.replace(iconImportRegex, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed icons in: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Function to fix component files with unused imports
function fixComponentFiles() {
  const filesToFix = [
    'app/components/Footer.tsx',
    'app/components/Navigation.tsx'
  ];

  filesToFix.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused imports
      content = content.replace(/, ArrowRight/g, '');
      content = content.replace(/, Cloud/g, '');
      content = content.replace(/, Search/g, '');
      content = content.replace(/, ArrowLeft/g, '');
      content = content.replace(/, RefreshCw/g, '');
      
      // Clean up extra empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed component: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

// Main function
async function main() {
  console.log('Fixing specific files...');
  fixSpecificFiles();
  
  console.log('Fixing icon import files...');
  fixIconImportFiles();
  
  console.log('Fixing component files...');
  fixComponentFiles();
  
  console.log('Done!');
}

main().catch(console.error);