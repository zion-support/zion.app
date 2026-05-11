#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to fix import statements and type issues
function fixPageFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix import statement
    content = content.replace(
      "import { ErrorBoundary } from './components/ErrorBoundary';",
      "import ErrorBoundary from './components/ErrorBoundary';"
    );
    
    // Fix props type
    content = content.replace(
      'export default function Wrapped(props) {',
      'export default function Wrapped(props: Record<string, unknown>) {'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports and types in: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to fix all page files
function fixAllPageFiles() {
  const pageFiles = [
    'app/page.tsx',
    'app/offline/page.tsx',
    'app/5g-data-analytics/page.tsx',
    'app/5g-edge-computing/page.tsx',
    'app/5g-implementation/page.tsx',
    'app/5g-iot-solutions/page.tsx',
    'app/about/page.tsx',
    'app/accessibility-page/page.tsx',
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

  pageFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      fixPageFile(fullPath);
    }
  });
}

// Function to fix micro-saas services files
function fixMicroSaasFiles() {
  const microSaasFiles = [
    'app/micro-saas-services/page.tsx',
    'app/micro-saas-services/ai-analytics-dashboard/page.tsx',
    'app/micro-saas-services/ai-chatbot-builder/page.tsx',
    'app/micro-saas-services/ai-content-generator/page.tsx',
    'app/micro-saas-services/ai-email-assistant/page.tsx',
    'app/micro-saas-services/ai-lead-generation/page.tsx'
  ];

  microSaasFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      // Create clean micro-saas page
      const cleanContent = `import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Link from 'next/link';

export const metadata = {
  title: 'Micro SaaS Services | Zion Tech Group',
  description: 'Comprehensive micro SaaS solutions for modern businesses',
  keywords: 'micro saas, software as a service, business solutions, automation',
  openGraph: {
    title: 'Micro SaaS Services | Zion Tech Group',
    description: 'Comprehensive micro SaaS solutions for modern businesses',
    type: 'website',
  },
};

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Micro SaaS Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive micro SaaS solutions for modern businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wrapped(props: Record<string, unknown>) {
  return (
    <ErrorBoundary>
      <HomePage {...props} />
    </ErrorBoundary>
  );
}`;

      fs.writeFileSync(fullPath, cleanContent);
      console.log(`Fixed micro-saas file: ${file}`);
    }
  });
}

// Main execution
console.log('Starting import and type fixes...');
fixAllPageFiles();
fixMicroSaasFiles();
console.log('Import and type fixes completed!');