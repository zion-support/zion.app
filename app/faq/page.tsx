import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import Breadcrumb from '../components/Breadcrumb';
import { FAQ_ITEMS } from '../constants/faqData';

export const metadata = {
  title: 'Frequently Asked Questions | Zion Tech Group',
  description:
    'Find answers about Zion Tech Group AI solutions, implementation, pricing, industry support, and integration. Get started with AI for your business.',
  alternates: { canonical: '/faq' },
};

const GROUPS = [
  'Getting Started',
  'Products & Bundles',
  'Industries',
  'Integration',
  'Security & Compliance',
  'Support',
  'Services',
  'Resources',
];

export default function FAQPage() {
  const grouped = GROUPS.map((group) => ({
    group,
    items: FAQ_ITEMS.filter((item) => item.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-4xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} className="mb-6" />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Answers to common questions about Zion Tech Group AI solutions, implementation, pricing,
            and support. Can&apos;t find what you need?{' '}
            <a href="/contact" className="font-medium text-purple-300 hover:text-purple-200" data-cta-event="cta_discovery" data-cta-label="page">
              Contact us
            </a>
            .
          </p>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {grouped.map(({ group, items }) => (
            <div key={group} className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">{group}</h2>
              <dl className="space-y-6">
                {items.map((item) => (
                  <div key={item.question} className="border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                    <dt className="text-base font-semibold text-slate-100">{item.question}</dt>
                    <dd className="mt-2 text-sm text-slate-300 leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
    </div>
  );
}
