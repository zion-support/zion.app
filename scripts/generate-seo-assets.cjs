#!/usr/bin/env node
/**
 * Sitemap & RSS Generator — pre-build script
 * Reads servicesData.ts, writes:
 *   - public/sitemap.xml (all service pages)
 *   - public/feed.xml (latest 50 services)
 * Run automatically before `npm run build`
 */

const fs = require('fs');
const path = require('path');

const SERVICES_FILE = path.join(process.cwd(), 'app', 'data', 'servicesData.ts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

fs.mkdirSync(PUBLIC_DIR, { recursive: true });

function readServices() {
  const content = fs.readFileSync(SERVICES_FILE, 'utf8');
  const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)];
  const titleMatches = [...content.matchAll(/title:\s*"([^"]+)"/g)];
  const descMatches = [...content.matchAll(/description:\s*"([^"]+)"/g)];

  return idMatches.map((m, i) => ({
    id: m[1],
    title: titleMatches[i]?.[1] || 'Service',
    description: descMatches[i]?.[1] || 'Professional service'
  }));
}

// Build sitemap.xml
function buildSitemap(services) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ziontechgroup.com';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  const staticPages = ['/', '/ai-services', '/it-services', '/contact', '/pricing-calculator', '/service-comparison', '/service-recommender'];
  staticPages.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p==='/'?'daily':'weekly'}</changefreq>\n    <priority>${p==='/'?'1.0':'0.9'}</priority>\n  </url>\n`;
  });

  // Service pages (all)
  services.forEach(svc => {
    xml += `  <url>\n    <loc>${baseUrl}/ai-services/${svc.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
  console.log(`✅ sitemap.xml written (${services.length} service URLs)`);
}

// Build RSS feed
function buildRSS(services) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ziontechgroup.com';
  const now = new Date().toUTCString();
  const latest = services.slice(-50).reverse();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0">\n<channel>\n`;
  xml += `  <title>Zion Tech Group — Services</title>\n`;
  xml += `  <link>${baseUrl}/services</link>\n`;
  xml += `  <description>Latest AI & IT services from Zion Tech Group</description>\n`;
  xml += `  <lastBuildDate>${now}</lastBuildDate>\n`;
  xml += `  <pubDate>${now}</pubDate>\n`;

  latest.forEach(svc => {
    const itemUrl = `${baseUrl}/ai-services/${svc.id}`;
    xml += `  <item>\n`;
    xml += `    <title>${svc.title}</title>\n`;
    xml += `    <link>${itemUrl}</link>\n`;
    xml += `    <guid isPermaLink="true">${itemUrl}</guid>\n`;
    xml += `    <pubDate>${now}</pubDate>\n`;
    xml += `    <category>services</category>\n`;
    xml += `    <description><![CDATA[${svc.description}]]></description>\n`;
    xml += `  </item>\n`;
  });

  xml += `</channel>\n</rss>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), xml);
  console.log(`✅ feed.xml written (${latest.length} items)`);
}

// Run
const services = readServices();
console.log(`📦 Catalog: ${services.length} services loaded`);
buildSitemap(services);
buildRSS(services);
console.log('🎉 SEO assets generated successfully');
