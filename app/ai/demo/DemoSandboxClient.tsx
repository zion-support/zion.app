'use client';

import { useState, useMemo, useCallback } from 'react';
import { allServices } from '@/data/servicesData';


const DEMO_ITEMS = 599;

// ── Keywords + category weight boost ──────────────────────────────────────────
const CAT_WEIGHT: Record<string, number> = {
  ai: 1.3, cloud: 1.2, security: 1.3, data: 1.1, it: 1.0, automation: 1.1,
};

const KEYWORD_MAP: Record<string, { keys: string[]; catBoost?: number }> = {
  compliance: { keys: ['compliance','audit','hipaa','gdpr','soc2','regulatory','fda','sox'] },
  chatbot:   { keys: ['chatbot','conversational','nlp','nlq','query'] },
  cybersecurity: { keys: ['cybersecurity','threat','pentest','vulnerability','siem','endpoint','firewall','incident'] },
  cost:      { keys: ['cost','finops','billing','expense','pricing','optimization','rightsiz'] },
  copilot:   { keys: ['code','developer','dev','github','git','ide','copilot','snippet','autocomplete'] },
  data:      { keys: ['data','pipeline','etl','elt','warehouse','lake','stream','ingest','transform'] },
  email:     { keys: ['inbox','mail','gmail','outlook','support','ticket','helpdesk','triage','routing'] },
  healthcare:{ keys: ['healthcare','hipaa','medical','clinical','patient','fda','diagnostic'] },
  hr:        { keys: ['hr','recruit','talent','hiring','resume','candidate','onboarding','workforce'] },
  llm:       { keys: ['llm','gpt','openai','anthropic','claude','langchain','rag','embedding','fine-tun','prompt','agent'] },
  marketing: { keys: ['marketing','campaign','seo','content','copy','brand','social','advertising','lead'] },
  mobile:    { keys: ['mobile','app','ios','android','react native','flutter','pwa','push'] },
  observability:{ keys: ['observability','log','trace','metric','apm','monitor','dashboard','opentelemetry','grafana'] },
  predictive:{ keys: ['predictive','forecast','ml','machine learning','anomaly','pattern','trend','regression','time-series'] },
  retail:    { keys: ['retail','ecom','shopify','inventory','pos','checkout','pdp','sku','stock','fulfillment'] },
  robotics:  { keys: ['robot','iot','edge','device','embed','gpio','sensor','arduino','raspberry'] },
  sales:     { keys: ['sales','crm','pipeline','forecast','quota','deal','opportunity','enrich','lead scoring'] },
  video:     { keys: ['video','stream','ffmpeg','encoding','transcode','vod','hls','dash','live'] },
  workflow:  { keys: ['workflow','automation','orchestrat','schedule','trigger','agent','bpmn','n8n','zapier'] },
};

const SCENARIOS = [
  { label: '🔒 HIPAA Compliance', query: 'a hospital needs HIPAA compliance monitoring, GDPR reporting, and audit-ready security logging for patient data' },
  { label: '📧 Inbox Triage', query: 'our support team gets 1000 emails a day and needs AI to triage, tag, route, and reply automatically with the right tone' },
  { label: '🚀 Predictive Analytics', query: 'we want forecasting and anomaly detection from our time-series data to catch issues before they escalate' },
  { label: '🤖 AI Copilot', query: 'build an LLM-powered coding assistant that answers developer questions using our internal docs and API specs' },
  { label: '💰 ROI & Cost', query: 'compute the ROI of our proposed AI investment across cloud cost reduction, automation savings, and revenue uplift' },
  { label: '🛒 Retail Analytics', query: 'real-time ecom inventory sync, personalized product recommendations, and fraud detection for checkout flows' },
  { label: '🔍 Observability', query: 'distributed tracing, log aggregation, metric dashboards and alerting for our microservices platform' },
  { label: '👥 Recruiting', query: 'automate CV screening, interview scheduling, candidate sourcing, and talent pipeline analytics' },
];

const CAT_EMOJI: Record<string, string> = {
  ai: '🤖', cloud: '☁️', security: '🔒', data: '📊', it: '⚙️', automation: '🔗',
};

// ── Scoring ───────────────────────────────────────────────────────────────────
function scoreService(text: string, svc: (typeof allServices)[number]): number {
  const t = text.toLowerCase();
  let score = 0;

  // 1. Direct title / description match
  if (svc.title.toLowerCase().includes(t)) score += 12;
  if (svc.description.toLowerCase().includes(t)) score += 8;

  // 2. Features keyword scan
  for (const f of svc.features) {
    const fl = f.toLowerCase();
    if (t.includes(fl)) { score += 6; break; }
    // split query into words, score on word overlap
    const twords = t.split(/\s+/).filter(Boolean);
    for (const w of twords) {
      if (fl.includes(w) && w.length > 3) score += 3;
    }
  }

  // 3. Category label match (e.g. typing "ai")
  if (t.includes(svc.category)) score += 5;

  // 4. Category weight boost via keyword map
  for (const [label, cfg] of Object.entries(KEYWORD_MAP)) {
    for (const k of cfg.keys) {
      if (t.includes(k)) {
        score += 4;
        if (cfg.catBoost && svc.category !== label) {
          score += cfg.catBoost;   // category-binding bonus
        }
        break; // don't double-count keyword hits
      }
    }
  }

  // 5. Popularity nudge for tiebreaks
  if (svc.popular) score += 0.5;

  // 6. Category weight boost
  score *= CAT_WEIGHT[svc.category] ?? 1;

  return Math.round(score * 10) / 10;
}

function rank(query: string) {
  return allServices
    .map(s => ({ s, sc: scoreService(query, s) }))
    .filter(x => x.sc > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 12);
}

// ── PDF via browser print ─────────────────────────────────────────────────────
function handlePrint() {
  window.print();
}

// ── Popular shortcut list ─────────────────────────────────────────────────────
const POPULAR_MAP = {
  'cybersecurity & pen test': 'cybersecurity',
  'compliance & audit': 'compliance-automation-engine',
  'ai chatbot & virtual assistant': 'customer-experience',
  'crm automation': 'crm-automation',
  'finops': 'data-cost-finops',
  'prediction & forecasting': 'analytics-financial-forecasting',
  'rag knowledge base': 'data-document-vector-search',
  'observability': 'ai-observability-llm-tracing',
};

export default function DemoSandboxClient() {
  const [query, setQuery] = useState('');

  const top12 = useMemo(() => rank(query), [query]);
  const best  = top12[0];

  const onPreset = useCallback((q: string) => setQuery(q), []);

  return (
    <>
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print, [class*="no-print"] { display: none !important; }
          #print-area { padding: 2rem; }
          #print-area * { color: #000 !important; }
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">Live Interactive Demo</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            AI Service Router Sandbox
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Type a use-case, pick a scenario, or try a demo question. All scoring runs <strong>100% browser-side</strong> — no API call, no data sent anywhere.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" /> {allServices.length}+ services indexed &nbsp;|&nbsp;
            <span>Zero server cost</span> &nbsp;|&nbsp; <span>Client-side only</span>
          </div>
        </div>

        {/* Scenario presets */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-3">Try a scenario:</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map(s => (
              <button
                key={s.label}
                onClick={() => onPreset(s.query)}
                className="no-print text-xs rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-slate-300 hover:border-purple-500/50 hover:text-purple-300 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              🔍
            </span>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe your use case… e.g. 'We need HIPAA compliance monitoring + log aggregation for patient data'"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-12 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none min-h-[72px]"
              rows={2}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="no-print absolute right-3 top-3 text-slate-600 hover:text-slate-300 text-xs"
              >
                ✕ clear
              </button>
            )}
          </div>
        </div>

        {/* Best match highlight */}
        {best && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-cyan-900/20 to-transparent border border-purple-500/20">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                  Best match — score {best.sc}
                </p>
                <h3 className="text-lg font-semibold text-white">{best.s.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{best.s.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                    {CAT_EMOJI[best.s.category] ?? ''} {best.s.category}
                  </span>
                  {best.s.popular && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      ⭐ Popular
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No results */}
        {query && top12.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No service matched &quot;{query}&quot;. Try different keywords like <em>LLM, cybersecurity, HR, compliance, retail, observability</em>.
          </div>
        )}

        {/* Results table */}
        {top12.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Top {Math.min(top12.length, 12)} matches
            </h2>
            <div className="space-y-2" id="print-area">
              {top12.map(({ s, sc }, i) => (
                <div
                  key={s.id}
                  className={`no-print rounded-xl border p-4 transition-all ${
                    i === 0
                      ? 'border-purple-500/30 bg-purple-900/10'
                      : i < 3
                      ? 'border-purple-500/15 bg-slate-800/30'
                      : 'border-slate-800 bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-sm font-bold tabular-nums self-center ${
                      i === 0 ? 'text-purple-400' : i < 3 ? 'text-purple-400' : 'text-slate-500'
                    }`}>#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white truncate">{s.title}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {CAT_EMOJI[s.category] ?? ''} {s.category}
                        </span>
                        {s.popular && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">⭐</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.features.slice(0, 4).map((f: string) => (
                          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/40 text-slate-500">
                            {f}
                          </span>
                        ))}
                        {s.features.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-slate-600">
                            +{s.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-base font-bold tabular-nums self-center ${i < 3 ? 'text-purple-400' : 'text-slate-500'}`}>
                      {sc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Print to PDF */}
        <div className="no-print text-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-30"
            disabled={!best}
          >
            🖨️ Print / Save as PDF
          </button>
          <p className="text-xs text-slate-600 mt-2">
            Opens your browser&apos;s print dialog — no data is sent to any server.
          </p>
        </div>

        {/* Footer notes */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 text-center">
          <p className="text-xs text-slate-600">
                          Demo by Zion Tech Group — 600+ AI, IT, Cloud &amp; automation services indexed locally.
            <br />No LLM API calls. No account required. Everything runs in your browser.
          </p>
        </div>
      </div>
    </>
  );
}
