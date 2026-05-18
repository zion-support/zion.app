
const fs = require('fs');
const content = fs.readFileSync('app/data/servicesData.ts', 'utf8');

// Extract all service objects from any service array using brace-depth tracking
const depth0Open = (ch, d) => { if (ch === '{') { if (d === 0) return true; d++; } return false; };

// We track { } depth from every category array start
const arrays = ['aiServices', 'itServices', 'cloudServices', 'securityServices', 'dataServices', 'automationServices'];
const seen = new Set();
const services = [];

for (const arrName of arrays) {
  const start = content.indexOf(`const ${arrName}`);
  if (start === -1) continue;
  const bracketIdx = content.indexOf('[', start);
  const slice = content.slice(bracketIdx);
  let depth = 0, objStart = null;
  
  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    if (c === '{') {
      if (depth === 0) objStart = bracketIdx + i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && objStart !== null) {
        const objStr = content.slice(objStart, bracketIdx + i + 1);
        try {
          // Replace unquoted JS keys with quoted
          const asObj = new Function(`return (${objStr})`)();
          if (asObj && asObj.id && !seen.has(asObj.id)) {
            services.push(asObj);
            seen.add(asObj.id);
          }
        } catch (e) {
          // skip
        }
        objStart = null;
      }
    }
  }
}

fs.writeFileSync('app/data/servicesData.json', JSON.stringify(services, null, 2));
console.log(`Extracted ${services.length} services`);
