const fs = require('fs');
const newServices = JSON.parse(fs.readFileSync('new_services_v361_v365.json', 'utf-8'));
const tsPath = 'app/data/servicesData.ts';
let tsContent = fs.readFileSync(tsPath, 'utf-8');

const newServiceLiterals = newServices.map(s => {
  const features = s.features.map(f => `      "${f}"`).join(',\n');
  const benefits = s.benefits.map(b => `      "${b}"`).join(',\n');
  const pricing = `    basic: "${s.pricing.basic}",\n    pro: "${s.pricing.pro}",\n    enterprise: "${s.pricing.enterprise}"`;
  const contact = `    website: "/services/${s.id}",\n    email: "kleber@ziontechgroup.com",\n    phone: "+1 302 464 0950"`;
  return `  {
    id: "${s.id}",
    title: "${s.name}",
    description: "${s.description}",
    icon: "${s.icon}",
    features: [\n${features}\n    ],
    benefits: [\n${benefits}\n    ],
    pricing: {\n${pricing}\n    },
    contactInfo: {\n${contact}\n    },
    href: "/services/${s.id}",
    category: "${s.category}",
    popular: true,
    industry: "Cross-Industry"
  }`;
}).join(',\n');

const allServicesEnd = tsContent.lastIndexOf('];\n\n// Named exports');
if (allServicesEnd === -1) {
  const altEnd = tsContent.lastIndexOf('];\n');
  if (altEnd > 0) {
    tsContent = tsContent.substring(0, altEnd) + ',\n' + newServiceLiterals + '\n' + tsContent.substring(altEnd);
  }
} else {
  tsContent = tsContent.substring(0, allServicesEnd) + ',\n' + newServiceLiterals + '\n' + tsContent.substring(allServicesEnd);
}

const exportLines = newServices.map(s => {
  const varName = s.id.replace(/-/g, '_');
  return `export const ${varName} = allServices.find(s => s.id === "${s.id}");`;
}).join('\n');

tsContent += '\n// V361-V365 Service Exports\n' + exportLines + '\n';
fs.writeFileSync(tsPath, tsContent);
console.log(`Added ${newServices.length} services + exports to servicesData.ts`);
