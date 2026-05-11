#!/usr/bin/env node
/**
 * Smoke-test a few routes on NETLIFY_DEPLOY_URL (preview deploy hostname).
 * Writes automation/reports/netlify-preview-smoke-latest.json
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROUTES_FILE = path.join(process.cwd(), 'config', 'smoke-routes.txt');
const OUT = path.join(process.cwd(), 'automation', 'reports', 'netlify-preview-smoke-latest.json');

function fetchStatus(urlStr) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      urlStr,
      { method: 'GET', timeout: 12_000 },
      (res) => {
        res.resume();
        resolve({ status: res.statusCode || 0, error: null });
      },
    );
    req.on('error', (err) => resolve({ status: 0, error: err.message || 'network_error' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout' });
    });
    req.end();
  });
}

function routeKind(status, ok) {
  if (ok) return 'ok';
  if (status === 0) return 'transport';
  if (status >= 400 && status < 500) return 'http_4xx';
  if (status >= 500) return 'http_5xx';
  if (status >= 300 && status < 400) return 'http_redirect';
  return 'http_other';
}

function aggregateFailureClass(kinds) {
  const bad = kinds.filter((k) => k !== 'ok');
  if (bad.length === 0) return 'none';
  const hasT = bad.some((k) => k === 'transport');
  const hasH = bad.some((k) => k.startsWith('http'));
  if (hasT && hasH) return 'mixed';
  if (hasT) return 'transport';
  return 'http';
}

async function main() {
  const base = (process.env.NETLIFY_DEPLOY_URL || '').trim().replace(/\/$/, '');
  const maxRoutes = Math.min(12, Math.max(1, Number(process.env.SMOKE_NETLIFY_MAX_ROUTES || 6)));
  if (!base || !base.startsWith('http')) {
    const payload = {
      generatedAt: new Date().toISOString(),
      skipped: true,
      reason: 'NETLIFY_DEPLOY_URL not set or invalid',
      failureClass: 'none',
    };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log('smoke-netlify-deploy-preview: skip');
    process.exit(0);
  }

  let routes = ['/'];
  if (fs.existsSync(ROUTES_FILE)) {
    routes = fs
      .readFileSync(ROUTES_FILE, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .slice(0, maxRoutes);
  }

  const results = [];
  for (const p of routes) {
    const pathPart = p.startsWith('/') ? p : `/${p}`;
    const url = `${base}${pathPart}`;
    const res = await fetchStatus(url);
    const code = res.status;
    const ok = code >= 200 && code < 400;
    const kind = routeKind(code, ok);
    results.push({
      path: pathPart,
      status: code,
      ok,
      kind,
      error: res.error || undefined,
    });
  }

  const failed = results.filter((r) => !r.ok).length;
  const kinds = results.map((r) => r.kind);
  const failureClass = aggregateFailureClass(kinds);
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl: base,
    unhealthyCount: failed,
    failureClass,
    routes: results,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log('smoke-netlify-deploy-preview: wrote', OUT, 'failed=', failed);
  process.exit(failed > 0 ? 1 : 0);
}

main();
