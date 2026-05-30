import React from 'react';

const V361V365Showcase = () => {
  const engines = [
    {
      version: 'V361',
      name: 'Sentiment Evolution Tracker',
      icon: '📈',
      color: 'from-purple-500 to-pink-500',
      description: 'Track sentiment changes across email threads over time, detect relationship health trends, and predict churn risk.',
      capabilities: [
        'Real-time sentiment trajectory analysis',
        'Relationship health scoring',
        'Churn risk prediction with 85% accuracy',
        'Proactive retention action triggers',
        'Visual sentiment timeline dashboards'
      ]
    },
    {
      version: 'V362',
      name: 'Negotiation Intelligence',
      icon: '🤝',
      color: 'from-blue-500 to-cyan-500',
      description: 'Detect negotiation signals, track concession patterns, suggest optimal counter-offers, and identify decision-makers.',
      capabilities: [
        'Negotiation signal detection (price, terms, deadlines)',
        'Concession pattern tracking',
        'AI-powered counter-offer suggestions',
        'Decision-maker identification',
        'Negotiation strategy briefings'
      ]
    },
    {
      version: 'V363',
      name: 'Knowledge Graph Builder',
      icon: '🕸️',
      color: 'from-green-500 to-emerald-500',
      description: 'Extract entities from emails, build relationship graphs, map organizational structures, and create searchable knowledge bases.',
      capabilities: [
        'Automatic entity extraction (people, companies, topics)',
        'Relationship graph visualization',
        'Organizational structure mapping',
        'Hidden connection discovery',
        'Searchable knowledge base generation'
      ]
    },
    {
      version: 'V364',
      name: 'Productivity Analytics',
      icon: '⚡',
      color: 'from-orange-500 to-red-500',
      description: 'Track time spent on email, identify productivity patterns, measure email-to-meeting conversion, and detect email overload.',
      capabilities: [
        'Email time tracking and analytics',
        'Productivity pattern identification',
        'Email-to-meeting conversion rates',
        'Email overload detection',
        'Inbox zero strategy suggestions'
      ]
    },
    {
      version: 'V365',
      name: 'Security Threat Hunter',
      icon: '🎯',
      color: 'from-red-500 to-rose-500',
      description: 'Proactive threat hunting, detect advanced persistent threats, identify compromised accounts, and generate threat intelligence reports.',
      capabilities: [
        'Proactive threat hunting algorithms',
        'Advanced Persistent Threat (APT) detection',
        'Compromised account identification',
        'Lateral movement pattern detection',
        'Threat intelligence report generation'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Email Intelligence V361-V365
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five breakthrough engines that transform email into a predictive, intelligent, 
            and secure communication platform
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="text-sm font-semibold">✓ All engines enforce reply-all for multi-recipient emails</span>
          </div>
        </div>

        <div className="grid gap-8 max-w-7xl mx-auto">
          {engines.map((engine, idx) => (
            <div
              key={engine.version}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:flex">
                <div className={`lg:w-1/3 bg-gradient-to-br ${engine.color} p-8 text-white flex flex-col justify-center`}>
                  <div className="text-6xl mb-4">{engine.icon}</div>
                  <h3 className="text-3xl font-bold mb-2">{engine.version}</h3>
                  <p className="text-xl font-semibold">{engine.name}</p>
                </div>
                <div className="lg:w-2/3 p-8">
                  <p className="text-gray-700 text-lg mb-6">{engine.description}</p>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                      Key Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {engine.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1 flex-shrink-0">✓</span>
                          <span className="text-gray-700">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Email Intelligence?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join 10,000+ companies using Zion Tech Group's AI-powered email platform
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

export default V361V365Showcase;
