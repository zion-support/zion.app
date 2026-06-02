#!/usr/bin/env node
/** Rebuild app/data/servicesData.json from the TypeScript build output */
const fs = require('fs');
const path = require('path');

// The TS file exports arrays. We can extract them by evaluating just the data.
// Since tsc compiles TS to a .next directory, let's use that.
// Alternative: parse the TS file directly with a simple regex approach.

const srcFile = path.join(__dirname, '..', 'app', 'data', 'servicesData.ts');
const outFile = path.join(__dirname, '..', 'app', 'data', 'servicesData.json');

const text = fs.readFileSync(srcFile, 'utf8');

// Strategy: find each exported array and extract its contents as JS arrays
// Then combine them all

// Remove TypeScript type annotations
let clean = text;

// Remove "export const" declarations
clean = clean.replace(/export const/g, 'const');

// Remove type annotations on variable declarations
clean = clean.replace(/: Service\[\]/g, '');
clean = clean.replace(/: Service \| undefined/g, '');
clean = clean.replace(/: (?:readonly )?\w+(?:\[\])?/g, '');

// Remove "as const" assertions
clean = clean.replace(/ as readonly [^\]]+/g, '');

// Remove TypeScript interfaces
clean = clean.replace(/export interface[\s\S]*?\n\}\n/g, '');

// Remove type aliases
clean = clean.replace(/export type[\s\S]*?\n/g, '');

// Extract all array variables
const arrays = {};
const arrayRegex = /const (\w+Service\w*|allServices)\s*=\s*\[([\s\S]*?)\];/g;
let m;
while ((m = arrayRegex.exec(clean)) !== null) {
  const name = m[1];
  const body = m[2];
  try {
    // Use Function to evaluate the array literal
    const arr = new Function(`"use strict"; return [${body}]`)();
    arrays[name] = arr;
  } catch(e) {
    console.error(`Error parsing ${name}: ${e.message}`);
  }
}

// Get allServices if it exists, otherwise combine all arrays
let services = [];
if (arrays['allServices']) {
  services = arrays['allServices'].filter(s => s && s.id);
} else {
  for (const [name, arr] of Object.entries(arrays)) {
    if (Array.isArray(arr)) {
      services.push(...arr.filter(s => s && s.id));
    }
  }
}

// Deduplicate by id
const seen = new Set();
services = services.filter(s => {
  if (seen.has(s.id)) return false;
  seen.add(s.id);
  return true;
});

// Ensure pricing is properly formatted
services.forEach(s => {
  if (s.pricing) {
    for (const tier of ['basic', 'pro', 'enterprise']) {
      if (s.pricing[tier] && typeof s.pricing[tier] === 'number') {
        s.pricing[tier] = '$' + s.pricing[tier] + '/mo';
      }
    }
  }
  // Ensure href is set
  if (!s.href && s.id) {
    s.href = '/services/' + s.id;
  }
  // Ensure contactInfo
  if (!s.contactInfo) {
    s.contactInfo = {
      website: '/services/' + s.id,
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    };
  }
});

fs.writeFileSync(outFile, JSON.stringify(services, null, 2));
console.log(`✅ Wrote ${len(services)} services to ${outFile}`);
const cats = {};
services.forEach(s => { cats[s.category] = (cats[s.category]||0) + 1; });
console.log(`Categories: ${JSON.stringify(cats)}`);
