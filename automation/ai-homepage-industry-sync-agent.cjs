#!/usr/bin/env node

/**
 * AI Homepage Industry Sync Agent
 *
 * Scans app/page.tsx industrySolutions for industries linking to generic
 * /solutions, /supply-chain-optimizer, /ai-services/*, or product paths.
 * Updates hrefs to dedicated /solutions/{slug} when a solution page exists.
 *
 * Usage:
 *   node automation/ai-homepage-industry-sync-agent.cjs run
 *   node automation/ai-homepage-industry-sync-agent.cjs run --apply
 *
 * With --apply: writes changes to app/page.tsx
 * Without: reports suggested updates only
 *
 * Output: automation/reports/homepage-industry-sync-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const HOMEPAGE_PATH = path.join(ROOT, 'app', 'page.tsx');
const SOLUTIONS_DIR = path.join(ROOT, 'app', 'solutions');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

const GENERIC_HREFS = ['/solutions', '/supply-chain-optimizer', '/ai-services/energy-management'];

// Industry name (from homepage) -> solution slug
const INDUSTRY_TO_SLUG = {
  'Financial Services': 'financial-services',
  'Healthcare': 'healthcare',
  'E-Commerce & Retail': 'ecommerce-retail',
  'Real Estate & Property': 'real-estate-property',
  'Legal & Professional Services': 'legal-professional-services',
  'Education & Training': 'education-training',
  'Manufacturing & Industrial': 'manufacturing-industrial',
  'Logistics & Supply Chain': 'logistics-supply-chain',
  'Technology & SaaS': 'technology-and-saas',
  'Media & Entertainment': 'media-entertainment',
  'Energy & Utilities': 'energy-utilities',
  'Government & Public Sector': 'government-and-public-sector',
  'Hospitality & Travel': 'hospitality-travel',
  'Non-Profit & Social Impact': 'non-profit-social-impact',
  'Insurance': 'insurance',
  'Agriculture & Agritech': 'agriculture-agritech',
  'Construction & Engineering': 'construction-engineering',
  'Mining & Natural Resources': 'mining-natural-resources',
  'Pharmaceuticals & Life Sciences': 'pharmaceuticals-life-sciences',
  'Telecommunications': 'telecommunications',
  'Automotive & Mobility': 'automotive-mobility',
  'Aerospace & Defense': 'aerospace-defense',
  'Maritime & Shipping': 'maritime-shipping',
  'Food & Beverage': 'food-beverage',
  'Oil & Gas': 'oil-gas',
  'Banking & Capital Markets': 'banking-and-capital-markets',
  'Environmental & Waste Management': 'environmental-waste-management',
  'Gaming & Esports': 'gaming-esports',
  'Renewable Energy & Cleantech': 'renewable-energy-cleantech',
  'Sports & Fitness': 'sports-fitness',
  'Consumer Goods & CPG': 'consumer-goods-cpg',
  'Transportation & Fleet': 'transportation-fleet',
  'Marketing & Advertising': 'marketing-advertising',
  'Chemicals & Materials': 'chemicals-materials',
  'Electronics & Semiconductors': 'electronics-semiconductors',
  'Space & Satellite': 'space-satellite',
  'Textiles & Apparel': 'textiles-apparel',
  'Veterinary & Animal Health': 'veterinary-animal-health',
  'Home Services & Contractors': 'home-services-contractors',
  'Accounting & Tax Services': 'accounting-tax-services',
  'Wholesale & Distribution': 'wholesale-distribution',
  'Asset Management & Investment': 'asset-management',
  'Asset Management': 'asset-management',
  'Restaurants & Food Service': 'restaurants-food-service',
  'Beauty & Wellness': 'beauty-wellness',
  'Packaging & Materials': 'packaging-materials',
  'Warehousing & 3PL': 'warehousing-3pl',
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[HomepageIndustrySync] ${ts} | ${msg}`);
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

function extractIndustrySolutions(content) {
  const items = [];
  const blockRe = /\{\s*industry:\s*['"]([^'"]+)['"],[\s\S]*?href:\s*['"]([^'"]+)['"][\s\S]*?\},/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    items.push({
      industry: m[1],
      href: m[2],
      start: m.index,
      end: m.index + m[0].length,
      raw: m[0],
    });
  }
  return items;
}

function shouldUpdate(href) {
  if (href.startsWith('/solutions/')) return false;
  if (GENERIC_HREFS.includes(href)) return true;
  if (href.startsWith('/ai-services/')) return true;
  if (href.startsWith('/zion-') || href.startsWith('/property-management') || href.startsWith('/ecommerce') || href.startsWith('/medical-records')) return true;
  return false;
}

function run(apply = false) {
  ensureDirs();
  log('Scanning homepage industrySolutions...');

  const existingSlugs = discoverSolutionSlugs();
  const content = fs.readFileSync(HOMEPAGE_PATH, 'utf8');
  const items = extractIndustrySolutions(content);

  const updates = [];
  let newContent = content;

  for (const item of items) {
    if (!shouldUpdate(item.href)) continue;
    const slug = INDUSTRY_TO_SLUG[item.industry];
    if (!slug || !existingSlugs.has(slug)) continue;

    const newHref = `/solutions/${slug}`;
    if (item.href === newHref) continue;

    updates.push({ industry: item.industry, oldHref: item.href, newHref });
    if (apply) {
      const updatedBlock = item.raw.replace(
        new RegExp(`href:\\s*['"]${item.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
        `href: '${newHref}'`
      );
      newContent = newContent.replace(item.raw, updatedBlock);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    existingSlugsCount: existingSlugs.size,
    itemsScanned: items.length,
    updatesCount: updates.length,
    updates,
  };

  const reportPath = path.join(REPORTS_DIR, 'homepage-industry-sync-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report: ${reportPath}`);

  if (updates.length > 0) {
    log(`Found ${updates.length} links to update`);
    updates.forEach((u) => log(`  ${u.industry}: ${u.oldHref} → ${u.newHref}`));
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
