#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing duplicate metadata declarations...');

// Function to fix duplicate metadata in a file
function fixDuplicateMetadata(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file has duplicate metadata declarations
  const metadataRegex = /export\s+const\s+metadata\s*=\s*\{[^}]*\};/g;
  const matches = content.match(metadataRegex);
  
  if (matches && matches.length > 1) {
    console.log(`Found ${matches.length} metadata declarations in ${filePath}`);
    
    // Keep only the first metadata declaration
    let firstMatch = true;
    content = content.replace(metadataRegex, (match) => {
      if (firstMatch) {
        firstMatch = false;
        return match;
      } else {
        modified = true;
        return ''; // Remove duplicate
      }
    });
    
    // Clean up any extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  }

  // Fix specific files with known duplicate metadata issues
  if (filePath.includes('ai-powered-devops/page.tsx') ||
      filePath.includes('ai-powered-email-analyzer/page.tsx') ||
      filePath.includes('ecommerce-analytics-pro/page.tsx') ||
      filePath.includes('it-services/cybersecurity-audit/page.tsx') ||
      filePath.includes('legal-document-manager/page.tsx') ||
      filePath.includes('medical-records-manager/page.tsx') ||
      filePath.includes('online-learning-platform/page.tsx') ||
      filePath.includes('property-management-ai/page.tsx') ||
      filePath.includes('supply-chain-optimizer/page.tsx') ||
      filePath.includes('test/page.tsx') ||
      filePath.includes('zion-ai-api-tester/page.tsx') ||
      filePath.includes('zion-ai-database-optimizer/page.tsx')) {
    
    // Create a clean metadata declaration
    const cleanMetadata = `export const metadata = {
  title: '${path.basename(filePath, '.tsx').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Zion Tech Group',
  description: 'AI-powered business solutions and services.',
  keywords: 'AI, artificial intelligence, business solutions, automation',
  authors: [{ name: 'Zion Tech Group' }],
  openGraph: {
    title: '${path.basename(filePath, '.tsx').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Zion Tech Group',
    description: 'AI-powered business solutions and services.',
    type: 'website',
  },
};`;

    // Replace all metadata declarations with a single clean one
    content = content.replace(/export\s+const\s+metadata\s*=\s*\{[^}]*\};/g, '');
    content = cleanMetadata + '\n\n' + content;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Main function
async function main() {
  console.log('Starting duplicate metadata fixes...');

  // Get all files that might have duplicate metadata
  const filesToCheck = [
    'app/ai-powered-devops/page.tsx',
    'app/ai-powered-email-analyzer/page.tsx',
    'app/ecommerce-analytics-pro/page.tsx',
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

  let fixedCount = 0;

  // Process each file
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      if (fixDuplicateMetadata(file)) {
        fixedCount++;
        console.log(`Fixed: ${file}`);
      }
    }
  }

  console.log(`Fixed ${fixedCount} files.`);
  console.log('Duplicate metadata declarations should now be resolved!');
}

main().catch(console.error);