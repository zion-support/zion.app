import React from 'react';

export default function V906V910Showcase() {
  const engines = [
    {
      id: 'V906',
      name: 'Intelligent Email Intent Classifier',
      icon: '🎯',
      description: 'Classify email intent (request, question, complaint, inquiry, follow-up, urgent) with case-by-case analysis and confidence scoring',
      capabilities: [
        '6 intent categories with confidence scoring',
        'Automatic action item extraction',
        '3 urgency levels (high/medium/normal)',
        'Reply-all enforcement for multi-recipient emails',
        'Intelligent response strategy selection',
        'Multi-language support'
      ]
    },
    {
      id: 'V907',
      name: 'Smart Email Response Generator',
      icon: '✉️',
      description: 'Generate context-aware, personalized email responses with tone matching, key point addressing, and reply-all enforcement',
      capabilities: [
        'Context-aware response generation',
        'Automatic tone detection and matching',
        'Multi-language support (EN, PT, ES)',
        'Key point extraction and addressing',
        'Reply-all enforcement for multi-recipient emails',
        'Thread context awareness'
      ]
    },
    {
      id: 'V908',
      name: 'Email Priority & Routing Engine',
      icon: '📬',
      description: 'Intelligently prioritize and route emails to appropriate team members with case-by-case analysis and SLA management',
      capabilities: [
        '6 routing categories (technical, sales, support, billing, management, general)',
        'Priority-based routing (high/medium/normal)',
        'Automatic assignee selection',
        'SLA determination (2-48 hours)',
        'Reply-all enforcement',
        'Workload balancing'
      ]
    },
    {
      id: 'V909',
      name: 'Email Thread Analyzer',
      icon: '🧵',
      description: 'Analyze complete email threads to extract context, sentiment, action items, and conversation flow with health scoring',
      capabilities: [
        'Complete thread context analysis',
        'Conversation flow pattern detection',
        'Multi-email action item extraction',
        'Sentiment analysis across thread',
        'Unresolved issue identification',
        'Thread health scoring (0-100)'
      ]
    },
    {
      id: 'V910',
      name: 'Email Compliance & Audit Engine',
      icon: '🔒',
      description: 'Ensure email communications comply with policies, track audit trails, and enforce reply-all with comprehensive reporting',
      capabilities: [
        'Real-time email compliance auditing',
        'Sensitive data detection (PII, financial)',
        'Professional tone analysis',
        'Response time tracking',
        'Reply-all enforcement verification',
        'Compliance scoring (0-100)'
      ]
    }
  ];

  const services = [
    { category: 'Intent Analysis', count: 3, icon: '🎯' },
    { category: 'Response Generation', count: 3, icon: '✉️' },
    { category: 'Email Routing', count: 3, icon: '📬' },
    { category: 'Thread Analysis', count: 3, icon: '🧵' },
    { category: 'Compliance & Security', count: 3, icon: '🔒' },
    { category: 'Reply-All Enforcement', count: 3, icon: '📧' },
    { category: 'Email Automation', count: 3, icon: '⚙️' },
    { category: 'Email Analytics', count: 3, icon: '📊' },
    { category: 'Email Integration', count: 3, icon: '🔗' },
    { category: 'AI Email Assistants', count: 3, icon: '🤖' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Smart Email Responder Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five cutting-edge AI engines making email responders more intelligent with case-by-case analysis, 
            smart routing, and <strong className="text-yellow-300">100% reply-all enforcement</strong> — with 30 new services.
          </p>
        </div>

        {/* Reply-All Badge */}
        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400 mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">📧</span>
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-1">100% Reply-All Enforcement</h3>
              <p className="text-gray-300">
                All engines automatically detect multi-recipient emails and enforce reply-all to ensure 
                all stakeholders receive responses. Never accidentally reply to sender only again!
              </p>
            </div>
          </div>
        </div>

        {/* Engine Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400/60 transition-all">
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="text-sm font-mono text-yellow-300 mb-2">{engine.id}</div>
              <h3 className="text-xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{engine.description}</p>
              <ul className="space-y-2">
                {engine.capabilities.slice(0, 4).map((capability, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Services Overview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">30 New Smart Email Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map((service, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{service.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{service.category}</div>
                <div className="text-yellow-300 text-sm">{service.count} services</div>
              </div>
            ))}
          </div>
        </div>

        {/* Case-by-Case Analysis Feature */}
        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">🎯 Case-by-Case Email Analysis</h3>
          <p className="text-gray-300 text-center mb-6 max-w-3xl mx-auto">
            Every email is analyzed individually to determine intent, urgency, sentiment, and appropriate action. 
            No more one-size-fits-all responses — each email gets the attention it deserves.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h4 className="text-white font-semibold mb-2">Intent Detection</h4>
              <p className="text-gray-400 text-sm">Classify as request, question, complaint, inquiry, follow-up, or urgent</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="text-white font-semibold mb-2">Priority Scoring</h4>
              <p className="text-gray-400 text-sm">Determine urgency level and appropriate response time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="text-white font-semibold mb-2">Smart Action</h4>
              <p className="text-gray-400 text-sm">Route, respond, or escalate based on analysis</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">910</div>
            <div className="text-gray-400 text-sm">Total AI Engines</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4,357</div>
            <div className="text-gray-400 text-sm">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
            <div className="text-gray-400 text-sm">Reply-All Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5</div>
            <div className="text-gray-400 text-sm">Smart Engines</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/services?category=ai" className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            Explore Smart Email Services →
          </a>
        </div>
      </div>
    </section>
  );
}
