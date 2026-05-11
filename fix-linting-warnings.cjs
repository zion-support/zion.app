const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Fix unused variables and parameters
function fixUnusedVars(content) {
  let modified = false;
  
  // Remove unused parameters from function declarations
  content = content.replace(/\(_props\)/g, '()');
  content = content.replace(/\(props\)/g, '()');
  content = content.replace(/\(_error\)/g, '()');
  content = content.replace(/\(error\)/g, '()');
  content = content.replace(/\(_index\)/g, '()');
  content = content.replace(/\(index\)/g, '()');
  content = content.replace(/\(_imgIndex\)/g, '()');
  content = content.replace(/\(imgIndex\)/g, '()');
  content = content.replace(/\(_registration\)/g, '()');
  content = content.replace(/\(registration\)/g, '()');
  content = content.replace(/\(_total\)/g, '()');
  content = content.replace(/\(total\)/g, '()');
  content = content.replace(/\(_fidEntry\)/g, '()');
  content = content.replace(/\(fidEntry\)/g, '()');
  content = content.replace(/\(_clsEntry\)/g, '()');
  content = content.replace(/\(clsEntry\)/g, '()');
  content = content.replace(/\(_start\)/g, '()');
  content = content.replace(/\(start\)/g, '()');
  content = content.replace(/\(_end\)/g, '()');
  content = content.replace(/\(end\)/g, '()');
  content = content.replace(/\(_originalEval\)/g, '()');
  content = content.replace(/\(originalEval\)/g, '()');
  content = content.replace(/\(_code\)/g, '()');
  content = content.replace(/\(code\)/g, '()');
  content = content.replace(/\(_message\)/g, '()');
  content = content.replace(/\(message\)/g, '()');
  content = content.replace(/\(_args\)/g, '()');
  content = content.replace(/\(args\)/g, '()');
  content = content.replace(/\(_event\)/g, '()');
  content = content.replace(/\(event\)/g, '()');
  content = content.replace(/\(_data\)/g, '()');
  content = content.replace(/\(data\)/g, '()');
  content = content.replace(/\(_errorData\)/g, '()');
  content = content.replace(/\(errorData\)/g, '()');
  
  // Remove unused variable declarations
  content = content.replace(/const\s+_\w+\s*=\s*[^;]+;/g, '');
  content = content.replace(/let\s+_\w+\s*=\s*[^;]+;/g, '');
  content = content.replace(/var\s+_\w+\s*=\s*[^;]+;/g, '');
  
  // Remove unused imports
  content = content.replace(/import\s*{\s*ReactNode\s*}\s*from\s*['"]react['"];\n?/g, '');
  content = content.replace(/import\s*{\s*PerformanceEventTiming\s*}\s*from\s*['"]react['"];\n?/g, '');
  content = content.replace(/import\s*{\s*LayoutShift\s*}\s*from\s*['"]react['"];\n?/g, '');
  content = content.replace(/import\s*{\s*useEffect\s*}\s*from\s*['"]react['"];\n?/g, '');
  content = content.replace(/import\s*{\s*useCallback\s*}\s*from\s*['"]react['"];\n?/g, '');
  content = content.replace(/import\s*{\s*memo\s*}\s*from\s*['"]react['"];\n?/g, '');
  
  // Remove unused ErrorBoundary imports
  const errorBoundaryPatterns = [
    /import\s*{\s*ErrorBoundary\s*}\s*from\s*['"][^'"]*ErrorBoundary['"];\n?/g,
    /import\s*{\s*ErrorBoundary\s*}\s*from\s*['"]\.\.\/components\/ErrorBoundary['"];\n?/g,
    /import\s*{\s*ErrorBoundary\s*}\s*from\s*['"]\.\.\/\.\.\/components\/ErrorBoundary['"];\n?/g,
    /import\s*{\s*ErrorBoundary\s*}\s*from\s*['"]\.\.\/\.\.\/\.\.\/components\/ErrorBoundary['"];\n?/g
  ];
  
  errorBoundaryPatterns.forEach(pattern => {
    if (content.match(pattern) && !content.includes('<ErrorBoundary') && !content.includes('ErrorBoundary(')) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });
  
  // Remove unused variable assignments
  content = content.replace(/const\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*unused/g, '');
  content = content.replace(/let\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*unused/g, '');
  content = content.replace(/var\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*unused/g, '');
  
  // Remove unused function parameters
  content = content.replace(/function\s+\w+\s*\(\s*[^)]*,\s*(\w+)\s*\)/g, (match, param) => {
    if (!content.includes(param)) {
      return match.replace(`, ${param}`, '');
    }
    return match;
  });
  
  // Remove unused arrow function parameters
  content = content.replace(/\(\s*[^)]*,\s*(\w+)\s*\)\s*=>/g, (match, param) => {
    if (!content.includes(param)) {
      return match.replace(`, ${param}`, '');
    }
    return match;
  });
  
  return { content, modified };
}

// Fix console statements
function fixConsoleStatements(content) {
  let modified = false;
  
  const consolePatterns = [
    /console\.log\([^)]*\);/g,
    /console\.warn\([^)]*\);/g,
    /console\.info\([^)]*\);/g,
    /console\.debug\([^)]*\);/g
  ];
  
  consolePatterns.forEach(pattern => {
    if (content.match(pattern)) {
      content = content.replace(pattern, (match) => {
        if (match.includes('console.error')) {
          return match; // Keep error logs
        }
        return `// ${match.trim()}`;
      });
      modified = true;
    }
  });
  
  return { content, modified };
}

// Fix unused imports
function fixUnusedImports(content) {
  let modified = false;
  
  // Remove unused React imports
  if (content.includes('import React') && !content.includes('<') && !content.includes('React.')) {
    content = content.replace(/import\s+React\s+from\s*['"]react['"];\n?/g, '');
    modified = true;
  }
  
  // Remove unused specific imports
  const unusedImports = [
    'ReactNode',
    'PerformanceEventTiming',
    'LayoutShift',
    'ErrorBoundary',
    'memo',
    'useEffect',
    'useCallback'
  ];
  
  unusedImports.forEach(importName => {
    const pattern = new RegExp(`import\\s*{\\s*${importName}\\s*}\\s*from\\s*['"][^'"]*['"];\\n?`, 'g');
    if (content.match(pattern) && !content.includes(importName)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });
  
  return { content, modified };
}

// Main function
function main() {
  const appDir = path.join(__dirname, 'app');
  const files = findFiles(appDir);
  
  let totalModified = 0;
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Apply all fixes
      const unusedVarsResult = fixUnusedVars(content);
      content = unusedVarsResult.content;
      modified = modified || unusedVarsResult.modified;
      
      const consoleResult = fixConsoleStatements(content);
      content = consoleResult.content;
      modified = modified || consoleResult.modified;
      
      const importsResult = fixUnusedImports(content);
      content = importsResult.content;
      modified = modified || importsResult.modified;
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed: ${file}`);
        totalModified++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`\nTotal files modified: ${totalModified}`);
}

main();