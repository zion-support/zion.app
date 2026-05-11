#!/usr/bin/env node
/**
 * Workflow Auditor Agent
 * Scans GitHub Actions for common issues
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const workflowDir = path.join(WORKSPACE, '.github/workflows');

const issues = {
  syntax: [],
  deprecated: [],
  missing: [],
  redundant: []
};

console.log('🔍 Auditing GitHub Actions workflows...\n');

const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

for (const file of files) {
  const filepath = path.join(workflowDir, file);
  let content;
  
  try {
    content = fs.readFileSync(filepath, 'utf8');
    // Basic YAML structure check
    if (!content.includes('name:') && !content.includes('on:')) {
      issues.syntax.push({ file, error: 'Missing name or trigger' });
    }
    if (!content.includes('on:')) {
      issues.missing.push({ file, error: 'No trigger defined (on:)' });
    }
  } catch (e) {
    issues.syntax.push({ file, error: e.message });
    continue;
  }
  
  // Check for deprecated actions
  const deprecatedPatterns = [
    { pattern: 'actions/checkout@v2', name: 'actions/checkout@v2' },
    { pattern: 'actions/checkout@v3', name: 'actions/checkout@v3' },
    { pattern: 'actions/setup-node@v2', name: 'actions/setup-node@v2' },
    { pattern: 'actions/setup-node@v3', name: 'actions/setup-node@v3' }
  ];
  
  for (const { pattern, name } of deprecatedPatterns) {
    if (content.includes(pattern)) {
      issues.deprecated.push({ file, action: name });
    }
  }
}

console.log(`📁 Total workflows: ${files.length}\n`);

console.log(`❌ Syntax errors: ${issues.syntax.length}`);
if (issues.syntax.length > 0) {
  issues.syntax.slice(0, 5).forEach(i => console.log(`   ${i.file}: ${i.error}`));
}

console.log(`⚠️  Deprecated actions: ${issues.deprecated.length}`);
if (issues.deprecated.length > 0) {
  const byAction = {};
  issues.deprecated.forEach(i => {
    byAction[i.action] = (byAction[i.action] || 0) + 1;
  });
  Object.entries(byAction).forEach(([action, count]) => {
    console.log(`   ${action}: ${count} uses`);
  });
}

// Find potentially redundant workflows (similar names)
const nameGroups = {};
files.forEach(f => {
  const base = f.replace(/-\d+-\d+/g, '').replace(/\.yml$/, '');
  const root = base.split('-')[0] + '-' + base.split('-')[1];
  nameGroups[root] = (nameGroups[root] || 0) + 1;
});

const redundant = Object.entries(nameGroups).filter(([k, v]) => v > 3);
console.log(`\n🔄 Potentially redundant (same prefix, 3+ versions):`);
redundant.slice(0, 10).forEach(([name, count]) => {
  console.log(`   ${name}*: ${count} workflows`);
});

// Summary
const report = {
  total: files.length,
  issues: issues,
  redundant,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(WORKSPACE, 'workflow-audit.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Report saved to workflow-audit.json');
