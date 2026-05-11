#!/usr/bin/env node

/**
 * AI Front Page Core Services Sync Agent
 *
 * Keeps the homepage "Core Services" section in sync with app/services/page.tsx.
 * Reads serviceCategories from services/page.tsx and ensures each appears in
 * app/page.tsx coreServices (same title/href/icon/description); adds any missing
 * entries. Does not remove entries from homepage that are not on /services
 * (homepage can be a superset). Uses first 4 items from each category's
 * services array for the homepage "services" bullets.
 *
 * No LLM required. Run as part of content pipelines to advertise more services
 * on the main front page.
 *
 * Options:
 *   DRY_RUN=1 - Report only, do not write app/page.tsx
 *
 * Run: node automation/ai-front-page-core-services-sync-agent.cjs run
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SERVICES_PAGE = path.join(ROOT, 'app', 'services', 'page.tsx');
const HOME_PAGE = path.join(ROOT, 'app', 'page.tsx');
const REPORT_PATH = path.join(__dirname, 'reports', 'front-page-core-services-sync-latest.json');
const DRY_RUN = process.env.DRY_RUN === '1';

function ensureDirs() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseServiceCategoriesFromSource(content) {
  const blocks = [];
  const re = /\{\s*title:\s*'([^']*)',\s*description:\s*'([^']*)',\s*icon:\s*'([^']*)',\s*services:\s*\[([\s\S]*?)\],\s*href:\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const servicesStr = m[4];
    const services = [];
    const innerRe = /'([^']+)'/g;
    let inner;
    while ((inner = innerRe.exec(servicesStr)) !== null) services.push(inner[1]);
    blocks.push({
      title: m[1],
      description: m[2],
      icon: m[3],
      href: m[5],
      services: services.slice(0, 4),
    });
  }
  return blocks;
}

function extractCoreServicesFromHomePage(content) {
  const start = content.indexOf('const coreServices: CoreService[] = [');
  if (start === -1) return [];
  const blockStart = start + 'const coreServices: CoreService[] = ['.length;
  let depth = 0;
  let end = -1;
  for (let i = blockStart; i < content.length; i++) {
    const ch = content[i];
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === -1) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return [];
  const block = content.slice(blockStart, end);
  const hrefRe = /href:\s*'([^']+)'/g;
  const hrefs = new Set();
  let m;
  while ((m = hrefRe.exec(block)) !== null) hrefs.add(m[1]);
  return hrefs;
}

function toCoreServiceBlock(entry) {
  const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const servicesStr = entry.services.map((s) => `'${esc(s)}'`).join(', ');
  return `  {
    title: '${esc(entry.title)}',
    description: '${esc(entry.description)}',
    icon: '${esc(entry.icon)}',
    href: '${esc(entry.href)}',
    services: [${servicesStr}],
  }`;
}

function applyCoreServices(homeContent, existingCoreHrefs, fromServices) {
  const toAdd = fromServices.filter((s) => !existingCoreHrefs.has(s.href));
  if (toAdd.length === 0) return homeContent;

  const newBlocks = toAdd.map(toCoreServiceBlock);
  const insert = newBlocks.join(',\n') + ',\n';
  const marker = '  },\n];\n\nconst industrySolutions';
  if (!homeContent.includes(marker)) return homeContent;
  return homeContent.replace(marker, '  },\n' + insert + '];\n\nconst industrySolutions');
}

function run() {
  ensureDirs();
  console.log('🤖 AI Front Page Core Services Sync Agent');

  if (!fs.existsSync(SERVICES_PAGE)) {
    console.log('   app/services/page.tsx not found');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ added: [], reason: 'no_services_page' }, null, 2));
    return { added: [], changed: false };
  }

  if (!fs.existsSync(HOME_PAGE)) {
    console.log('   app/page.tsx not found');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ added: [], reason: 'no_home_page' }, null, 2));
    return { added: [], changed: false };
  }

  const servicesContent = fs.readFileSync(SERVICES_PAGE, 'utf8');
  const homeContent = fs.readFileSync(HOME_PAGE, 'utf8');

  const fromServices = parseServiceCategoriesFromSource(servicesContent);
  if (fromServices.length === 0) {
    console.log('   Could not parse service categories from services page');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ added: [], reason: 'parse_failed' }, null, 2));
    return { added: [], changed: false };
  }

  const existingCore = extractCoreServicesFromHomePage(homeContent);
  const toAdd = fromServices.filter((s) => !existingCore.has(s.href));

  if (toAdd.length === 0) {
    console.log(`   Core services already in sync (${fromServices.length} categories on /services)`);
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify({ added: [], existingCount: existingCore.size, servicesCount: fromServices.length }, null, 2)
    );
    return { added: [], changed: false };
  }

  const report = { added: toAdd.map((a) => ({ title: a.title, href: a.href })), at: new Date().toISOString() };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  const newContent = applyCoreServices(homeContent, existingCore, fromServices);
  if (newContent === homeContent) {
    console.log('   No changes applied (marker not found or no new entries)');
    return { added: toAdd, changed: false };
  }

  if (!DRY_RUN) {
    fs.writeFileSync(HOME_PAGE, newContent);
    console.log(`   Added ${toAdd.length} core service(s) to front page: ${toAdd.map((a) => a.title).join(', ')}`);
  } else {
    console.log(`   [DRY_RUN] Would add ${toAdd.length} core service(s): ${toAdd.map((a) => a.title).join(', ')}`);
  }

  console.log('✅ Done.');
  return { added: toAdd, changed: !DRY_RUN };
}

if (require.main === module) {
  run();
}

module.exports = { run, extractCoreServicesFromHomePage, parseServiceCategoriesFromSource };
