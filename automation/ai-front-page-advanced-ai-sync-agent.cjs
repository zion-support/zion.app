#!/usr/bin/env node

/**
 * AI Front Page Advanced AI Services Sync Agent
 *
 * Discovers AI service pages under app/ai-services/* and ensures they are advertised
 * on the main front page: (1) Adds new Advanced AI services to app/constants/navigation.ts
 * AI_SERVICE_LINKS when missing; (2) Adds new Advanced AI service cards to the homepage
 * Advanced AI section when new /ai-services/* pages exist that are not yet in the static
 * cards. Does not remove or reorder existing entries.
 *
 * "Advanced AI" services are those under app/ai-services/ that match a known list
 * or any new subdirectory with a page.tsx. For new directories we add to nav and
 * optionally to the front page Advanced AI cards (up to MAX_FRONT_PAGE_ADD per run).
 *
 * No LLM required. Run as part of content pipelines to advertise more services on the front page.
 *
 * Options:
 *   DRY_RUN=1 - Report only, do not write files
 *   MAX_FRONT_PAGE_ADD=5 - Max new Advanced AI cards to add to homepage per run (default 5)
 *
 * Run: node automation/ai-front-page-advanced-ai-sync-agent.cjs run
 *      npm run content:advanced-ai-sync
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const AI_SERVICES_DIR = path.join(APP_DIR, 'ai-services');
const NAV_PATH = path.join(ROOT, 'app', 'constants', 'navigation.ts');
const HOME_PAGE = path.join(ROOT, 'app', 'page.tsx');
const REPORT_PATH = path.join(__dirname, 'reports', 'front-page-advanced-ai-sync-latest.json');
const DRY_RUN = process.env.DRY_RUN === '1';
const MAX_FRONT_PAGE_ADD = parseInt(process.env.MAX_FRONT_PAGE_ADD || '5', 10);

const ADVANCED_AI_ICONS = {
  'generative-ai-enterprise': '🧠',
  'ai-agents-autonomous': '🤖',
  'ai-model-orchestration': '🎛️',
  'ai-copilot-enterprise': '👤',
  'ai-multimodal-intelligence': '🎬',
  'ai-rag-knowledge-systems': '📚',
  'ai-governance-trust': '⚖️',
  'ai-observability-mlops': '📡',
  'ai-edge-realtime-inference': '⚡',
  'ai-regulated-industries': '🏛️',
  'ai-foundation-models-custom-training': '🏗️',
  'ai-security-responsible-ai': '🛡️',
  'ai-agent-safety-evaluation': '🔬',
  'ai-context-engineering-enterprise': '🔗',
  'ai-memory-agents-long-horizon': '🧩',
  'ai-finetuning-alignment-pipelines': '🎯',
};
const ADVANCED_AI_SLUGS = new Set(Object.keys(ADVANCED_AI_ICONS));
const DEFAULT_ICON = '🧠';

function ensureDirs() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function discoverAiServicePages() {
  const pages = [];
  if (!fs.existsSync(AI_SERVICES_DIR)) return pages;
  const entries = fs.readdirSync(AI_SERVICES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pagePath = path.join(AI_SERVICES_DIR, entry.name, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;
    const href = `/ai-services/${entry.name}`;
    let title = entry.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    let description = '';
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
      const descMatch = content.match(/description:\s*\n?\s*['"`]([^'"`]{20,200})['"`]/);
      if (titleMatch) title = titleMatch[1].replace(/\s*\|\s*Zion Tech Group\s*$/i, '').trim();
      if (descMatch) description = (descMatch[1] || '').trim().substring(0, 120);
    } catch (_) {}
    pages.push({
      slug: entry.name,
      href,
      title,
      description: description || `Enterprise AI for ${title}.`,
      icon: ADVANCED_AI_ICONS[entry.name] || DEFAULT_ICON,
    });
  }
  return pages.sort((a, b) => a.title.localeCompare(b.title));
}

function extractNavAiServiceHrefs(content) {
  const hrefs = new Set();
  const start = content.indexOf('export const AI_SERVICE_LINKS');
  if (start === -1) return hrefs;
  const block = content.slice(start, start + 8000);
  for (const m of block.matchAll(/href:\s*['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('/ai-services/')) hrefs.add(m[1]);
  }
  return hrefs;
}

function extractFrontPageAdvancedAiHrefs(content) {
  const hrefs = new Set();
  const section = content.indexOf('id="advanced-ai-services"');
  if (section === -1) return hrefs;
  const block = content.slice(section, section + 12000);
  for (const m of block.matchAll(/href="(\/ai-services\/[^"]+)"/g)) hrefs.add(m[1]);
  for (const m of block.matchAll(/href='(\/ai-services\/[^']+)'/g)) hrefs.add(m[1]);
  return hrefs;
}

function addToNav(navContent, toAdd) {
  if (toAdd.length === 0) return navContent;
  const insert = toAdd
    .map(
      (p) =>
        `  { name: '${(p.title || '').replace(/'/g, "\\'")}', href: '${p.href}' },`
    )
    .join('\n');
  const marker = "  { name: 'AI Security & Responsible AI', href: '/ai-services/ai-security-responsible-ai' },";
  if (!navContent.includes(marker)) return navContent;
  return navContent.replace(marker, marker + '\n' + insert);
}

function addAdvancedAiCardsToFrontPage(homeContent, toAdd) {
  if (toAdd.length === 0) return homeContent;
  const cards = toAdd
    .map(
      (p) =>
        `            <Link
              href="${p.href}"
              className="group rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-4 transition hover:border-cyan-400/50 hover:bg-slate-900/80 hover:-translate-y-0.5"
            >
              <span className="text-2xl">${p.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-white transition group-hover:text-cyan-300">
                ${p.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-slate-200">
                ${(p.description || '').replace(/</g, '&lt;').substring(0, 100)}.
              </p>
              <p className="mt-2 text-xs font-semibold text-cyan-300">Learn more →</p>
            </Link>`
    )
    .join('\n');
  const uniqueMarker =
    'HIPAA, SOC 2, EU AI Act–ready. Healthcare, finance, legal, and government.\n              </p>\n              <p className="mt-2 text-xs font-semibold text-cyan-300">Learn more →</p>\n            </Link>\n          </div>\n          <div className="mt-6 text-center">';
  if (!homeContent.includes(uniqueMarker)) return homeContent;
  return homeContent.replace(
    uniqueMarker,
    'HIPAA, SOC 2, EU AI Act–ready. Healthcare, finance, legal, and government.\n              </p>\n              <p className="mt-2 text-xs font-semibold text-cyan-300">Learn more →</p>\n            </Link>\n' +
      cards +
      '\n          </div>\n          <div className="mt-6 text-center">'
  );
}

function run() {
  ensureDirs();
  console.log('🤖 AI Front Page Advanced AI Services Sync Agent');

  const discovered = discoverAiServicePages();
  if (discovered.length === 0) {
    console.log('   No app/ai-services/* pages found');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ addedNav: [], addedFrontPage: [], reason: 'no_pages' }, null, 2));
    return { addedNav: [], addedFrontPage: [], changed: false };
  }

  let navContent = '';
  if (fs.existsSync(NAV_PATH)) navContent = fs.readFileSync(NAV_PATH, 'utf8');
  const navHrefs = extractNavAiServiceHrefs(navContent);
  const toAddNav = discovered.filter((p) => !navHrefs.has(p.href));

  let homeContent = '';
  if (fs.existsSync(HOME_PAGE)) homeContent = fs.readFileSync(HOME_PAGE, 'utf8');
  const frontHrefs = extractFrontPageAdvancedAiHrefs(homeContent);
  const toAddFrontPage = discovered
    .filter((p) => ADVANCED_AI_SLUGS.has(p.slug) && !frontHrefs.has(p.href))
    .slice(0, MAX_FRONT_PAGE_ADD);

  const report = {
    discovered: discovered.length,
    addedNav: toAddNav.map((p) => ({ title: p.title, href: p.href })),
    addedFrontPage: toAddFrontPage.map((p) => ({ title: p.title, href: p.href })),
    at: new Date().toISOString(),
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  let changed = false;

  if (toAddNav.length > 0 && navContent) {
    const newNav = addToNav(navContent, toAddNav);
    if (newNav !== navContent && !DRY_RUN) {
      fs.writeFileSync(NAV_PATH, newNav);
      console.log(`   Added ${toAddNav.length} to AI_SERVICE_LINKS: ${toAddNav.map((p) => p.title).join(', ')}`);
      changed = true;
    } else if (toAddNav.length > 0 && DRY_RUN) {
      console.log(`   [DRY_RUN] Would add to nav: ${toAddNav.map((p) => p.title).join(', ')}`);
    }
  }

  if (toAddFrontPage.length > 0 && homeContent) {
    const newHome = addAdvancedAiCardsToFrontPage(homeContent, toAddFrontPage);
    if (newHome !== homeContent && !DRY_RUN) {
      fs.writeFileSync(HOME_PAGE, newHome);
      console.log(`   Added ${toAddFrontPage.length} Advanced AI card(s) to front page: ${toAddFrontPage.map((p) => p.title).join(', ')}`);
      changed = true;
    } else if (toAddFrontPage.length > 0 && DRY_RUN) {
      console.log(`   [DRY_RUN] Would add to front page: ${toAddFrontPage.map((p) => p.title).join(', ')}`);
    }
  }

  if (!changed && toAddNav.length === 0 && toAddFrontPage.length === 0) {
    console.log(`   Advanced AI services already in sync (${discovered.length} discovered)`);
  }

  console.log('✅ Done.');
  return { addedNav: toAddNav, addedFrontPage: toAddFrontPage, changed };
}

if (require.main === module) {
  run();
}

module.exports = { run, discoverAiServicePages, extractNavAiServiceHrefs, extractFrontPageAdvancedAiHrefs };
