import React from 'react';

export default function V921V925Showcase() {
  const engines = [
    {
      id: 'V921',
      name: 'Compliance Guardian Pro',
      icon: '🛡️',
      description: 'Auto-detect GDPR, HIPAA, PCI-DSS, SOX violations. Redacts PII, flags risky content, prevents non-compliant replies.',
      capabilities: ['PII auto-redaction', 'GDPR/HIPAA/PCI/SOX detection', 'Compliance scoring', 'Safe-to-send verification'],
      stats: { accuracy: '98%', frameworks: '4 major', violations: 'Auto-blocked' }
    },
    {
      id: 'V922',
      name: 'Revenue Attribution Engine',
      icon: '💰',
      description: 'Track revenue from email conversations. Attribute deals, calculate ROI, identify high-value communication patterns.',
      capabilities: ['Revenue attribution', 'Deal stage detection', 'Priority scoring', 'CRM auto-sync'],
      stats: { accuracy: '94%', dealsTracked: '100%', roi: 'Calculated' }
    },
    {
      id: 'V923',
      name: 'Crisis Detection System',
      icon: '🚨',
      description: 'Detect PR crises, customer escalations, and reputation threats in real-time. Auto-escalate and generate crisis responses.',
      capabilities: ['Crisis type detection', 'Escalation triggers', 'Management notification', 'Crisis protocols'],
      stats: { accuracy: '96%', responseTime: '< 30s', escalation: 'Automatic' }
    },
    {
      id: 'V924',
      name: 'Negotiation Intelligence',
      icon: '🤝',
      description: 'Analyze negotiation patterns, detect pricing pressure, suggest counter-offers, track concessions, and predict deal outcomes.',
      capabilities: ['Pressure detection', 'Strategy recommendation', 'Concession tracking', 'Agreement signals'],
      stats: { accuracy: '92%', dealPrediction: '85%', strategies: '4 types' }
    },
    {
      id: 'V925',
      name: 'Knowledge Distiller',
      icon: '📚',
      description: 'Extract and organize knowledge from email threads into FAQs, playbooks, and training materials automatically.',
      capabilities: ['Decision extraction', 'FAQ generation', 'Process documentation', 'Knowledge graph'],
      stats: { accuracy: '95%', faqsGenerated: 'Auto', knowledge: 'Structured' }
    }
  ];

  const features = [
    { icon: '🛡️', title: 'Compliance Automation', desc: 'Auto-detect regulatory violations across GDPR, HIPAA, PCI-DSS, and SOX. Redact PII before sending.' },
    { icon: '💰', title: 'Revenue Intelligence', desc: 'Attribute revenue to email conversations, track deal stages, and prioritize high-value communications.' },
    { icon: '🚨', title: 'Crisis Management', desc: 'Real-time crisis detection with automatic escalation, response templates, and management notifications.' },
    { icon: '🤝', title: 'Negotiation Coaching', desc: 'AI-powered negotiation analysis with pressure detection, strategy recommendations, and concession tracking.' },
    { icon: '📚', title: 'Knowledge Capture', desc: 'Automatically build institutional knowledge from email threads: decisions, processes, FAQs, and facts.' },
    { icon: '✉️', title: 'Reply-All Enforcement', desc: 'Every engine strictly enforces reply-all for multi-recipient emails to ensure transparency and compliance.' }
  ];

  const pricing = [
    { name: 'Starter', price: '$59', period: '/month', features: ['1 Engine', '500 emails/month', 'Basic compliance', 'Email support'], recommended: false },
    { name: 'Professional', price: '$179', period: '/month', features: ['All 5 Engines', '10,000 emails/month', 'Advanced features', 'Priority support', 'Reply-all enforcement', 'API access'], recommended: true },
    { name: 'Enterprise', price: '$499', period: '/month', features: ['All 5 Engines', 'Unlimited emails', 'Custom integrations', 'Dedicated support', 'SLA guarantee', '24/7 support', 'On-premise option'], recommended: false }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-500/20 border border-emerald-400/30 rounded-full px-6 py-2 mb-6">
            <span className="text-emerald-300 font-semibold">🏆 Enterprise Email Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            V921-V925: Compliance, Revenue & Knowledge AI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five enterprise-grade AI engines that enforce compliance, track revenue, detect crises, 
            coach negotiations, and distill institutional knowledge from every email.
            <strong className="text-yellow-300"> Case-by-case analysis with strict reply-all enforcement.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all hover:transform hover:scale-105">
              <div className="text-4xl mb-4">{engine.icon}</div>
              <div className="text-xs font-mono text-emerald-300 mb-2">{engine.id}</div>
              <h3 className="text-lg font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-sm text-gray-300 mb-4">{engine.description}</p>
              <ul className="space-y-1 mb-4">
                {engine.capabilities.slice(0, 3).map((cap, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-start">
                    <span className="text-green-400 mr-2">✓</span>{cap}
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-3">
                {Object.entries(engine.stats).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-emerald-300 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-10">Key Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{f.title}</h4>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-10">Pricing Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.recommended ? 'bg-emerald-600/30 border-emerald-400 scale-105' : 'bg-white/10 border-white/20'}`}>
                {plan.recommended && <div className="text-center mb-4"><span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span></div>}
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="mb-6"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center"><span className="text-green-400 mr-2">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/contact" className={`block text-center py-3 rounded-lg font-semibold transition ${plan.recommended ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Enterprise-Grade Email Intelligence</h3>
          <p className="text-gray-300 mb-6">
            Join leading organizations using our compliance, revenue, and knowledge AI engines 
            to protect data, maximize revenue, and preserve institutional knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition">
              Request Demo
            </a>
            <a href="/services" className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-lg transition">
              View All Services
            </a>
          </div>
          <div className="text-gray-400 text-sm space-y-1">
            <p>📞 <strong>+1 302 464 0950</strong> | 📧 <strong>kleber@ziontechgroup.com</strong></p>
            <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
