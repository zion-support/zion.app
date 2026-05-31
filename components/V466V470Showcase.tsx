'use client';
import React from 'react';

export default function V466V470Showcase() {
  const engines = [
    { version: 'V466', name: 'Encryption Engine', icon: '🔐', desc: 'End-to-end encryption for sensitive emails with PGP/S/MIME support', features: ['Auto-encryption', 'Sensitive data detection', 'PGP/S/MIME', 'Compliance logging'] },
    { version: 'V467', name: 'Scheduling Pro', icon: '⏰', desc: 'Advanced AI scheduling with optimal timing and timezone coordination', features: ['Optimal timing', 'Timezone coordination', 'Behavior analysis', 'Calendar sync'] },
    { version: 'V468', name: 'Analytics Dashboard', icon: '📊', desc: 'Real-time email performance metrics with AI insights', features: ['Real-time metrics', 'AI insights', 'Engagement scoring', 'Trend analysis'] },
    { version: 'V469', name: 'Template AI', icon: '📝', desc: 'AI-powered email template generation with personalization', features: ['AI generation', 'Personalization', 'A/B variants', 'Best practices'] },
    { version: 'V470', name: 'Collaboration Hub', icon: '👥', desc: 'Team email collaboration with shared inbox and workflows', features: ['Shared inbox', 'Team comments', 'Task assignments', 'Workflow tracking'] }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">🚀 Latest: V466-V470 Email Intelligence</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Five powerful new engines: Encryption, Scheduling, Analytics, Templates, and Collaboration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {engines.map((e, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="text-4xl mb-3">{e.icon}</div>
              <div className="inline-block px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-2">{e.version}</div>
              <h3 className="text-lg font-bold text-white mb-2">{e.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{e.desc}</p>
              <ul className="space-y-1">{e.features.map((f, fi) => (
                <li key={fi} className="text-gray-300 text-xs flex items-start"><span className="text-green-400 mr-1">✓</span>{f}</li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🎯 Why These Engines Matter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h4 className="text-white font-semibold">Secure</h4>
                <p className="text-gray-300 text-sm">End-to-end encryption protects sensitive data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="text-white font-semibold">Optimal Timing</h4>
                <p className="text-gray-300 text-sm">40% increase in response rates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="text-white font-semibold">Data-Driven</h4>
                <p className="text-gray-300 text-sm">Real-time analytics and AI insights</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="text-white font-semibold">Collaborative</h4>
                <p className="text-gray-300 text-sm">50% faster team response times</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Email Workflow?</h3>
            <div className="space-y-2 text-left text-gray-200">
              <p>📞 <strong>Call:</strong> +1 302 464 0950</p>
              <p>✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p>📍 <strong>Visit:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
