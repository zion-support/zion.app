'use client';

import React from 'react';

const V611V615Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V611',
      name: 'Email Sentiment Responder',
      icon: '💝',
      description: 'Auto-generate empathetic responses based on sender emotion and tone with context-aware templates.',
      features: ['Sentiment detection', 'Emotion analysis', 'Empathetic responses', 'Tone adjustments', 'Follow-up suggestions'],
      benefit: 'Build stronger relationships with emotionally intelligent responses'
    },
    {
      version: 'V612',
      name: 'Email Meeting Minutes Generator',
      icon: '📋',
      description: 'Automatically create structured meeting notes from email discussions with decisions, action items, and timelines.',
      features: ['Decision extraction', 'Action item tracking', 'Participant analysis', 'Timeline building', 'Next steps generation'],
      benefit: 'Never lose track of meeting outcomes with automatic documentation'
    },
    {
      version: 'V613',
      name: 'Email Attachment Intelligence',
      icon: '📎',
      description: 'Smart preview, summarization, and organization of email attachments with security scanning and auto-categorization.',
      features: ['File categorization', 'Security scanning', 'Auto-organization', 'Preview generation', 'Cloud sync'],
      benefit: 'Manage attachments efficiently with intelligent organization and security'
    },
    {
      version: 'V614',
      name: 'Email SLA Enforcement Engine',
      icon: '⏱️',
      description: 'Track response times and enforce service level agreements with automatic escalation and compliance reporting.',
      features: ['SLA tracking', 'Priority detection', 'Auto-escalation', 'Compliance scoring', 'Response time analytics'],
      benefit: 'Meet every SLA commitment with proactive monitoring and escalation'
    },
    {
      version: 'V615',
      name: 'Email Tone Analyzer & Adapter',
      icon: '🎭',
      description: 'Analyze email tone across formality, directness, warmth, and confidence with relationship-aware adaptation.',
      features: ['Tone profiling', 'Relationship detection', 'Tone matching', 'Mismatch alerts', 'Response adaptation'],
      benefit: 'Communicate with the perfect tone for every relationship and context'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Email Intelligence V611-V615
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough engines for sentiment response, meeting minutes, attachment intelligence, SLA enforcement, and tone adaptation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="inline-block px-3 py-1 bg-rose-500 text-white text-sm font-bold rounded-full mb-3">
                {engine.version}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 mb-4 text-sm">{engine.description}</p>
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, fidx) => (
                  <li key={fidx} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-white/20">
                <p className="text-rose-300 text-sm font-semibold">
                  💡 {engine.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 Key Features Across All Engines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📨</span>
              <div>
                <h4 className="text-white font-semibold">Reply-All Enforcement</h4>
                <p className="text-gray-300 text-sm">Always replies to all recipients in multi-person threads</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <h4 className="text-white font-semibold">AI-Powered Intelligence</h4>
                <p className="text-gray-300 text-sm">Advanced NLP and machine learning for smarter responses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="text-white font-semibold">Enterprise Security</h4>
                <p className="text-gray-300 text-sm">End-to-end encryption and compliance monitoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-white font-semibold">Real-Time Processing</h4>
                <p className="text-gray-300 text-sm">Instant analysis and actionable recommendations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h4 className="text-white font-semibold">Multi-Language Support</h4>
                <p className="text-gray-300 text-sm">40+ languages with automatic detection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="text-white font-semibold">Analytics & Insights</h4>
                <p className="text-gray-300 text-sm">Detailed metrics and performance tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl p-6 border border-rose-400/30 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📞 Contact Us for a Free Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-rose-300 font-semibold">📱 Mobile</p>
              <p className="text-white">+1 302 464 0950</p>
            </div>
            <div>
              <p className="text-rose-300 font-semibold">✉️ Email</p>
              <p className="text-white">kleber@ziontechgroup.com</p>
            </div>
            <div>
              <p className="text-rose-300 font-semibold">📍 Address</p>
              <p className="text-white">364 E Main St STE 1008, Middletown, DE 19709</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/services"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore All Email Intelligence Engines →
          </a>
        </div>
      </div>
    </section>
  );
};

export default V611V615Showcase;
