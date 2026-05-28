// app/services/stage/[stage]/page.tsx — Service Stage Filter
import { allServices } from '@/data/servicesData';
import type { Service } from '@/data/servicesData';
import Link from 'next/link';

const STAGE_META: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  published: { label: 'Published', emoji: '✅', desc: 'Live production services available now', color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30' },
  beta:      { label: 'Beta',      emoji: '🧪', desc: 'Early access — refined based on user feedback', color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30' },
  planned:   { label: 'Coming Soon', emoji: '🚧', desc: 'In the pipeline — scheduled for release', color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30' },
};

export async function generateStaticParams() {
  return ['published', 'beta', 'planned'].map((stage) => ({ stage }));
}

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params;
  const meta = STAGE_META[stage] || STAGE_META.published;
  return { title: `${meta.label} Services | Zion Tech Group`, description: meta.desc };
}

export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params;
  const meta = STAGE_META[stage] || STAGE_META.published;
  const filtered = allServices.filter((s) => (s as any).stage === stage);
  const otherStages = (['published', 'beta', 'planned'] as const).filter(s => s !== stage);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">{meta.emoji}</span>
          <h1 className="text-4xl font-bold text-white mb-3">{meta.label} Services</h1>
          <p className="section-subheading">{meta.desc}</p>
          <p className="text-slate-400 mt-4">
            <span className="text-purple-400 font-semibold">{filtered.length}</span> service{filtered.length !== 1 ? 's' : ''} in this stage
          </p>
        </div>

        {/* Stage switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {otherStages.map((s) => (
            <Link key={s} href={`/services/stage/${s}`} className="px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-900/50 border border-slate-700/50 text-slate-400 hover:border-purple-500/50 hover:text-purple-300 transition">
              {STAGE_META[s].emoji} {STAGE_META[s].label} ({allServices.filter((sv) => (sv as any).stage === s).length})
            </Link>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500">No services in this stage yet.</p>
        ) : (
          <div className="feature-grid">
            {filtered.map((service: Service) => (
              <div key={service.id} className="glass-card flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${meta.color} border uppercase tracking-wider`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-500">{service.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 5).map((f: string, i: number) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-purple-400 mt-1 shrink-0">•</span><span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm font-medium">
                      Starting at {(service.pricing as Record<string, string>)[Object.keys(service.pricing)[0]]}
                    </span>
                  </div>
                  <Link href={`/services/${service.id}`} className="text-sm text-purple-400 hover:underline inline-flex items-center gap-1 mt-1">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-12">
          <Link href="/services/" className="btn-secondary">← Back to Full Catalog</Link>
        </div>
      </div>
    </main>
  );
}
