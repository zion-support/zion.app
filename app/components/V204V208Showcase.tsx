"use client";
import React from 'react';

const V204V208Showcase = () => {
  const engines = [
    {
      version: 'V204',
      icon: '🚨',
      title: 'Priority Escalation Engine',
      description: 'Detects urgent threads via sentiment decay, response delays, executive mentions, and deadline proximity. 5-level escalation from Normal to Critical.',
      keyFeature: 'Sentiment decay tracking across message threads',
      price: 'From $399/mo',
    },
    {
      version: 'V205',
      icon: '🧠',
      title: 'Knowledge Extraction Engine',
      description: 'Extracts decisions, action items, deadlines, commitments, and metrics from every email into a searchable knowledge base.',
      keyFeature: 'Automatic organizational knowledge building',
      price: 'From $349/mo',
    },
    {
      version: 'V206',
      icon: '🕸️',
      title: 'Stakeholder Relationship Mapper',
      description: 'Maps org relationships from email patterns. Identifies decision-makers, influencers, gatekeepers, and champions with influence scoring.',
      keyFeature: 'Communication cluster detection & influence scoring',
      price: 'From $449/mo',
    },
    {
      version: 'V207',
      icon: '⭐',
      title: 'Response Quality Grader',
      description: 'Grades draft emails on clarity, tone, completeness, actionability, and professionalism before sending. A+ to F grading with improvement tips.',
      keyFeature: 'Real-time quality scoring with rewrite suggestions',
      price: 'From $199/mo',
    },
    {
      version: 'V208',
      icon: '⚙️',
      title: 'Workflow Automation Engine',
      description: 'Detects repetitive email patterns and auto-creates workflow rules, smart templates, auto-responses, and routing logic.',
      keyFeature: 'Learns from history to automate 80% of repetitive emails',
      price: 'From $449/mo',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-4">
            🆕 NEW — Email Intelligence V20
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            V204–V208: Next-Generation Email AI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            5 breakthrough engines that analyze every email case-by-case, take the most appropriate action,
            and <strong className="text-yellow-300">always enforce reply-all</strong> for multi-recipient messages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine) => (
            <div key={engine.version} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{engine.icon}</span>
                <div>
                  <span className="text-blue-400 text-sm font-mono">{engine.version}</span>
                  <h3 className="text-white font-bold text-lg">{engine.title}</h3>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">{engine.description}</p>
              <p className="text-green-400 text-sm font-semibold">✨ {engine.keyFeature}</p>
              <p className="text-yellow-300 text-sm mt-2 font-semibold">{engine.price}</p>
            </div>
          ))}
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
            <span className="text-3xl">👑</span>
            <h3 className="text-white font-bold text-lg mt-2">Ultra Suite Bundle</h3>
            <p className="text-gray-300 text-sm mt-2">All 5 engines unified into one powerful platform. Complete email intelligence with guaranteed reply-all enforcement.</p>
            <p className="text-yellow-300 text-sm mt-3 font-bold">From $1,499/mo</p>
            <a href="/services/ai-email-ultra-suite-v204-v208" className="inline-block mt-3 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold text-sm hover:bg-yellow-400 transition">
              Learn More →
            </a>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🔒 Every Engine Guarantees:</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4">
              <span className="text-2xl">✅</span>
              <p className="text-white font-semibold mt-2">Case-by-Case Analysis</p>
              <p className="text-gray-400 text-sm">Every email analyzed individually</p>
            </div>
            <div className="p-4">
              <span className="text-2xl">📨</span>
              <p className="text-white font-semibold mt-2">Reply-All Enforcement</p>
              <p className="text-gray-400 text-sm">Never miss a recipient again</p>
            </div>
            <div className="p-4">
              <span className="text-2xl">🤖</span>
              <p className="text-white font-semibold mt-2">AI-Powered Intelligence</p>
              <p className="text-gray-400 text-sm">Continuously learning & improving</p>
            </div>
            <div className="p-4">
              <span className="text-2xl">🏢</span>
              <p className="text-white font-semibold mt-2">Enterprise Security</p>
              <p className="text-gray-400 text-sm">SOC2, GDPR, HIPAA compliant</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-gray-300 mb-4">Ready to transform your email intelligence?</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-400 transition mr-4">
              Contact Us →
            </a>
            <a href="/services" className="inline-block px-8 py-3 border border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition">
              Browse All Services
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            📞 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com | 📍 364 E Main St STE 1008, Middletown DE 19709
          </p>
        </div>
      </div>
    </section>
  );
};

export default V204V208Showcase;
