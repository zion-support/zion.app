'use client';

import { useState } from 'react';
import Link from 'next/link';

const engines = [
  {
    version: 'V491',
    name: 'Sentiment Trajectory Predictor',
    icon: '📈',
    color: 'from-purple-600 to-indigo-700',
    description: 'Predicts emotional direction of email threads BEFORE escalation happens',
    features: ['72-hour sentiment prediction', 'Crisis prevention alerts', 'Relationship health scoring', 'Emotional momentum tracking'],
    price: '$89/month',
    impact: 'Prevent 80% of escalations'
  },
  {
    version: 'V492',
    name: 'Meeting Intelligence Hub',
    icon: '🗓️',
    color: 'from-blue-600 to-cyan-700',
    description: 'Auto-extracts meetings, prepares agendas, generates follow-ups, tracks action items',
    features: ['Meeting detection', 'Agenda extraction', 'Action item tracking', 'Minutes generation'],
    price: '$99/month',
    impact: 'Save 5+ hours/week on meeting admin'
  },
  {
    version: 'V493',
    name: 'Knowledge Graph Builder',
    icon: '🧠',
    color: 'from-emerald-600 to-teal-700',
    description: 'Maps relationships between people, projects, topics, and decisions from email communications',
    features: ['Entity extraction', 'Relationship mapping', 'Expertise identification', 'Knowledge gap detection'],
    price: '$119/month',
    impact: 'Accelerate onboarding by 60%'
  },
  {
    version: 'V494',
    name: 'Priority Decay Engine',
    icon: '⚡',
    color: 'from-orange-600 to-red-700',
    description: 'Dynamically adjusts email priorities based on time, context, deadlines, and business impact',
    features: ['Time-decay calculation', 'Deadline escalation', 'SLA compliance', 'Priority fatigue prevention'],
    price: '$99/month',
    impact: 'Never miss critical deadlines'
  },
  {
    version: 'V495',
    name: 'Compliance Guardian Pro',
    icon: '🛡️',
    color: 'from-rose-600 to-pink-700',
    description: 'Multi-framework compliance checking for GDPR, HIPAA, SOX, PCI-DSS, CCPA, and more',
    features: ['8 compliance frameworks', 'PII detection (12+ categories)', 'Auto-masking', 'Audit trail generation'],
    price: '$149/month',
    impact: 'Prevent costly compliance violations'
  }
];

export default function V491V495Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold mb-4">
            🚀 NEW: V491-V495 Email Intelligence Engines
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Next-Generation Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            5 cutting-edge AI engines that predict sentiment trajectories, build knowledge graphs,
            enforce compliance, and dynamically manage priorities — all with <strong>reply-all enforcement</strong>
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map((e, i) => (
            <button
              key={e.version}
              onClick={() => setActiveEngine(i)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeEngine === i
                  ? `bg-gradient-to-r ${e.color} text-white shadow-lg scale-105`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {e.icon} {e.version}
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className={`bg-gradient-to-r ${engine.color} rounded-2xl p-8 mb-8 shadow-2xl`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">
                {engine.icon} {engine.name}
              </h3>
              <p className="text-lg opacity-90 mb-4">{engine.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold">{engine.price}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {engine.impact}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {engine.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    ✅ {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-3">🔑 Key Capabilities</h4>
              <ul className="space-y-2">
                {engine.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">●</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">
                  <strong>✅ Reply-All Enforcement:</strong> All engines automatically
                  reply to ALL recipients ensuring complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">295+</div>
            <div className="text-sm text-gray-400">Email Engines</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">2,221+</div>
            <div className="text-sm text-gray-400">Total Services</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-gray-400">Reply-All Rate</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">8</div>
            <div className="text-sm text-gray-400">Compliance Frameworks</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-400">72h</div>
            <div className="text-sm text-gray-400">Prediction Window</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Email Intelligence?</h3>
            <p className="text-gray-200 mb-4">Contact us for a free demo of V491-V495 engines</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>📞 +1 302 464 0950</span>
              <span>✉️ kleber@ziontechgroup.com</span>
              <span>📍 364 E Main St STE 1008, Middletown DE 19709</span>
            </div>
            <div className="mt-4">
              <Link href="/services" className="inline-block px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Explore All Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
