const fs = require('fs');
const path = require('path');

// Find all pages with duplicate metadata
const pagesWithDuplicates = [
  'app/ai-powered-devops/page.tsx',
  'app/ai-powered-email-analyzer/page.tsx',
  'app/it-services/cybersecurity-audit/page.tsx',
  'app/legal-document-manager/page.tsx',
  'app/medical-records-manager/page.tsx',
  'app/online-learning-platform/page.tsx',
  'app/property-management-ai/page.tsx',
  'app/supply-chain-optimizer/page.tsx',
  'app/test/page.tsx',
  'app/zion-ai-api-tester/page.tsx',
  'app/zion-ai-database-optimizer/page.tsx'
];

function fixMetadataDuplicates(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract page name from path
    const pageName = path.basename(path.dirname(filePath));
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');
    
    // Remove all duplicate metadata exports
    content = content.replace(/export const metadata = \{[\s\S]*?\};\s*;?\s*/g, '');
    
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
    console.log(`Fixed metadata duplicates: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all pages
pagesWithDuplicates.forEach(fixMetadataDuplicates);

console.log('All metadata duplicates fixed!');