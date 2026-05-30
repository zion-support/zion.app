const fs = require('fs');
const newServices = JSON.parse(fs.readFileSync('new_services_v351_v355.json', 'utf-8'));
const tsPath = 'app/data/servicesData.ts';
let tsContent = fs.readFileSync(tsPath, 'utf-8');

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
    features: [\n${features}\n    ],
    benefits: [\n${benefits}\n    ],
    pricing: {\n${pricing}\n    },
    contactInfo: {\n${contact}\n    },
    href: "${s.href}",
    category: "${s.category}",
    popular: ${s.popular},
    industry: "${s.industry}"
  }`;
}).join(',\n');

// Find allServices array end and insert
const allServicesEnd = tsContent.lastIndexOf('];\n\n// Named exports');
if (allServicesEnd === -1) {
  // Try alternate pattern
  const altEnd = tsContent.lastIndexOf('];\n');
  if (altEnd > 0) {
    tsContent = tsContent.substring(0, altEnd) + ',\n' + newServiceLiterals + '\n' + tsContent.substring(altEnd);
  }
} else {
  tsContent = tsContent.substring(0, allServicesEnd) + ',\n' + newServiceLiterals + '\n' + tsContent.substring(allServicesEnd);
}

// Add named exports
const exportLines = newServices.map(s => {
  const varName = s.id.replace(/-/g, '_');
  return `export const ${varName} = allServices.find(s => s.id === "${s.id}");`;
}).join('\n');

tsContent += '\n// V351-V355 Service Exports\n' + exportLines + '\n';
fs.writeFileSync(tsPath, tsContent);
console.log(`Added ${newServices.length} services + exports to servicesData.ts`);
