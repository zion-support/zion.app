#!/usr/bin/env node

/**
 * Shared pages-to-visit loader for app improvement pipelines.
 * Single source of truth: automation/data/pages-to-visit.json
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'pages-to-visit.json');

function loadPages(options = {}) {
  const {
    coreOnly = false,
    includeExtended = true,
    includeAuditOnly = false,
    includeAiLab = true,
  } = options;
  let data = { core: [], extended: [], auditOnly: [], aiLab: [] };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn(`[pages-to-visit] Could not load ${CONFIG_PATH}: ${e.message}`);
  }
  const pages = [...(data.core || [])];
  if (includeExtended && (data.extended || []).length) {
    pages.push(...(data.extended || []));
  }
  if (includeAuditOnly && (data.auditOnly || []).length) {
    pages.push(...(data.auditOnly || []));
  }
  if (includeAiLab && (data.aiLab || []).length) {
    pages.push(...(data.aiLab || []));
  }
  if (coreOnly) {
    return (data.core || []).map((p) => ({ path: p.path, label: p.label || p.name }));
  }
  return pages.map((p) => ({ path: p.path, label: p.label || p.name }));
}

if (require.main === module) {
  const core = loadPages({ coreOnly: true });
  const extended = loadPages({ includeExtended: true });
  const audit = loadPages({ includeExtended: true, includeAuditOnly: true });
  console.log(JSON.stringify({ core: core.length, extended: extended.length, audit: audit.length, corePages: core }, null, 2));
}

module.exports = { loadPages, CONFIG_PATH };
