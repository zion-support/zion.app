#!/usr/bin/env node
/**
 * Issue Triager Agent
 * Analyzes and categorizes open issues for easier management
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';

console.log('🏷️ Analyzing open issues...\n');

try {
  // Get issues without label stats
  const issues = JSON.parse(execSync(
    'gh issue list --state open --limit 100 --json number,title,labels',
    { cwd: WORKSPACE, encoding: 'utf8' }
  ));
  
  const categories = {
    bug: { count: 0, issues: [] },
    enhancement: { count: 0, issues: [] },
    question: { count: 0, issues: [] },
    unlabeled: { count: 0, issues: [] }
  };
  
  const labelCounts = {};
  
  for (const issue of issues) {
    const labels = issue.labels.map(l => l.name.toLowerCase());
    
    if (labels.length === 0) {
      categories.unlabeled.count++;
      categories.unlabeled.issues.push({ number: issue.number, title: issue.title });
    } else {
      for (const label of labels) {
        labelCounts[label] = (labelCounts[label] || 0) + 1;
        
        if (label.includes('bug') || label.includes('error') || label.includes('fix')) {
          categories.bug.count++;
          categories.bug.issues.push({ number: issue.number, title: issue.title });
        } else if (label.includes('feature') || label.includes('enhancement') || label.includes('improvement')) {
          categories.enhancement.count++;
          categories.enhancement.issues.push({ number: issue.number, title: issue.title });
        } else if (label.includes('question') || label.includes('help')) {
          categories.question.count++;
          categories.question.issues.push({ number: issue.number, title: issue.title });
        }
      }
    }
  }
  
  console.log('Issue Distribution (sample of 100):');
  console.log(`  🐛 Bugs: ${categories.bug.count}`);
  console.log(`  ✨ Enhancements: ${categories.enhancement.count}`);
  console.log(`  ❓ Questions: ${categories.question.count}`);
  console.log(`  🏷️ Unlabeled: ${categories.unlabeled.count}`);
  console.log('\nTop Labels:', Object.entries(labelCounts).slice(0, 10).map(([k, v]) => `${k}: ${v}`).join(', '));
  
  // Save report
  const report = {
    scanned: new Date().toISOString(),
    sampleSize: issues.length,
    categories,
    topLabels: labelCounts,
    recommendation: categories.unlabeled.count > 50 
      ? 'Consider adding labels to unlabeled issues for better triage'
      : 'Issue distribution looks healthy'
  };
  
  fs.writeFileSync(
    path.join(WORKSPACE, 'issue-analysis.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Report saved to issue-analysis.json');
  
} catch (e) {
  console.log('Running locally - gh auth needed for full issue analysis');
  console.log('Creating sample report instead...');
  
  fs.writeFileSync(
    path.join(WORKSPACE, 'issue-analysis.json'),
    JSON.stringify({ note: 'Run with gh auth for full analysis' }, null, 2)
  );
}
