#!/usr/bin/env node

/**
 * AI Automation Self-Healing Agent
 *
 * Reads automation-audit-latest.json and applies fixable fixes automatically.
 * Resolves common issues: missing_log_dir, ensures automation/logs exists.
 * Integrates with automation audit workflow.
 *
 * Environment:
 *   DRY_RUN=1 - Log fixes only, don't apply
 *
 * Runs: After automation audit when issues found, or on-demand
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const LOGS_DIR = path.join(AUTOMATION_DIR, 'logs');
const REPORT_FILE = path.join(REPORTS_DIR, 'automation-audit-latest.json');
const HEAL_REPORT = path.join(REPORTS_DIR, 'automation-self-heal-latest.json');

const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutomationSelfHeal] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, LOGS_DIR].forEach((d) => {
    if (!fs.existsSync(d)) {
      if (DRY_RUN) {
        log(`[DRY] Would create ${d}`);
      } else {
        fs.mkdirSync(d, { recursive: true });
        log(`Created ${d}`);
      }
    }
  });
}

function fixMissingLogDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    if (DRY_RUN) {
      log('[DRY] Would create automation/logs/');
      return { fixed: true, dry: true };
    }
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    log('Fixed: created automation/logs/');
    return { fixed: true };
  }
  return { fixed: false };
}

function run() {
  log('=== Automation Self-Healing Started ===');

  if (!fs.existsSync(REPORT_FILE)) {
    log('No automation audit report found. Run automation:audit first.');
    const report = { timestamp: new Date().toISOString(), fixes: [], status: 'no_audit' };
    fs.writeFileSync(HEAL_REPORT, JSON.stringify(report, null, 2));
    return report;
  }

  const audit = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  const totalIssues = audit.summary?.totalIssues || 0;

  if (totalIssues === 0) {
    log('No issues to fix. Status: ok');
    const report = { timestamp: new Date().toISOString(), fixes: [], status: 'ok' };
    fs.writeFileSync(HEAL_REPORT, JSON.stringify(report, null, 2));
    return report;
  }

  const fixes = [];
  const issues = [
    ...(audit.audit?.agents?.issues || []),
    ...(audit.audit?.workflows?.issues || []),
    ...(audit.audit?.cron?.issues || []),
  ];

  for (const issue of issues) {
    if (issue.type === 'missing_log_dir') {
      const r = fixMissingLogDir();
      if (r.fixed) fixes.push({ issue: issue.type, action: 'created automation/logs/' });
    }
  }

  ensureDirs();

  const report = {
    timestamp: new Date().toISOString(),
    auditIssues: totalIssues,
    fixesApplied: fixes.length,
    fixes,
    status: fixes.length > 0 ? 'healed' : 'partial',
  };

  fs.writeFileSync(HEAL_REPORT, JSON.stringify(report, null, 2));
  log(`Report: ${HEAL_REPORT}`);
  log(`Fixes applied: ${fixes.length}`);

  return report;
}

run();
