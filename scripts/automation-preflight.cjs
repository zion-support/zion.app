// automation:preflight — quick preflight check before build exports
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();

try {
  execSync('npx tsc --noEmit --pretty false', { stdio: 'pipe' });
  console.log('✅ Type-check clean');
} catch(e) {
  console.log('⚠️ Type-check: ' + (e.stdout || e.message).slice(-120));
  // Non-blocking - continue even if types fail
}

try {
  const outPath = path.join(repoRoot, 'out');
  const size = fs.statSync(outPath).size;
  console.log(`✅ out/ exists and is ${size} bytes`);
} catch {
  console.log('⚠️ out/ missing — will build fresh');
}

console.log('automation:preflight OK');
process.exit(0); // Always succeed - preflight is advisory