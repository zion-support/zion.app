import React from 'react';

export default function V931V935Showcase() {
  const engines = [
    {
      id: 'V931',
      name: 'Carbon Footprint Calculator',
      icon: '🌱',
      description: 'Calculate the environmental impact of every email. Track CO2 emissions and generate ESG sustainability reports.',
      capabilities: ['Carbon tracking', 'ESG reports', 'Attachment optimization', 'Equivalency metrics'],
      stats: { accuracy: '97%', reduction: '40%', esg: 'Ready' }
    },
    {
      id: 'V932',
      name: 'Accessibility Auditor',
      icon: '♿',
      description: 'WCAG 2.1 compliance auditing. Detect color contrast issues, missing alt text, and screen reader compatibility.',
      capabilities: ['WCAG 2.1 audit', 'Auto-fix suggestions', 'Screen reader testing', 'Compliance scoring'],
      stats: { accuracy: '95%', standards: 'WCAG 2.1', fixes: 'Auto' }
    },
    {
      id: 'V933',
      name: 'Cultural Intelligence',
      icon: '🌍',
      description: 'Detect cultural sensitivities and adapt tone for 40+ cultures. Prevent cross-cultural misunderstandings.',
      capabilities: ['40+ cultures', 'Sensitivity detection', 'Tone adaptation', 'Idiom replacement'],
      stats: { accuracy: '93%', cultures: '40+', fit: 'Scored' }
    },
    {
      id: 'V934',
      name: 'Gamification Platform',
      icon: '🎮',
      description: 'Points, badges, and leaderboards for email productivity. Reward good habits and boost team engagement.',
      capabilities: ['Points system', 'Badge collection', 'Leaderboards', 'Streaks'],
      stats: { engagement: '+60%', badges: '10+', streaks: 'Daily' }
    },
    {
      id: 'V935',
      name: 'Predictive Analytics',
      icon: '📈',
      description: 'AI-powered email volume forecasting and capacity planning. Prevent bottlenecks with 7-30 day predictions.',
      capabilities: ['Volume forecasting', 'Capacity planning', 'Bottleneck detection', 'SLA prediction'],
      stats: { accuracy: '92%', forecast: '7-30 days', sla: 'Proactive' }
    }
  ];

  const features = [
    { icon: '🌱', title: 'Sustainability', desc: 'Track and reduce your email carbon footprint. Generate ESG-compliant reports automatically.' },
    { icon: '♿', title: 'Accessibility', desc: 'Ensure every email meets WCAG 2.1 standards. Screen reader compatible and inclusive by design.' },
    { icon: '🌍', title: 'Cultural Intelligence', desc: 'Communicate effectively across 40+ cultures. Avoid faux pas and build stronger international relationships.' },
    { icon: '🎮', title: 'Gamification', desc: 'Make email productive and fun. Points, badges, and competitions that drive better habits.' },
    { icon: '📈', title: 'Predictive Analytics', desc: 'Know what is coming before it arrives. AI forecasts volume, staffing needs, and SLA risks.' },
    { icon: '✉️', title: 'Reply-All Enforcement', desc: 'Every engine enforces strict reply-all for multi-recipient emails ensuring nothing falls through cracks.' }
  ];

  const pricing = [
    { name: 'Starter', price: '$39', period: '/month', features: ['2 Engines', '500 emails/month', 'Basic analytics', 'Email support'], recommended: false },
    { name: 'Professional', price: '$159', period: '/month', features: ['All 5 Engines', '10,000 emails/month', 'Advanced features', 'Priority support', 'API access', 'Reply-all enforcement'], recommended: true },
    { name: 'Enterprise', price: '$499', period: '/month', features: ['All 5 Engines', 'Unlimited emails', 'Custom integrations', '24/7 support', 'SLA guarantee', 'Dedicated CSM'], recommended: false }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-green-500/20 border border-green-400/30 rounded-full px-6 py-2 mb-6">
            <span className="text-green-300 font-semibold">🌟 Sustainability & Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            V931-V935: Green & Smart Email Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five innovative AI engines for sustainable, accessible, culturally-aware, gamified, and 
            predictive email intelligence.
            <strong className="text-yellow-300"> Case-by-case analysis with strict reply-all enforcement.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all hover:transform hover:scale-105">
              <div className="text-4xl mb-4">{engine.icon}</div>
              <div className="text-xs font-mono text-green-300 mb-2">{engine.id}</div>
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
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-green-300 font-semibold">{val}</span>
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
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.recommended ? 'bg-green-600/30 border-green-400 scale-105' : 'bg-white/10 border-white/20'}`}>
                {plan.recommended && <div className="text-center mb-4"><span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span></div>}
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="mb-6"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center"><span className="text-green-400 mr-2">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/contact" className={`block text-center py-3 rounded-lg font-semibold transition ${plan.recommended ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Sustainable & Intelligent Email</h3>
          <p className="text-gray-300 mb-6">
            Join organizations using our green, accessible, and predictive email engines 
            to reduce environmental impact while maximizing productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition">
              Start Free Trial
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
