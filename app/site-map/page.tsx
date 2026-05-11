import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import {
  PRIMARY_NAV_LINKS,
  SOLUTION_LINKS,
  RESOURCE_LINKS,
  AI_SERVICE_LINKS,
  FEATURED_PRODUCT_LINKS,
} from '../constants/navigation';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Sitemap | Zion Tech Group',
  description:
    'Browse all pages and sections of Zion Tech Group: solutions, services, AI products, resources, and company information.',
  alternates: { canonical: '/site-map' },
};

const SECTION_LABELS: Record<string, string> = {
  primary: 'Main navigation',
  solutions: 'Solutions',
  resources: 'Company & resources',
  aiServices: 'AI services',
  products: 'Products',
};

export default function SiteMapPage() {
  const base = 'https://ziontechgroup.com';

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-5xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sitemap' },
          ]}
          className="mb-6"
        />
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sitemap
          </h1>
          <p className="mt-3 text-slate-300">
            Browse all sections and key pages of Zion Tech Group. Find solutions by category or industry,
            explore AI services and products, and jump to company resources. For crawlers, use{' '}
            <a
              href={`${base}/sitemap.xml`}
              className="font-medium text-purple-300 underline hover:text-purple-200"
            >
              sitemap.xml
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-slate-400 max-w-2xl">
            Use this page to quickly navigate the site: main nav and pricing at the top, solutions
            and industries next, then company and resources (blog, case studies, about, contact,
            partners). AI services and featured products are listed below with links to full
            catalogs. For a machine-readable list of all URLs, use the XML sitemap linked above.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">
              {SECTION_LABELS.primary}
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Main navigation: home, solutions, pricing, contact, and key entry points.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {PRIMARY_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 underline decoration-purple-400/50 underline-offset-2 hover:text-purple-200 hover:decoration-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">
              {SECTION_LABELS.solutions}
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Industry-specific solution pages: healthcare, financial services, manufacturing, and more.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 underline decoration-purple-400/50 underline-offset-2 hover:text-purple-200 hover:decoration-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">
              {SECTION_LABELS.resources}
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Company and resources: blog, press, case studies, about, contact, and legal.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 underline decoration-purple-400/50 underline-offset-2 hover:text-purple-200 hover:decoration-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">
              {SECTION_LABELS.aiServices} (sample)
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Advanced AI services: generative AI, RAG, agents, governance, observability, and more.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {AI_SERVICE_LINKS.slice(0, 18).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 underline decoration-purple-400/50 underline-offset-2 hover:text-purple-200 hover:decoration-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              <a href="/ai-services" className="text-purple-300 hover:underline">
                View all AI services →
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white">
              {SECTION_LABELS.products} (featured)
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Featured Zion AI apps: chatbot, document processor, lead scoring, DevOps, and more.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 underline decoration-purple-400/50 underline-offset-2 hover:text-purple-200 hover:decoration-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              <a href="/products" className="text-purple-300 hover:underline">
                View all products →
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-xl border border-purple-500/20 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Machine-readable sitemap</h2>
          <p className="mt-2 text-sm text-slate-400">
            For search engines and crawlers, the full XML sitemap is available at:
          </p>
          <a
            href={`${base}/sitemap.xml`}
            className="mt-2 inline-block font-mono text-sm text-purple-300 hover:underline"
          >
            {base}/sitemap.xml
          </a>
        </div>
      </section>
    </div>
  );
}
