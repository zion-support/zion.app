const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all files with merge conflicts
const files = glob.sync('app/**/*.tsx', { cwd: __dirname });

console.log(`Found ${files.length} files to check for merge conflicts`);

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>>')) {
    console.log(`Fixing merge conflicts in: ${file}`);
    
    // More aggressive merge conflict resolution
    let fixedContent = content;
    
    // Remove all merge conflict markers and take the newer version (after =======)
    fixedContent = fixedContent.replace(/<<<<<<< HEAD[\s\S]*?=======\s*([\s\S]*?)(?=>>>>>>>|$)/g, '$1');
    fixedContent = fixedContent.replace(/>>>>>>> [^\n]*\n?/g, '');
    
    // Clean up any remaining conflict markers
    fixedContent = fixedContent
      .replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> [^\n]*\n?/g, '')
      .replace(/=======[\s\S]*?>>>>>>> [^\n]*\n?/g, '');
    
    // Clean up malformed code
    fixedContent = fixedContent
      .replace(/import\s+React\s+from\s+'react'\s*;\s*;\s*/g, "import React from 'react';\n")
      .replace(/import\s+React\s+from\s+'react'\s*\n\s*;\s*/g, "import React from 'react';\n")
      .replace(/;\s*import/g, ';\nimport')
      .replace(/;\s*const/g, ';\nconst')
      .replace(/;\s*function/g, ';\nfunction')
      .replace(/;\s*export/g, ';\nexport')
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive newlines
    
    // Ensure proper structure for React components
    if (fixedContent.includes('function') && fixedContent.includes('return')) {
      // Add proper imports if missing
      if (!fixedContent.includes("import React from 'react'")) {
        fixedContent = "import React from 'react';\n" + fixedContent;
      }
      if (!fixedContent.includes("import ErrorBoundary from") && file.includes('page.tsx')) {
        const importPath = '../'.repeat((file.match(/\//g) || []).length - 1) + 'components/ErrorBoundary';
        fixedContent = fixedContent.replace(
          "import React from 'react';",
          `import React from 'react';\nimport ErrorBoundary from '${importPath}';`
        );
      }
      if (!fixedContent.includes("import Navigation from") && file.includes('page.tsx')) {
        const importPath = '../'.repeat((file.match(/\//g) || []).length - 1) + 'components/Navigation';
        fixedContent = fixedContent.replace(
          "import React from 'react';",
          `import React from 'react';\nimport Navigation from '${importPath}';`
        );
      }
      if (!fixedContent.includes("import Footer from") && file.includes('page.tsx')) {
        const importPath = '../'.repeat((file.match(/\//g) || []).length - 1) + 'components/Footer';
        fixedContent = fixedContent.replace(
          "import React from 'react';",
          `import React from 'react';\nimport Footer from '${importPath}';`
        );
      }
    }
    
    fs.writeFileSync(filePath, fixedContent);
    fixedCount++;
  }
});

console.log(`Fixed merge conflicts in ${fixedCount} files`);