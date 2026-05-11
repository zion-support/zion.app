#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Prints space-separated GitHub labels for PR based on hot-file overlap (stdout).
 * Env: FILES=comma or newline separated paths (same as openclaw-pr-hotfile-comment.cjs).
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ROUTER = path.join(ROOT, 'automation', 'reports', 'openclaw-hot-file-patch-router-latest.json');

function normalize(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function parseFiles() {
  const raw = process.env.FILES || process.env.CHANGED_FILES || '';
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalize);
}

function main() {
  const changed = new Set(parseFiles());
  if (changed.size === 0) {
    process.exit(0);
  }
  let routes = [];
  try {
    const j = JSON.parse(fs.readFileSync(ROUTER, 'utf8'));
    routes = Array.isArray(j.routes) ? j.routes : [];
  } catch {
    process.exit(0);
  }
  let hasHigh = false;
  let hasMedium = false;
  let hasSectionScoped = false;
  for (const r of routes) {
    const f = normalize(r.file);
    if (!changed.has(f)) continue;
    if (r.risk === 'high') hasHigh = true;
    if (r.risk === 'medium') hasMedium = true;
    if (r.patchMode === 'section_scoped') hasSectionScoped = true;
  }
  const labels = [];
  if (hasHigh) labels.push('autonomy-hotfile-high');
  else if (hasMedium) labels.push('autonomy-hotfile-medium');
  if (hasSectionScoped) labels.push('autonomy-patch-section-scoped');
  console.log(labels.join(' '));
}

main();
