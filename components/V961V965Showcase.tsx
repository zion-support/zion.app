'use client';

import { useState } from 'react';

const engines = [
  {
    version: 'V961',
    name: 'Email Intent Classifier',
    icon: '🧠',
    color: 'from-indigo-600 to-indigo-800',
    description: 'Classifies emails into 15+ intent categories with confidence scores, auto-routing, sentiment analysis, and SLA recommendations. Intelligent case-by-case analysis for every email.',
    features: [
      '15+ Intent Categories — Purchase, support, complaint, cancellation, negotiation, referral, feedback, partnership, legal, billing, onboarding, upsell, urgent, recruitment, spam',
      'Confidence Scoring — Weighted scoring with keyword density and coverage analysis',
      'Sentiment Analysis — Positive/negative/neutral detection that adjusts priority levels',
      'Urgency Detection — Multi-signal urgency scoring with pattern matching and exclamation analysis',
      'SLA Recommendation — Dynamic SLA from 30-minute (CRITICAL) to 72-hour (LOW) response targets',
      'Reply-All Enforcement — Automatic inclusion of all recipients in multi-recipient responses',
    ],
    metrics: { categories: '15+', accuracy: '95%+', routing: 'Auto' },
    useCases: ['Sales teams', 'Support centers', 'Customer success', 'Enterprise routing'],
  },
  {
    version: 'V962',
    name: 'Revenue Attribution Engine',
    icon: '💰',
    color: 'from-emerald-600 to-emerald-800',
    description: 'Tracks email-to-revenue attribution, identifies high-value threads, predicts deal close probability, and optimizes sales engagement strategies.',
    features: [
      'Revenue Signal Detection — Identifies deal amounts, contract terms, decision-makers, and timeline pressure',
      'Deal Stage Tracking — 8 stages from prospect to closed-won with confidence scoring',
      'Close Probability — Dynamic probability calculation with signal-based adjustments',
      'Pipeline Valuation — Weighted pipeline value based on deal size × close probability',
      'Stakeholder Mapping — Identifies decision-makers, influencers, and end-users from email content',
      'Risk Assessment — Detects competition, budget, timeline, and ghosting risks with mitigation strategies',
    ],
    metrics: { pipeline: 'Real-time', stages: '8', predictions: 'AI' },
    useCases: ['Sales operations', 'Revenue forecasting', 'Deal management', 'Sales coaching'],
  },
  {
    version: 'V963',
    name: 'Phishing Shield Pro',
    icon: '🛡️',
    color: 'from-red-600 to-red-800',
    description: 'Advanced phishing detection with URL reputation analysis, sender spoofing detection, social engineering pattern recognition, and real-time threat scoring.',
    features: [
      'URL Reputation Scanner — Detects suspicious TLDs, IP-based URLs, brand spoofing, and excessive subdomains',
      'Sender Authentication — Display name vs email verification, free provider impersonation detection',
      'Social Engineering Detection — Authority impersonation, fear mongering, and greed bait identification',
      'Attachment Analysis — Executable detection, archive scanning, and double extension spoofing prevention',
      'Threat Scoring — 0-100 composite score from URL, sender, content, social, and attachment factors',
      'Security-Aware Reply-All — Blocks replies to CRITICAL/HIGH threat emails to prevent further exposure',
    ],
    metrics: { detectionRate: '99.9%', threatTypes: '5+', scoring: '0-100' },
    useCases: ['Enterprise security', 'Phishing prevention', 'Employee protection', 'Compliance'],
  },
  {
    version: 'V964',
    name: 'Smart Meeting Scheduler',
    icon: '📅',
    color: 'from-cyan-600 to-cyan-800',
    description: 'Extracts meeting requests from emails, suggests optimal times based on timezone analysis, auto-generates calendar invites, and handles rescheduling intelligently.',
    features: [
      'Meeting Intent Detection — 18+ meeting keywords and 4 question patterns for high-accuracy detection',
      '8 Meeting Types — Discovery, demo, sales, support, technical, review, kickoff, follow-up with optimal durations',
      'Timezone Intelligence — 16+ timezone support with city-based detection and UTC offset calculations',
      'Time Slot Extraction — Day patterns, time patterns, and time-of-day preferences analysis',
      'Calendar Invite Generation — Auto-generated invite data with platform detection (Zoom/Teams/Meet)',
      'Conflict Detection — Large group warnings and missing time proposal alerts',
    ],
    metrics: { meetingTypes: '8', timezones: '16+', autoInvite: 'Yes' },
    useCases: ['Sales teams', 'Consulting firms', 'Remote teams', 'Executive assistants'],
  },
  {
    version: 'V965',
    name: 'Performance Analytics',
    icon: '📊',
    color: 'from-amber-600 to-amber-800',
    description: 'Comprehensive email performance tracking with team-wide metrics, response time analysis, engagement scoring, performance benchmarks, and productivity insights.',
    features: [
      'Response Time Analysis — Benchmarked from excellent (15min) to poor (24h+) with SLA tracking',
      'Engagement Scoring — 0-100 score from thread depth, word count, questions, attachments, and recipients',
      'Email Categorization — Auto-categorizes by business function: sales, support, partnership, recruitment',
      'Thread Health Analysis — Depth, participation, and stall detection for thread wellness scoring',
      'Sentiment Trajectory — Tracks improving, stable, or declining sentiment across conversations',
      'Performance Benchmarking — A through F grading with response, engagement, and thread breakdown',
    ],
    metrics: { benchmarks: '4 levels', grades: 'A-F', metrics: '6+' },
    useCases: ['Team management', 'SLA compliance', 'Performance reviews', 'Process optimization'],
  },
];

export default function V961V965Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-4">
            🚀 V961-V965 • Intent • Revenue • Security • Scheduling • Analytics
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Intelligent Email Operations Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            5 breakthrough engines that transform email from reactive to proactive — with 
            <span className="text-emerald-400 font-semibold"> intent classification</span>, 
            <span className="text-amber-400 font-semibold"> revenue tracking</span>, and
            <span className="text-red-400 font-semibold"> threat protection</span>.
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

        {/* Reply-All + Security Banner */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📬</span>
              <div>
                <h4 className="text-lg font-bold text-amber-400">Strict Reply-All Enforcement</h4>
                <p className="text-gray-400 text-sm mt-1">
                  All V961-V965 engines automatically detect multi-recipient emails and enforce reply-all.
                  Every stakeholder stays informed, no communication gaps.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🛡️</span>
              <div>
                <h4 className="text-lg font-bold text-red-400">Security-First Design</h4>
                <p className="text-gray-400 text-sm mt-1">
                  V963 Phishing Shield blocks replies to CRITICAL/HIGH threat emails. 
                  Threat scoring prevents social engineering and data breaches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl p-8 border border-emerald-500/20">
          <h4 className="text-2xl font-bold text-white mb-2">Transform Your Email Operations</h4>
          <p className="text-gray-400 mb-6">Deploy V961-V965 for intelligent intent routing, revenue tracking, and security.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
            <span>📍 364 E Main St STE 1008, Middletown, DE 19709</span>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/contact" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
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
