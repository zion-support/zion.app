#!/usr/bin/env node

/**
 * AI "What's New" Curator Agent
 *
 * Goal:
 * - Keep the homepage "What’s new in the Zion AI platform" strip in sync
 *   with recently shipped AI experiences and high-priority routes.
 *
 * Inputs:
 *   - automation/reports/navigation-pages-audit-latest.json
 *   - automation/data/app-catalog.json
 *   - app/ai-lab/ai-lab-tools.ts
 *
 * Behavior:
 *   - Select a small set of high-signal items (AI Lab tools, in-browser demos, key AI apps).
 *   - Update the `whatsNewItems` array in app/page.tsx when APPLY=1.
 *   - By default, only prints the curated items (no writes).
 *
 * Usage:
 *   node automation/ai-whats-new-curator-agent.cjs run
 *   APPLY=1 node automation/ai-whats-new-curator-agent.cjs run
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const APP_CATALOG_PATH = path.join(ROOT, 'automation', 'data', 'app-catalog.json');
const AI_LAB_TOOLS_PATH = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const HOME_PAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const NAV_PAGES_AUDIT_PATH = path.join(REPORTS_DIR, 'navigation-pages-audit-latest.json');
const APPLY = process.env.APPLY === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[WhatsNewCurator] ${ts} | ${msg}`);
}

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch {
    return null;
  }
  return null;
}

function readAiLabTools() {
  if (!fs.existsSync(AI_LAB_TOOLS_PATH)) return [];
  const content = fs.readFileSync(AI_LAB_TOOLS_PATH, 'utf8');
  const tools = [];
  const regex =
    /{\s*id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',[\s\S]*?href:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content))) {
    tools.push({
      id: match[1],
      slug: match[2],
      title: match[3],
      href: match[4],
    });
  }
  return tools;
}

function readAppCatalog() {
  const catalog = readJsonSafe(APP_CATALOG_PATH);
  if (!catalog || !Array.isArray(catalog.apps)) return [];
  return catalog.apps;
}

function curateItems() {
  const navAudit = readJsonSafe(NAV_PAGES_AUDIT_PATH);
  const appCatalog = readAppCatalog();
  const aiLabTools = readAiLabTools();

  const items = [];

  // 1) Prioritize AI Lab tools that are marked live/experimental.
  aiLabTools.forEach((tool) => {
    if (items.length >= 2) return;
    items.push({
      id: tool.slug,
      title: tool.title,
      description:
        tool.slug === 'rollout-blueprint'
          ? 'Turn your role, goals, and risk profile into a phased AI rollout plan powered by Zion modules.'
          : tool.slug === 'roi-ops-scorecard'
          ? 'Estimate impact across revenue, operations, and experience and see where AI should start.'
          : 'Explore how autonomous pipelines evolve ziontechgroup.com in real time.',
      href: tool.href.startsWith('/') ? tool.href : `/${tool.slug}`,
      tag: 'AI Lab',
    });
  });

  // 2) Add one or two “isNew” apps from catalog (e.g. in-browser demos).
  const newApps = appCatalog.filter((app) => app.isNew);
  newApps.slice(0, 2).forEach((app) => {
    if (items.length >= 4) return;
    items.push({
      id: app.slug,
      title: app.title,
      description:
        (app.outcomes && app.outcomes.join(' · ')) ||
        'New in-browser experience powered by Zion AI.',
      href: app.href,
      tag: 'New app',
    });
  });

  // 3) If we still have room, pick one high-value suggestion from liveNavSyncSuggestions.
  if (items.length < 4 && navAudit && navAudit.liveNavSyncSuggestions) {
    const suggested = navAudit.liveNavSyncSuggestions.suggestedAdditions || [];
    if (suggested.length > 0) {
      const first = suggested[0];
      items.push({
        id: first.href.replace(/^\//, '').replace(/[\/]/g, '-'),
        title: first.name,
        description: 'High-value route surfaced by live navigation audits.',
        href: first.href,
        tag: 'Suggested',
      });
    }
  }

  return items.slice(0, 4);
}

function updateHomePage(whatsNewItems) {
  if (!fs.existsSync(HOME_PAGE_PATH)) {
    log('Home page not found, skipping write.');
    return false;
  }
  const src = fs.readFileSync(HOME_PAGE_PATH, 'utf8');
  const startMarker = 'const whatsNewItems: WhatsNewItem[] = [';
  const startIndex = src.indexOf(startMarker);
  if (startIndex === -1) {
    log('whatsNewItems definition not found, skipping write.');
    return false;
  }
  const afterStart = startIndex + startMarker.length;
  const endIndex = src.indexOf('];', afterStart);
  if (endIndex === -1) {
    log('Could not find end of whatsNewItems array, skipping write.');
    return false;
  }

  const serialized = whatsNewItems
    .map(
      (item) =>
        `  {\n` +
        `    id: '${item.id}',\n` +
        `    title: '${item.title.replace(/'/g, "\\'")}',\n` +
        `    description:\n` +
        `      '${item.description.replace(/'/g, "\\'")}',\n` +
        `    href: '${item.href}',\n` +
        `    tag: '${item.tag}',\n` +
        `  },`,
    )
    .join('\n');

  const before = src.slice(0, afterStart);
  const after = src.slice(endIndex);
  const next = `${before}\n${serialized}\n${after}`;
  fs.writeFileSync(HOME_PAGE_PATH, next);
  log('Updated whatsNewItems in app/page.tsx');
  return true;
}

function run() {
  log('Curating what’s new items...');
  const curated = curateItems();
  if (!curated.length) {
    log('No curated items found; nothing to do.');
    return { updated: false, items: [] };
  }

  log('Curated items:');
  curated.forEach((item) => {
    log(` - [${item.tag}] ${item.title} -> ${item.href}`);
  });

  let updated = false;
  if (APPLY) {
    updated = updateHomePage(curated);
  } else {
    log('APPLY=1 not set; running in read-only mode.');
  }

  return { updated, items: curated };
}

if (require.main === module) {
  run();
}

module.exports = { run, curateItems };

