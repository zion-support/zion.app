'use client';

import React from 'react';

const V454V457Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V454',
      name: 'Time Zone Optimizer',
      icon: '🌍',
      description: 'Intelligently schedules email sends for optimal recipient time zones across the globe.',
      features: ['Time zone detection', 'Work hours validation', 'Optimal send scheduling', 'Global team support'],
      benefit: 'Never send emails at 3 AM to international clients again'
    },
    {
      version: 'V455',
      name: 'Attachment Intelligence',
      icon: '🔒',
      description: 'Scans attachments for sensitive data, validates file types, and prevents data leaks.',
      features: ['Sensitive data detection', 'File validation', 'Compliance checking', 'Security warnings'],
      benefit: 'Protect sensitive data and ensure compliance before sending'
    },
    {
      version: 'V456',
      name: 'Workflow Automation',
      icon: '⚙️',
      description: 'Automates email-driven workflows with intelligent rules and actions.',
      features: ['Auto-ticketing', 'Lead creation', 'Calendar sync', 'Escalation alerts'],
      benefit: 'Save 15+ hours per week on manual email tasks'
    },
    {
      version: 'V457',
      name: 'Sentiment Prediction',
      icon: '🔮',
      description: 'Predicts recipient reactions before sending and suggests tone adjustments.',
      features: ['Sentiment analysis', 'Reaction prediction', 'Tone suggestions', 'Emotion detection'],
      benefit: 'Maximize positive responses and minimize conflicts'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Latest Email Intelligence: V454-V457
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four breakthrough AI engines that make your email communication smarter, safer, and more efficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="inline-block px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full mb-3">
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
                <p className="text-purple-300 text-sm font-semibold">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📨</span>
              <div>
                <h4 className="text-white font-semibold">Reply-All Enforcement</h4>
                <p className="text-gray-300 text-sm">Always replies to all recipients</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <h4 className="text-white font-semibold">Case-by-Case Analysis</h4>
                <p className="text-gray-300 text-sm">Each email analyzed individually</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-white font-semibold">Real-Time Processing</h4>
                <p className="text-gray-300 text-sm">Instant analysis and insights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 inline-block">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Email?
            </h3>
            <p className="text-xl text-gray-200 mb-6">
              Join thousands using AI-powered email intelligence
            </p>
            <div className="space-y-2 text-left text-gray-200">
              <p>📞 <strong>Call:</strong> +1 302 464 0950</p>
              <p>✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p>📍 <strong>Visit:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V454V457Showcase;
