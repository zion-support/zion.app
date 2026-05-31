import React from 'react';

export default function V936V940Showcase() {
  const engines = [
    {
      id: 'V936',
      name: 'Digital Twin Engine',
      icon: '🤖',
      description: 'Create an AI clone that drafts emails in your exact style. Learns your voice, tone, and patterns from past emails.',
      capabilities: ['Persona cloning', 'Style matching', 'Auto-drafting', 'Intent classification'],
      stats: { accuracy: '92%', training: '5+ emails', confidence: '82%' }
    },
    {
      id: 'V937',
      name: 'Meeting-to-Action Converter',
      icon: '📋',
      description: 'Convert meeting follow-up emails into structured project plans with tasks, deadlines, owners, and milestones.',
      capabilities: ['Task extraction', 'Owner assignment', 'Deadline detection', 'Milestone generation'],
      stats: { accuracy: '94%', tasks: 'Auto-assigned', milestones: 'Auto-generated' }
    },
    {
      id: 'V938',
      name: 'Emotional Intelligence Coach',
      icon: '🧠',
      description: 'Real-time coaching that detects emotional triggers and suggests empathetic response strategies. Prevents reactive responses.',
      capabilities: ['Emotion detection', 'Trigger alerts', 'Escalation prevention', 'Empathetic drafts'],
      stats: { accuracy: '93%', emotions: '6 types', risk: 'Scored' }
    },
    {
      id: 'V939',
      name: 'Data Privacy Scanner',
      icon: '🛡️',
      description: 'Advanced scanning for trade secrets, insider trading risks, IP leaks, and confidential data. Blocks critical violations.',
      capabilities: ['Trade secret detection', 'Insider trading alerts', 'IP leak prevention', 'Auto-blocking'],
      stats: { accuracy: '96%', frameworks: '8+', blocking: 'Auto' }
    },
    {
      id: 'V940',
      name: 'Multichannel Orchestrator',
      icon: '🌐',
      description: 'Route communications across email, Slack, Teams, SMS, and WhatsApp based on urgency, content, and preference.',
      capabilities: ['Cross-channel routing', 'Urgency detection', 'Preference matching', 'Unified inbox'],
      stats: { accuracy: '91%', channels: '6', efficiency: '86%+' }
    }
  ];

  const features = [
    { icon: '🤖', title: 'Digital Twin', desc: 'AI clone that writes emails in your exact style. Handles routine inquiries while you focus on high-value work.' },
    { icon: '📋', title: 'Meeting Intelligence', desc: 'Auto-convert meeting notes into project plans with tasks, deadlines, and assigned owners.' },
    { icon: '🧠', title: 'Emotional Intelligence', desc: 'Detect emotional triggers, prevent escalation, and craft empathetic responses automatically.' },
    { icon: '🛡️', title: 'Privacy Protection', desc: 'Block trade secrets, insider trading risks, IP leaks, and confidential data before sending.' },
    { icon: '🌐', title: 'Multichannel Routing', desc: 'Smart routing across email, Slack, Teams, SMS, and WhatsApp for optimal communication.' },
    { icon: '✉️', title: 'Reply-All Enforcement', desc: 'Every engine strictly enforces reply-all for multi-recipient emails ensuring transparency.' }
  ];

  const pricing = [
    { name: 'Starter', price: '$49', period: '/month', features: ['2 Engines', '1,000 emails/month', 'Basic features', 'Email support'], recommended: false },
    { name: 'Professional', price: '$189', period: '/month', features: ['All 5 Engines', '20,000 emails/month', 'Advanced features', 'Priority support', 'API access'], recommended: true },
    { name: 'Enterprise', price: '$599', period: '/month', features: ['All 5 Engines', 'Unlimited emails', 'Custom integrations', '24/7 support', 'Dedicated CSM'], recommended: false }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-2 mb-6">
            <span className="text-blue-300 font-semibold">🚀 Next-Gen Email Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            V936-V940: AI-Powered Email Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five revolutionary AI engines: digital twins, meeting intelligence, emotional coaching,
            privacy protection, and multichannel orchestration.
            <strong className="text-yellow-300"> Case-by-case analysis with strict reply-all enforcement.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all hover:transform hover:scale-105">
              <div className="text-4xl mb-4">{engine.icon}</div>
              <div className="text-xs font-mono text-blue-300 mb-2">{engine.id}</div>
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
                    <span className="text-blue-300 font-semibold">{val}</span>
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
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.recommended ? 'bg-blue-600/30 border-blue-400 scale-105' : 'bg-white/10 border-white/20'}`}>
                {plan.recommended && <div className="text-center mb-4"><span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span></div>}
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="mb-6"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center"><span className="text-green-400 mr-2">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/contact" className={`block text-center py-3 rounded-lg font-semibold transition ${plan.recommended ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Email?</h3>
          <p className="text-gray-300 mb-6">
            Join organizations using our AI-powered suite to automate routine emails,
            convert meetings to actions, protect privacy, and route across channels.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="/contact" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition">
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
