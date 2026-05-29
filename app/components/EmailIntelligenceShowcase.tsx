// app/components/EmailIntelligenceShowcase.tsx
'use client';

import { useState } from 'react';

interface Feature {
  id: string;
  version: string;
  title: string;
  description: string;
  capabilities: string[];
  benefits: string[];
  icon: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 'v89',
    version: 'V89',
    title: 'Case-by-Case Context Analysis',
    description: 'Deep AI understanding of every email with intelligent routing and action determination',
    capabilities: [
      'Multi-factor urgency assessment (Critical/High/Medium/Low/Informational)',
      'Complexity scoring (Simple/Moderate/Complex/Escalation)',
      'Automatic action determination (Reply/Forward/Escalate/Delegate)',
      'Smart routing to appropriate team members',
      'Thread-aware processing with conversation history',
      'Relationship context integration',
      'Sentiment analysis and intent extraction',
      'Confidence scoring for every decision',
    ],
    benefits: [
      '95% accurate email categorization',
      'Automatic priority handling',
      'Never miss critical emails again',
      'Smart delegation to specialists',
      'Context-aware responses',
    ],
    icon: '🎯',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'v90',
    version: 'V90',
    title: 'Smart Reply-All Intelligence',
    description: 'Advanced recipient management with safety checks and privacy protection',
    capabilities: [
      'Intelligent recipient classification (Primary/CC/BCC/Exclude)',
      'Reply-all safety checks (prevent embarrassing mistakes)',
      'Thread pruning (remove people who don\'t need to stay)',
      'BCC optimization for privacy protection',
      'Escalation auto-addition for sensitive content',
      'Domain-based routing rules',
      'Interaction history tracking',
      '100% reply-all enforcement (your critical requirement)',
    ],
    benefits: [
      'Never accidentally exclude important team members',
      'Protect sensitive information from wrong recipients',
      'Automatic escalation for legal/compliance issues',
      'Clean, professional email threads',
      'Privacy-first approach with smart BCC',
    ],
    icon: '👥',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'v91',
    version: 'V91',
    title: 'Response Quality Auto-Improvement',
    description: 'Self-learning system that continuously improves through feedback and A/B testing',
    capabilities: [
      'Automatic response quality scoring (0-100)',
      'Feedback collection and pattern analysis',
      'A/B testing of response variants',
      'Template evolution and optimization',
      'Correction learning from manual edits',
      'Quality trend tracking by category',
      'Continuous improvement suggestions',
      'Performance analytics dashboard',
    ],
    benefits: [
      'Responses get better over time',
      'Data-driven template optimization',
      'Learn from every interaction',
      'Consistent quality across all communications',
      'Measurable improvement metrics',
    ],
    icon: '📈',
    color: 'from-green-500 to-emerald-600',
  },
];

export default function EmailIntelligenceShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<Feature>(features[0]);
  const [activeTab, setActiveTab] = useState<'capabilities' | 'benefits'>('capabilities');

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Next-Generation Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            V89, V90 & V91: The most advanced AI email processing system that analyzes every email case-by-case,
            always replies all, and continuously improves itself
          </p>
        </div>

        {/* Feature Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedFeature.id === feature.id
                  ? `border-white bg-gradient-to-br ${feature.color} shadow-2xl scale-105`
                  : 'border-gray-700 bg-slate-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <div className="text-sm font-semibold text-gray-400 mb-1">{feature.version}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </button>
          ))}
        </div>

        {/* Feature Details */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{selectedFeature.icon}</span>
            <div>
              <div className="text-sm font-semibold text-gray-400">{selectedFeature.version}</div>
              <h3 className="text-3xl font-bold text-white">{selectedFeature.title}</h3>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-4 mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('capabilities')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'capabilities'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'benefits'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Benefits
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === 'capabilities' ? (
              selectedFeature.capabilities.map((capability, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-green-400 text-xl mt-0.5">✓</span>
                  <span className="text-gray-300">{capability}</span>
                </div>
              ))
            ) : (
              selectedFeature.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl mt-0.5">★</span>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-gray-400">Categorization Accuracy</div>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Reply-All Enforcement</div>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Autonomous Operation</div>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-xl">
            <div className="text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-gray-400">Self-Improvement</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8">
            <h4 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Email Workflow?
            </h4>
            <p className="text-gray-200 mb-6">
              Contact us to implement these intelligent email solutions for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-left">
              <div className="text-white">
                <div className="font-semibold">📞 Phone:</div>
                <div>+1 302 464 0950</div>
              </div>
              <div className="text-white">
                <div className="font-semibold">✉️ Email:</div>
                <div>kleber@ziontechgroup.com</div>
              </div>
              <div className="text-white">
                <div className="font-semibold">📍 Address:</div>
                <div>364 E Main St STE 1008, Middletown, DE 19709</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
