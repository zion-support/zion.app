#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { AUTONOMY_AGENT_CONFIG } = require('./autonomy-agent-config.cjs');

const ROOT = process.cwd();
const cfg = AUTONOMY_AGENT_CONFIG.qualityDrift;
const STRICT_MODE = process.argv.includes('--strict');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'autonomous-quality-drift-latest.json');
const MD_REPORT = path.join(REPORT_DIR, 'autonomous-quality-drift-latest.md');
const HISTORY_FILE = path.join(REPORT_DIR, 'autonomous-quality-drift-history.json');

const checks = [
  { id: 'lint', command: ['npm', 'run', 'lint:check'] },
  { id: 'types', command: ['npm', 'run', 'type-check'] },
  { id: 'tests', command: ['npm', 'run', 'test:ci'] },
  { id: 'build', command: ['npm', 'run', 'build'] },
];

function runCheck(check) {
  const started = Date.now();
  const [cmd, ...args] = check.command;
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: cfg.commandTimeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
  const durationMs = Date.now() - started;
  const passed = result.status === 0;
  const output = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  const firstErrorLine = output.split('\n').find((line) => line.trim().length > 0) || '';
  return {
    id: check.id,
    passed,
    durationMs,
    exitCode: result.status,
    firstErrorLine: passed ? '' : firstErrorLine.slice(0, 240),
  };
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-cfg.historyWindow), null, 2));
}

function failureStreak(history, checkId) {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const run = history[i];
    const found = (run.checks || []).find((check) => check.id === checkId);
    if (!found || found.passed) break;
    streak += 1;
  }
  return streak;
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Autonomous Quality Drift Sentinel');
  lines.push('');
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Severity: \`${report.severity}\``);
  lines.push(`- Failed checks: \`${report.failedCount}\``);
  lines.push('');
  lines.push('| Check | Passed | Duration (ms) | Failure streak |');
  lines.push('|---|---|---:|---:|');
  for (const check of report.checks) {
    lines.push(`| ${check.id} | ${check.passed ? 'yes' : 'no'} | ${check.durationMs} | ${check.failureStreak} |`);
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const checksResult = checks.map(runCheck);
  const now = new Date().toISOString();
  const history = loadHistory();
  const augmentedRun = {
    generatedAt: now,
    checks: checksResult,
  };
  history.push(augmentedRun);
  saveHistory(history);

  const checksWithStreaks = checksResult.map((check) => ({
    ...check,
    failureStreak: check.passed ? 0 : failureStreak(history, check.id),
  }));
  const failedChecks = checksWithStreaks.filter((check) => !check.passed);
  const severeStreak = checksWithStreaks.some(
    (check) => !check.passed && check.failureStreak >= cfg.failureStreakAlertThreshold,
  );
  const severity =
    failedChecks.length >= cfg.strictFailureCountThreshold || severeStreak
      ? 'warning'
      : failedChecks.length > 0
        ? 'info'
        : 'ok';

  const report = {
    generatedAt: now,
    failedCount: failedChecks.length,
    severity,
    thresholds: {
      failureStreakAlertThreshold: cfg.failureStreakAlertThreshold,
      strictFailureCountThreshold: cfg.strictFailureCountThreshold,
    },
    checks: checksWithStreaks,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));
  fs.writeFileSync(MD_REPORT, toMarkdown(report));
  console.log(`Quality drift report written to ${JSON_REPORT}`);

  if (STRICT_MODE && failedChecks.length >= cfg.strictFailureCountThreshold) {
    process.exit(1);
  }
}

main();
