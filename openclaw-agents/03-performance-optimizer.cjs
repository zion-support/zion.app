#!/usr/bin/env node
/**
 * OpenClaw Agent: Performance Optimizer
 * Role: Find and fix performance bottlenecks
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const FINDINGS_FILE = '/root/.openclaw/workspace/zion.app/openclaw-agents/shared/findings.json';

const report = {
  timestamp: new Date().toISOString(),
  agent: 'performance-optimizer',
  issues: [],
  suggestions: []
};

console.log('⚡ Performance Optimizer scanning...\n');

function getFiles(dir, exts) {
  const files = [];
  const ignore = ['node_modules', '.next', 'out', 'dist'];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...getFiles(full, exts));
    else if (exts.some(e => item.name.endsWith(e))) files.push(full);
  }
  return files;
}

const files = getFiles(path.join(WORKSPACE, 'app'), ['.ts', '.tsx', '.js']);
console.log(`  Analyzing ${files.length} files...`);

let largeBundleImports = 0;
let inlineStyles = 0;
let missingMemo = 0;
let largeComponents = 0;

for (const file of files.slice(0, 150)) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(WORKSPACE, file);
  const lines = content.split('\n').length;
  
  // Check for large bundle imports
  const heavyImports = ['@fullcalendar', 'chart.js', 'framer-motion', 'three'];
  for (const imp of heavyImports) {
    if (content.includes(`'${imp}'`) || content.includes(`"${imp}"`)) {
      largeBundleImports++;
      report.issues.push({ type: 'heavy-import', file: relPath, package: imp });
    }
  }
  
  // Check for inline styles (should use CSS modules or Tailwind)
  if (content.match(/style=\{\{/g)?.length > 5) {
    inlineStyles++;
    report.issues.push({ type: 'inline-styles', file: relPath });
  }
  
  // Check for missing React.memo on large components
  if (lines > 200 && content.includes('export default') && !content.includes('React.memo') && !content.includes('memo(')) {
    largeComponents++;
    missingMemo++;
    report.issues.push({ type: 'missing-memo', file: relPath, lines });
  }
  
  // Check for synchronous operations that could be async
  if (content.includes('JSON.parse') && content.includes('useEffect')) {
    report.suggestions.push({ file: relPath, suggestion: 'Consider lazy parsing in useEffect' });
  }
}

console.log(`\n📊 Performance Issues Found:`);
console.log(`  Heavy imports: ${largeBundleImports}`);
console.log(`  Inline styles: ${inlineStyles}`);
console.log(`  Missing memo: ${missingMemo}`);
console.log(`  Large components: ${largeComponents}`);

// Score
const perfScore = Math.max(0, 100 - (largeBundleImports * 5) - (inlineStyles * 2) - (missingMemo * 3));
console.log(`  Performance Score: ${perfScore}/100`);

report.score = perfScore;

// Save
const sharedDir = path.join(WORKSPACE, 'openclaw-agents', 'shared');
fs.mkdirSync(sharedDir, { recursive: true });

let existing = {};
try { existing = JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf8')); } catch (e) {}

fs.writeFileSync(FINDINGS_FILE, JSON.stringify({ ...existing, performance: report }, null, 2));
console.log('\n✅ Performance report saved');
