#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const workflowDir = path.join(process.cwd(), '.github', 'workflows');

console.log('🔍 Scanning for workflows missing "on" triggers...');

// Function to fix missing 'on' triggers
function fixMissingOnTrigger(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const obj = yaml.load(content);
    
    if (!obj || typeof obj !== 'object') {
      console.log(`❌ Invalid YAML in ${filePath}`);
      return false;
    }
    
    // Check if 'on' is missing
    if (!obj.hasOwnProperty('on')) {
      // Add default triggers
      obj.on = {
        push: { branches: ['main'] },
        pull_request: { branches: ['main'] }
      };
      
      // Convert back to YAML
      const fixedContent = yaml.dump(obj, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        noCompatMode: true
      });
      
      // Ensure file ends with newline
      if (!fixedContent.endsWith('\n')) {
        fs.writeFileSync(filePath, fixedContent + '\n');
      } else {
        fs.writeFileSync(filePath, fixedContent);
      }
      
      console.log(`✅ Fixed: ${path.relative(workflowDir, filePath)}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.log(`❌ Error processing ${filePath}: ${err.message}`);
    return false;
  }
}

// Process all workflow files
const files = fs.readdirSync(workflowDir)
  .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  .map(f => path.join(workflowDir, f));

let fixedCount = 0;
let skipCount = 0;

for (const file of files) {
  if (fixMissingOnTrigger(file)) {
    fixedCount++;
  } else {
    skipCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`  Fixed: ${fixedCount} workflows`);
console.log(`  Already valid: ${skipCount} workflows`);
console.log(`  Total processed: ${files.length}`);

if (fixedCount > 0) {
  console.log(`\n🔧 Adding ${fixedCount} workflows to git...`);
  const { execSync } = require('child_process');
  execSync('git add .github/workflows', { stdio: 'inherit' });
  execSync(`git commit -m "🔧 fix: add missing 'on' triggers to ${fixedCount} workflows"`, { stdio: 'inherit' });
  console.log('✅ All changes committed');
}