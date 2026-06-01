import React, { useState } from 'react';

const engines = [
  {
    version: 'V1056',
    name: 'Emotional Intelligence Engine',
    icon: '💝',
    description: 'Detect emotional states and generate empathetic responses',
    features: [
      '8 emotion detection (anger, frustration, excitement, confusion, anxiety, satisfaction, sadness, urgency)',
      'Emotional intensity scoring (0-100)',
      'Empathetic response templates',
      'De-escalation strategies',
      'Escalation risk assessment'
    ],
    useCases: [
      'Customer support de-escalation',
      'Sales relationship management',
      'Team communication optimization',
      'Crisis communication'
    ],
    color: 'from-pink-500 to-rose-600'
  },
  {
    version: 'V1057',
    name: 'Documentation Generator',
    icon: '📚',
    description: 'Automatically generate documentation from email conversations',
    features: [
      'API documentation extraction',
      'User guide generation',
      'SOP automation',
      'Knowledge base building',
      'Technical writing assistance'
    ],
    useCases: [
      'API documentation automation',
      'User manual creation',
      'Standard Operating Procedures',
      'FAQ generation',
      'Technical knowledge bases'
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    version: 'V1058',
    name: 'Accessibility Assistant',
    icon: '♿',
    description: 'Ensure WCAG 2.1 AA compliance for all email communications',
    features: [
      'WCAG 2.1 AA compliance checking',
      'Alt text validation and generation',
      'Color contrast analysis',
      'Screen reader optimization',
      'Heading structure validation'
    ],
    useCases: [
      'Accessibility compliance',
      'Inclusive design',
      'ADA compliance',
      'Screen reader optimization',
      'Color accessibility'
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    version: 'V1059',
    name: 'Reputation Guardian',
    icon: '🛡️',
    description: 'Monitor and optimize email deliverability and sender reputation',
    features: [
      'Spam trigger detection',
      'Authentication checking (SPF/DKIM/DMARC)',
      'Reputation monitoring',
      'Inbox placement prediction',
      'Blacklist monitoring'
    ],
    useCases: [
      'Email deliverability optimization',
      'Spam prevention',
      'Reputation management',
      'Authentication setup',
      'Inbox placement testing'
    ],
    color: 'from-purple-500 to-violet-600'
  },
  {
    version: 'V1060',
    name: 'Voice Assistant Integration',
    icon: '🎙️',
    description: 'Compose, read, and manage emails using voice commands',
    features: [
      'Voice-to-email composition',
      'Smart email summarization',
      'Voice search and filtering',
      'Scheduled sending via voice',
      'Multi-platform support (Siri, Alexa, Google)'
    ],
    useCases: [
      'Hands-free email management',
      'Executive briefings',
      'Accessibility support',
      'Multitasking productivity',
      'Multilingual voice support'
    ],
    color: 'from-orange-500 to-red-600'
  }
];

export default function V1056V1060Showcase() {
  const [selectedEngine, setSelectedEngine] = useState(0);
  const engine = engines[selectedEngine];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            V1056-V1060: Advanced Email Intelligence Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five new AI engines that make email communication more empathetic, accessible, 
            deliverable, documented, and voice-enabled.
          </p>
        </div>

        {/* Engine Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {engines.map((eng, idx) => (
            <button
              key={eng.version}
              onClick={() => setSelectedEngine(idx)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedEngine === idx
                  ? `bg-gradient-to-r ${eng.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <span className="text-2xl mr-2">{eng.icon}</span>
              {eng.version}
            </button>
          ))}
        </div>

        {/* Selected Engine Details */}
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden`}>
          <div className={`bg-gradient-to-r ${engine.color} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">{engine.name}</h3>
                <p className="text-xl opacity-90">{engine.description}</p>
              </div>
              <div className="text-6xl">{engine.icon}</div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Key Features
              </h4>
              <ul className="space-y-3">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Use Cases
              </h4>
              <ul className="space-y-3">
                {engine.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">→</span>
                    <span className="text-gray-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-50 p-8 text-center">
            <p className="text-lg text-gray-700 mb-4">
              Ready to enhance your email intelligence with {engine.name}?
            </p>
            <a
              href="mailto:kleber@ziontechgroup.com?subject=Inquiry: ${engine.name} (${engine.version})"
              className={`inline-block px-8 py-4 bg-gradient-to-r ${engine.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all`}
            >
              Get Started with {engine.version}
            </a>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {engines.map((eng, idx) => (
            <div
              key={eng.version}
              onClick={() => setSelectedEngine(idx)}
              className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                selectedEngine === idx
                  ? 'bg-white shadow-lg scale-105'
                  : 'bg-white/50 hover:bg-white hover:shadow'
              }`}
            >
              <div className="text-3xl mb-2">{eng.icon}</div>
              <div className="font-bold text-gray-900">{eng.version}</div>
              <div className="text-sm text-gray-600">{eng.name.split(' ')[0]}</div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Questions about these new engines? Contact us for a personalized demo.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-700">
            <a href="tel:+13024640950" className="flex items-center hover:text-blue-600">
              <span className="mr-2">📱</span> +1 302 464 0950
            </a>
            <a href="mailto:kleber@ziontechgroup.com" className="flex items-center hover:text-blue-600">
              <span className="mr-2">✉️</span> kleber@ziontechgroup.com
            </a>
            <div className="flex items-center">
              <span className="mr-2">📍</span> 364 E Main St STE 1008, Middletown DE 19709
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
