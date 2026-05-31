import React from 'react';
import { Brain, Calendar, FileText, TrendingDown, GitMerge } from 'lucide-react';

const V626V630Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V626',
      name: 'Sentiment Evolution Tracker',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Track sentiment changes across conversations and detect relationship deterioration early with AI-powered trend analysis.',
      features: ['Sentiment trend analysis', 'Relationship health scoring', 'Intervention detection', 'Suggested actions']
    },
    {
      version: 'V627',
      name: 'Meeting Scheduler Pro',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'AI-powered meeting scheduling with time extraction, conflict detection, and calendar integration.',
      features: ['Time extraction', 'Conflict detection', 'Calendar integration', 'Alternative suggestions']
    },
    {
      version: 'V628',
      name: 'Document Summarizer',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Summarize long documents and attachments with key point extraction and executive briefs.',
      features: ['Attachment summarization', 'Key point extraction', 'Action item detection', 'Executive briefs']
    },
    {
      version: 'V629',
      name: 'Priority Decay Engine',
      icon: <TrendingDown className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      description: 'Automatically adjust email priority based on age with smart escalation triggers.',
      features: ['Age-based decay', 'Smart escalation', 'Archive timing', 'Action recommendations']
    },
    {
      version: 'V630',
      name: 'Thread Consolidator',
      icon: <GitMerge className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Merge related email threads and eliminate duplicates with unified conversation view.',
      features: ['Thread grouping', 'Duplicate detection', 'Unified view', 'Time savings']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            V626-V630: Advanced Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful engines for sentiment tracking, scheduling, summarization, priority management, and thread consolidation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine) => (
            <div
              key={engine.version}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${engine.color} flex items-center justify-center text-white mb-4`}>
                {engine.icon}
              </div>
              <div className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-3">
                {engine.version}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 mb-4 text-sm">{engine.description}</p>
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-300">Reply-All Enforcement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5</div>
              <div className="text-gray-300">AI Engines</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2,838</div>
              <div className="text-gray-300">Total Services</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V626V630Showcase;
