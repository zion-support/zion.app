import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixMapFunctions(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix map functions with underscore prefixes that are used in JSX
    const patterns = [
      // Pattern 1: features.map(((_feature, _index) => ... {feature.title} ... {index}
      {
        regex: /features\.map\(\(\(_feature, _index\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(_feature, _index\)/g, '(feature, index)');
        }
      },
      // Pattern 2: benefits.map(((_benefit, _index) => ... {benefit} ... {index}
      {
        regex: /benefits\.map\(\(\(_benefit, _index\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(_benefit, _index\)/g, '(benefit, index)');
        }
      },
      // Pattern 3: feature.benefits.map(((_benefit, _idx) => ... {benefit} ... {idx}
      {
        regex: /feature\.benefits\.map\(\(\(_benefit, _idx\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(_benefit, _idx\)/g, '(benefit, idx)');
        }
      },
      // Pattern 4: itServices.map(((_service, _index) => ... {service.name} ... {index}
      {
        regex: /itServices\.map\(\(\(_service, _index\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(_service, _index\)/g, '(service, index)');
        }
      },
      // Pattern 5: aiServices.map(((_service, _index) => ... {service.name} ... {index}
      {
        regex: /aiServices\.map\(\(\(_service, _index\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(_service, _index\)/g, '(service, index)');
        }
      },
      // Pattern 6: values.map(((__value, __index) => ... {value} ... {index}
      {
        regex: /values\.map\(\(\(__value, __index\)\s*=>\s*\([\s\S]*?\)\)\)/g,
        replacement: (match) => {
          return match.replace(/\(__value, __index\)/g, '(value, index)');
        }
      }
    ];

    for (const pattern of patterns) {
      const newContent = content.replace(pattern.regex, pattern.replacement);
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

console.log('Starting map function fixes...');
const appDir = path.join(__dirname, 'app');
const totalFixed = processDirectory(appDir);
console.log(`Fixed map functions in ${totalFixed} files`);
console.log('Map function fixes completed!');