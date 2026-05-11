#!/usr/bin/env node

/**
 * AI Front Page Services Advertiser Agent
 *
 * Promotes under-featured Zion AI product pages to the main front page.
 * Scans app/zion-ai-* and app/zion-* pages, compares with featuredApps,
 * and adds 2-4 apps that are not yet prominently featured.
 *
 * Uses local LLM (Ollama primary, OpenRouter fallback) for smarter selection.
 * Falls back to heuristic (pick apps not in featuredApps) when LLM unavailable.
 *
 * Options:
 *   MAX_ADD=8 - Max apps to add per run (default 8)
 *
 * Run: npm run content:front-page-advertise
 *      (Ollama: ollama serve, ollama pull llama3.2:3b — or set OPENROUTER_API_KEY)
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const PAGE_PATH = path.join(process.cwd(), 'app', 'page.tsx');
const APP_DIR = path.join(process.cwd(), 'app');
const DATA_DIR = path.join(__dirname, 'data');
const REPORT_PATH = path.join(__dirname, 'reports', 'front-page-services-advertiser-latest.json');
const MAX_ADD = parseInt(process.env.MAX_ADD || '8', 10);

const CATEGORIES = [
  'Customer Experience', 'Growth', 'Decision Intelligence', 'Engineering',
  'Security', 'Infrastructure', 'Productivity', 'Operations', 'Compliance',
  'Automation',
];

const ICONS_BY_CATEGORY = {
  'Customer Experience': '🎧',
  'Growth': '📈',
  'Decision Intelligence': '📊',
  'Engineering': '💻',
  'Security': '🛡️',
  'Infrastructure': '🔗',
  'Productivity': '⚡',
  'Operations': '📦',
  'Compliance': '✅',
  'Automation': '🛠️',
};

function ensureDirs() {
  [DATA_DIR, path.dirname(REPORT_PATH)].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function scanZionPages() {
  const seen = new Set();
  const pages = [];
  const entries = fs.readdirSync(APP_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || (!entry.name.startsWith('zion-ai-') && !entry.name.startsWith('zion-'))) continue;
    const pagePath = path.join(APP_DIR, entry.name, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;
    const href = `/${entry.name}`;
    if (seen.has(href)) continue;
    seen.add(href);
      try {
        const content = fs.readFileSync(pagePath, 'utf8');
        const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
        const descMatch = content.match(/description:\s*\n?\s*['"`]([^'"`]{20,150})['"`]/);
        const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
        let name = titleMatch ? titleMatch[1] : entry.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        name = name.replace(/\s*\|\s*Zion Tech Group\s*$/i, '').trim();
        const desc = descMatch ? (descMatch[1] || '').trim() : '';
        const description = desc.length >= 20 ? desc.substring(0, 120) : `AI-powered ${name} for modern teams.`;
        const category = categoryMatch ? categoryMatch[1] : 'Operations';
        pages.push({ name, href, category, description });
    } catch (_) {
      // skip
    }
  }
  return pages;
}

function extractFeaturedAppsHrefs(content) {
  const hrefs = new Set();
  const matches = content.matchAll(/href:\s*['"]([^'"]+)['"]/g);
  const start = content.indexOf('const featuredApps: FeaturedApp[] = [');
  const end = content.indexOf('];', start) + 2;
  const section = content.slice(start, end);
  for (const m of section.matchAll(/href:\s*['"]([^'"]+)['"]/g)) {
    hrefs.add(m[1]);
  }
  return hrefs;
}

function heuristicSelect(pages, featuredHrefs, maxAdd = 3) {
  const notFeatured = pages.filter((p) => !featuredHrefs.has(p.href));
  if (notFeatured.length === 0) return [];
  const shuffled = notFeatured.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(maxAdd, notFeatured.length));
}

async function llmSelect(pages, featuredHrefs, maxAdd = 3) {
  try {
    const { createLLMClient } = require('./lib/openrouter-client.cjs');
    const client = createLLMClient({
      openrouterModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
    });
    if (!client.isConfigured()) return null;

    const notFeatured = pages.filter((p) => !featuredHrefs.has(p.href));
    if (notFeatured.length === 0) return [];

    const prompt = `You are a content strategist for Zion Tech Group (ziontechgroup.com). Pick up to ${maxAdd} apps to promote on the front page. Return ONLY a JSON array of hrefs to add, e.g. ["/zion-ai-x", "/zion-ai-y"]. Pick apps that would appeal to businesses (growth, operations, customer experience). Available apps (href, name, category):
${notFeatured.slice(0, 40).map((p) => `  ${p.href} - ${p.name} (${p.category})`).join('\n')}`;

    const response = await client.chat(prompt, {
      systemPrompt: 'Return ONLY a JSON array of strings. No markdown, no explanation.',
      temperature: 0.5,
      maxTokens: 256,
    });

    let jsonStr = response.trim();
    const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) jsonStr = codeBlock[1].trim();
    const hrefs = JSON.parse(jsonStr);
    if (!Array.isArray(hrefs)) return heuristicSelect(pages, featuredHrefs, maxAdd);
    return hrefs
      .filter((h) => typeof h === 'string' && notFeatured.some((p) => p.href === h))
      .map((h) => notFeatured.find((p) => p.href === h))
      .filter(Boolean)
      .slice(0, maxAdd);
  } catch (_) {
    return null;
  }
}

function applyFeaturedApps(content, apps) {
  if (apps.length === 0) return content;

  const blocks = apps.map((app) => {
    const cat = app.category || 'Operations';
    const icon = ICONS_BY_CATEGORY[cat] || '🤖';
    const desc = (app.description || '').replace(/'/g, "\\'").substring(0, 120);
    return `  {
    name: '${(app.name || '').replace(/'/g, "\\'")}',
    href: '${app.href}',
    category: '${cat.replace(/'/g, "\\'")}',
    description: '${desc}',
    icon: '${icon}',
  }`;
  });

  const insert = blocks.join(',\n') + ',\n';
  const marker = '  },\n];\n\nconst spotlightPillars';
  if (!content.includes(marker)) return content;
  return content.replace(marker, '  },\n' + insert + '];\n\nconst spotlightPillars');
}

async function run() {
  ensureDirs();
  console.log('🤖 AI Front Page Services Advertiser Agent');

  const pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
  const pages = scanZionPages();
  const featuredHrefs = extractFeaturedAppsHrefs(pageContent);

  console.log(`   Found ${pages.length} Zion product pages, ${featuredHrefs.size} already featured`);

  let toAdd = await llmSelect(pages, featuredHrefs, MAX_ADD);
  if (!toAdd || toAdd.length === 0) {
    toAdd = heuristicSelect(pages, featuredHrefs, MAX_ADD);
  }

  if (toAdd.length === 0) {
    console.log('   No new apps to add (all pages already featured or none available)');
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ added: [], reason: 'none_to_add' }, null, 2));
    return;
  }

  const report = { added: toAdd, at: new Date().toISOString() };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  const newContent = applyFeaturedApps(pageContent, toAdd);
  if (newContent === pageContent) {
    console.log('   No changes applied (insert marker not found)');
    return;
  }

  fs.writeFileSync(PAGE_PATH, newContent);
  console.log(`   Added ${toAdd.length} apps to front page: ${toAdd.map((a) => a.name).join(', ')}`);
  console.log('✅ Done.');
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { run, scanZionPages, heuristicSelect };
