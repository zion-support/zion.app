#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Opens a "merge freeze" commit window (pauses OpenClaw writer PM2 apps), runs an optional command, then closes the window.
 * Usage:
 *   node automation/openclaw-merge-freeze-orchestrator.cjs prepare
 *   node automation/openclaw-merge-freeze-orchestrator.cjs finalize
 *   node automation/openclaw-merge-freeze-orchestrator.cjs run -- npm run lint:check
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-merge-freeze-orchestrator-latest.json');

const EXTRA_APPS = String(process.env.MERGE_FREEZE_EXTRA_APPS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function sh(command) {
  return execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function extraStop() {
  const stopped = [];
  for (const app of EXTRA_APPS) {
    try {
      sh(`pm2 stop ${app}`);
      stopped.push(app);
    } catch {
      /* ignore */
    }
  }
  return stopped;
}

function extraStart(apps) {
  for (const app of apps) {
    try {
      sh(`pm2 start ${app}`);
    } catch {
      /* ignore */
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'help';

  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

  if (mode === 'prepare') {
    execSync('npm run openclaw:commit:window:open', { cwd: ROOT, stdio: 'inherit' });
    const extra = extraStop();
    const payload = { generatedAt: new Date().toISOString(), phase: 'prepare', extraStopped: extra };
    fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
    console.log(`Merge freeze prepare complete. Report: ${OUTPUT}`);
    return;
  }

  if (mode === 'finalize') {
    extraStart(EXTRA_APPS);
    execSync('npm run openclaw:commit:window:close', { cwd: ROOT, stdio: 'inherit' });
    const payload = { generatedAt: new Date().toISOString(), phase: 'finalize' };
    fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
    console.log(`Merge freeze finalize complete. Report: ${OUTPUT}`);
    return;
  }

  if (mode === 'run') {
    const sep = args.indexOf('--');
    const inner = sep === -1 ? [] : args.slice(sep + 1);
    if (inner.length === 0) {
      console.error('Usage: openclaw-merge-freeze-orchestrator.cjs run -- <command>');
      process.exit(1);
    }
    const cmd = inner.join(' ');
    let extraStopped = [];
    try {
      execSync('npm run openclaw:commit:window:open', { cwd: ROOT, stdio: 'inherit' });
      extraStopped = extraStop();
      const result = spawnSync(cmd, { cwd: ROOT, shell: true, stdio: 'inherit', env: process.env });
      const payload = {
        generatedAt: new Date().toISOString(),
        phase: 'run',
        command: cmd,
        extraStopped,
        exitCode: result.status ?? 0,
      };
      fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
      process.exitCode = result.status ?? 0;
    } finally {
      extraStart(extraStopped);
      try {
        execSync('npm run openclaw:commit:window:close', { cwd: ROOT, stdio: 'inherit' });
      } catch {
        /* best-effort */
      }
    }
    return;
  }

  console.log(`openclaw-merge-freeze-orchestrator — modes: prepare | finalize | run -- "<shell command>"`);
}

main();
