const fs = require('fs');
const path = require('path');

// Read existing services
const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const existingServices = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

// Read new services
const newServicesPath = path.join(__dirname, 'v531_v535_new_services.json');
const newServicesData = JSON.parse(fs.readFileSync(newServicesPath, 'utf8'));

// Add new services
const existingIds = new Set(existingServices.map(s => s.id));
const newServices = newServicesData.new_services.filter(s => !existingIds.has(s.id));

const updatedServices = [...existingServices, ...newServices];

// Write back
fs.writeFileSync(servicesPath, JSON.stringify(updatedServices, null, 2));

console.log(`✅ Added ${newServices.length} new services`);
console.log(`📊 Total services: ${updatedServices.length}`);
console.log(`🆕 New service IDs: ${newServices.map(s => s.id).join(', ')}`);
