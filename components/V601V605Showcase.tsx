'use client';

import React from 'react';

const V601V605Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V601',
      name: 'Email Priority Decay Engine',
      icon: '⏰',
      description: 'Automatically adjusts email priority based on age, context, and engagement. Prevents important emails from being forgotten with smart escalation.',
      features: ['Priority decay scoring', 'Escalation triggers', 'Age-based adjustment', 'Smart recommendations', 'Pattern learning'],
      benefit: 'Never miss an important email again with intelligent priority management'
    },
    {
      version: 'V602',
      name: 'Email Thread Summarizer Pro',
      icon: '📋',
      description: 'AI-powered thread summarization with key points extraction, decision tracking, and action item identification.',
      features: ['Key points extraction', 'Decision tracking', 'Action items', 'Participant analysis', 'Timeline reconstruction'],
      benefit: 'Catch up on long email threads in seconds with intelligent summaries'
    },
    {
      version: 'V603',
      name: 'Email A/B Testing Platform',
      icon: '🧪',
      description: 'Test different email signatures, subject lines, and content for engagement with statistical significance analysis.',
      features: ['Multi-variant testing', 'Statistical significance', 'Winner auto-selection', 'CTR tracking', 'Conversion analysis'],
      benefit: 'Optimize every aspect of your emails with data-driven A/B testing'
    },
    {
      version: 'V604',
      name: 'Email Archival Intelligence',
      icon: '🗄️',
      description: 'Smart email archival with semantic search, auto-categorization, deduplication, and compliance-ready retention.',
      features: ['Semantic search', 'Auto-categorization', 'Deduplication', 'Smart tagging', 'Storage optimization'],
      benefit: 'Find any email instantly with AI-powered archival and search'
    },
    {
      version: 'V605',
      name: 'Email Deliverability Optimizer',
      icon: '📬',
      description: 'Comprehensive spam score analysis, authentication checks, and deliverability improvement recommendations.',
      features: ['Spam score analysis', 'SPF/DKIM/DMARC checks', 'Content quality scoring', 'Inbox placement estimation', 'Improvement tips'],
      benefit: 'Ensure your emails reach the inbox with deliverability optimization'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Email Intelligence V601-V605
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough engines for smarter email management: priority decay, thread summarization, A/B testing, archival intelligence, and deliverability optimization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="inline-block px-3 py-1 bg-teal-500 text-white text-sm font-bold rounded-full mb-3">
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
                <p className="text-teal-300 text-sm font-semibold">
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
                <h4 className="text-white font-semibold">AI-Powered Analysis</h4>
                <p className="text-gray-300 text-sm">Advanced NLP and machine learning for smarter processing</p>
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
                <p className="text-gray-300 text-sm">Instant analysis and optimization</p>
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

        <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl p-6 border border-teal-400/30 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📞 Contact Us for a Free Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-teal-300 font-semibold">📱 Mobile</p>
              <p className="text-white">+1 302 464 0950</p>
            </div>
            <div>
              <p className="text-teal-300 font-semibold">✉️ Email</p>
              <p className="text-white">kleber@ziontechgroup.com</p>
            </div>
            <div>
              <p className="text-teal-300 font-semibold">📍 Address</p>
              <p className="text-white">364 E Main St STE 1008, Middletown, DE 19709</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/services"
            className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-full hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore All Email Intelligence Engines →
          </a>
        </div>
      </div>
    </section>
  );
};

export default V601V605Showcase;
