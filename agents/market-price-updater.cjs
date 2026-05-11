#!/usr/bin/env node
/**
 * Market Price Updater Agent
 * Updates app-catalog.json with market prices and purchase links
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const APPS_FILE = path.join(WORKSPACE, 'automation/data/app-catalog.json');
const PRICES_FILE = path.join(WORKSPACE, 'automation/data/market-prices.json');

console.log('💰 Market Price Updater Agent');
console.log('============================\n');

// Load apps
const appsData = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
const apps = appsData.apps || [];

// Load prices
let pricesData = { prices: [], lastUpdated: null };
if (fs.existsSync(PRICES_FILE)) {
  pricesData = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
}

console.log(`Loaded ${apps.length} apps and ${pricesData.prices.length} price records`);

// Update apps with prices
let updatedCount = 0;
const updatedApps = apps.map(app => {
  const priceInfo = pricesData.prices.find(p => p.slug === app.slug);
  
  if (priceInfo && priceInfo.estimatedPrice) {
    updatedCount++;
    return {
      ...app,
      price: priceInfo.estimatedPrice,
      priceRange: priceInfo.priceRange,
      priceConfidence: priceInfo.confidence,
      purchaseUrl: `/checkout?product=${app.slug}`,
      pricingSources: priceInfo.sources?.slice(0, 3) || [],
      lastPriceUpdate: priceInfo.researchedAt
    };
  }
  
  return app;
});

// Save updated catalog
appsData.apps = updatedApps;
appsData.lastPriceUpdate = new Date().toISOString();

fs.writeFileSync(APPS_FILE, JSON.stringify(appsData, null, 2));

console.log(`\n✅ Updated ${updatedCount} apps with prices`);
console.log(`📄 Saved to ${APPS_FILE}`);

// Generate purchase links summary
const withPrices = updatedApps.filter(a => a.price);
console.log(`\n📊 Summary:`);
console.log(`   Apps with prices: ${withPrices.length}/${apps.length}`);
console.log(`   Avg price: $${Math.round(withPrices.reduce((sum, a) => sum + a.price, 0) / withPrices.length)}/mo`);
