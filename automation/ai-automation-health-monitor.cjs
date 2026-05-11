#!/usr/bin/env node

/**
 * Automation Health Monitor
 *
 * Performs lightweight health checks on the automation ecosystem:
 *  - Verifies each automation script file exists
 *  - Checks report directory size and file count
 *  - Checks log directory for oversized log files
 *  - Validates that the ecosystem config is parseable
 *  - Reports overall health score
 *
 * Environment variables:
 *   CHECK_INTERVAL_MINUTES — re-run interval when in continuous mode (default 30)
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const LOGS_DIR = path.join(AUTOMATION_DIR, 'logs');

const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL_MINUTES || '30', 10) * 60 * 1000;

const EXPECTED_SCRIPTS = [
  'ai-build-fixer-agent.cjs',
  'ai-continuous-improvement-agent.cjs',
  'ai-seo-monitor-optimizer.cjs',
  'ai-content-organizer-agent.cjs',
  'ai-broken-link-fixer.cjs',
  'ai-performance-optimizer.cjs',
  'ai-app-improvement-specialist.cjs',
  'ai-bundle-optimizer.cjs',
  'ai-image-optimizer.cjs',
  'ai-route-optimizer.cjs',
  'ai-security-scanner-agent.cjs',
  'ai-test-automation-agent.cjs',
  'ai-complexity-analyzer.cjs',
  'ai-documentation-generator-agent.cjs',
  'ai-report-cleanup.cjs',
  'ai-automation-health-monitor.cjs',
  'ai-smart-dependency-manager.cjs',
  'ai-git-workflow-agent.cjs',
  'ai-social-media-automation.cjs',
  'ai-site-health-monitor.cjs',
  'ai-seo-meta-auditor.cjs',
  'ai-sitemap-validator.cjs',
  'ai-contact-form-handler.cjs',
  'ai-content-generator-automation.cjs',
  'frontend-content-advertiser.cjs',
  'ai-ecosystem-intelligence-agent.cjs',
  'ai-content-freshness-agent.cjs',
  'ai-telegram-notification-agent.cjs',
  'ai-report-aggregator-agent.cjs',
  'ai-test-coverage-improvement-agent.cjs',
  'ai-suggestion-importer-agent.cjs',
  'ai-daily-automation-pipeline.cjs',
  'ai-dependency-outdated-agent.cjs',
  'ai-bundle-size-monitor-agent.cjs',
  'ai-dead-code-detector-agent.cjs',
  'ai-ci-failure-recovery-agent.cjs',
  'ai-seo-content-refresh-agent.cjs',
  'ai-python-agents-orchestrator.cjs',
  'ai-auto-implementation-agent.cjs',
  'ai-code-hygiene-agent.cjs',
  'ai-cron-health-monitor-agent.cjs',
];

const MAX_REPORT_COUNT = 500;
const MAX_REPORT_DIR_MB = 100;
const MAX_LOG_FILE_MB = 50;

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[HealthMonitor] ${ts} | ${msg}`);
}

function dirSizeMB(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let total = 0;
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fp = path.join(dirPath, entry);
    try {
      const stat = fs.statSync(fp);
      if (stat.isFile()) total += stat.size;
    } catch { /* skip */ }
  }
  return total / (1024 * 1024);
}

function runCheck() {
  const issues = [];
  let score = 100;

  log('=== Health Check Started ===');

  for (const script of EXPECTED_SCRIPTS) {
    const fp = path.join(AUTOMATION_DIR, script);
    if (!fs.existsSync(fp)) {
      issues.push(`Missing script: ${script}`);
      score -= 3;
    }
  }

  if (fs.existsSync(REPORTS_DIR)) {
    const reportFiles = fs.readdirSync(REPORTS_DIR);
    const reportCount = reportFiles.length;
    const reportSizeMB = dirSizeMB(REPORTS_DIR);

    if (reportCount > MAX_REPORT_COUNT) {
      issues.push(`Report directory has ${reportCount} files (max ${MAX_REPORT_COUNT}). Run cleanup.`);
      score -= 10;
    }
    if (reportSizeMB > MAX_REPORT_DIR_MB) {
      issues.push(`Report directory is ${reportSizeMB.toFixed(1)} MB (max ${MAX_REPORT_DIR_MB} MB).`);
      score -= 10;
    }
    log(`Reports: ${reportCount} files, ${reportSizeMB.toFixed(1)} MB`);
  }

  if (fs.existsSync(LOGS_DIR)) {
    const logFiles = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.log'));
    let oversizedLogs = 0;
    for (const lf of logFiles) {
      try {
        const stat = fs.statSync(path.join(LOGS_DIR, lf));
        if (stat.size > MAX_LOG_FILE_MB * 1024 * 1024) {
          oversizedLogs++;
          issues.push(`Oversized log: ${lf} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
        }
      } catch { /* skip */ }
    }
    if (oversizedLogs > 0) score -= oversizedLogs * 5;
    log(`Logs: ${logFiles.length} files, ${oversizedLogs} oversized`);
  }

  try {
    const ecoPath = path.join(ROOT, 'ecosystem.config.cjs');
    if (fs.existsSync(ecoPath)) {
      delete require.cache[require.resolve(ecoPath)];
      const eco = require(ecoPath);
      if (!eco.apps || !Array.isArray(eco.apps)) {
        issues.push('ecosystem.config.cjs: apps is not an array');
        score -= 10;
      } else {
        log(`Ecosystem: ${eco.apps.length} apps configured`);
        const dangerousApps = eco.apps.filter(a => a.max_restarts >= 99999);
        if (dangerousApps.length > 0) {
          issues.push(`${dangerousApps.length} app(s) with unlimited restarts (max_restarts >= 99999)`);
          score -= dangerousApps.length * 2;
        }
      }
    } else {
      issues.push('ecosystem.config.cjs not found');
      score -= 5;
    }
  } catch (err) {
    issues.push(`ecosystem.config.cjs parse error: ${err.message}`);
    score -= 15;
  }

  const cronPath = path.join(AUTOMATION_DIR, 'cron', 'automation.cron');
  if (fs.existsSync(cronPath)) {
    const cron = fs.readFileSync(cronPath, 'utf-8');
    if (cron.includes('/Users/')) {
      issues.push('Cron file contains hardcoded /Users/ path');
      score -= 10;
    }
  }

  score = Math.max(0, Math.min(100, score));

  log(`=== Health Check Complete ===`);
  log(`Score: ${score}/100`);
  if (issues.length > 0) {
    log(`Issues (${issues.length}):`);
    issues.forEach((issue, i) => log(`  ${i + 1}. ${issue}`));
  } else {
    log('No issues found.');
  }

  const report = {
    timestamp: new Date().toISOString(),
    score,
    issueCount: issues.length,
    issues,
  };

  try {
    if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(REPORTS_DIR, 'health-monitor-latest.json'),
      JSON.stringify(report, null, 2)
    );
  } catch (err) {
    log(`Failed to write health report: ${err.message}`);
  }

  return report;
}

const report = runCheck();

if (report.score < 70) {
  log('WARNING: Health score below 70. Immediate attention recommended.');
}
