#!/usr/bin/env node

/**
 * AI Cron Health Monitor Agent
 *
 * Verifies that cron jobs have run recently by checking log file mtimes.
 * Reports stale jobs that may have missed their scheduled run.
 *
 * Features:
 * - Maps cron jobs to their log files
 * - Checks mtime against expected frequency (daily, hourly, etc.)
 * - Generates report with stale jobs
 * - Integrates with report aggregator
 *
 * Runs: Daily 8 AM via cron (after daily pipeline)
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOGS_DIR = path.join(ROOT, 'automation', 'logs');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'cron-health-latest.json');

// Map log filename (without path) to expected max age in hours
const CRON_LOG_EXPECTATIONS = {
  'daily-pipeline-cron.log': 25,
  'health-cron.log': 1,
  'site-health-cron.log': 1,
  'content-organizer-cron.log': 2,
  'seo-cron.log': 3,
  'broken-links-cron.log': 25,
  'report-cleanup-cron.log': 25,
  'deps-security-cron.log': 168, // weekly
  'content-freshness-cron.log': 168, // weekly
  'test-coverage-cron.log': 168, // weekly
  'metadata-check-cron.log': 168, // weekly
  'seo-content-refresh-cron.log': 168, // weekly
  'deps-outdated-cron.log': 168, // weekly
  'deadcode-cron.log': 168, // weekly
  'bundle-monitor-cron.log': 168, // weekly
  'lighthouse-production-cron.log': 168, // weekly
  'layout-design-audit-cron.log': 168, // weekly
  'layout-design-automation-cron.log': 168, // weekly Fri
  'lead-discovery-cron.log': 25,
  'email-interaction-cron.log': 3,
  'feature-promotion-cron.log': 25,
  'code-hygiene-cron.log': 25,
  'cron-health-cron.log': 25,
  'documentation-sync-cron.log': 168, // weekly
  'changelog-generator-cron.log': 168, // weekly
  'memory-consolidation-cron.log': 168, // weekly
  'vuln-alert-cron.log': 168, // weekly
  'app-audit-cron.log': 168, // weekly
  'app-evolution-cron.log': 168, // weekly
  'github-actions-audit-cron.log': 168, // weekly
  'automation-audit-cron.log': 168, // weekly
  'app-improvement-cron.log': 168, // weekly Monday
  'automation-improvements-cron.log': 168, // weekly Wed
  'local-llm-automation-cron.log': 168, // weekly Wed
  'local-llm-specialists-cron.log': 168, // weekly Thu
  'content-maximum-cron.log': 48, // daily
  'content-fast-cron.log': 168, // Tue/Thu
  'ideas-implementation-cron.log': 48, // daily 4 PM
  'ultra-fast-content-cron.log': 48, // 6x daily
  'content-burst-cron.log': 48, // 6x daily template-only
  'content-ideas-deploy-cron.log': 12, // 3x daily (9/14/19 UTC)
  'front-page-services-advertiser-cron.log': 168, // weekly Fri
  'navigation-audit-cron.log': 25, // daily
  'navigation-pages-audit-cron.log': 168, // weekly Thu
  'app-evolution-audit-cron.log': 168, // weekly Sat
  'app-improvement-evolution-cron.log': 96, // Tue + Fri 7 AM
  'sitemap-cron.log': 13,
  'git-cron.log': 7,
  'build-cron.log': 5,
  'security-cron.log': 7,
  'performance-cron.log': 7,
  'seo-meta-cron.log': 7,
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[CronHealth] ${ts} | ${msg}`);
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  if (!fs.existsSync(LOGS_DIR)) {
    const report = { timestamp: new Date().toISOString(), jobs: [], staleCount: 0, status: 'no_logs' };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    log('No automation/logs directory found.');
    return report;
  }

  log('=== Cron Health Monitor Started ===');
  const now = Date.now();
  const jobs = [];
  let staleCount = 0;

  for (const [logFile, maxAgeHours] of Object.entries(CRON_LOG_EXPECTATIONS)) {
    const logPath = path.join(LOGS_DIR, logFile);
    const job = {
      name: logFile.replace('-cron.log', ''),
      logFile,
      maxAgeHours,
      exists: fs.existsSync(logPath),
      lastModified: null,
      ageHours: null,
      stale: false,
    };

    if (job.exists) {
      const stat = fs.statSync(logPath);
      job.lastModified = stat.mtime.toISOString();
      job.ageHours = (now - stat.mtimeMs) / (1000 * 60 * 60);
      job.stale = job.ageHours > maxAgeHours;
      if (job.stale) staleCount++;
    } else {
      job.stale = true;
      staleCount++;
    }
    jobs.push(job);
  }

  const report = {
    timestamp: new Date().toISOString(),
    jobs,
    staleCount,
    totalChecked: jobs.length,
    status: staleCount === 0 ? 'ok' : staleCount <= 3 ? 'warning' : 'critical',
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Checked ${jobs.length} cron logs. Stale: ${staleCount}`);
  log(`Report: ${REPORT_FILE}`);
  log('=== Cron Health Monitor Finished ===');
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log(JSON.stringify({ status: 'no_report', message: 'Run cron:health first' }, null, 2));
  } else {
    const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    const stale = (r.jobs || []).filter((j) => j.stale);
    console.log(JSON.stringify({ status: r.status, staleCount: r.staleCount, stale: stale.map((j) => j.name) }, null, 2));
  }
} else {
  console.log('Usage: node ai-cron-health-monitor-agent.cjs [run|summary]');
  process.exit(1);
}
