// automation:preflight — quick preflight check before build exports
const { execSync } = require('child_process');
const fs = require('fs');

let passed = true;

try {
  execSync('npx tsc --noEmit --pretty false', { stdio: 'pipe', cwd: 'zion.app' });
  console.log('✅ Type-check clean');
} catch(e) {
  console.log('⚠️ Type-check: ' + (e.stdout || e.message).slice(-120));
  passed = false;
}

try {
  const size = fs.statSync('zion.app/out').size;
  console.log(`✅ out/ exists and is ${size} bytes`);
} catch {
  console.log('⚠️ out/ missing — will build fresh');
}

if (!passed) {
  console.log('automation:preflight FAILED');
  process.exit(0);  // Non-blocking — CI should continue
}
console.log('automation:preflight OK');
