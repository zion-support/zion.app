import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Function to fix a corrupted page file
function fixPageFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is already properly formatted and doesn't have invalid function names
    if (content.includes('export const metadata') && !content.includes('export default function Home() {') && !content.match(/function\s+[0-9]/)) {
      return false;
    }
    
    // Extract the page name from the file path
    const pageName = path.basename(path.dirname(filePath));
    const title = pageName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Create a valid function name (remove numbers and special chars, ensure it starts with letter)
    const functionName = pageName.replace(/[^a-zA-Z0-9]/g, '').replace(/^[0-9]/, 'Page$&');
    
    // Create a proper page structure
    const fixedContent = `import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export const metadata = {
  title: '${title} | Zion Tech Group',
  description: 'Professional ${title.toLowerCase()} services by Zion Tech Group. Advanced AI and technology solutions.',
  keywords: '${title.toLowerCase()}, technology, services, AI, automation',
  openGraph: {
    title: '${title} | Zion Tech Group',
    description: 'Professional ${title.toLowerCase()} services by Zion Tech Group.',
    type: 'website',
  },
};

function ${functionName}Page() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ${title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional ${title.toLowerCase()} services powered by advanced AI and technology.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Transform your business with our cutting-edge ${title.toLowerCase()} solutions. 
              We provide comprehensive services to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function Wrapped(props) {
  return (
    <ErrorBoundary>
      <${functionName}Page {...props} />
    </ErrorBoundary>
  );
}`;

    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  // Find all page.tsx files in the app directory
  const pageFiles = await glob('app/**/page.tsx');

  console.log(`Found ${pageFiles.length} page files to check...`);

  let fixedCount = 0;
  let skippedCount = 0;

  pageFiles.forEach(filePath => {
    if (fixPageFile(filePath)) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  });

  console.log(`\nSummary:`);
  console.log(`- Fixed: ${fixedCount} files`);
  console.log(`- Skipped: ${skippedCount} files`);
  console.log(`- Total: ${pageFiles.length} files`);
}

main().catch(console.error);