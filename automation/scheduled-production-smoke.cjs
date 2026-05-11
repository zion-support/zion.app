#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Scheduled sample of production smoke routes (HTTPS, no Playwright).
 * Writes automation/reports/scheduled-production-smoke-latest.json
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const rawNetlify = (process.env.NETLIFY_DEPLOY_URL || '').trim();
const TARGET = (rawNetlify || process.env.ZION_BASE_URL || 'https://ziontechgroup.com').replace(/\/$/, '');
const targetSource = rawNetlify ? 'netlify' : 'production';
const ROUTES_FILE = process.env.SMOKE_ROUTES_FILE || path.join(ROOT, 'config', 'smoke-routes.txt');
const MAX_ROUTES = Math.min(20, Math.max(3, Number(process.env.SMOKE_SAMPLE_ROUTES || '5')));
const OUT = path.join(ROOT, 'automation', 'reports', 'scheduled-production-smoke-latest.json');
const FAIL = process.env.SMOKE_FAIL_ON_ERROR === '1' || process.env.SMOKE_FAIL_ON_ERROR === 'true';
const USE_ROTATION =
  process.env.SMOKE_USE_ROTATION === '1' || process.env.SMOKE_USE_ROTATION === 'true';

function hashSeed(str) {
  let h = 2166136261;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRotatedRoutes(all, n, seedStr) {
  const seed = hashSeed(seedStr);
  const rand = mulberry32(seed);
  const copy = [...all];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function readRoutes() {
  let list;
  if (!fs.existsSync(ROUTES_FILE)) {
    list = ['/', '/ai-lab', '/contact', '/services', '/blog'];
  } else {
    list = fs
      .readFileSync(ROUTES_FILE, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
  }
  if (list.length === 0) {
    list = ['/', '/ai-lab', '/contact'];
  }
  if (USE_ROTATION && list.length > MAX_ROUTES) {
    const day = process.env.SMOKE_ROTATION_DAY || new Date().toISOString().slice(0, 10);
    const seedStr =
      process.env.SMOKE_ROTATION_SEED ||
      `${day}-${process.env.GITHUB_RUN_ID || 'local'}-${process.env.GITHUB_RUN_ATTEMPT || '0'}`;
    return pickRotatedRoutes(list, MAX_ROUTES, seedStr);
  }
  return list.slice(0, MAX_ROUTES);
}

function checkPath(p, redirectCount = 0) {
  return new Promise((resolve) => {
    const url = new URL(p, TARGET);
    const start = Date.now();
    const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 12000);
    const req = https.get(url, (res) => {
      const latency = Date.now() - start;
      const loc = res.headers.location;
      if (loc && res.statusCode >= 300 && res.statusCode < 400 && redirectCount < 5) {
        res.resume();
        const next = loc.startsWith('http') ? new URL(loc).pathname : new URL(loc, TARGET).pathname;
        checkPath(next, redirectCount + 1).then((r) => resolve({ ...r, path: p }));
        return;
      }
      res.resume();
      resolve({
        path: p,
        status: res.statusCode,
        ok: !!res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
        latency,
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')));
    req.on('error', (err) => {
      resolve({ path: p, status: 0, ok: false, latency: Date.now() - start, error: err.message });
    });
  });
}

async function main() {
  const paths = readRoutes();
  const results = await Promise.all(paths.map((p) => checkPath(p)));
  const failed = results.filter((r) => !r.ok);
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl: TARGET,
    targetSource,
    rotation: USE_ROTATION,
    sampleSize: paths.length,
    allOk: failed.length === 0,
    failedCount: failed.length,
    results,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`Scheduled production smoke: ${payload.allOk ? 'OK' : 'FAIL'} (${OUT})`);
  if (FAIL && !payload.allOk) process.exit(1);
}

main();
