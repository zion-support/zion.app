/* eslint-disable */
import Metadata from 'next';
import Link from 'next/link';

export const metadata = {
  title: 'Retail Case Study: 95% customer satisfaction | Zion Tech Group',
  description: 'Learn how we helped Retail Solutions Inc achieve 95% customer satisfaction through Intelligent chatbots.',
  openGraph: {
    title: 'Retail Case Study | Zion Tech Group',
    description: '95% customer satisfaction',
    url: 'https://ziontechgroup.com/case-studies/retail-high-operational-costs',
  },
  twitter: { card: 'summary_large_image' },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <section className="py-20 max-w-5xl mx-auto px-4">
        <span className="text-xl font-semibold text-gray-700">Retail Industry</span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 mt-4">
          How Retail Solutions Inc Achieved 95% customer satisfaction
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A case study on transforming retail operations through
          intelligent chatbots and AI automation.
        </p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Retail Solutions Inc was facing significant challenges with high operational costs,
            impacting their ability to compete effectively and serve customers.
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-3">Key Challenges</h3>
            <ul className="space-y-2 text-red-800">
              <li>High operational costs</li>
              <li>High operational costs reducing profitability</li>
              <li>Difficulty scaling operations to meet demand</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Solution</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Zion Tech Group partnered with Retail Solutions Inc to implement intelligent chatbots
          that addressed their challenges comprehensively.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {['Discovery Phase', 'Implementation', 'Training &amp; Support', 'Optimization'].map((phase) => (
            <div key={phase} className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{phase}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">The Results</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">300%</div>
              <div className="text-blue-100">Primary Metric Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50%</div>
              <div className="text-blue-100">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Achieve Similar Results?</h2>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a href="/contact" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all">
            Schedule a Consultation
          </a>
          <a href="/case-studies" className="px-10 py-4 bg-gray-100 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors">
            View More Case Studies
          </a>
        </div>
      </section>
    </div>
  );
}
