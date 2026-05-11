import ErrorBoundary from '../../components/GlobalErrorBoundary';
import Link from 'next/link';

export const metadata = {
  title: 'Zion AI Report Generator | Zion Tech Group',
  description:
    'AI-powered report generation by Zion Tech Group. Automate business reports, dashboards, and executive summaries with natural language.',
  keywords: 'zion ai report generator, business intelligence, automated reporting, dashboards, AI reports',
  openGraph: {
    title: 'Zion AI Report Generator | Zion Tech Group',
    description: 'AI-powered report generation for business intelligence and automated reporting.',
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
              Zion AI Report Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered report generation that transforms data into actionable business reports,
              dashboards, and executive summaries.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Turn raw data into polished reports in minutes. Our AI understands your metrics,
              generates narratives, and produces executive-ready deliverables on schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/zion-analytics-pro"
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
