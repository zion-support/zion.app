#!/usr/bin/env node
/* write-postbuild-artifacts.cjs — writes .nojekyll, sitemap.xml, robots.txt */
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');

// Ensure out/ directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// .nojekyll
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

// robots.txt
fs.writeFileSync(path.join(outDir, 'robots.txt'), 
  'User-agent: *\nAllow: /\nSitemap: https://ziontechgroup.com/sitemap.xml\n');

// sitemap.xml — essential pages only
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ziontechgroup.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://ziontechgroup.com/services</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://ziontechgroup.com/pricing</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ziontechgroup.com/configurator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ziontechgroup.com/proposal-generator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://ziontechgroup.com/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://ziontechgroup.com/status</loc><changefreq>daily</changefreq><priority>0.6</priority></url>
  <url><loc>https://ziontechgroup.com/search</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://ziontechgroup.com/data/services.json</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://ziontechgroup.com/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://ziontechgroup.com/portal</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
</urlset>`;

fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
console.log('postbuild: .nojekyll, sitemap.xml, robots.txt written to out/');

// Spotlight feed
require('./generate_spotlight_feed.cjs');
