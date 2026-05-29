'use client';

import { useState } from 'react';

export default function EmailCoachingShowcase() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'benefits'>('overview');

  const features = [
    {
      icon: '🎯',
      title: 'Case-by-Case Analysis',
      description: 'Each email analyzed individually for optimal response'
    },
    {
      icon: '✅',
      title: 'Reply-All Validation',
      description: 'Guaranteed compliance, never miss a recipient'
    },
    {
      icon: '📊',
      title: '6-Dimension Scoring',
      description: 'Clarity, empathy, professionalism, and more'
    },
    {
      icon: '💡',
      title: 'Real-Time Suggestions',
      description: 'Get coaching while you write'
    },
    {
      icon: '🎓',
      title: 'Training Modules',
      description: '6 interactive courses, beginner to advanced'
    },
    {
      icon: '🏆',
      title: 'Certification Program',
      description: 'Bronze to Platinum skill levels'
    },
  ];

  const benefits = [
    { metric: '50%', label: 'Email Quality Improvement' },
    { metric: '30%', label: 'Faster Response Times' },
    { metric: '90%', label: 'Response Quality Score' },
    { metric: '100%', label: 'Reply-All Compliance' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🎓</span>
            <span className="text-purple-300 font-semibold text-sm">NEW: V84 Email Intelligence Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Email Coaching &<br />Training Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your email communication with AI-powered coaching. Get real-time suggestions, 
            track your progress, and achieve professional certification.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'features'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'benefits'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Benefits
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Intelligent Email Analysis & Coaching
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="text-purple-400">V83 Case-by-Case Analysis:</strong> Every email is examined 
                    individually to determine the most appropriate action, validate reply-all, and ensure optimal 
                    response quality.
                  </p>
                  <p>
                    <strong className="text-purple-400">V84 Coaching Platform:</strong> Get personalized coaching 
                    based on your communication patterns. Track 6 skill dimensions and earn professional certification.
                  </p>
                  <p>
                    <strong className="text-purple-400">Real-Time Assistance:</strong> Receive intelligent suggestions 
                    while composing emails to improve clarity, empathy, professionalism, and effectiveness.
                  </p>
                </div>
                <div className="mt-8 flex gap-4">
                  <a
                    href="/services/ai-email-coaching-platform"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
                  >
                    Learn More →
                  </a>
                  <a
                    href="/contact"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/20"
                  >
                    Get Demo
                  </a>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📧</div>
                    <div>
                      <div className="text-sm text-purple-400 font-semibold mb-1">Incoming Email</div>
                      <div className="text-gray-300 text-sm bg-black/30 rounded-lg p-3">
                        "We need help with our AI implementation urgently..."
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-purple-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <div className="text-sm text-blue-400 font-semibold mb-1">AI Analysis</div>
                      <div className="text-gray-300 text-sm bg-black/30 rounded-lg p-3 space-y-1">
                        <div>✓ Category: <span className="text-yellow-400">Support Request</span></div>
                        <div>✓ Priority: <span className="text-red-400">High (Urgent)</span></div>
                        <div>✓ Sentiment: <span className="text-orange-400">Frustrated</span></div>
                        <div>✓ Action: <span className="text-green-400">Reply All</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-blue-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">✨</div>
                    <div>
                      <div className="text-sm text-green-400 font-semibold mb-1">Optimized Response</div>
                      <div className="text-gray-300 text-sm bg-black/30 rounded-lg p-3">
                        Quality Score: <span className="text-green-400 font-bold">0.92/1.00</span>
                        <div className="text-xs mt-1 text-gray-400">
                          Empathy: ✓ | Professionalism: ✓ | Action Items: ✓
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                      {benefit.metric}
                    </div>
                    <div className="text-gray-300 text-sm">{benefit.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  What You'll Achieve
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">Guaranteed Reply-All Compliance</div>
                        <div className="text-gray-400 text-sm">Never miss a recipient again</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">Professional Certification</div>
                        <div className="text-gray-400 text-sm">Bronze to Platinum skill levels</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">6 Interactive Training Modules</div>
                        <div className="text-gray-400 text-sm">Beginner to advanced courses</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">Real-Time Coaching</div>
                        <div className="text-gray-400 text-sm">Get suggestions while you write</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">Performance Analytics</div>
                        <div className="text-gray-400 text-sm">Track progress over time</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 text-xl mt-1">✓</div>
                      <div>
                        <div className="text-white font-semibold">Smart Templates</div>
                        <div className="text-gray-400 text-sm">50+ AI-powered email templates</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Email Communication?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of professionals who have improved their email skills with our AI coaching platform.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services/ai-email-coaching-platform"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50 inline-flex items-center justify-center gap-2"
              >
                <span>Start Free Trial</span>
                <span>→</span>
              </a>
              <a
                href="tel:+13024640950"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-all border border-white/20 inline-flex items-center justify-center gap-2"
              >
                <span>📞</span>
                <span>+1 302 464 0950</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              📧 kleber@ziontechgroup.com | 📍 364 E Main St STE 1008, Middletown, DE 19709
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
