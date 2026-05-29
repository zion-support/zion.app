// app/bundles/page.tsx — Smart Service Bundles
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BUNDLES = [
  {
    id: 'startup-growth',
    name: 'Startup Growth Pack',
    emoji: '🚀',
    tagline: 'Everything a startup needs to scale fast',
    description: 'Launch-ready stack: AI document automation, customer support chatbot, and cloud infrastructure — bundled at 20% off individual pricing.',
    services: ['AI Document Processing', 'Customer Support Chatbot', 'Cloud Cost Optimization', 'CI/CD Pipeline Setup'],
    pricing: { monthly: 2999, annual: 28999 },
    originalPrice: 3749,
    discount: 20,
    color: 'from-green-600 to-emerald-600',
    idealFor: 'Startups & Scale-ups',
    features: [
      'Process 1,000 documents/month',
      'Handle 5,000 support tickets/month',
      'Reduce cloud spend by 30%',
      'Automated deployments in <5 min',
      '24/7 monitoring included',
      'Monthly strategy call',
    ],
  },
  {
    id: 'enterprise-security',
    name: 'Enterprise Security Suite',
    emoji: '🛡️',
    tagline: 'Complete cybersecurity for regulated industries',
    description: 'SOC 24/7 monitoring, cloud workload protection, zero-trust network, and compliance automation — all managed by certified security engineers.',
    services: ['24/7 SOC Monitoring', 'Cloud Workload Protection', 'Zero Trust SASE', 'Compliance Automation', 'Penetration Testing (Quarterly)'],
    pricing: { monthly: 14999, annual: 149999 },
    originalPrice: 18999,
    discount: 21,
    color: 'from-red-600 to-orange-600',
    idealFor: 'Healthcare, Finance, Enterprise',
    features: [
      '24/7/365 threat monitoring',
      'Protect unlimited endpoints',
      'Zero-trust network architecture',
      'SOC 2 / HIPAA / PCI compliance',
      'Quarterly pen tests included',
      'Incident response <15 min',
      'Dedicated security engineer',
    ],
  },
  {
    id: 'manufacturing-ai',
    name: 'Manufacturing AI Pack',
    emoji: '🏭',
    tagline: 'Smart factory powered by AI + IoT',
    description: 'Predictive maintenance, computer vision QC, and supply chain optimization — reduce downtime 50% and defects 80%.',
    services: ['AI Predictive Maintenance', 'Computer Vision QC', 'Supply Chain Orchestrator', 'IoT Sensor Platform'],
    pricing: { monthly: 9999, annual: 99999 },
    originalPrice: 12499,
    discount: 20,
    color: 'from-blue-600 to-cyan-600',
    idealFor: 'Manufacturing, Logistics, Energy',
    features: [
      'Predict equipment failures 48h ahead',
      '99.5% defect detection rate',
      'Real-time supply chain visibility',
      'IoT data from 10,000+ sensors',
      'Dashboard with OEE tracking',
      'ROI typically achieved in 3 months',
    ],
  },
  {
    id: 'ecommerce-booster',
    name: 'E-commerce Booster',
    emoji: '🛒',
    tagline: 'Increase revenue 30% with AI-powered commerce',
    description: 'AI recommendations, dynamic pricing, customer journey optimization, and marketing automation — all working together to maximize conversions.',
    services: ['AI Product Recommendations', 'Dynamic Pricing Engine', 'Customer Journey Architect', 'Marketing Automation'],
    pricing: { monthly: 4999, annual: 49999 },
    originalPrice: 6499,
    discount: 23,
    color: 'from-purple-600 to-pink-600',
    idealFor: 'E-commerce, Retail, D2C Brands',
    features: [
      'Personalized recommendations (15% AOV lift)',
      'Dynamic pricing across 10,000 SKUs',
      'Abandoned cart recovery +35%',
      'Multi-channel campaign automation',
      'Real-time analytics dashboard',
      'A/B testing framework included',
    ],
  },
  {
    id: 'digital-workplace',
    name: 'Digital Workplace Bundle',
    emoji: '💼',
    tagline: 'Modern workplace for hybrid teams',
    description: 'Unified communications, employee self-service portal, AI onboarding, and IT service management — everything for a productive hybrid workforce.',
    services: ['Unified Communications', 'Employee Self-Service Portal', 'AI Onboarding Agent', 'IT Service Desk'],
    pricing: { monthly: 3999, annual: 39999 },
    originalPrice: 5249,
    discount: 24,
    color: 'from-indigo-600 to-violet-600',
    idealFor: 'Companies with 50-500 employees',
    features: [
      'Voice/video/messaging in one platform',
      'Self-service HR portal (PTO, expenses, benefits)',
      'AI-powered new hire onboarding',
      'IT ticket automation (70% auto-resolved)',
      'Works with MS Teams, Slack, Zoom',
      'Employee satisfaction surveys',
    ],
  },
  {
    id: 'data-intelligence',
    name: 'Data Intelligence Platform',
    emoji: '📊',
    tagline: 'Turn data into competitive advantage',
    description: 'Full data stack: warehouse, ETL pipelines, BI dashboards, and ML models — everything you need to become data-driven.',
    services: ['Cloud Data Warehouse', 'ETL Pipeline Builder', 'Embedded Analytics', 'ML Model Platform'],
    pricing: { monthly: 7999, annual: 79999 },
    originalPrice: 10499,
    discount: 24,
    color: 'from-teal-600 to-green-600',
    idealFor: 'Data-driven organizations',
    features: [
      'Snowflake/BigQuery setup & optimization',
      'Automated ETL from 50+ sources',
      'Embeddable dashboards for customers',
      'ML model training & deployment',
      'Data quality monitoring',
      'Data catalog & lineage tracking',
    ],
  },
];

export default function BundlesPage() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container-page">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm mb-6">
            <span>🎁</span> Save 20-25% with bundles
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Service Bundles
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            Pre-configured service packages designed for specific business needs.
            Single contract, unified support, bundled pricing — save time and money.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-slate-800 rounded-full text-slate-300">✅ 20-25% bundle discount</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-slate-300">✅ Single contract</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-slate-300">✅ Dedicated account manager</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-slate-300">✅ Quarterly reviews</span>
          </div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="py-12">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUNDLES.map(bundle => (
              <div
                key={bundle.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${bundle.color} p-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{bundle.emoji}</span>
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Save {bundle.discount}%
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{bundle.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{bundle.tagline}</p>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-sm text-slate-400 mb-4">{bundle.description}</p>

                  {/* Services included */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Includes:</p>
                    <div className="space-y-1">
                      {bundle.services.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="text-green-400">✓</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-slate-800 pt-4 mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-white">${bundle.pricing.monthly.toLocaleString()}</span>
                      <span className="text-sm text-slate-500">/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 line-through">${bundle.originalPrice.toLocaleString()}/mo</span>
                      <span className="text-xs text-green-400 font-semibold">
                        Save ${((bundle.originalPrice - bundle.pricing.monthly) * 12).toLocaleString()}/year
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      or ${bundle.pricing.annual.toLocaleString()}/year (2 months free)
                    </p>
                  </div>

                  {/* Ideal For */}
                  <p className="text-xs text-slate-500 mb-4">
                    <span className="font-semibold text-slate-400">Ideal for:</span> {bundle.idealFor}
                  </p>

                  {/* CTA */}
                  <div className="flex gap-2">
                    <Link
                      href={`/contact?bundle=${bundle.id}`}
                      className={`flex-1 text-center px-4 py-2 bg-gradient-to-r ${bundle.color} text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all`}
                    >
                      Get This Bundle
                    </Link>
                    <button
                      onClick={() => setSelectedBundle(selectedBundle === bundle.id ? null : bundle.id)}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {selectedBundle === bundle.id ? 'Hide' : 'Details'}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {selectedBundle === bundle.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Key Outcomes:</p>
                      <div className="space-y-1">
                        {bundle.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="text-green-400 mt-0.5">•</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Bundle Builder */}
      <section className="py-16 border-t border-slate-800">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🔧 Build Your Own Bundle</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-6">
            Pick 3+ services from our catalog and get an automatic 15% discount.
            The more services you bundle, the bigger the savings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <p className="text-2xl font-bold text-white">3-4 services</p>
              <p className="text-green-400 font-semibold">15% off</p>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <p className="text-2xl font-bold text-white">5-7 services</p>
              <p className="text-green-400 font-semibold">20% off</p>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <p className="text-2xl font-bold text-white">8+ services</p>
              <p className="text-green-400 font-semibold">25% off</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:opacity-90 transition-all"
            >
              🛠️ Browse All Services
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-full hover:bg-slate-700 transition-all"
            >
              📧 Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 border-t border-slate-800 bg-slate-900/50">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a Custom Bundle?</h2>
          <p className="text-slate-400 mb-6">
            Our solutions architects will design the perfect bundle for your specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="tel:+13024640950" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <span>☎</span> +1 302 464 0950
            </a>
            <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <span>✉</span> kleber@ziontechgroup.com
            </a>
            <span className="flex items-center gap-2 text-slate-300">
              <span>📍</span> 364 E Main St STE 1008, Middletown, DE 19709
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
