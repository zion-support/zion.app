'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V256',
    name: 'Workflow Automation',
    icon: '🔄',
    description: 'Detects repetitive email patterns and automates workflows. Triggers actions based on content, chains multiple actions, self-learning suggestions.',
    features: ['Pattern detection', 'Automated actions', 'Workflow chaining', 'Self-learning'],
    useCase: 'Automate ticket creation from support emails, schedule meetings from calendar requests, update CRM from sales inquiries'
  },
  {
    version: 'V257',
    name: 'Intent Classifier Pro',
    icon: '🎯',
    description: '50+ intent categories with ML classification, multi-intent detection, confidence scoring, and custom intent training per organization.',
    features: ['50+ intent categories', 'Multi-intent detection', 'Confidence scoring', 'Custom training'],
    useCase: 'Route emails to correct teams with 95% accuracy, detect complex multi-intent emails'
  },
  {
    version: 'V258',
    name: 'Data Loss Prevention',
    icon: '🔐',
    description: 'Scans for sensitive data (PII, financial, credentials), auto-redacts before sending, enforces GDPR/HIPAA/SOX/PCI-DSS compliance.',
    features: ['Sensitive data scanning', 'Auto-redaction', 'Compliance enforcement', 'Audit trail'],
    useCase: 'Prevent accidental data leaks, ensure regulatory compliance, protect customer information'
  },
  {
    version: 'V259',
    name: 'Analytics & Insights',
    icon: '📊',
    description: 'Track response rates, email volume trends, peak hours, team performance metrics, and predictive email analytics.',
    features: ['Response tracking', 'Volume analytics', 'Peak hour detection', 'Performance metrics'],
    useCase: 'Optimize team productivity, identify bottlenecks, forecast email volumes'
  },
  {
    version: 'V260',
    name: 'Multi-Stakeholder Coordinator',
    icon: '👥',
    description: 'Handles complex multi-party threads, tracks who said what, extracts per-person action items, detects consensus.',
    features: ['Thread tracking', 'Action item extraction', 'Consensus detection', 'Thread management'],
    useCase: 'Manage complex project discussions, track decisions across stakeholders, prevent thread chaos'
  }
];

export default function V256V260Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Email Intelligence V31: V256-V260
          </h2>
          <p className="text-xl text-gray-600">
            62 autonomous engines analyzing every email case-by-case with mandatory reply-all enforcement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engine Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Select Engine</h3>
              <div className="space-y-2">
                {engines.map((e, idx) => (
                  <button
                    key={e.version}
                    onClick={() => setActiveEngine(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeEngine === idx
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.icon}</span>
                      <div>
                        <div className="font-semibold">{e.version}</div>
                        <div className={`text-sm ${activeEngine === idx ? 'text-blue-100' : 'text-gray-600'}`}>
                          {e.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Engine Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{engine.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {engine.version}: {engine.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{engine.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {engine.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Real-World Use Case</h4>
                <p className="text-blue-800">{engine.useCase}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Reply-all enforced
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Case-by-case analysis
                  </span>
                </div>
                <a
                  href="/services"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  View all 1,243 services
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            All engines analyze emails individually and enforce reply-all when responding to multiple recipients
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
