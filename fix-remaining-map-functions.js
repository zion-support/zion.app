import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixMapFunctions(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix specific patterns
    const fixes = [
      // Fix feature.benefits.map with _benefit, _idx
      {
        from: /feature\.benefits\.map\(\(\(_benefit, _idx\)\s*=>/g,
        to: 'feature.benefits.map((benefit, idx) =>'
      },
      // Fix benefits.map with _benefit, _index
      {
        from: /benefits\.map\(\(\(_benefit, _index\)\s*=>/g,
        to: 'benefits.map((benefit, index) =>'
      },
      // Fix features.map with _feature, _index
      {
        from: /features\.map\(\(\(_feature, _index\)\s*=>/g,
        to: 'features.map((feature, index) =>'
      },
      // Fix itServices.map with _service, _index
      {
        from: /itServices\.map\(\(\(_service, _index\)\s*=>/g,
        to: 'itServices.map((service, index) =>'
      },
      // Fix aiServices.map with _service, _index
      {
        from: /aiServices\.map\(\(\(_service, _index\)\s*=>/g,
        to: 'aiServices.map((service, index) =>'
      },
      // Fix values.map with __value, __index
      {
        from: /values\.map\(\(\(__value, __index\)\s*=>/g,
        to: 'values.map((value, index) =>'
      }
    ];

    for (const fix of fixes) {
      const newContent = content.replace(fix.from, fix.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed map functions: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixMapFunctions(filePath)) {
        totalFixed++;
      }
    }
  }

  return totalFixed;
}

console.log('Starting remaining map function fixes...');
const appDir = path.join(__dirname, 'app');
const totalFixed = processDirectory(appDir);
console.log(`Fixed map functions in ${totalFixed} files`);
console.log('Map function fixes completed!');