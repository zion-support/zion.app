#!/usr/bin/env node
/**
 * fix-other-pages-v2.cjs — Fast version
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const OG_IMAGE = 'https://ziontechgroup.com/og-home.svg';

// Only fix specific important pages
const IMPORTANT_PAGES = [
  'index.html',
  'index.html',  // homepage
];

// Fix everything in out/ recursively but efficiently
function processDir(dir) {
  const entries = fs.readdirSync(dir);
  let fixed = 0;

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (!entry.startsWith('_') && entry !== 'data' && entry !== 'services') {
        fixed += processDir(full);
      }
    } else if (entry === 'index.html') {
      try {
        let html = fs.readFileSync(full, 'utf8');
        let changed = false;

        if (!html.includes('property="og:image"')) {
          const tag = `<meta property="og:image" content="${OG_IMAGE}"/>`;
          const idx = html.indexOf('</title>');
          if (idx > -1) {
            html = html.slice(0, idx + 8) + '\n    ' + tag + html.slice(idx + 8);
            changed = true;
          }
        }

        // Fix canonical
        const relPath = '/' + path.relative(OUT_DIR, full).replace(/\\/g, '/').replace(/\/index\.html$/, '/');
        const correctCanonical = `https://ziontechgroup.com${relPath}`;
        const canonMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
        if (canonMatch && canonMatch[1] === 'https://ziontechgroup.com/' && relPath !== '/') {
          html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${correctCanonical}"`);
          changed = true;
        }

        if (changed) {
          fs.writeFileSync(full, html);
          fixed++;
        }
      } catch (e) { /* skip */ }
    }
  }
  return fixed;
}

console.log('Fixing non-service pages...');
const total = processDir(OUT_DIR);
console.log(`Done: ${total} pages fixed`);
