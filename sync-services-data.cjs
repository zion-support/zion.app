// Sync servicesData.ts with servicesData.json
const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, 'app', 'data', 'servicesData.json');
const tsFile = path.join(__dirname, 'app', 'data', 'servicesData.ts');

// Read the JSON data
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

// Generate the TS file
const tsContent = `// Service data for AI and IT solutions
// Auto-generated from servicesData.json — do not edit manually

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: Record<string, string>;
  contactInfo: {
    website: string;
    email: string;
    phone: string;
  };
  icon: string;
  href: string;
  popular?: boolean;
  stage?: string;
  category: string;
  industry: string;
}

export const allServices: Service[] = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(tsFile, tsContent);
console.log(`Synced ${data.length} services to servicesData.ts`);
