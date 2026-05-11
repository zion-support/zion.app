import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, Zap, Globe, Heart, BookOpen, Users, Mail } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { CONTACT_INFO } from '../utils/seoConstants';

export const metadata = {
  title: 'Careers | Zion Tech Group',
  description:
    'Join Zion Tech Group. Build AI products that matter. Remote-first roles in engineering, AI, and product. Competitive benefits, growth opportunities, and a mission-driven team.',
  alternates: { canonical: '/careers' },
};

const values = [
  {
    icon: Zap,
    title: 'Ship with Impact',
    description: 'We build production-ready AI that solves real business problems. Every project has measurable outcomes.',
  },
  {
    icon: Globe,
    title: 'Remote-First',
    description: 'Work from anywhere. We prioritize async communication, flexibility, and results over hours at a desk.',
  },
  {
    icon: Heart,
    title: 'Ownership & Autonomy',
    description: 'Take ownership of your work. We trust our team to make decisions and drive projects forward.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Learning',
    description: 'AI moves fast. We invest in learning, conferences, and experimentation so you stay ahead.',
  },
];

const benefits = [
  'Competitive salary and equity',
  'Remote-first with flexible hours',
  'Health, dental, and vision coverage',
  'Learning budget for courses and conferences',
  'Generous PTO and parental leave',
  'Modern tools and equipment',
  'Annual team retreats',
];

const openRoles = [
  {
    title: 'AI / ML Engineer',
    team: 'Engineering',
    type: 'Full-time, Remote',
    description: 'Build and deploy production AI models. Work on NLP, computer vision, or predictive analytics. You will own model training pipelines, evaluation, and deployment alongside our platform team.',
    applySubject: 'Application: AI/ML Engineer',
  },
  {
    title: 'Full-Stack Engineer',
    team: 'Engineering',
    type: 'Full-time, Remote',
    description: 'Ship Next.js, React, and API solutions. Own features from design to deployment. You will work on our product suite and client implementations with a focus on performance and security.',
    applySubject: 'Application: Full-Stack Engineer',
  },
  {
    title: 'Solutions Architect',
    team: 'Delivery',
    type: 'Full-time, Remote',
    description: 'Design AI implementation roadmaps and lead client engagements from discovery to production. You will run workshops, scope pilots, and hand off to engineering with clear runbooks.',
    applySubject: 'Application: Solutions Architect',
  },
  {
    title: 'Product Manager',
    team: 'Product',
    type: 'Full-time, Remote',
    description: 'Define product strategy, prioritize roadmap, and align engineering with customer needs. You will gather feedback, write specs, and work with design and engineering to ship outcomes.',
    applySubject: 'Application: Product Manager',
  },
];

const whatToExpect = [
  {
    step: 1,
    title: 'Apply',
    description: 'Send your resume and a short note about your background. We review every application.',
  },
  {
    step: 2,
    title: 'Initial conversation',
    description: 'A 30-minute call to discuss your experience, the role, and how we work. No trick questions.',
  },
  {
    step: 3,
    title: 'Technical or case discussion',
    description: 'Role-dependent: a practical exercise or case discussion so we can see how you think and communicate.',
  },
  {
    step: 4,
    title: 'Team fit & offer',
    description: 'Final conversation with the team you would join. We move quickly and respond within 3–5 business days after each step.',
  },
];

export default function CareersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Careers' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Careers at Zion Tech Group
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build AI products that matter
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            We are a remote-first team building production-ready AI applications and engineering
            services. Join us to ship real solutions, learn from experts, and grow with a mission-driven company.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            We hire for impact: engineers who ship production AI, architects who lead client
            engagements, and product people who align roadmaps with customer outcomes. If you
            value clarity, ownership, and continuous learning, you will fit right in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5"
            >
              View Open Roles
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              Learn About Us
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-900/50 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Our culture
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            How we work
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            These principles guide how we build, collaborate, and deliver for our customers.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                  <value.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            A day at Zion
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            What it looks like to work here
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Typical days vary by role, but everyone works async-first with flexible hours. You might
            start with standup or a client sync, then focus on coding, architecture, or product
            planning. We use modern tools (Slack, Notion, GitHub, Figma) and keep meetings
            purposeful so you have time for deep work. Engineers deploy to production; architects
            run discovery workshops; product managers prioritize backlogs with customer input.
            We close loops quickly and support each other when deadlines or complexity ramp up.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            What to expect
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Our hiring process
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We keep the process straightforward and respectful of your time. From application to
            offer, we aim to move quickly and communicate clearly at every step.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatToExpect.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Life at Zion
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Remote-first, outcome-driven
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We work async by default with flexible hours and focus on results. You will ship
            production-ready AI solutions with a team that values clarity, ownership, and
            continuous learning. Annual retreats and a learning budget keep us connected and growing.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
              Benefits
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              We take care of our team
            </h2>
            <p className="mt-3 text-slate-300">
              Competitive compensation, flexibility, and support so you can do your best work.
            </p>
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-slate-200">
                  <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Open Roles</h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              We are always looking for talented engineers, architects, and product people.
            </p>
            <div className="mt-6 space-y-4">
              {openRoles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4"
                >
                  <h3 className="font-semibold text-white">{role.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{role.team} · {role.type}</p>
                  <p className="mt-2 text-sm text-slate-300">{role.description}</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(role.applySubject)}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/20"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Apply now
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Include your resume and a short note about your background. We respond within 3–5 business days.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Diversity & inclusion
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            We welcome everyone
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Zion Tech Group is committed to building a diverse and inclusive team. We do not
            discriminate on the basis of race, color, religion, gender, sexual orientation,
            national origin, age, disability, or any other protected status. We believe diverse
            perspectives make our products and our culture stronger. If you need accommodations
            during the hiring process, please let us know when you apply.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl shadow-purple-900/25 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Don&apos;t see the right role?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            We are always open to meeting talented people. Reach out and tell us how you can contribute.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
