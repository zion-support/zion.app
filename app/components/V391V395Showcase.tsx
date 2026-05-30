'use client';

import React from 'react';

const V391V395Showcase = () => {
  const engines = [
    {
      version: 'V391',
      name: 'Smart Reply Generator',
      icon: '💬',
      color: 'from-cyan-500 to-blue-600',
      description:
        'Generate contextually perfect replies in seconds — analyze incoming message intent, thread history, recipient preferences, and urgency signals to draft intelligent responses that sound like you, not a robot.',
      capabilities: [
        'Intent-aware reply generation from full thread context analysis',
        'Personalized writing style matching based on your historical emails',
        'Multi-option reply suggestions with varying tones and lengths',
        'Smart template fusion combining canned responses with dynamic personalization',
        'One-click send with inline editing for rapid response workflows'
      ]
    },
    {
      version: 'V392',
      name: 'Thread Consolidator',
      icon: '🔗',
      color: 'from-pink-500 to-rose-600',
      description:
        'Automatically merge fragmented email conversations into unified threads — detect duplicate subjects, split conversations, forwarded chains, and cross-referenced messages to eliminate inbox clutter and restore clarity.',
      capabilities: [
        'Intelligent thread merging across duplicate and forked conversations',
        'Chronological reassembly of scattered messages into a single timeline',
        'Duplicate detection with content-diff highlighting for overlapping messages',
        'Cross-mailbox thread unification (personal, work, shared inboxes)',
        'Thread summary generation with key decisions and action items extracted'
      ]
    },
    {
      version: 'V393',
      name: 'Time Zone Optimizer',
      icon: '🌍',
      color: 'from-teal-500 to-emerald-600',
      description:
        'Maximize engagement across global teams with intelligent send-time optimization — analyze recipient time zones, working hours, response patterns, and cultural norms to deliver emails at the perfect moment.',
      capabilities: [
        'Real-time recipient availability detection across 40+ time zones',
        'Optimal send-time calculation based on historical response rate data',
        'Working hours calendar integration for accurate availability windows',
        'Cultural awareness for holidays, weekends, and regional norms',
        'Batch scheduling engine for coordinated global campaign delivery'
      ]
    },
    {
      version: 'V394',
      name: 'Attachment Summarizer',
      icon: '📄',
      color: 'from-amber-500 to-orange-600',
      description:
        'Instantly summarize any email attachment without opening it — extract key points, data tables, action items, and critical deadlines from PDFs, spreadsheets, contracts, and presentations into concise inline summaries.',
      capabilities: [
        'One-click inline summary for PDFs, DOCX, XLSX, and PPTX attachments',
        'Key metrics and data point extraction from financial spreadsheets',
        'Contract clause highlighting with obligation and deadline extraction',
        'Visual chart and graph interpretation with text-based summaries',
        'Multi-attachment cross-referencing for consolidated document briefings'
      ]
    },
    {
      version: 'V395',
      name: 'Signature Analyzer',
      icon: '✍️',
      color: 'from-red-500 to-rose-700',
      description:
        'Analyze and optimize email signatures for maximum professionalism and impact — audit consistency across teams, extract contact intelligence, enforce brand guidelines, and turn every signature into a strategic asset.',
      capabilities: [
        'Signature consistency audit across all team members and departments',
        'Brand guideline enforcement for logos, fonts, colors, and disclaimers',
        'Contact intelligence extraction — auto-populate CRM from incoming signatures',
        'Legal disclaimer validation and regulatory compliance checking',
        'A/B testing framework for signature CTAs and promotional banners'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-indigo-300 text-sm font-semibold tracking-wide uppercase">
              Latest Release
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            Email Intelligence V391-V395
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough engines that redefine email productivity —
            smart replies, thread consolidation, time zone optimization, attachment summarization, and signature analysis
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-indigo-900/50 border border-indigo-500/30 text-indigo-200 px-4 py-2 rounded-full">
            <span className="text-sm font-semibold">
              ✓ All engines enforce reply-all for multi-recipient emails
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="bg-gray-800/60 border border-indigo-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              197
            </p>
            <p className="text-gray-400 mt-1 font-medium">Total Engines</p>
          </div>
          <div className="bg-gray-800/60 border border-indigo-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              1950+
            </p>
            <p className="text-gray-400 mt-1 font-medium">Services Available</p>
          </div>
          <div className="bg-gray-800/60 border border-indigo-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              V199–V395
            </p>
            <p className="text-gray-400 mt-1 font-medium">Engine Range</p>
          </div>
          <div className="bg-gray-800/60 border border-indigo-500/20 rounded-2xl px-8 py-6 text-center">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
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
              className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
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
          <div className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-8 shadow-2xl shadow-indigo-500/20">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Email Intelligence?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join 10,000+ companies using Zion Tech Group&apos;s AI-powered email platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
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

export default V391V395Showcase;
