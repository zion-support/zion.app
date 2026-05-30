import React from 'react';

const V321V325Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V321',
      name: 'Sentiment Evolution Tracker',
      icon: '🎨',
      description: 'Track sentiment shifts across email threads over time, detect relationship health trends, predict churn risk, and suggest intervention timing.',
      features: [
        'Thread Sentiment Tracking',
        'Relationship Health Scoring',
        'Churn Risk Prediction',
        'Intervention Alerts',
        'Trend Analysis'
      ],
      benefits: [
        'Prevent customer churn',
        'Detect relationship issues early',
        'Improve customer satisfaction',
        'Data-driven interventions'
      ]
    },
    {
      version: 'V322',
      name: 'Predictive Response Generator',
      icon: '🔮',
      description: 'Generate contextually perfect responses using transformer models trained on your organization\'s successful email patterns.',
      features: [
        'Context-Aware Generation',
        'Tone Matching',
        'Personalization Engine',
        'Quality Scoring',
        'Pattern Learning'
      ],
      benefits: [
        '90%+ response quality',
        'Save 2+ hours daily',
        'Maintain brand voice',
        'Personalize at scale'
      ]
    },
    {
      version: 'V323',
      name: 'Analytics Dashboard Pro',
      icon: '📊',
      description: 'Real-time email performance metrics with response time tracking, engagement scoring, team productivity analytics, and predictive insights.',
      features: [
        'Response Time Metrics',
        'Engagement Scoring',
        'Team Productivity',
        'Predictive Insights',
        'Health Score'
      ],
      benefits: [
        'Improve response times by 40%',
        'Identify team bottlenecks',
        'Optimize email workflows',
        'Data-driven decisions'
      ]
    },
    {
      version: 'V324',
      name: 'Compliance Guardian Pro',
      icon: '🛡️',
      description: 'Automated compliance checking for GDPR, CCPA, HIPAA, SOX with PII detection, data retention policies, audit trails, and automatic redaction.',
      features: [
        'Multi-Framework Compliance',
        'PII Detection',
        'Auto-Redaction',
        'Audit Trails',
        'Data Retention'
      ],
      benefits: [
        '100% compliance assurance',
        'Prevent data breaches',
        'Automate audit trails',
        'Reduce legal risk'
      ]
    },
    {
      version: 'V325',
      name: 'Auto-Responder Intelligence',
      icon: '🤖',
      description: 'Smart auto-responses with context awareness, vacation mode, out-of-office scheduling, intelligent delegation, and human-like personalization.',
      features: [
        'Context-Aware Responses',
        'Vacation Mode',
        'Smart Delegation',
        'Urgent Detection',
        'Personalization'
      ],
      benefits: [
        'Never miss urgent emails',
        'Professional auto-responses',
        'Smart delegation',
        'Maintain work-life balance'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-full mb-6">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Email Intelligence V44
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five advanced email engines that master sentiment tracking, response generation, 
            analytics, compliance, and intelligent automation for enterprise communication excellence.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-cyan-600">122</span>
              <span className="text-gray-600 ml-1">Total Engines</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-cyan-600">1,584</span>
              <span className="text-gray-600 ml-1">Total Services</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-green-600">✓</span>
              <span className="text-gray-600 ml-1">Reply-All Enforced</span>
            </div>
          </div>
        </div>

        {/* Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => (
            <div
              key={engine.version}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{engine.icon}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {engine.version}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{engine.name}</h3>
                <p className="text-cyan-100 text-sm">{engine.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {engine.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {engine.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Master Email Intelligence Today
            </h3>
            <p className="text-gray-600 mb-6">
              Join forward-thinking organizations using Zion Tech Group's email intelligence platform 
              to track sentiment, generate perfect responses, ensure compliance, and automate intelligently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Get Started Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                View All Services
              </a>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">122</div>
            <div className="text-sm text-gray-600">Email Engines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">1,584</div>
            <div className="text-sm text-gray-600">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Autonomous Operation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V321V325Showcase;
