import React from 'react';

const V641V645Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V641',
      name: 'Email Calendar Sync Engine',
      icon: '📅',
      description: 'Automatically extract meetings, events, and deadlines from emails and sync them to your calendar with intelligent scheduling.',
      features: ['Date/time extraction', 'Event type detection', 'Attendee parsing', 'Conflict checking', 'Location extraction']
    },
    {
      version: 'V642',
      name: 'Smart Unsubscribe Manager',
      icon: '📧',
      description: 'Intelligent subscription management that analyzes engagement patterns to recommend which newsletters to keep or remove.',
      features: ['Engagement analysis', 'Subscription detection', 'Unsubscribe scoring', 'Bulk cleanup', 'Value assessment']
    },
    {
      version: 'V643',
      name: 'Email Signature A/B Testing',
      icon: '✍️',
      description: 'Test and optimize email signatures to maximize engagement, response rates, and professional impact.',
      features: ['Signature variants', 'A/B experiments', 'Performance tracking', 'Best practices', 'Statistical analysis']
    },
    {
      version: 'V644',
      name: 'Bounce Rate Analyzer',
      icon: '🎯',
      description: 'Comprehensive bounce analysis with root cause identification, automatic list cleaning, and deliverability improvement.',
      features: ['Bounce classification', 'Pattern detection', 'List cleaning', 'Domain verification', 'Deliverability scoring']
    },
    {
      version: 'V645',
      name: 'Email Warm-up Automation',
      icon: '🔥',
      description: 'Automated domain warm-up with gradual volume scaling, reputation monitoring, and ISP compliance optimization.',
      features: ['Warm-up planning', 'Volume scaling', 'Reputation tracking', 'ISP compliance', 'Progress analytics']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 Email Intelligence V641-V645
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful engines for calendar sync, subscription management, signature optimization, bounce analysis, and domain warm-up
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="inline-block px-3 py-1 bg-cyan-500 text-white text-sm font-bold rounded-full mb-3">
                {engine.version}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 mb-4 text-sm">{engine.description}</p>
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, fidx) => (
                  <li key={fidx} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl p-6 border border-cyan-400/30">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📞 Contact Us for a Free Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-cyan-300 font-semibold">📱 Mobile</p>
              <p className="text-white">+1 302 464 0950</p>
            </div>
            <div>
              <p className="text-cyan-300 font-semibold">✉️ Email</p>
              <p className="text-white">kleber@ziontechgroup.com</p>
            </div>
            <div>
              <p className="text-cyan-300 font-semibold">📍 Address</p>
              <p className="text-white">364 E Main St STE 1008, Middletown, DE 19709</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-white text-lg mb-2">
              <strong className="text-cyan-300">Total Platform Stats:</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-2xl font-bold text-white">445</span>
                <br />Email Intelligence Engines
              </div>
              <div className="text-gray-300">
                <span className="text-2xl font-bold text-white">2,873</span>
                <br />Total Services
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V641V645Showcase;
