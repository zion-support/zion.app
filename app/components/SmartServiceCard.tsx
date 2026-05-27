import Link from 'next/link';
import type { Service } from '@/data/servicesData';

export interface SmartServiceCardProps {
  service: Service;
  relationship?: 'related' | 'featured' | 'recommended';
  relevance?: number;
  showPricing?: boolean;
}

export default function SmartServiceCard({
  service,
  relationship = 'related',
  relevance,
  showPricing = true,
}: SmartServiceCardProps) {
  const catKey   = service.category || 'ai';
  const isHot    = relationship === 'featured';
  const isRec    = relationship === 'recommended';

  // Category accent colors
  const catAccent: Record<string,string> = {
    ai:        'from-purple-500 to-indigo-500',
    it:        'from-blue-500 to-cyan-500',
    cloud:     'from-sky-400 to-blue-600',
    security:  'from-orange-500 to-amber-500',
    data:      'from-green-500 to-emerald-500',
    automation:'from-pink-500 to-rose-500',
  };
  const gradient = catAccent[catKey] || catAccent.ai;

  // Pricing: show first tier (null-safe)
  const firstTier = (service.pricing && typeof service.pricing === 'object')
    ? Object.values(service.pricing as Record<string,string>)[0] || 'Contact for Quote'
    : 'Contact for Quote';

  // Relevance badge display
  const badgeLabel = isHot
    ? null   // "Popular" shown via tag in caller
    : isRec
    ? '⭐ Recommended'
    : relevance != null && relevance > 60 ? `${relevance}% match`
    : relevance != null && relevance > 40 ? `${relevance}% related`
    : null;

  return (
    <Link href={`/services/${service.id}`}
      className="glass-card group flex flex-col relative overflow-hidden
        hover:scale-[1.015] hover:border-purple-500/40 transition-all duration-300"
    >
      {/* Category accent top-border */}
      <div className={`h-1 rounded-full bg-gradient-to-r ${gradient}`} />

      {/* Relevance / Popularity badge */}
      <div className="absolute top-3 right-3 flex gap-1">
        {isHot && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
            bg-orange-500/12 text-orange-300 border border-orange-500/25">
            ★ Popular
          </span>
        )}
        {badgeLabel && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
            bg-slate-800/80 border border-slate-600/60 text-slate-200 backdrop-blur-sm
            group-hover:border-purple-500/50 transition-colors">
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Category tag */}
      <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-3">
        {(service.category || 'Service').charAt(0).toUpperCase() + (service.category || '').slice(1)}
      </span>

      {/* Title + icon */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xl shrink-0">{service.icon || '🛠'}</span>
        <h3 className="text-sm font-semibold text-white leading-snug
          group-hover:text-purple-300 transition-colors line-clamp-2">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs mt-2 line-clamp-2 flex-1 leading-relaxed">
        {service.description}
      </p>

      {/* Features preview (show first 2) */}
      {(service.features || []).length > 0 && (
        <ul className="mt-3 space-y-1">
          {(service.features as string[]).slice(0, 2).map((f, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500">
              <span className="text-purple-400 mt-0.5 shrink-0">✦</span>
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer: price + arrow */}
      <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
        <span className="text-purple-300 text-xs font-semibold">
          From {firstTier}/mo
        </span>
        <span className="text-xs text-slate-500 group-hover:text-purple-400 transition-colors">→</span>
      </div>
    </Link>
  );
}