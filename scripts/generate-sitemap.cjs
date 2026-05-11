const fs = require('fs');
const path = require('path');

// Generate sitemap.xml
const generateSitemap = () => {
  const baseUrl = 'https://ziontechgroup.com';
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/ai-services', priority: '0.9', changefreq: 'weekly' },
    { url: '/micro-saas-solutions', priority: '0.9', changefreq: 'weekly' },
    { url: '/it-services', priority: '0.9', changefreq: 'weekly' },
    { url: '/ai-3d-model-generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-audio-processor', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-code-assistant', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-education-tutor', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-infrastructure', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-legal-assistant', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-medical-assistant', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-real-estate-analyzer', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-supply-chain-optimizer', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-translator', priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-video-generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/augmented-reality-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/container-orchestration', priority: '0.8', changefreq: 'monthly' },
    { url: '/data-lake-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/edge-computing-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/low-code-platform', priority: '0.8', changefreq: 'monthly' },
    { url: '/quantum-computing-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/robotic-process-automation', priority: '0.8', changefreq: 'monthly' },
    { url: '/serverless-architecture', priority: '0.8', changefreq: 'monthly' },
    { url: '/virtual-reality-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/zion-ai-api-tester', priority: '0.8', changefreq: 'monthly' },
    { url: '/zion-ai-code-reviewer', priority: '0.8', changefreq: 'monthly' },
    { url: '/zion-ai-database-optimizer', priority: '0.8', changefreq: 'monthly' },
    { url: '/docs', priority: '0.7', changefreq: 'weekly' },
    { url: '/support', priority: '0.7', changefreq: 'weekly' },
    { url: '/tutorials', priority: '0.7', changefreq: 'weekly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully');
};

generateSitemap();