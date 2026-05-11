#!/usr/bin/env node

/**
 * AI App Collections Advertiser Agent
 *
 * Adds under-featured Zion AI product pages to appCollections on the front page.
 * Complements the services advertiser (featuredApps) by surfacing more apps in
 * the AppCollectionGrid section.
 *
 * No LLM required. Uses heuristic: pick apps not yet in any collection.
 *
 * Options:
 *   MAX_ADD=3 - Max apps to add per collection per run (default 3)
 *   COLLECTIONS=Operations,Finance - Comma-separated collection titles to update (default: all)
 *
 * Run: npm run content:app-collections-advertise
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const PAGE_PATH = path.join(process.cwd(), 'app', 'page.tsx');
const APP_DIR = path.join(process.cwd(), 'app');
const REPORT_PATH = path.join(__dirname, 'reports', 'app-collections-advertiser-latest.json');
const MAX_ADD = parseInt(process.env.MAX_ADD || '5', 10);
const TARGET_COLLECTIONS = (process.env.COLLECTIONS || '').split(',').map((s) => s.trim()).filter(Boolean);

const CATEGORY_TO_COLLECTION = {
  'Customer Experience': 'Customer & Growth',
  Growth: 'Customer & Growth',
  'Decision Intelligence': 'Customer & Growth',
  Engineering: 'Engineering & DevOps',
  Security: 'Security & Infrastructure',
  Infrastructure: 'Security & Infrastructure',
  Operations: 'Operations & Automation',
  Automation: 'Operations & Automation',
  Compliance: 'Finance & Risk',
  Productivity: 'Productivity & Content',
};

function ensureDirs() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function scanZionPages() {
  const pages = [];
  const entries = fs.readdirSync(APP_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || (!entry.name.startsWith('zion-ai-') && !entry.name.startsWith('zion-'))) continue;
    const pagePath = path.join(APP_DIR, entry.name, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;
    const href = `/${entry.name}`;
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
      const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
      let name = titleMatch ? titleMatch[1] : entry.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      name = name.replace(/\s*\|\s*Zion Tech Group\s*$/i, '').trim();
      const category = categoryMatch ? categoryMatch[1] : 'Operations';
      pages.push({ name, href, category });
    } catch (_) {}
  }
  return pages;
}

function extractCollectionsWithLinks(content) {
  const collections = [];
  const appCollectionsStart = content.indexOf('const appCollections: AppCollection[] = [');
  if (appCollectionsStart < 0) return collections;
  const searchContent = content.slice(appCollectionsStart);
  const titleRe = /title:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = titleRe.exec(searchContent)) !== null) {
    const title = m[1];
    const afterTitle = searchContent.slice(m.index);
    const linksMatch = afterTitle.match(/links:\s*\[/);
    if (!linksMatch) continue;
    const linksStartOffset = m.index + linksMatch.index + linksMatch[0].length;
    let depth = 1;
    let i = linksStartOffset;
    while (i < searchContent.length && depth > 0) {
      if (searchContent[i] === '[') depth++;
      else if (searchContent[i] === ']') depth--;
      i++;
    }
    const linksEnd = appCollectionsStart + i - 1;
    const linksBlock = content.slice(appCollectionsStart + linksStartOffset, linksEnd);
    const links = [];
    for (const lm of linksBlock.matchAll(/\{\s*name:\s*['"]([^'"]+)['"],\s*href:\s*['"]([^'"]+)['"]\s*\}/g)) {
      links.push({ name: lm[1], href: lm[2] });
    }
    collections.push({ title, links, linksEnd });
  }
  return collections;
}

function heuristicSelect(pages, existingHrefs, collectionTitle, maxAdd) {
  const categoriesForCollection = Object.entries(CATEGORY_TO_COLLECTION)
    .filter(([, c]) => c === collectionTitle)
    .map(([cat]) => cat);
  const notInCollection = pages.filter((p) => !existingHrefs.has(p.href));
  const relevant = categoriesForCollection.length > 0
    ? notInCollection.filter((p) => categoriesForCollection.includes(p.category))
    : notInCollection;
  const pool = relevant.length > 0 ? relevant : notInCollection;
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(maxAdd, shuffled.length));
}

function addToCollection(content, col, apps) {
  if (apps.length === 0) return content;
  const existingHrefs = new Set(col.links.map((l) => l.href));
  const toAdd = apps.filter((a) => !existingHrefs.has(a.href));
  if (toAdd.length === 0) return content;
  const newLinks = toAdd.map((a) => `      { name: '${(a.name || '').replace(/'/g, "\\'")}', href: '${a.href}' }`);
  const insertBlock = ',\n' + newLinks.join(',\n');
  const beforeBracket = content.slice(0, col.linksEnd);
  const afterBracket = content.slice(col.linksEnd);
  return beforeBracket + insertBlock + afterBracket;
}

async function run() {
  ensureDirs();
  console.log('🤖 AI App Collections Advertiser Agent');

  const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
  const pages = scanZionPages();
  const collections = extractCollectionsWithLinks(pageContent);
  const targetTitles = TARGET_COLLECTIONS.length > 0
    ? TARGET_COLLECTIONS
    : collections.map((c) => c.title);

  let content = pageContent;
  const added = [];

  for (const title of targetTitles) {
    const cols = extractCollectionsWithLinks(content);
    const col = cols.find((c) => c.title === title);
    if (!col) continue;
    const existingHrefs = new Set(col.links.map((l) => l.href));
    const toAdd = heuristicSelect(pages, existingHrefs, title, MAX_ADD);
    if (toAdd.length > 0) {
      content = addToCollection(content, col, toAdd);
      added.push(...toAdd.map((a) => ({ collection: title, ...a })));
    }
  }

  if (added.length === 0) {
    console.log('   No new apps to add to collections');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ added: [], reason: 'none_to_add' }, null, 2));
    return;
  }

  fs.writeFileSync(PAGE_PATH, content);
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ added, at: new Date().toISOString() }, null, 2));
  console.log(`   Added ${added.length} apps to collections: ${added.map((a) => `${a.name} → ${a.collection}`).join(', ')}`);
  console.log('✅ Done.');
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { run, scanZionPages, extractCollectionsWithLinks };
