#!/usr/bin/env node

/**
 * AI Automation Deployment Readiness Agent
 *
 * Runs pre-deploy checks: automation audit, UX audit, site link audit.
 * Returns pass/fail for deploy gate. Use before triggering Netlify deploy.
 *
 * Exit 0 = ready to deploy
 * Exit 1 = not ready (one or more checks failed)
 *
 * Output: automation/reports/deployment-readiness-latest.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'deployment-readiness-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DeployReadiness] ${ts} | ${msg}`);
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  log('Running pre-deploy checks...');

  const automationAudit = run('node automation/ai-automation-audit-agent.cjs run');
  const uxAudit = run('node automation/ai-live-site-ux-audit-agent.cjs');
  const siteLinkAudit = run('node automation/ai-site-link-audit-automation.cjs audit');

  const checks = [
    { name: 'automation_audit', ok: automationAudit.ok },
    { name: 'ux_audit', ok: uxAudit.ok },
    { name: 'site_link_audit', ok: siteLinkAudit.ok },
  ];

  const allPass = checks.every((c) => c.ok);
  const failed = checks.filter((c) => !c.ok).map((c) => c.name);

  let uxScore = null;
  let automationIssues = 0;
  let brokenLinks = 0;

  try {
    const uxReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json'), 'utf8'));
    uxScore = uxReport.score ?? null;
  } catch (_) {}

  try {
    const autoReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'automation-audit-latest.json'), 'utf8'));
    automationIssues = autoReport.summary?.totalIssues ?? 0;
  } catch (_) {}

  try {
    const linkReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'site-link-audit-latest.json'), 'utf8'));
    brokenLinks = linkReport.broken ?? linkReport.brokenLinks ?? 0;
  } catch (_) {}

  const report = {
    timestamp: new Date().toISOString(),
    ready: allPass && automationIssues === 0 && brokenLinks === 0,
    checks,
    failedChecks: failed,
    details: {
      uxScore,
      automationIssues,
      brokenLinks,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Ready: ${report.ready} | UX: ${uxScore ?? 'N/A'}/100 | Automation issues: ${automationIssues} | Broken links: ${brokenLinks}`);

  process.exit(report.ready ? 0 : 1);
}

main();
