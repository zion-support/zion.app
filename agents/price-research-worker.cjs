#!/usr/bin/env node
/**
 * Price Research Worker Agent
 * Single agent that researches one product/service price
 * 
 * Input: { slug, title, category }
 * Output: { slug, title, estimatedPrice, priceRange, confidence, sources }
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);

// Parse input (passed as JSON or slug)
let input;
try {
  input = args[0] ? JSON.parse(args[0]) : { slug: args[0] };
} catch {
  input = { slug: args[0] };
}

if (!input.slug) {
  console.error('Usage: node price-research-worker.cjs <slug>');
  process.exit(1);
}

console.log(`🔍 Researching: ${input.title || input.slug}`);

async function main() {
  const result = await researchPrice(input);
  console.log(JSON.stringify(result, null, 2));
}

async function researchPrice(app) {
  const query = `${app.title || app.slug} pricing subscription monthly`;
  
  try {
    // Use brave search
    const results = await braveSearch(query);
    
    let estimatedPrice = null;
    let priceRange = null;
    let confidence = 'low';
    const sources = [];
    
    for (const r of results.slice(0, 5)) {
      sources.push({ title: r.title, url: r.url, snippet: r.snippet });
      
      // Extract price patterns
      const priceMatch = r.snippet?.match(/\$([\d,]+(?:\.\d{2})?)\s*\/?\s*(mo|month|per|year)/i);
      if (priceMatch) {
        let price = parseFloat(priceMatch[1].replace(',', ''));
        // Normalize to monthly
        if (priceMatch[2] === 'year') price = price / 12;
        if (!estimatedPrice || price < estimatedPrice) {
          estimatedPrice = Math.round(price);
          confidence = 'medium';
        }
      }
      
      // Range
      const rangeMatch = r.snippet?.match(/\$([\d,]+)\s*[-to]+\s*\$([\d,]+)/i);
      if (rangeMatch) {
        priceRange = {
          min: parseInt(rangeMatch[1].replace(',', '')),
          max: parseInt(rangeMatch[2].replace(',', ''))
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
      sources: sources.slice(0, 3),
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

function braveSearch(query) {
  try {
    const result = execSync(`curl -s "https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5" -H "Accept: application/json" 2>/dev/null || echo '{"web_results":[]}'`, {
      encoding: 'utf8',
      timeout: 15000
    });
    const data = JSON.parse(result);
    return (data.web_results || []).map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.description
    }));
  } catch {
    return [];
  }
}

main();
