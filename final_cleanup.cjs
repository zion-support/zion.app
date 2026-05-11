const fs = require('fs');
const path = require('path');

function finalCleanup(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove malformed wrapper functions
  content = content.replace(/export default function Wrapped\(props: any\) \{\s*return \(\s*<ErrorBoundary>\s*<Page \{\.\.\.props\} \/>\s*<\/ErrorBoundary>\s*\);\s*\}/g, 'export default Page;');
  
  // Fix any remaining malformed exports
  content = content.replace(/export default function Wrapped[\s\S]*?}/g, 'export default Page;');
  
  // Fix unclosed JSX tags by adding proper closing
  if (content.includes('<div') && !content.includes('</div>')) {
    // Count opening and closing divs
    const divCount = (content.match(/<div/g) || []).length;
    const closingDivCount = (content.match(/<\/div>/g) || []).length;
    
    if (divCount > closingDivCount) {
      const missingDivs = divCount - closingDivCount;
      for (let i = 0; i < missingDivs; i++) {
        content += '</div>';
      }
    }
  }
  
  // Fix function structure issues
  content = content.replace(/\n\s*\)\s*;\s*$/g, '\n  );\n}');
  content = content.replace(/\n\s*\)\s*;\s*export/g, '\n  );\n}\n\nexport');
  
  // Ensure proper function ending
  if (content.includes('function Page()') && !content.includes('export default Page')) {
    content += '\nexport default Page;';
  }
  
  // Clean up empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
}

// Find all page.tsx files
const findPageFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (item === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
};

const pageFiles = findPageFiles('./app');
let fixedCount = 0;

pageFiles.forEach(file => {
  try {
    finalCleanup(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log(`Final cleanup completed on ${fixedCount} files`);
