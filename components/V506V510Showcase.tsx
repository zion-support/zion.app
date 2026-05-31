'use client';

import { useState } from 'react';
import Link from 'next/link';

const engines = [
  {
    version: 'V506', name: 'A/B Testing Platform', icon: '🧪',
    color: 'from-pink-600 to-rose-700',
    description: 'Automatically splits email campaigns, tracks open/click rates, and optimizes subject lines with statistical significance testing',
    features: ['Subject line A/B variants', 'Chi-squared testing', 'Winner auto-promotion', 'Multi-variant testing'],
    price: '$109/month', impact: 'Increase open rates by 45%'
  },
  {
    version: 'V507', name: 'Data Visualization', icon: '📊',
    color: 'from-blue-600 to-indigo-700',
    description: 'Transforms email data into executive-ready charts, timelines, heatmaps, and visual reports for business intelligence',
    features: ['Thread timelines', 'Response heatmaps', 'Volume charts', 'Revenue funnels'],
    price: '$99/month', impact: 'Executive-ready reports'
  },
  {
    version: 'V508', name: 'Voice-to-Action', icon: '🎤',
    color: 'from-green-600 to-emerald-700',
    description: 'Converts voice memos into structured tasks, follow-ups, and meeting notes with NLP transcription and action extraction',
    features: ['Voice transcription', 'Action extraction', 'Task creation', 'Meeting notes'],
    price: '$119/month', impact: 'Turn voice into action'
  },
  {
    version: 'V509', name: 'Competitive Intelligence', icon: '🏆',
    color: 'from-amber-600 to-orange-700',
    description: 'Monitors competitor mentions, tracks market positioning, and generates battle cards for sales teams with 10+ competitor database',
    features: ['Competitor tracking', 'Battle cards', 'Win/loss analysis', 'Threat assessment'],
    price: '$139/month', impact: 'Win more deals'
  },
  {
    version: 'V510', name: 'Accessibility & Inclusion', icon: '♿',
    color: 'from-purple-600 to-violet-700',
    description: 'Ensures emails are WCAG accessible and inclusive with bias-free language, screen reader compatibility, and reading level assessment',
    features: ['WCAG validation', 'Bias-free language', 'Reading level', 'Inclusive terms'],
    price: '$89/month', impact: 'Inclusive communication'
  }
];

export default function V506V510Showcase() {
  const [active, setActive] = useState(0);
  const engine = engines[active];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-sm font-bold mb-4">
            🚀 V506-V510 — 310 Email Intelligence Engines
          </span>
          <h2 className="text-4xl font-bold mb-4">
            A/B Testing, Visualization, Voice AI, Competitive Intel & Accessibility
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            5 breakthrough engines for campaign optimization, data visualization, voice-to-action,
            competitive intelligence, and accessible communication — all with <strong>reply-all enforcement</strong>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {engines.map((e, i) => (
            <button key={e.version} onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                active === i ? `bg-gradient-to-r ${e.color} text-white shadow-lg scale-105` : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
              }`}>{e.icon} {e.version}</button>
          ))}
        </div>

        <div className={`bg-gradient-to-r ${engine.color} rounded-2xl p-8 mb-8 shadow-2xl`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">{engine.icon} {engine.name}</h3>
              <p className="text-lg opacity-90 mb-4">{engine.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold">{engine.price}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{engine.impact}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {engine.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">✅ {f}</span>
                ))}
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-3">🔑 Key Capabilities</h4>
              <ul className="space-y-2">
                {engine.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-green-400 mt-1">●</span><span>{f}</span></li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm"><strong>✅ Reply-All Enforcement:</strong> Every response auto-includes ALL recipients for transparency.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-pink-400">310+</div><div className="text-sm text-gray-400">Email Engines</div></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-blue-400">2,296+</div><div className="text-sm text-gray-400">Total Services</div></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-400">10+</div><div className="text-sm text-gray-400">Competitors Tracked</div></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-amber-400">8</div><div className="text-sm text-gray-400">Chart Types</div></div>
          <div className="bg-white/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-purple-400">100%</div><div className="text-sm text-gray-400">Reply-All Rate</div></div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">310 Engines. 2,296+ Services. One Platform.</h3>
            <p className="text-gray-200 mb-4">Contact us for a free demo of V506-V510 engines</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>📞 +1 302 464 0950</span>
              <span>✉️ kleber@ziontechgroup.com</span>
              <span>📍 364 E Main St STE 1008, Middletown DE 19709</span>
            </div>
            <div className="mt-4">
              <Link href="/services" className="inline-block px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Explore All 2,296+ Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
