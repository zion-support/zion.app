import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to completely rewrite a page file with proper structure
function rewritePageFile(filePath) {
  try {
    const fileName = path.basename(filePath, '.tsx');
    const capitalizedName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    // Generate proper page content
    const content = `'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import Head from 'next/head';
import Footer from '../components/Footer';

export const metadata = {
  title: '${capitalizedName} | Zion Tech Group',
  description: 'Professional ${fileName.replace(/-/g, ' ')} services and solutions by Zion Tech Group.',
  keywords: '${fileName.replace(/-/g, ', ')}, technology, services',
  openGraph: {
    title: '${capitalizedName} | Zion Tech Group',
    description: 'Professional ${fileName.replace(/-/g, ' ')} services and solutions by Zion Tech Group.',
    type: 'website',
  },
};

function ${capitalizedName}() {
  return (
    <div>
      <Head>
        <title>${capitalizedName} - Zion Tech Group</title>
        <meta name="description" content="Professional ${fileName.replace(/-/g, ' ')} services and solutions by Zion Tech Group." />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            ${capitalizedName}
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

export default function Wrapped(props: any) {
  return (
    <ErrorBoundary>
      <${capitalizedName} {...props} />
    </ErrorBoundary>
  );
}`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Rewrote: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error rewriting ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  // Get all page.tsx files
  const files = await glob('app/**/page.tsx', { cwd: '/workspace' });

  console.log(`Found ${files.length} page files to rewrite`);

  let fixedCount = 0;
  files.forEach(file => {
    const fullPath = path.join('/workspace', file);
    if (rewritePageFile(fullPath)) {
      fixedCount++;
    }
  });

  console.log(`Rewrote ${fixedCount} out of ${files.length} files`);
}

main().catch(console.error);