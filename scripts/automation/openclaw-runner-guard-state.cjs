#!/usr/bin/env node
/**
 * Persists OpenClaw runner-guard streak + bounded history (paired with GHA cache).
 *
 * Reads exit telemetry from automation/reports/openclaw-runner-latest.json.
 *
 * Env:
 *   RUNNER_STATE_FILE — default automation/reports/openclaw-runner-guard-state.json
 *   RUNNER_HISTORY_FILE — default automation/reports/openclaw-runner-history.json
 *   HEALTHY_STREAK_TO_CLOSE — consecutive successful dry-runs before auto-close (default: 2)
 *   HISTORY_MAX — max history entries (default: 50)
 *   GITHUB_RUN_ID — optional, stored on each history row
 *
 * Writes GITHUB_OUTPUT when set:
 *   should_close=true|false
 *   reason_class=policy|artifact|runner|unknown
 *   reason_repeat_count=<n>
 *   severity_label=automation-slo-warning|automation-slo-critical
 */

const fs = require('fs');
const path = require('path');

const REPORTS = path.join(process.cwd(), 'automation', 'reports');
const statePath = process.env.RUNNER_STATE_FILE || path.join(REPORTS, 'openclaw-runner-guard-state.json');
const historyPath = process.env.RUNNER_HISTORY_FILE || path.join(REPORTS, 'openclaw-runner-history.json');
const streakRequired = Math.max(1, parseInt(process.env.HEALTHY_STREAK_TO_CLOSE || '2', 10) || 2);
const historyMax = Math.max(5, parseInt(process.env.HISTORY_MAX || '50', 10) || 50);
const runId = String(process.env.GITHUB_RUN_ID || '').trim();

function readJson(p, fallback) {
  try {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

function readRunnerReport() {
  const p = path.join(REPORTS, 'openclaw-runner-latest.json');
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return {
      exitCode: Number(j.exitCode ?? 0),
      reason: String(j.reason || 'unknown'),
    };
  } catch {
    return { exitCode: 1, reason: 'missing_or_invalid_openclaw-runner-latest.json' };
  }
}

function appendGithubOutput(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) return;
  fs.appendFileSync(out, `${key}=${value}\n`, 'utf8');
}

function classifyReason(reason) {
  const r = String(reason || '').toLowerCase();
  if (r.includes('policy') || r.includes('approved') || r.includes('stale handoff')) return 'policy';
  if (r.includes('missing') || r.includes('not found') || r.includes('artifact')) return 'artifact';
  if (r.includes('exec') || r.includes('runner')) return 'runner';
  return 'unknown';
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  const { exitCode, reason } = readRunnerReport();
  const ok = exitCode === 0;

  let state = readJson(statePath, { consecutiveHealthy: 0, lastExitCode: null, lastReason: null });
  let history = readJson(historyPath, { version: 1, entries: [] });

  const entry = {
    timestampIso: new Date().toISOString(),
    exitCode,
    reason,
    runId: runId || undefined,
  };
  history.entries = Array.isArray(history.entries) ? history.entries : [];
  history.entries.push(entry);
  if (history.entries.length > historyMax) {
    history.entries = history.entries.slice(-historyMax);
  }
  history.generatedAt = entry.timestampIso;

  let shouldClose = false;
  if (ok) {
    state.consecutiveHealthy = Number(state.consecutiveHealthy || 0) + 1;
    if (state.consecutiveHealthy >= streakRequired) {
      shouldClose = true;
      state.consecutiveHealthy = 0;
    }
  } else {
    state.consecutiveHealthy = 0;
  }
  state.lastExitCode = exitCode;
  state.lastReason = reason;
  state.lastUpdatedAt = entry.timestampIso;

  const reasonClass = classifyReason(reason);
  let reasonRepeatCount = 0;
  for (let i = history.entries.length - 1; i >= 0; i -= 1) {
    const it = history.entries[i];
    if (Number(it.exitCode || 0) === 0) {
      break;
    }
    const cls = classifyReason(it.reason);
    if (cls !== reasonClass) {
      break;
    }
    reasonRepeatCount += 1;
  }
  const severityLabel =
    exitCode === 0 ? 'automation-slo-warning' : reasonRepeatCount >= 3 ? 'automation-slo-critical' : 'automation-slo-warning';

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');

  appendGithubOutput('should_close', shouldClose ? 'true' : 'false');
  appendGithubOutput('runner_exit_code', String(exitCode));
  appendGithubOutput('reason_class', reasonClass);
  appendGithubOutput('reason_repeat_count', String(reasonRepeatCount));
  appendGithubOutput('severity_label', severityLabel);
  console.log(
    `[openclaw-runner-guard-state] ok=${ok} streak=${state.consecutiveHealthy} should_close=${shouldClose} reasonClass=${reasonClass} repeats=${reasonRepeatCount} severity=${severityLabel} wrote history=${history.entries.length}`,
  );
}

main();
