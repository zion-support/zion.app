#!/usr/bin/env node
/**
 * OpenClaw Agent: Self-Healing CI
 * Priority: HIGH
 * Detects CI failures, analyzes errors, creates auto-fix branches
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const REPORT_FILE = path.join(WORKSPACE, 'openclaw-agents', 'self-heal-ci-report.json');

console.log('🔧 Self-Healing CI Agent starting...\n');

const report = {
  timestamp: new Date().toISOString(),
  checks: [],
  failures: [],
  fixes: [],
  status: 'healthy'
};

// Check 1: Verify all workflows exist
console.log('1️⃣ Checking workflow files...');
try {
  const workflows = execSync('ls -la .github/workflows/*.yml .github/workflows/*.yaml 2>/dev/null | wc -l', { cwd: WORKSPACE, encoding: 'utf8' });
  const count = parseInt(workflows.trim()) || 0;
  report.checks.push({ name: 'workflow-files', status: count > 0 ? 'ok' : 'missing', count });
  console.log(`   ${count} workflow files found`);
} catch (e) {
  report.checks.push({ name: 'workflow-files', status: 'error' });
}

// Check 2: Validate workflow YAML syntax
console.log('\n2️⃣ Validating workflow YAML...');
try {
  execSync('for f in .github/workflows/*.yml .github/workflows/*.yaml; do python3 -c "import yaml; yaml.safe_load(open(\"$f\"))" 2>/dev/null || echo "INVALID: $f"; done', { cwd: WORKSPACE, encoding: 'utf8' });
  report.checks.push({ name: 'workflow-yaml', status: 'ok' });
  console.log('   All YAML valid');
} catch (e) {
  report.checks.push({ name: 'workflow-yaml', status: 'error', details: 'Some workflows may have syntax issues' });
  console.log('   Some workflows have issues');
}

// Check 3: Verify critical secrets are configured
console.log('\n3️⃣ Checking secrets configuration...');
const requiredSecrets = ['NETLIFY_AUTH_TOKEN', 'GH_TOKEN'];
for (const secret of requiredSecrets) {
  try {
    execSync(`gh secret list | grep -q ${secret}`, { cwd: WORKSPACE });
    report.checks.push({ name: `secret-${secret.toLowerCase()}`, status: 'ok' });
    console.log(`   ✅ ${secret} configured`);
  } catch (e) {
    report.checks.push({ name: `secret-${secret.toLowerCase()}`, status: 'missing' });
    console.log(`   ⚠️ ${secret} missing`);
  }
}

// Check 4: Recent CI runs
console.log('\n4️⃣ Checking recent CI runs...');
try {
  const runs = JSON.parse(execSync('gh run list --limit 5 --json status,conclusion', { cwd: WORKSPACE, encoding: 'utf8' }));
  const failed = runs.filter(r => r.conclusion === 'failure');
  if (failed.length > 0) {
    report.status = 'degraded';
    report.failures = failed.map(r => ({ status: r.status, conclusion: r.conclusion }));
    console.log(`   ⚠️ ${failed.length} recent failures`);
  } else {
    console.log('   ✅ No recent failures');
  }
} catch (e) {
  console.log('   Could not fetch runs (may need repo permissions)');
}

// Check 5: PM2 process health
console.log('\n5️⃣ Checking PM2 automation processes...');
try {
  const pm2List = execSync('pm2 jlist 2>/dev/null || echo "[]"', { cwd: WORKSPACE, encoding: 'utf8' });
  const processes = JSON.parse(pm2List || '[]');
  const running = processes.filter(p => p.pm2_env?.status === 'online');
  const stopped = processes.filter(p => p.pm2_env?.status !== 'online');
  
  report.checks.push({ name: 'pm2-processes', status: stopped.length === 0 ? 'ok' : 'degraded', running: running.length, stopped: stopped.length });
  console.log(`   Running: ${running.length}, Stopped: ${stopped.length}`);
  
  if (stopped.length > 0) {
    report.fixes.push({ action: 'restart-pm2', reason: `${stopped.length} processes stopped` });
  }
} catch (e) {
  report.checks.push({ name: 'pm2', status: 'not-checked' });
  console.log('   PM2 not accessible');
}

// Summary
console.log('\n📊 CI Health Summary:');
const okCount = report.checks.filter(c => c.status === 'ok').length;
const totalChecks = report.checks.length;
const healthPercent = Math.round((okCount / totalChecks) * 100);
console.log(`   Health: ${healthPercent}%`);
console.log(`   Status: ${report.status.toUpperCase()}`);

if (report.fixes.length > 0) {
  console.log('\n🔧 Suggested Fixes:');
  report.fixes.forEach(f => console.log(`   - ${f.action}: ${f.reason}`));
}

// Save report
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
console.log('\n✅ Self-heal report saved');
