'use client';

import { useState } from 'react';

const engines = [
  {
    id: 'v104',
    name: 'V104: Context Memory System',
    icon: '🧠',
    description: 'Persistent memory of all email conversations with cross-thread context linking, relationship history tracking, and automatic context injection into responses.',
    features: [
      'Persistent conversation memory across all emails',
      'Cross-thread context linking and relationship mapping',
      'Commitment and promise tracking with fulfillment status',
      'Unresolved question tracking and follow-up reminders',
      'Preference and fact extraction from conversations',
      'Automatic context injection for personalized responses',
      'Relationship stage tracking (Prospect to Long-term)',
      'Related thread detection and linking'
    ],
    color: 'from-blue-500 to-cyan-500',
    useCases: ['Account Management', 'Customer Success', 'Sales Teams', 'Support Teams']
  },
  {
    id: 'v105',
    name: 'V105: Delegation Intelligence',
    icon: '👥',
    description: 'Smart delegation recommendations based on expertise, workload balancing, availability checking, automatic assignment, and performance tracking.',
    features: [
      'Expertise-based task matching and skill assessment',
      'Real-time workload balancing across team members',
      'Availability checking and schedule integration',
      'Automatic assignment with delegation emails',
      'Performance tracking and optimization insights',
      'Alternative delegate recommendations',
      'Confidence scoring for delegation decisions',
      'Team dashboard with workload distribution'
    ],
    color: 'from-purple-500 to-pink-500',
    useCases: ['Team Leads', 'Project Managers', 'Department Heads', 'Executive Assistants']
  },
  {
    id: 'v106',
    name: 'V106: Thread Summarizer Pro',
    icon: '📋',
    description: 'Intelligent summarization of long email threads with key decision extraction, action item highlighting, timeline generation, and participant tracking.',
    features: [
      'Executive summaries for long email threads',
      'Key decision extraction with timestamps',
      'Action item highlighting with assignee tracking',
      'Timeline generation showing thread progression',
      'Participant activity tracking and statistics',
      'Open question identification and tracking',
      'Export capabilities (Markdown, JSON)',
      'Unresolved issue detection'
    ],
    color: 'from-green-500 to-emerald-500',
    useCases: ['Project Managers', 'Executives', 'Team Coordinators', 'Meeting Planners']
  },
  {
    id: 'v107',
    name: 'V107: Attachment Intelligence',
    icon: '📎',
    description: 'Advanced processing of email attachments including PDF text extraction, image OCR, spreadsheet analysis, document summarization, and automatic filing.',
    features: [
      'PDF text extraction and content analysis',
      'Image OCR and text recognition',
      'Spreadsheet data extraction and table parsing',
      'Document summarization and key point extraction',
      'Automatic filing based on content analysis',
      'Financial data extraction from invoices',
      'Risk indicator detection in documents',
      'Action item extraction from attachments'
    ],
    color: 'from-orange-500 to-red-500',
    useCases: ['Finance Teams', 'Legal Departments', 'Administrative Staff', 'Document Processors']
  },
  {
    id: 'v108',
    name: 'V108: Response Time Optimizer',
    icon: '⏱️',
    description: 'Analyzes email patterns to determine optimal response times, learns when recipients are most likely to read and respond, and schedules emails for maximum engagement.',
    features: [
      'Optimal send time prediction based on recipient patterns',
      'Response time analysis and trend tracking',
      'Time slot performance analytics (morning, afternoon, evening)',
      'Day-of-week engagement pattern detection',
      'A/B testing for send time optimization',
      'Performance analytics with open and reply rates',
      'Confidence scoring for predictions',
      'Personalized recommendations per recipient'
    ],
    color: 'from-yellow-500 to-amber-500',
    useCases: ['Sales Teams', 'Marketing Professionals', 'Customer Success', 'Business Development']
  }
];

export default function EmailIntelligenceV2Showcase() {
  const [selectedEngine, setSelectedEngine] = useState(engines[0]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced Email Intelligence V104-V108
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Next-generation email AI with persistent memory, smart delegation, thread summarization,
            attachment intelligence, and response time optimization
          </p>
        </div>

        {/* Engine Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {engines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => setSelectedEngine(engine)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedEngine.id === engine.id
                  ? 'border-white bg-white/10 scale-105 shadow-2xl'
                  : 'border-gray-700 bg-slate-800/50 hover:border-gray-500 hover:scale-102'
              }`}
            >
              <div className="text-4xl mb-3">{engine.icon}</div>
              <div className="text-sm font-semibold text-white">{engine.name.split(':')[0]}</div>
              <div className="text-xs text-gray-400 mt-1">{engine.name.split(':')[1]}</div>
            </button>
          ))}
        </div>

        {/* Selected Engine Details */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
          <div className="flex items-start gap-6 mb-8">
            <div className={`text-6xl p-4 rounded-xl bg-gradient-to-br ${selectedEngine.color} bg-clip-text`}>
              {selectedEngine.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-3">{selectedEngine.name}</h3>
              <p className="text-lg text-gray-300 leading-relaxed">{selectedEngine.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className={`w-8 h-1 bg-gradient-to-r ${selectedEngine.color} rounded-full`}></span>
                Key Features
              </h4>
              <ul className="space-y-3">
                {selectedEngine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-r ${selectedEngine.color} bg-clip-text text-transparent`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className={`w-8 h-1 bg-gradient-to-r ${selectedEngine.color} rounded-full`}></span>
                Perfect For
              </h4>
              <div className="space-y-3">
                {selectedEngine.useCases.map((useCase, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedEngine.color}`}></div>
                      <span className="text-white font-medium">{useCase}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Reply-All Enforced</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Autonomous Operation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Seamlessly Integrated with V89-V103
          </h3>
          <p className="text-lg text-indigo-100 mb-6">
            V104-V108 work together with our existing email intelligence suite to provide
            comprehensive case-by-case analysis with 100% reply-all enforcement
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-white">20</div>
              <div className="text-sm text-indigo-200">Total AI Engines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-indigo-200">Reply-All Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-white">Real-time</div>
              <div className="text-sm text-indigo-200">Processing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
