#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Optional deploy gate from aggregate-dashboard.json summary.
 * Set DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL=1 to fail when status === 'critical'.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AGG = path.join(ROOT, 'automation', 'reports', 'aggregate-dashboard.json');
const MAX_AGE_HOURS = Math.max(1, Number.parseInt(process.env.AGGREGATE_DASHBOARD_MAX_AGE_HOURS || '168', 10));

function main() {
  if (!fs.existsSync(AGG)) {
    console.log('[aggregate-deploy-guard] No aggregate-dashboard.json; skip.');
    process.exit(0);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(AGG, 'utf8'));
  } catch {
    console.warn('[aggregate-deploy-guard] Invalid JSON; skip.');
    process.exit(0);
  }
  const summary = data.summary || {};
  const status = summary.status || 'unknown';
  const ts = summary.timestamp || data.timestamp;
  let stale = false;
  if (ts) {
    const ageMs = Date.now() - new Date(ts).getTime();
    stale = ageMs > MAX_AGE_HOURS * 3600 * 1000;
  }

  const p0 = Array.isArray(summary.issues) ? summary.issues : [];
  const block =
    process.env.DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL === '1' ||
    process.env.DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL === 'true';

  console.log(
    `[aggregate-deploy-guard] status=${status} stale=${stale} issues=${p0.length} block=${block}`,
  );

  if (block && status === 'critical') {
    console.error('[aggregate-deploy-guard] Blocking: aggregate summary is critical.');
    process.exit(1);
  }
  if (block && stale) {
    console.error(`[aggregate-deploy-guard] Blocking: aggregate older than ${MAX_AGE_HOURS}h.`);
    process.exit(1);
  }
  if (status === 'critical' || stale) {
    console.warn(
      '[aggregate-deploy-guard] Warning only. Set DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL=1 to fail deploy.',
    );
  }
  process.exit(0);
}

main();
