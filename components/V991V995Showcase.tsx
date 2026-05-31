'use client';

import React, { useState } from 'react';

const engines = [
  {
    version: 'V991',
    name: 'Email DNA Fingerprinting',
    icon: '🧬',
    color: 'from-purple-500 to-indigo-500',
    description: 'Generates unique content fingerprints to detect duplicates, forgeries, and track email lineage with cryptographic precision.',
    features: [
      'SHA-256 content hashing',
      'Duplicate detection (exact & fuzzy)',
      'Forgery risk analysis',
      'Thread lineage tracking',
      'Uniqueness scoring',
      'DNA signature generation',
    ],
    services: 6,
    category: 'Email Security',
  },
  {
    version: 'V992',
    name: 'Email Flow Optimizer',
    icon: '🌊',
    color: 'from-blue-500 to-cyan-500',
    description: 'Analyzes email flow patterns and suggests optimal send times, batch processing, and congestion avoidance strategies.',
    features: [
      'Flow velocity tracking',
      'Batch processing suggestions',
      'Optimal send time prediction',
      'Congestion detection',
      'Flow efficiency scoring',
      'Pattern-based recommendations',
    ],
    services: 6,
    category: 'Email Optimization',
  },
  {
    version: 'V993',
    name: 'Email Coaching AI',
    icon: '🎓',
    color: 'from-green-500 to-emerald-500',
    description: 'Provides real-time coaching on email writing quality with tone, clarity, persuasion, and professionalism scoring.',
    features: [
      'Tone analysis & consistency',
      'Clarity scoring & suggestions',
      'Persuasion technique detection',
      'Professionalism checks',
      'Grammar & style review',
      'Writing score & recommendations',
    ],
    services: 6,
    category: 'Email Intelligence',
  },
  {
    version: 'V994',
    name: 'Email Predictive Router',
    icon: '🎯',
    color: 'from-orange-500 to-red-500',
    description: 'Predicts the optimal team member to handle each email based on expertise, workload, and priority matching.',
    features: [
      'Expertise requirement extraction',
      'Team member matching',
      'Workload balancing',
      'Priority-based routing',
      'Confidence scoring',
      'Alternative suggestions',
    ],
    services: 6,
    category: 'Email Routing',
  },
  {
    version: 'V995',
    name: 'Email Workflow Builder',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-500',
    description: 'Automatically detects workflow patterns and suggests automation opportunities for multi-step email processes.',
    features: [
      'Workflow pattern detection',
      'Trigger extraction',
      'Step identification',
      'Condition & branch detection',
      'Automation opportunity analysis',
      'Time savings estimation',
    ],
    services: 6,
    category: 'Email Automation',
  },
];

export default function V991V995Showcase() {
  const [selectedEngine, setSelectedEngine] = useState(0);

  const engine = engines[selectedEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-semibold mb-4">
            🚀 V991-V995 • Latest Innovation
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Advanced Email Intelligence Suite
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Five breakthrough engines that transform email management with DNA fingerprinting, 
            flow optimization, AI coaching, predictive routing, and workflow automation.
          </p>
        </div>

        {/* Engine Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {engines.map((eng, idx) => (
            <button
              key={eng.version}
              onClick={() => setSelectedEngine(idx)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedEngine === idx
                  ? `bg-gradient-to-r ${eng.color} text-white shadow-2xl scale-105`
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <span className="mr-2">{eng.icon}</span>
              {eng.version}
            </button>
          ))}
        </div>

        {/* Selected Engine Details */}
        <div className={`bg-gradient-to-br ${engine.color} p-1 rounded-3xl shadow-2xl mb-12`}>
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12">
            <div className="flex items-start gap-6 mb-8">
              <div className="text-6xl">{engine.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-slate-400">{engine.version}</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">
                    {engine.category}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{engine.name}</h3>
                <p className="text-slate-300 text-lg">{engine.description}</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {engine.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{engine.services}</div>
                <div className="text-sm text-slate-400">Services</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{engine.features.length}</div>
                <div className="text-sm text-slate-400">Features</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-slate-400">Reply-All</div>
              </div>
            </div>
          </div>
        </div>

        {/* All Engines Overview */}
        <div className="bg-slate-800/30 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Complete Suite Overview</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {engines.map((eng, idx) => (
              <div
                key={eng.version}
                onClick={() => setSelectedEngine(idx)}
                className={`cursor-pointer bg-slate-700/30 rounded-xl p-4 text-center transition-all duration-300 ${
                  selectedEngine === idx
                    ? 'bg-slate-700/60 scale-105 shadow-xl'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="text-4xl mb-2">{eng.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{eng.version}</div>
                <div className="text-xs text-slate-400">{eng.services} services</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="text-xl font-bold text-white mb-3">Enhanced Security</h4>
            <p className="text-slate-300">
              DNA fingerprinting detects duplicates, forgeries, and tracks email lineage with cryptographic precision.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-xl font-bold text-white mb-3">Optimized Performance</h4>
            <p className="text-slate-300">
              Flow optimization and predictive routing ensure emails reach the right person at the right time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold text-white mb-3">AI-Powered Intelligence</h4>
            <p className="text-slate-300">
              Coaching AI and workflow automation transform how teams communicate and collaborate.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Email Workflow?
            </h3>
            <p className="text-purple-100 mb-8 max-w-2xl">
              Deploy V991-V995 to unlock advanced email intelligence, security, and automation capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-xl">
                Get Started Today
              </button>
              <button className="px-8 py-4 bg-purple-600/30 text-white rounded-xl font-bold hover:bg-purple-600/50 transition-colors border-2 border-white/30">
                View All Services
              </button>
            </div>
            <div className="text-sm text-purple-200 space-y-1">
              <div>📞 +1 302 464 0950</div>
              <div>✉️ kleber@ziontechgroup.com</div>
              <div>📍 364 E Main St STE 1008, Middletown, DE 19709</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
