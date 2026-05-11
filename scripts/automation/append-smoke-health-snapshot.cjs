#!/usr/bin/env node
/**
 * Append a compact prod + preview smoke snapshot for dashboard sparklines.
 * Reads latest JSON reports (if present) and appends to capped JSON array.
 *
 * Env:
 *   SMOKE_HEALTH_HISTORY_MAX — max entries (default 30)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'automation', 'reports', 'smoke-health-history.json');
const PROD = path.join(ROOT, 'automation', 'reports', 'scheduled-production-smoke-latest.json');
const PREV = path.join(ROOT, 'automation', 'reports', 'netlify-preview-smoke-latest.json');
const MAX = Math.min(200, Math.max(5, Number(process.env.SMOKE_HEALTH_HISTORY_MAX || 30)));

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const prod = readJson(PROD);
  const prev = readJson(PREV);

  const entry = {
    timestamp: new Date().toISOString(),
    prodOk: prod && typeof prod.allOk === 'boolean' ? prod.allOk : null,
    prodTargetSource: prod?.targetSource ?? null,
    previewSkipped: prev == null ? null : prev.skipped === true,
    previewOk:
      prev && !prev.skipped && typeof prev.unhealthyCount === 'number'
        ? prev.unhealthyCount === 0
        : null,
    previewFailureClass: prev && !prev.skipped ? prev.failureClass ?? null : null,
  };

  let hist = [];
  if (fs.existsSync(OUT)) {
    try {
      hist = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    } catch {
      hist = [];
    }
  }
  if (!Array.isArray(hist)) hist = [];
  hist.push(entry);
  while (hist.length > MAX) hist.shift();

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(hist, null, 2)}\n`, 'utf8');
  console.log('append-smoke-health-snapshot: wrote', OUT, 'len=', hist.length);
}

main();
