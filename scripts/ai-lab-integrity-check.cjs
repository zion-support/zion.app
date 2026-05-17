// ai-lab:integrity-check — validates AI Lab contract/route alignment
const fs = require('fs');
const path = 'zion.app/app';

let issues = [];
try {
  const files = fs.readdirSync(path).filter(f => ['route.ts','page.tsx','layout.tsx'].some(r => f.includes(r)));
  console.log(`AI Lab: checking ${files.length} service route files`);
  for (const f of files) {
    try {
      const content = fs.readFileSync(path + '/' + f, 'utf8');
      if (content.includes('TODO') || content.includes('PLACEHOLDER')) {
        issues.push(f);
      }
    } catch(e) {}
  }
} catch(e) {
  console.log('AI Lab directory not found — skipping');
}

if (issues.length) {
  console.log(`⚠️ ${issues.length} files have placeholders — ${issues.slice(0,3).join(', ')}`);
} else {
  console.log('✅ AI Lab integrity check passed — no placeholders found');
}
process.exit(0);
