import React from 'react';
import { partners } from '../../../../data/partners';

export default function Partners() {
  const platinum = partners.partners.filter(p => p.tier === 'Platinum');
  const gold     = partners.partners.filter(p => p.tier === 'Gold');
  const silver   = partners.partners.filter(p => p.tier === 'Silver');

  const tierLabel = (tier: 'Platinum' | 'Gold' | 'Silver') => {
    return tier === 'Platinum' ? '★★★★★' : tier === 'Gold' ? '★★★' : '★★';
  };

  const tierBg = (tier: 'Platinum' | 'Gold' | 'Silver') => {
    return tier === 'Platinum'
      ? 'bg-amber-500/10 text-amber-400'
      : tier === 'Gold'
      ? 'bg-yellow-500/10 text-yellow-400'
      : 'bg-slate-500/10 text-slate-300';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-emerald-400 mb-3">Our Partners</h1>
        <p className="text-gray-300 mb-2">
          Zion Tech Group collaborates with industry leaders across cloud, AI, and infrastructure
          to deliver best-in-class solutions for enterprise clients.
        </p>
        <p className="text-gray-400 text-sm mb-12">
          Strategic partnerships with <strong>{partners.partners.length}</strong> organizations
          spanning <strong>{[...new Set(partners.partners.map(p => p.category))].length}</strong> technology categories.
        </p>

        {([['Platinum', platinum], ['Gold', gold], ['Silver', silver]] as const).map(([tier, list]) => (
          <section key={tier} className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-2xl font-bold text-emerald-400">{tier} Partners</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierBg(tier)}`}>
                {tierLabel(tier)}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map(partner => (
                <div
                  key={partner.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 hover:border-emerald-500/40 hover:bg-slate-800 transition"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    {partner.category}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {partner.description}
                  </p>
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      Visit partner &rarr;
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">Partnership pending</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-3">Become a Partner</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Interested in joining the Zion Tech Group partner ecosystem? We collaborate with
            technology leaders who share our commitment to innovation and client success.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition"
          >
            Contact Us About Partnerships
          </a>
        </section>
      </div>
    </div>
  );
}
