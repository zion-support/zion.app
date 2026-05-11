import ErrorBoundary from '../../components/GlobalErrorBoundary';
import Link from 'next/link';

export const metadata = {
  title: 'Zion AI Risk Assessor | Zion Tech Group',
  description:
    'AI-powered risk assessment by Zion Tech Group. Identify, quantify, and mitigate enterprise risks with intelligent risk modeling and monitoring.',
  keywords: 'zion ai risk assessor, risk management, enterprise risk, compliance, AI risk',
  openGraph: {
    title: 'Zion AI Risk Assessor | Zion Tech Group',
    description: 'AI-powered risk assessment and enterprise risk management solutions.',
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
              Zion AI Risk Assessor
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered risk assessment that identifies, quantifies, and monitors enterprise risks
              with intelligent modeling and real-time alerts.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Proactively manage operational, compliance, and strategic risks. Our AI analyzes
              patterns, predicts scenarios, and recommends mitigation actions to keep your
              organization resilient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/zion-security-shield"
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
