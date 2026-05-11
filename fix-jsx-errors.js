import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files in the app directory
const files = await glob('app/**/*.{ts,tsx}', { cwd: '/workspace' });

console.log(`Found ${files.length} files to check`);

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join('/workspace', file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix malformed JSX in export default function Wrapped
    const wrappedPattern = /export default function Wrapped\s*\(\s*props\s*\)\s*{\s*return\s*\(\s*<ErrorBoundary>\s*<\s*\{\.\.\.props\}\s*\/>\s*<\/ErrorBoundary>\s*\);\s*}/g;
    
    if (wrappedPattern.test(content)) {
      // Extract the main component name from the file
      const componentMatch = content.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      
      const fixedWrapped = `export default function Wrapped(props) {
  return (
    <ErrorBoundary>
      <${componentName} {...props} />
    </ErrorBoundary>
  );
}`;
      
      content = content.replace(wrappedPattern, fixedWrapped);
      modified = true;
    }
    
    // Fix malformed onClick handlers
    const onClickPattern = /onClick=\{\(\)\s*=\s*aria-label=\\"[^"]*\\"\s*>\s*([^}]+)\}/g;
    content = content.replace(onClickPattern, (match, handler) => {
      const cleanHandler = handler.trim();
      return `onClick={() => ${cleanHandler}}`;
    });
    
    // Fix any remaining malformed JSX attributes
    const malformedAttrPattern = /(\w+)=\{[^}]*aria-label=\\"[^"]*\\"[^}]*\}/g;
    content = content.replace(malformedAttrPattern, (match, attrName) => {
      // Extract the actual handler and aria-label separately
      const handlerMatch = match.match(/\(\)\s*=>\s*([^}]+)/);
      const ariaMatch = match.match(/aria-label=\\"([^"]*)\\"/);
      
      if (handlerMatch && ariaMatch) {
        return `${attrName}={() => ${handlerMatch[1].trim()}}\n                aria-label="${ariaMatch[1]}"`;
      }
      return match;
    });
    
    // Fix any broken JSX structure with incomplete tags
    const brokenJSXPattern = /<\s*\{\.\.\.props\}\s*\/>/g;
    if (brokenJSXPattern.test(content)) {
      // Try to find the component name in the file
      const componentMatch = content.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      content = content.replace(brokenJSXPattern, `<${componentName} {...props} />`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${file}`);
      fixedCount++;
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`Fixed ${fixedCount} files`);