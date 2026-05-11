#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Rough scheduled CI footprint: per workflow file with cron, estimate
 * (estimated runs/month) × (sum of job timeout-minutes in file, capped).
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WF_DIR = path.join(ROOT, '.github', 'workflows');
const OUT = path.join(ROOT, 'automation', 'reports', 'gha-workflow-cost-estimate-latest.json');

function runsPerMonthFromCron(cronLine) {
  const parts = String(cronLine || '').trim().split(/\s+/);
  if (parts.length < 5) return 30;
  const min = parts[0];
  const hour = parts[1];
  const dom = parts[2];
  const mon = parts[3];
  const dow = parts[4];
  if (min.startsWith('*/')) {
    const step = Number(min.slice(2), 10) || 15;
    return Math.min(3000, Math.max(30, Math.floor((24 * 60 * 30) / step)));
  }
  if (hour === '*' && min === '*') return Math.min(3000, 24 * 60 * 30);
  if (hour !== '*' && dom !== '*' && mon === '*') return 30;
  if (mon !== '*' || dom !== '*') return 30;
  if (dow === '*') return Math.min(800, 24 * 30);
  const n = dow.split(',').filter(Boolean).length;
  return Math.max(1, n) * 4;
}

function estimateFile(text, fileName) {
  const crons = [...text.matchAll(/cron:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  if (crons.length === 0) return null;
  const timeouts = [...text.matchAll(/timeout-minutes:\s*(\d+)/g)].map((m) => Number(m[1], 10));
  const maxTimeout = timeouts.length ? Math.max(...timeouts) : 15;
  /** Proxy: one “critical path” job per scheduled run (avoid summing every step in repo-wide YAML). */
  const minutesPerRun = Math.min(Math.max(maxTimeout, 5), 360);
  const runs = Math.max(...crons.map((c) => runsPerMonthFromCron(c)), 1);
  const rawMinutes = runs * minutesPerRun;
  /** Workflows overlap on shared runners; cap per-file contribution when summing portfolio load. */
  const estimatedMonthlyMinutes = Math.min(rawMinutes, 900);
  return {
    file: fileName,
    cronExpressions: crons.length,
    maxTimeoutMinutesObserved: maxTimeout,
    minutesPerRun,
    estimatedRunsPerMonth: runs,
    rawMonthlyMinutes: rawMinutes,
    estimatedMonthlyMinutes,
  };
}

function main() {
  if (!fs.existsSync(WF_DIR)) {
    console.warn('No workflows dir');
    process.exit(0);
  }
  const files = fs.readdirSync(WF_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  const workflows = [];
  let total = 0;
  for (const f of files) {
    const text = fs.readFileSync(path.join(WF_DIR, f), 'utf8');
    if (!text.includes('cron:')) continue;
    const w = estimateFile(text, f);
    if (w && w.estimatedMonthlyMinutes > 0) {
      total += w.estimatedMonthlyMinutes;
      workflows.push(w);
    }
  }
  workflows.sort((a, b) => b.estimatedMonthlyMinutes - a.estimatedMonthlyMinutes);
  const payload = {
    generatedAt: new Date().toISOString(),
    note: 'Heuristic: scheduled workflows only; per-workflow minutes capped (parallel runners overlap). Push triggers excluded.',
    totalEstimatedScheduledMinutesPerMonth: total,
    workflows,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`GHA cost estimate written: ${OUT} (~${total} scheduled min/month)`);
}

main();
