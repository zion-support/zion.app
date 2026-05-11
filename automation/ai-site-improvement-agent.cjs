#!/usr/bin/env node

/**
 * AI Site Improvement Agent
 *
 * Lightweight periodic agent that:
 * - Optionally pulls latest main
 * - Runs quality gates before and after suggested fixes
 * - Runs daily quick improvement pipeline (fast, no heavy LLM)
 * - Runs app:audit and app:audit-apply with summaries for traceable low-risk tweaks
 * - Writes a summary report to automation/reports/site-improvement-agent-latest.json
 *
 * Intended to be called from GitHub Actions on a daily or weekly schedule.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { recordAutomationEvent } = require('./lib/automation-brain-types.cjs');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const CONFIG_FILE = path.join(AUTOMATION_DIR, 'site-improv.config.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'site-improvement-agent-latest.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SiteImprov] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function loadConfig() {
  const defaults = {
    mode: 'daily-quick',
    scope: 'core',
    pullLatestMain: false,
    runQualityGates: true,
    qualityGatesCommand: 'npm run lint:check && npm run type-check',
    runBuildCheck: false,
    runAppAudit: true,
    runAppAuditApply: true,
    runAppAuditSummary: true,
    runAppAuditApplySummary: true,
    maxAuditRunsPerWeek: 7,
    pagesScope: 'core+extended',
    allowLowRiskAutoApply: true,
  };

  if (!fs.existsSync(CONFIG_FILE)) {
    return defaults;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    log(`Failed to load config, using defaults: ${e.message}`);
    return defaults;
  }
}

function runCommand(cmd, label) {
  log(`Running: ${label}`);
  const start = Date.now();
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    log(`${label} completed in ${elapsed}s`);
    return { ok: true };
  } catch (e) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    log(`${label} failed after ${elapsed}s: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function pullLatestMain() {
  return runCommand('git pull --rebase origin main', 'Git pull --rebase origin main');
}

function runDailyQuickPipeline() {
  return runCommand('npm run app:improvement-daily-quick', 'app:improvement-daily-quick');
}

function runQualityGates(config) {
  if (!config.runQualityGates) return { ok: true, skipped: true };
  return runCommand(config.qualityGatesCommand || 'npm run lint:check && npm run type-check', 'quality gates');
}

function runBuildCheck(config) {
  if (!config.runBuildCheck) return { ok: true, skipped: true };
  return runCommand('npm run build', 'build');
}

function runAppAuditAndApply(config) {
  const results = [];

  if (config.runAppAudit) {
    results.push({
      step: 'app:audit',
      ...runCommand('npm run app:audit', 'app:audit'),
    });
    if (config.runAppAuditSummary) {
      results.push({
        step: 'app:audit-summary',
        ...runCommand('npm run app:audit-summary', 'app:audit-summary'),
      });
    }
  }

  if (config.runAppAuditApply && config.allowLowRiskAutoApply) {
    results.push({
      step: 'app:audit-apply',
      ...runCommand('npm run app:audit-apply', 'app:audit-apply'),
    });
    if (config.runAppAuditApplySummary) {
      results.push({
        step: 'app:audit-apply-summary',
        ...runCommand('npm run app:audit-apply-summary', 'app:audit-apply-summary'),
      });
    }
  }

  return results;
}

function writeReport(payload) {
  try {
    fs.writeFileSync(REPORT_FILE, JSON.stringify(payload, null, 2));
    log(`Report written to ${REPORT_FILE}`);
  } catch (e) {
    log(`Failed to write report: ${e.message}`);
  }
}

async function main() {
  ensureDirs();
  const startedAt = new Date().toISOString();
  const config = loadConfig();

  const steps = [];

  if (config.pullLatestMain) {
    const pullResult = pullLatestMain();
    steps.push({ step: 'git-pull', ok: pullResult.ok, error: pullResult.error });
  } else {
    steps.push({ step: 'git-pull', ok: true, skipped: true });
  }

  const qualityBefore = runQualityGates(config);
  steps.push({
    step: 'quality-gates-before',
    ok: qualityBefore.ok,
    skipped: qualityBefore.skipped,
    error: qualityBefore.error,
  });

  const dailyQuickResult = runDailyQuickPipeline();
  steps.push({
    step: 'app-improvement-daily-quick',
    ok: dailyQuickResult.ok,
    error: dailyQuickResult.error,
  });

  const auditResults = runAppAuditAndApply(config);
  steps.push(...auditResults);

  const qualityAfter = runQualityGates(config);
  steps.push({
    step: 'quality-gates-after',
    ok: qualityAfter.ok,
    skipped: qualityAfter.skipped,
    error: qualityAfter.error,
  });

  const buildResult = runBuildCheck(config);
  steps.push({
    step: 'build-check',
    ok: buildResult.ok,
    skipped: buildResult.skipped,
    error: buildResult.error,
  });

  const finishedAt = new Date().toISOString();

  const summary = {
    startedAt,
    finishedAt,
    configSnapshot: config,
    steps,
    ok: steps.every((s) => s.ok),
  };

  writeReport(summary);

  // Emit an AutomationEvent for the site improvement summary
  recordAutomationEvent({
    id: `site-improvement-${startedAt}`,
    timestamp: finishedAt,
    agent: 'ai-site-improvement-agent',
    category: 'site_improvement',
    decision: summary.ok ? 'auto_applied' : 'needs_review',
    summary: summary.ok
      ? 'Ran daily site improvement pipeline (including optional app audit/apply).'
      : 'Site improvement pipeline encountered failures; check latest report.',
    meta: {
      steps,
      configSnapshot: summary.configSnapshot,
    },
  });

  if (!summary.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((e) => {
    log(`Fatal error: ${e.message}`);
    process.exit(1);
  });
}

module.exports = { main };

