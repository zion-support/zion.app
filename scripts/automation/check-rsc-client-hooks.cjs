const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const ent of entries) {
    if (ent.name.startsWith('.')) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const root = process.argv[2] || 'app';
if (!fs.existsSync(root)) {
  console.log(`ok: ${root} missing (skip)`);
  process.exit(0);
}

const reactHookRe = /\buse(State|Effect|Ref|Reducer|Memo|Callback|LayoutEffect)\b/;
const nextNavHookRe =
  /\buse(Router|Pathname|SearchParams|Params|SelectedLayoutSegment|SelectedLayoutSegments)\b/;
const clientDirectiveRe = /^\s*['"]use client['"]\s*;?/m;

const pages = walk(root).filter((f) => /page\.(t|j)sx?$/.test(f));
const offenders = [];

for (const file of pages) {
  const src = fs.readFileSync(file, 'utf8');
  const usesClientOnlyHooks = reactHookRe.test(src) || nextNavHookRe.test(src);
  if (usesClientOnlyHooks && !clientDirectiveRe.test(src)) offenders.push(file);
}

if (!offenders.length) {
  console.log(`ok: no RSC hook violations in ${root}`);
  process.exit(0);
}

console.error('React Server Components guard failed.');
console.error('These pages use client-only hooks without "use client":');
for (const f of offenders) console.error(`- ${f}`);
process.exit(1);

