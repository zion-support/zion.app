import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight } from 'lucide-react';
import SolutionPageFAQ from '../../components/SolutionPageFAQ';

export const metadata = {
  title: 'Education & Training AI Solutions | Zion Tech Group',
  description:
    'Scale personalized learning experiences with AI. Deliver adaptive coursework, automate grading workflows, and generate engagement analytics for learners at any scale.',
  alternates: { canonical: '/solutions/education-training' },
};

const educationApps = [
  { name: 'Online Learning Platform', href: '/online-learning-platform' },
  { name: 'AI Knowledge Base', href: '/zion-ai-knowledge-base' },
  { name: 'AI Survey Builder', href: '/zion-ai-survey-builder' },
  { name: 'AI Report Generator', href: '/zion-ai-report-generator' },
];

export default function EducationTrainingSolutionsPage() {
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
            Education & Training{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
              AI Innovations
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Deliver adaptive coursework, automate grading workflows, and generate engagement
            analytics for learners at any scale. Combine AI Knowledge Base, Survey Builder, and
            Report Generator to personalize learning paths and measure outcomes.
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
            Featured AI Apps for Education & Training
          </h2>
          <p className="mt-2 text-slate-300">
            Production-ready tools for adaptive learning, assessment, and analytics in education and
            corporate training.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {educationApps.map((app) => (
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
          <h2 className="mt-2 text-2xl font-bold text-white">Common Education & Training Workflows</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Adaptive Learning Paths</h3>
              <p className="mt-2 text-sm text-slate-300">
                Personalize coursework based on learner progress and gaps. Adjust difficulty and content dynamically for better outcomes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Automated Grading & Assessment</h3>
              <p className="mt-2 text-sm text-slate-300">
                Reduce manual grading with AI-powered assessment. Provide instant feedback and free instructors for higher-value tasks.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Engagement Analytics</h3>
              <p className="mt-2 text-sm text-slate-300">
                Track completion rates, drop-off points, and learning patterns. Identify at-risk learners and improve course design.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Knowledge Base & Support</h3>
              <p className="mt-2 text-sm text-slate-300">
                Deploy AI-powered Q&A and support for learners. Scale support without proportional headcount.
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
          <h2 className="mt-2 text-xl font-bold text-white">University Improves Learning Outcomes 35% with Adaptive AI</h2>
          <p className="mt-2 text-slate-300">
            A university deployed Zion AI Knowledge Base and Survey Builder to deliver adaptive learning paths and automated assessments. Student outcomes improved 35% while instructor workload decreased.
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
        industryName="Education & Training"
        items={[
          {
            question: 'Can we integrate with our existing LMS or student information system?',
            answer:
              'Yes. We integrate with common LMS platforms (Canvas, Moodle, Blackboard, etc.) and SIS. Discovery maps your systems and defines integration scope for content, grades, and analytics.',
          },
          {
            question: 'How does AI handle grading for open-ended or essay questions?',
            answer:
              'Our AI assessment tools support rubrics and criteria-based scoring. For complex essays, we combine AI scoring with human review workflows. Many institutions use hybrid models for quality assurance.',
          },
          {
            question: 'How quickly can we deploy a pilot?',
            answer:
              'Most education pilots (e.g., adaptive learning or automated assessment) launch in 3–4 weeks. We scope a specific course or program and expand based on outcomes.',
          },
          {
            question: 'What support is included after go-live?',
            answer:
              'Runbooks, instructor training, and handoff guidance are included. Enterprise plans add dedicated success managers and ongoing optimization support.',
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
