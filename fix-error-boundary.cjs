const fs = require('fs');
const path = require('path');

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

const pageFiles = findPageFiles('/workspace/app');

console.log(`Found ${pageFiles.length} page files`);

for (const filePath of pageFiles) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace ErrorBoundary import with ServerErrorBoundary
    content = content.replace(
      /import ErrorBoundary from ['"]\.\.\/components\/ErrorBoundary['"];?/g,
      "import ServerErrorBoundary from '../components/ServerErrorBoundary';"
    );
    
    content = content.replace(
      /import ErrorBoundary from ['"]\.\.\/\.\.\/components\/ErrorBoundary['"];?/g,
      "import ServerErrorBoundary from '../../components/ServerErrorBoundary';"
    );
    
    content = content.replace(
      /import ErrorBoundary from ['"]\.\/components\/ErrorBoundary['"];?/g,
      "import ServerErrorBoundary from './components/ServerErrorBoundary';"
    );
    
    // Replace ErrorBoundary usage with ServerErrorBoundary
    content = content.replace(/<ErrorBoundary>/g, '<ServerErrorBoundary>');
    content = content.replace(/<\/ErrorBoundary>/g, '</ServerErrorBoundary>');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

console.log('Done updating ErrorBoundary to ServerErrorBoundary');
