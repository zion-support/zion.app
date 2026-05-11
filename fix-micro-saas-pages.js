import fs from 'fs';
import { glob } from 'glob';

const microSaasPages = [
  'ai-chatbot-builder',
  'ai-content-generator', 
  'ai-email-assistant',
  'ai-lead-generation'
];

const pageTitles = {
  'ai-chatbot-builder': 'AI Chatbot Builder',
  'ai-content-generator': 'AI Content Generator',
  'ai-email-assistant': 'AI Email Assistant',
  'ai-lead-generation': 'AI Lead Generation'
};

const pageDescriptions = {
  'ai-chatbot-builder': 'Professional AI chatbot builder services and solutions by Zion Tech Group.',
  'ai-content-generator': 'Professional AI content generator services and solutions by Zion Tech Group.',
  'ai-email-assistant': 'Professional AI email assistant services and solutions by Zion Tech Group.',
  'ai-lead-generation': 'Professional AI lead generation services and solutions by Zion Tech Group.'
};

const pageKeywords = {
  'ai-chatbot-builder': 'AI chatbot, conversational AI, customer service, automation',
  'ai-content-generator': 'AI content, content creation, writing assistant, automation',
  'ai-email-assistant': 'AI email, email automation, productivity, communication',
  'ai-lead-generation': 'AI leads, lead generation, sales automation, marketing'
};

function createPageContent(pageName) {
  return `'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '../../components/Footer';

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
  
  for (const pageName of microSaasPages) {
    const filePath = `app/micro-saas-services/${pageName}/page.tsx`;
    try {
      const content = createPageContent(pageName);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      fixedCount++;
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  }

  console.log(`Fixed ${fixedCount} micro-saas pages`);
}

main().catch(console.error);