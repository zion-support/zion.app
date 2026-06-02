import React from 'react';

export default function V911V915Showcase() {
  const engines = [
    {
      id: 'V911',
      name: 'Email Emotion Intelligence',
      icon: '😊',
      description: 'Detect sender emotional state and adjust response tone with escalation prevention',
      capabilities: ['6 emotion categories', 'Intensity scoring (0-100)', 'Escalation risk detection', 'Empathetic response generation']
    },
    {
      id: 'V912',
      name: 'Email Context Memory',
      icon: '🧠',
      description: 'Remember past conversations and build relationship profiles for personalized responses',
      capabilities: ['Conversation history', 'Relationship profiles', 'Topic tracking', 'Decision tracking']
    },
    {
      id: 'V913',
      name: 'Predictive Response Engine',
      icon: '🔮',
      description: 'Predict what response is needed using pattern recognition and learned templates',
      capabilities: ['Response prediction', 'Pattern recognition', 'Template matching', 'Confidence scoring']
    },
    {
      id: 'V914',
      name: 'Attachment Analyzer',
      icon: '📎',
      description: 'Analyze email attachments (PDFs, spreadsheets, images) and generate content-aware responses',
      capabilities: ['PDF analysis', 'Spreadsheet parsing', 'Image OCR', 'Content classification']
    },
    {
      id: 'V915',
      name: 'Time Zone Aware Responder',
      icon: '🌍',
      description: 'Respect global business hours and schedule responses for optimal delivery times',
      capabilities: ['Timezone detection', 'Business hours tracking', 'Response scheduling', 'Weekend awareness']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced Email Intelligence Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough AI engines making email responders emotionally intelligent, context-aware, 
            predictive, and globally conscious — with <strong className="text-yellow-300">100% reply-all enforcement</strong>.
          </p>
        </div>

        {/* Key Features Banner */}
        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400 mb-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-1">Case-by-Case Analysis</h3>
              <p className="text-gray-300 text-sm">Every email analyzed individually</p>
            </div>
            <div>
              <div className="text-4xl mb-2">📧</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-1">100% Reply-All</h3>
              <p className="text-gray-300 text-sm">Never miss a stakeholder</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-1">Smart Actions</h3>
              <p className="text-gray-300 text-sm">Appropriate response for each email</p>
            </div>
          </div>
        </div>

        {/* Engine Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400/60 transition-all">
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="text-sm font-mono text-yellow-300 mb-2">{engine.id}</div>
              <h3 className="text-xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{engine.description}</p>
              <ul className="space-y-2">
                {engine.capabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 30 New Services */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">30 New Diversified Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { category: 'Emotion Intelligence', count: 3, icon: '😊' },
              { category: 'Context Memory', count: 3, icon: '🧠' },
              { category: 'Predictive AI', count: 3, icon: '🔮' },
              { category: 'Document Intelligence', count: 3, icon: '📎' },
              { category: 'Global Communication', count: 3, icon: '🌍' },
              { category: 'Micro SaaS', count: 6, icon: '🚀' },
              { category: 'IT Services', count: 6, icon: '🔧' },
              { category: 'AI Services', count: 3, icon: '🤖' }
            ].map((service, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{service.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{service.category}</div>
                <div className="text-yellow-300 text-sm">{service.count} services</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">915</div>
            <div className="text-gray-400 text-sm">Total AI Engines</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4,387</div>
            <div className="text-gray-400 text-sm">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
            <div className="text-gray-400 text-sm">Reply-All Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5</div>
            <div className="text-gray-400 text-sm">New Smart Engines</div>
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
