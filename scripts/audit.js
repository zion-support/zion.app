// Comprehensive audit of servicesData.ts
const fs = require('fs');
const path = require('path');

function* walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) yield* walkDir(p);
    else yield p;
  }
}

const src = fs.readFileSync('app/data/servicesData.ts', 'utf8');

// 1. Per-category counts
function countArrayEntries(src, varName) {
  const startKey = `export const ${varName}: Service[] = [`;
  const i = src.indexOf(startKey);
  if (i === -1) return null;
  let depth = 0, started = false;
  for (let j = i + startKey.length - 1; j < src.length; j++) {
    if (src[j] === '[') { depth++; started = true; }
    else if (src[j] === ']') { depth--; }
    if (started && depth === 0) {
      const chunk = src.substring(i, j);
      return (chunk.match(/\n  {\n/g) || []).length;
    }
  }
  return null;
}

const categories = ['aiServices', 'itServices', 'cloudServices', 'securityServices', 'dataServices', 'automationServices'];
let total = 0;
const counts = {};
for (const cat of categories) {
  const n = countArrayEntries(src, cat);
  counts[cat] = n;
  if (n) total += n;
}
console.log('Category counts:', JSON.stringify(counts));
console.log('Total services:  ', total);

// 2. IDs + dupes
const ids = [...src.matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]);
const s = {};
for (const id of ids) s[id] = (s[id] || 0) + 1;
const dupes = Object.entries(s).filter(([k, v]) => v > 1);
console.log('\nIDs found: ', ids.length);
console.log('Unique IDs:', Object.keys(s).length);
console.log('Dupes:     ', dupes.length ? JSON.stringify(dupes) : 'None');

// 3. App file structure
console.log('\n--- TypeScript files in app/ ---');
for (const f of [...walkDir('app')].filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))) {
  console.log(' ', f);
}

// 4. Navigation sources
console.log('\n--- Navigation sources ---');
const navPaths = ['app/data/navigation.ts', 'app/data/nav.ts', 'app/components/Navigation.tsx',
                  'navigation.ts', 'app/components/Header.tsx'];
for (const p of navPaths) {
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    console.log('  Found:', p, '(' + stat.size, 'bytes)');
  }
}

// 5. Page count
const pages = [...walkDir('app')].filter(f => f.match(/\/page\.tsx$/));
console.log('\nPage files:', pages.length);
pages.forEach(p => console.log(' ', p));
