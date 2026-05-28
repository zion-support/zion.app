const fs = require('fs');
const path = require('path');

function fixSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Fix function declarations missing opening brace
      if (line.match(/^function\s+\w+\(\)$/) && i + 1 < lines.length && lines[i + 1].trim().startsWith('return')) {
        fixedLines.push(line + ' {');
        continue;
      }
      
      // Fix function declarations with parameters missing opening brace
      if (line.match(/^function\s+\w+\([^)]*\)$/) && i + 1 < lines.length && lines[i + 1].trim().startsWith('return')) {
        fixedLines.push(line + ' {');
        continue;
      }
      
      // Fix function declarations with destructured parameters
      if (line.match(/^function\s+\w+\($/) && i + 1 < lines.length) {
        // Look ahead to find the closing parenthesis and add opening brace
        let j = i + 1;
        let foundClosing = false;
        while (j < lines.length && j < i + 10) {
          if (lines[j].includes('}) {')) {
            foundClosing = true;
            break;
          }
          j++;
        }
        if (foundClosing) {
          fixedLines.push(line);
          continue;
        }
      }
      
      // Skip empty lines that might be causing issues
      if (line.trim() === '' && i > 0 && lines[i - 1].trim() === '') {
        continue;
      }
      
      fixedLines.push(line);
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, fixedLines.join('\n'));
    console.log(`Fixed syntax: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      fixSyntax(filePath);
    }
  }
}

// Start fixing from the app directory
walkDir('./app');
console.log('Syntax fixing completed!');