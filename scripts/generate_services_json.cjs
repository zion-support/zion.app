#!/usr/bin/env node
/**
 * generate_services_json.cjs — structured service feed for next-gen features
 *
 * Reads:  app/data/servicesData.json
 * Writes: out/data/services.json
 *
 * Output per service: id, title, description, href, category, industry
 * Plus: generated timestamp + category breakdown
 *
 * Consumers: status page probes, /search page, service widgets, AI chatbot RAG
 */
const fs   = require('fs');
const path = require('path');

const SRC  = path.resolve(path.join(__dirname, '..', 'app', 'data', 'servicesData.json'));
const OUT  = path.join(process.cwd(), 'out', 'data', 'services.json');

function main() {
  // ── Load source data ──
  let source = [];
  try {
    source = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  } catch(e) {
    console.error('FATAL: cannot read servicesData.json:', e.message);
    process.exit(1);
  }
  console.log(`services.json: loaded ${source.length} entries from servicesData.json`);

  // ── Project to feed schema ──
  const feed = source
    .filter(svc => svc.id && svc.title)                    // skip malformed
    .map(svc => ({
      id:            svc.id,
      title:         svc.title,
      description:   svc.description || '',
      href:          svc.href || `/services/${svc.id}`,
      category:      svc.category || inferCategory(svc.id),
      industry:      svc.industry || 'General',
      popular:       svc.popular || false,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  // ── Category breakdown ──
  const byCat = {};
  for (const s of feed) byCat[s.category] = (byCat[s.category] || 0) + 1;

  // ── Write output ──
  const output = {
    generated:   new Date().toISOString(),
    count:       feed.length,
    categories:  byCat,
    services:    feed,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2));

  console.log(`services.json: ${output.count} services → ${OUT}`);
  console.log(`Categories: ${JSON.stringify(byCat)}`);
}

function inferCategory(id) {
  const m = /^(ai|it|cloud|security|data|automation)-/.exec(id);
  return m ? m[1] : 'ai';
}

try { main(); } catch(e) { console.error(e); process.exit(1); }
