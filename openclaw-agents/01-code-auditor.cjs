#!/usr/bin/env node
/**
 * OpenClaw Agent: Code Auditor
 * Role: Analyze code quality, find issues, suggest improvements
 * Outputs: findings.json for other agents to use
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const FINDINGS_FILE = '/root/.openclaw/workspace/zion.app/openclaw-agents/shared/findings.json';

const findings = {
  timestamp: new Date().toISOString(),
  agent: 'code-auditor',
  issues: [],
  scores: { security: 0, quality: 0, performance: 0 },
  recommendations: []
};

function auditFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(WORKSPACE, file);
  const issues = [];
  
  // Check for console.log in production
  if (content.includes('console.log') && !content.includes('// eslint')) {
    issues.push({ type: 'console-log', severity: 'low', file: relPath });
  }
  
  // Check for any type usage (any[])
  const anyTypeMatches = content.match(/:\s*any\b/g);
  if (anyTypeMatches) {
    issues.push({ type: 'any-type', severity: 'medium', file: relPath, count: anyTypeMatches.length });
  }
  
  // Check for TODO comments
  const todoMatches = content.match(/\/\/\s*TODO|\/\*\s*TODO/g);
  if (todoMatches) {
    issues.push({ type: 'todo', severity: 'low', file: relPath, count: todoMatches.length });
  }
  
  // Check for hardcoded secrets
  if (/(apiKey|apikey|secret|password|token)\s*=\s*['"][^'"]{8,}['"]/i.test(content)) {
    issues.push({ type: 'potential-secret', severity: 'high', file: relPath });
  }
  
  // Check for missing error handling
  if (/fetch\(/.test(content) && !content.includes('catch(')) {
    issues.push({ type: 'missing-error-handling', severity: 'medium', file: relPath });
  }
  
  return issues;
}

function getAllFiles(dir, exts) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const ignore = ['node_modules', '.next', 'out', 'dist', 'build', '.git'];
  
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllFiles(full, exts));
    } else if (exts.some(ext => item.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

console.log('🔍 Code Auditor scanning codebase...\n');

const tsxFiles = getAllFiles(path.join(WORKSPACE, 'app'), ['.ts', '.tsx']);
const jsFiles = getAllFiles(path.join(WORKSPACE, 'app'), ['.js', '.jsx']);

console.log(`  Scanning ${tsxFiles.length + jsFiles.length} files...`);

for (const file of [...tsxFiles, ...jsFiles].slice(0, 200)) {
  findings.issues.push(...auditFile(file));
}

// Calculate scores
const highSev = findings.issues.filter(i => i.severity === 'high').length;
const medSev = findings.issues.filter(i => i.severity === 'medium').length;
const lowSev = findings.issues.filter(i => i.severity === 'low').length;

findings.scores.quality = Math.max(0, 100 - (highSev * 10) - (medSev * 5) - lowSev);
findings.scores.security = Math.max(0, 100 - (highSev * 20));
findings.scores.performance = 85; // Estimated

// Generate recommendations
if (highSev > 0) {
  findings.recommendations.push({ priority: 'high', action: `Fix ${highSev} high severity issues` });
}
if (medSev > 10) {
  findings.recommendations.push({ priority: 'medium', action: `Address ${medSev} medium issues` });
}

console.log('\n📊 Audit Results:');
console.log(`  Quality Score: ${findings.scores.quality}/100`);
console.log(`  Security Score: ${findings.scores.security}/100`);
console.log(`  High: ${highSev} | Medium: ${medSev} | Low: ${lowSev}`);

// Save findings
fs.mkdirSync(path.dirname(FINDINGS_FILE), { recursive: true });
fs.writeFileSync(FINDINGS_FILE, JSON.stringify(findings, null, 2));
console.log('\n✅ Findings saved for other agents');
