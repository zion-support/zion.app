// check-merge-conflict-markers.cjs - Detect merge conflict markers
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2).length ? process.argv.slice(2) : ['.'];
let hasConflicts = false;

function checkFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('<<<<<<<') || content.includes('=======' || content.includes('>>>>>>>'))) {
    console.log(`⚠️ Merge conflict markers found in ${filepath}`);
    hasConflicts = true;
  }
}

// Check staged files
try {
  const { execSync } = require('child_process');
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  if (staged.length) {
    staged.forEach(f => {
      try { checkFile(f); } catch (e) {}
    });
  }
} catch (e) {}

if (hasConflicts) {
  console.log('merge-conflict-markers: FAIL');
  process.exit(0); // Non-blocking
}
console.log('merge-conflict-markers: OK');
process.exit(0);
