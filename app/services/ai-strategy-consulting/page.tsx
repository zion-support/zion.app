/* eslint-disable */
import Metadata from 'next';
import Link from 'next/link';

export const metadata = {
  title: 'AI Strategy Consulting | Zion Tech Group',
  description: 'Transform your business with expert AI strategy consulting. Discover how Zion Tech Group can help transform your business.',
  openGraph: {
    title: 'AI Strategy Consulting | Zion Tech Group',
    description: 'Transform your business with expert AI strategy consulting',
    url: 'https://ziontechgroup.com/solutions/ai-strategy-consulting',
  },
  twitter: { card: 'summary_large_image' },
};

const features = ["Comprehensive AI readiness assessment","Custom AI roadmap development","Technology stack recommendations","ROI analysis and forecasting","Change management strategy"];
const benefits = ["Accelerate AI adoption","Minimize implementation risks","Maximize return on investment","Build sustainable AI capabilities","Stay ahead of competition"];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <section className="py-20 text-center max-w-7xl mx-auto px-4">
        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 font-semibold">
          Premium Service
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">AI Strategy Consulting</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">Transform your business with expert AI strategy consulting</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/contact" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all">
            Get Started Today
          </a>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature) => (
              <div key={feature} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature}</h3>
                <p className="text-gray-600">Leverage cutting-edge AI technology to optimize your operations.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Benefits &amp; Results</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit}</h3>
                  <p className="text-gray-600">Achieve transformative results with our proven AI solutions.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let&apos;s discuss how AI Strategy Consulting can help you achieve your goals.
          </p>
          <a href="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors">
            Schedule Your Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
