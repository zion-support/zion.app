'use client';

import React from 'react';

const V371V375Showcase = () => {
  const engines = [
    {
      version: 'V371',
      name: 'Priority Decay',
      icon: '⏳',
      color: 'from-amber-500 to-orange-500',
      description:
        'Dynamically adjust email priority over time using exponential decay — messages that remain unaddressed lose urgency weight while new critical items rise to the top automatically.',
      capabilities: [
        'Time-based priority decay scoring',
        'Exponential weight reduction for stale threads',
        'Automatic inbox re-ordering as priorities shift',
        'Decay rate customization per sender tier',
        'Priority floor to prevent forgotten critical messages'
      ]
    },
    {
      version: 'V372',
      name: 'Attachment Intelligence',
      icon: '📎',
      color: 'from-sky-500 to-blue-500',
      description:
        'Deep-analyze email attachments — extract text, classify document types, detect changes between versions, and surface key data points without ever opening the file.',
      capabilities: [
        'Automatic attachment text and metadata extraction',
        'Document type classification (invoice, contract, report, etc.)',
        'Version diff detection between attachment revisions',
        'Key data point surfacing (dates, amounts, signatories)',
        'Malicious attachment flagging with sandbox scanning'
      ]
    },
    {
      version: 'V373',
      name: 'Follow-up Automator',
      icon: '🔄',
      color: 'from-green-500 to-teal-500',
      description:
        'Automatically schedule and send intelligent follow-up emails when no reply is received — with smart timing, context-aware drafts, and escalation chains built in.',
      capabilities: [
        'Auto-scheduled follow-ups based on reply expectations',
        'Context-aware draft generation referencing prior thread',
        'Escalation chain configuration (e.g., notify manager after 2nd follow-up)',
        'Smart timing optimization based on recipient behavior',
        'One-click follow-up cancellation on manual reply'
      ]
    },
    {
      version: 'V374',
      name: 'Competitor Intelligence',
      icon: '🏆',
      color: 'from-violet-500 to-purple-500',
      description:
        'Monitor competitor mentions across emails and threads — track market signals, pricing changes, product updates, and partnership signals shared by clients and partners.',
      capabilities: [
        'Competitor name and alias entity recognition',
        'Market signal extraction from client communications',
        'Pricing and feature change detection',
        'Competitive threat scoring and alerting',
        'Periodic competitive intelligence digest generation'
      ]
    },
    {
      version: 'V375',
      name: 'SLA Enforcement',
      icon: '⏱️',
      color: 'from-rose-500 to-red-500',
      description:
        'Enforce Service Level Agreements across every inbox — track response times, auto-escalate breaches, generate compliance reports, and ensure no SLA commitment is ever missed.',
      capabilities: [
        'Per-contact and per-queue SLA timer tracking',
        'Proactive breach warnings before deadlines hit',
        'Automatic escalation routing on SLA violations',
        'Compliance dashboards with breach heatmaps',
        'SLA reporting exports for audits and reviews'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-purple-300 text-sm font-semibold tracking-wide uppercase">
              New Release
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Email Intelligence V371-V375
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five new AI-powered engines that add intelligent automation to every email —
            priority decay, attachment analysis, follow-ups, competitor tracking, and SLA enforcement
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-purple-900/50 border border-purple-500/30 text-purple-200 px-4 py-2 rounded-full">
            <span className="text-sm font-semibold">
              ✓ All engines enforce reply-all for multi-recipient emails
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="bg-gray-800/60 border border-purple-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              177
            </p>
            <p className="text-gray-400 mt-1 font-medium">Total Engines</p>
          </div>
          <div className="bg-gray-800/60 border border-purple-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              1818+
            </p>
            <p className="text-gray-400 mt-1 font-medium">Services Available</p>
          </div>
          <div className="bg-gray-800/60 border border-purple-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              V199–V375
            </p>
            <p className="text-gray-400 mt-1 font-medium">Engine Range</p>
          </div>
          <div className="bg-gray-800/60 border border-purple-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              5
            </p>
            <p className="text-gray-400 mt-1 font-medium">New in This Release</p>
          </div>
        </div>

        {/* Engine Cards */}
        <div className="grid gap-8 max-w-7xl mx-auto">
          {engines.map((engine) => (
            <div
              key={engine.version}
              className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="lg:flex">
                <div
                  className={`lg:w-1/3 bg-gradient-to-br ${engine.color} p-8 text-white flex flex-col justify-center`}
                >
                  <div className="text-6xl mb-4">{engine.icon}</div>
                  <h3 className="text-3xl font-bold mb-2">{engine.version}</h3>
                  <p className="text-xl font-semibold">{engine.name}</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <p className="text-gray-300 text-lg mb-6">{engine.description}</p>
                  <div>
                    <h4 className="text-sm font-bold text-gray-100 mb-3 uppercase tracking-wide">
                      Key Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {engine.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                          <span className="text-gray-300">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-2xl shadow-purple-500/20">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Email Intelligence?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join 10,000+ companies using Zion Tech Group&apos;s AI-powered email platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Schedule a Demo
              </a>
              <a
                href="/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Explore All Services
              </a>
            </div>
            <div className="mt-6 text-sm opacity-80">
              <p>📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V371V375Showcase;
