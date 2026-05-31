'use client';

import React from 'react';

const V596V600Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V596',
      name: 'Email Sentiment Responder',
      icon: '💝',
      description: 'Auto-generates empathetic responses based on sender sentiment with tone matching and emotional intelligence for conflict de-escalation.',
      features: ['Sentiment analysis', 'Tone matching', 'Empathy scoring', 'Conflict de-escalation', 'Relationship-building templates'],
      benefit: 'Build stronger relationships with emotionally intelligent responses that match the sender\'s tone and needs'
    },
    {
      version: 'V597',
      name: 'Email Meeting Extractor',
      icon: '📅',
      description: 'Automatically extracts meeting details from emails, checks attendee availability, and creates calendar events with smart scheduling.',
      features: ['Date/time extraction', 'Attendee detection', 'Availability checking', 'Agenda generation', 'Calendar integration'],
      benefit: 'Turn email conversations into scheduled meetings instantly without back-and-forth coordination'
    },
    {
      version: 'V598',
      name: 'Email Attachment Intelligence',
      icon: '📎',
      description: 'Smart attachment preview, summarization, virus scanning, and automatic file organization with cloud storage integration.',
      features: ['Smart preview', 'Content summarization', 'Virus scanning', 'Auto-categorization', 'Cloud sync', 'Sharing links'],
      benefit: 'Never miss important attachments again with intelligent previews and summaries before downloading'
    },
    {
      version: 'V599',
      name: 'Email Compliance Auditor',
      icon: '🛡️',
      description: 'Real-time compliance checking for GDPR, HIPAA, SOC2 with sensitive data detection, redaction, and audit trail generation.',
      features: ['GDPR compliance', 'HIPAA validation', 'SOC2 checks', 'Data redaction', 'Audit trails', 'Violation alerts'],
      benefit: 'Stay compliant with regulations automatically and avoid costly violations with real-time auditing'
    },
    {
      version: 'V600',
      name: 'Email Workflow Builder',
      icon: '🔄',
      description: 'Visual workflow designer for email automation with drag-and-drop rule creation, multi-step conditional logic, and 500+ app integrations.',
      features: ['Visual designer', 'Drag-and-drop', 'Conditional logic', 'Multi-step workflows', '500+ integrations', 'Template library'],
      benefit: 'Automate complex email workflows without coding and integrate with your entire tech stack'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Milestone Achievement: V596-V600
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough AI engines that bring emotional intelligence, automation, and compliance to your email communication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="inline-block px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-full mb-3">
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
                <p className="text-pink-300 text-sm font-semibold">
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
                <p className="text-gray-300 text-sm">Instant analysis and response generation</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h4 className="text-white font-semibold">Multi-Language Support</h4>
                <p className="text-gray-300 text-sm">40+ languages with automatic translation</p>
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

        <div className="text-center">
          <a
            href="/services"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore All Email Intelligence Engines →
          </a>
        </div>
      </div>
    </section>
  );
};

export default V596V600Showcase;
