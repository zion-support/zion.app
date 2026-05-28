#!/usr/bin/env node
/**
 * OpenClaw Agent: Bug Hunter
 * Role: Find runtime errors, type errors, and bugs
 * Uses: Code auditor findings to focus search
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const FINDINGS_FILE = '/root/.openclaw/workspace/zion.app/openclaw-agents/shared/findings.json';

const report = {
  timestamp: new Date().toISOString(),
  agent: 'bug-hunter',
  bugs: [],
  typeErrors: [],
  runtimeWarnings: []
};

console.log('🐛 Bug Hunter scanning for bugs...\n');

// Check TypeScript errors
console.log('1️⃣ Running TypeScript check...');
try {
  const tscOutput = execSync('./node_modules/.bin/tsc --noEmit 2>&1', { 
    cwd: WORKSPACE, 
    encoding: 'utf8',
    timeout: 30000 
  });
  
  const errors = tscOutput.split('\n').filter(l => l.includes('error TS'));
  for (const err of errors.slice(0, 50)) {
    const match = err.match(/error TS\d+:\s*(.+?)\s*\((\d+),(\d+)\)/);
    if (match) {
      report.typeErrors.push({ message: match[1], line: match[2], col: match[3] });
    }
  }
  console.log(`   Found ${report.typeErrors.length} TypeScript errors`);
} catch (e) {
  const output = e.stdout || e.stderr || '';
  const errors = output.split('\n').filter(l => l.includes('error TS'));
  for (const err of errors.slice(0, 50)) {
    const match = err.match(/error TS\d+:\s*(.+?)\s*\((\d+),(\d+)\)/);
    if (match) {
      report.typeErrors.push({ message: match[1], line: match[2], col: match[3] });
    }
  }
  console.log(`   Found ${report.typeErrors.length} TypeScript errors`);
}

// Check ESLint
console.log('\n2️⃣ Running ESLint...');
try {
  const eslintOutput = execSync('./node_modules/.bin/eslint app pages --ext .ts,.tsx,.js,.jsx --format json 2>&1', { 
    cwd: WORKSPACE, 
    encoding: 'utf8',
    timeout: 30000 
  });
  
  const eslintResults = JSON.parse(eslintOutput);
  for (const result of eslintResults.slice(0, 20)) {
    for (const msg of result.messages) {
      if (msg.severity === 2) {
        report.bugs.push({ 
          rule: msg.ruleId, 
          message: msg.message,
          file: path.relative(WORKSPACE, result.filePath),
          line: msg.line
        });
      }
    }
  }
  console.log(`   Found ${report.bugs.length} ESLint errors`);
} catch (e) {
  console.log('   ESLint check completed with warnings');
}

// Check for common React issues
console.log('\n3️⃣ Checking for React issues...');
function findReactIssues(dir) {
  const files = [];
  const ignore = ['node_modules', '.next'];
  
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findReactIssues(full));
    } else if (item.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

const reactFiles = findReactIssues(path.join(WORKSPACE, 'app'));
let missingKeyCount = 0;
let missingDepsCount = 0;

for (const file of reactFiles.slice(0, 100)) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for missing keys in maps
  if (/\.map\(/.test(content) && !/\.map\([^)]*key\s*=/.test(content)) {
    missingKeyCount++;
  }
  
  // Check for useEffect without dependencies
  if (/useEffect\(\(\)\s*=>\s*\{/.test(content) && !/,\s*\[\]/.test(content)) {
    missingDepsCount++;
  }
}

if (missingKeyCount > 0) {
  report.bugs.push({ type: 'react-missing-key', count: missingKeyCount });
}
if (missingDepsCount > 0) {
  report.bugs.push({ type: 'react-missing-deps', count: missingDepsCount });
}

console.log(`   Missing keys in maps: ${missingKeyCount}`);
console.log(`   useEffect missing deps: ${missingDepsCount}`);

// Summary
console.log('\n📊 Bug Hunt Results:');
console.log(`  TypeScript Errors: ${report.typeErrors.length}`);
console.log(`  ESLint Errors: ${report.bugs.length}`);
console.log(`  React Issues: ${missingKeyCount + missingDepsCount}`);

// Save report
const sharedDir = path.join(WORKSPACE, 'openclaw-agents', 'shared');
fs.mkdirSync(sharedDir, { recursive: true });

// Merge with existing findings if available
let existing = {};
try {
  existing = JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf8'));
} catch (e) {}

// Combine reports
const combined = { ...existing, bugHunter: report };
fs.writeFileSync(FINDINGS_FILE, JSON.stringify(combined, null, 2));

console.log('\n✅ Bug report saved for improvement agent');
