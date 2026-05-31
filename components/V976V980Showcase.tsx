'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V976',
    name: 'Thread Visualizer',
    icon: '📧',
    color: 'from-blue-600 to-blue-800',
    description: 'Creates interactive thread graphs showing participants, topics, decision flow, and conversation progression for complex email discussions.',
    features: [
      'Participant Mapping — Extracts all participants with role identification',
      'Conversation Nodes — Questions, decisions, and action items extraction',
      'Edge Relationships — Communication flow between participants',
      'Topic Flow Analysis — Tracks technical, business, planning, and support topics',
      'Decision Point Tracking — Identifies agreements, approvals, and confirmations',
      'Thread Complexity Metrics — 0-100 scoring based on participants, depth, and content',
    ],
    metrics: { nodes: 'Dynamic', edges: 'Auto', complexity: '0-100' },
    useCases: ['Complex discussions', 'Decision tracking', 'Project coordination', 'Team communication'],
  },
  {
    version: 'V977',
    name: 'Auto-Responder',
    icon: '🤖',
    color: 'from-green-600 to-green-800',
    description: 'Context-aware auto-replies for OOO, after-hours, and common queries with intelligent response generation.',
    features: [
      'Scenario Detection — OOO, common questions, spam, and general acknowledgment',
      'Template Generation — Pre-built templates for each scenario type',
      'Personalization — Sender name extraction and contextual customization',
      'Quality Checking — Response scoring on word count, personalization, and completeness',
      'Timing Optimization — Delayed sending to avoid appearing robotic',
      'Confidence Scoring — High-confidence scenarios get auto-sent, low-confidence routed to human',
    ],
    metrics: { scenarios: '5+', quality: '0-100', confidence: '0-1' },
    useCases: ['24/7 support', 'OOO handling', 'FAQ responses', 'After-hours coverage'],
  },
  {
    version: 'V978',
    name: 'Email Analytics Dashboard',
    icon: '📊',
    color: 'from-purple-600 to-purple-800',
    description: 'Team-wide email metrics: volume, response times, sentiment trends, engagement, and performance analytics.',
    features: [
      'Volume Metrics — Hour-of-day, day-of-week, and business hours tracking',
      'Response Time Tracking — SLA compliance and performance benchmarking',
      'Sentiment Analysis — Positive/negative/neutral polarity with scoring',
      'Engagement Metrics — Word count, questions, attachments, and thread depth',
      'Category Distribution — Auto-categorization: sales, support, partnership, marketing, internal',
      'Team Performance — Individual and team-wide metrics with trend analysis',
    ],
    metrics: { kpis: '6+', trends: 'Real-time', team: 'Multi-member' },
    useCases: ['Performance optimization', 'SLA compliance', 'Team management', 'Customer satisfaction'],
  },
  {
    version: 'V979',
    name: 'Data Loss Prevention',
    icon: '🔒',
    color: 'from-red-600 to-red-800',
    description: 'Detects sensitive data (SSN, credit cards, credentials, PII) before sending to prevent data breaches.',
    features: [
      'Pattern Detection — SSN, credit cards, passwords, API keys, emails, phones, IPs, DOB',
      'Context Analysis — Confidential and sensitive marker detection',
      'Risk Assessment — 0-100 scoring with CRITICAL/HIGH/MEDIUM/LOW/NONE levels',
      'Recipient Validation — External recipient risk assessment',
      'Attachment Scanning — Sensitive filename and content detection',
      'Compliance Checking — Policy violation detection and reporting',
    ],
    metrics: { patterns: '8+', severity: '5 levels', compliance: 'Auto' },
    useCases: ['Data protection', 'Compliance assurance', 'Breach prevention', 'Risk mitigation'],
  },
  {
    version: 'V980',
    name: 'Goal Tracker',
    icon: '🎯',
    color: 'from-orange-600 to-orange-800',
    description: 'Tracks commitments, promises, and goals made in emails to ensure accountability and follow-through.',
    features: [
      'Commitment Extraction — Promises, guarantees, and commitments detection',
      'Deadline Tracking — Date extraction with confidence scoring',
      'Deliverable Detection — Send/provide/deliver pattern matching',
      'Goal Identification — Objective and KPI keyword detection',
      'Stakeholder Tracking — Owner and participant identification',
      'Follow-Up Scheduling — Priority-based reminder system',
    ],
    metrics: { commitments: '5 types', deadlines: 'Auto', followUp: 'Scheduled' },
    useCases: ['Accountability', 'Project management', 'Goal tracking', 'Follow-through assurance'],
  },
];

export default function V976V980Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
            🚀 V976-V980 • Visualization • Automation • Analytics • Security • Accountability
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced Email Intelligence Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            5 breakthrough engines that transform email management — with
            <span className="text-blue-400 font-semibold"> thread visualization</span>,
            <span className="text-green-400 font-semibold"> smart automation</span>, and
            <span className="text-red-400 font-semibold"> data protection</span>.
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
                All V976-V980 engines enforce reply-all for multi-recipient emails.
                Every stakeholder stays informed with zero communication gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/20">
          <h4 className="text-2xl font-bold text-white mb-2">Transform Your Email Intelligence</h4>
          <p className="text-gray-400 mb-6">Deploy V976-V980 for advanced visualization, automation, and protection.</p>
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
