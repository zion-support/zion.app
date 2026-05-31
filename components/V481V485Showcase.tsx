import React from 'react';

/**
 * V481-V485 Email Intelligence Showcase Component
 * Displays the 5 newest email intelligence engines
 */

const V481V485Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V481',
      name: 'Email Sentiment Evolution Tracker',
      icon: '📈',
      color: 'from-blue-500 to-cyan-500',
      description: 'Track how sentiment changes over time in email conversations',
      features: [
        'Sentiment timeline tracking',
        'Trend analysis',
        'Relationship health scoring',
        'Early warning system'
      ],
      price: '$49-199/mo'
    },
    {
      version: 'V482',
      name: 'Email Priority Decay Engine',
      icon: '⏱️',
      color: 'from-purple-500 to-pink-500',
      description: 'Automatically adjust email priority based on age and context',
      features: [
        'Dynamic priority adjustment',
        'Age-based decay algorithms',
        'Context-aware scoring',
        'Overdue detection'
      ],
      price: '$39-159/mo'
    },
    {
      version: 'V483',
      name: 'Email Meeting Scheduler Intelligence',
      icon: '📅',
      color: 'from-green-500 to-emerald-500',
      description: 'Extract meeting requests and suggest optimal times',
      features: [
        'Meeting intent detection',
        'Time preference extraction',
        'Optimal time suggestions',
        'Calendar integration'
      ],
      price: '$44-179/mo'
    },
    {
      version: 'V484',
      name: 'Email Contract & Agreement Detector',
      icon: '📝',
      color: 'from-orange-500 to-red-500',
      description: 'Identify contracts, agreements, and legal obligations',
      features: [
        'Contract detection',
        'Commitment extraction',
        'Obligation tracking',
        'Risk assessment'
      ],
      price: '$69-279/mo'
    },
    {
      version: 'V485',
      name: 'Email Revenue Attribution Tracker',
      icon: '💰',
      color: 'from-yellow-500 to-amber-500',
      description: 'Track which emails lead to revenue with ROI calculation',
      features: [
        'Revenue detection',
        'Conversion attribution',
        'ROI calculation',
        'Pipeline insights'
      ],
      price: '$79-319/mo'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🚀 Latest: V481-V485 Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five cutting-edge AI engines for sentiment tracking, priority management, meeting scheduling, contract detection, and revenue attribution
          </p>
        </div>

        {/* Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, index) => (
            <div
              key={engine.version}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${engine.color} mb-4`}>
                <span className="text-4xl">{engine.icon}</span>
              </div>
              
              <div className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3">
                {engine.version}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {engine.name}
              </h3>
              
              <p className="text-gray-300 mb-4 text-sm">
                {engine.description}
              </p>
              
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4 border-t border-white/20">
                <p className="text-white font-semibold">
                  💰 {engine.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Key Features Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 Key Features Across All Engines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✉️</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Reply-All Enforcement</h4>
                <p className="text-gray-300 text-sm">All engines enforce reply-all for multi-recipient emails</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Case-by-Case Analysis</h4>
                <p className="text-gray-300 text-sm">Each email analyzed individually with AI</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Real-Time Processing</h4>
                <p className="text-gray-300 text-sm">Instant insights and actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">280</div>
            <div className="text-gray-300 text-sm">Total Engines</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">2,256+</div>
            <div className="text-gray-300 text-sm">Total Services</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-300 text-sm">Reply-All Enforced</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-300 text-sm">Average Rating</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Email Intelligence?
            </h3>
            <p className="text-xl text-gray-200 mb-6">
              Join thousands of professionals using AI-powered email management
            </p>
            
            <div className="space-y-2 text-left text-gray-200">
              <p>📞 <strong>Call:</strong> +1 302 464 0950</p>
              <p>✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p>📍 <strong>Visit:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V481V485Showcase;
