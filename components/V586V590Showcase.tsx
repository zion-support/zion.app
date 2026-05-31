import React from 'react';

const V586V590Showcase: React.FC = () => {
  const engines = [
    {
      id: 'V586',
      name: 'Email Attachment Compressor',
      icon: '📦',
      description: 'Automatically compress email attachments to reduce size by 40-60% while preserving quality',
      color: 'from-blue-500 to-cyan-500',
      features: ['PDF optimization', 'Image compression', 'Cloud storage integration', 'Quality preservation']
    },
    {
      id: 'V587',
      name: 'Email Thread Visualizer',
      icon: '📊',
      description: 'Create visual timelines and interactive navigation for email conversations',
      color: 'from-purple-500 to-pink-500',
      features: ['Timeline visualization', 'Participant mapping', 'Decision tracking', 'Interactive navigation']
    },
    {
      id: 'V588',
      name: 'Email Sentiment Heatmap',
      icon: '🌡️',
      description: 'Visual heatmap of sentiment across email threads and time periods',
      color: 'from-orange-500 to-red-500',
      features: ['Sentiment visualization', 'Temporal tracking', 'Team analysis', 'Satisfaction correlation']
    },
    {
      id: 'V589',
      name: 'Email Compliance Checklist',
      icon: '✓',
      description: 'Automated compliance checking for GDPR, HIPAA, SOC2 with pre-send validation',
      color: 'from-green-500 to-teal-500',
      features: ['Multi-regulation support', 'Pre-send validation', 'Audit trails', 'Regulatory reporting']
    },
    {
      id: 'V590',
      name: 'Email Accessibility Checker',
      icon: '♿',
      description: 'WCAG compliance checking with screen reader compatibility and color contrast validation',
      color: 'from-indigo-500 to-purple-500',
      features: ['WCAG compliance', 'Screen reader testing', 'Color contrast', 'Alt-text suggestions']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Email Intelligence Engines <span className="text-indigo-400">V586-V590</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced email optimization with attachment compression, thread visualization, 
            sentiment heatmaps, compliance checking, and accessibility validation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine) => (
            <div
              key={engine.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{engine.icon}</span>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-semibold">
                  {engine.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">{engine.description}</p>
              <ul className="space-y-2">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-400 mb-2">390</div>
              <div className="text-gray-300">Total Engines</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">2,663</div>
              <div className="text-gray-300">Total Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-gray-300">Reply-All Enforced</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">5</div>
              <div className="text-gray-300">New Engines</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-[2px]">
            <div className="bg-slate-900 rounded-lg px-8 py-4">
              <p className="text-gray-300 text-lg">
                🚀 <span className="font-semibold text-white">All engines enforce reply-all</span> for intelligent email optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V586V590Showcase;
