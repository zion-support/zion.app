import React from 'react';
import Link from 'next/link';

const V286V290Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V286',
      name: 'Language Style Adapter',
      icon: '🎨',
      description: 'Detects communication style preferences and adapts tone automatically',
      features: ['Style detection', 'Tone adaptation', 'Learning system'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      version: 'V287',
      name: 'Engagement Analytics',
      icon: '📊',
      description: 'Tracks email performance with A/B testing and optimal send times',
      features: ['Open rate tracking', 'A/B testing', 'Send time optimization'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      version: 'V288',
      name: 'Security Sentinel',
      icon: '🛡️',
      description: 'Advanced phishing detection and malware protection',
      features: ['Phishing detection', 'SPF/DKIM validation', 'Link scanning'],
      color: 'from-red-500 to-orange-500'
    },
    {
      version: 'V289',
      name: 'Auto-Responder AI',
      icon: '🤖',
      description: 'Context-aware automated responses with smart escalation',
      features: ['Auto-responses', 'Smart escalation', 'Routine handling'],
      color: 'from-green-500 to-teal-500'
    },
    {
      version: 'V290',
      name: 'Performance Predictor',
      icon: '📈',
      description: 'Pre-send optimization with success prediction',
      features: ['Success prediction', 'Subject optimization', 'Response forecasting'],
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container-page">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Email Intelligence V286-V290
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Five advanced AI engines that transform your email communication with intelligent adaptation, 
            security, automation, and predictive optimization
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {engines.map((engine) => (
            <div
              key={engine.version}
              className="glass-card hover:scale-105 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${engine.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {engine.icon}
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  {engine.version}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {engine.name}
              </h3>
              
              <p className="text-slate-400 mb-4 leading-relaxed">
                {engine.description}
              </p>
              
              <ul className="space-y-2">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-slate-300">
                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">87</div>
              <div className="text-slate-400">Total Email Engines</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,402</div>
              <div className="text-slate-400">Services Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-400">Reply-All Enforced</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            Explore All 1,402 Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default V286V290Showcase;
