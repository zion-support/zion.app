#!/usr/bin/env node
/**
 * OpenClaw Agent: Code Review Agent
 * Reviews code changes and provides feedback
 * Priority: HIGH
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const REPORT_FILE = path.join(WORKSPACE, 'openclaw-agents', 'reports', 'code-review-report.json');

console.log('🔍 Code Review Agent starting...\n');

const report = {
  timestamp: new Date().toISOString(),
  agent: 'code-review',
  reviews: [],
  issues: [],
  suggestions: []
};

async function main() {
  // Get recent commits
  console.log('1️⃣ Analyzing recent commits...');
  try {
    const commits = execSync('git log --oneline -10', { cwd: WORKSPACE, encoding: 'utf8' });
    const commitList = commits.trim().split('\n');
    console.log(`   Found ${commitList.length} recent commits`);
    report.commits = commitList;
  } catch (e) {
    console.log('   Could not get commits');
  }

  // Check for TypeScript errors
  console.log('\n2️⃣ Running TypeScript check...');
  try {
    execSync('npx tsc --noEmit', { cwd: WORKSPACE, encoding: 'utf8', timeout: 120000 });
    report.typescript = { status: 'pass', errors: 0 };
    console.log('   ✅ No TypeScript errors');
  } catch (e) {
    const output = e.stdout || e.stderr || '';
    const errors = (output.match(/error TS/g) || []).length;
    report.typescript = { status: 'fail', errors };
    console.log(`   ❌ ${errors} TypeScript errors found`);
  }

  // Check for ESLint issues
  console.log('\n3️⃣ Running ESLint...');
  try {
    execSync('npx eslint app --max-warnings 0 --quiet', { cwd: WORKSPACE, encoding: 'utf8', timeout: 60000 });
    report.eslint = { status: 'pass', warnings: 0 };
    console.log('   ✅ No ESLint issues');
  } catch (e) {
    const output = e.stdout || e.stderr || '';
    const warnings = (output.match(/warning/g) || []).length;
    const errors = (output.match(/error/g) || []).length;
    report.eslint = { status: 'errors', warnings, errors };
    console.log(`   ⚠️ ${errors} errors, ${warnings} warnings`);
  }

  // Check for security issues
  console.log('\n4️⃣ Checking for security issues...');
  const securityChecks = [
    { pattern: /process\.env\./, name: 'Environment variables' },
    { pattern: /api[_-]?key|secret|password/i, name: 'Potential secrets' },
    { pattern: /eval\(|innerHTML/, name: 'XSS vulnerabilities' }
  ];

  for (const check of securityChecks) {
    try {
      const results = execSync(`grep -r '${check.pattern.source}' app/ --include="*.ts" --include="*.tsx" | head -5`, { cwd: WORKSPACE, encoding: 'utf8' });
      if (results.trim()) {
        report.suggestions.push({ type: 'security', severity: 'high', message: check.name });
      }
    } catch (e) {
      // No matches is good
    }
  }
  console.log('   ✅ Security scan complete');

  // Calculate score
  const score = report.typescript.status === 'pass' ? 100 : 
                report.typescript.errors < 10 ? 70 : 40;
  report.score = score;

  console.log(`\n📊 Code Review Score: ${score}/100`);

  // Save report
  const reportDir = path.dirname(REPORT_FILE);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log('\n✅ Code review complete');
}

main().catch(console.error);
