'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V981',
    name: 'Context Memory',
    icon: '🧠',
    color: 'from-indigo-600 to-indigo-800',
    description: 'Remembers past interactions with each contact for personalized responses. Enables contextual awareness and relationship building across email conversations.',
    features: [
      'Contact Memory Database — Persistent storage of interaction history, preferences, and key facts',
      'Thread Context Retrieval — Complete conversation context including participants and duration',
      'Topic Continuity Analysis — Tracks overlapping topics and identifies new discussion areas',
      'Relationship Stage Assessment — Classifies contacts from NEW_CONTACT to LONG_TERM based on interaction frequency',
      'Personalization Opportunities — Identifies topic references, preference matching, and fact recall opportunities',
      'Context Gap Detection — Identifies missing preferences and key facts for proactive information gathering',
    ],
    metrics: { memoryTypes: '6+', stages: '5', personalization: 'Auto' },
    useCases: ['Relationship building', 'Personalized support', 'Sales follow-ups', 'Account management'],
  },
  {
    version: 'V982',
    name: 'Meeting Minutes Generator',
    icon: '📋',
    color: 'from-emerald-600 to-emerald-800',
    description: 'Auto-extracts action items, decisions, and attendees from meeting emails. Enables zero manual note-taking for meeting follow-ups.',
    features: [
      'Meeting Content Detection — Identifies meeting emails with confidence scoring from keywords and patterns',
      'Attendee Extraction — Extracts all participants with role classification (organizer, required, optional)',
      'Action Item Extraction — Detects action items with assignee identification and priority assessment',
      'Decision Tracking — Captures decisions with context preservation and confidence scoring',
      'Discussion Points — Extracts key discussion topics from bullet points and numbered lists',
      'Follow-Up Extraction — Identifies follow-up items and next meeting scheduling',
    ],
    metrics: { extractionTypes: '6', qualityScore: '0-100', automation: '100%' },
    useCases: ['Meeting follow-ups', 'Project management', 'Team coordination', 'Decision tracking'],
  },
  {
    version: 'V983',
    name: 'CRM Sync Engine',
    icon: '🔗',
    color: 'from-cyan-600 to-cyan-800',
    description: 'Bi-directional sync between email data and CRM records. Enables always-current CRM data from email intelligence.',
    features: [
      'Contact Information Extraction — Extracts name, email, phone from email headers and signatures',
      'Company Information Extraction — Identifies company from domain and email body mentions',
      'Deal Signal Detection — Detects monetary values, deal stages, and timelines from email content',
      'Activity Data Extraction — Classifies activity type and captures metadata for CRM logging',
      'Sync Operations Generation — Creates CREATE, UPDATE, and LOG operations for CRM',
      'Conflict Detection — Identifies data conflicts and provides resolution strategies',
    ],
    metrics: { syncOps: '4 types', signals: '3+', conflicts: 'Auto-detect' },
    useCases: ['CRM automation', 'Sales pipeline', 'Contact management', 'Activity tracking'],
  },
  {
    version: 'V984',
    name: 'Legal Compliance',
    icon: '⚖️',
    color: 'from-red-600 to-red-800',
    description: 'GDPR, CAN-SPAM, CCPA compliance checking for outbound emails. Enables regulatory compliance and risk mitigation.',
    features: [
      'GDPR Compliance — Checks legal basis for data processing and data subject rights information',
      'CAN-SPAM Compliance — Verifies physical address, unsubscribe mechanism, and subject accuracy',
      'CCPA Compliance — Checks for Do Not Sell links and privacy policy references',
      'Data Protection — Scans for sensitive data (SSN, credit cards, passwords) in email body',
      'Consent Verification — Verifies consent for email communication and transactional classification',
      'Unsubscribe Mechanism — Validates unsubscribe links and instructions are present',
    ],
    metrics: { regulations: '3', checks: '6+', violations: 'Auto-detect' },
    useCases: ['Marketing compliance', 'Legal protection', 'Risk mitigation', 'Regulatory adherence'],
  },
  {
    version: 'V985',
    name: 'Campaign Optimizer',
    icon: '🎪',
    color: 'from-purple-600 to-purple-800',
    description: 'Analyzes campaign emails for engagement, timing, and conversion signals. Enables higher campaign ROI through data-driven optimization.',
    features: [
      'Subject Line Analysis — Optimizes length (30-50 chars), personalization, urgency, and spam avoidance',
      'Content Engagement Analysis — Evaluates storytelling, social proof, emotional triggers, and optimal length',
      'CTA Analysis — Detects CTAs by type (purchase, signup, download) with placement and effectiveness scoring',
      'Timing Optimization — Analyzes send time for optimal day (Tue-Thu) and time (9-11 AM, 1-3 PM)',
      'Personalization Analysis — Checks for name tokens, dynamic content, segmentation, and behavioral triggers',
      'A/B Test Recommendations — Generates test recommendations for subject, CTA, and content elements',
    ],
    metrics: { analysisTypes: '6', scoreRange: '0-100', abTests: 'Auto' },
    useCases: ['Email marketing', 'Campaign optimization', 'A/B testing', 'ROI improvement'],
  },
];

export default function V981V985Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-indigo-950/10 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-4">
            🚀 V981-V985 • Memory • Meetings • CRM • Compliance • Campaigns
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Intelligent Email Operations Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            5 advanced engines that transform email operations — with
            <span className="text-indigo-400 font-semibold"> contextual memory</span>,
            <span className="text-emerald-400 font-semibold"> meeting automation</span>, and
            <span className="text-purple-400 font-semibold"> campaign optimization</span>.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {engines.map((e, i) => (
            <button
              key={e.version}
              onClick={() => setActiveEngine(i)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeEngine === i
                  ? `bg-gradient-to-r ${e.color} text-white shadow-lg scale-105`
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="mr-2">{e.icon}</span>
              {e.version}: {e.name}
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className={`bg-gradient-to-br ${engine.color} rounded-2xl p-1 mb-10`}>
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{engine.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-white">{engine.version}: {engine.name}</h3>
                <p className="text-gray-400 mt-1">{engine.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {engine.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-4">
                  <span className="text-green-400 mt-1 text-lg">✓</span>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {Object.entries(engine.metrics).map(([key, value]) => (
                <div key={key} className="text-center bg-gray-800/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {engine.useCases.map((useCase, i) => (
                <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reply-All Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📬</span>
            <div>
              <h4 className="text-lg font-bold text-amber-400">Strict Reply-All Enforcement</h4>
              <p className="text-gray-400 text-sm mt-1">
                All V981-V985 engines enforce reply-all for multi-recipient emails.
                Every stakeholder stays informed with zero communication gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
          <h4 className="text-2xl font-bold text-white mb-2">Transform Your Email Operations</h4>
          <p className="text-gray-400 mb-6">Deploy V981-V985 for advanced memory, automation, and optimization.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
            <span>📍 364 E Main St STE 1008, Middletown, DE 19709</span>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/contact" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
              Get Started
            </a>
            <a href="/services" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
              View All Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
