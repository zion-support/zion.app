#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const STALE_REPORT_PATH = path.join(REPORTS_DIR, 'stale-promotion-guard-latest.json');
const TOOLS_PATH = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const CATALOG_PATH = path.join(ROOT, 'app', 'config', 'aiCatalog.ts');
const OUTPUT_REPORT_PATH = path.join(REPORTS_DIR, 'stale-promotion-remediation-latest.json');
const REMEDIATION_THRESHOLD = Number(process.env.STALE_PROMOTION_REMEDIATION_THRESHOLD || 3);

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function parseHrefToIdMap(source) {
  const map = new Map();
  const regex =
    /id:\s*'([^']+)'[\s\S]*?href:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source))) {
    map.set(match[2], match[1]);
  }
  return map;
}

function parseArray(source, name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const;`, 'm');
  const m = source.match(re);
  if (!m) return null;
  const body = m[1];
  const ids = [];
  const idRe = /'([^']+)'/g;
  let idMatch;
  while ((idMatch = idRe.exec(body))) ids.push(idMatch[1]);
  return { full: m[0], ids };
}

function replaceArray(source, name, ids) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[[\\s\\S]*?\\]\\s+as\\s+const;`, 'm');
  const next = `const ${name} = [\n${ids.map((id) => `  '${id}',`).join('\n')}\n] as const;`;
  return source.replace(re, next);
}

function main() {
  if (!fs.existsSync(STALE_REPORT_PATH) || !fs.existsSync(TOOLS_PATH) || !fs.existsSync(CATALOG_PATH)) {
    console.log('Required inputs missing; stale remediator skipped.');
    process.exit(0);
  }

  const stale = readJson(STALE_REPORT_PATH, { staleCandidates: [] });
  const staleRoutes = (stale.staleCandidates || [])
    .filter((c) => (c.consecutiveFailures || 0) >= REMEDIATION_THRESHOLD)
    .map((c) => c.route);

  if (!staleRoutes.length) {
    const report = {
      timestamp: new Date().toISOString(),
      changed: false,
      reason: 'No stale routes above remediation threshold.',
      staleRoutes: [],
      staleIds: [],
    };
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(report, null, 2));
    console.log('No stale routes to remediate.');
    return;
  }

  const toolsSource = fs.readFileSync(TOOLS_PATH, 'utf8');
  const hrefToId = parseHrefToIdMap(toolsSource);
  const staleIds = staleRoutes.map((route) => hrefToId.get(route)).filter(Boolean);

  const arrays = ['HOMEPAGE_LAB_IDS', 'LIVE_NOW_IDS', 'HERO_CTA_IDS'];
  let catalog = fs.readFileSync(CATALOG_PATH, 'utf8');
  const removed = {};
  let changed = false;

  for (const arrayName of arrays) {
    const parsed = parseArray(catalog, arrayName);
    if (!parsed) continue;
    const nextIds = parsed.ids.filter((id) => !staleIds.includes(id));
    const dropped = parsed.ids.filter((id) => staleIds.includes(id));
    if (dropped.length) {
      removed[arrayName] = dropped;
      changed = true;
      catalog = replaceArray(catalog, arrayName, nextIds);
    }
  }

  if (changed) {
    fs.writeFileSync(CATALOG_PATH, catalog);
  }

  const report = {
    timestamp: new Date().toISOString(),
    changed,
    remediationThreshold: REMEDIATION_THRESHOLD,
    staleRoutes,
    staleIds,
    removed,
  };
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`Stale promotion remediation report written: ${OUTPUT_REPORT_PATH}`);
  console.log(`Catalog changed: ${changed ? 'yes' : 'no'}`);
}

main();
