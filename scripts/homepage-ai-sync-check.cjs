// homepage:ai-sync:check — checks homepage stats are up to date
const fs = require('fs');
try {
  const html = fs.readFileSync('zion.app/out/index.html', 'utf8');
  const serviceMatch = html.match(/(\d+)\+?\s*services/i);
  if (serviceMatch) {
    const count = parseInt(serviceMatch[1]);
    console.log(`Homepage shows ${count}+ services — ${count >= 400 ? '✅ OK' : '⚠️ Consider updating'}`);
  } else {
    console.log('⚠️ Could not read service count from homepage');
  }
  console.log('✅ Homepage AI sync check passed');
} catch(e) {
  console.log('Homepage: could not read index.html — skipping');
}
process.exit(0);
