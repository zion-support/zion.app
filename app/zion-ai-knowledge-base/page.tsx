import ErrorBoundary from '../../components/GlobalErrorBoundary';
import Link from 'next/link';

export const metadata = {
  title: 'Zion AI Knowledge Base | Zion Tech Group',
  description:
    'AI-powered knowledge base solutions by Zion Tech Group. Centralize, search, and surface organizational knowledge with intelligent retrieval.',
  keywords: 'zion ai knowledge base, knowledge management, AI, enterprise search, documentation',
  openGraph: {
    title: 'Zion AI Knowledge Base | Zion Tech Group',
    description: 'AI-powered knowledge base solutions for enterprise knowledge management.',
    type: 'website',
  },
};

export default function Page() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Zion AI Knowledge Base
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered knowledge management that centralizes, indexes, and surfaces organizational
              knowledge with intelligent search and retrieval.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Transform scattered documents, wikis, and FAQs into a unified, searchable knowledge base.
              Our AI understands context and delivers relevant answers instantly to support teams and
              customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/solutions"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
