const fs = require('fs');
const path = require('path');

function fixJSXStructure(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has JSX structure issues
  if (!content.includes('<main') && !content.includes('</main>')) {
    return; // No main tag issues
  }
  
  console.log(`Fixing JSX structure in ${filePath}`);
  
  // Fix unclosed main tags by adding proper closing
  if (content.includes('<main') && !content.includes('</main>')) {
    // Find the last opening tag and add proper closing
    content = content.replace(/<main[^>]*>([\s\S]*?)(?=<div|<section|<h1|<h2|<h3|<p|<span)/g, (match, innerContent) => {
      // Count opening and closing divs to find where to close main
      const divCount = (innerContent.match(/<div/g) || []).length;
      const closingDivCount = (innerContent.match(/<\/div>/g) || []).length;
      
      if (divCount > closingDivCount) {
        // Add missing closing divs and close main
        const missingDivs = divCount - closingDivCount;
        let fixedContent = innerContent;
        for (let i = 0; i < missingDivs; i++) {
          fixedContent += '</div>';
        }
        return match.replace(innerContent, fixedContent) + '</main>';
      } else {
        return match + '</main>';
      }
    });
  }
  
  // Fix any remaining unclosed tags
  content = content.replace(/<main[^>]*>([\s\S]*?)(?=\n\s*function|\n\s*export|\n\s*$)/g, (match, innerContent) => {
    if (!innerContent.includes('</main>')) {
      return match + '</main>';
    }
    return match;
  });
  
  // Clean up any malformed JSX
  content = content.replace(/\n\s*\)\s*;\s*$/g, '\n  );\n}');
  content = content.replace(/\n\s*\)\s*;\s*export/g, '\n  );\n}\n\nexport');
  
  // Fix function structure
  if (content.includes('function Page()') && !content.includes('export default Page')) {
    content += '\nexport default Page;';
  }
  
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
    fixJSXStructure(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log(`Fixed JSX structure in ${fixedCount} files`);
