#!/usr/bin/env node
/**
 * Autonomous Runtime Fix-Agent Executor
 * - Reads queued runtime fix tasks.
 * - Runs only allowlisted commands.
 * - Dry-run by default; set AUTONOMOUS_RUNTIME_FIX_APPLY=true to execute.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const QUEUE_PATH = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-queue.json');
const OUT_PATH = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-execution-latest.json');

const APPLY = ['1', 'true', 'yes', 'on'].includes(
  String(process.env.AUTONOMOUS_RUNTIME_FIX_APPLY || '').toLowerCase(),
);
const MAX_ACTIONS = Math.max(1, Number(process.env.AUTONOMOUS_RUNTIME_FIX_MAX_ACTIONS || 3));

const ALLOWLIST = new Set([
  'npm run validate:pm2-singleton-ecosystem',
  'npm run git:hooks:install',
  'npm run type-check',
]);

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function execShell(cmd) {
  const r = spawnSync('bash', ['-lc', cmd], { encoding: 'utf8', cwd: ROOT, env: process.env });
  return {
    ok: r.status === 0,
    exitCode: r.status == null ? 1 : r.status,
    stdout: (r.stdout || '').trim().slice(0, 1500),
    stderr: (r.stderr || '').trim().slice(0, 1500),
  };
}

function main() {
  const queue = readJson(QUEUE_PATH, { items: [] });
  const items = Array.isArray(queue.items) ? queue.items : [];
  const queued = items.filter((i) => i.status === 'queued').slice(0, MAX_ACTIONS);

  const actions = queued.map((item) => {
    const cmd = String(item.suggestedCommand || '');
    const allowed = ALLOWLIST.has(cmd);
    if (!allowed) {
      return {
        id: item.id,
        status: 'skipped_not_allowlisted',
        command: cmd,
        reason: 'command not in allowlist',
      };
    }
    if (!APPLY) {
      return {
        id: item.id,
        status: 'dry_run',
        command: cmd,
      };
    }
    const run = execShell(cmd);
    return {
      id: item.id,
      status: run.ok ? 'executed_ok' : 'executed_failed',
      command: cmd,
      exitCode: run.exitCode,
      stdout: run.stdout,
      stderr: run.stderr,
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? 'apply' : 'dry-run',
    maxActions: MAX_ACTIONS,
    queuedCount: queued.length,
    executedCount: actions.filter((a) => a.status.startsWith('executed_')).length,
    actions,
  };
  writeJson(OUT_PATH, payload);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_fix_executed=${String(payload.executedCount)}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_fix_mode=${payload.mode}\n`,
      'utf8',
    );
  }
  console.log(
    `autonomous-runtime-fix-agent-executor: mode=${payload.mode} queued=${payload.queuedCount} executed=${payload.executedCount}`,
  );
}

main();
