// app/tools/analytics/page.tsx — Free Tools Usage Analytics Dashboard
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

type Stat = { page: string; window: string; count: number };
type UsageData = Record<string, Stat>;

function load(): { data: UsageData; byTool: Record<string, number>; total: number } {
  try {
    const raw = readFileSync(join(process.cwd(), '..', '..', 'data', 'tools-usage.json'), 'utf-8');
    const all: UsageData = JSON.parse(raw);
    const byTool: Record<string, number> = {};
    let total = 0;
    for (const s of Object.values(all)) {
      byTool[s.page] = (byTool[s.page] || 0) + s.count;
      total += s.count;
    }
    return { data: all, byTool, total };
  } catch { return { data: {}, byTool: {}, total: 0 }; }
}

const TOOL_META: Record<string, { emoji: string; name: string; href: string }> = {
  'ai-service-router':   { emoji: '🤖', name: 'AI Service Router',   href: '/tools/ai-service-router' },
  'roi-calculator':      { emoji: '📈', name: 'ROI Calculator',      href: '/tools/roi-calculator' },
  'service-comparison':  { emoji: '⚖️',  name: 'Service Comparison',  href: '/tools/service-comparison' },
  'service-recommender': { emoji: '🎯', name: 'Service Recommender', href: '/tools/service-recommender' },
  'port-scanner':        { emoji: '🔓', name: 'Port Scanner',        href: '/tools/port-scanner' },
  'ssl-checker':         { emoji: '🔒', name: 'SSL Checker',         href: '/tools/ssl-checker' },
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function ToolsAnalyticsPage() {
  const { byTool, total } = load();

  // Sort tools by total visits descending
  const ranking = Object.entries(byTool)
    .map(([slug, count]) => ({ slug, count, ...(TOOL_META[slug] || { emoji: '🔧', name: slug, href: '#' }) }))
    .sort((a, b) => b.count - a.count);

  const top6 = ranking.slice(0, 6);

  // Simple bar chart as inline divs (no external chart lib)
  const maxCount = ranking[0]?.count || 1;

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="container-page max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Free Tools — Usage Analytics</h1>
          <p className="section-subheading">Client-side page view counts for all 6 free tools. No personal data, no tracking cookies.</p>
        </div>

        {/* Summary */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl px-6 py-4 text-center">
            <div className="text-3xl text-purple-300 font-bold">{fmt(total)}</div>
            <div className="text-slate-400 text-xs mt-1">Total Visits</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-6 py-4 text-center">
            <div className="text-3xl text-white font-bold">{ranking.length}</div>
            <div className="text-slate-400 text-xs mt-1">Tools Tracked</div>
          </div>
        </div>

        {/* Ranking list */}
        <div className="space-y-3">
          {ranking.map(({ slug, count, emoji, name, href }) => {
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <a
                key={slug}
                href={href}
                className="block bg-slate-900/40 border border-slate-700/50 rounded-xl px-5 py-4 hover:border-purple-500/30 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-purple-300 font-semibold">{fmt(count)} visits</span>
                </div>
                <div className="text-white font-medium mb-1">{name}</div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-slate-600 text-xs mt-1">/tools/{slug}/</div>
              </a>
            );
          })}
        </div>

        <p className="text-slate-600 text-xs mt-8 text-center">
          Data stored in app/data/tools-usage.json • Aggregated by day-window • No personal data • Opt-out: disable JS
        </p>
      </div>
    </main>
  );
}
