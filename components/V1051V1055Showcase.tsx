'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V1051',
    name: 'AI Negotiation Coach',
    icon: '🤝',
    color: 'from-emerald-500 to-teal-600',
    features: ['Real-time leverage analysis', 'Counter-offer suggestions', 'Objection handling', 'Closing signal detection', 'Timing optimization', 'Deal stage tracking'],
    price: '$699/mo',
    useCase: 'Get real-time coaching during negotiations with AI-powered leverage analysis and counter-offer suggestions'
  },
  {
    version: 'V1052',
    name: 'Workflow Automation Architect',
    icon: '⚙️',
    color: 'from-violet-500 to-purple-600',
    features: ['Multi-step workflow creation', 'Conditional logic', 'Zapier & Make.com', 'Slack integration', 'CRM sync', 'Custom triggers'],
    price: '$549/mo',
    useCase: 'Automatically create multi-step workflows from emails with native Zapier, Make.com, and Slack integration'
  },
  {
    version: 'V1053',
    name: 'Compliance Guardian Pro',
    icon: '🛡️',
    color: 'from-red-500 to-rose-600',
    features: ['HIPAA, GDPR, SOX, PCI, FINRA', 'Auto-redaction of PII', 'Tamper-proof audit trails', 'Real-time violation alerts', 'Disclaimer enforcement', 'Regulatory updates'],
    price: '$899/mo',
    useCase: 'Industry-specific compliance checking with auto-redaction and tamper-proof audit trails'
  },
  {
    version: 'V1054',
    name: 'Email Intelligence API',
    icon: '🔌',
    color: 'from-cyan-500 to-blue-600',
    features: ['RESTful API platform', '7 language SDKs', 'Webhook support', 'Rate limiting', 'Usage analytics', '99.9% uptime SLA'],
    price: '$799/mo',
    useCase: 'Expose all email intelligence features as APIs with SDKs for Python, Node.js, Java, .NET, Go, Ruby, and PHP'
  },
  {
    version: 'V1055',
    name: 'Performance Analytics',
    icon: '📈',
    color: 'from-amber-500 to-orange-600',
    features: ['Response time tracking', 'Conversion analytics', 'Team performance', 'A/B testing', 'Predictive insights', 'Revenue attribution'],
    price: '$499/mo',
    useCase: 'Comprehensive analytics dashboard with predictive insights and revenue attribution per email'
  }
];

export default function V1051V1055Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const current = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-500 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 via-violet-500 to-cyan-500 rounded-full text-white text-sm font-semibold mb-4 animate-pulse">
            V1051-V1055 • 5 NEW ENGINES • 25 NEW SERVICES • 5,105 TOTAL
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Enterprise Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From negotiation coaching to compliance automation, API platform to predictive analytics — 
            every email analyzed case-by-case with mandatory reply-all enforcement.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {engines.map((engine, idx) => (
            <button
              key={engine.version}
              onClick={() => setActiveEngine(idx)}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeEngine === idx
                  ? `bg-gradient-to-r ${engine.color} text-white shadow-lg shadow-white/10 scale-105`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className="text-2xl mr-2">{engine.icon}</span>
              <span className="hidden sm:inline">{engine.version}</span>
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className={`bg-gradient-to-r ${current.color} rounded-3xl p-[2px] shadow-2xl`}>
            <div className="bg-gray-950 rounded-3xl p-8 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Icon & Info */}
                <div className="lg:w-1/3">
                  <div className={`w-20 h-20 bg-gradient-to-br ${current.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4`}>
                    {current.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-gray-500">{current.version}</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">LIVE</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{current.name}</h3>
                  <p className="text-gray-400 mb-4">{current.useCase}</p>
                  <div className="text-3xl font-bold text-white mb-1">{current.price}</div>
                  <div className="text-sm text-gray-500 mb-4">per organization/month</div>
                  <a
                    href="mailto:kleber@ziontechgroup.com?subject=Inquiry: ${current.name}"
                    className={`inline-block px-6 py-3 bg-gradient-to-r ${current.color} text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg`}
                  >
                    Get Started →
                  </a>
                </div>

                {/* Right: Features */}
                <div className="lg:w-2/3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {current.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
          {engines.map((engine, idx) => (
            <div
              key={engine.version}
              onClick={() => setActiveEngine(idx)}
              className={`bg-white/5 backdrop-blur rounded-xl p-4 text-center border cursor-pointer transition-all ${
                activeEngine === idx ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-2">{engine.icon}</div>
              <div className="text-sm font-bold text-white">{engine.version}</div>
              <div className="text-xs text-gray-500 mt-1">{engine.price}</div>
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="text-white font-semibold mb-2">Case-by-Case Analysis</h4>
            <p className="text-gray-400 text-sm">Every email individually analyzed for context, urgency, sentiment, and appropriate action.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">👥</div>
            <h4 className="text-white font-semibold mb-2">Reply-All Enforcement</h4>
            <p className="text-gray-400 text-sm">Mandatory reply-all for multi-recipient emails. Never accidentally leave stakeholders out.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="text-white font-semibold mb-2">Enterprise Security</h4>
            <p className="text-gray-400 text-sm">PII detection, DLP scanning, encrypted audit trails, and compliance monitoring built-in.</p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 text-center border border-gray-700 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Email Workflow?</h3>
          <p className="text-gray-400 mb-6">Contact Zion Tech Group for a personalized demo and enterprise pricing.</p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-300">
            <a href="tel:+13024640950" className="flex items-center gap-2 hover:text-white transition-colors">
              <span>📱</span> +1 302 464 0950
            </a>
            <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <span>✉️</span> kleber@ziontechgroup.com
            </a>
            <span className="flex items-center gap-2">
              <span>📍</span> 364 E Main St STE 1008, Middletown DE 19709
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
