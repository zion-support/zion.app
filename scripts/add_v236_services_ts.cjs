const fs = require('fs');
const services = JSON.parse(fs.readFileSync('app/data/servicesData.json', 'utf8'));
const tsPath = 'app/data/servicesData.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Find the export const allServices array
const exportMatch = tsContent.match(/export const allServices: Service\[\] = \[([\s\S]*?)\];/);
if (!exportMatch) {
  console.error('Could not find allServices export');
  process.exit(1);
}

// Generate TypeScript entries for new services
const newTsEntries = services.slice(-26).map(s => `  {
    id: '${s.id}',
    title: '${s.title.replace(/'/g, "\\'")}',
    description: '${s.description.replace(/'/g, "\\'")}',
    icon: '${s.icon}',
    category: '${s.category}',
    features: [${s.features.map(f => `'${f.replace(/'/g, "\\'")}'`).join(', ')}],
    benefits: [${s.benefits.map(b => `'${b.replace(/'/g, "\\'")}'`).join(', ')}],
    pricing: {
      basic: '${s.pricing.basic}',
      pro: '${s.pricing.pro}',
      enterprise: '${s.pricing.enterprise}'
    },
    href: '${s.href}',
    popular: ${s.popular},
    industry: '${s.industry}'
  }`).join(',\n');

// Insert before the closing bracket
const insertPoint = tsContent.lastIndexOf('];');
const newContent = tsContent.slice(0, insertPoint) + ',\n' + newTsEntries + '\n' + tsContent.slice(insertPoint);

fs.writeFileSync(tsPath, newContent);
console.log('Added 26 services to TypeScript file');
