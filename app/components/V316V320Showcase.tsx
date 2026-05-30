import React from 'react';

const V316V320Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V316',
      name: 'Email Persona Manager',
      icon: '🎭',
      description: 'Create and switch between professional personas (executive, technical, sales, support, legal) with consistent voice, vocabulary, and response patterns.',
      features: [
        '5 Professional Personas',
        'Auto-Context Detection',
        'Vocabulary Matching',
        'Tone Consistency Enforcement',
        'Brand Voice Alignment'
      ],
      benefits: [
        'Maintain consistent brand voice across all communications',
        'Automatically adapt tone based on recipient and context',
        'Ensure vocabulary matches professional persona',
        'Reduce tone-related miscommunications by 90%'
      ]
    },
    {
      version: 'V317',
      name: 'Email ROI Calculator',
      icon: '🧮',
      description: 'Track the monetary value of every email conversation, calculate time-to-value, measure deal influence by stage, and report ROI by team/person.',
      features: [
        'Deal Stage Tracking',
        'Time Cost Calculation',
        'Influence Attribution',
        'Team ROI Reports',
        'Value-per-Email Metrics'
      ],
      benefits: [
        'Measure email ROI precisely with dollar attribution',
        'Track deal influence across sales stages',
        'Optimize time investment in email communications',
        'Report email value to stakeholders'
      ]
    },
    {
      version: 'V318',
      name: 'Email Forensics Analyzer',
      icon: '🔬',
      description: 'Deep forensic analysis of email headers, DKIM/SPF/DMARC validation, timeline reconstruction, spoofing detection, and evidence chain for legal compliance.',
      features: [
        'Header Analysis',
        'DKIM/SPF/DMARC Validation',
        'Timeline Reconstruction',
        'Spoofing Detection',
        'Evidence Chain Building'
      ],
      benefits: [
        'Detect email spoofing with 99% accuracy',
        'Validate email authenticity for legal purposes',
        'Build defensible evidence chains',
        'Prevent fraud and phishing attacks'
      ]
    },
    {
      version: 'V319',
      name: 'Email Federation Hub',
      icon: '🌐',
      description: 'Unified inbox across Gmail, Outlook, ProtonMail, and custom domains with cross-platform search, unified threading, and synchronized labels.',
      features: [
        'Multi-Provider Support',
        'Unified Inbox',
        'Cross-Platform Search',
        'Unified Threading',
        'Label Synchronization'
      ],
      benefits: [
        'One inbox for all email accounts',
        'Search across all providers simultaneously',
        'Unified conversation threads across platforms',
        'Simplified multi-account email management'
      ]
    },
    {
      version: 'V320',
      name: 'Email Workflow Marketplace',
      icon: '🧩',
      description: 'Pre-built email workflow templates (sales outreach, support triage, executive briefing, onboarding, renewals) that can be customized and shared.',
      features: [
        '5+ Workflow Templates',
        'Custom Workflow Builder',
        'Team Sharing',
        'Auto-Execution',
        'Success Metrics Tracking'
      ],
      benefits: [
        'Automate email sequences and follow-ups',
        'Standardize processes across teams',
        'Share best practices organization-wide',
        'Track workflow performance and optimize'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-6">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Email Intelligence V43
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five revolutionary email engines that transform how organizations communicate, 
            measure value, ensure security, unify platforms, and automate workflows.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-indigo-600">112</span>
              <span className="text-gray-600 ml-1">Total Engines</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold text-indigo-600">1,558</span>
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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{engine.icon}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {engine.version}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{engine.name}</h3>
                <p className="text-indigo-100 text-sm">{engine.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
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
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {engine.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-purple-600 mr-2">→</span>
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
              Ready to Transform Your Email Intelligence?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of organizations using Zion Tech Group's email intelligence platform 
              to communicate more effectively, measure ROI, ensure security, and automate workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
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
            <div className="text-3xl font-bold text-indigo-600 mb-2">112</div>
            <div className="text-sm text-gray-600">Email Engines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">1,558</div>
            <div className="text-sm text-gray-600">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Autonomous Operation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V316V320Showcase;
