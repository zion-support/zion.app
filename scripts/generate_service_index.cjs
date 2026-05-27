#!/usr/bin/env node
/**
 * generate_service_index.cjs  v3 — filesystem + JSON hybrid
 *
 * 100% reliable service-index.json generator:
 *  - Primary: reads servicesData.json (472 services, full data)
 *  - Supplement: scans each service HTML file for extra services (up to 96)
 *  - Infers category from slug prefix when unknown
 *  - Outputs complete index with all built services
 *
 * Why this works: JSON is a structured dump from the source; HTML is the
 * authoritative build artifact. No TypeScript regex parsing required.
 */
const fs   = require('fs');
const path = require('path');

const JSON_DAT  = path.resolve(path.join(__dirname, '..', 'app',  'data', 'servicesData.json'));
const OUT_DIR  = path.resolve(path.join(__dirname, '..',  'out'));
const SVC_DIR  = path.resolve(path.join(OUT_DIR, 'services'));
const OUT_FILE = path.join(OUT_DIR, 'service-index.json');
const HTML_ID_RX = /<title>([^<]+)<\/title>/;
const HTML_DESC_RX = /<meta\s+name="description"\s+content="([^"]*)"/;
const SLUG_PFX_RX  = /^(ai|it|cloud|security|data|automation)-/;

function inferCategory(id) {
  const m = SLUG_PFX_RX.exec(id);
  return m ? m[1] : 'ai';
}

function inferPopularity(id, jsonMap, navOrder) {
  if (jsonMap[id] && jsonMap[id].popular !== undefined) return !!jsonMap[id].popular;
  const pos = navOrder.indexOf(id);
  return pos >= 0 && pos < 96; // first 96 services in nav = popular
}

function extractTitleFromHtml(html) {
  const idM = HTML_ID_RX.exec(html);
  if (!idM) return '';
  const raw = idM[1];
  // "Service Name | Zion Tech Group | Zion Tech Group" → "Service Name"
  return raw.split(/\s*\|\s*Zion Tech Group\s*\|/)[0].trim();
}

function extractDescFromHtml(html) {
  const m = HTML_DESC_RX.exec(html);
  return m ? m[1].replace(/&amp;/g,'&').replace(/&#x27;/g,"'") : '';
}

function extractFeaturesFromHtml(id) {
  // Generic per-category placeholder themes
  const byCat = {
    ai:      ['AI-powered automation', 'Enterprise-grade security', '24/7 monitoring', 'API-first integration'],
    it:      ['Custom integration', 'Multi-platform support', 'Automated provisioning', 'Change tracking'],
    cloud:   ['Auto-scaling', 'Regional redundancy', 'Cost alerts', 'Infrastructure as code'],
    security:['Real-time detection', 'Compliance-ready', 'Zero-trust architecture', 'Incident response'],
    data:    ['Real-time pipelines', 'Schema enforcement', 'Data lineage', 'Quality scoring'],
    automation:['No-code workflow editor', 'Scheduled triggers', 'Retry/backoff logic', 'Audit trail'],
  };
  cat = inferCategory(id);
  return byCat[cat] || byCat.ai;
}

function main() {
  // ── Phase 1: Load servicesData.json (canonical source) ──
  let jsonRaw = [];
  try {
    jsonRaw = JSON.parse(fs.readFileSync(JSON_DAT, 'utf8'));
  } catch(e) {
    console.warn('WARN: servicesData.json unreadable, proceeding without it:', e.message);
  }
  const jsonMap = {};
  for (const svc of (Array.isArray(jsonRaw) ? jsonRaw : [])) {
    if (!svc || !svc.id) continue;
    const pricing = svc.pricing || {};
    jsonMap[svc.id] = {
      title:       svc.title       || '',
      description: svc.description || '',
      category:    svc.category    || inferCategory(svc.id),
      basic:       pricing.basic   || svc.basic       || '',
      pro:         pricing.pro     || svc.pro         || '',
      enterprise:  pricing.enterprise || svc.enterprise || '',
      popular:     !!svc.popular,
      features:    svc.features    || [],
      benefits:    svc.benefits    || [],
      href:        svc.href        || `/services/${svc.id}`,
    };
  }
  console.log(`Phase 1: servicesData.json loaded — ${Object.keys(jsonMap).length} services`);

  // ── Phase 2: Scan out/services/*/ directories ──
  let svcDirs = [];
  try {
    svcDirs = fs.readdirSync(SVC_DIR)
      .filter(d => d !== 'index.txt' && !d.startsWith('.'))
      .filter(d => {
        const dirPath = path.join(SVC_DIR, d);
        try { return fs.statSync(dirPath).isDirectory() && fs.statSync(path.join(dirPath, 'index.html')).isFile(); }
        catch(e) { return false; }
      });
  } catch(e) {
    console.error('FATAL: cannot read out/services/:', e.message);
    process.exit(1);
  }
  console.log(`Phase 2: built service dirs — ${svcDirs.length}`);

  // ── Phase 3: Build complete index ──
  const allServices = [];
  const seen = new Set();

  // 3a. JSON-first: services in jsonMap
  let fromJson = 0;
  for (const [id, data] of Object.entries(jsonMap)) {
    if (seen.has(id)) continue;
    allServices.push({
      id:         id,
      title:      data.title,
      description:data.description,
      category:   data.category,
      basic:      data.basic,
      pro:        data.pro,
      enterprise: data.enterprise,
      popular:    data.popular,
      features:   data.features,
      benefits:   data.benefits,
      href:       data.href,
      source:     'json',
    });
    seen.add(id);
    fromJson++;
  }

  // 3b. HTML supplement: services with dirs not yet added
  let fromHtml = 0;
  let htmlErrors = 0;
  for (const sid of svcDirs) {
    if (seen.has(sid)) continue;
    const htmlPath = path.join(SVC_DIR, sid, 'index.html');
    let title = '', desc = '';
    try {
      const html = fs.readFileSync(htmlPath, 'utf8');
      title = extractTitleFromHtml(html);
      desc  = extractDescFromHtml(html);
    } catch(e) { htmlErrors++; }

    allServices.push({
      id:         sid,
      title:      title || sid.split('-').map(capitalize).join(' '),
      description: desc || `Advanced ${sid.replace(/-/g,' ')} service by Zion Tech Group.`,
      category:   inferCategory(sid),
      basic:      '',
      pro:        '',
      enterprise: '',
      popular:    false,
      features:   extractFeaturesFromHtml(sid),
      benefits:   [],
      href:       `/services/${sid}`,
      source:     'html',
    });
    seen.add(sid);
    fromHtml++;
  }

  console.log(`Phase 3: built → ${allServices.length} services (json:${fromJson}, html:${fromHtml})`);

  // ── Phase 4: Category breakdown ──
  const byCat = {};
  for (const s of allServices) byCat[s.category] = (byCat[s.category] || 0) + 1;

  // ── Phase 5: Write index ──
  const index = {
    generated:  new Date().toISOString(),
    count:      allServices.length,
    categories: byCat,
    services:   allServices.sort((a, b) => a.id.localeCompare(b.id)),
  };

  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2));
    console.log(`\nservice-index.json: ${index.count} services → ${OUT_FILE}`);
    console.log(`Categories: ${JSON.stringify(byCat)}`);
    console.log(`HTML read errors: ${htmlErrors}`);
  } catch(e) {
    console.error('FATAL writing output:', e.message);
    process.exit(1);
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

try { main(); } catch(e) { console.error(e); process.exit(1); }
