#!/usr/bin/env node
/**
 * Build Optimizer Agent
 * Checks for common build issues and suggests fixes
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const issues = [];

console.log('🔧 Checking for common build issues...\n');

// Check 1: TypeScript errors
console.log('1️⃣ Checking TypeScript...');
try {
  execSync('npx tsc --noEmit --pretty false', { 
    cwd: WORKSPACE, 
    encoding: 'utf8',
    timeout: 60000 
  });
  console.log('   ✅ No TypeScript errors');
} catch (e) {
  const errors = e.stdout || e.stderr || '';
  const count = (errors.match(/error TS/g) || []).length;
  console.log(`   ⚠️ Found ${count} TypeScript errors`);
  issues.push({ type: 'typescript', count, severity: 'high' });
}

// Check 2: ESLint
console.log('\n2️⃣ Checking ESLint...');
try {
  execSync('npx eslint --max-warnings 0 app pages --ext .ts,.tsx,.js,.jsx 2>&1 | head -20', { 
    cwd: WORKSPACE, 
    encoding: 'utf8',
    timeout: 60000 
  });
  console.log('   ✅ No ESLint errors');
} catch (e) {
  const output = e.stdout || e.stderr || '';
  if (output.includes('error')) {
    console.log('   ⚠️ ESLint found issues');
    issues.push({ type: 'eslint', severity: 'medium' });
  }
}

// Check 3: Duplicate imports
console.log('\n3️⃣ Checking for duplicate imports...');
const files = getAllFiles(path.join(WORKSPACE, 'app'), ['.ts', '.tsx']);
const importMap = new Map();

for (const file of files.slice(0, 100)) { // Sample first 100
  const content = fs.readFileSync(file, 'utf8');
  const imports = content.match(/import\s+.*?from\s+['"](.*?)['"]/g) || [];
  for (const imp of imports) {
    const mod = imp.match(/from\s+['"](.*?)['"]/)[1];
    if (!mod.startsWith('.') && !mod.startsWith('@')) {
      importMap.set(mod, (importMap.get(mod) || 0) + 1);
    }
  }
}

const duplicates = [...importMap.entries()].filter(([k, v]) => v > 10);
if (duplicates.length > 0) {
  console.log(`   ⚠️ ${duplicates.length} modules imported 10+ times`);
  issues.push({ type: 'duplicates', modules: duplicates.length, severity: 'low' });
} else {
  console.log('   ✅ No obvious duplicate imports');
}

// Check 4: Unused files
console.log('\n4️⃣ Checking for orphaned files...');
const allFiles = getAllFiles(path.join(WORKSPACE, 'app'), ['.ts', '.tsx', '.js']);
const referenced = new Set();

// Simple check for file references in other files
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/from\s+['"](\.[^'"]+)['"]/g) || [];
  for (const m of matches) {
    const ref = m.match(/from\s+['"](\.[^'"]+)['"]/)[1];
    referenced.add(ref);
  }
}

const orphaned = allFiles.filter(f => {
  const name = path.basename(f, path.extname(f));
  return !referenced.has(`./${name}`) && !referenced.has(`../${name}`);
});

if (orphaned.length > 0) {
  console.log(`   ⚠️ Found ${orphaned.length} potentially orphaned files`);
  issues.push({ type: 'orphaned', count: orphaned.length, severity: 'low' });
} else {
  console.log('   ✅ No orphaned files detected');
}

// Summary
console.log('\n📊 Summary:');
console.log(`   Total issues found: ${issues.length}`);
console.log(`   High severity: ${issues.filter(i => i.severity === 'high').length}`);
console.log(`   Medium: ${issues.filter(i => i.severity === 'medium').length}`);
console.log(`   Low: ${issues.filter(i => i.severity === 'low').length}`);

// Save report
fs.writeFileSync(
  path.join(WORKSPACE, 'build-optimization-report.json'),
  JSON.stringify({ issues, timestamp: new Date().toISOString() }, null, 2)
);

console.log('\n📄 Report saved to build-optimization-report.json');

function getAllFiles(dir, exts) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllFiles(full, exts));
    } else if (exts.some(ext => item.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const { execSync } = require('child_process');
