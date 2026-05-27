import { ReactNode } from 'react';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
}

interface UseCase {
  title: string;
  description: string;
  icon?: string;
}

interface ProductPageLayoutProps {
  data: {
    title: string;
    category: string;
    description: string;
    iconEmoji?: string;
    features: Feature[];
    useCases: UseCase[];
    benefits: string[];
    ctaLabel?: string;
  };
}

export default function ProductPageLayout({ data }: ProductPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Hero */}
        <div className="glass-card mb-12">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 uppercase tracking-wider">
            {data.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 mt-3 flex items-center gap-3">
            {data.iconEmoji && <span className="text-4xl">{data.iconEmoji}</span>}
            {data.title}
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{data.description}</p>
        </div>

        {/* Features */}
        <div className="glass-card mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <span className="text-purple-400 text-lg shrink-0">✦</span>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        {data.useCases && data.useCases.length > 0 && (
          <div className="glass-card mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.useCases.map((uc, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  {uc.icon && <span className="text-2xl shrink-0">{uc.icon}</span>}
                  <div>
                    <h3 className="font-semibold text-white">{uc.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{uc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="glass-card mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how {data.title} can transform your business.
            364 E Main St STE 1008, Middletown, DE 19709 · +1 302 464 0950
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:kleber@ziontechgroup.com" className="btn-primary text-lg px-8">
              {data.ctaLabel || 'Get a Custom Quote'}
            </a>
            <Link href="/configurator/" className="btn-secondary text-lg px-8">
              Get Custom Proposal →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}