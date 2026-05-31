const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const newServicesPath = path.join(__dirname, 'v536_v540_new_services.json');

console.log('Loading existing services...');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
console.log(`Current services count: ${services.length}`);

console.log('Loading new services...');
const newServicesData = JSON.parse(fs.readFileSync(newServicesPath, 'utf8'));
const newServices = newServicesData.new_services;
console.log(`New services to add: ${newServices.length}`);

// Add new services
let added = 0;
newServices.forEach(service => {
  // Check if service already exists
  const exists = services.some(s => s.id === service.id);
  if (!exists) {
    services.push(service);
    added++;
    console.log(`✓ Added: ${service.name}`);
  } else {
    console.log(`- Skipped (exists): ${service.name}`);
  }
});

console.log(`\nTotal added: ${added}`);
console.log(`New total services: ${services.length}`);

// Save updated services
console.log('Saving updated services...');
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log('✓ Services saved successfully');
