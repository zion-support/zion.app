#!/usr/bin/env node
/**
 * update-sitemap.cjs — Add all service pages to sitemap.xml
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const SITEMAP = path.join(OUT_DIR, 'sitemap.xml');
const SERVICES_DIR = path.join(OUT_DIR, 'services');

const today = new Date().toISOString().split('T')[0];

// Read existing sitemap
let sitemap = fs.readFileSync(SITEMAP, 'utf8');

// Get all service IDs
const services = fs.readdirSync(SERVICES_DIR)
  .filter(d => fs.statSync(path.join(SERVICES_DIR, d)).isDirectory() && d !== 'services');

console.log(`Adding ${services.length} service URLs to sitemap...`);

// Generate service URLs
const serviceUrls = services.map(id =>
  `<url><loc>https://ziontechgroup.com/services/${id}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
).join('\n');

// Insert before closing </urlset>
sitemap = sitemap.replace('</urlset>', serviceUrls + '\n</urlset>');

fs.writeFileSync(SITEMAP, sitemap);
console.log(`Sitemap updated: ${services.length} service URLs added`);
