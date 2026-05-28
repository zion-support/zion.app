#!/usr/bin/env node

 

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET = process.env.ZION_BASE_URL || 'https://ziontechgroup.com';
const ROUTES_FILE = process.env.SMOKE_ROUTES_FILE || path.join(ROOT, 'config', 'smoke-routes.txt');
const MAX_ROUTES = Number(process.env.SMOKE_MAX_ROUTES || 20);

function readRoutesManifest() {
  if (!fs.existsSync(ROUTES_FILE)) {
    return [
      '/',
      '/ai-lab',
      '/ai-lab/autonomous-opportunity-radar',
      '/zion-ai-chatbot-playground',
      '/zion-ai-code-sandbox',
      '/zion-ai-site-evolution-simulator',
    ];
  }

  return fs
    .readFileSync(ROUTES_FILE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .slice(0, MAX_ROUTES);
}

const PATHS = readRoutesManifest();

function checkPath(path, redirectCount = 0) {
  return new Promise((resolve) => {
    const url = new URL(path, TARGET);
    const start = Date.now();
    const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 8000);

    const req = https.get(url, (res) => {
      const latency = Date.now() - start;
      const location = res.headers.location;
      if (
        location &&
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        redirectCount < 5
      ) {
        res.resume();
        const nextPath = location.startsWith('http') ? location : new URL(location, TARGET).pathname;
        checkPath(nextPath, redirectCount + 1).then((redirected) => {
          resolve({
            ...redirected,
            path,
            redirectFrom: nextPath,
          });
        });
        return;
      }
      res.resume();
      resolve({
        path,
        status: res.statusCode,
        ok: !!res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
        latency,
      });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`timeout after ${timeoutMs}ms`));
    });

    req.on('error', (error) => {
      resolve({
        path,
        status: 0,
        ok: false,
        latency: Date.now() - start,
        error: error.message,
      });
    });
  });
}

async function main() {
  console.log(`Running simple smoke check against ${TARGET}`);
  const results = await Promise.all(PATHS.map((p) => checkPath(p)));

  let allOk = true;
  for (const result of results) {
    if (result.ok) {
      console.log(`✅ ${result.path} -> ${result.status} (${result.latency}ms)`);
    } else {
      allOk = false;
      console.log(
        `❌ ${result.path} -> ${result.status} (${result.latency}ms)${
          result.error ? ` – ${result.error}` : ''
        }`,
      );
    }
  }

  if (!allOk) {
    process.exitCode = 1;
  }
}

main();

