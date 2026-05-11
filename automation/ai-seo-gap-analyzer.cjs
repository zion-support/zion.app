const fs = require('fs');
const path = require('path');

const KEYWORDS = [
  'ai-consulting', 'ml-implementation', 'neural-networks', 'deep-learning',
  'ai-software', 'machine-learning-platform', 'ai-toolkit', 'ml-sdk',
  'ai-for-healthcare', 'ai-for-finance', 'ai-for-retail', 'ai-for-manufacturing',
  'customer-service-automation', 'predictive-maintenance', 'fraud-detection', 'quality-control'
];

async function main() {
  console.log('SEO Gap Analyzer starting...');
  const created = [];
  
  for (const kw of KEYWORDS) {
    const dir = path.join('app', 'seo', kw);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      const title = kw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      fs.writeFileSync(path.join(dir, 'page.tsx'), `'use client';
export default function Page() {
  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-4">${title}</h1>
        <p className="text-xl text-slate-400">Transform your business with ${title.toLowerCase()}</p>
      </div>
    </div>
  );
}
`);
      created.push('seo/' + kw);
      console.log('Created: /seo/' + kw);
    }
  }
  fs.writeFileSync('automation/reports/ai-seo-gap-analyzer-latest.json', JSON.stringify({ created }, null, 2));
  console.log('Done: ' + created.length + ' pages');
}
main().catch(console.error);
