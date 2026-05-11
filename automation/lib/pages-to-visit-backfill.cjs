#!/usr/bin/env node

/**
 * Merges AI Lab tool hrefs into automation/data/pages-to-visit.json under `aiLab`
 * so visit/audit pipelines can probe new routes without manual edits.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function toLabelFromHref(href) {
  const slug = href.replace(/^\/ai-lab\//, '');
  return slug
    .split(/[-/]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function collectExistingPaths(data) {
  const set = new Set();
  for (const key of ['core', 'extended', 'auditOnly', 'aiLab']) {
    for (const row of data[key] || []) {
      if (row && row.path) set.add(row.path);
    }
  }
  return set;
}

/**
 * @param {object} opts
 * @param {string} [opts.pagesPath]
 * @param {string[]} opts.hrefs - e.g. ['/ai-lab/foo', ...]
 * @returns {{ added: number, addedPaths: string[], skipped: boolean }}
 */
function syncAiLabHrefs(opts = {}) {
  const pagesPath =
    opts.pagesPath || path.join(ROOT, 'automation', 'data', 'pages-to-visit.json');
  const hrefs = (opts.hrefs || []).filter((h) => typeof h === 'string' && h.startsWith('/ai-lab/'));

  if (!fs.existsSync(pagesPath)) {
    return { added: 0, addedPaths: [], skipped: true };
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  } catch {
    return { added: 0, addedPaths: [], skipped: true };
  }

  if (!data.aiLab || !Array.isArray(data.aiLab)) data.aiLab = [];

  const desiredSet = new Set(hrefs);
  const addedPaths = [];
  let changed = false;

  for (const href of hrefs) {
    const label = toLabelFromHref(href);
    const idx = data.aiLab.findIndex((r) => r && r.path === href);
    if (idx === -1) {
      data.aiLab.push({ path: href, label });
      addedPaths.push(href);
      changed = true;
    } else if (data.aiLab[idx].label !== label) {
      data.aiLab[idx].label = label;
      changed = true;
    }
  }

  const beforeLen = data.aiLab.length;
  data.aiLab = data.aiLab.filter((r) => r && r.path && desiredSet.has(r.path));
  if (data.aiLab.length !== beforeLen) changed = true;

  if (!changed) {
    return { added: 0, addedPaths: [], skipped: false };
  }

  data.updatedAt = new Date().toISOString().slice(0, 10);
  data.aiLab.sort((a, b) => (a.path || '').localeCompare(b.path || ''));
  fs.writeFileSync(pagesPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  return { added: addedPaths.length, addedPaths, skipped: false };
}

module.exports = { syncAiLabHrefs, toLabelFromHref, collectExistingPaths };
