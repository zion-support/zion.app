const fs = require('fs');
const glob = require('glob');

// Fix all syntax errors in the entire app directory
const files = glob.sync('app/**/*.{tsx,ts}');

let totalFixed = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix import statements with colons
  if (content.includes('from: ')) {
    content = content.replace(/from: /g, 'from ');
    changed = true;
  }

  // Fix object syntax errors
  if (content.includes('openGraph: {,')) {
    content = content.replace(/openGraph: \{,/g, 'openGraph: {');
    changed = true;
  }

  if (content.includes('twitter: {,')) {
    content = content.replace(/twitter: \{,/g, 'twitter: {');
    changed = true;
  }

  // Fix array syntax errors
  if (content.includes('}, [gaId gtmId enabled]);')) {
    content = content.replace(/}, \[gaId gtmId enabled\]\);/g, '}, [gaId, gtmId, enabled]);');
    changed = true;
  }

  // Fix destructuring syntax errors
  if (content.includes('const [isOpen setIsOpen]')) {
    content = content.replace(/const \[isOpen setIsOpen\]/g, 'const [isOpen, setIsOpen]');
    changed = true;
  }

  // Fix trailing comma issues
  if (content.includes('}, [gaId, gtmId, enabled]);')) {
    content = content.replace(/}, \[gaId, gtmId, enabled\]\);/g, '}, [gaId, gtmId, enabled]);');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    totalFixed++;
    console.log(`Fixed: ${filePath}`);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}`);