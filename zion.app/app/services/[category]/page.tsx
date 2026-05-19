// app/services/[category]/page.tsx — Category Landing Page (Server Component)
import Link from 'next/link';
import serviceIndex from '../../../public/service-index.json';
import type { Service } from '../../app/data/servicesData';

type CategoryKey = 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';

const CATEGORY_META: Record<CategoryKey, {
  label: string;
  emoji: string;
  description: string;
  color: string;
}> = {
  ai: {
    label: 'AI Services', emoji: '🧠', description: 'Artificial intelligence and machine learning',
    color: 'from-purple-500 to-indigo-500',
  },
  it: {
    label: 'IT Services', emoji: '🖥️', description: 'Infrastructure, networking, and operations',
    color: 'from-blue-500 to-cyan-500',
  },
  cloud: {
    label: 'Cloud Services', emoji: '☁️', description: 'Cloud migration, hosting, and devops',
    color: 'from-sky-400 to-blue-600',
  },
  security: {
    label: 'Security Services', emoji: '🔐', description: 'Cybersecurity, compliance, and data protection',
    color: 'from-red-500 to-orange-500',
  },
  data: {
    label: 'Data Analytics', emoji: '📊', description: 'Business intelligence, reporting, and data pipelines',
    color: 'from-green-500 to-emerald-500',
  },
  automation: {
    label: 'Automation', emoji: '🤖', description: 'RPA, workflows, and no-code automation',
    color: 'from-pink-500 to-rose-500',
  },
};

function getServiceCount(category: string, services: Service[]): number {
  return services.filter((s: Service) => s.category === category).length;
}

function getPriceRange(category: string, services: Service[]): string {
  const prices = services
    .filter((s: Service) => s.category === category)
    .map((s: Service) => [s.basic, s.pro, s.enterprise] as const)
    .flat()
    .filter((p): p is number => typeof p === 'number' && p > 0)
    .sort((a: number, b: number) => a - b);
  return prices.length > 0 ? `$${prices[0]}–$${prices[prices.length - 1]}/mo` : 'Custom quote';
}

export function generateStaticParams() {
  const services: Service[] = (serviceIndex as any).services;
  return Object.keys(
    (serviceIndex as any).categories || {}
  ).map((cat: string) => ({ category: cat }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = (params.category || '').toLowerCase() as CategoryKey;
  const services: Service[] = (serviceIndex as any).services;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return (
      <main className="min-h-screen bg-slate-950 py-20">
        <div className="container-page text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category not found</h1>
          <p className="text-slate-400 mb-8">
            &ldquo;{category}&rdquo; is not a recognized category.
          </p>
          <Link href="/services" className="btn-primary">Browse All Services</Link>
        </div>
      </main>
    );
  }

  const categoryServices = services.filter((s: Service) => s.category === category);
  const otherCats: CategoryKey[] = ['ai', 'it', 'cloud', 'security', 'data', 'automation'];
  const prevCat = otherCats[(otherCats.indexOf(category) - 1 + otherCats.length) % otherCats.length];
  const nextCat = otherCats[(otherCats.indexOf(category) + 1) % otherCats.length];

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-400 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-purple-400 transition">Services</Link>
          <span>/</span>
          <span className="text-slate-300">{meta.label}</span>
        </nav>

        {/* Hero */}
        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${meta.color} bg-clip-text text-transparent mb-3`}>
          <span className="text-5xl">{meta.emoji}</span>
          <h1 className="text-4xl md:text-5xl font-bold">{meta.label}</h1>
        </div>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl">
          {meta.description}. Browse all {categoryServices.length} services, sorted and
          filtered to find your ideal solution.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 mb-10">
          <div className="glass-card flex items-center gap-3 px-5 py-3 border-purple-500/20">
            <span className="text-2xl">{meta.emoji}</span>
            <div>
              <div className="text-xl font-bold text-white">{categoryServices.length}</div>
              <div className="text-xs text-slate-500">Services</div>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 px-5 py-3">
            <div>
              <div className="text-xl font-bold text-white">{getPriceRange(category, services)}</div>
              <div className="text-xs text-slate-500">Typical price</div>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 px-5 py-3">
            <div>
              <div className="text-xl font-bold text-white">
                {categoryServices.filter((s: Service) => s.popular).length}
              </div>
              <div className="text-xs text-slate-500">Popular services</div>
            </div>
          </div>
        </div>

        {/* Service grid */}
        {categoryServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {categoryServices.map((service: Service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="glass-card flex flex-col gap-3 p-6 group hover:border-purple-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{service.icon || meta.emoji}</span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">{category}</span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 leading-snug">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-600">
                    {(service.features || []).length} features
                  </span>
                  <span className="text-purple-400 text-xs font-medium group-hover:translate-x-1 transition-transform">
                    Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl opacity-30 block mb-4">{meta.emoji}</span>
            <p className="text-slate-400 text-lg mb-2">No services in this category.</p>
            <Link href="/services" className="btn-secondary inline-block">Browse All Services</Link>
          </div>
        )}

        {/* Category navigation */}
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-lg font-bold text-white mb-6">Other Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherCats.filter(c => c !== category).map((cat) => {
              const cm = CATEGORY_META[cat];
              const count = services.filter((s: Service) => s.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/services/${cat}`}
                  className="glass-card flex flex-col items-center text-center gap-2 p-5 border-purple-500/10 hover:border-purple-500/30 transition group"
                >
                  <span className="text-2xl">{cm.emoji}</span>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{cm.label}</span>
                  <span className="text-xs text-slate-600">{count} services</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center glass-card p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            Need a {meta.label.replace('Services', '').trim()} solution?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Get a custom proposal in minutes — we&apos;ll match your needs with the right experts and tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configurator" className="btn-primary inline-flex items-center justify-center">⚡ Get Your Custom Proposal</Link>
            <a href="tel:+130****0950" className="btn-secondary inline-flex items-center justify-center">📞 +1 302 464 0950</a>
          </div>
        </div>
      </div>
    </main>
  );
}
