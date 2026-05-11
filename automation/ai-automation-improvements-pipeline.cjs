#!/usr/bin/env node

/**
 * AI Automation Improvements Pipeline
 *
 * Orchestrates automation health checks and improvements in sequence.
 * Use before deploy or weekly to ensure automations are healthy.
 *
 * Pipeline:
 * 1. Automation audit (agents, workflows, cron)
 * 2. Site link audit (validate live site links)
 * 3. Report aggregator (refresh dashboard)
 *
 * Environment:
 *   CREATE_PAGES=1 - Create missing pages when site link audit finds broken links
 *   SKIP_REPORT=1 - Skip report aggregator step
 *   TRIGGER_FIXES=1 - Run UX auto-fix when app intelligence detects score < 85
 *
 * Runs: Weekly via workflow, or before deploy
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = process.cwd();
const CREATE_PAGES = process.env.CREATE_PAGES === '1';
const SKIP_REPORT = process.env.SKIP_REPORT === '1';
const TRIGGER_FIXES = process.env.TRIGGER_FIXES === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutomationImprovements] ${ts} | ${msg}`);
}

function run(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function main() {
  log('=== Automation Improvements Pipeline Started ===');

  const results = [];

  const r1 = run('node automation/ai-automation-audit-agent.cjs run', 'Automation Audit');
  results.push({ step: 'automation_audit', ok: r1.ok });

  const r1self = run('node automation/ai-automation-self-healing-agent.cjs run', 'Automation Self-Healing');
  results.push({ step: 'automation_self_heal', ok: r1self.ok });

  const r1a = run('node automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit');
  results.push({ step: 'live_site_ux', ok: r1a.ok });

  const r1aLayout = run('node automation/ai-layout-design-intelligence-agent.cjs', 'Layout & Design Intelligence');
  results.push({ step: 'layout_design_intel', ok: r1aLayout.ok });

  const r1b = run('node automation/ai-conversion-funnel-audit-agent.cjs', 'Conversion Funnel Audit');
  results.push({ step: 'conversion_funnel_audit', ok: r1b.ok });

  // CTA tracking: add data-cta-event to high-priority CTAs when many untracked
  const funnelPath = path.join(ROOT, 'automation', 'reports', 'conversion-funnel-audit-latest.json');
  let runCtaTracking = false;
  if (fs.existsSync(funnelPath)) {
    try {
      const funnel = JSON.parse(fs.readFileSync(funnelPath, 'utf8'));
      const untracked = funnel.untrackedCount ?? 0;
      if (untracked > 50) runCtaTracking = true;
    } catch (_) {}
  }
  if (runCtaTracking) {
    const r1b2 = run('MAX_FILES=15 node automation/ai-cta-tracking-implementation-agent.cjs', 'CTA Tracking Implementation');
    results.push({ step: 'cta_tracking', ok: r1b2.ok });
  }

  const r1c = run('node automation/ai-system-intelligence-audit-agent.cjs', 'System Intelligence Audit');
  results.push({ step: 'system_intelligence_audit', ok: r1c.ok });

  // Auto-enable TRIGGER_FIXES when UX score < 85 (run UX audit first to get score)
  const uxReportPath = path.join(ROOT, 'automation', 'reports', 'live-site-ux-audit-latest.json');
  let autoTriggerFixes = TRIGGER_FIXES;
  if (!autoTriggerFixes && fs.existsSync(uxReportPath)) {
    try {
      const uxReport = JSON.parse(fs.readFileSync(uxReportPath, 'utf8'));
      if ((uxReport.score ?? 100) < 85) autoTriggerFixes = true;
    } catch (_) {}
  }
  const appIntelEnv = autoTriggerFixes ? 'TRIGGER_FIXES=1 ' : '';
  const r1d = run(`${appIntelEnv}node automation/ai-app-intelligence-agent.cjs`, 'App Intelligence');
  results.push({ step: 'app_intelligence', ok: r1d.ok });

  const siteLinkCmd = CREATE_PAGES
    ? 'node automation/ai-site-link-audit-automation.cjs run --create-pages'
    : 'node automation/ai-site-link-audit-automation.cjs audit';
  const r2 = run(siteLinkCmd, 'Site Link Audit');
  results.push({ step: 'site_link_audit', ok: r2.ok });

  run('SKIP_SITE_LINKS=1 node automation/ai-content-health-agent.cjs', 'Content Health');
  results.push({ step: 'content_health', ok: true });

  if (!SKIP_REPORT) {
    const r3 = run('node automation/ai-report-aggregator-agent.cjs', 'Report Aggregator');
    results.push({ step: 'report_aggregator', ok: r3.ok });
  }

  const report = {
    timestamp: new Date().toISOString(),
    pipeline: results,
    summary: {
      totalSteps: results.length,
      successCount: results.filter((r) => r.ok).length,
      failedSteps: results.filter((r) => !r.ok).map((r) => r.step),
    },
  };

  const reportPath = path.join(ROOT, 'automation', 'reports', 'automation-improvements-pipeline-latest.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report: ${reportPath}`);

  log('=== Automation Improvements Pipeline Finished ===');

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
}

main();
