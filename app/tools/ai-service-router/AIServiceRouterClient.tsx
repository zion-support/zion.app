'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { allServices } from '@/data/servicesData';
import type { Service } from '@/data/servicesData';

// ── Keyword → category boost map ─────────────────────────────────────────
const CATEGORY_WEIGHT: Record<string, number> = {
  ai: 1.3, it: 1.2, cloud: 1.2, security: 1.3, data: 1.2, automation: 1.1,
};

const SYNONYMS: Record<string, string[]> = {
  chatbot:     ['chatbot', 'conversational ai', 'customer support ai'],
  compliance:  ['compliance', 'audit', 'hipaa', 'gdpr', 'soc 2', 'regulatory'],
  security:    ['security', 'cybersecurity', 'threat', 'vulnerability', 'zero trust', 'siem'],
  automation:  ['automation', 'rpa', 'workflow', 'orchestration', 'ci/cd', 'devops'],
  cloud:       ['cloud', 'aws', 'azure', 'gcp', 'multicloud', 'kubernetes', 'k8s'],
  data:        ['data', 'analytics', 'etl', 'pipeline', 'warehouse', 'lake', 'governance'],
  ai_agent:    ['agent', 'autonomous', 'copilot', 'rag', 'llm', 'multimodal'],
  integration: ['integration', 'api', 'middleware', 'connector', 'sync'],
  monitoring:  ['monitoring', 'observability', 'logging', 'alert', 'telemetry', 'uptime'],
  cost:        ['cost', 'billing', 'pricing', 'expense', 'budget', 'spend'],
  devops:      ['devops', 'ci/cd', 'pipeline', 'deployment', 'infrastructure', 'iac'],
};

function expandKeywords(raw: string): string[] {
  const tokens = raw.toLowerCase().replace(/[^\w\s/-]+/g, ' ').split(/\s+/).filter(Boolean);
  const expanded = new Set<string>(tokens);
  for (let i = 0; i < tokens.length - 1; i++) expanded.add(`${tokens[i]} ${tokens[i + 1]}`);
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (tokens.some(t => key.includes(t) || t.includes(key))) syns.forEach(s => expanded.add(s));
  }
  return [...expanded];
}

function scoreService(svc: Service, keywords: string[]): number {
  const text = `${svc.title} ${svc.description} ${svc.features.join(' ')} ${svc.category} ${svc.industry}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    score += (text.match(re) || []).length;
  }
  score *= CATEGORY_WEIGHT[svc.category] ?? 1;
  if (svc.popular) score *= 1.1;
  return score;
}

const SAMPLE_QUERIES = [
  'HIPAA compliance automation', 'cybersecurity threat detection', 'AI customer support chatbot',
  'cloud cost optimization', 'AI developer copilot', 'data pipeline orchestration',
];

export default function AIServiceRouter() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(false);
  const keywords = useMemo(() => expandKeywords(query), [query]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setLoading(true);
    queueMicrotask(() => {
      const scored = allServices
        .map(s => ({ ...s, _score: scoreService(s, keywords) }))
        .filter(s => s._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, 12);
      setResults(scored);
      setLoading(false);
    });
  };

  return (
    <div className="container-page py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">AI Service Router</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          Describe what you need in plain language — our AI matches your description against{' '}
          <strong className="text-purple-400">{allServices.length} services</strong> in our catalog and routes you to the best fit.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="e.g. HIPAA compliance automation, AI chatbot for support, cloud cost governance…"
            className="w-full px-6 py-4 text-lg bg-slate-800/80 border border-slate-600 rounded-xl
                       text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400
                       focus:border-transparent transition-all"
            autoFocus
            aria-label="Describe your need"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl">
              ✕
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {SAMPLE_QUERIES.map(sq => (
            <button key={sq} onClick={() => handleSearch(sq)}
              className="px-3 py-1 text-sm bg-slate-700/60 border border-slate-600 rounded-full
                         text-slate-300 hover:bg-slate-600 hover:text-white transition-colors">
              {sq}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center text-purple-400 py-8 animate-pulse">Routing…</div>}

      {results !== null && !loading && (
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400 mb-6 text-sm">
            {results.length === 0
              ? 'No matches — try rephrasing with more specific keywords.'
              : `${results.length} match${results.length !== 1 ? 'es' : ''} found for "${query}"`}
          </p>
          <ul className="space-y-4">
            {results.map((svc, i) => (
              <li key={svc.id}>
                <Link href={svc.href}
                  className="group block bg-slate-800/60 border border-slate-700 rounded-xl p-5
                             hover:border-purple-400/60 hover:bg-slate-700/60 transition-all">
                  <div className="flex items-start gap-4">
                    {svc.icon && <span className="text-3xl flex-shrink-0">{svc.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">{svc.category}</span>
                        {svc.popular && <span className="text-xs bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700/50">Popular</span>}
                        {i < 3 && <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">#{(i + 1)} match</span>}
                      </div>
                      <h2 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{svc.title}</h2>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{svc.description}</p>
                      {svc.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {svc.features.slice(0, 4).map(f => (
                            <span key={f} className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md">{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xl">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results !== null && results.length === 0 && !loading && (
        <div className="text-center text-slate-500 py-12">
          <p className="text-lg mb-2">No matching services found.</p>
          <p className="text-sm">Try broader terms: <em className="text-slate-400">AI, cloud, security, compliance, automation, data, integration</em></p>
        </div>
      )}

      <div className="mt-16 text-center text-slate-500 text-sm">
        <p>
          Routing across <strong className="text-slate-300">{allServices.length} services</strong> —
          ai {allServices.filter(s => s.category === 'ai').length} · it {allServices.filter(s => s.category === 'it').length} · cloud{' '}
          {allServices.filter(s => s.category === 'cloud').length} · security {allServices.filter(s => s.category === 'security').length} · data{' '}
          {allServices.filter(s => s.category === 'data').length} · automation {allServices.filter(s => s.category === 'automation').length}
        </p>
        <p className="mt-1">All scoring runs locally in your browser — no server round-trips, zero data leaves your device.</p>
      </div>
    </div>
  );
}
