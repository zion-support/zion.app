const fs = require('fs');
const path = require('path');
const { DOMParser } = require('linkedom');

const OUT_DIR = path.join(process.cwd(), 'out');
const REPORT_PATH = path.join(process.cwd(), 'service-index-report.json');

function walk(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...walk(full));
    else if (item.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function extractServiceId(file) {
  const rel = path.relative(OUT_DIR, file).replace(/\\/g, '/');
  const m = rel.match(/^services\/([^/]+)\/index\.html$/);
  return m ? m[1] : null;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.log('No out/ directory.');
    process.exit(0);
  }

  const files = walk(path.join(OUT_DIR, 'services'));
  const fileIds = new Set();
  const missingFromIndex = [];
  const missingFromSitemap = [];

  for (const file of files) {
    const sid = extractServiceId(file);
    if (sid) fileIds.add(sid);
  }

  const indexPath = path.join(OUT_DIR, 'service-index.json');
  const indexIds = new Set();
  if (fs.existsSync(indexPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      for (const svc of (data.services || [])) {
        if (svc.id) indexIds.add(svc.id);
      }
    } catch (e) {
      console.log('service-index.json parse failed:', e.message);
    }
  }

  for (const sid of fileIds) {
    if (!indexIds.has(sid)) missingFromIndex.push(sid);
  }

  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
  const sitemapIds = new Set();
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    for (const tag of (xml.match(/<loc>.*?<\/loc>/g) || [])) {
      const url = tag.replace(/<loc>|<\/loc>/g, '').trim();
      const m = url.match(/\/services\/([^/]+)\/?$/);
      if (m) sitemapIds.add(m[1]);
    }
  }

  for (const sid of fileIds) {
    if (!sitemapIds.has(sid)) missingFromSitemap.push(sid);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalServiceFiles: fileIds.size,
    indexEntries: indexIds.size,
    sitemapEntries: sitemapIds.size,
    missingFromIndex: missingFromIndex.slice(0, 200),
    missingFromSitemap: missingFromSitemap.slice(0, 200),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Service files: ${fileIds.size}`);
  console.log(`Missing from index: ${missingFromIndex.length}`);
  for (const sid of missingFromIndex.slice(0, 10)) console.log(`  ${sid}`);
  console.log(`Missing from sitemap: ${missingFromSitemap.length}`);
  for (const sid of missingFromSitemap.slice(0, 10)) console.log(`  ${sid}`);
  console.log(`Report written to ${REPORT_PATH}`);
}

main();
