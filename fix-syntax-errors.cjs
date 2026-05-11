const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'app/components/EnhancedAccessibilityManager.tsx',
  'app/components/PerformanceMonitoring.tsx',
  'app/components/SEOOptimization.tsx',
  'app/components/SecurityEnhancement.tsx'
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Fix function parameter syntax issues
  content = content.replace(/memo_\(/g, 'memo(');
  content = content.replace(/useCallback_\(/g, 'useCallback(');
  content = content.replace(/useEffect_\(/g, 'useEffect(');
  
  // Fix arrow function syntax issues
  content = content.replace(/\(_\([^)]*\)\s*=>/g, (match) => {
    return match.replace(/\(_\(/g, '(').replace(/\)\s*=>/g, ') =>');
  });
  
  // Fix forEach syntax issues
  content = content.replace(/\.forEach\(_\(/g, '.forEach(');
  content = content.replace(/\.map\(_\(/g, '.map(');
  
  // Fix variable declarations
  content = content.replace(/const _([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 'const $1');
  content = content.replace(/let _([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 'let $1');
  content = content.replace(/var _([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 'var $1');
  
  // Fix function calls
  content = content.replace(/\(_\(/g, '(');
  
  // Fix missing semicolons after function declarations
  content = content.replace(/}\s*\)\s*=>\s*{/g, '}) => {');
  
  // Fix return statement issues
  content = content.replace(/}\s*;\s*return\s*\(/g, '};\n\n  return (');
  
  if (content !== fs.readFileSync(fullPath, 'utf8')) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
    modified = true;
  }

  if (!modified) {
    console.log(`No changes needed: ${filePath}`);
  }
}

// Fix all files
filesToFix.forEach(fixFile);

console.log('Syntax error fixes completed!');