// app/services/[id]/page.tsx — Dynamic Service Detail Page
import { notFound } from 'next/navigation';
import { allServices } from '@/data/servicesData';
import Link from 'next/link';
import ROICalculator from '@/components/ROICalculator';

const CAT_LABELS: Record<string,string> = {
  ai: 'AI Services', it: 'IT', cloud: 'Cloud', security: 'Security',
  data: 'Data & AI', automation: 'Automation', consulting: 'Consulting',
};

interface PageProps { params: Promise<{ id: string }>; }

export async function generateStaticParams() {
  const params: { id: string }[] = [];
  for (const service of allServices) {
    params.push({ id: service.id });               // kebab / underscore as stored
    if (service.id.includes('_')) {
      params.push({ id: service.id.replace(/_/g, '-') }); // kebab fallback
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const service = allServices.find((s) => s.id === id);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: `${service.title} | Zion Tech Group`,
    description: service.description.slice(0, 160),
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params;
  // Accept both kebab-case and underscore-case IDs
  const service = allServices.find(
    (s) => s.id === id || s.id.replace(/-/g, '_') === id || s.id.replace(/_/g, '-') === id
  );
  if (!service) notFound();

  const catLabel = CAT_LABELS[service.category] || service.category;

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">{service.title}</span>
        </nav>

        {/* Hero */}
        <div className="glass-card mb-12">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 uppercase tracking-wider">
            {catLabel}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 mt-3">{service.title}</h1>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{service.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Features */}
          <div className="lg:col-span-2 glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="text-purple-400 mt-1 shrink-0">✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-xl font-semibold text-white mb-4">Pricing</h2>
              <div className="space-y-3">
                {Object.entries(service.pricing).map(([tier, price]) => (
                  <div key={tier} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-300 capitalize">{tier}</span>
                    <span className="text-purple-300 font-semibold">{price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-3">Get Started</h3>
              <p className="text-slate-400 text-sm mb-4">
                Ready to get started? Contact us for a custom quote.
              </p>
              <div className="space-y-3">
                <a href="tel:+13024640950" className="btn-primary w-full text-center block">
                  ☎ +1 302 464 0950
                </a>
                <a href="mailto:kleber@ziontechgroup.com" className="btn-secondary w-full text-center block">
                  ✉️ Email Us
                </a>
                <Link href="/configurator" className="btn-secondary w-full text-center block">
                  Get Custom Proposal →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="glass-card mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <span className="text-green-400 text-lg shrink-0">✓</span>
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator */}
        <ROICalculator serviceTitle={service.title} category={service.category} />

        {/* Related Services — expand to 8 + category link */}
        {(() => {
          const sameCat = allServices
            .filter((s) => s.category === service.category && s.id !== service.id)
            .slice(0, 8);
          if (sameCat.length === 0) return null;
          const catLabel = (CAT_LABELS[service.category] || service.category).replace(' Services', '');
          return (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Related Services</h2>
              <p className="text-slate-400 text-sm mb-6">Other {catLabel} services you may be interested in</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sameCat.map((s) => (
                  <Link key={s.id} href={`/services/${s.id}`}
                    className="glass-card hover:border-purple-500/50 transition group flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{s.category}</span>
                    <h3 className="text-white font-semibold mt-1 group-hover:text-purple-400 transition leading-snug">{s.title}</h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2 flex-1">{s.description}</p>
                    <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center">
                      <span className="text-purple-300 text-xs font-semibold">
                        From {Object.values(s.pricing as Record<string,string>)[0]}/mo
                      </span>
                      <span className="text-xs text-slate-500 group-hover:text-purple-400 transition-colors">→</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href={`/services?category=${service.category}`}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                  View all {catLabel} services →
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Bottom CTA */}
        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how {service.title} can transform your business.
            364 E Main St STE 1008, Middletown, DE 19709 · +1 302 464 0950
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:kleber@ziontechgroup.com" className="btn-primary text-lg px-8">Get a Custom Quote</a>
            <Link href="/pricing-calculator" className="btn-secondary text-lg px-8">Pricing Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
