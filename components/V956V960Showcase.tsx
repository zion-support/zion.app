'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V956',
    name: 'Email Collaboration Workspace',
    icon: '🤝',
    color: 'from-blue-600 to-blue-800',
    description: 'Team-based email handling with shared annotations, intelligent assignment routing, approval workflows, and strict reply-all enforcement.',
    features: [
      'Smart Assignment Routing — Auto-route emails to the right team member based on content analysis',
      'Shared Annotations — Color-coded flags, action items, and executive visibility markers',
      'Approval Workflows — Multi-step approval chains with auto-escalation and SLA enforcement',
      'SLA Tracking — Dynamic deadline calculation based on priority, seniority, and urgency',
      'Reply-All Enforcement — Automatically includes all recipients in responses to multi-recipient emails',
      'Thread Management — Deep thread tracking with participant and context awareness',
    ],
    metrics: { responseTime: '-60%', teamAlignment: '99%', slaCompliance: '99.5%' },
    useCases: ['Enterprise teams', 'Cross-department coordination', 'Approval chains', 'Client service teams'],
  },
  {
    version: 'V957',
    name: 'Knowledge Graph Builder',
    icon: '🕸️',
    color: 'from-purple-600 to-purple-800',
    description: 'Builds a dynamic knowledge graph from email conversations — tracking entities, relationships, topics, and context for intelligent case-by-case analysis.',
    features: [
      'Entity Extraction — Automatically identifies people, organizations, products, and monetary amounts',
      'Relationship Mapping — Builds connections between entities found across email threads',
      'Topic Intelligence — Detects 8+ topic categories including pricing, technical, security, and partnerships',
      'Thread Context Enrichment — Accumulates knowledge across email threads for smarter responses',
      'Graph Query Insights — Natural language queries to find client history, deal progress, and communication gaps',
      'Cross-Thread Discovery — Uncover hidden connections across separate conversations',
    ],
    metrics: { entitiesTracked: '∞', relationships: 'Auto', topicCategories: '8+' },
    useCases: ['Sales intelligence', 'Client relationship management', 'Deal tracking', 'Communication analytics'],
  },
  {
    version: 'V958',
    name: 'Accessibility Optimizer',
    icon: '♿',
    color: 'from-green-600 to-green-800',
    description: 'Comprehensive email accessibility analysis ensuring WCAG compliance, readability scoring, inclusive language checking, and screen-reader compatibility.',
    features: [
      'Readability Analysis — Flesch-Kincaid scoring with grade level and reading time estimates',
      'Inclusive Language Checker — Detects and suggests alternatives for 11+ non-inclusive terms',
      'Structure Analysis — Validates greetings, paragraph length, ALL CAPS usage, and image alt-text',
      'Link Accessibility — Identifies bare URLs and suggests descriptive link text',
      'Attachment Compliance — Ensures documents and images meet accessibility standards',
      'Accessible Template Generator — Creates WCAG-compliant email templates automatically',
    ],
    metrics: { accessibilityScore: '0-100', wcagCriteria: '5', inclusiveTerms: '11+' },
    useCases: ['ADA compliance', 'Inclusive workplaces', 'Government communications', 'Education'],
  },
  {
    version: 'V959',
    name: 'Multilingual Translator',
    icon: '🌍',
    color: 'from-orange-600 to-orange-800',
    description: 'Detects email language from 40+ languages, adapts responses to recipient\'s preferred language, and handles multilingual threads with cultural sensitivity.',
    features: [
      '40+ Language Detection — High-accuracy detection including CJK, Arabic, Hindi, and Cyrillic scripts',
      'Cultural Adaptation — Adjusts formality levels, greetings, and sign-offs per culture',
      'Multilingual Thread Tracking — Detects language switches and maintains consistency',
      'Contact Language Profiles — Learns and remembers each contact\'s preferred language',
      'Mixed-Language Detection — Identifies emails containing multiple languages',
      'Bulk Translation — Translate entire campaigns and threads for global teams',
    ],
    metrics: { languages: '40+', accuracy: '99%+', culturalProfiles: 'Auto' },
    useCases: ['Global enterprises', 'Multinational teams', 'International sales', 'Customer support'],
  },
  {
    version: 'V960',
    name: 'Compliance Reporter',
    icon: '⚖️',
    color: 'from-red-600 to-red-800',
    description: 'Enterprise compliance analysis for GDPR, HIPAA, SOX, PCI-DSS, and CCPA. Detects PII, classifies data sensitivity, and generates formal compliance reports.',
    features: [
      '5 Regulation Support — GDPR, HIPAA, SOX, PCI-DSS, and CCPA compliance checking',
      'PII Detection — Identifies emails, phones, SSNs, credit cards, IPs, and dates of birth',
      'Data Classification — Auto-classifies as CONFIDENTIAL, RESTRICTED, or INTERNAL',
      'Cross-Border Transfer Assessment — Detects EU-US data transfers and SCCS requirements',
      'Retention Policy — Calculates retention periods based on data classification',
      'Compliance Reports — Formal reports with violation summaries and remediation steps',
    ],
    metrics: { regulations: '5', piiTypes: '6+', complianceGrade: 'A+ to F' },
    useCases: ['Healthcare (HIPAA)', 'EU businesses (GDPR)', 'Finance (SOX)', 'E-commerce (PCI-DSS)'],
  },
];

export default function V956V960Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
            🚀 V956-V960 • Latest Email Intelligence Engines
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Next-Gen Email Intelligence Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            5 breakthrough engines that transform how teams collaborate, communicate, and comply — 
            with <span className="text-blue-400 font-semibold">strict reply-all enforcement</span> and 
            <span className="text-purple-400 font-semibold"> case-by-case intelligent analysis</span>.
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

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {engine.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-4">
                  <span className="text-green-400 mt-1 text-lg">✓</span>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Metrics */}
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

            {/* Use Cases */}
            <div className="flex flex-wrap gap-2">
              {engine.useCases.map((useCase, i) => (
                <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reply-All Enforcement Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📬</span>
            <div>
              <h4 className="text-lg font-bold text-amber-400">Strict Reply-All Enforcement</h4>
              <p className="text-gray-400 text-sm mt-1">
                All V956-V960 engines automatically detect multi-recipient emails and enforce reply-all to ensure 
                every recipient is included in responses. This prevents communication gaps, maintains thread integrity, 
                and ensures all stakeholders stay informed. Configurable per-engine with audit logging.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/20">
          <h4 className="text-2xl font-bold text-white mb-2">Ready to Transform Your Email Intelligence?</h4>
          <p className="text-gray-400 mb-6">Get V956-V960 deployed for your organization today.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
            <span>📍 364 E Main St STE 1008, Middletown, DE 19709</span>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
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
