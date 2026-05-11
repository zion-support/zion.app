#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * AI Uninterruptable Content Loop
 *
 * Goal: keep content creation moving forward even when:
 * - a step fails transiently
 * - LLM credentials are missing (falls back to template-only steps)
 * - the runner is interrupted (persists a small checkpoint under automation/reports/)
 *
 * This runner is intentionally:
 * - idempotent-ish (runs existing scripts that already dedupe/append safely)
 * - resumable (checkpointed)
 * - lock-protected (prevents overlapping local/CI runs)
 *
 * Typical usage (CI):
 *   node automation/ai-uninterruptable-content-loop.cjs
 *
 * Environment:
 *   LOOP_MAX_MINUTES=12          Time budget (default 12)
 *   LOOP_MAX_CYCLES=4            Max step executions (default 4)
 *   LOOP_ALLOW_LLM=1             Allow LLM steps when configured (default 1)
 *   LOOP_REQUIRE_QUEUE_GUARD_OK=0  If 1, exit early when writer queue is busy (default 0)
 *   LOOP_QUEUE_GUARD_WAIT=0      If 1, wait for queue to clear (default 0)
 *   LOOP_QUEUE_GUARD_WAIT_MAX_MINUTES=35  Max wait minutes when waiting (default 35)
 *   LOOP_QUEUE_GUARD_WAIT_POLL_SECONDS=30 Poll seconds when waiting (default 30)
 *   LOOP_STEP_COOLDOWN_MINUTES=15  Skip steps that succeeded recently (default 15)
 *   LOOP_LOCK_TTL_MINUTES=120    Consider lock stale after this many minutes (default 120)
 *   LOOP_BACKOFF_BASE_SECONDS=10 Base backoff after failures (default 10)
 *   LOOP_BACKOFF_MAX_SECONDS=120 Max backoff after failures (default 120)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const RUNTIME_DIR = path.join(ROOT, 'automation', 'reports', '.runtime');
// Keep the checkpoint tracked in git so runs can truly resume across separate
// GitHub Actions executions (Actions cache keys are immutable; restore-only
// caches do not reliably persist a moving checkpoint).
const STATE_PATH = path.join(ROOT, 'automation', 'reports', 'uninterruptable-content-loop-state.json');
const LOCK_PATH = path.join(RUNTIME_DIR, 'uninterruptable-content-loop.lock');
const REPORT_PATH = path.join(RUNTIME_DIR, 'uninterruptable-content-loop-latest.json');
const HEARTBEAT_PATH = path.join(RUNTIME_DIR, 'uninterruptable-content-loop-heartbeat.json');

const LOOP_MAX_MINUTES = Math.max(1, parseInt(process.env.LOOP_MAX_MINUTES || '12', 10));
const LOOP_MAX_CYCLES = Math.max(1, parseInt(process.env.LOOP_MAX_CYCLES || '4', 10));
const LOOP_ALLOW_LLM = process.env.LOOP_ALLOW_LLM !== '0';
const LOOP_REQUIRE_QUEUE_GUARD_OK = process.env.LOOP_REQUIRE_QUEUE_GUARD_OK === '1';
const LOOP_QUEUE_GUARD_WAIT = process.env.LOOP_QUEUE_GUARD_WAIT === '1';
const LOOP_QUEUE_GUARD_WAIT_MAX_MINUTES = Math.max(
  1,
  parseInt(process.env.LOOP_QUEUE_GUARD_WAIT_MAX_MINUTES || '35', 10),
);
const LOOP_QUEUE_GUARD_WAIT_POLL_SECONDS = Math.max(
  10,
  parseInt(process.env.LOOP_QUEUE_GUARD_WAIT_POLL_SECONDS || '30', 10),
);
const LOOP_STEP_COOLDOWN_MINUTES = Math.max(
  0,
  parseInt(process.env.LOOP_STEP_COOLDOWN_MINUTES || '15', 10),
);
const LOOP_LOCK_TTL_MINUTES = Math.max(1, parseInt(process.env.LOOP_LOCK_TTL_MINUTES || '120', 10));
const LOOP_BACKOFF_BASE_SECONDS = Math.max(0, parseInt(process.env.LOOP_BACKOFF_BASE_SECONDS || '10', 10));
const LOOP_BACKOFF_MAX_SECONDS = Math.max(0, parseInt(process.env.LOOP_BACKOFF_MAX_SECONDS || '120', 10));

function nowIso() {
  return new Date().toISOString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function hasLlmConfigured() {
  try {
    // CommonJS module under automation/lib
    const { createLLMClient } = require('./lib/openrouter-client.cjs');
    return createLLMClient().isConfigured();
  } catch {
    return false;
  }
}

function runNode(scriptRelPath, args = [], extraEnv = {}) {
  const scriptPath = path.join(ROOT, scriptRelPath);
  const startedAt = Date.now();
  const res = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: ROOT,
    env: { ...process.env, ...extraEnv },
    stdio: 'inherit',
    timeout: 1000 * 60 * 20, // hard cap per step
  });
  const durationMs = Date.now() - startedAt;
  return {
    ok: res.status === 0,
    status: res.status,
    signal: res.signal,
    durationMs,
  };
}

function lockIsStale() {
  try {
    const stat = fs.statSync(LOCK_PATH);
    const ageMs = Date.now() - stat.mtimeMs;
    const ttlMs = LOOP_LOCK_TTL_MINUTES * 60 * 1000;
    return ageMs > ttlMs;
  } catch {
    return false;
  }
}

function acquireLock() {
  fs.mkdirSync(path.dirname(LOCK_PATH), { recursive: true });
  if (lockIsStale()) {
    try {
      fs.unlinkSync(LOCK_PATH);
    } catch {
      // ignore
    }
  }
  try {
    fs.writeFileSync(LOCK_PATH, `${process.pid}\n${nowIso()}\n`, { flag: 'wx' });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e?.code || 'locked' };
  }
}

function releaseLock() {
  try {
    fs.unlinkSync(LOCK_PATH);
  } catch {
    // ignore
  }
}

function touchHeartbeat(payload) {
  writeJson(HEARTBEAT_PATH, {
    updatedAt: nowIso(),
    pid: process.pid,
    ...payload,
  });
}

function planSteps({ llmOk }) {
  // Always do at least one template-only step each run.
  // LLM steps are opportunistic and only included when configured.
  const steps = [];
  steps.push({ id: 'contentBurst', kind: 'node', path: 'automation/ai-content-burst-agent.cjs', args: [] });

  // Generate static context bundle (helps the site/chat stay grounded) when available.
  if (fs.existsSync(path.join(ROOT, 'scripts', 'automation', 'generate-ai-context-bundle.cjs'))) {
    steps.push({ id: 'aiContext', kind: 'node', path: 'scripts/automation/generate-ai-context-bundle.cjs', args: [] });
  }

  // Generate "what shipped" feed (if present in repo).
  if (fs.existsSync(path.join(ROOT, 'scripts', 'automation', 'generate-what-shipped-feed.cjs'))) {
    steps.push({ id: 'whatShipped', kind: 'node', path: 'scripts/automation/generate-what-shipped-feed.cjs', args: [] });
  }

  if (llmOk) {
    steps.push({ id: 'ultraFast', kind: 'node', path: 'automation/ai-ultra-fast-content-pipeline.cjs', args: [] });
  }
  return steps;
}

function nextIndex(state, steps) {
  const last = typeof state.lastStepId === 'string' ? state.lastStepId : '';
  const idx = steps.findIndex((s) => s.id === last);
  if (idx < 0) return 0;
  return (idx + 1) % steps.length;
}

function shouldSkipStep(state, stepId) {
  if (LOOP_STEP_COOLDOWN_MINUTES <= 0) return false;
  const hist = state?.stepHistory?.[stepId];
  const ts = hist?.lastOkAt;
  if (!ts) return false;
  const lastOkMs = Date.parse(ts);
  if (!Number.isFinite(lastOkMs)) return false;
  const ageMin = (Date.now() - lastOkMs) / 1000 / 60;
  return ageMin < LOOP_STEP_COOLDOWN_MINUTES;
}

function computeBackoffSeconds(state) {
  const failStreak = Math.max(0, parseInt(state?.failureStreak || '0', 10) || 0);
  if (failStreak <= 0 || LOOP_BACKOFF_BASE_SECONDS <= 0) return 0;
  const raw = LOOP_BACKOFF_BASE_SECONDS * Math.pow(2, Math.min(6, failStreak - 1));
  const capped = LOOP_BACKOFF_MAX_SECONDS > 0 ? Math.min(raw, LOOP_BACKOFF_MAX_SECONDS) : raw;
  const jitter = Math.floor(Math.random() * Math.max(1, Math.round(capped * 0.2)));
  return Math.max(0, Math.round(capped + jitter));
}

async function main() {
  const startedAt = Date.now();
  const lock = acquireLock();
  if (!lock.ok) {
    const payload = {
      generatedAt: nowIso(),
      status: 'locked',
      lockReason: lock.reason,
      note: 'Another uninterruptable content loop is running or lock is stale.',
    };
    writeJson(REPORT_PATH, payload);
    touchHeartbeat({ status: 'locked', reason: lock.reason });
    console.log(`[uninterruptable-content-loop] locked (${lock.reason}); exiting 0`);
    return;
  }

  try {
    const prior = readJson(STATE_PATH, {
      createdAt: nowIso(),
      runCount: 0,
      lastStepId: null,
      lastOk: null,
      lastError: null,
      failureStreak: 0,
      stepHistory: {},
    });

    const llmOk = LOOP_ALLOW_LLM && hasLlmConfigured();
    const steps = planSteps({ llmOk });
    const state = {
      ...prior,
      updatedAt: nowIso(),
      runCount: (prior.runCount || 0) + 1,
      llmConfigured: llmOk,
      lastRun: {
        startedAt: nowIso(),
        maxMinutes: LOOP_MAX_MINUTES,
        maxCycles: LOOP_MAX_CYCLES,
        stepCooldownMinutes: LOOP_STEP_COOLDOWN_MINUTES,
        backoff: {
          baseSeconds: LOOP_BACKOFF_BASE_SECONDS,
          maxSeconds: LOOP_BACKOFF_MAX_SECONDS,
        },
        stepsPlanned: steps.map((s) => s.id),
        executions: [],
      },
    };
    touchHeartbeat({ status: 'running', startedAt: state.lastRun.startedAt, llmConfigured: llmOk });

    // Optional queue guard (for CI). If it fails and strict mode is on, bail out quickly.
    const tokenPresent = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
    const repoPresent = Boolean(process.env.GITHUB_REPOSITORY);
    if (LOOP_REQUIRE_QUEUE_GUARD_OK && tokenPresent && repoPresent) {
      const guardArgs = ['--strict'];
      if (LOOP_QUEUE_GUARD_WAIT) guardArgs.push('--wait');
      const q = runNode('scripts/automation/autonomous-writer-queue-guard.cjs', guardArgs, {
        QUEUE_GUARD_BRANCH: process.env.QUEUE_GUARD_BRANCH || 'main',
        QUEUE_GUARD_WAIT_MAX_MINUTES: String(LOOP_QUEUE_GUARD_WAIT_MAX_MINUTES),
        QUEUE_GUARD_WAIT_POLL_SECONDS: String(LOOP_QUEUE_GUARD_WAIT_POLL_SECONDS),
      });
      state.lastRun.executions.push({ stepId: 'queueGuard', ok: q.ok, durationMs: q.durationMs });
      if (!q.ok) {
        state.lastOk = false;
        state.lastError = 'Writer queue guard: too many active writers';
        writeJson(STATE_PATH, state);
        writeJson(REPORT_PATH, {
          generatedAt: nowIso(),
          status: 'skipped',
          reason: 'writer-queue-busy',
          llmConfigured: llmOk,
        });
        console.log('[uninterruptable-content-loop] queue busy; skipping to avoid collision');
        return;
      }
    }

    let idx = nextIndex(state, steps);
    let okCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (let cycle = 0; cycle < LOOP_MAX_CYCLES; cycle++) {
      const elapsedMin = (Date.now() - startedAt) / 1000 / 60;
      if (elapsedMin >= LOOP_MAX_MINUTES) break;

      const step = steps[idx];
      if (shouldSkipStep(state, step.id)) {
        skippedCount++;
        state.lastRun.executions.push({
          stepId: step.id,
          startedAt: nowIso(),
          ok: true,
          skipped: true,
          reason: `cooldown<${LOOP_STEP_COOLDOWN_MINUTES}m`,
          durationMs: 0,
        });
        state.lastStepId = step.id;
        state.updatedAt = nowIso();
        writeJson(STATE_PATH, state);
        touchHeartbeat({
          status: 'running',
          lastStepId: step.id,
          skippedCount,
          okCount,
          failCount,
          cycle: cycle + 1,
        });
        idx = (idx + 1) % steps.length;
        continue;
      }

      const backoffSeconds = computeBackoffSeconds(state);
      if (backoffSeconds > 0) {
        console.log(`[uninterruptable-content-loop] backoff ${backoffSeconds}s (failureStreak=${state.failureStreak})`);
        await sleep(backoffSeconds * 1000);
      }

      const stepStartIso = nowIso();
      const result = runNode(step.path, step.args);
      const exec = {
        stepId: step.id,
        startedAt: stepStartIso,
        ok: result.ok,
        status: result.status,
        signal: result.signal,
        durationMs: result.durationMs,
      };
      state.lastRun.executions.push(exec);
      state.lastStepId = step.id;

      if (result.ok) {
        okCount++;
        state.lastOk = true;
        state.lastError = null;
        state.failureStreak = 0;
      } else {
        failCount++;
        state.lastOk = false;
        state.lastError = `Step failed: ${step.id}`;
        state.failureStreak = (state.failureStreak || 0) + 1;
      }

      state.stepHistory = state.stepHistory || {};
      const prev = state.stepHistory[step.id] || { okCount: 0, failCount: 0, lastOkAt: null, lastFailAt: null };
      state.stepHistory[step.id] = {
        ...prev,
        okCount: prev.okCount + (result.ok ? 1 : 0),
        failCount: prev.failCount + (result.ok ? 0 : 1),
        lastOkAt: result.ok ? nowIso() : prev.lastOkAt,
        lastFailAt: result.ok ? prev.lastFailAt : nowIso(),
      };

      // Persist checkpoint after every step so an interrupt resumes cleanly.
      state.updatedAt = nowIso();
      writeJson(STATE_PATH, state);
      touchHeartbeat({
        status: 'running',
        lastStepId: step.id,
        lastStepOk: result.ok,
        okCount,
        failCount,
        skippedCount,
        cycle: cycle + 1,
      });

      idx = (idx + 1) % steps.length;
    }

    const payload = {
      generatedAt: nowIso(),
      status: failCount > 0 && okCount === 0 ? 'degraded' : 'ok',
      llmConfigured: llmOk,
      cyclesAttempted: LOOP_MAX_CYCLES,
      okCount,
      failCount,
      skippedCount,
      statePath: path.relative(ROOT, STATE_PATH).replace(/\\/g, '/'),
      lastStepId: state.lastStepId,
    };
    writeJson(REPORT_PATH, payload);
    touchHeartbeat({ status: 'completed', ...payload });
    console.log(`[uninterruptable-content-loop] done: ok=${okCount} fail=${failCount} skipped=${skippedCount}`);
  } finally {
    releaseLock();
  }
}

main();
