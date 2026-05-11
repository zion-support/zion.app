import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbItem } from './Breadcrumb';

export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductUseCase = {
  title: string;
  description: string;
  icon: string;
};

export type ProductPageData = {
  title: string;
  category: string;
  description: string;
  iconEmoji: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  benefits: string[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  breadcrumb?: { label: string; href?: string }[];
  caseStudy?: { title: string; description: string; ctaLabel?: string };
};

export type ProductPageLayoutProps = {
  data: ProductPageData;
  breadcrumbItems?: BreadcrumbItem[];
};

export default function ProductPageLayout({ data, breadcrumbItems }: ProductPageLayoutProps) {
  const ctaLabel = data.ctaLabel ?? 'Start a Project';
  const ctaHref = data.ctaHref ?? '/contact?topic=project&source=product-page';
  const secondaryCtaLabel = data.secondaryCtaLabel ?? 'View Pricing';
  const secondaryCtaHref = data.secondaryCtaHref ?? '/pricing';

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-[18rem] w-[18rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <section className="relative container-page pb-12 pt-20 lg:pt-24">
        {((data.breadcrumb && data.breadcrumb.length > 0) || (breadcrumbItems && breadcrumbItems.length > 0)) && (
          <Breadcrumb
            items={
              data.breadcrumb && data.breadcrumb.length > 0
                ? data.breadcrumb.map((b) => (b.href ? { label: b.label, href: b.href } : { label: b.label }))
                : breadcrumbItems!
            }
            className="mb-6"
          />
        )}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-300/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-100 shadow-[0_0_0_1px_rgba(168,85,247,0.18)]">
            <span>{data.iconEmoji}</span>
            <span>{data.category}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {data.description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={ctaHref}
              data-cta-event="cta_primary"
              data-cta-label="product_page_hero"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
            >
              {ctaLabel}
            </a>
            <a
              href={secondaryCtaHref}
              data-cta-event="cta_secondary"
              data-cta-label="product_page_hero"
              className="inline-flex items-center rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              {secondaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="relative container-page py-12">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Capabilities
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Key Features
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Built for production teams that need reliability, security, and measurable outcomes.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/10 text-lg font-bold text-purple-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.useCases.length > 0 && (
        <section className="relative container-page py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Applications
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Common Use Cases
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            How teams are using {data.title} to drive business outcomes.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-400/40"
              >
                <span className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-3xl">
                  {useCase.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="relative container-page py-12">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
                Why {data.title}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Business Impact
              </h2>
              <p className="mt-3 text-slate-300">
                Measurable improvements that compound over time.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                >
                  <span className="mt-0.5 block h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {data.caseStudy && (
        <section className="relative container-page py-12">
          <div className="rounded-3xl border border-purple-500/20 bg-slate-900/65 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
              Case study
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">{data.caseStudy.title}</h2>
            <p className="mt-2 text-slate-300">{data.caseStudy.description}</p>
            <a
              href="/case-studies"
              className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
            >
              {data.caseStudy.ctaLabel ?? 'View case studies'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>
      )}

      <section className="relative container-page pb-24 pt-12">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started with {data.title}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Talk to our team about how {data.title} fits into your delivery roadmap.
            We will help you scope priorities and plan a practical rollout.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact?topic=project&source=product-page-bottom"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              data-cta-event="cta_primary"
              data-cta-label="product_page_bottom"
            >
              Start a Project
            </a>
            <a
              href="/solutions"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
