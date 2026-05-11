const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'app/5g-data-analytics/page.tsx',
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
  'app/micro-saas-services/page.tsx',
  'app/ecommerce-analytics-pro/page.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Move 'use client' to the top
    if (content.includes("'use client'")) {
      content = content.replace(/'use client';\s*/g, '');
      content = "'use client';\n\n" + content;
    }
    
    // Remove metadata exports from client components
    if (content.includes("'use client'")) {
      content = content.replace(/export const metadata = \{[\s\S]*?\};/g, '');
    }
    
    // Clean up extra semicolons and empty lines
    content = content.replace(/;;/g, ';');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/^\s*;\s*$/gm, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixFile);
console.log('All files fixed!');