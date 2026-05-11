#!/usr/bin/env node
/**
 * Auto-fix package.json
 * Adds missing core scripts (test, build, lint) if they are absent.
 */
import fs from 'fs';
import path from 'path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const scripts = pkg.scripts || {};

const defaults = {
  test: 'jest',
  build: 'npm run lint && npm run type-check && next build',
  lint: 'eslint . --fix'
};

let changed = false;
for (const [key, cmd] of Object.entries(defaults)) {
  if (!scripts[key]) {
    scripts[key] = cmd;
    console.log(`Added missing script: ${key} -> ${cmd}`);
    changed = true;
  }
}

if (changed) {
  pkg.scripts = scripts;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('package.json updated with missing scripts.');
} else {
  console.log('All core scripts already present.');
}
