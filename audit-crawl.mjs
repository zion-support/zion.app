import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, 'out');

function walkHtml(dir, base = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || entry.name === 'api') continue;
      results = results.concat(walkHtml(full, base + '/' + entry.name));
    } else if (entry.name.endsWith('.html')) {
      const file = fs.readFileSync(full, 'utf-8');
      const rel = (base + '/' + entry.name).replace(/^\/+/, '').replace(/\/index$/, '') || '/';
      const links = [];
      const re = /href="(\/[^"]+)"/g;
      let m;
      while ((m = re.exec(file))) {
        const href = m[1];
        if (href.startsWith('//') || /^https?:\/\//.test(href) || href.startsWith('/#')) continue;
        links.push(href);
      }
      results.push({ path: rel, links: [...new Set(links)] });
    }
  }
  return results;
}

const pages = walkHtml(OUT_DIR);
const seen = new Set();
const toCheck = [];
for (const p of pages) {
  for (const link of p.links) {
    let norm = String(link).replace(/\/$/, '');
    const qIdx = norm.indexOf('?');
    if (qIdx !== -1) norm = norm.slice(0, qIdx);
    if (!norm.startsWith('/')) norm = '/' + norm;
    if (!seen.has(norm)) {
      seen.add(norm);
      toCheck.push(norm);
    }
  }
}

function existsInOut(target) {
  const rel = target.replace(/^\//, '').replace(/\/$/, '');
  if (!rel) return true;
  return fs.existsSync(path.join(OUT_DIR, rel, 'index.html')) || fs.existsSync(path.join(OUT_DIR, rel));
}

let ok = 0, fail = 0, issues = [];
for (const raw of toCheck) {
  let u = String(raw).replace(/\/$/, '');
  const qIdx = u.indexOf('?');
  if (qIdx !== -1) u = u.slice(0, qIdx);
  if (u.startsWith('//') || /^https?:\/\//.test(u)) { ok++; continue; }
  if (!u.startsWith('/')) u = '/' + u;
  if (!existsInOut(u)) {
    if (!u.startsWith('/api/')) {
      fail++;
      issues.push({ url: u, status: 404 });
      if (issues.length < 40) console.log(`  MISSING ${u}`);
      continue;
    }
    if (!fs.existsSync(path.join(OUT_DIR, u.replace(/^\//, '')))) {
      fail++;
      issues.push({ url: u, status: 404 });
      if (issues.length < 40) console.log(`  MISSING ${u}`);
      continue;
    }
  }
  ok++;
}

console.log(`Pages: ${pages.length}, Unique internal links: ${toCheck.length}`);
console.log(`OK: ${ok}, MISSING: ${fail}`);

fs.writeFileSync(path.resolve(__dirname, 'crawl-report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), pages: pages.length, internalLinks: toCheck.length, ok, fail, missing: issues }, null, 2));
console.log('Report written to crawl-report.json');
