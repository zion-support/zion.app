import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing — Zion Tech Group',
  description: 'Transparent pricing for AI, IT, micro-SaaS, automation, and advisory engagements.',
};

const CONTACT_PHONE = '+1 302 464 0950';
const CONTACT_EMAIL = 'kleber@ziontechgroup.com';

const faqs = [
  {
    q: 'How do engagements usually start?',
    a: 'Most projects begin with a short scoping phase to clarify outcomes, success metrics, and integration constraints before any delivery work starts.',
  },
  {
    q: 'Do prices include implementation support?',
    a: 'Implementation support can be added to most engagements. We treat it as a separate track so we do not blur subscription value from professional services.',
  },
  {
    q: 'Can I add or remove services later?',
    a: 'Yes. Service plans are modular by default, so you can add or lower scope at renewal or mid-term when the work is structured as a service tier.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]"></div>
        <div className="relative container-page pt-24 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl">
              Transparent pricing for AI, IT, micro-SaaS, automation, and advisory engagements.
              If your use case does not fit a standard plan, we will propose a custom scope with fixed-price or outcome-linked terms.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <div>📞 {CONTACT_PHONE}</div>
              <div>✉️ {CONTACT_EMAIL}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'AI Assist',
                price: '$999/mo',
                line: 'For teams ready to automate cognitive work and decision support',
                features: ['LLM assistant with RAG', 'Document intelligence', '1 automation workflow', 'Weekly office hours'],
              },
              {
                name: 'Growth Operations',
                price: '$1,499/mo',
                line: 'For revenue and operations teams optimizing conversion, retention, and delivery',
                features: ['Predictive analytics', 'Process automation suite', 'Performance dashboard', 'Priority support'],
              },
              {
                name: 'Enterprise AI',
                price: 'Custom',
                line: 'For regulated or global organizations that need security, governance, and scale',
                features: ['Private model deployment', 'Security + compliance review', 'Custom integrations', 'Dedicated delivery lead'],
              },
              {
                name: 'Managed Infrastructure',
                price: '$1,499/mo+',
                line: 'For IT and platform teams that want reliability, FinOps, and modern cloud operations',
                features: ['Cloud operations support', 'Cost optimization guardrails', 'Incident response coverage', 'Patch + compliance tracking'],
              },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
                <p className="mt-2 text-3xl font-bold text-white">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-400">{plan.line}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {plan.features.map((f) => <li key={f}>• {f}</li>)}
                </ul>
                <div className="mt-6">
                  <Link href="/contact" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request scoping</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="mt-2 text-sm text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white">A custom scope may fit better</h2>
              <p className="mt-2 text-sm text-slate-300">If your project spans AI, IT, and product delivery, we often propose a unified engagement so adoption risk stays low.</p>
              <div className="mt-3 text-sm text-slate-300">
                <div>📞 {CONTACT_PHONE}</div>
                <div>✉️ {CONTACT_EMAIL}</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Contact sales</Link>
              <Link href="/services" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Browse services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
