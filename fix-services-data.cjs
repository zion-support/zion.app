// fix-services-data.cjs — Fix placeholder content in servicesData.json
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'app', 'data', 'servicesData.json');
let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

console.log(`Loaded ${data.length} services`);

// Industry mappings based on service category and keywords
const industryMap = {
  // AI services
  'ai': 'Technology',
  'it': 'Technology',
  'cloud': 'Technology',
  'security': 'Cybersecurity',
  'data': 'Data & Analytics',
  'automation': 'Business Operations',
};

// Specific industry detection from service ID/title/description
function detectIndustry(service) {
  const text = (service.id + ' ' + service.title + ' ' + service.description).toLowerCase();
  
  // Healthcare
  if (text.includes('health') || text.includes('medical') || text.includes('clinical') || text.includes('patient') || text.includes('disease') || text.includes('pharma') || text.includes('drug') || text.includes('hospital') || text.includes('diagnos')) {
    return 'Healthcare';
  }
  
  // Finance
  if (text.includes('bank') || text.includes('financ') || text.includes('insurance') || text.includes('invest') || text.includes('trading') || text.includes('payment') || text.includes('loan') || text.includes('credit') || text.includes('fraud') || text.includes('risk') || text.includes('compliance') || text.includes('audit') || text.includes('tax') || text.includes('accounting')) {
    return 'Financial Services';
  }
  
  // Retail/E-commerce
  if (text.includes('retail') || text.includes('e-commerce') || text.includes('ecommerce') || text.includes('shop') || text.includes('store') || text.includes('product') || text.includes('inventory') || text.includes('warehouse') || text.includes('supply chain') || text.includes('logistics') || text.includes('shipping') || text.includes('delivery') || text.includes('fulfillment')) {
    return 'Retail & E-Commerce';
  }
  
  // Manufacturing
  if (text.includes('manufacturing') || text.includes('factory') || text.includes('production') || text.includes('assembly') || text.includes('quality') || text.includes('inspection') || text.includes('industrial') || text.includes('iot') || text.includes('sensor')) {
    return 'Manufacturing';
  }
  
  // Education
  if (text.includes('education') || text.includes('learning') || text.includes('training') || text.includes('student') || text.includes('course') || text.includes('teaching') || text.includes('school') || text.includes('university')) {
    return 'Education';
  }
  
  // Marketing
  if (text.includes('marketing') || text.includes('campaign') || text.includes('advertising') || text.includes('seo') || text.includes('content') || text.includes('social media') || text.includes('email') || text.includes('brand') || text.includes('customer') || text.includes('crm') || text.includes('sales')) {
    return 'Marketing & Sales';
  }
  
  // Government
  if (text.includes('government') || text.includes('public sector') || text.includes('regulatory') || text.includes('compliance') || text.includes('legal') || text.includes('contract')) {
    return 'Government & Public Sector';
  }
  
  // Energy/Sustainability
  if (text.includes('energy') || text.includes('sustainability') || text.includes('climate') || text.includes('carbon') || text.includes('renewable') || text.includes('esg') || text.includes('environment')) {
    return 'Energy & Sustainability';
  }
  
  // Real Estate
  if (text.includes('real estate') || text.includes('property') || text.includes('building') || text.includes('construction') || text.includes('facility')) {
    return 'Real Estate & Construction';
  }
  
  // Agriculture
  if (text.includes('agriculture') || text.includes('agritech') || text.includes('farm') || text.includes('crop') || text.includes('livestock')) {
    return 'Agriculture';
  }
  
  // Transportation
  if (text.includes('transport') || text.includes('fleet') || text.includes('vehicle') || text.includes('autonomous') || text.includes('driving') || text.includes('aviation') || text.includes('aerospace')) {
    return 'Transportation & Logistics';
  }
  
  // Telecommunications
  if (text.includes('telecom') || text.includes('5g') || text.includes('network') || text.includes('wireless') || text.includes('broadband')) {
    return 'Telecommunications';
  }
  
  // Media & Entertainment
  if (text.includes('media') || text.includes('entertainment') || text.includes('gaming') || text.includes('video') || text.includes('audio') || text.includes('music') || text.includes('streaming')) {
    return 'Media & Entertainment';
  }
  
  // Cybersecurity specific
  if (text.includes('security') || text.includes('cyber') || text.includes('threat') || text.includes('vulnerability') || text.includes('penetration') || text.includes('firewall') || text.includes('encryption') || text.includes('zero trust')) {
    return 'Cybersecurity';
  }
  
  // Default based on category
  return industryMap[service.category] || 'Technology';
}

// Generate specific benefits based on service
function generateBenefits(service) {
  const text = (service.id + ' ' + service.title).toLowerCase();
  const category = service.category;
  
  const benefitsByCategory = {
    ai: [
      'Reduce manual processing time by 80%+',
      'Improve decision accuracy with AI insights',
      'Scale operations without headcount growth',
      'Real-time predictions and recommendations',
    ],
    it: [
      'Reduce infrastructure costs by 40%+',
      'Improve system uptime to 99.9%+',
      'Automate routine IT operations',
      'Enhance security posture',
    ],
    cloud: [
      'Reduce cloud spend by 30-50%',
      'Auto-scale to meet demand',
      'Improve deployment velocity',
      'Enterprise-grade reliability',
    ],
    security: [
      'Reduce breach risk by 90%+',
      'Automated threat detection and response',
      'Compliance-ready security posture',
      '24/7 monitoring and incident response',
    ],
    data: [
      'Turn raw data into actionable insights',
      'Real-time analytics and dashboards',
      'Reduce reporting time by 75%+',
      'Single source of truth across the organization',
    ],
    automation: [
      'Eliminate repetitive manual tasks',
      'Reduce process time by 85%+',
      'Error-free execution at scale',
      'Free up team for high-value work',
    ],
  };
  
  const defaults = benefitsByCategory[category] || benefitsByCategory.ai;
  
  // Pick 3-4 benefits based on service ID hash for consistency
  const hash = service.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const start = hash % (defaults.length - 3);
  return defaults.slice(start, start + 4);
}

// Generate specific description if placeholder
function fixDescription(service) {
  if (service.description && service.description.length > 50 && service.description !== 'Service description.') {
    return service.description; // Already has real content
  }
  
  // Generate a meaningful description from the title and features
  const title = service.title;
  const category = service.category.toUpperCase();
  
  if (service.features && service.features.length > 1) {
    const featureList = service.features.slice(0, 3).join(', ');
    return `${title} — a professional ${category} solution featuring ${featureList.toLowerCase()}. Delivered by Zion Tech Group with enterprise-grade support, custom pricing, and proven implementation methodology.`;
  }
  
  return `${title} — a professional ${category} solution delivered by Zion Tech Group. Enterprise-grade capabilities enable organizations to streamline operations, accelerate growth, and achieve measurable ROI.`;
}

// Fix all services
let fixed = { industry: 0, benefits: 0, description: 0, pricing: 0 };

data = data.map(service => {
  const original = JSON.stringify(service);
  
  // Fix industry
  if (!service.industry || service.industry === 'General') {
    service.industry = detectIndustry(service);
    fixed.industry++;
  }
  
  // Fix benefits
  if (!service.benefits || service.benefits.length <= 1) {
    service.benefits = generateBenefits(service);
    fixed.benefits++;
  }
  
  // Fix description
  if (!service.description || service.description.length < 40 || service.description === 'Service description.') {
    service.description = fixDescription(service);
    fixed.description++;
  }
  
  // Fix pricing
  if (!service.pricing || Object.keys(service.pricing).length === 0) {
    service.pricing = { basic: '99', pro: '499', enterprise: '25000' };
    fixed.pricing++;
  }
  
  return service;
});

// Save
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

console.log('\n=== FIXES APPLIED ===');
console.log(`Industry: ${fixed.industry}`);
console.log(`Benefits: ${fixed.benefits}`);
console.log(`Description: ${fixed.description}`);
console.log(`Pricing: ${fixed.pricing}`);
console.log(`\nTotal services: ${data.length}`);
console.log('Saved to:', dataFile);
