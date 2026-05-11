import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, FileText, Image, Download, Mail } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { CONTACT_INFO } from '../utils/seoConstants';

export const metadata = {
  title: 'Press & Media | Zion Tech Group',
  description:
    'Press releases, media kit, logos, executive bios, and media contact for Zion Tech Group. Access AI product news, launch updates, and resources for journalists and analysts.',
  openGraph: {
    title: 'Press & Media | Zion Tech Group',
    description:
      'Explore Zion Tech Group press releases, media kit assets, and executive resources covering advanced AI services and production deployments.',
    url: '/press',
  },
  alternates: { canonical: '/press' },
};

const pressReleases = [
  {
    date: '2026-03-01',
    title: 'Zion Tech Group Expands AI Solutions to 47+ Industry Verticals',
    excerpt:
      'Zion now supports 47+ industry verticals, including Staffing & Recruiting and Facilities & Property Management, with outcome-focused AI workflows.',
    href: '/blog',
  },
  {
    date: '2025-11-15',
    title: 'AI Accounting & Tax Hub Launches for Professional Services',
    excerpt:
      'New innovation bundle combines document automation, compliance tracking, and workflow optimization for accounting firms.',
    href: '/blog',
  },
  {
    date: '2025-01-20',
    title: 'Zion Tech Group Reaches 60+ Production-Ready AI Applications',
    excerpt:
      'Platform milestone reflects growing demand for outcome-driven AI deployment across growth, engineering, security, and operations.',
    href: '/blog',
  },
  {
    date: '2024-12-10',
    title: 'Zion Introduces AI Governance & Trust Suite for Regulated Industries',
    excerpt:
      'Policy enforcement, bias monitoring, and audit-ready workflows help enterprises align with EU AI Act and sector-specific compliance requirements.',
    href: '/blog',
  },
  {
    date: '2024-11-18',
    title: 'Supply Chain Intelligence Bundle Targets Logistics and Manufacturing',
    excerpt:
      'Unified demand forecasting, inventory optimization, and predictive maintenance for end-to-end supply chain and fleet operations.',
    href: '/blog',
  },
  {
    date: '2024-10-22',
    title: 'Zion Tech Group Launches Revenue Command Center for Sales and Marketing',
    excerpt:
      'AI Lead Scoring, Email Marketing Pro, and Smart CRM Automation combine to accelerate pipeline velocity and conversion.',
    href: '/blog',
  },
];

const mediaKitItems = [
  {
    icon: Image,
    title: 'Logos & Brand Assets',
    description: 'Zion Tech Group logos in PNG and SVG formats for light and dark backgrounds.',
  },
  {
    icon: FileText,
    title: 'Company Overview',
    description: 'One-page fact sheet with key stats, offerings, and differentiators.',
  },
  {
    icon: Download,
    title: 'Product Screenshots',
    description: 'High-resolution screenshots of Zion AI apps and dashboards.',
  },
];

export default function PressPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Press' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Press & Media
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            News, resources, and media contact
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Zion Tech Group builds production-ready AI applications for businesses across 41 industry
            verticals. Find press releases, media kit assets, and contact information for journalists
            and analysts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Media%20Inquiry`}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
            >
              <Mail className="mr-2 h-4 w-4" />
              Media Inquiries
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              About Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Recent news
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Press releases and announcements
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Latest company news, product launches, and industry milestones.
          </p>
          <div className="mt-8 space-y-6">
            {pressReleases.map((release) => (
              <div
                key={release.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5 transition hover:border-purple-400/40"
              >
                <time
                  dateTime={release.date}
                  className="text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  {new Date(release.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h3 className="mt-2 text-lg font-semibold text-white">{release.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{release.excerpt}</p>
                <a
                  href={release.href}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
                >
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-900/50 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Media kit
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Logos, fact sheets, and assets
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Download brand assets and company information for your coverage.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {mediaKitItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                  <item.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                <a
                  href={`mailto:${CONTACT_INFO.email}?subject=Media%20Kit%20Request%3A%20${encodeURIComponent(item.title)}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
                >
                  Request assets
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Quick facts
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            About Zion Tech Group
          </h2>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
              60+ production-ready AI applications across growth, engineering, security, and operations
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
              41 industry verticals with tailored solutions and compliance support
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
              Remote-first team delivering secure, outcome-driven AI implementations
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
              48-hour discovery kickoff; 2–4 week pilots for validation
            </li>
          </ul>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-900/50 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Coverage &amp; mentions
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Where Zion appears
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Zion Tech Group is regularly featured in industry reports, analyst coverage, and partner channels. For quotes, data, or interviews, contact our media team.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Industry &amp; analyst</h3>
              <p className="mt-2 text-sm text-slate-300">
                AI and enterprise software analysts, industry publications, and research firms covering automation, security, and AI adoption.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Partners &amp; events</h3>
              <p className="mt-2 text-sm text-slate-300">
                Conference talks, webinars, and co-marketing with technology and consulting partners. Request a speaker or panel participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Media inquiries
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            For press, analyst, or partnership inquiries, reach out to our team.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Media%20Inquiry`}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {CONTACT_INFO.email}
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {CONTACT_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
