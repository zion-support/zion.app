import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Services — Zion Tech Group',
  description: 'Machine learning, NLP, computer vision, predictive analytics, automation, and applied AI solutions with clear pricing and contact details.',
};

const CONTACT_PHONE = '+1 302 464 0950';
const CONTACT_EMAIL = 'kleber@ziontechgroup.com';
const CONTACT_ADDRESS = '364 E Main St STE 1008, Middletown, DE 19709';

const services = [
  {
    title: 'Predictive Analytics & Decision Intelligence',
    description: 'Automated model selection, explainable predictions, and real-time forecasting for revenue, churn, inventory, and risk.',
    price: '$1,999/mo',
    benefits: ['Faster decisions with quantifiable confidence', 'Lower risk with explainable outputs', 'Lower forecasting error across time horizons'],
    features: ['Auto model selection', 'Real-time scoring', 'Explainability panels', 'Source data connectors'],
    href: '/services?category=data',
  },
  {
    title: 'Computer Vision & Document Intelligence',
    description: 'Object detection, OCR, form extraction, video analytics, and quality inspection tuned to production workflows.',
    price: '$1,499/mo',
    benefits: ['Reduce manual processing time', 'Improve accuracy at scale', 'Unlock new inspection workflows'],
    features: ['OCR + entity extraction', 'Object detection pipelines', 'Batch + streaming modes', 'Retrain workflows'],
    href: '/services?category=ai',
  },
  {
    title: 'LLM Integration & Private Assistants',
    description: 'Domain-tuned assistants with guardrails, retrieval, citations, and access controls for internal or client-facing use.',
    price: '$2,499/mo',
    benefits: ['Faster answers with verified sources', 'Consistent brand and policy compliance', 'Lower support load on teams'],
    features: ['RAG with citations', 'Policy + safety guardrails', 'Role-based access', 'Analytics + feedback'],
    href: '/services?category=ai',
  },
  {
    title: 'AI Process Automation',
    description: 'Document pipelines, approvals, triage, and handoffs with measurable SLAs and audit trails.',
    price: '$999/mo',
    benefits: ['Reduce cycle time', 'Improve handoff quality', 'Maintain audit-ready records'],
    features: ['Document parsing', 'Workflow orchestration', 'Approval routing', 'SLA monitoring'],
    href: '/services?category=automation',
  },
  {
    title: 'Recommendation & Personalization Engines',
    description: 'Cross-sell, next-best-action, content ranking, and pricing recommendations with measurable lift.',
    price: '$1,299/mo',
    benefits: ['Higher conversion and AOV', 'Better retention through relevance', 'Faster experiment cycles'],
    features: ['Behavioral modeling', 'Real-time ranking', 'AB test integration', 'Revenue attribution'],
    href: '/services?category=ai',
  },
  {
    title: 'Applied AI Implementation Services',
    description: 'Senior-led delivery for AI strategy, data readiness, model selection, deployment, and operating model.',
    price: 'Custom',
    benefits: ['Shorter time to value', 'Lower technology and staffing risk', 'Clear ownership and operating model'],
    features: ['Assessments + roadmaps', 'Pilot-to-production transitions', 'Governance + monitoring', 'Team enablement'],
    href: '/contact',
  },
];

export default function AIServices() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]"></div>
        <div className="relative container-page pt-24 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Services</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl">
              Practical applied AI with measurable outcomes: predictive analytics, document intelligence,
              LLM assistants, process automation, recommendation engines, and implementation services.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">All services</Link>
              <Link href="/pricing" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Pricing</Link>
              <Link href="/contact" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Contact sales</Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300">
              <div>📞 {CONTACT_PHONE}</div>
              <div>✉️ {CONTACT_EMAIL}</div>
              <div>📍 {CONTACT_ADDRESS}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">{service.title}</h2>
                  <span className="text-emerald-300 text-sm font-semibold whitespace-nowrap">{service.price}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{service.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Benefits</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {service.benefits.map((b) => <li key={b}>• {b}</li>)}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Features</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {service.features.map((f) => (
                      <li key={f} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <Link href={service.href} className="text-sm font-semibold text-blue-300 hover:text-blue-200">View details →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Need a tailored AI engagement?</h2>
              <p className="mt-2 text-sm text-slate-300">We scope, propose, and deliver applied AI solutions aligned to your business outcomes.</p>
              <div className="mt-3 text-sm text-slate-300">
                <div>📞 {CONTACT_PHONE}</div>
                <div>✉️ {CONTACT_EMAIL}</div>
                <div>📍 {CONTACT_ADDRESS}</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Contact sales</Link>
              <Link href="/services" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Browse all services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
