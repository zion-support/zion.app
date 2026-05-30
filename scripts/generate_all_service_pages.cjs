#!/usr/bin/env node
/**
 * generate_all_service_pages.cjs
 * 
 * Creates static HTML pages for ALL services in servicesData.json
 * that don't already have a page in out/services/[id]/index.html.
 * This runs after the Next.js build to fill in any missing pages.
 */
const fs = require('fs');
const path = require('path');

const JSON_DAT = path.resolve(path.join(__dirname, '..', 'app', 'data', 'servicesData.json'));
const OUT_DIR = path.resolve(path.join(__dirname, '..', 'out'));
const SVC_DIR = path.resolve(path.join(OUT_DIR, 'services'));

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateServicePage(svc) {
  const title = escapeHtml(svc.title || svc.id);
  const desc = escapeHtml(svc.description || `Explore ${svc.title} at Zion Tech Group`);
  const features = (svc.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('\n            ');
  const benefits = (svc.benefits || []).map(b => `<li>${escapeHtml(b)}</li>`).join('\n            ');
  const pricing = svc.pricing || {};
  const contact = svc.contactInfo || {};
  const category = svc.category || 'ai';
  const icon = svc.icon || '⚡';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Zion Tech Group</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://ziontechgroup.com/services/${svc.id}/">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${title}",
    "description": "${desc}",
    "provider": {
      "@type": "Organization",
      "name": "Zion Tech Group",
      "url": "https://ziontechgroup.com",
      "telephone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "364 E Main St STE 1008",
        "addressLocality": "Middletown",
        "addressRegion": "DE",
        "postalCode": "19709",
        "addressCountry": "US"
      }
    },
    "category": "${category}",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "${pricing.basic || '99'}",
      "highPrice": "${pricing.enterprise || '999'}",
      "priceCurrency": "USD"
    }
  }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a1a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: rgba(139, 92, 246, 0.15); color: #a78bfa; margin-bottom: 1rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(to right, #a78bfa, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .icon { font-size: 3rem; margin-bottom: 1rem; }
    .desc { font-size: 1.1rem; color: #94a3b8; margin-bottom: 2rem; }
    .section { margin-bottom: 2rem; }
    .section h2 { font-size: 1.25rem; color: #fff; margin-bottom: 0.75rem; }
    .section ul { list-style: none; padding: 0; }
    .section li { padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: #cbd5e1; }
    .section li::before { content: "✓"; position: absolute; left: 0; color: #22c55e; font-weight: bold; }
    .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .price-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; text-align: center; }
    .price-card h3 { color: #a78bfa; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .price-card .amount { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .contact { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 1.5rem; margin-top: 2rem; }
    .contact h2 { color: #fff; margin-bottom: 0.75rem; }
    .contact a { color: #a78bfa; text-decoration: none; }
    .contact a:hover { text-decoration: underline; }
    .nav { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .nav a { color: #a78bfa; text-decoration: none; font-size: 0.875rem; padding: 0.5rem 1rem; border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; }
    .nav a:hover { background: rgba(139,92,246,0.1); }
    footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.875rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 3rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <a href="/">← Home</a>
      <a href="/services/">All Services</a>
      <a href="/services/?category=${category}">${category.charAt(0).toUpperCase() + category.slice(1)} Services</a>
      <a href="/contact/">Contact Us</a>
    </div>
    
    <div class="icon">${icon}</div>
    <span class="badge">${category.toUpperCase()}</span>
    <h1>${title}</h1>
    <p class="desc">${desc}</p>

    ${features ? `<div class="section">
      <h2>Features & Capabilities</h2>
      <ul>${features}</ul>
    </div>` : ''}

    ${benefits ? `<div class="section">
      <h2>Benefits</h2>
      <ul>${benefits}</ul>
    </div>` : ''}

    <div class="section">
      <h2>Pricing</h2>
      <div class="pricing">
        <div class="price-card">
          <h3>Basic</h3>
          <div class="amount">$${pricing.basic || '99'}/mo</div>
        </div>
        <div class="price-card">
          <h3>Pro</h3>
          <div class="amount">$${pricing.pro || '299'}/mo</div>
        </div>
        <div class="price-card">
          <h3>Enterprise</h3>
          <div class="amount">$${pricing.enterprise || '999'}/mo</div>
        </div>
      </div>
    </div>

    <div class="contact">
      <h2>Get Started Today</h2>
      <p>📞 <a href="tel:+13024640950">+1 302 464 0950</a></p>
      <p>✉️ <a href="mailto:kleber@ziontechgroup.com">kleber@ziontechgroup.com</a></p>
      <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
      <p style="margin-top: 1rem;"><a href="/contact/" style="display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(to right, #7c3aed, #ec4899); color: white; border-radius: 8px; font-weight: 600;">Get Free Consultation →</a></p>
    </div>
  </div>
  
  <footer>
    <p>© ${new Date().getFullYear()} Zion Tech Group. All rights reserved.</p>
    <p style="margin-top: 0.5rem;">
      <a href="/privacy/" style="color: #64748b; margin: 0 0.5rem;">Privacy</a>
      <a href="/terms/" style="color: #64748b; margin: 0 0.5rem;">Terms</a>
      <a href="/sitemap.xml" style="color: #64748b; margin: 0 0.5rem;">Sitemap</a>
    </p>
  </footer>
</body>
</html>`;
}

function main() {
  let services = [];
  try {
    services = JSON.parse(fs.readFileSync(JSON_DAT, 'utf8'));
  } catch(e) {
    console.error('ERROR: Cannot read servicesData.json:', e.message);
    process.exit(1);
  }

  if (!fs.existsSync(SVC_DIR)) {
    fs.mkdirSync(SVC_DIR, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  for (const svc of services) {
    if (!svc || !svc.id) continue;
    const dir = path.join(SVC_DIR, svc.id);
    const htmlFile = path.join(dir, 'index.html');

    if (fs.existsSync(htmlFile)) {
      skipped++;
      continue;
    }

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(htmlFile, generateServicePage(svc));
    created++;
  }

  console.log(`Service pages: ${created} created, ${skipped} already existed. Total dirs: ${created + skipped}`);
}

main();
