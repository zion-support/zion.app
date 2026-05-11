import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Beauty & Wellness AI Solutions | Zion Tech Group',
  description:
    'Explore AI-driven marketing, SEO, and customer engagement tools for the beauty sector. Transform customer engagement with AI-powered solutions.',
  alternates: { canonical: '/solutions/beauty-wellness' },
};

const beautyWellnessApps = [
  { name: 'AI Image Generator', href: '/zion-ai-image-generator' },
  { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation' },
  { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer' },
  { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
  { name: 'AI Customer Sentiment Tracker', href: '/zion-ai-customer-sentiment-tracker' },
  { name: 'Content Studio', href: '/zion-content-studio' },
];

export default function BeautyWellnessSolutionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Solutions', href: '/solutions' },
            { label: 'Beauty & Wellness' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Beauty & Wellness{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Innovations
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Transform customer engagement with AI-powered solutions. Combine AI Image Generator and AI
            Marketing Automation to create personalized campaigns, optimize SEO with AI SEO Optimizer,
            and deploy AI Chatbot Builder for 24/7 customer support. Achieve 25% higher conversion rates.
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
          <h2 className="text-xl font-bold text-white">Featured AI Apps for Beauty & Wellness</h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for marketing, SEO, and customer engagement in the beauty sector.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {beautyWellnessApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Beauty & Wellness Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Personalized Marketing</h3>
              <p className="mt-2 text-sm text-slate-300">
                Create tailored campaigns with AI-driven segmentation. Generate on-brand visuals and optimize ad performance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">SEO & Discovery</h3>
              <p className="mt-2 text-sm text-slate-300">
                Improve search visibility with AI SEO optimization. Target the right keywords and content for beauty and wellness audiences.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Customer Engagement</h3>
              <p className="mt-2 text-sm text-slate-300">
                Deploy 24/7 chatbots for booking, product advice, and support. Increase conversion and reduce response time.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Visual Content Creation</h3>
              <p className="mt-2 text-sm text-slate-300">
                Generate product imagery and social content at scale. Maintain brand consistency while reducing production costs.
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
          <h2 className="mt-2 text-xl font-bold text-white">Beauty Brand Increases Conversion 25% with AI Personalization</h2>
          <p className="mt-2 text-slate-300">
            A beauty and wellness brand deployed Zion AI Marketing Automation and Chatbot Builder to personalize product recommendations and automate support. Conversion rates rose 25% while support costs dropped.
          </p>
          <a
            href="/case-studies#industry=Consumer%20Goods"
            className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            View case studies
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <SolutionPageFAQ
        industryName="Beauty & Wellness"
        items={[
          {
            question: 'How do AI solutions integrate with our existing ecommerce or booking platform?',
            answer:
              'We integrate with common ecommerce platforms (Shopify, WooCommerce, etc.) and booking systems. Discovery maps your stack and defines integration scope for marketing, CRM, and support tools.',
          },
          {
            question: 'Can we use AI for personalized product recommendations?',
            answer:
              'Yes. AI Marketing Automation and Chatbot Builder can personalize recommendations based on browsing behavior, purchase history, and preferences. Many beauty brands see 20–30% lift in conversion.',
          },
          {
            question: 'How quickly can we launch a pilot?',
            answer:
              'Most marketing and chatbot pilots launch in 2–4 weeks. We scope a focused use case (e.g., product Q&A or booking automation) and expand from there based on results.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, team training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
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
