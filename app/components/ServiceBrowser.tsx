// components/ServiceBrowser.tsx — live service browser from /data/services.json
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  industry: string;
}

interface FeedResponse {
  generated: string;
  count: number;
  categories: Record<string, number>;
  services: ServiceItem[];
}

const CATEGORIES: { key: string; label: string; emoji: string; color: string }[] = [
  { key: 'ai',      label: 'AI & Automation',      emoji: '🧠', color: 'from-purple-500 to-indigo-500' },
  { key: 'it',      label: 'IT Infrastructure',    emoji: '🖥️', color: 'from-blue-500 to-cyan-500'   },
  { key: 'cloud',   label: 'Cloud & DevOps',       emoji: '☁️', color: 'from-sky-400 to-blue-600'    },
  { key: 'security',label: 'Security',             emoji: '🔐', color: 'from-red-500 to-orange-500'  },
  { key: 'data',    label: 'Data & Analytics',     emoji: '📊', color: 'from-emerald-500 to-teal-500' },
  { key: 'automation',label:'Automation',           emoji: '⚡', color: 'from-amber-500 to-yellow-500' },
];

const CATEGORY_ICON: Record<string, string> = {
  ai: '🧠', it: '🖥️', cloud: '☁️', security: '🔐', data: '📊', automation: '⚡',
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: 'bg-purple-500',
  it: 'bg-blue-500',
  cloud: 'bg-sky-500',
  security: 'bg-red-500',
  data: 'bg-emerald-500',
  automation: 'bg-orange-500',
};

export default function ServiceBrowser() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch('/data/services.json', { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: FeedResponse) => {
        if (!cancelled) {
          setServices(data.services || []);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setErr(e.message);
          setLoading(false);
        }
      })
      .finally(() => clearTimeout(timer));

    return () => { cancelled = true; controller.abort(); };
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, ServiceItem[]> = {};
    for (const s of services) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    }
    return map;
  }, [services]);

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const VISIBLE = 9;

  if (loading) {
    return (
      <section className="py-16">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">📦</span>
            <h2 className="text-2xl font-bold text-white">All Services</h2>
            <span className="text-sm text-slate-400">Loading…</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(c => (
              <div key={c.key} className="glass-card h-28 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="py-16">
        <div className="container-page">
          <p className="text-red-400 text-sm">Failed to load services: {err}</p>
        </div>
      </section>
    );
  }

  const total = services.length;

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">📦</span>
          <h2 className="text-2xl font-bold text-white">All {total.toLocaleString()} Services</h2>
          <span className="text-sm text-slate-400">— browse by category</span>
        </div>

        <div className="space-y-8">
          {CATEGORIES.map(cat => {
            const list = grouped[cat.key] || [];
            const isOpen = expanded[cat.key] !== false; // default open
            const shown = isOpen ? list : list.slice(0, VISIBLE);
            const hasMore = list.length > VISIBLE;

            return (
              <div key={cat.key} className="glass-card p-6">
                <div
                  className="flex items-center justify-between mb-5 cursor-pointer select-none"
                  onClick={() => toggle(cat.key)}
                  role="button"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{cat.label}</h3>
                      <p className="text-xs text-slate-500">{list.length} services</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 hover:text-white transition-colors">
                    {isOpen ? '▲ Collapse' : `▼ Show all (${list.length})`}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {shown.map(svc => (
                    <Link
                      key={svc.id}
                      href={svc.href}
                      className="glass-card flex flex-col gap-1.5 p-4 group hover:border-purple-500/40 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {svc.title}
                        </h4>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[cat.key]} text-white border-white/15 rounded-full px-2 py-0.5 shrink-0`}>
                          {cat.key.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2 flex-1 leading-relaxed">
                        {svc.description}
                      </p>
                      <span className="text-purple-400 text-xs font-medium group-hover:translate-x-1 transition-transform mt-1 self-end">
                        Details →
                      </span>
                    </Link>
                  ))}
                </div>

                {hasMore && !isOpen && (
                  <button
                    onClick={() => toggle(cat.key)}
                    className="mt-3 w-full py-2 text-xs text-slate-500 hover:text-purple-400 border border-slate-700 hover:border-purple-500/30 rounded-lg transition"
                  >
                    +{list.length - VISIBLE} more {cat.label} services
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
