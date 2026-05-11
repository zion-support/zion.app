#!/usr/bin/env node

/**
 * AI Broken Link & Missing Page Automation
 *
 * Audits the codebase and production site for broken internal links,
 * creates missing pages using OpenRouter LLM, and fixes broken links.
 *
 * Usage:
 *   OPENROUTER_API_KEY=xxx node automation/ai-broken-link-page-automation.cjs run
 *   OPENROUTER_API_KEY=xxx node automation/ai-broken-link-page-automation.cjs audit
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const CONFIG = {
  rootDir: process.cwd(),
  appDir: path.join(process.cwd(), 'app'),
  baseUrl: process.env.BASE_URL || 'https://ziontechgroup.com',
  excludePaths: ['#', 'mailto:', 'tel:', 'javascript:', 'data:', 'blob:', '/_next/', '/static/'],
};

async function discoverAllRoutes() {
  const routes = new Set();
  const scan = async (dir, prefix = '') => {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name.startsWith('[')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath, `${prefix}/${entry.name}`);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.ts' || entry.name === 'page.jsx') {
          const route = prefix || '/';
          routes.add(route);
          routes.add(route + (route === '/' ? '' : '/'));
        }
      }
    } catch (err) {
      // dir may not exist
    }
  };
  await scan(CONFIG.appDir);
  return routes;
}

function extractInternalLinks(content, filePath) {
  const links = new Set();
  const patterns = [
    /href=["']([^"']+)["']/g,
    /href:\s*["']([^"']+)["']/g,
    /<Link[^>]+href=["']([^"']+)["'][^>]*>/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      const url = m[1];
      if (CONFIG.excludePaths.some((p) => url.startsWith(p))) continue;
      if (url.startsWith('//')) continue; // protocol-relative external
      if (url.startsWith('/') || (!url.includes('://') && !url.startsWith('//'))) {
        const clean = url.split('?')[0].split('#')[0];
        const normalized = clean.startsWith('/') ? clean : '/' + clean;
        if (normalized && normalized !== '/') links.add(normalized.replace(/\/$/, '') || '/');
      }
    }
  }
  return Array.from(links);
}

async function collectAllReferencedLinks() {
  const links = new Set();
  const scanDir = async (dir) => {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
          await scanDir(fullPath);
        } else if (/\.(tsx?|jsx?|md|html)$/.test(entry.name)) {
          const content = await fs.readFile(fullPath, 'utf8').catch(() => '');
          for (const link of extractInternalLinks(content, fullPath)) {
            links.add(link);
          }
        }
      }
    } catch (err) {}
  };
  await scanDir(path.join(CONFIG.rootDir, 'app'));
  await scanDir(path.join(CONFIG.rootDir, 'components')).catch(() => {});
  await scanDir(path.join(CONFIG.rootDir, 'app', 'components')).catch(() => {});
  return Array.from(links);
}

async function checkProductionUrl(url) {
  const fullUrl = url === '/' ? CONFIG.baseUrl : `${CONFIG.baseUrl}${url}`;
  return new Promise((resolve) => {
    const req = https.get(fullUrl, { timeout: 8000 }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });
    req.on('error', () => resolve({ url, status: 0, ok: false }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 0, ok: false });
    });
  });
}

function routeToPath(route) {
  const clean = route.replace(/^\//, '').replace(/\/$/, '') || 'index';
  return path.join(CONFIG.appDir, clean === 'index' ? '' : clean);
}

function pathExists(filePath) {
  return fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
}

function isStaticAsset(route) {
  const norm = route.replace(/^\//, '').replace(/\/$/, '') || '';
  return /\.(svg|json|ico|png|jpg|jpeg|gif|webp|woff2?|ttf|css|js)$/i.test(norm);
}

async function pageExists(route) {
  const norm = route.replace(/^\//, '').replace(/\/$/, '') || '';
  if (!norm) return true;
  if (isStaticAsset(route)) return true; // static assets live in public/
  const dir = path.join(CONFIG.appDir, norm);
  const pagePath = path.join(dir, 'page.tsx');
  const flatPath = path.join(CONFIG.appDir, norm + '.tsx');
  return (await pathExists(pagePath)) || (await pathExists(flatPath));
}

async function audit() {
  const routes = await discoverAllRoutes();
  const referenced = await collectAllReferencedLinks();
  const missing = [];
  for (const link of referenced) {
    const norm = link.replace(/\/$/, '') || '/';
    if (norm === '/') continue;
    const exists = await pageExists(norm);
    if (!exists) missing.push(norm);
  }

  const uniqueMissing = [...new Set(missing)].filter((m) => m && m !== '/');
  return { routes: Array.from(routes), referenced, brokenLinks: uniqueMissing };
}

async function createPageWithLLM(route, llm) {
  const slug = route.replace(/^\//, '').replace(/\/$/, '');
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const systemPrompt = `You are a technical writer for Zion Tech Group (ziontechgroup.com), an AI solutions platform.
Generate a Next.js page component using ProductPageLayout. Return ONLY valid TypeScript/TSX.
Use the exact structure: ProductPageLayout with data prop containing title, category, description, iconEmoji, features (array of {title, description}), useCases (array of {title, description, icon}), benefits (string array), ctaLabel.
Keep content professional and concise. Match the style of existing Zion product pages.`;

  const userPrompt = `Create a product page for route "${route}" (slug: ${slug}).
Title: ${title}
Generate 4-6 features, 3 use cases, 4-6 benefits. Category should fit the product (e.g. "AI & Automation", "Customer Experience").
Return the full page.tsx file content, no markdown fences.`;

  const response = await llm.chat(userPrompt, { systemPrompt, maxTokens: 2048 });
  let code = response.trim();
  if (code.startsWith('```')) {
    code = code.replace(/^```(?:tsx?|jsx?)?\n?/, '').replace(/\n?```$/, '');
  }
  return code;
}

async function createMissingPage(route, llm) {
  const dir = path.join(CONFIG.appDir, route.replace(/^\//, '').replace(/\/$/, ''));
  const pagePath = path.join(dir, 'page.tsx');
  const exists = await pathExists(pagePath);
  if (exists) return { created: false, path: pagePath };

  const code = await createPageWithLLM(route, llm);
  if (!code.includes('ProductPageLayout') && !code.includes('export default')) {
    throw new Error('LLM did not return valid page component');
  }

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pagePath, code, 'utf8');
  return { created: true, path: pagePath };
}

async function run() {
  console.log('[Broken Link Page Automation] Starting audit...\n');

  const { brokenLinks } = await audit();
  if (brokenLinks.length === 0) {
    console.log('No broken internal links found. All referenced pages exist.');
    return { fixed: 0, created: [] };
  }

  console.log(`Found ${brokenLinks.length} broken/missing links:\n`);
  brokenLinks.slice(0, 30).forEach((l) => console.log(`  - ${l}`));
  if (brokenLinks.length > 30) console.log(`  ... and ${brokenLinks.length - 30} more\n`);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('\nSet OPENROUTER_API_KEY to create missing pages. Audit complete.');
    return { brokenLinks, created: [] };
  }

  const llm = createLLMClient({
    apiKey,
    model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
  });

  const created = [];
  const toCreate = brokenLinks.filter((r) => {
    const slug = r.replace(/^\//, '').replace(/\/$/, '');
    return slug && !slug.includes('[') && slug.length > 2;
  });

  for (const route of toCreate.slice(0, 10)) {
    try {
      const result = await createMissingPage(route, llm);
      if (result.created) {
        created.push(route);
        console.log(`Created: ${route} -> ${result.path}`);
      }
    } catch (err) {
      console.error(`Failed to create ${route}:`, err.message);
    }
  }

  console.log(`\nCreated ${created.length} missing pages.`);
  return { brokenLinks, created };
}

async function main() {
  const cmd = process.argv[2] || 'run';
  if (cmd === 'audit') {
    const result = await audit();
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (cmd === 'run') {
    await run();
    return;
  }
  console.log('Usage: node ai-broken-link-page-automation.cjs [run|audit]');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
