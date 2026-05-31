const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'app', 'data', 'servicesData.json');
const tsPath = path.join(__dirname, '..', 'app', 'data', 'servicesData.ts');

const allData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let ts = '// Auto-generated services data\n';

ts += `export interface Service {\n`;
ts += `  id: string;\n  name?: string;\n  title?: string;\n  category: string;\n`;
ts += `  description: string;\n  price?: string;\n  icon?: string;\n`;
ts += `  features?: string[];\n  contactInfo?: { phone?: string; email?: string; address?: string };\n`;
ts += `  link?: string;\n  [key: string]: unknown;\n}\n\n`;

ts += 'export const allServices: Service[] = ';
ts += JSON.stringify(allData, null, 2);
ts += ';\n\n';

ts += `export const servicesData = allServices;\n`;
ts += `export const aiServices = allServices.filter(s => /ai/i.test(s.category));\n`;
ts += `export const itServices = allServices.filter(s => /^it$/i.test(s.category) || /it services/i.test(s.category));\n`;
ts += `export const cloudServices = allServices.filter(s => /cloud/i.test(s.category));\n`;
ts += `export const securityServices = allServices.filter(s => /security/i.test(s.category));\n`;
ts += `export const dataServices = allServices.filter(s => /data/i.test(s.category));\n`;
ts += `export const automationServices = allServices.filter(s => /automation/i.test(s.category));\n`;
ts += `export const microSaasServices = allServices.filter(s => /micro.?saas/i.test(s.category));\n`;
ts += `export const devopsServices = allServices.filter(s => /devops/i.test(s.category));\n`;
ts += `export const blockchainServices = allServices.filter(s => /blockchain/i.test(s.category));\n`;
ts += `export const iotServices = allServices.filter(s => /iot/i.test(s.category));\n`;
ts += `export const emailIntelligenceServices = allServices.filter(s => /email/i.test(s.category));\n\n`;

ts += `export function getServiceById(id: string): Service | undefined {
  return allServices.find(s => s.id === id);
}

export function getServicesByCategory(category: string): Service[] {
  return allServices.filter(s => s.category.toLowerCase() === category.toLowerCase());
}

export function getPopularServices(limit = 20): Service[] {
  return allServices.slice(0, limit);
}
`;

fs.writeFileSync(tsPath, ts);
console.log(`Generated servicesData.ts with ${allData.length} services`);
