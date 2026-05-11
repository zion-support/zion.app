#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const HISTORY_PATH = path.join(REPORTS_DIR, 'promotion-health-history.json');
const TOOLS_PATH = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const CATALOG_PATH = path.join(ROOT, 'app', 'config', 'aiCatalog.ts');
const OUTPUT_REPORT_PATH = path.join(REPORTS_DIR, 'stale-promotion-repromotion-latest.json');
const RECOVERY_THRESHOLD = Number(process.env.STALE_PROMOTION_RECOVERY_THRESHOLD || 4);

function parseHrefToIdMap(source) {
  const map = new Map();
  const regex = /id:\s*'([^']+)'[\s\S]*?href:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source))) map.set(match[2], match[1]);
  return map;
}

function parseArray(source, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const;`, 'm');
  const m = source.match(re);
  if (!m) return [];
  const ids = [];
  const idRe = /'([^']+)'/g;
  let idMatch;
  while ((idMatch = idRe.exec(m[1]))) ids.push(idMatch[1]);
  return ids;
}

function replaceArray(source, name, ids) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[[\\s\\S]*?\\]\\s+as\\s+const;`, 'm');
  const next = `const ${name} = [\n${ids.map((id) => `  '${id}',`).join('\n')}\n] as const;`;
  return source.replace(re, next);
}

function main() {
  if (!fs.existsSync(HISTORY_PATH) || !fs.existsSync(TOOLS_PATH) || !fs.existsSync(CATALOG_PATH)) {
    console.log('Required inputs missing; repromoter skipped.');
    process.exit(0);
  }

  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  const toolsSource = fs.readFileSync(TOOLS_PATH, 'utf8');
  const hrefToId = parseHrefToIdMap(toolsSource);
  const recoverableIds = [];
  for (const [route, stats] of Object.entries(history)) {
    const id = hrefToId.get(route);
    if (!id) continue;
    if (Number(stats.consecutiveSuccesses || 0) >= RECOVERY_THRESHOLD) recoverableIds.push(id);
  }

  const arrays = ['HOMEPAGE_LAB_IDS', 'LIVE_NOW_IDS', 'HERO_CTA_IDS'];
  let catalog = fs.readFileSync(CATALOG_PATH, 'utf8');
  const restored = {};
  let changed = false;

  for (const arrayName of arrays) {
    const ids = parseArray(catalog, arrayName);
    const addable = recoverableIds.filter((id) => !ids.includes(id));
    if (addable.length > 0) {
      restored[arrayName] = addable;
      changed = true;
      catalog = replaceArray(catalog, arrayName, [...ids, ...addable]);
    }
  }

  if (changed) fs.writeFileSync(CATALOG_PATH, catalog);

  const report = {
    timestamp: new Date().toISOString(),
    changed,
    recoveryThreshold: RECOVERY_THRESHOLD,
    recoverableIds,
    restored,
  };
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Stale promotion re-promotion report written: ${OUTPUT_REPORT_PATH}`);
}

main();

