import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, Handshake, Zap, Users, Award, Check, HelpCircle } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { CONTACT_INFO } from '../utils/seoConstants';

export const metadata = {
  title: 'Partners | Zion Tech Group',
  description:
    'Join the Zion Tech Group partner program. Reseller, technology, and implementation partners. Co-sell opportunities, training, and go-to-market support.',
  alternates: { canonical: '/partners' },
};

const partnerTiers = [
  {
    name: 'Technology Partner',
    icon: Zap,
    description: 'Integrate Zion AI apps with your platform or product.',
    benefits: [
      'API access and technical documentation',
      'Co-marketing opportunities',
      'Joint solution development support',
      'Listing in partner directory',
    ],
  },
  {
    name: 'Implementation Partner',
    icon: Users,
    description: 'Deploy and customize Zion solutions for your clients.',
    benefits: [
      'Certification and training program',
      'Deal registration and margin',
      'Implementation playbooks and runbooks',
      'Dedicated partner support',
    ],
  },
  {
    name: 'Reseller Partner',
    icon: Handshake,
    description: 'Sell Zion AI apps and services to your customer base.',
    benefits: [
      'Recurring revenue share',
      'Sales enablement and collateral',
      'Pilot and POC support',
      'Quarterly business reviews',
    ],
  },
];

const whyPartner = [
  '60+ production-ready AI apps across 41 industries',
  'Security-first architecture and compliance support',
  'Proven delivery paths: pilot, rollout, optimization',
  'Strong demand for outcome-driven AI solutions',
];

const partnerOutcomes = [
  {
    title: 'Faster time to revenue',
    description:
      'Partners leverage our app library and implementation playbooks to close deals and deliver production pilots in weeks, not months.',
  },
  {
    title: 'Differentiated offerings',
    description:
      'Stand out with AI solutions that map to industry workflows and compliance requirements — not generic tooling.',
  },
  {
    title: 'Ongoing support',
    description:
      'Access to documentation, training, and dedicated partner support so you can scale implementations and keep clients successful.',
  },
];

const partnerFaq = [
  {
    q: 'Who can become a partner?',
    a: 'Technology partners (ISVs, platforms), implementation partners (consultancies, system integrators), and reseller partners (solution providers selling to enterprises) are all welcome. We look for alignment on security, delivery quality, and customer success.',
  },
  {
    q: 'Is there a fee to join the partner program?',
    a: 'There is no upfront fee. Partnership terms, including revenue share and certification requirements, are discussed during the onboarding call based on your tier and focus area.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most partners complete onboarding within 1–2 weeks. You receive access to documentation, training materials, and support channels. Implementation and reseller partners can request deal registration and playbooks immediately after onboarding.',
  },
  {
    q: 'Do you offer co-marketing and lead sharing?',
    a: 'Yes. Technology and implementation partners can access co-marketing opportunities, joint case studies, and referral paths. We work with partners to align on messaging and lead handoff so both sides can track pipeline and outcomes.',
  },
];

const partnerStories = [
  {
    quote: 'We closed three enterprise pilots in the first quarter after onboarding. The playbooks and deal registration made it easy to position Zion and deliver quickly.',
    role: 'Implementation Partner',
  },
  {
    quote: 'Integrating Zion AI into our platform took less time than we expected. The API docs and support were clear, and our joint customers see real ROI from day one.',
    role: 'Technology Partner',
  },
  {
    quote: 'Recurring revenue share and sales enablement let us add AI solutions to our portfolio without building from scratch. Our clients get production-ready apps; we get a differentiated offering.',
    role: 'Reseller Partner',
  },
];

const partnerStats = [
  { value: '60+', label: 'AI Apps', note: 'Production-ready for partner delivery' },
  { value: '41', label: 'Industries', note: 'Industry-specific playbooks and solutions' },
  { value: '1–2 weeks', label: 'Onboarding', note: 'Typical time to partner readiness' },
];

const partnerResources = [
  { title: 'Partner portal & documentation', description: 'Central access to playbooks, API docs, and certification materials.', href: '/contact' },
  { title: 'Deal registration', description: 'Register opportunities for margin and co-sell support.', href: '/contact' },
  { title: 'Co-marketing kit', description: 'Collateral, case studies, and joint campaign support.', href: '/contact' },
];

export default function PartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Partners' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner Program
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Grow with Zion Tech Group
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Join our partner ecosystem to deliver production-ready AI solutions to your clients.
            Technology, implementation, and reseller partners get access to training, co-sell
            opportunities, and go-to-market support.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Whether you integrate our APIs, deploy for clients, or sell Zion solutions to your
            customer base, we provide certification, deal registration, and ongoing support so
            you can win more deals and deliver with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
            >
              Apply to Partner
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner program at a glance
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            What you get when you partner with Zion
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Our partner program is designed to help you win more deals and deliver with confidence — from technical integration to go-to-market support.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {partnerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5 text-center"
              >
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{stat.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner resources
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Tools and support for every partner
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Once onboarded, partners get access to documentation, deal registration, and co-marketing support to accelerate pipeline and delivery.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {partnerResources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                className="group rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5 transition hover:border-purple-400/50"
              >
                <h3 className="font-semibold text-white group-hover:text-purple-200">{resource.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{resource.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner tiers
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Choose the right fit for your business
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Whether you build technology, implement solutions, or sell to enterprises, we have a
            partner path for you.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {partnerTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-6 shadow-lg shadow-black/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15">
                  <tier.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{tier.description}</p>
                <ul className="mt-4 space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-slate-200">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-900/50 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Why partner with us</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-300">
            Zion Tech Group offers a differentiated AI platform with proven outcomes across
            industries. Partners benefit from our product depth and delivery rigor.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whyPartner.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-200">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner outcomes
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            What partners achieve with Zion
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Technology, implementation, and reseller partners use our platform to deliver faster,
            win more deals, and keep clients successful with ongoing support.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {partnerOutcomes.map((outcome) => (
              <div
                key={outcome.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <h3 className="text-lg font-semibold text-white">{outcome.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{outcome.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Partner success stories
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            What partners say about working with Zion
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Technology, implementation, and reseller partners use our platform to deliver faster,
            win more deals, and keep clients successful. Here is what they tell us.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {partnerStories.map((story, i) => (
              <blockquote
                key={i}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <p className="text-sm leading-6 text-slate-200">&ldquo;{story.quote}&rdquo;</p>
                <footer className="mt-3 text-xs font-medium text-slate-400">{story.role}</footer>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Partner program FAQ</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-300">
            Common questions about eligibility, onboarding, and ongoing support.
          </p>
          <dl className="mt-6 space-y-6">
            {partnerFaq.map((faq) => (
              <div key={faq.q} className="border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                <dt className="text-base font-semibold text-white">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-300">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How to apply
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Get started as a partner
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Tell us about your company, your focus area, and how you plan to work with Zion Tech
            Group. Our team will review and schedule an intro call.
          </p>
          <ol className="mt-6 space-y-4">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">
                1
              </span>
              <div>
                <span className="font-semibold text-white">Submit your application</span>
                <p className="mt-1 text-sm text-slate-300">
                  Use the contact form and select &quot;Partner Inquiry&quot; or email us directly.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">
                2
              </span>
              <div>
                <span className="font-semibold text-white">Intro call</span>
                <p className="mt-1 text-sm text-slate-300">
                  We review your application and schedule a call to discuss fit and next steps.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">
                3
              </span>
              <div>
                <span className="font-semibold text-white">Onboarding</span>
                <p className="mt-1 text-sm text-slate-300">
                  Access training, documentation, and support based on your partner tier.
                </p>
              </div>
            </li>
          </ol>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-pink-500"
          >
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to become a partner?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Reach out to discuss your goals and how we can work together.
          </p>
          <a
            href={`mailto:${CONTACT_INFO.email}?subject=Partner%20Program%20Inquiry`}
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {CONTACT_INFO.email}
          </a>
        </div>
      </section>
    </div>
  );
}
