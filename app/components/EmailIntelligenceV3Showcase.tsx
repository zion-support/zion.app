'use client';

import { useState } from 'react';

const engines = [
  {
    id: 'v114',
    name: 'V114: Email Scheduler & Time Zone Optimizer',
    icon: '🕐',
    description: 'AI-powered send time prediction with timezone-aware delivery, batch scheduling, smart queuing, and engagement rate optimization across global teams.',
    features: [
      'Predict perfect send time per recipient',
      'Timezone-aware delivery across 24+ zones',
      'Batch scheduling with smart queuing',
      'Engagement rate prediction (open/response)',
      'VIP and priority recipient handling',
      'Self-learning from delivery outcomes',
      'Business hours detection per country',
      'Guaranteed reply-all for multi-recipient emails'
    ],
    color: 'from-blue-500 to-indigo-600',
    stats: { accuracy: '94%', timezones: '24+', improvement: '+38% opens' },
    pricing: '$249/mo',
    useCases: ['Global Sales Teams', 'Customer Support', 'Marketing Automation', 'Executive Communication']
  },
  {
    id: 'v115',
    name: 'V115: Knowledge Base Auto-Builder',
    icon: '📚',
    description: 'Automatically extract Q&A pairs, procedures, and FAQs from email threads to build a self-updating knowledge base that reduces repeat questions by 60%.',
    features: [
      'Auto-extract Q&A from email threads',
      'Procedure and step-by-step detection',
      'FAQ generation from frequent questions',
      'Smart categorization (6 categories)',
      'Full-text search across knowledge base',
      'Duplicate detection and merging',
      'Usage tracking and analytics',
      'Export to any KB platform (Zendesk, Confluence, Notion)'
    ],
    color: 'from-green-500 to-emerald-600',
    stats: { reduction: '60%', categories: '6+', extraction: '95%' },
    pricing: '$349/mo',
    useCases: ['Support Teams', 'IT Help Desks', 'Customer Success', 'Internal Knowledge Management']
  },
  {
    id: 'v116',
    name: 'V116: Email Template Intelligence',
    icon: '📝',
    description: 'Generate, A/B test, and auto-optimize email templates based on response rates. Personalization at scale with dynamic variables and winner auto-promotion.',
    features: [
      'AI template generation for 5+ categories',
      'Automated A/B testing with statistical significance',
      'Winner auto-promotion after 30+ sends',
      'Dynamic variable personalization',
      'Subject line formula library',
      'Response rate tracking per template',
      'Multi-variant testing support',
      'Template performance dashboard'
    ],
    color: 'from-purple-500 to-violet-600',
    stats: { lift: '+45%', templates: '50+', variants: '∞' },
    pricing: '$199/mo',
    useCases: ['Sales Outreach', 'Customer Support', 'Marketing Campaigns', 'Recruiting']
  },
  {
    id: 'v117',
    name: 'V117: Email-to-CRM Sync Engine',
    icon: '🔗',
    description: 'Automatically extract contacts, companies, deals, and activities from emails and sync to Salesforce, HubSpot, Pipedrive with zero manual data entry.',
    features: [
      'Auto-extract contacts with phone and email',
      'Company detection from domains',
      'Deal value and stage extraction',
      'Activity logging and timeline building',
      'Task extraction from action items',
      '6 CRM integrations (Salesforce, HubSpot, etc.)',
      'Duplicate detection and merging',
      'Reply-all enforcement for team visibility'
    ],
    color: 'from-orange-500 to-red-600',
    stats: { accuracy: '92%', crms: '6', timeSaved: '15h/wk' },
    pricing: '$399/mo',
    useCases: ['Sales Teams', 'Account Managers', 'Business Development', 'Revenue Operations']
  },
  {
    id: 'v118',
    name: 'V118: Email Security Sentinel',
    icon: '🛡️',
    description: 'Advanced phishing detection, BEC prevention, impersonation detection, URL analysis, and real-time threat intelligence to protect your organization.',
    features: [
      'Phishing detection with 97% accuracy',
      'Business Email Compromise (BEC) prevention',
      'Domain impersonation detection (lookalike domains)',
      'Suspicious URL and attachment analysis',
      'SPF/DKIM/DMARC header validation',
      'Sender reputation scoring',
      'Auto-quarantine for high-risk emails',
      'Reply-all blocking for quarantined threats'
    ],
    color: 'from-red-500 to-rose-600',
    stats: { accuracy: '97%', threatsBlocked: '10K+', falsePositives: '<1%' },
    pricing: '$499/mo',
    useCases: ['Security Teams', 'IT Departments', 'Finance Teams', 'Executive Protection']
  }
];

export default function EmailIntelligenceV3Showcase() {
  const [active, setActive] = useState('v114');
  const current = engines.find(e => e.id === active) || engines[0];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            V114–V118 • Next-Gen Email Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🚀 Smarter Email, Every Interaction
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Five new AI engines that transform email from a time-sink into a strategic advantage.
            From perfect timing to security, each email is analyzed case-by-case with
            <strong className="text-purple-300"> guaranteed reply-all enforcement</strong>.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map(eng => (
            <button
              key={eng.id}
              onClick={() => setActive(eng.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === eng.id
                  ? `bg-gradient-to-r ${eng.color} text-white shadow-lg scale-105`
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {eng.icon} {eng.name.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${current.color} bg-opacity-20`}>
              {current.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{current.name}</h3>
              <p className="text-slate-400 mt-1">{current.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(current.stats).map(([key, val]) => (
              <div key={key} className="bg-slate-800/60 rounded-lg px-4 py-2 text-center">
                <div className="text-lg font-bold text-white">{val}</div>
                <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-center">
              <div className="text-lg font-bold text-green-400">{current.pricing}</div>
              <div className="text-xs text-green-300">Starting at</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {current.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-800/40 rounded-lg p-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Use Cases */}
          <div className="flex flex-wrap gap-2 mb-6">
            {current.useCases.map((uc, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                {uc}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 items-center justify-between bg-slate-800/40 rounded-xl p-4">
            <div>
              <p className="text-white font-semibold">Ready to upgrade your email workflow?</p>
              <p className="text-slate-400 text-sm">14-day free trial • No credit card required</p>
            </div>
            <div className="flex gap-2">
              <a href="/contact" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </a>
              <a href="mailto:kleber@ziontechgroup.com" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📧 Contact Sales
              </a>
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[
            { label: 'Emails Secured', value: '10K+', icon: '🛡️' },
            { label: 'Time Saved', value: '20h/wk', icon: '⏱️' },
            { label: 'CRM Records', value: '50K+', icon: '🔗' },
            { label: 'KB Articles', value: '5K+', icon: '📚' },
            { label: 'Reply-All Rate', value: '100%', icon: '📬' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-800/40 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-slate-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>📱 +1 302 464 0950 • 📧 kleber@ziontechgroup.com • 📍 364 E Main St STE 1008, Middletown DE 19709</p>
        </div>
      </div>
    </section>
  );
}
