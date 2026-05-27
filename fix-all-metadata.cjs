const fs = require('fs');
const path = require('path');

// List of files that need metadata fixes
const filesToFix = [
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

function getPageTitle(filePath) {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 2]; // Get the directory name
  return fileName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getPageDescription(filePath) {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 2];
  return fileName.split('-').join(' ');
}

function getKeywords(filePath) {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 2];
  return fileName.split('-').join(', ');
}

function fixMetadata(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all metadata declarations
    content = content.replace(/export const metadata = \{[^}]*\};/g, '');
    
    // Clean up multiple semicolons and empty lines
    content = content.replace(/;\s*;\s*/g, ';\n');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Find the position after the last import
    const lines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith("'use client'")) {
        insertIndex = i + 1;
      }
    }
    
    // Insert proper metadata
    const metadata = `export const metadata = {
  title: '${getPageTitle(filePath)} | Zion Tech Group',
  description: 'Professional ${getPageDescription(filePath)} services by Zion Tech Group.',
  keywords: '${getKeywords(filePath)}',
  openGraph: {
    title: '${getPageTitle(filePath)} | Zion Tech Group',
    description: 'Professional ${getPageDescription(filePath)} services by Zion Tech Group.',
    type: 'website',
  },
};`;
    
    lines.splice(insertIndex, 0, '', metadata, '');
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Fixed metadata: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixMetadata);

console.log('Metadata fixing completed!');