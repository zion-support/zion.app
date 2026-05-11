import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'E-Commerce & Retail AI Solutions | Zion Tech Group',
  description:
    'Drive higher conversion with AI-powered recommendations, demand forecasting, and inventory optimization for e-commerce and retail businesses.',
  alternates: { canonical: '/solutions/ecommerce-retail' },
};

const ecommerceRetailApps = [
  { name: 'Ecommerce Analytics Pro', href: '/ecommerce-analytics-pro' },
  { name: 'Smart Inventory Manager', href: '/zion-smart-inventory-manager' },
  { name: 'AI Sales Predictor', href: '/zion-ai-sales-predictor' },
  { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation' },
  { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
  { name: 'AI Content Moderation', href: '/zion-ai-content-moderator' },
];

export default function EcommerceRetailSolutionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            E-Commerce & Retail{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Drive higher conversion with AI-powered recommendations, demand forecasting, and inventory
            optimization across channels for e-commerce and retail businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              View All Solutions
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg shadow-black/20 sm:p-8">
          <h2 className="text-xl font-bold text-white">Featured AI Apps for E-Commerce & Retail</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for personalization, inventory, demand forecasting, and customer
            experience.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ecommerceRetailApps.map((app) => (
              <a
                key={app.href}
                href={app.href}
                className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-slate-100 transition hover:border-purple-400/50 hover:text-white"
              >
                <span>{app.name}</span>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Use cases
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Common E-Commerce & Retail Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Personalization & Recommendations</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI-powered product recommendations, personalized email campaigns, and dynamic content based on user behavior.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Demand & Inventory</h3>
              <p className="mt-2 text-sm text-slate-300">
                Forecast demand, optimize stock levels, and reduce out-of-stock incidents. Align supply with seasonal and promotional trends.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Customer Support</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI chatbots for FAQs, order status, returns. Route complex inquiries to agents with full context and reduce support volume.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Lead Scoring & Conversion</h3>
              <p className="mt-2 text-sm text-slate-300">
                Prioritize high-intent shoppers, personalize outreach and retargeting. Improve conversion rates and campaign ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/20 bg-slate-900/65 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Case study
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">Ecommerce Brand Increases Revenue 28% with Predictive Lead Scoring</h2>
          <p className="mt-2 text-slate-300">
            An ecommerce brand used AI Lead Scoring and Email Marketing Pro to prioritize high-intent shoppers and personalize outreach at scale.
          </p>
          <a
            href="/case-studies"
            className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            View case studies
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <SolutionPageFAQ
        industryName="E-Commerce & Retail"
        items={[
          {
            question: 'How do AI recommendations integrate with our e-commerce platform?',
            answer:
              'We integrate with common e-commerce platforms (Shopify, WooCommerce, custom) via APIs. Discovery maps your stack and we design recommendation and personalization flows around your catalog and checkout.',
          },
          {
            question: 'How quickly can we launch a demand forecasting pilot?',
            answer:
              'Most demand and inventory pilots launch in 2–4 weeks with scoped SKU-level forecasting and integration to your inventory system.',
          },
          {
            question: 'Can we start with one use case (e.g., chatbot) and expand later?',
            answer:
              'Yes. Many retailers start with AI Customer Support Pro for FAQs and order status, then add personalization, demand forecasting, or lead scoring as they see results.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and 24/7 infrastructure monitoring.',
          },
        ]}
      />

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <a
          href="/industries"
          className="inline-flex items-center text-sm font-medium text-purple-300 hover:text-purple-200"
        >
          ← Back to Industry Solutions
        </a>
      </section>
    </div>
  );
}
