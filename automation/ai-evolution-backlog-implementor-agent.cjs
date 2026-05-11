#!/usr/bin/env node

/**
 * AI Evolution Backlog Implementor Agent
 *
 * Reads app-evolution-backlog.json and implements safeToAutoApply items.
 * Lightweight, runs standalone or as part of daily quick improvement pipeline.
 * No LLM required; applies heuristic fixes for known task types.
 *
 * Environment:
 *   AUTO_APPLY=1  - Write changes to files (default: dry run)
 *   MAX_APPLY=N   - Max items to apply per run (default: 5)
 *
 * Run: npm run app:backlog-implement
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');
const REPORT_FILE = path.join(REPORTS_DIR, 'evolution-backlog-implementor-latest.json');

const AUTO_APPLY = process.env.AUTO_APPLY === '1';
const MAX_APPLY = parseInt(process.env.MAX_APPLY || '5', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[BacklogImplementor] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Warning: Could not read ${p}: ${e.message}`);
  }
  return def;
}

function applyTask(task) {
  if (!task.safeToAutoApply || !task.page) return { applied: false, reason: 'skip' };
  if (task.category === 'seo') {
    const pagePath = task.page === '/' || task.page === 'site-wide'
      ? path.join(ROOT, 'app', 'page.tsx')
      : path.join(ROOT, 'app', task.page.replace(/^\//, ''), 'page.tsx');
    if (!fs.existsSync(pagePath)) return { applied: false, reason: 'file_not_found' };
    let content = fs.readFileSync(pagePath, 'utf8');
    const before = content;
    if (content.includes('metadata')) {
      const descMatch = content.match(/description:\s*['"`]([^'"`]*)['"`]/);
      if (descMatch && descMatch[1].length > 160) {
        const shorter = descMatch[1].slice(0, 157).trimEnd() + '...';
        content = content.replace(descMatch[0], `description: '${shorter}'`);
      }
    }
    if (content !== before && AUTO_APPLY) {
      fs.writeFileSync(pagePath, content);
      return { applied: true };
    }
  }
  return { applied: false, reason: 'no_change' };
}

function run() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  log('=== Evolution Backlog Implementor Started ===');

  const backlog = readJsonSafe(BACKLOG_FILE, { implementationTasks: [] });
  const tasks = (backlog.implementationTasks || []).filter((t) => t.safeToAutoApply);
  const toApply = tasks.slice(0, MAX_APPLY);

  if (toApply.length === 0) {
    log('No safe-to-apply tasks in backlog.');
    const report = {
      timestamp: new Date().toISOString(),
      applied: 0,
      skipped: 0,
      totalSafe: 0,
      summary: 'No safe tasks',
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    log('=== Evolution Backlog Implementor Finished ===');
    return;
  }

  log(`Processing ${toApply.length} safe tasks (AUTO_APPLY=${AUTO_APPLY})`);
  const results = [];
  let applied = 0;
  for (const task of toApply) {
    const result = applyTask(task);
    results.push({ id: task.id, title: task.title, ...result });
    if (result.applied) applied++;
  }

  const report = {
    timestamp: new Date().toISOString(),
    applied,
    skipped: toApply.length - applied,
    totalSafe: tasks.length,
    results,
    summary: `Applied ${applied}/${toApply.length} safe tasks`,
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Applied ${applied} improvements`);
  log('=== Evolution Backlog Implementor Finished ===');
}

run();
