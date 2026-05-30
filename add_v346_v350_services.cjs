const fs = require('fs');
const path = require('path');

// Read new services from JSON
const newServices = JSON.parse(fs.readFileSync('new_services_v346_v350.json', 'utf-8'));

// Read current servicesData.ts
const tsPath = 'app/data/servicesData.ts';
let tsContent = fs.readFileSync(tsPath, 'utf-8');

// Find the allServices array and add new services
const allServicesMatch = tsContent.match(/export const allServices: Service\[\] = \[([\s\S]*?)\];/);
if (!allServicesMatch) {
  console.error('Could not find allServices array');
  process.exit(1);
}

// Convert new services to TypeScript object literals
const newServiceLiterals = newServices.map(s => {
  const features = s.features.map(f => `      "${f}"`).join(',\n');
  const benefits = s.benefits.map(b => `      "${b}"`).join(',\n');
  const pricing = `    basic: "${s.pricing.basic}",\n    pro: "${s.pricing.pro}",\n    enterprise: "${s.pricing.enterprise}"`;
  const contact = `    website: "${s.contactInfo.website}",\n    email: "${s.contactInfo.email}",\n    phone: "${s.contactInfo.phone}"`;
  
  return `  {
    id: "${s.id}",
    title: "${s.title}",
    description: "${s.description}",
    icon: "${s.icon}",
    features: [
${features}
    ],
    benefits: [
${benefits}
    ],
    pricing: {
${pricing}
    },
    contactInfo: {
${contact}
    },
    href: "${s.href}",
    category: "${s.category}",
    popular: ${s.popular},
    industry: "${s.industry}"
  }`;
}).join(',\n');

// Insert before the closing bracket of allServices
const insertPoint = allServicesMatch[1].lastIndexOf('  }');
if (insertPoint === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

const before = tsContent.substring(0, allServicesMatch.index + allServicesMatch[0].indexOf(allServicesMatch[1]) + insertPoint + 3);
const after = tsContent.substring(allServicesMatch.index + allServicesMatch[0].indexOf(allServicesMatch[1]) + insertPoint + 3);

tsContent = before + ',\n' + newServiceLiterals + after;

// Add named exports for new services
const exportLines = newServices.map(s => {
  const varName = s.id.replace(/-/g, '_');
  return `export const ${varName} = allServices.find(s => s.id === "${s.id}");`;
}).join('\n');

tsContent += '\n\n// V346-V350 Service Exports\n' + exportLines + '\n';

fs.writeFileSync(tsPath, tsContent);
console.log(`✅ Added ${newServices.length} services to servicesData.ts`);
console.log(`✅ Added ${newServices.length} named exports`);
