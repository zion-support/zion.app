#!/usr/bin/env node

/**
 * AI Advanced AI Content Pipeline (PM2-friendly)
 *
 * Runs on a loop or once:
 *   1) Expand Advanced AI service pages (template-based, no LLM)
 *   2) Sync new /ai-services pages into nav + homepage Advanced AI section
 *   3) Optional: template blog posts (MAX_TEMPLATE_POSTS)
 *
 * Env:
 *   CONTINUOUS_MODE=true   — Sleep INTERVAL_MINUTES between cycles (default off)
 *   INTERVAL_MINUTES=360  — Default 6 hours between cycles when continuous
 *   MAX_NEW_PAGES=1
 *   MAX_TEMPLATE_POSTS=0 — Template blog posts per cycle (0 = skip)
 *   SKIP_SYNC=1
 *   AUTO_COMMIT=1 / AUTO_PUSH=1 — Git (only app + automation/reports paths)
 *
 * Run: node automation/ai-advanced-ai-content-pipeline.cjs
 *      npm run content:advanced-ai-pipeline
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTINUOUS = process.env.CONTINUOUS_MODE === 'true' || process.env.CONTINUOUS_MODE === '1';
const INTERVAL_MINUTES = Math.max(15, parseInt(process.env.INTERVAL_MINUTES || '360', 10));
const MAX_TEMPLATE_POSTS = parseInt(process.env.MAX_TEMPLATE_POSTS || '0', 10);
const SKIP_SYNC = process.env.SKIP_SYNC === '1';
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const AUTO_PUSH = process.env.AUTO_PUSH !== '0' && AUTO_COMMIT;

function log(msg) {
  console.log(`[AdvancedAIPipeline] ${new Date().toISOString()} | ${msg}`);
}

function runAsync(script, args = [], env = {}) {
  return new Promise((resolve) => {
    const child = spawn('node', [script, ...args], {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: 'inherit',
    });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

function safeCommit(message) {
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
    if (!status.trim()) {
      log('No git changes.');
      return;
    }
    const allow = (line) => {
      const f = line.slice(3).trim();
      if (!f || f.startsWith('.env')) return false;
      return (
        f.startsWith('app/ai-services/') ||
        f.startsWith('app/constants/navigation.ts') ||
        f.startsWith('app/page.tsx') ||
        f.startsWith('app/blog/') ||
        f.startsWith('app/lib/blog-data.ts') ||
        f.startsWith('automation/reports/')
      );
    };
    const lines = status.split('\n').filter(Boolean);
    const stagedPaths = lines.filter(allow).map((l) => l.slice(3).trim());
    if (stagedPaths.length === 0) {
      log('Git changes exist but none in safe paths; skipping commit.');
      return;
    }
    for (const p of stagedPaths) {
      execSync(`git add -- "${p}"`, { cwd: ROOT, stdio: 'inherit' });
    }
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: ROOT, stdio: 'inherit' });
    if (AUTO_PUSH) {
      execSync('git push', { cwd: ROOT, stdio: 'inherit' });
    }
    log('Commit complete.');
  } catch (e) {
    log(`Commit/push skipped or failed: ${e.message}`);
  }
}

async function cycle() {
  log('=== Cycle start ===');
  const { run: expand } = require('./ai-advanced-ai-services-expansion-agent.cjs');
  const expandReport = expand();

  let syncChanged = false;
  if (!SKIP_SYNC) {
    const { run: syncRun } = require('./ai-front-page-advanced-ai-sync-agent.cjs');
    const syncResult = syncRun();
    syncChanged = !!(syncResult && syncResult.changed);
  }

  let blogOk = true;
  if (MAX_TEMPLATE_POSTS > 0) {
    blogOk = await runAsync('automation/ai-template-blog-creator-agent.cjs', [], {
      MAX_POSTS: String(MAX_TEMPLATE_POSTS),
    });
    if (!blogOk) log('Template blog step reported failure (non-fatal).');
  }

  const anyWrite =
    (expandReport && expandReport.created && expandReport.created.length > 0) || syncChanged || MAX_TEMPLATE_POSTS > 0;

  if (AUTO_COMMIT && anyWrite) {
    safeCommit('feat(content): advanced AI pipeline — services, sync, optional blog');
  }

  log('=== Cycle end ===');
}

async function main() {
  if (CONTINUOUS) {
    log(`Continuous mode: every ${INTERVAL_MINUTES} minutes`);
    for (;;) {
      await cycle();
      log(`Sleeping ${INTERVAL_MINUTES}m…`);
      await new Promise((r) => setTimeout(r, INTERVAL_MINUTES * 60 * 1000));
    }
  }
  await cycle();
}

main().catch((e) => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});
