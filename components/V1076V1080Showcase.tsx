import React, { useState } from 'react';

export default function V1076V1080Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);

  const engines = [
    {
      id: 'V1076',
      name: 'Sentiment Evolution Tracker',
      icon: '📈',
      description: 'Track sentiment changes across email threads over time. Detect deteriorating relationships early and predict churn risk.',
      features: [
        'Real-time sentiment tracking across threads',
        'Trend analysis and evolution detection',
        'Churn risk prediction with early warnings',
        'Relationship health scoring (0-100)',
        'Historical sentiment visualization',
        'Proactive intervention recommendations'
      ],
      useCases: [
        'Customer success teams monitoring account health',
        'Sales teams identifying at-risk deals',
        'Account managers tracking client satisfaction'
      ],
      price: '$599/month'
    },
    {
      id: 'V1077',
      name: 'Response Quality Scorer',
      icon: '🎯',
      description: 'AI-powered scoring of email response quality across clarity, tone, completeness, professionalism, and actionability.',
      features: [
        'Multi-dimensional quality scoring',
        'Clarity and readability analysis',
        'Tone and professionalism assessment',
        'Completeness and actionability checks',
        'Real-time improvement suggestions',
        'Strengths and weaknesses identification'
      ],
      useCases: [
        'Training new team members on email best practices',
        'Quality assurance for customer-facing communications',
        'Improving sales email effectiveness'
      ],
      price: '$449/month'
    },
    {
      id: 'V1078',
      name: 'Smart Threading & Context Builder',
      icon: '🧵',
      description: 'Intelligently group related emails across threads and build complete context from fragmented discussions.',
      features: [
        'Cross-thread conversation grouping',
        'Entity extraction and indexing',
        'Decision tracking and logging',
        'Action item identification',
        'Related conversation discovery',
        'Thread health assessment'
      ],
      useCases: [
        'Project managers tracking complex discussions',
        'Legal teams documenting decisions',
        'Consultants managing multiple client threads'
      ],
      price: '$529/month'
    },
    {
      id: 'V1079',
      name: 'Productivity Analytics Dashboard',
      icon: '📊',
      description: 'Comprehensive analytics on email productivity. Track response patterns, identify bottlenecks, and optimize workflows.',
      features: [
        'Response time tracking and benchmarks',
        'Inbox health scoring',
        'Productivity bottleneck identification',
        'Email volume and workload analysis',
        'Daily/weekly performance reports',
        'Actionable improvement insights'
      ],
      useCases: [
        'Managers monitoring team productivity',
        'Individuals optimizing personal workflows',
        'Organizations reducing email overload'
      ],
      price: '$479/month'
    },
    {
      id: 'V1080',
      name: 'Follow-up Automation',
      icon: '🔄',
      description: 'Intelligent follow-up system tracking commitments, deadlines, and unanswered emails with automated reminders.',
      features: [
        'Commitment and promise tracking',
        'Deadline monitoring and reminders',
        'Unanswered question detection',
        'Automated follow-up scheduling',
        'Smart escalation rules',
        'Priority-based follow-up ordering'
      ],
      useCases: [
        'Sales teams following up on proposals',
        'Project managers tracking action items',
        'Account managers ensuring deliverables'
      ],
      price: '$549/month'
    }
  ];

  const engine = engines[activeEngine];

  return (
    <div className="bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            V1076-V1080: Intelligence & Productivity Suite
          </h2>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            Five advanced engines that track sentiment evolution, ensure quality responses, build conversation context,
            boost productivity, and automate follow-ups.
          </p>
          <div className="mt-6 inline-block bg-gradient-to-r from-green-400 to-cyan-500 text-black font-bold px-6 py-2 rounded-full">
            5,230 Services • 1,080 Engines • Reply-All Enforced
          </div>
        </div>

        {/* Engine Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {engines.map((eng, idx) => (
            <button
              key={eng.id}
              onClick={() => setActiveEngine(idx)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeEngine === idx
                  ? 'bg-white text-green-900 shadow-2xl scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-3xl mb-1">{eng.icon}</div>
              <div className="text-sm">{eng.id}</div>
            </button>
          ))}
        </div>

        {/* Active Engine Details */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">{engine.icon}</div>
              <div>
                <div className="text-sm font-semibold opacity-80">{engine.id}</div>
                <h3 className="text-3xl font-bold">{engine.name}</h3>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm opacity-80">Starting at</div>
                <div className="text-3xl font-bold">{engine.price}</div>
              </div>
            </div>
            <p className="text-lg opacity-90">{engine.description}</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Key Features
                </h4>
                <ul className="space-y-3">
                  {engine.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Use Cases
                </h4>
                <ul className="space-y-3">
                  {engine.useCases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-gray-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👥</span> Reply-All Enforcement
                </h4>
                <p className="text-gray-700">
                  All engines automatically enforce reply-all for multi-recipient emails, ensuring all stakeholders
                  stay informed and no one is accidentally left out of important conversations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Enhance Your Email Intelligence?</h3>
            <p className="text-green-200 mb-6">
              Contact us today to learn how these engines can transform your email workflows.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white">
              <a href="tel:+130****0950" className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span>📱</span> +1 302 464 0950
              </a>
              <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span>✉️</span> kleber@ziontechgroup.com
              </a>
              <div className="flex items-center gap-2">
                <span>📍</span> 364 E Main St STE 1008, Middletown DE 19709
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
