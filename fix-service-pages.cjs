#!/usr/bin/env node
/**
 * fix-service-pages.cjs — Fixes all service detail pages in out/services/
 *
 * Fixes:
 * 1. Add og:image meta tag
 * 2. Change JSON-LD from Organization to Product/Service schema
 * 3. Add og:url with correct canonical service URL
 */

const fs = require('fs');
const path = require('path');

const SERVICES_DIR = path.join(__dirname, 'out', 'services');
const SITEMAP_FILE = path.join(__dirname, 'out', 'sitemap.xml');

// Default og:image — use the site's main OG image
const OG_IMAGE = 'https://ziontechgroup.com/og-home.svg';

function fixServicePage(serviceId) {
  const filePath = path.join(SERVICES_DIR, serviceId, 'index.html');
  if (!fs.existsSync(filePath)) return null;

  let html = fs.readFileSync(filePath, 'utf8');
  let changes = [];

  // ── 1. Extract service data from existing HTML ──
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'") : serviceId;
  const desc = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'") : '';
  const canonicalUrl = `https://ziontechgroup.com/services/${serviceId}/`;

  // ── 2. Add og:image if missing ──
  if (!html.includes('property="og:image"')) {
    const ogTags = `<meta property="og:image" content="${OG_IMAGE}"/>
    <meta property="og:url" content="${canonicalUrl}"/>`;
    // Insert after existing og:description or after <title>
    const insertPoint = html.indexOf('<meta property="og:description"');
    if (insertPoint > -1) {
      const endOfLine = html.indexOf('/>', insertPoint) + 2;
      html = html.slice(0, endOfLine) + '\n    ' + ogTags + html.slice(endOfLine);
    } else {
      const titleEnd = html.indexOf('</title>') + 8;
      html = html.slice(0, titleEnd) + '\n    ' + ogTags + html.slice(titleEnd);
    }
    changes.push('added og:image + og:url');
  }

  // ── 3. Fix canonical URL ──
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (canonicalMatch) {
    const currentCanonical = canonicalMatch[1];
    if (currentCanonical === 'https://ziontechgroup.com/' || currentCanonical === 'https://ziontechgroup.com') {
      html = html.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${canonicalUrl}"`
      );
      changes.push('fixed canonical');
    }
  }

  // ── 4. Replace JSON-LD Organization with Product schema ──
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      if (data['@type'] === 'Organization') {
        // Replace with Product schema
        const productSchema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": title.replace(' | Zion Tech Group', ''),
          "description": desc,
          "url": canonicalUrl,
          "brand": {
            "@type": "Organization",
            "name": "Zion Tech Group",
            "url": "https://ziontechgroup.com"
          },
          "offers": {
            "@type": "Offer",
            "price": "99",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Zion Tech Group"
            }
          },
          "provider": {
            "@type": "Organization",
            "name": "Zion Tech Group",
            "url": "https://ziontechgroup.com"
          }
        };
        const newScript = `<script type="application/ld+json">${JSON.stringify(productSchema, null, 0)}</script>`;
        html = html.replace(jsonLdMatch[0], newScript);
        changes.push('JSON-LD: Organization → Product');
      }
    } catch (e) {
      // skip malformed JSON-LD
    }
  }

  // Write back if changed
  if (changes.length > 0) {
    fs.writeFileSync(filePath, html);
  }

  return changes;
}

// ── Main ──
function main() {
  const services = fs.readdirSync(SERVICES_DIR)
    .filter(d => {
      const stats = fs.statSync(path.join(SERVICES_DIR, d));
      return stats.isDirectory() && d !== 'services';
    });

  let fixed = 0;
  let errors = 0;

  console.log(`Processing ${services.length} service pages...`);

  services.forEach((id, i) => {
    try {
      const changes = fixServicePage(id);
      if (changes && changes.length > 0) {
        fixed++;
        if (i < 5 || i === services.length - 1) {
          console.log(`  ✓ ${id}: ${changes.join(', ')}`);
        }
      }
    } catch (e) {
      errors++;
      console.error(`  ✗ ${id}: ${e.message}`);
    }
  });

  console.log(`\nDone: ${fixed} pages fixed, ${errors} errors, ${services.length} total`);
}

main();
