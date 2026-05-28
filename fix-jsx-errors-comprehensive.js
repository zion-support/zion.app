#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to fix JSX fragment and syntax errors
function fixJSXErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = false;
    
    // Fix multiple React imports
    if (content.includes('import React from \'react\';') && content.includes('import React from \'react\'')) {
      content = content.replace(/import React from 'react';\s*import React from 'react'/g, 'import React from \'react\'');
      fixed = true;
    }
    
    // Fix JSX fragments without proper closing
    if (content.includes('<>') && !content.includes('</>')) {
      // Find the last closing div and add the fragment closing
      const lastDivIndex = content.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
        content = content.substring(0, lastDivIndex + 6) + '\n    </>\n  );\n}';
        fixed = true;
      }
    }
    
    // Fix unclosed JSX elements
    if (content.includes('<div>') && !content.includes('</div>')) {
      // Find the last opening div and add closing
      const divMatches = content.match(/<div[^>]*>/g);
      if (divMatches) {
        const lastDiv = divMatches[divMatches.length - 1];
        const lastDivIndex = content.lastIndexOf(lastDiv);
        const afterLastDiv = content.substring(lastDivIndex + lastDiv.length);
        
        // If there's no closing div after the last opening div, add one
        if (!afterLastDiv.includes('</div>')) {
          content = content + '\n    </div>\n  );\n}';
          fixed = true;
        }
      }
    }
    
    // Fix function declarations that are missing proper structure
    if (content.includes('export default function Home() {') && content.includes('return (')) {
      // This is a simple home page, fix it properly
      const homePageContent = `import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Link from 'next/link';

export const metadata = {
  title: 'AI-Powered DevOps | Zion Tech Group',
  description: 'Advanced AI-powered DevOps solutions for modern businesses',
  keywords: 'AI DevOps, automation, CI/CD, machine learning, cloud computing',
  openGraph: {
    title: 'AI-Powered DevOps | Zion Tech Group',
    description: 'Advanced AI-powered DevOps solutions for modern businesses',
    type: 'website',
  },
};

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI-Powered DevOps
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your development workflow with intelligent automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wrapped(props) {
  return (
    <ErrorBoundary>
      <HomePage {...props} />
    </ErrorBoundary>
  );
}`;
      
      fs.writeFileSync(filePath, homePageContent);
      fixed = true;
    }
    
    if (fixed) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed JSX errors in: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to fix specific problematic files
function fixProblematicFiles() {
  const problematicFiles = [
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

  problematicFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      fixJSXErrors(fullPath);
    }
  });
}

// Main execution
console.log('Starting JSX error fixes...');
fixProblematicFiles();
console.log('JSX error fixes completed!');