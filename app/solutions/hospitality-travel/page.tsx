import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';
import { SOLUTION_FAQS } from '../../constants/solutionFAQs';

export const metadata = {
  title: 'Hospitality & Travel AI Solutions | Zion Tech Group',
  description:
    'Personalize guest experiences, optimize operations, and automate demand forecasting for hotels, travel, and hospitality with AI-powered workflows.',
  alternates: { canonical: '/solutions/hospitality-travel' },
};

const hospitalityApps = [
  { name: 'AI Chatbot Builder', href: '/zion-ai-chatbot-builder' },
  { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
  { name: 'AI Sales Predictor', href: '/zion-ai-sales-predictor' },
  { name: 'Smart CRM Automation', href: '/zion-smart-crm-automation' },
  { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
  { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation' },
];

export default function HospitalityTravelSolutionsPage() {
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
            { label: 'Hospitality & Travel' },
          ]}
          className="mb-6"
        />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hospitality & Travel{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Improve booking flows, automate guest communications, and analyze demand patterns with
            AI-powered tools for hotels, travel agencies, and hospitality operations.
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
          <h2 className="text-xl font-bold text-white">
            Featured AI Apps for Hospitality & Travel
          </h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for guest engagement, demand forecasting, and operational
            automation.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hospitalityApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Hospitality & Travel Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Guest Experience & Personalization</h3>
              <p className="mt-2 text-sm text-slate-300">
                Deliver personalized recommendations, automated booking assistance, and 24/7 support with AI chatbots and sentiment analysis.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Demand Forecasting & Revenue</h3>
              <p className="mt-2 text-sm text-slate-300">
                Optimize pricing and occupancy with AI-driven demand prediction. Improve revenue per available room and reduce overbooking.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Operations & Staff Scheduling</h3>
              <p className="mt-2 text-sm text-slate-300">
                Automate staff rostering, housekeeping workflows, and inventory management. Reduce manual coordination and improve efficiency.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Marketing & Campaigns</h3>
              <p className="mt-2 text-sm text-slate-300">
                Run targeted campaigns with AI-powered segmentation. Automate email, social, and retargeting for higher conversion rates.
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
          <h2 className="mt-2 text-xl font-bold text-white">Hotel Chain Increases Direct Bookings 35% with AI Personalization</h2>
          <p className="mt-2 text-slate-300">
            A mid-size hotel group deployed Zion AI Chatbot Builder and Smart CRM Automation to personalize guest communications and reduce OTA dependency. Direct bookings rose 35% while support ticket volume dropped 40%.
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
        industryName="Hospitality & Travel"
        items={SOLUTION_FAQS['hospitality-travel'] ?? []}
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
