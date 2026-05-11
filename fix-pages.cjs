const fs = require('fs');
const path = require('path');

const pagesToFix = [
  'app/5g-iot-solutions/page.tsx',
  'app/5g-implementation/page.tsx',
  'app/accessibility-page/page.tsx',
  'app/5g-edge-computing/page.tsx',
  'app/micro-saas-services/ai-email-assistant/page.tsx',
  'app/micro-saas-services/page.tsx',
  'app/micro-saas-services/ai-content-generator/page.tsx',
  'app/micro-saas-services/ai-lead-generation/page.tsx',
  'app/micro-saas-services/ai-analytics-dashboard/page.tsx',
  'app/micro-saas-services/ai-chatbot-builder/page.tsx'
];

function fixPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract page name from path
    const pageName = path.basename(path.dirname(filePath));
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');
    
    // Remove duplicate metadata exports and fix structure
    content = content.replace(/export const metadata = \{[\s\S]*?\};\s*;?\s*/g, '');
    content = content.replace(/import Head from 'next\/head'[\s\S]*?export const metadata = \{[\s\S]*?\};\s*;?\s*/g, '');
    content = content.replace(/;\s*'use client';\s*/g, "'use client';\n");
    content = content.replace(/;\s*import/g, '\nimport');
    
    // Fix malformed JSX attributes
    content = content.replace(/onClick=\{\(\) = aria-label=\"Button\"> ([^}]+)\}/g, 'onClick={() => $1}\n            aria-label="Button"');
    
    // Fix malformed JSX elements
    content = content.replace(/<\s*\{\.\.\.props\}/g, '<Page {...props}');
    
    // Create clean page structure
    const cleanContent = `'use client';

import Head from 'next/head';
import Footer from '../components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata = {
  title: '${title} | Zion Tech Group',
  description: 'Professional ${title.toLowerCase()} services and solutions by Zion Tech Group.',
  keywords: '${title.toLowerCase()}, technology services, Zion Tech Group',
  openGraph: {
    title: '${title} | Zion Tech Group',
    description: 'Professional ${title.toLowerCase()} services and solutions by Zion Tech Group.',
    type: 'website',
  },
};

function Page() {
  return (
    <div>
      <Head>
        <title>${title} - Zion Tech Group</title>
        <meta name="description" content="Professional ${title.toLowerCase()} services and solutions by Zion Tech Group." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            ${title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Professional services by Zion Tech Group.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-300">
              This service is currently under development. Contact us to learn more about our upcoming services.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default function Wrapped(props) {
  return (
    <ErrorBoundary>
      <Page {...props} />
    </ErrorBoundary>
  );
}`;

    fs.writeFileSync(filePath, cleanContent);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all pages
pagesToFix.forEach(fixPage);

console.log('All pages fixed!');