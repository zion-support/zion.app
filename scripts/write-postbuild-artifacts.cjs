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

// sitemap.xml + feed.xml — generated dynamically from build artifacts
try { require('./generate-sitemap-feed.cjs'); }
catch (e) { console.error('dynamic sitemap/feed failed:', e.message); }
console.log('postbuild: .nojekyll, sitemap.xml, robots.txt written to out/');
