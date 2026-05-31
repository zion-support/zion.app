import React from 'react';
import Link from 'next/link';

const V486V490Showcase = () => {
  const engines = [
    {
      version: 'V486',
      title: 'Email Tone Adapter',
      icon: '🎭',
      description: 'Intelligently adapts email tone based on recipient relationship and context',
      features: ['Relationship-based adjustment', 'Formality detection', 'Professional suggestions'],
      price: '$89/mo'
    },
    {
      version: 'V487',
      title: 'Follow-up Chain Optimizer',
      icon: '🔗',
      description: 'Creates intelligent follow-up sequences with optimal timing',
      features: ['Automated sequences', 'Optimal timing', 'Response tracking'],
      price: '$99/mo'
    },
    {
      version: 'V488',
      title: 'Context Memory System',
      icon: '🧠',
      description: 'Remembers previous conversations and provides intelligent context',
      features: ['History tracking', 'Context suggestions', 'Topic mapping'],
      price: '$109/mo'
    },
    {
      version: 'V489',
      title: 'Urgency Escalation Engine',
      icon: '🚨',
      description: 'Automatically detects and escalates urgent emails',
      features: ['Urgency detection', 'Auto-escalation', 'SLA tracking'],
      price: '$119/mo'
    },
    {
      version: 'V490',
      title: 'Response Time Predictor',
      icon: '⏱️',
      description: 'Predicts when recipients will respond based on patterns',
      features: ['Response predictions', 'Pattern analysis', 'Optimal timing'],
      price: '$79/mo'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Latest: V486-V490 Email Intelligence
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Five powerful new engines for tone adaptation, follow-up optimization, context memory, urgency escalation, and response prediction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="text-sm font-bold text-blue-300 mb-2">{engine.version}</div>
              <h3 className="text-xl font-bold text-white mb-3">{engine.title}</h3>
              <p className="text-blue-100 mb-4">{engine.description}</p>
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-blue-200 flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-2xl font-bold text-white">{engine.price}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 Why These Engines Matter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎭</div>
              <h4 className="text-lg font-bold text-white mb-2">Better Communication</h4>
              <p className="text-blue-200 text-sm">Adapt tone for stronger relationships</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h4 className="text-lg font-bold text-white mb-2">Save Time</h4>
              <p className="text-blue-200 text-sm">Automate follow-ups and predictions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚨</div>
              <h4 className="text-lg font-bold text-white mb-2">Never Miss Critical</h4>
              <p className="text-blue-200 text-sm">Auto-escalate urgent emails</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="text-lg font-bold text-white mb-2">40% More Responses</h4>
              <p className="text-blue-200 text-sm">Optimized follow-up sequences</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Get Started with V486-V490
          </Link>
          <p className="text-blue-200 mt-4">
            All engines enforce reply-all for multi-recipient emails
          </p>
        </div>
      </div>
    </section>
  );
};

export default V486V490Showcase;
