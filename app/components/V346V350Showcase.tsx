'use client';

import { useState } from 'react';

export default function V346V350Showcase() {
  const [activeTab, setActiveTab] = useState('intent');

  const engines = {
    intent: {
      name: 'V346: Intent Classifier Pro',
      icon: '🎯',
      description: 'Classify email intent and auto-route to appropriate teams',
      features: [
        '8 intent categories (request, complaint, inquiry, feedback, escalation, negotiation, spam, appreciation)',
        'ML-powered classification with 95%+ accuracy',
        'Response time prediction based on complexity',
        'Auto-routing to Support, Sales, Management, etc.',
        'Confidence scoring for each classification',
      ],
      benefits: [
        'Route emails 10x faster than manual sorting',
        'Reduce misrouting by 95%',
        'Improve SLA compliance',
        'Lower support team workload',
      ],
    },
    summarizer: {
      name: 'V347: Thread Summarizer Pro',
      icon: '📝',
      description: 'Generate executive summaries from long email threads',
      features: [
        'Extract key points from lengthy conversations',
        'Identify action items automatically',
        'Track decisions made in thread',
        'Detect deadlines and due dates',
        'Map all participants and their roles',
      ],
      benefits: [
        'Save 2+ hours daily on email reading',
        'Never miss critical action items',
        'Quick context for new team members',
        'Executive-ready briefings in seconds',
      ],
    },
    translation: {
      name: 'V348: Translation & Localization',
      icon: '🌍',
      description: 'Real-time translation for 100+ languages with cultural context',
      features: [
        'Detect source language automatically',
        'Preserve tone and formality levels',
        'Adapt to cultural business etiquette',
        'Support 100+ languages including CJK',
        'Suggest appropriate greetings and closings',
      ],
      benefits: [
        'Global communication without barriers',
        'Maintain professional tone across cultures',
        'Reduce translation costs by 80%',
        'Faster international deal closure',
      ],
    },
    attachment: {
      name: 'V349: Attachment Intelligence',
      icon: '🔒',
      description: 'Scan attachments for security threats and sensitive data',
      features: [
        'Malware detection and quarantine',
        'PII/PCI data scanning (SSN, credit cards, etc.)',
        'Document content extraction and summarization',
        'DLP policy enforcement',
        'Risk level assessment (low/medium/high/critical)',
      ],
      benefits: [
        'Block 99.9% of malicious attachments',
        'Prevent data breaches before they happen',
        'GDPR/PCI/HIPAA compliance',
        'Safe document handling workflow',
      ],
    },
    followup: {
      name: 'V350: Follow-up Automator',
      icon: '⏰',
      description: 'Detect follow-up needs and schedule automatic reminders',
      features: [
        'Auto-detect emails requiring follow-up',
        'Smart reminder scheduling based on urgency',
        'Generate follow-up drafts with context',
        'Track response SLAs',
        'Extract action items and deadlines',
      ],
      benefits: [
        'Never miss a follow-up again',
        'Improve response rates by 40%',
        'Maintain professional relationships',
        'Reduce manual tracking overhead',
      ],
    },
  };

  const currentEngine = engines[activeTab as keyof typeof engines];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Email Intelligence V346-V350
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five breakthrough email intelligence engines with advanced intent classification,
            thread summarization, translation, security scanning, and follow-up automation.
            All engines enforce <strong>reply-all</strong> for multi-recipient emails.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(engines).map(([key, engine]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{engine.icon}</span>
              {engine.name.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active Engine Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
          <div className="flex items-start mb-6">
            <span className="text-5xl mr-4">{currentEngine.icon}</span>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {currentEngine.name}
              </h3>
              <p className="text-lg text-gray-600">{currentEngine.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-indigo-600 mb-4">
                ✨ Key Features
              </h4>
              <ul className="space-y-3">
                {currentEngine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-purple-600 mb-4">
                💼 Business Benefits
              </h4>
              <ul className="space-y-3">
                {currentEngine.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">★</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              🔒 Reply-All Enforcement
            </h4>
            <p className="text-gray-700">
              All V346-V350 engines automatically detect multi-recipient emails and enforce
              reply-all to ensure all stakeholders stay informed. This critical feature prevents
              communication gaps and maintains transparency across teams.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-indigo-600 mb-2">5</div>
            <div className="text-gray-600">New AI Engines</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">26</div>
            <div className="text-gray-600">New Services Added</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-pink-600 mb-2">1,714</div>
            <div className="text-gray-600">Total Services</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Reply-All Enforced</div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Supercharge Your Email Intelligence?
            </h3>
            <p className="text-lg mb-6">
              Contact Zion Tech Group today for a personalized demo
            </p>
            <div className="space-y-2 text-left">
              <p>📱 <strong>Mobile:</strong> +1 302 464 0950</p>
              <p>✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p>📍 <strong>Address:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
