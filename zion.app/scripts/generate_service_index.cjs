#!/usr/bin/env node
/**
 * generate_service_index.cjs
 *
 * Reads every service object from servicesData.ts via bracket-depth scanning,
 * writes out/public/service-index.json.
 *
 * Why CJS: works in Node without extra loaders or ts-node.
 */
const fs   = require('fs');
const path = require('path');

const DAT = path.resolve(path.join(__dirname, '..', 'app', 'data', 'servicesData.ts'));
const OUT = path.resolve(path.join(__dirname, '..',  'out', 'service-index.json'));

// Regex patterns
const ID_RX     = /id:\s*'([^']+)'/g;
const TITLE_RX  = /title:\s*'([^']+)'/;
const DESC_RX   = /description:\s*'([^']+)'/;
const CAT_RX    = /category:\s*'(\w+)'/;
const BAS_RX    = /'basic':\s*'([^']*)'/;
const PRO_RX    = /'pro':\s*'([^']*)'/;
const ENT_RX    = /'enterprise':\s*'([^']*)'/;
const POP_RX    = /popular:\s*(true|false)/;
const FEAT_RX   = /features:\s*\[([^\]]*)\]/;
const BENE_RX   = /benefits:\s*\[([^\]]*)\]/;

function extractArray(str) {
  // Find all '...' entries inside [...]
  return Array.from(str.matchAll(/'([^']+)'/g), m => m[1]);
}

function main() {
  const content = fs.readFileSync(DAT, 'utf8');
  const n = content.length;

  const allIds = Object.fromEntries(ID_RX.exec(content) ? [
    ...content.matchAll(ID_RX)
  ].map(m => [m[1], true]) : []);
  const idList = Object.keys(allIds);

  ID_RX.lastIndex = 0;  // reset global

  const services = [];

  for (const m of content.matchAll(ID_RX)) {
    const sid = m[1];

    // Find the '{' that opens this object — look back up to 10 chars
    let start = content.lastIndexOf('{', m.index);
    if (start < 0) start = m.index;

    // Walk forward tracking brace depth
    let depth = 0;
    let inStr  = false;
    let strCh  = null;
    let end    = m.index;

    for (let i = start; i < Math.min(start + 8000, n); i++) {
      const c = content[i];

      if (inStr) {
        if (c === '\\') { i++; continue; }
        if (c === strCh) inStr = false;
        continue;
      }

      if (c === "'" || c === '"') {
        inStr = true; strCh = c; continue;
      }
      if (c === '{') { depth++; continue; }
      if (c === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }

    if (depth !== 0) continue;  // incomplete block, skip

    const block = content.slice(start, end);

    const title  = TITLE_RX.exec(block);
    const desc   = DESC_RX.exec(block);
    const cat    = CAT_RX.exec(block);
    const bas    = BAS_RX.exec(block);
    const pro    = PRO_RX.exec(block);
    const ent    = ENT_RX.exec(block);
    const pop    = POP_RX.exec(block);
    const featM  = FEAT_RX.exec(block);
    const beneM  = BENE_RX.exec(block);

    if (!cat) continue;

    services.push({
      id:         sid,
      title:      title ? title[1] : sid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: desc  ? desc[1]  : '',
      category:   cat   ? cat[1]   : 'ai',
      features:   featM ? extractArray(featM[1]) : [],
      benefits:   beneM ? extractArray(beneM[1]) : [],
      basic:      bas   ? bas[1]   : '',
      pro:        pro   ? pro[1]   : '',
      enterprise: ent   ? ent[1]   : '',
      popular:    pop   ? pop[1] === 'true' : false,
    });
  }

  // Deduplicate preserving order
  const seen = new Set();
  const uniq = services.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });

  const byCat = {};
  for (const s of uniq) byCat[s.category] = (byCat[s.category] || 0) + 1;

  const index = {
    generated:  new Date().toISOString(),
    count:      uniq.length,
    categories: byCat,
    services:   uniq.sort((a, b) => a.id.localeCompare(b.id)),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index, null, 2));

  console.log(`service-index.json: ${uniq.length} services → ${OUT}`);
  console.log(`Categories: ${JSON.stringify(byCat)}`);
}

try { main(); } catch(e) { console.error(e.message || e); process.exit(1); }
