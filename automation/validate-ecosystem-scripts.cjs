#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Static check: each PM2 app in ecosystem.config.cjs that uses a file-based script
 * must reference a path that exists (relative to app cwd / repo root).
 *
 * Skips: npm, npx, yarn, pnpm, bare shell-style entries without a resolvable file.
 *
 * Exit 1 if any path missing.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ECO = path.join(ROOT, 'ecosystem.config.cjs');

function isPackageManagerScript(script) {
  if (!script || typeof script !== 'string') return true;
  const s = script.trim();
  return (
    s === 'npm' ||
    s === 'npx' ||
    s === 'yarn' ||
    s === 'pnpm' ||
    s.startsWith('npm ') ||
    s.startsWith('npx ') ||
    s.startsWith('yarn ') ||
    s.startsWith('pnpm ')
  );
}

function resolveAppScript(app, ecoDir) {
  const script = app.script;
  if (!script || typeof script !== 'string') return null;
  if (isPackageManagerScript(script)) return null;

  let cwd = ecoDir;
  if (app.cwd) {
    cwd = path.isAbsolute(app.cwd) ? app.cwd : path.resolve(ecoDir, app.cwd);
  }

  const scriptPath = path.isAbsolute(script) ? script : path.resolve(cwd, script);
  return scriptPath;
}

function main() {
  if (!fs.existsSync(ECO)) {
    console.error('validate-ecosystem-scripts: ecosystem.config.cjs not found');
    process.exit(2);
  }

  const config = require(ECO);
  const apps = config.apps || [];
  const ecoDir = path.dirname(ECO);
  const missing = [];

  for (const app of apps) {
    const name = app.name || '(unnamed)';
    const scriptPath = resolveAppScript(app, ecoDir);
    if (!scriptPath) continue;

    if (!fs.existsSync(scriptPath)) {
      missing.push({ name, scriptPath: path.relative(ROOT, scriptPath) });
    }
  }

  if (missing.length > 0) {
    console.error('validate-ecosystem-scripts: missing script file(s):');
    for (const m of missing) {
      console.error(`  - ${m.name}: ${m.scriptPath}`);
    }
    process.exit(1);
  }

  console.log(`validate-ecosystem-scripts: OK (${apps.length} app entries checked).`);
}

main();
