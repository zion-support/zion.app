'use client';
import React from 'react';

export default function V461V465Showcase() {
  const engines = [
    { version: 'V461', name: 'Signature Manager', icon: '✍️', desc: 'Dynamic branded signatures with tracking and compliance', features: ['Brand consistency', 'Tracking pixels', 'Legal disclaimers', 'A/B testing'] },
    { version: 'V462', name: 'Unsubscribe Manager', icon: '🚫', desc: 'Smart unsubscribe handling with GDPR/CCPA compliance', features: ['Auto-unsubscribe', 'List hygiene', 'Preference center', 'Compliance'] },
    { version: 'V463', name: 'Forwarding Intelligence', icon: '🔀', desc: 'Smart email routing based on content and expertise', features: ['Content routing', 'Expertise matching', 'Chain prevention', 'Auto-forwarding'] },
    { version: 'V464', name: 'Archival Intelligence', icon: '🗄️', desc: 'Smart archiving with retention policies and search', features: ['Smart archiving', 'Retention policies', 'Searchable tags', 'Compliance'] },
    { version: 'V465', name: 'Accessibility Checker', icon: '♿', desc: 'Ensures emails are accessible to all recipients', features: ['WCAG 2.1', 'Screen reader', 'Alt text', 'Color contrast'] }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">🚀 Latest: V461-V465 Email Intelligence</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Five new AI engines for signature management, unsubscribe handling, smart routing, archival, and accessibility</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {engines.map((e, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">{e.icon}</div>
              <div className="inline-block px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded-full mb-2">{e.version}</div>
              <h3 className="text-lg font-bold text-white mb-2">{e.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{e.desc}</p>
              <ul className="space-y-1">{e.features.map((f, fi) => (
                <li key={fi} className="text-gray-300 text-xs flex items-start"><span className="text-green-400 mr-1">✓</span>{f}</li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Upgrade Your Email?</h3>
            <div className="space-y-2 text-left text-gray-200">
              <p>📞 +1 302 464 0950</p>
              <p>✉️ kleber@ziontechgroup.com</p>
              <p>📍 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
