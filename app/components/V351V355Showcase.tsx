'use client';

import { useState } from 'react';

export default function V351V355Showcase() {
  const [activeTab, setActiveTab] = useState('calendar');

  const engines = {
    calendar: {
      name: 'V351: Calendar Intelligence',
      icon: '📅',
      description: 'Auto-detect meeting requests, suggest optimal times, detect timezone conflicts, and generate agendas',
      features: [
        'Meeting intent detection from email text',
        'Optimal time suggestions based on participants',
        'Timezone conflict detection across global teams',
        'Auto-generated meeting agendas from context',
        'Duration estimation from meeting type',
      ],
      benefits: [
        'Eliminate scheduling back-and-forth',
        'Reduce no-shows by 60%',
        'Global timezone coordination',
        'Save 5+ hours per week',
      ],
    },
    revenue: {
      name: 'V352: Revenue Attribution',
      icon: '💰',
      description: 'Track revenue impact of emails, attribute deals to touchpoints, calculate ROI, predict closure probability',
      features: [
        'Revenue signal detection (budget, pricing, contracts)',
        'Deal stage classification (prospect → closed)',
        'Closure probability prediction with ML',
        'Email ROI calculation per thread',
        'Attribution weighting by deal stage',
      ],
      benefits: [
        'Quantify email impact on revenue',
        'Predict deal outcomes accurately',
        'Optimize sales email strategy',
        'Data-driven sales decisions',
      ],
    },
    competitive: {
      name: 'V353: Competitive Intelligence',
      icon: '🏆',
      description: 'Detect competitor mentions, extract pricing signals, flag threats, generate win strategies',
      features: [
        'Competitor mention detection in emails',
        'Pricing intelligence extraction',
        'Threat level assessment (low/medium/high)',
        'Win strategy generation per threat level',
        'Urgency-based response timing',
      ],
      benefits: [
        'Stay ahead of competitors',
        'Win 25% more competitive deals',
        'Early threat detection',
        'Strategic response planning',
      ],
    },
    emotional: {
      name: 'V354: Emotional Resonance',
      icon: '❤️',
      description: 'Analyze emotional impact of drafts, suggest tone adjustments, optimize for relationship building',
      features: [
        'Draft emotional profiling (positive/negative)',
        'Incoming sentiment analysis',
        'Tone issue detection (too formal/casual/aggressive)',
        'Relationship impact assessment',
        'Quality scoring 1-10 with suggestions',
      ],
      benefits: [
        'Improve response quality by 50%',
        'Strengthen client relationships',
        'Prevent tone-deaf responses',
        'Build trust and rapport consistently',
      ],
    },
    knowledge: {
      name: 'V355: Knowledge Distillation',
      icon: '🧬',
      description: 'Extract institutional knowledge from emails, build FAQ, identify gaps, generate training materials',
      features: [
        'Knowledge extraction (procedures, policies, tips)',
        'FAQ auto-generation from repeated questions',
        'Knowledge gap identification',
        'Training material generation',
        'Expertise mapping across team members',
      ],
      benefits: [
        'Capture institutional knowledge',
        'Reduce onboarding time by 60%',
        'Eliminate knowledge silos',
        'Auto-build documentation',
      ],
    },
  };

  const currentEngine = engines[activeTab as keyof typeof engines];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Email Intelligence V351-V355
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five breakthrough engines: Calendar Intelligence, Revenue Attribution,
            Competitive Intelligence, Emotional Resonance, and Knowledge Distillation.
            All enforce <strong>reply-all</strong> for multi-recipient emails.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(engines).map(([key, engine]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{engine.icon}</span>
              {engine.name.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
          <div className="flex items-start mb-6">
            <span className="text-5xl mr-4">{currentEngine.icon}</span>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{currentEngine.name}</h3>
              <p className="text-lg text-gray-600">{currentEngine.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-emerald-600 mb-4">✨ Key Features</h4>
              <ul className="space-y-3">
                {currentEngine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-teal-600 mb-4">💼 Business Benefits</h4>
              <ul className="space-y-3">
                {currentEngine.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">★</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-3">🔒 Reply-All Enforcement</h4>
            <p className="text-gray-700">
              All V351-V355 engines detect multi-recipient emails and enforce reply-all
              to ensure all stakeholders stay informed — preventing communication gaps.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-emerald-600 mb-2">5</div>
            <div className="text-gray-600">New AI Engines</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-teal-600 mb-2">26</div>
            <div className="text-gray-600">New Services Added</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-cyan-600 mb-2">1,740</div>
            <div className="text-gray-600">Total Services</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">157</div>
            <div className="text-gray-600">Email Engines</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Email Intelligence?</h3>
            <p className="text-lg mb-6">Contact Zion Tech Group today for a personalized demo</p>
            <div className="space-y-2 text-left">
              <p>📱 <strong>Mobile:</strong> +1 302 464 0950</p>
              <p>✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p>📍 <strong>Address:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
