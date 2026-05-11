import React from 'react';
import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Zap } from 'lucide-react';
import { CONTACT_INFO } from '../utils/seoConstants';
import ContactFormClient from '../components/ContactFormClient';
import Breadcrumb from '../components/Breadcrumb';
import QRContact from '../components/QRContact';

export const metadata = {
  title: 'Contact | Zion Tech Group',
  description:
    'Get in touch with Zion Tech Group to start a project, book a discovery call, or request a pilot quote for AI apps and engineering services.',
  alternates: { canonical: '/contact' },
};

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT_INFO.phone,
    href: `tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`,
    description: 'Mon-Fri, 9am-6pm ET',
    external: false,
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    description: 'We reply within 24 hours',
    external: false,
  },
  {
    icon: MapPin,
    label: 'Office',
    value: `${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zipCode}`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zipCode}`)}`,
    description: 'By appointment only',
    external: true,
  },
];

const engagementOptions = [
  {
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'Walk through your goals and current stack with a Zion specialist. No pressure, just clarity.',
    cta: 'Book a 30-min call',
    duration: '30 min',
  },
  {
    icon: Zap,
    title: 'Quick Start Workshop',
    description: 'A focused session to identify your highest-value AI use case and draft an implementation plan.',
    cta: 'Request a workshop',
    duration: '2 hrs',
  },
  {
    icon: Clock,
    title: 'Full Roadmap Engagement',
    description: 'End-to-end discovery, pilot scoping, and delivery planning with a dedicated Zion team.',
    cta: 'Start roadmap planning',
    duration: '1-2 weeks',
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} className="mb-6" />
        <QRContact />
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Get in touch
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Start Your AI Journey
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Whether you need a discovery call, a technical workshop, or a full delivery roadmap, our team is ready to help.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              {...(method.external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 text-center transition hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15">
                <method.icon className="h-6 w-6 text-purple-400" />
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-purple-300">
                {method.label}
              </p>
              <p className="mt-2 text-base font-medium text-white group-hover:text-purple-200">
                {method.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{method.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="engagement" className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <ContactFormClient />

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
                Engagement options
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Choose the right starting point
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Pick the engagement that fits your timeline and decision stage.
              </p>
            </div>

            {engagementOptions.map((option) => (
              <div
                key={option.title}
                className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-5 transition hover:border-purple-400/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/15">
                    <option.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{option.title}</h3>
                      <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300">
                        {option.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{option.description}</p>
                    <p className="mt-3 text-sm font-semibold text-purple-300 transition group-hover:text-purple-200">
                      {option.cta} →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            What to expect
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            From first contact to next steps
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We respond within 24 hours. Most teams start with a discovery call to align goals, then move to a workshop or pilot scoping — no commitment required.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">1. Reply within 24h</h3>
              <p className="mt-2 text-sm text-slate-300">
                We confirm receipt and suggest a time for a discovery call or workshop.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">2. Discovery or workshop</h3>
              <p className="mt-2 text-sm text-slate-300">
                We map your goals to the right Zion apps and delivery path. No pressure, just clarity.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">3. Next steps</h3>
              <p className="mt-2 text-sm text-slate-300">
                You decide: pilot, full roadmap, or just explore. We provide a clear path either way.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Why teams reach out
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Common reasons we hear
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Whether you are exploring your first AI use case or scaling existing automation, we help you choose the right starting point and delivery path.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
              <span className="mt-1 block h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-200">Need a discovery workshop to prioritize AI use cases and align stakeholders.</span>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
              <span className="mt-1 block h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-200">Ready to scope a pilot (e.g., chatbot, document automation, or analytics) with clear KPIs.</span>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
              <span className="mt-1 block h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-200">Want to understand pricing, timelines, and how Zion fits with your existing tools.</span>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
              <span className="mt-1 block h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-200">Looking for industry-specific solutions (e.g., healthcare, financial services, manufacturing).</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Common questions about getting in touch
          </h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-5">
              <h3 className="font-semibold text-white">How quickly will I hear back?</h3>
              <p className="mt-2 text-sm text-slate-300">We respond within 24 hours and typically suggest a discovery call time within 1–2 business days.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-5">
              <h3 className="font-semibold text-white">Is there a cost for a discovery call or workshop?</h3>
              <p className="mt-2 text-sm text-slate-300">Discovery calls are free with no obligation. Quick Start Workshops and Full Roadmap engagements are scoped separately; we will outline options after the first conversation.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-5">
              <h3 className="font-semibold text-white">What should I prepare before reaching out?</h3>
              <p className="mt-2 text-sm text-slate-300">A short description of your goals (e.g., reduce support volume, automate documents, scale AI pilots) and your timeline helps us tailor the conversation. No formal deck or RFP required.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-5">
              <h3 className="font-semibold text-white">Do you work with companies outside the US?</h3>
              <p className="mt-2 text-sm text-slate-300">Yes. We work with teams globally. Discovery calls can be scheduled across time zones; implementation is remote-first with optional on-site workshops for larger engagements.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to explore what AI can do for your team?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            No commitment required. Start with a quick discovery conversation and see where it leads.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/solutions"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore Solutions
            </a>
            <a
              href="/pricing"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
