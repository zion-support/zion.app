const fs = require('fs');
const path = require('path');

// Remove console logs from built files
const removeConsoleLogs = () => {
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('Dist directory not found, skipping console log removal');
    return;
  }

  const processFile = (filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove console.log statements
      content = content.replace(/console\.log\([^)]*\);?/g, '');
      content = content.replace(/console\.warn\([^)]*\);?/g, '');
      content = content.replace(/console\.error\([^)]*\);?/g, '');
      content = content.replace(/console\.info\([^)]*\);?/g, '');
      content = content.replace(/console\.debug\([^)]*\);?/g, '');
      
      // Clean up empty lines
      content = content.replace(/\n\s*\n/g, '\n');
      
      fs.writeFileSync(filePath, content);
      console.log(`Processed: ${filePath}`);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  };

  const processDirectory = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.js')) {
        processFile(filePath);
      }
    });
  };

  processDirectory(distDir);
  console.log('Console logs removed from built files');
};

removeConsoleLogs();