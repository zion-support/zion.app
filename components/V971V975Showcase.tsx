'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V971',
    name: 'Signature Intelligence',
    icon: '🌐',
    color: 'from-cyan-600 to-cyan-800',
    description: 'Parses email signatures to extract structured contact info, role, company, social links, certifications, and auto-enriches CRM records.',
    features: [
      'Signature Parsing — Extracts structured data from -- delimiters, sign-offs, and signature blocks',
      'Role & Title Detection — 7+ job categories: executive, management, technical, sales, support, HR, marketing',
      'Company Extraction — Identifies company names from signature context with confidence scoring',
      'Contact Info Extraction — Phone numbers, emails, physical addresses, and websites from signatures',
      'Social Link Detection — LinkedIn, Twitter/X, GitHub, and website profile extraction',
      'Seniority Assessment — C-SUITE to INDIVIDUAL_CONTRIBUTOR scoring for priority handling',
    ],
    metrics: { categories: '7+', socialNetworks: '4', certTypes: '15+' },
    useCases: ['CRM enrichment', 'Sales intelligence', 'Contact management', 'Executive tracking'],
  },
  {
    version: 'V972',
    name: 'Emoji & Tone Intelligence',
    icon: '💬',
    color: 'from-rose-600 to-rose-800',
    description: 'Analyzes emoji usage, emotional tone, cultural context, and generates tone-appropriate response recommendations for global communication.',
    features: [
      'Emoji Classification — 6 categories: positive, negative, professional, casual, warning, neutral',
      'Emotional Tone Detection — 6 tones: enthusiastic, frustrated, grateful, urgent, hesitant, confident',
      'Cultural Guidelines — 3 cultural contexts: formal, semi-formal, and casual cultures',
      'Formality Assessment — FORMAL, SEMI_FORMAL, CASUAL scoring from language and emoji analysis',
      'Response Tone Matching — Mirrors sender tone with professionalism guard for appropriate responses',
      'Emoji Appropriateness Scoring — 0-100 score based on count, category, and formality context',
    ],
    metrics: { emojiCategories: '6', tones: '6', cultures: '3' },
    useCases: ['Global teams', 'Customer support', 'Sales communication', 'Cross-cultural business'],
  },
  {
    version: 'V973',
    name: 'Template Intelligence',
    icon: '📧',
    color: 'from-emerald-600 to-emerald-800',
    description: 'Auto-generates context-aware response templates based on email analysis, intent, tone, and historical patterns. 5x faster response drafting.',
    features: [
      '8 Template Categories — Acknowledgment, support, sales, meeting, follow-up, rejection, escalation, thank-you',
      'Context-Aware Generation — Templates populated with sender name, subject reference, and key details',
      'Formality Matching — FORMAL, SEMI_FORMAL, CASUAL greetings and closings auto-selected',
      'Personalization Engine — References previous conversations, company names, and specific questions',
      'Quality Scoring — Template scored on word count, structure, and customization points',
      'Alternative Templates — Multiple approaches offered for each email category',
    ],
    metrics: { categories: '8', qualityScore: '0-100', speedBoost: '5x' },
    useCases: ['Support teams', 'Sales reps', 'Account managers', 'Executive assistants'],
  },
  {
    version: 'V974',
    name: 'Folder & Label Optimizer',
    icon: '🗂️',
    color: 'from-amber-600 to-amber-800',
    description: 'Intelligent auto-filing based on content analysis, sender patterns, topic classification, and historical filing behavior.',
    features: [
      '10+ Folder Categories — Projects, Sales, Support, Finance, HR, Marketing, Legal, Partners, Newsletters, Spam',
      'Auto-Labeling — Priority, status, type, and team labels applied automatically',
      'Star Recommendations — VIP sender, urgency, and direct request detection for starring',
      'Archive Detection — Identifies safe-to-archive emails: newsletters, notifications, FYI content',
      'Filing Pattern Learning — Remembers sender-to-folder mappings for improving accuracy over time',
      'Filing Confidence Scoring — HIGH/MEDIUM/LOW confidence with manual review suggestions',
    ],
    metrics: { folders: '10+', labelTypes: '4', learning: 'Adaptive' },
    useCases: ['Inbox zero', 'Email organization', 'Team productivity', 'Knowledge management'],
  },
  {
    version: 'V975',
    name: 'Smart Notification Engine',
    icon: '🔔',
    color: 'from-purple-600 to-purple-800',
    description: 'Multi-channel alert routing based on email priority, content analysis, recipient preferences, and time-aware delivery optimization.',
    features: [
      '6+ Notification Channels — Push, SMS, Slack, Teams, desktop, and email digest routing',
      'Priority-Based Routing — CRITICAL (push+sms+slack), URGENT (push+slack), HIGH, NORMAL, LOW',
      'Quiet Hours Management — 10PM-7AM suppression with critical-only override',
      'Escalation Paths — Timed escalation: 15min reminder → 30min SMS → 60min manager notification',
      'Smart Snooze — Priority-based snooze options from 15min to weekly with deadline awareness',
      'Delivery Mode — IMMEDIATE for critical, NEAR_IMMEDIATE for high, BATCHED for normal/low',
    ],
    metrics: { channels: '6+', priorityLevels: '5', escalationSteps: '3' },
    useCases: ['On-call teams', 'Support desks', 'Sales alerts', 'Executive communication'],
  },
];

export default function V971V975Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-cyan-950/10 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-4">
            🚀 V971-V975 • Signatures • Tone • Templates • Filing • Notifications
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Intelligent Email Productivity Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            5 productivity engines that transform email from chaos to clarity — with
            <span className="text-cyan-400 font-semibold"> CRM enrichment</span>,
            <span className="text-rose-400 font-semibold"> tone intelligence</span>, and
            <span className="text-purple-400 font-semibold"> smart notifications</span>.
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
                All V971-V975 engines enforce reply-all for multi-recipient emails.
                Every stakeholder stays informed with zero communication gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl p-8 border border-cyan-500/20">
          <h4 className="text-2xl font-bold text-white mb-2">Transform Your Email Productivity</h4>
          <p className="text-gray-400 mb-6">Deploy V971-V975 for intelligent organization, tone, and notifications.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
            <span>📍 364 E Main St STE 1008, Middletown, DE 19709</span>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/contact" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
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
