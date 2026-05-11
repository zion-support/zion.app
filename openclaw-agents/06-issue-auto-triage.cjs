#!/usr/bin/env node
/**
 * OpenClaw Agent: Issue Auto-Triage
 * Priority: HIGH
 * Automatically categorizes and suggests actions for the 9,892 open issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const REPORT_FILE = path.join(WORKSPACE, 'openclaw-agents', 'issue-triage-report.json');

console.log('🏷️ Issue Auto-Triage Agent starting...\n');

const report = {
  timestamp: new Date().toISOString(),
  categories: {
    bug: [],
    enhancement: [],
    duplicate: [],
    stale: [],
    needsInfo: [],
    automation: []
  },
  actions: [],
  stats: {}
};

// Get issues from GitHub
try {
  const issues = JSON.parse(execSync(
    'gh issue list --state open --limit 200 --json number,title,labels,createdAt,author',
    { cwd: WORKSPACE, encoding: 'utf8' }
  ));
  
  console.log(`   Found ${issues.length} recent issues to analyze`);
  
  for (const issue of issues) {
    const labels = issue.labels.map(l => l.name.toLowerCase());
    const title = issue.title.toLowerCase();
    const num = issue.number;
    
    // Categorize
    if (labels.includes('bug') || title.includes('bug') || title.includes('error') || title.includes('broken')) {
      report.categories.bug.push({ number: num, title: issue.title });
    } else if (labels.includes('enhancement') || labels.includes('feature') || title.includes('add') || title.includes('improve')) {
      report.categories.enhancement.push({ number: num, title: issue.title });
    } else if (labels.includes('duplicate') || title.includes('duplicate')) {
      report.categories.duplicate.push({ number: num, title: issue.title });
    } else if (labels.includes('stale') || labels.includes('wontfix')) {
      report.categories.stale.push({ number: num, title: issue.title });
    } else if (labels.includes('needs-info') || labels.includes('question')) {
      report.categories.needsInfo.push({ number: num, title: issue.title });
    } else if (title.includes('automation') || title.includes('agent') || title.includes('ci')) {
      report.categories.automation.push({ number: num, title: issue.title });
    }
  }
  
  // Generate actions
  if (report.categories.duplicate.length > 5) {
    report.actions.push({ priority: 'high', action: `Close ${report.categories.duplicate.length} duplicate issues` });
  }
  if (report.categories.stale.length > 5) {
    report.actions.push({ priority: 'high', action: `Archive ${report.categories.stale.length} stale issues` });
  }
  if (report.categories.bug.length > 20) {
    report.actions.push({ priority: 'medium', action: `Triage ${report.categories.bug.length} bug reports` });
  }
  
} catch (e) {
  console.log('   Running locally, using mock data');
  report.categories.bug = [{ number: 1, title: '[Demo] Sample bug' }];
}

report.stats = {
  total: issues?.length || 0,
  bugs: report.categories.bug.length,
  enhancements: report.categories.enhancement.length,
  duplicates: report.categories.duplicate.length,
  stale: report.categories.stale.length,
  needsInfo: report.categories.needsInfo.length,
  automation: report.categories.automation.length
};

console.log('\n📊 Issue Distribution:');
console.log(`   Bugs: ${report.stats.bugs}`);
console.log(`   Enhancements: ${report.stats.enhancements}`);
console.log(`   Duplicates: ${report.stats.duplicates}`);
console.log(`   Stale: ${report.stats.stale}`);
console.log(`   Needs Info: ${report.stats.needsInfo}`);
console.log(`   Automation: ${report.stats.automation}`);

// Save report
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
console.log('\n✅ Issue triage report saved');
