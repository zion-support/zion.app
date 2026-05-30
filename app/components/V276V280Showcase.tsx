import React from 'react';

const V276V280Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V276',
      name: 'Email Localization Engine',
      icon: '🌐',
      description: 'Automatically translate emails to recipient preferred languages with cultural context adaptation and locale-specific formatting.',
      features: ['Multi-language translation', 'Cultural context adaptation', 'Locale-specific formatting', 'Reply-all enforcement'],
      benefits: ['Reach global audiences', 'Respect cultural nuances', 'Professional localization', 'Consistent communication']
    },
    {
      version: 'V277',
      name: 'Email Template Intelligence',
      icon: '📝',
      description: 'AI-powered template suggestions with dynamic content personalization and performance analytics.',
      features: ['Smart template suggestions', 'Dynamic personalization', 'Performance tracking', 'Reply-all enforcement'],
      benefits: ['Save time with smart templates', 'Increase engagement', 'Data-driven optimization', 'Consistent branding']
    },
    {
      version: 'V278',
      name: 'Email Automation Orchestrator',
      icon: '🔄',
      description: 'Orchestrate complex email workflows with multi-step automation and conditional logic.',
      features: ['Multi-step workflows', 'Conditional logic', 'CRM integration', 'Reply-all enforcement'],
      benefits: ['Automate complex processes', 'Reduce manual work', 'Integrate with CRM', 'Scale operations']
    },
    {
      version: 'V279',
      name: 'Email Design Optimizer',
      icon: '🎨',
      description: 'AI-powered design optimization for mobile responsiveness and accessibility compliance.',
      features: ['Mobile optimization', 'Accessibility compliance', 'Design recommendations', 'Reply-all enforcement'],
      benefits: ['Perfect mobile experience', 'WCAG compliance', 'Better engagement', 'Professional design']
    },
    {
      version: 'V280',
      name: 'Email Predictive Analytics',
      icon: '📈',
      description: 'Predict email outcomes with ML-powered analytics for open rates, response times, and churn risk.',
      features: ['Outcome prediction', 'Churn risk detection', 'Revenue attribution', 'Reply-all enforcement'],
      benefits: ['Predict campaign success', 'Identify at-risk customers', 'Optimize ROI', 'Data-driven decisions']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Email Intelligence Engines V276-V280
          </h2>
          <p className="text-xl text-gray-600">
            Advanced AI-powered email intelligence with case-by-case analysis and mandatory reply-all enforcement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {engines.map((engine) => (
            <div
              key={engine.version}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{engine.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-purple-600">{engine.version}</span>
                  <h3 className="text-xl font-bold text-gray-900">{engine.name}</h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{engine.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                <ul className="space-y-1">
                  {engine.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Benefits:</h4>
                <ul className="space-y-1">
                  {engine.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">★</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎯 Case-by-Case Analysis + Reply-All Enforcement
            </h3>
            <p className="text-gray-600 max-w-3xl">
              All V276-V280 engines analyze each email individually and take the most appropriate action. 
              When replying to multi-recipient emails, reply-all is automatically enforced to ensure 
              all stakeholders stay informed.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/services"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg"
          >
            Explore All 1,347 Services →
          </a>
        </div>
      </div>
    </section>
  );
};

export default V276V280Showcase;
