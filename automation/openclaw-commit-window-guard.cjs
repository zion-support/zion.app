#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-commit-window-guard-latest.json');
const STATE = path.join(REPORTS, 'openclaw-commit-window-state.json');

const MODE = process.argv.includes('close') ? 'close' : 'open';
const TARGETS = [
  'openclaw-autonomous-prompts',
  'openclaw-autonomous-guardian',
  'openclaw-prompt-quality-scorer',
  'openclaw-deploy-confidence-gate',
  'openclaw-confidence-trend-adapter',
  'openclaw-regression-memory-agent',
];

function sh(command) {
  try {
    return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  const state = readJson(STATE, { paused: [] });
  const affected = [];

  if (MODE === 'open') {
    for (const app of TARGETS) {
      const status = sh(`pm2 jlist | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);const p=j.find(x=>x.name==='${app}');console.log((p&&p.pm2_env&&p.pm2_env.status)||'missing')})"`);
      if (status === 'online') {
        sh(`pm2 stop ${app}`);
        state.paused.push(app);
        affected.push(app);
      }
    }
  } else {
    const unique = Array.from(new Set(state.paused));
    for (const app of unique) {
      sh(`pm2 start ${app}`);
      affected.push(app);
    }
    state.paused = [];
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: MODE,
    affected,
    pausedCount: state.paused.length,
  };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`Commit window guard report written: ${OUTPUT}`);
}

main();
