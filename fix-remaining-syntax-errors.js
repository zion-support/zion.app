import fs from 'fs';
import { glob } from 'glob';

const pagesToFix = [
  'it-services/cybersecurity-audit',
  'legal-document-manager',
  'medical-records-manager',
  'online-learning-platform',
  'property-management-ai',
  'supply-chain-optimizer',
  'test',
  'zion-ai-api-tester',
  'zion-ai-database-optimizer'
];

const pageTitles = {
  'it-services/cybersecurity-audit': 'Cybersecurity Audit',
  'legal-document-manager': 'Legal Document Manager',
  'medical-records-manager': 'Medical Records Manager',
  'online-learning-platform': 'Online Learning Platform',
  'property-management-ai': 'Property Management AI',
  'supply-chain-optimizer': 'Supply Chain Optimizer',
  'test': 'Test Page',
  'zion-ai-api-tester': 'Zion AI API Tester',
  'zion-ai-database-optimizer': 'Zion AI Database Optimizer'
};

const pageDescriptions = {
  'it-services/cybersecurity-audit': 'Professional cybersecurity audit services and solutions by Zion Tech Group.',
  'legal-document-manager': 'Professional legal document manager services and solutions by Zion Tech Group.',
  'medical-records-manager': 'Professional medical records manager services and solutions by Zion Tech Group.',
  'online-learning-platform': 'Professional online learning platform services and solutions by Zion Tech Group.',
  'property-management-ai': 'Professional property management AI services and solutions by Zion Tech Group.',
  'supply-chain-optimizer': 'Professional supply chain optimizer services and solutions by Zion Tech Group.',
  'test': 'Test page for Zion Tech Group.',
  'zion-ai-api-tester': 'Professional Zion AI API tester services and solutions by Zion Tech Group.',
  'zion-ai-database-optimizer': 'Professional Zion AI database optimizer services and solutions by Zion Tech Group.'
};

const pageKeywords = {
  'it-services/cybersecurity-audit': 'cybersecurity, audit, security assessment, vulnerability testing',
  'legal-document-manager': 'legal documents, document management, legal technology, compliance',
  'medical-records-manager': 'medical records, healthcare, patient data, medical technology',
  'online-learning-platform': 'online learning, e-learning, education technology, learning management',
  'property-management-ai': 'property management, real estate, AI, property technology',
  'supply-chain-optimizer': 'supply chain, logistics, optimization, supply chain management',
  'test': 'test, testing, development, quality assurance',
  'zion-ai-api-tester': 'API testing, AI testing, software testing, quality assurance',
  'zion-ai-database-optimizer': 'database optimization, AI, database performance, data management'
};

function createPageContent(pageName) {
  return `'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';

export const metadata = {
  title: '${pageTitles[pageName]} - Zion Tech Group',
  description: '${pageDescriptions[pageName]}',
  keywords: '${pageKeywords[pageName]}',
  openGraph: {
    title: '${pageTitles[pageName]} - Zion Tech Group',
    description: '${pageDescriptions[pageName]}',
    type: 'website',
  },
};

function Page() {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            ${pageTitles[pageName]}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Professional services by Zion Tech Group.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Wrapped(props: any) {
  return (
    <ErrorBoundary>
      <Page {...props} />
    </ErrorBoundary>
  );
}`;
}

// Main execution
async function main() {
  let fixedCount = 0;
  
  for (const pageName of pagesToFix) {
    const filePath = `app/${pageName}/page.tsx`;
    try {
      const content = createPageContent(pageName);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      fixedCount++;
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  }

  console.log(`Fixed ${fixedCount} pages`);
}

main().catch(console.error);