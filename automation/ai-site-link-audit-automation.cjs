#!/usr/bin/env node

/**
 * AI Site Link Audit Automation
 *
 * Crawls the live production site (ziontechgroup.com), extracts internal links,
 * validates each link's HTTP status, and optionally creates missing pages via OpenRouter LLM.
 *
 * Usage:
 *   OPENROUTER_API_KEY=xxx node automation/ai-site-link-audit-automation.cjs run
 *   node automation/ai-site-link-audit-automation.cjs audit
 *   OPENROUTER_API_KEY=xxx node automation/ai-site-link-audit-automation.cjs run --create-pages
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const CONFIG = {
  rootDir: process.cwd(),
  appDir: path.join(process.cwd(), 'app'),
  baseUrl: process.env.BASE_URL || 'https://ziontechgroup.com',
  excludePaths: ['#', 'mailto:', 'tel:', 'javascript:', 'data:', 'blob:', '/_next/', '/static/', '/icon', '/manifest', '/og-'],
  crawlPaths: [
    '/',
    '/about',
    '/services',
    '/products',
    '/ai-services',
    '/solutions',
    '/solutions/beauty-wellness',
    '/solutions/legal-professional-services',
    '/solutions/education-training',
    '/solutions/packaging-materials',
    '/solutions/warehousing-3pl',
    '/solutions/asset-management',
    '/solutions/financial-services',
    '/solutions/insurance',
    '/solutions/healthcare',
    '/solutions/government-and-public-sector',
    '/solutions/banking-and-capital-markets',
    '/solutions/telecommunications',
    '/solutions/technology-and-saas',
    '/solutions/ecommerce-retail',
    '/solutions/manufacturing-industrial',
    '/solutions/logistics-supply-chain',
    '/solutions/media-entertainment',
    '/solutions/real-estate-property',
    '/solutions/agriculture-agritech',
    '/solutions/automotive-mobility',
    '/solutions/energy-utilities',
    '/solutions/renewable-energy-cleantech',
    '/solutions/mining-natural-resources',
    '/solutions/food-beverage',
    '/solutions/veterinary-animal-health',
    '/solutions/home-services-contractors',
    '/solutions/hospitality-travel',
    '/solutions/non-profit-social-impact',
    '/solutions/construction-engineering',
    '/solutions/pharmaceuticals-life-sciences',
    '/solutions/aerospace-defense',
    '/solutions/maritime-shipping',
    '/solutions/oil-gas',
    '/solutions/environmental-waste-management',
    '/solutions/gaming-esports',
    '/solutions/sports-fitness',
    '/solutions/consumer-goods-cpg',
    '/solutions/transportation-fleet',
    '/solutions/marketing-advertising',
    '/solutions/chemicals-materials',
    '/solutions/electronics-semiconductors',
    '/solutions/space-satellite',
    '/solutions/textiles-apparel',
    '/solutions/accounting-tax-services',
    '/solutions/wholesale-distribution',
    '/solutions/restaurants-food-service',
    '/contact',
    '/case-studies',
    '/blog',
    '/industries',
    '/community',
    '/automation',
    '/consultation',
    '/micro-saas-services',
    '/pricing',
    '/search',
    '/careers',
    '/terms',
    '/privacy',
    '/innovation-bundles',
    '/workflow-automation',
    '/partners',
    '/site-map',
  ],
  requestTimeout: 10000,
  concurrency: 5,
};

function fetchUrl(url) {
  const fullUrl = url.startsWith('http') ? url : `${CONFIG.baseUrl}${url}`;
  return new Promise((resolve, reject) => {
    const req = https.get(fullUrl, { timeout: CONFIG.requestTimeout }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body, finalUrl: res.headers.location }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function extractInternalLinks(html) {
  const links = new Set();
  const patterns = [
    /href=["'](\/[^"']*)["']/g,
    /href:\s*["'](\/[^"']*)["']/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const raw = m[1];
      const clean = raw.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
      if (CONFIG.excludePaths.some((p) => clean.startsWith(p))) continue;
      if (/\.(svg|json|ico|png|jpg|jpeg|gif|webp|woff2?|ttf|css|js)$/i.test(clean)) continue;
      if (clean === '/' || (clean.length > 1 && clean.startsWith('/'))) {
        links.add(clean || '/');
      }
    }
  }
  return Array.from(links);
}

async function checkLinkStatus(url) {
  try {
    const fullUrl = `${CONFIG.baseUrl}${url}`;
    const result = await new Promise((resolve) => {
      const req = https.get(fullUrl, { timeout: 8000 }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () =>
          resolve({
            url,
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 400,
          })
        );
      });
      req.on('error', () => resolve({ url, status: 0, ok: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ url, status: 0, ok: false });
      });
    });
    return result;
  } catch {
    return { url, status: 0, ok: false };
  }
}

async function crawlAndCollectLinks() {
  const allLinks = new Set();
  for (const p of CONFIG.crawlPaths) {
    try {
      const { body } = await fetchUrl(p);
      for (const link of extractInternalLinks(body)) {
        allLinks.add(link);
      }
    } catch (err) {
      console.warn(`[Site Link Audit] Failed to fetch ${p}:`, err.message);
    }
  }
  return Array.from(allLinks).filter((l) => l && l !== '/');
}

async function saveReport(result) {
  const reportPath = path.join(CONFIG.rootDir, 'automation', 'reports', 'site-link-audit-latest.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl: CONFIG.baseUrl,
        ...result,
      },
      null,
      2
    ),
    'utf8'
  );
  return reportPath;
}

async function auditLiveSite(saveReportFile = false) {
  console.log('[Site Link Audit] Crawling live site...\n');
  const links = await crawlAndCollectLinks();
  console.log(`Collected ${links.length} unique internal links.\n`);

  const results = [];
  const batchSize = CONFIG.concurrency;
  for (let i = 0; i < links.length; i += batchSize) {
    const batch = links.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkLinkStatus));
    results.push(...batchResults);
  }

  const broken = results.filter((r) => !r.ok);
  const ok = results.filter((r) => r.ok);

  const result = {
    totalLinks: links.length,
    ok: ok.length,
    broken: broken.length,
    brokenLinks: broken.map((r) => ({ url: r.url, status: r.status })),
    allLinks: links,
    internalLinks: links.length,
    pagesChecked: CONFIG.crawlPaths.length,
  };

  if (saveReportFile) {
    const reportPath = await saveReport(result);
    console.log(`Report saved to ${reportPath}\n`);
  }

  return result;
}

async function pageExists(route) {
  const norm = route.replace(/^\//, '').replace(/\/$/, '') || '';
  if (!norm) return true;
  const dir = path.join(CONFIG.appDir, norm);
  const pagePath = path.join(dir, 'page.tsx');
  return fs.access(pagePath).then(() => true).catch(() => false);
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
  const exists = await fs.access(pagePath).then(() => true).catch(() => false);
  if (exists) return { created: false, path: pagePath };

  const code = await createPageWithLLM(route, llm);
  if (!code.includes('ProductPageLayout') && !code.includes('export default')) {
    throw new Error('LLM did not return valid page component');
  }

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pagePath, code, 'utf8');
  return { created: true, path: pagePath };
}

async function run(createPages = false) {
  const result = await auditLiveSite(true);

  console.log('--- Results ---');
  console.log(`Total links checked: ${result.totalLinks}`);
  console.log(`OK: ${result.ok}`);
  console.log(`Broken: ${result.broken}\n`);

  if (result.broken > 0) {
    console.log('Broken links:');
    result.brokenLinks.forEach((b) => console.log(`  ${b.url} -> ${b.status}`));
  }

  await saveReport(result);
  console.log(`\nReport saved to automation/reports/site-link-audit-latest.json`);

  if (result.broken === 0) {
    return result;
  }

  if (!createPages) {
    console.log('\nRun with --create-pages to create missing pages via OpenRouter LLM.');
    return result;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('\nSet OPENROUTER_API_KEY to create missing pages.');
    return result;
  }

  const llm = createLLMClient({
    apiKey,
    model: process.env.OPENROUTER_MODEL || 'openrouter/free',
  });

  const created = [];
  const toCreate = result.brokenLinks
    .filter((b) => b.status === 404)
    .map((b) => b.url)
    .filter((r) => {
      const slug = r.replace(/^\//, '').replace(/\/$/, '');
      return slug && !slug.includes('[') && slug.length > 2;
    });

  for (const route of toCreate.slice(0, 10)) {
    try {
      const res = await createMissingPage(route, llm);
      if (res.created) {
        created.push(route);
        console.log(`Created: ${route} -> ${res.path}`);
      }
    } catch (err) {
      console.error(`Failed to create ${route}:`, err.message);
    }
  }

  console.log(`\nCreated ${created.length} missing pages.`);
  result.created = created;
  return result;
}

async function validate() {
  const result = await auditLiveSite(true);
  if (result.broken > 0) {
    console.error(`[Site Link Audit] FAIL: ${result.broken} broken link(s) found`);
    result.brokenLinks.forEach((b) => console.error(`  ${b.url} -> ${b.status}`));
    process.exit(1);
  }
  console.log(`[Site Link Audit] OK: ${result.ok} links validated, 0 broken`);
}

async function main() {
  const args = process.argv.slice(2);
  const createPages = args.includes('--create-pages');

  if (args.includes('validate')) {
    await validate();
    return;
  }

  if (args.includes('audit')) {
    const result = await auditLiveSite(true);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  await run(createPages);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
