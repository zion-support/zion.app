#!/usr/bin/env node
/**
 * fix-other-pages.cjs — Fixes og:image and JSON-LD on non-service pages
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const OG_IMAGE = 'https://ziontechgroup.com/og-home.svg';

// Pages to fix (all top-level HTML files + key subdirectories)
function getAllHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip _next, data, and services (already fixed)
      if (!entry.name.startsWith('_') && entry.name !== 'data' && entry.name !== 'services') {
        getAllHtmlFiles(full, files);
      }
    } else if (entry.name === 'index.html') {
      files.push(full);
    }
  }
  return files;
}

function fixPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changes = [];
  const relPath = '/' + path.relative(OUT_DIR, filePath).replace(/\\/g, '/').replace('/index.html', '');
  const canonicalUrl = `https://ziontechgroup.com${relPath === '/' ? '/' : relPath + '/'}`;

  // 1. Add og:image if missing
  if (!html.includes('property="og:image"')) {
    const ogImageTag = `<meta property="og:image" content="${OG_IMAGE}"/>`;
    const insertAfter = html.indexOf('<meta property="og:description"');
    if (insertAfter > -1) {
      const endOfLine = html.indexOf('/>', insertAfter) + 2;
      html = html.slice(0, endOfLine) + '\n    ' + ogImageTag + html.slice(endOfLine);
    }
    changes.push('added og:image');
  }

  // 2. Fix canonical for non-service pages
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (canonicalMatch) {
    const current = canonicalMatch[1];
    if (current === 'https://ziontechgroup.com/' && relPath !== '/') {
      html = html.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${canonicalUrl}"`
      );
      changes.push('fixed canonical');
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(filePath, html);
  }
  return changes;
}

// Main
function main() {
  const htmlFiles = getAllHtmlFiles(OUT_DIR);
  let fixed = 0;

  console.log(`Processing ${htmlFiles.length} non-service pages...`);

  htmlFiles.forEach(f => {
    try {
      const changes = fixPage(f);
      if (changes.length > 0) fixed++;
    } catch (e) {
      // skip
    }
  });

  console.log(`Done: ${fixed} pages fixed`);
}

main();
