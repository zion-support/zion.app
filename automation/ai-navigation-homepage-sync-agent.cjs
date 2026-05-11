#!/usr/bin/env node

/**
 * AI Navigation Homepage Sync Agent
 *
 * Scans app/page.tsx platformPageSpotlights for industry links pointing to generic
 * /solutions, /supply-chain-optimizer, or /ai-services/*. Updates them to dedicated
 * /solutions/{slug} when a solution page exists.
 *
 * Usage:
 *   node automation/ai-navigation-homepage-sync-agent.cjs run
 *   node automation/ai-navigation-homepage-sync-agent.cjs run --apply
 *
 * With --apply: writes changes to app/page.tsx
 * Without: reports suggested updates only
 *
 * Output: automation/reports/navigation-homepage-sync-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const HOMEPAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const SOLUTIONS_DIR = path.join(ROOT, 'app', 'solutions');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

const GENERIC_HREFS = ['/solutions', '/supply-chain-optimizer', '/ai-services/energy-management'];

// Title substring -> solution slug mapping (for homepage spotlight titles)
const TITLE_TO_SLUG = {
  'Mining & Resources': 'mining-natural-resources',
  'Telecommunications': 'telecommunications',
  'Automotive & Mobility': 'automotive-mobility',
  'Aerospace & Defense': 'aerospace-defense',
  'Maritime & Shipping': 'maritime-shipping',
  'Food & Beverage': 'food-beverage',
  'Oil & Gas': 'oil-gas',
  'Banking & Capital Markets': 'banking-and-capital-markets',
  'Environmental & Waste': 'environmental-waste-management',
  'Gaming & Esports': 'gaming-esports',
  'Renewable Energy': 'renewable-energy-cleantech',
  'Sports & Fitness': 'sports-fitness',
  'Consumer Goods': 'consumer-goods-cpg',
  'Transportation & Fleet': 'transportation-fleet',
  'Marketing & Advertising': 'marketing-advertising',
  'Chemicals & Materials': 'chemicals-materials',
  'Electronics & Semiconductors': 'electronics-semiconductors',
  'Space & Satellite': 'space-satellite',
  'Textiles & Apparel': 'textiles-apparel',
  'Veterinary & Animal Health': 'veterinary-animal-health',
  'Home Services & Contractors': 'home-services-contractors',
  'Accounting & Tax': 'accounting-tax-services',
  'Wholesale & Distribution': 'wholesale-distribution',
  'Restaurants & Food Service': 'restaurants-food-service',
  'Asset Management': 'asset-management',
  'Beauty & Wellness': 'beauty-wellness',
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[NavHomepageSync] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function discoverSolutionSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(SOLUTIONS_DIR)) return slugs;
  const entries = fs.readdirSync(SOLUTIONS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pagePath = path.join(SOLUTIONS_DIR, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        slugs.add(entry.name);
      }
    }
  }
  return slugs;
}

function findSlugForTitle(title, existingSlugs) {
  for (const [key, slug] of Object.entries(TITLE_TO_SLUG)) {
    if (title.includes(key) && existingSlugs.has(slug)) {
      return slug;
    }
  }
  return null;
}

function extractSpotlights(content) {
  const spotlights = [];
  const blockRe = /\{\s*title:\s*['"]([^'"]+)['"],\s*href:\s*['"]([^'"]+)['"][\s\S]*?\},/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    spotlights.push({ title: m[1], href: m[2], start: m.index, end: m.index + m[0].length, raw: m[0] });
  }
  return spotlights;
}

function run(apply = false) {
  ensureDirs();
  log('Scanning homepage platform spotlights...');

  const existingSlugs = discoverSolutionSlugs();
  const content = fs.readFileSync(HOMEPAGE_PATH, 'utf8');
  const spotlights = extractSpotlights(content);

  const updates = [];
  let newContent = content;

  for (const s of spotlights) {
    if (!GENERIC_HREFS.includes(s.href)) continue;
    const slug = findSlugForTitle(s.title, existingSlugs);
    if (!slug) continue;

    const newHref = `/solutions/${slug}`;
    if (s.href === newHref) continue;

    updates.push({ title: s.title, oldHref: s.href, newHref });
    if (apply) {
      const updatedBlock = s.raw.replace(
        new RegExp(`href:\\s*['"]${s.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
        `href: '${newHref}'`
      );
      newContent = newContent.replace(s.raw, updatedBlock);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    existingSlugsCount: existingSlugs.size,
    spotlightsScanned: spotlights.length,
    updatesCount: updates.length,
    updates,
  };

  const reportPath = path.join(REPORTS_DIR, 'navigation-homepage-sync-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report: ${reportPath}`);

  if (updates.length > 0) {
    log(`Found ${updates.length} links to update`);
    updates.forEach((u) => log(`  ${u.title}: ${u.oldHref} → ${u.newHref}`));
    if (apply) {
      fs.writeFileSync(HOMEPAGE_PATH, newContent);
      log('Applied updates to app/page.tsx');
    } else {
      log('Run with --apply to write changes');
    }
  } else {
    log('No updates needed');
  }

  return report;
}

const args = process.argv.slice(2);
const apply = args.includes('--apply');
run(apply);
