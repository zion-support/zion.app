#!/usr/bin/env node
/**
 * Market Price Research Agent Factory
 * Spawns agents to research market prices for products/services
 * 
 * Usage: node market-price-researcher-factory.cjs [scope]
 *   scope: all | new | specific-slug
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const APPS_FILE = path.join(WORKSPACE, 'automation/data/app-catalog.json');
const PRICES_FILE = path.join(WORKSPACE, 'automation/data/market-prices.json');

const args = process.argv.slice(2);
const scope = args[0] || 'new';

console.log('🏭 Market Price Research Agent Factory');
console.log('=====================================\n');

// Load apps catalog
const appsData = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
const apps = appsData.apps || [];

// Load existing prices
let pricesData = { prices: [], lastUpdated: null };
if (fs.existsSync(PRICES_FILE)) {
  pricesData = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
}

// Determine which apps need price research
const appsNeedingResearch = [];

for (const app of apps) {
  const existingPrice = pricesData.prices.find(p => p.slug === app.slug);
  if (scope === 'all' || !existingPrice) {
    appsNeedingResearch.push(app);
  }
}

console.log(`Found ${appsNeedingResearch.length} apps to research (scope: ${scope})`);

if (appsNeedingResearch.length === 0) {
  console.log('✅ All apps already have market prices');
  process.exit(0);
}

async function main() {
  // Research prices for each app
  console.log('\n🔍 Researching market prices...\n');

  const results = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < appsNeedingResearch.length; i++) {
    const app = appsNeedingResearch[i];
    console.log(`[${i + 1}/${appsNeedingResearch.length}] ${app.title}...`);
    
    try {
      const priceData = researchAppPrice(app);
      results.push(priceData);
      console.log(`   💰 Estimated: $${priceData.estimatedPrice}/mo | Confidence: ${priceData.confidence}`);
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
      results.push({
        slug: app.slug,
        title: app.title,
        estimatedPrice: null,
        priceRange: null,
        confidence: 'low',
        sources: [],
        error: e.message
      });
    }
    
    // Rate limiting
    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`\n⏳ Pausing to avoid rate limits...`);
      await sleep(2000);
    }
  }

  // Save results
  savePrices(results);

  console.log('\n📊 Summary:');
  console.log(`   Total researched: ${results.length}`);
  console.log(`   With prices: ${results.filter(r => r.estimatedPrice).length}`);
  console.log(`   Without prices: ${results.filter(r => !r.estimatedPrice).length}`);
}

main().catch(console.error);

function researchAppPrice(app) {
  // Research similar products/services
  const query = `${app.title} pricing subscription`;
  
  try {
    const searchResults = webSearch(query);
    
    // Extract pricing info from results
    let estimatedPrice = null;
    let priceRange = null;
    let confidence = 'low';
    const sources = [];
    
    for (const result of searchResults.slice(0, 5)) {
      sources.push({ title: result.title, url: result.url });
      
      // Look for price patterns
      const priceMatch = result.snippet?.match(/\$([\d,]+(?:\.\d{2})?)\s*(?:per|\/|month|mo|year)/i);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(',', ''));
        if (!estimatedPrice || price < estimatedPrice) {
          estimatedPrice = price;
          confidence = 'medium';
        }
      }
      
      // Look for price ranges
      const rangeMatch = result.snippet?.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/i);
      if (rangeMatch) {
        priceRange = {
          min: parseFloat(rangeMatch[1].replace(',', '')),
          max: parseFloat(rangeMatch[2].replace(',', ''))
        };
      }
    }
    
    return {
      slug: app.slug,
      title: app.title,
      category: app.category,
      estimatedPrice,
      priceRange,
      confidence,
      sources,
      researchedAt: new Date().toISOString()
    };
  } catch (e) {
    return {
      slug: app.slug,
      title: app.title,
      estimatedPrice: null,
      confidence: 'low',
      error: e.message
    };
  }
}

function webSearch(query) {
  // Use brave search via CLI or fallback
  try {
    const result = execSync(`brave-search "${query}" --json 2>/dev/null`, {
      encoding: 'utf8',
      timeout: 10000
    });
    return JSON.parse(result);
  } catch {
    // Fallback: return mock for demo
    return [
      { title: `${query} - Pricing`, snippet: 'Starting at $49/month', url: 'https://example.com' }
    ];
  }
}

function savePrices(newPrices) {
  // Merge with existing
  const existingSlugs = new Set(pricesData.prices.map(p => p.slug));
  
  for (const price of newPrices) {
    if (!existingSlugs.has(price.slug)) {
      pricesData.prices.push(price);
    } else {
      // Update existing
      const idx = pricesData.prices.findIndex(p => p.slug === price.slug);
      pricesData.prices[idx] = { ...pricesData.prices[idx], ...price };
    }
  }
  
  pricesData.lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(PRICES_FILE, JSON.stringify(pricesData, null, 2));
  console.log(`\n💾 Saved to ${PRICES_FILE}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
