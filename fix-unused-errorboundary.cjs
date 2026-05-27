const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixUnusedErrorBoundary() {
  console.log('Fixing unused ErrorBoundary imports...');
  
  const files = await glob('app/**/*.tsx');
  let fixedFiles = 0;

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if ErrorBoundary is imported but not used
    const hasErrorBoundaryImport = content.includes("import ErrorBoundary from");
    const usesErrorBoundary = content.includes("<ErrorBoundary") || content.includes("ErrorBoundary");
    
    if (hasErrorBoundaryImport && !usesErrorBoundary) {
      // Remove the ErrorBoundary import line
      const lines = content.split('\n');
      const newLines = lines.filter(line => !line.trim().startsWith("import ErrorBoundary from"));
      const newContent = newLines.join('\n');
      
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        fixedFiles++;
        console.log(`Removed unused ErrorBoundary import from: ${file}`);
      }
    }
  });

  console.log(`Fixed ${fixedFiles} files with unused ErrorBoundary imports`);
}

fixUnusedErrorBoundary().catch(console.error);