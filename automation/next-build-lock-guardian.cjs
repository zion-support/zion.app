#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const LOCK_PATH = path.join(ROOT, '.next', 'lock');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'next-build-lock-guardian-latest.json');
const MODE = process.argv.includes('--check') ? 'check' : 'heal';
const INCLUDE_DEV = String(process.env.NEXT_BUILD_LOCK_GUARD_INCLUDE_DEV || '').trim() === '1';
const KILL_DEV = String(process.env.NEXT_BUILD_LOCK_GUARD_KILL_DEV || '').trim() === '1';
const STALE_SECONDS = (() => {
  const raw = String(process.env.NEXT_BUILD_LOCK_GUARD_STALE_SECONDS || '').trim();
  if (!raw) return 30 * 60;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30 * 60;
})();
const FORCE_HEAL = String(process.env.NEXT_BUILD_LOCK_GUARD_FORCE || '').trim() === '1';

function run(command) {
  return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function listNextBuildPids() {
  try {
    const output = run('ps -Ao pid,ppid,command');
    if (!output) return [];
    return output
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .filter((line) => {
        if (line.includes('next build --webpack')) return true;
        if (INCLUDE_DEV && line.includes('next dev')) return true;
        return false;
      })
      .map((line) => {
        const [pidRaw, ppidRaw] = line.split(' ');
        return { pid: Number(pidRaw), ppid: Number(ppidRaw) };
      })
      .filter((item) => Number.isFinite(item.pid));
  } catch {
    return [];
  }
}

function listNextDevPids() {
  if (!INCLUDE_DEV) return [];
  try {
    const output = run('ps -Ao pid,ppid,command');
    if (!output) return [];
    return output
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .filter((line) => line.includes('next dev'))
      .map((line) => {
        const [pidRaw, ppidRaw] = line.split(' ');
        return { pid: Number(pidRaw), ppid: Number(ppidRaw) };
      })
      .filter((item) => Number.isFinite(item.pid));
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    run(`kill ${pid}`);
    return true;
  } catch {
    return false;
  }
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const pids = listNextBuildPids();
  const devPids = listNextDevPids();
  const lockExists = fs.existsSync(LOCK_PATH);
  const lockAgeSeconds = (() => {
    if (!lockExists) return null;
    try {
      const stats = fs.statSync(LOCK_PATH);
      return Math.max(0, Math.round((Date.now() - stats.mtimeMs) / 1000));
    } catch {
      return null;
    }
  })();
  const lockIsStale =
    lockExists && (FORCE_HEAL || (Number.isFinite(lockAgeSeconds) && lockAgeSeconds >= STALE_SECONDS));
  const killed = [];
  let lockRemoved = false;
  let healSkippedReason = null;

  if (MODE === 'heal') {
    // Safety: only heal when the lock looks stale (or explicitly forced).
    // Do NOT kill active builds just because a lock exists.
    if (!lockExists) {
      healSkippedReason = 'no_lock_present';
    } else if (!lockIsStale) {
      healSkippedReason = 'lock_present_but_fresh';
    } else {
      for (const proc of pids) {
        if (killPid(proc.pid)) killed.push(proc.pid);
        if (Number.isFinite(proc.ppid)) killPid(proc.ppid);
      }
      if (KILL_DEV) {
        for (const proc of devPids) {
          if (killPid(proc.pid)) killed.push(proc.pid);
          if (Number.isFinite(proc.ppid)) killPid(proc.ppid);
        }
      }
      try {
        fs.unlinkSync(LOCK_PATH);
        lockRemoved = true;
      } catch {
        lockRemoved = false;
      }
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: MODE,
    includeDev: INCLUDE_DEV,
    killDev: KILL_DEV,
    forceHeal: FORCE_HEAL,
    staleThresholdSeconds: STALE_SECONDS,
    lockExistsBefore: lockExists,
    lockAgeSeconds,
    lockIsStale,
    nextBuildProcessCount: pids.length,
    nextDevProcessCount: devPids.length,
    killedPids: killed,
    lockRemoved,
    healSkippedReason,
    status:
      lockIsStale || (MODE === 'check' && lockExists) ? (MODE === 'heal' ? 'healed' : 'warning') : 'ok',
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Next build lock guardian report: ${REPORT_PATH}`);
  console.log(`Status: ${payload.status}`);

  if (MODE === 'check' && payload.status === 'warning') {
    process.exitCode = 1;
  }
}

main();
