'use client';
import { useState } from 'react';

const engines = [
  { id: 'v271', name: 'Encryption Intelligence', icon: '🔐', desc: 'Auto-detects sensitive content and encrypts with AES-256/PGP/S/MIME. Manages keys and ensures compliance.', features: ['Sensitive content detection', 'AES-256/PGP/S/MIME', 'Key management', 'HIPAA/SOX compliance'] },
  { id: 'v272', name: 'Performance Analytics', icon: '📊', desc: 'Tracks response times, open rates, engagement metrics. Team dashboards and predictive volume analytics.', features: ['Response time tracking', 'Team dashboards', 'Volume forecasting', 'Engagement metrics'] },
  { id: 'v273', name: 'Campaign Optimizer', icon: '🎯', desc: 'A/B tests campaigns automatically, optimizes send times and content, tracks conversions and ROI.', features: ['A/B testing automation', 'Send time optimization', 'Conversion tracking', 'ROI attribution'] },
  { id: 'v274', name: 'Search Intelligence', icon: '🔍', desc: 'Semantic search across all emails with natural language queries, smart filters, and relevance ranking.', features: ['Semantic search', 'Natural language queries', 'Entity extraction', 'Cross-mailbox search'] },
  { id: 'v275', name: 'Collaboration Hub', icon: '🤝', desc: 'Shared inboxes with smart routing, team mentions, assignments, collaborative drafting, approval workflows.', features: ['Shared inboxes', 'Smart routing', 'Team assignments', 'Approval workflows'] }
];

export default function V271V275Showcase() {
  const [active, setActive] = useState('v271');
  const selected = engines.find(e => e.id === active)!;

  return (
    <section className="my-8 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">Email Intelligence V34</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">V271-V275: Enterprise AI Email Engines</h2>
        <p className="mt-1 text-sm text-slate-600">77 autonomous engines analyzing every email case-by-case, enforcing reply-all, with enterprise-grade security and collaboration.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {engines.map(e => (
          <button key={e.id} onClick={() => setActive(e.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${active === e.id ? 'bg-cyan-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-300'}`}>
            {e.icon} {e.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{selected.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{selected.name}</h3>
            <p className="text-sm text-slate-600">{selected.desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {selected.features.map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-cyan-500">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          ✅ All engines enforce <strong>reply-all</strong> for multi-recipient emails · Case-by-case analysis · Autonomous action
        </div>
        <div className="flex gap-2">
          <a href="/contact" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">Get Started</a>
          <a href="/services" className="rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50">All 1,321 Services</a>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        📱 +1 302 464 0950 · ✉️ kleber@ziontechgroup.com · 📍 364 E Main St STE 1008, Middletown DE 19709
      </div>
    </section>
  );
}
