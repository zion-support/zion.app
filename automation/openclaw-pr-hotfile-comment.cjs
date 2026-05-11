#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Emits markdown for PR comment: overlap between changed files and hot-file patch router.
 * Usage: FILES="a,b,c" node automation/openclaw-pr-hotfile-comment.cjs
 *    or: echo -e "a\nb" | node automation/openclaw-pr-hotfile-comment.cjs --stdin
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ROUTER = path.join(ROOT, 'automation', 'reports', 'openclaw-hot-file-patch-router-latest.json');

function normalize(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function loadRoutes() {
  try {
    const j = JSON.parse(fs.readFileSync(ROUTER, 'utf8'));
    return Array.isArray(j.routes) ? j.routes : [];
  } catch {
    return [];
  }
}

function parseFiles() {
  const argv = process.argv.slice(2);
  if (argv.includes('--stdin')) {
    return fs
      .readFileSync(0, 'utf8')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const raw = process.env.FILES || process.env.CHANGED_FILES || '';
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function main() {
  const changed = new Set(parseFiles().map(normalize));
  if (changed.size === 0) {
    console.log('<!-- openclaw-hotfile: no changed files -->');
    process.exit(0);
  }
  const routes = loadRoutes();
  const hits = [];
  for (const r of routes) {
    const f = normalize(r.file);
    if (changed.has(f)) {
      hits.push(r);
    }
  }
  if (hits.length === 0) {
    console.log('<!-- openclaw-hotfile: no hot-file overlap -->');
    process.exit(0);
  }
  const THREAD_MARKER = '<!-- openclaw-hotfile:thread -->';
  let md = `${THREAD_MARKER}\n\n### Autonomy hot-file advisory\n\n`;
  md +=
    'These changed paths overlap `automation/reports/openclaw-hot-file-patch-router-latest.json` routes — prefer scoped edits.\n\n';
  md += '| File | Risk | Patch mode |\n| --- | --- | --- |\n';
  for (const h of hits.slice(0, 20)) {
    md += `| \`${h.file}\` | ${h.risk || '—'} | \`${h.patchMode || '—'}\` |\n`;
  }
  if (hits.length > 20) {
    md += `\n_+${hits.length - 20} more (truncated)_\n`;
  }
  console.log(md);
}

main();
