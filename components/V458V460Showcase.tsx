'use client';

import React from 'react';

const V458V460Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V458',
      name: 'Email A/B Testing Platform',
      icon: '🧪',
      description: 'Test subject lines, content variations, and send times to optimize email performance. Auto-selects winners based on engagement metrics.',
      features: ['Multi-variant testing', 'Auto-winner selection', 'Performance analytics', '25-40% engagement boost'],
      benefit: 'Maximize email performance with data-driven optimization'
    },
    {
      version: 'V459',
      name: 'Meeting Minutes Generator',
      icon: '📝',
      description: 'Automatically generates structured meeting minutes from email discussions. Extracts decisions, action items, and deadlines.',
      features: ['Auto-generation', 'Decision extraction', 'Action tracking', 'Auto-distribution'],
      benefit: 'Save 2+ hours per meeting with automated minutes'
    },
    {
      version: 'V460',
      name: 'Email Backup & Recovery',
      icon: '💾',
      description: 'Automated email backup with intelligent recovery, version history, and AES-256 encryption. 99.99% uptime guarantee.',
      features: ['Real-time backup', 'Instant recovery', 'AES-256 encryption', 'Compliance-ready'],
      benefit: 'Never lose an important email with enterprise-grade protection'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Latest Email Intelligence: V458-V460
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three powerful AI engines for email optimization, meeting productivity, and data protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
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
            🎯 Why These Engines Matter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">📈</span>
              <div>
                <h4 className="text-white font-semibold text-lg">Boost Performance</h4>
                <p className="text-gray-300">A/B testing increases engagement by 25-40%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-3xl">⏱️</span>
              <div>
                <h4 className="text-white font-semibold text-lg">Save Time</h4>
                <p className="text-gray-300">Automated minutes save 2+ hours per meeting</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <h4 className="text-white font-semibold text-lg">Protect Data</h4>
                <p className="text-gray-300">99.99% uptime with enterprise-grade backup</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="text-white font-semibold text-lg">Reply-All Enforced</h4>
                <p className="text-gray-300">All engines ensure complete communication</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 inline-block">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Email Workflow?
            </h3>
            <p className="text-xl text-gray-200 mb-6">
              Join thousands of professionals using AI-powered email intelligence
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

export default V458V460Showcase;
