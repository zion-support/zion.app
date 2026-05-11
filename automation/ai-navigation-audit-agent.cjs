#!/usr/bin/env node

/**
 * AI Navigation Audit Agent
 *
 * Audits the Zion Tech Group site navigation for:
 * - Broken internal links (nav constants vs actual pages)
 * - Missing pages linked from navigation/footer
 * - Inconsistencies between Navigation, Footer, and sitemap
 * - Suggestions for navigation improvements (optional OpenRouter LLM)
 *
 * Usage:
 *   node automation/ai-navigation-audit-agent.cjs run     - Full audit
 *   node automation/ai-navigation-audit-agent.cjs scan  - Quick scan only
 *   node automation/ai-navigation-audit-agent.cjs fix   - Apply safe fixes (updates nav constants)
 *
 * Env: OPENROUTER_API_KEY for LLM suggestions (optional)
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const NAV_CONSTANTS = path.join(APP_DIR, 'constants', 'navigation.ts');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[NavAudit] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function discoverRoutes() {
  const routes = new Set();
  const scan = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name.startsWith('[')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath, `${prefix}/${entry.name}`);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
        routes.add(prefix || '/');
      }
    }
  };
  scan(APP_DIR);
  return routes;
}

function extractNavLinksFromConstants() {
  const content = fs.readFileSync(NAV_CONSTANTS, 'utf8');
  const links = [];
  const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    links.push(m[1]);
  }
  return [...new Set(links)];
}

function extractFooterLinks() {
  const footerPath = path.join(APP_DIR, 'components', 'Footer.tsx');
  const content = fs.readFileSync(footerPath, 'utf8');
  const links = [];
  const hrefRegex = /href=["']([^"']+)["']/g;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const url = m[1];
    if (url.startsWith('/') && !url.startsWith('//')) links.push(url);
  }
  return [...new Set(links)];
}

function extractPrimaryNavFromConstants() {
  const content = fs.readFileSync(NAV_CONSTANTS, 'utf8');
  const primary = [];
  const block = content.match(/PRIMARY_NAV_LINKS[^[]*\[([\s\S]*?)\]/);
  if (block) {
    const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = hrefRegex.exec(block[1])) !== null) {
      primary.push(m[1]);
    }
  }
  return primary;
}

function audit(routes) {
  const navLinks = extractNavLinksFromConstants();
  const footerLinks = extractFooterLinks();
  const primaryLinks = extractPrimaryNavFromConstants();

  const broken = [];
  const missing = [];
  const footerNotInNav = [];
  const navNotInFooter = [];

  for (const href of navLinks) {
    const normalized = href.split('?')[0].split('#')[0];
    if (!normalized.startsWith('/')) continue;
    if (!routes.has(normalized) && !routes.has(normalized + '/')) {
      broken.push({ href: normalized, source: 'navigation' });
    }
  }

  for (const href of footerLinks) {
    const normalized = href.split('?')[0].split('#')[0];
    if (!normalized.startsWith('/')) continue;
    if (!routes.has(normalized) && !routes.has(normalized + '/')) {
      broken.push({ href: normalized, source: 'footer' });
    }
    if (!navLinks.includes(normalized) && !primaryLinks.includes(normalized)) {
      footerNotInNav.push(normalized);
    }
  }

  for (const href of primaryLinks) {
    if (!footerLinks.includes(href)) {
      navNotInFooter.push(href);
    }
  }

  return {
    totalRoutes: routes.size,
    navLinksCount: navLinks.length,
    footerLinksCount: footerLinks.length,
    broken,
    missing,
    footerNotInNav: footerNotInNav.filter((l) => !['/contact', '/'].includes(l)),
    navNotInFooter,
    routes: Array.from(routes),
  };
}

async function callOpenRouter(prompt) {
  if (!OPENROUTER_API_KEY) return null;
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    });
    const req = https.request(
      {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.message?.content;
            resolve(text || null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function getLLMSuggestions(auditResult) {
  const prompt = `You are auditing a Next.js site navigation. Given this audit:
- Total routes: ${auditResult.totalRoutes}
- Broken links: ${JSON.stringify(auditResult.broken)}
- Footer links not in nav: ${JSON.stringify(auditResult.footerNotInNav)}
- Nav links not in footer: ${JSON.stringify(auditResult.navNotInFooter)}

Provide 3-5 concise, actionable suggestions to fix and improve the navigation. Format as a numbered list. Be specific.`;
  return callOpenRouter(prompt);
}

const FOOTER_LINK_NAMES = {
  '/products': 'Products',
  '/ai-services': 'AI Services',
  '/innovation-bundles': 'Innovation Bundles',
  '/partners': 'Partners',
  '/terms': 'Terms',
  '/privacy': 'Privacy',
};

function syncFooterLinksToNav(footerNotInNav) {
  const toAdd = footerNotInNav
    .filter((href) => FOOTER_LINK_NAMES[href] && href.startsWith('/'))
    .filter((href) => href !== '#main-content');
  if (toAdd.length === 0) return false;

  const navLinks = extractNavLinksFromConstants();
  const alreadyInNav = (href) => navLinks.includes(href);
  const stillToAdd = toAdd.filter((href) => !alreadyInNav(href));
  if (stillToAdd.length === 0) return false;

  let content = fs.readFileSync(NAV_CONSTANTS, 'utf8');
  const insertBlock = stillToAdd
    .map((href) => `  { name: '${FOOTER_LINK_NAMES[href]}', href: '${href}' },`)
    .join('\n');
  const lastEntryRe = /(\s+\{ name: '[^']+', href: '[^']+' \})\s*\]/;
  const match = content.match(lastEntryRe);
  if (!match) return false;

  content = content.replace(lastEntryRe, `${match[1]},\n${insertBlock}\n];`);
  fs.writeFileSync(NAV_CONSTANTS, content);
  stillToAdd.forEach((href) => log(`Added ${FOOTER_LINK_NAMES[href]} (${href}) to RESOURCE_LINKS`));
  return true;
}

function run() {
  ensureDirs();
  log('Starting navigation audit...');
  const routes = discoverRoutes();
  log(`Discovered ${routes.size} routes`);
  const result = audit(routes);
  const reportPath = path.join(REPORTS_DIR, 'navigation-audit-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  log(`Report written to ${reportPath}`);

  if (result.broken.length > 0) {
    log(`❌ Broken links: ${result.broken.length}`);
    result.broken.forEach((b) => log(`   - ${b.href} (${b.source})`));
  } else {
    log('✅ No broken internal links in nav/footer');
  }

  if (result.footerNotInNav.length > 0) {
    log(`Footer links not in nav: ${result.footerNotInNav.join(', ')}`);
  }

  return result;
}

async function runWithLLM() {
  const result = run();
  if (OPENROUTER_API_KEY && (result.broken.length > 0 || result.footerNotInNav.length > 0)) {
    log('Fetching LLM suggestions...');
    const suggestions = await getLLMSuggestions(result);
    if (suggestions) {
      log('LLM suggestions:');
      console.log(suggestions);
      result.llmSuggestions = suggestions;
      const reportPath = path.join(REPORTS_DIR, 'navigation-audit-latest.json');
      fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    }
  }
  return result;
}

function fix() {
  ensureDirs();
  log('Applying safe navigation fixes...');
  const routes = discoverRoutes();
  const result = audit(routes);
  let changed = false;
  if (result.footerNotInNav.length > 0) {
    if (syncFooterLinksToNav(result.footerNotInNav)) {
      changed = true;
    }
  }
  if (!changed) log('No fixes applied (already up to date)');
  return changed;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'scan') {
  const result = run();
  if (result.broken && result.broken.length > 0) process.exit(1);
} else if (cmd === 'fix') {
  fix();
} else if (cmd === 'run') {
  runWithLLM().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  console.log('Usage: node ai-navigation-audit-agent.cjs [run|scan|fix]');
  process.exit(1);
}
