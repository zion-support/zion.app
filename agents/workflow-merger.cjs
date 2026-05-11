#!/usr/bin/env node
/**
 * Workflow Merger - Analyzes and creates merge plans for GitHub Actions
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const workflowDir = path.join(WORKSPACE, '.github/workflows');

console.log('🔍 Analyzing workflows for consolidation...\n');

const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

// Group by purpose
const groups = {
  'app-improvement': [],
  'content': [],
  'automation': [],
  'audit': [],
  'monitoring': [],
  'deployment': [],
  'maintenance': [],
  'ci': [],
  'other': []
};

for (const file of files) {
  const content = fs.readFileSync(path.join(workflowDir, file), 'utf8');
  const purposes = [];
  
  if (file.includes('app-improvement') || file.includes('app-evolution')) {
    purposes.push('app-improvement');
  }
  if (file.includes('content')) {
    purposes.push('content');
  }
  if (file.includes('automation') || file.includes('autonomous')) {
    purposes.push('automation');
  }
  if (file.includes('audit') || file.includes('quality')) {
    purposes.push('audit');
  }
  if (file.includes('monitor') || file.includes('health') || file.includes('slo') || file.includes('smoke')) {
    purposes.push('monitoring');
  }
  if (file.includes('deploy') || file.includes('build')) {
    purposes.push('deployment');
  }
  if (file.includes('maintenance') || file.includes('cleanup') || file.includes('hygiene')) {
    purposes.push('maintenance');
  }
  if (file.includes('ci-') || file === 'ci-cd.yml') {
    purposes.push('ci');
  }
  
  if (purposes.length === 0) purposes.push('other');
  
  for (const p of purposes) {
    groups[p].push({ file, content });
  }
}

console.log('Workflow groups:');
for (const [group, items] of Object.entries(groups)) {
  if (items.length > 0) {
    console.log(`  ${group}: ${items.length} workflows`);
  }
}

// Create merge recommendations
const recommendations = [];

if (groups['app-improvement'].length > 1) {
  recommendations.push({
    category: 'app-improvement',
    files: groups['app-improvement'].map(i => i.file),
    action: 'Merge into 2: quick (on push) + full (scheduled)'
  });
}

if (groups['content'].length > 3) {
  recommendations.push({
    category: 'content',
    files: groups['content'].map(i => i.file),
    action: 'Merge into: velocity + quality'
  });
}

if (groups['automation'].length > 3) {
  recommendations.push({
    category: 'automation',
    files: groups['automation'].map(i => i.file),
    action: 'Merge fingerprint/digest workflows'
  });
}

if (groups['monitoring'].length > 3) {
  recommendations.push({
    category: 'monitoring',
    files: groups['monitoring'].map(i => i.file),
    action: 'Merge into: health + regression'
  });
}

console.log('\n📋 Merge Recommendations:\n');
for (const rec of recommendations) {
  console.log(`${rec.category}:`);
  console.log(`  Files: ${rec.files.length}`);
  console.log(`  Action: ${rec.action}`);
  console.log('');
}

fs.writeFileSync(
  path.join(WORKSPACE, 'workflow-merge-plan.json'),
  JSON.stringify({ groups: Object.keys(groups).map(k => ({ group: k, count: groups[k].length })), recommendations }, null, 2)
);

console.log('Plan saved to workflow-merge-plan.json');
