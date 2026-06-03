const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const outDir = path.join(process.cwd(), 'out');
const reportPath = path.join(process.cwd(), 'external-links-report.json');
const MAX_CONCURRENCY = 6;
const REQUEST_TIMEOUT = 8000;
const USER_AGENT = 'ZionTechGroup-LinkChecker/1.0 (+https://ziontechgroup.com)';

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...walk(full));
    else if (item.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function extractLinks(file) {
  const content = fs.readFileSync(file, 'utf8');
  const hrefRegex = /(?:href|src)=["']([^"']+)["']/gi;
  const urls = new Set();
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const url = match[1];
    if (!url || url.startsWith('data:') || url.startsWith('javascript:') || url.startsWith('blob:') || url.startsWith('#')) continue;
    if (url.startsWith('http://') || url.startsWith('https://')) urls.add(url);
  }
  return Array.from(urls);
}

function request(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'user-agent': USER_AGENT, 'accept': '*/*' }, timeout: REQUEST_TIMEOUT }, (res) => {
      // status captured in resolve below
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ url, status: res.statusCode }));
    });
    req.on('error', () => resolve({ url, status: null }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: null });
    });
  });
}

async function main() {
  if (!fs.existsSync(outDir)) {
    console.log('No out/ directory. Exiting.');
    process.exit(0);
  }
  const files = walk(outDir);
  console.log(`Scanning ${files.length} HTML files for external links...`);
  const queue = [];
  const seen = new Set();
  for (const file of files) {
    for (const url of extractLinks(file)) {
      if (!seen.has(url)) {
        seen.add(url);
        queue.push(url);
      }
    }
  }
  console.log(`Found ${queue.length} unique external URLs.`);
  const broken = [];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      const result = await request(url);
      if (result.status === null || result.status >= 400) {
        broken.push({ url, status: result.status });
      }
    }
  }
  const workers = [];
  for (let i = 0; i < Math.min(MAX_CONCURRENCY, queue.length || 1); i++) workers.push(worker());
  await Promise.all(workers);
  const sorted = broken.sort((a, b) => (a.status || 0) - (b.status || 0));
  const report = {
    generatedAt: new Date().toISOString(),
    totalExternalUrls: seen.size,
    brokenCount: sorted.length,
    broken: sorted.slice(0, 200),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report written to ${reportPath}`);
  console.log(`Broken external links: ${sorted.length}`);
  if (sorted.length) {
    console.log('First 10 broken links:');
    for (const item of sorted.slice(0, 10)) console.log(`  ${item.url} => ${item.status}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
