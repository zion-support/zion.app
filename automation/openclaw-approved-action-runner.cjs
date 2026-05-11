#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Runs approved OpenClaw queue commands only after handoff/policy cross-check.
 *
 * Default: dry-run (prints planned commands, exits 0).
 * OPENCLAW_RUNNER_EXECUTE=1 — actually run (still requires allowlisted npm run form unless OPENCLAW_RUNNER_ALLOW_SHELL=1).
 * OPENCLAW_RUNNER_RESPECT_HOLD=1 — skip non-ultra-safe commands when deploy gate is hold_deploy.
 * OPENCLAW_RUNNER_MAX — max items (default 3).
 * OPENCLAW_RUNNER_FIXTURE_DIR — absolute path to a directory containing report JSONs (same filenames as automation/reports/) for tests.
 *
 * Writes automation/reports/openclaw-runner-latest.json (telemetry) on every exit.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const DEFAULT_REPORTS = path.join(ROOT, 'automation', 'reports');
const REPORTS = process.env.OPENCLAW_RUNNER_FIXTURE_DIR
  ? path.resolve(process.env.OPENCLAW_RUNNER_FIXTURE_DIR)
  : DEFAULT_REPORTS;
const HANDOFF = path.join(REPORTS, 'openclaw-autonomy-handoff-latest.json');
const APPROVED = path.join(REPORTS, 'openclaw-action-approved-queue-latest.json');
const POLICY = path.join(REPORTS, 'openclaw-action-policy-latest.json');
const TELEMETRY = path.join(REPORTS, 'openclaw-runner-latest.json');

const ULTRA_SAFE = /npm run (lint:check|type-check|test:ci|build:lock:check|build:lock:heal)\b/;

function readJson(p, fb = null) {
  try {
    if (!fs.existsSync(p)) return fb;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function parseNpmRun(cmd) {
  const t = String(cmd || '').trim();
  const m = /^npm run ([\w:@./-]+)\s*$/i.exec(t);
  return m ? ['run', m[1]] : null;
}

function writeTelemetry(payload) {
  try {
    if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(TELEMETRY, JSON.stringify(payload, null, 2));
  } catch (e) {
    console.error('openclaw runner: telemetry write failed:', e.message);
  }
}

function finish(exitCode, base) {
  const payload = {
    generatedAt: new Date().toISOString(),
    ...base,
    exitCode,
    reportsDir: REPORTS,
    executeMode: process.env.OPENCLAW_RUNNER_EXECUTE === '1',
    respectHold: process.env.OPENCLAW_RUNNER_RESPECT_HOLD === '1',
    fixtureMode: Boolean(process.env.OPENCLAW_RUNNER_FIXTURE_DIR),
  };
  writeTelemetry(payload);
  process.exit(exitCode);
}

function run() {
  const execute = process.env.OPENCLAW_RUNNER_EXECUTE === '1';
  const respectHold = process.env.OPENCLAW_RUNNER_RESPECT_HOLD === '1';
  const allowShell = process.env.OPENCLAW_RUNNER_ALLOW_SHELL === '1';
  const max = Math.max(0, Number.parseInt(process.env.OPENCLAW_RUNNER_MAX || '3', 10));

  const quiet =
    String(process.env.OPENCLAW_RUNNER_QUIET || '').trim() === '1' ||
    Boolean(process.env.OPENCLAW_RUNNER_FIXTURE_DIR) ||
    String(process.env.NODE_ENV || '').trim() === 'test';
  const log = (...args) => {
    if (!quiet) console.log(...args);
  };
  const error = (...args) => {
    if (!quiet) console.error(...args);
  };

  const handoff = readJson(HANDOFF, null);
  const approvedData = readJson(APPROVED, { queue: [] });
  const policy = readJson(POLICY, null);

  const queue = Array.isArray(approvedData.queue) ? approvedData.queue : [];
  const approvedIds = new Set(Array.isArray(policy?.approvedIds) ? policy.approvedIds : []);
  const denied = Array.isArray(policy?.denied) ? policy.denied : [];
  const deniedIds = new Set(denied.map((d) => d.id).filter(Boolean));

  const holdFromHandoff = handoff?.deployGate?.decision === 'hold_deploy';

  const base = {
    reason: null,
    itemsConsidered: queue.length,
    dryRunPlanned: [],
    executed: [],
    skippedHold: [],
    refused: null,
  };

  if (queue.length === 0) {
    base.reason = 'empty_queue';
    log('openclaw runner: no approved queue items.');
    return finish(0, base);
  }

  if (!policy || approvedIds.size === 0) {
    base.reason = 'missing_or_empty_policy';
    base.refused = 'policy snapshot missing or approvedIds empty';
    error('openclaw runner: missing or empty policy snapshot; refusing to run.');
    return finish(1, base);
  }

  let ran = 0;
  for (const item of queue) {
    if (ran >= max) break;
    const id = item.id;
    const cmd = String(item.recommendedCommand || '').trim();
    if (!id || !cmd) continue;

    if (deniedIds.has(id)) {
      base.reason = 'id_in_denied';
      base.refused = { id, detail: 'appears in policy.denied' };
      error(`openclaw runner: refuse — id ${id} appears in policy.denied.`);
      return finish(1, base);
    }
    if (!approvedIds.has(id)) {
      base.reason = 'id_not_in_approvedIds';
      base.refused = { id, detail: 'not in policy.approvedIds (stale handoff?)' };
      error(`openclaw runner: refuse — id ${id} not in policy.approvedIds (stale handoff?).`);
      return finish(1, base);
    }

    if (respectHold && holdFromHandoff && !ULTRA_SAFE.test(cmd)) {
      base.skippedHold.push({ id, command: cmd });
      log(`openclaw runner: skip (deploy hold): ${id} ${cmd}`);
      continue;
    }

    const npmArgs = parseNpmRun(cmd);
    if (!npmArgs && !allowShell) {
      base.reason = 'command_not_npm_run';
      base.refused = { id, command: cmd };
      error(`openclaw runner: refuse — command not strict "npm run <script>" form: ${cmd}`);
      return finish(1, base);
    }

    log(`${execute ? 'EXEC' : 'DRY'} ${id}: ${cmd}`);
    if (!execute) {
      base.dryRunPlanned.push({ id, command: cmd });
      ran += 1;
      continue;
    }

    const res = npmArgs
      ? spawnSync('npm', npmArgs, { cwd: ROOT, stdio: 'inherit', shell: false, env: process.env })
      : spawnSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true, env: process.env });
    if (res.status !== 0) {
      base.reason = 'command_failed';
      base.refused = { id, command: cmd, status: res.status };
      error(`openclaw runner: command failed with status ${res.status}`);
      return finish(res.status || 1, base);
    }
    base.executed.push({ id, command: cmd });
    ran += 1;
  }

  if (!execute) {
    base.reason = 'dry_run_complete';
    log('openclaw runner: dry-run complete. Set OPENCLAW_RUNNER_EXECUTE=1 to run.');
  } else {
    base.reason = 'executed_ok';
  }
  return finish(0, base);
}

function main() {
  try {
    run();
  } catch (e) {
    finish(1, { reason: 'exception', error: String(e?.message || e) });
  }
}

main();
