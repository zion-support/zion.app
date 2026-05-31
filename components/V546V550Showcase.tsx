'use client';

import React from 'react';

export default function V546V550Showcase() {
  const engines = [
    {
      version: 'V546',
      name: 'Predictive Email Routing',
      icon: '🔀',
      description: 'ML-powered routing that analyzes email content and automatically directs to the optimal team member with 95%+ accuracy',
      features: ['ML content analysis', 'Auto-routing to teams', 'Priority detection', 'SLA estimation'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      version: 'V547',
      name: 'Customer Lifetime Value Predictor',
      icon: '💎',
      description: 'AI engine that calculates CLV from email engagement patterns and predicts future revenue potential',
      features: ['CLV calculation', 'Engagement scoring', 'Purchase intent detection', 'Segment classification'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      version: 'V548',
      name: 'Churn Prevention Engine',
      icon: '🛡️',
      description: 'Proactive churn detection from email patterns with automated retention actions and risk scoring',
      features: ['Churn risk scoring', 'Negative signal detection', 'Competitor mention alerts', 'Retention automation'],
      color: 'from-red-500 to-orange-500'
    },
    {
      version: 'V549',
      name: 'Multi-Channel Orchestrator',
      icon: '🌐',
      description: 'Unified communication platform coordinating email, Slack, Teams, and SMS for seamless engagement',
      features: ['Multi-channel coordination', 'Urgency-based routing', 'Escalation paths', 'Timeline management'],
      color: 'from-green-500 to-teal-500'
    },
    {
      version: 'V550',
      name: 'Executive Dashboard Generator',
      icon: '📊',
      description: 'Auto-generates C-suite summaries from email communications with key metrics and actionable recommendations',
      features: ['Auto executive summaries', 'KPI dashboards', 'Risk indicators', 'Opportunity identification'],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const services = [
    { name: 'Predictive Email Routing AI', category: 'AI', price: '$59-$449/mo', icon: '🔀' },
    { name: 'Customer Lifetime Value Predictor', category: 'AI', price: '$79-$599/mo', icon: '💎' },
    { name: 'Churn Prevention Engine', category: 'AI', price: '$89-$649/mo', icon: '🛡️' },
    { name: 'Multi-Channel Orchestrator', category: 'Automation', price: '$99-$749/mo', icon: '🌐' },
    { name: 'Executive Dashboard Generator', category: 'Data', price: '$129-$999/mo', icon: '📊' },
    { name: 'Infrastructure Monitoring AI', category: 'IT', price: '$199-$1,499/mo', icon: '🖥️' },
    { name: 'Network Performance Optimizer', category: 'IT', price: '$149-$1,199/mo', icon: '🌍' },
    { name: 'Database Performance Tuner', category: 'IT', price: '$129-$999/mo', icon: '🗄️' },
    { name: 'AI Incident Response Platform', category: 'IT', price: '$179-$1,399/mo', icon: '🚨' },
    { name: 'IT Asset Management Pro', category: 'IT', price: '$79-$649/mo', icon: '📦' },
    { name: 'AI Proposal Generator', category: 'Micro-SaaS', price: '$49-$349/mo', icon: '📝' },
    { name: 'Contract Management AI', category: 'Micro-SaaS', price: '$59-$449/mo', icon: '📋' },
    { name: 'Knowledge Base Builder AI', category: 'Micro-SaaS', price: '$39-$299/mo', icon: '📚' },
    { name: 'Client Onboarding Automation', category: 'Micro-SaaS', price: '$29-$229/mo', icon: '🎯' },
    { name: 'AI Time Tracking & Billing', category: 'Micro-SaaS', price: '$15-$119/mo', icon: '⏱️' },
    { name: 'Threat Intelligence Platform', category: 'Security', price: '$249-$1,999/mo', icon: '🔒' },
    { name: 'SIEM Enhancement AI', category: 'Security', price: '$299-$2,299/mo', icon: '🛡️' },
    { name: 'Advanced DLP Suite', category: 'Security', price: '$199-$1,499/mo', icon: '🔐' },
    { name: 'Automated Penetration Testing', category: 'Security', price: '$399-$2,999/mo', icon: '🎯' },
    { name: 'Access Governance Platform', category: 'Security', price: '$149-$1,199/mo', icon: '👥' },
    { name: 'Multi-Cloud Management Platform', category: 'Cloud', price: '$299-$2,499/mo', icon: '☁️' },
    { name: 'Data Lake Optimizer AI', category: 'Data', price: '$199-$1,499/mo', icon: '🏊' },
    { name: 'Real-Time Stream Processing', category: 'Data', price: '$249-$1,999/mo', icon: '🌊' },
    { name: 'Data Mesh Platform', category: 'Data', price: '$349-$2,799/mo', icon: '🕸️' },
    { name: 'Edge Computing AI Platform', category: 'IoT', price: '$179-$1,399/mo', icon: '📡' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
            <span className="text-purple-300 text-sm font-semibold">🧠 LATEST INNOVATION</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Email Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">V546-V550</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            5 Advanced AI Engines • 25 New Services • 350 Total Engines • All Enforce Reply-All
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
              ✅ Case-by-Case Analysis
            </span>
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
              ✅ Reply-All Enforcement
            </span>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm">
              ✅ Autonomous & Unstoppable
            </span>
          </div>
        </div>

        {/* Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine, idx) => (
            <div
              key={engine.version}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${engine.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{engine.icon}</span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold">
                    {engine.version}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{engine.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{engine.description}</p>
                <div className="space-y-2">
                  {engine.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            25 New Services Added
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1 truncate">{service.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-300">{service.category}</span>
                      <span className="text-xs text-green-400">{service.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-6">🚀 Key Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Predictive Routing',
              'CLV Prediction',
              'Churn Prevention',
              'Multi-Channel Orchestration',
              'Executive Dashboards',
              'Case-by-Case Analysis',
              'Reply-All Enforcement',
              'Autonomous Operation'
            ].map((cap, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span>
                <span className="text-sm">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Email Intelligence?</h3>
          <p className="text-gray-300 mb-6">Get started with our advanced AI-powered email management platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:kleber@ziontechgroup.com"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📧 Contact Us
            </a>
            <a
              href="tel:+13024640950"
              className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all"
            >
              📱 Call Now
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>📱 +1 302 464 0950 | 📧 kleber@ziontechgroup.com</p>
            <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
