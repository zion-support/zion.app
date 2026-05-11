'use client';

import React, { useState } from 'react';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

type CompanySize = 'small' | 'mid' | 'enterprise';
type MotionType = 'net-new' | 'expansion' | 'modernization';
type PrimaryObjective = 'revenue' | 'operations' | 'engineering' | 'experience' | 'compliance';

interface RolloutFormState {
  role: string;
  companySize: CompanySize;
  industry: string;
  motion: MotionType;
  objective: PrimaryObjective;
  regulated: boolean;
}

interface Phase {
  title: string;
  window: string;
  focus: string;
  actions: string[];
}

interface RolloutBlueprint {
  label: string;
  summary: string;
  kickoffWindow: string;
  primaryZionModules: { name: string; href: string }[];
  phases: Phase[];
}

function buildBlueprint(input: RolloutFormState): RolloutBlueprint {
  if (input.regulated) {
    return {
      label: 'Compliance-Ready AI Delivery Pod',
      summary:
        'Start with a hardened foundation, add policy-aware checks, and then scale use cases that your risk and legal teams can support.',
      kickoffWindow: input.companySize === 'enterprise' ? '8–12 weeks' : '4–8 weeks',
      primaryZionModules: [
        { name: 'AI Regulated Industries', href: '/ai-services/ai-regulated-industries' },
        { name: 'AI Governance & Trust', href: '/ai-services/ai-governance-trust' },
        { name: 'AI Security & Responsible AI', href: '/ai-services/ai-security-responsible-ai' },
      ],
      phases: [
        {
          title: 'Phase 0 · Guardrails & architecture',
          window: 'Weeks 0–2',
          focus: 'Clarify risk posture and data boundaries before any pilots go live.',
          actions: [
            'Map systems, data flows, and high-risk touchpoints with security and legal.',
            'Pick initial AI surfaces where data sensitivity is low but value is clear.',
            'Stand up a minimal governance checklist and review cadence.',
          ],
        },
        {
          title: 'Phase 1 · Low-risk pilot',
          window: 'Weeks 2–6',
          focus: 'Launch a constrained, high-signal pilot that validates value and controls.',
          actions: [
            'Ship one workflow (e.g., document triage or internal knowledge search) behind clear access controls.',
            'Instrument quality, latency, and human override paths.',
            'Run security, accessibility, and UX audits on the pilot experience.',
          ],
        },
        {
          title: 'Phase 2 · Scale-out with patterns',
          window: 'Weeks 6–12',
          focus: 'Generalize patterns from the pilot into reusable blueprints.',
          actions: [
            'Clone successful patterns to adjacent teams with similar risk profiles.',
            'Automate policy checks, logging, and observability for all AI endpoints.',
            'Introduce regular model and prompt reviews with stakeholders.',
          ],
        },
      ],
    };
  }

  if (input.objective === 'revenue') {
    return {
      label: 'Revenue Command Center',
      summary:
        'Align lead capture, scoring, and lifecycle journeys into one accountable revenue workspace.',
      kickoffWindow: input.companySize === 'enterprise' ? '6–10 weeks' : '4–8 weeks',
      primaryZionModules: [
        { name: 'Zion Smart CRM Automation', href: '/zion-smart-crm-automation' },
        { name: 'Zion AI Lead Scoring', href: '/zion-ai-lead-scoring' },
        { name: 'Zion AI Email Marketing Pro', href: '/zion-ai-email-marketing-pro' },
      ],
      phases: [
        {
          title: 'Phase 1 · Signal & scoring',
          window: 'Weeks 0–4',
          focus: 'Consolidate lead signals and create a single scoring view.',
          actions: [
            'Connect website forms, chat, and key campaigns into one intake flow.',
            'Define scoring rules and AI features that matter for your ICP.',
            'Expose scores to sales in your existing CRM with minimal behavior change.',
          ],
        },
        {
          title: 'Phase 2 · Lifecycle automation',
          window: 'Weeks 4–8',
          focus: 'Automate follow-ups and nurture flows based on behavior and score.',
          actions: [
            'Ship AI-drafted sequences for key segments (e.g., new leads, PQLs, churn-risk).',
            'Add guardrails so humans can approve or edit high-impact messages.',
            'Measure conversion and cycle time improvements versus your baseline.',
          ],
        },
        {
          title: 'Phase 3 · Full revenue command center',
          window: 'Weeks 8–12',
          focus: 'Create a shared view for marketing, sales, and success.',
          actions: [
            'Surface pipeline health, top-performing journeys, and at-risk segments.',
            'Promote proven flows into playbooks your teams can reuse and adapt.',
            'Feed learnings back into your website, pricing, and onboarding flows.',
          ],
        },
      ],
    };
  }

  if (input.objective === 'operations') {
    return {
      label: 'Autonomous Operations Desk',
      summary:
        'Turn messy documents, tickets, and meetings into a predictable, automated back office.',
      kickoffWindow: '4–8 weeks',
      primaryZionModules: [
        { name: 'Zion Workflow Automation', href: '/zion-workflow-automation' },
        { name: 'Zion AI Document Processor', href: '/zion-ai-document-processor' },
        { name: 'Zion AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
      ],
      phases: [
        {
          title: 'Phase 1 · Intake & triage',
          window: 'Weeks 0–3',
          focus: 'Create one front door for repetitive operational work.',
          actions: [
            'Pick one or two high-volume processes (e.g., invoices, requests, notes).',
            'Standardize intake with forms, tags, and templates.',
            'Route work to the right queues and owners automatically.',
          ],
        },
        {
          title: 'Phase 2 · Automation loops',
          window: 'Weeks 3–7',
          focus: 'Automate reading, enrichment, and simple decisions.',
          actions: [
            'Use AI to extract key fields from documents and meeting notes.',
            'Introduce auto-responses for low-risk, repeatable scenarios.',
            'Add exception handling so humans can rescue edge cases quickly.',
          ],
        },
        {
          title: 'Phase 3 · Continuous optimization',
          window: 'Weeks 7–12',
          focus: 'Measure cycle times and expand to adjacent workflows.',
          actions: [
            'Track throughput and SLA adherence for automated vs. manual paths.',
            'Feed learnings into playbooks that new teams can adopt.',
            'Run regular audits to keep performance and quality high.',
          ],
        },
      ],
    };
  }

  if (input.objective === 'engineering') {
    return {
      label: 'Engineering Velocity Sprint',
      summary:
        'Pair AI-assisted coding, review, and release checks to increase throughput without sacrificing reliability.',
      kickoffWindow: '3–6 weeks',
      primaryZionModules: [
        { name: 'Zion DevOps Automation', href: '/zion-devops-automation' },
        { name: 'Zion AI Code Assistant', href: '/zion-ai-code-assistant' },
        { name: 'Zion AI Code Reviewer', href: '/zion-ai-code-reviewer' },
      ],
      phases: [
        {
          title: 'Phase 1 · Guardrails in CI',
          window: 'Weeks 0–2',
          focus: 'Start with low-friction improvements in your existing pipelines.',
          actions: [
            'Add AI-assisted linting, type-checking, and test suggestions to CI.',
            'Define what “good enough” looks like for diffs and code review hints.',
            'Roll out to a single team or service before broad adoption.',
          ],
        },
        {
          title: 'Phase 2 · Assisted delivery',
          window: 'Weeks 2–5',
          focus: 'Introduce AI into day-to-day development flows.',
          actions: [
            'Use AI to propose refactors and regression tests for risky areas.',
            'Enable playbooks for common chores (e.g., migrations, boilerplate).',
            'Track developer sentiment and productivity changes over time.',
          ],
        },
        {
          title: 'Phase 3 · Reliability and learning loops',
          window: 'Weeks 5–8',
          focus: 'Close the loop between incidents, changes, and AI suggestions.',
          actions: [
            'Correlate incident data with code changes and test coverage.',
            'Use AI to suggest hardening tests and guardrails in problematic areas.',
            'Publish internal docs on where AI helps most and where humans must lead.',
          ],
        },
      ],
    };
  }

  return {
    label: 'AI Strategy Fast Track',
    summary:
      'Align stakeholders on a realistic, de-risked starting point for AI and turn it into a concrete 90-day plan.',
    kickoffWindow: '4–6 weeks',
    primaryZionModules: [
      { name: 'AI Strategy & Roadmap', href: '/ai-services/ai-strategy-roadmap' },
      {
        name: 'Advanced AI Enterprise Intelligence Hub',
        href: '/ai-services/advanced-ai-enterprise-intelligence-hub',
      },
      { name: 'AI Integration & APIs', href: '/ai-services/ai-integration-apis' },
    ],
    phases: [
      {
        title: 'Phase 1 · Discovery & mapping',
        window: 'Weeks 0–2',
        focus: 'Capture initiatives, constraints, and quick wins in one place.',
        actions: [
          'Interview 3–5 stakeholders across business, data, and technology.',
          'List candidate use cases and cluster them by value vs. complexity.',
          'Agree on 1–3 “no-regret” starting bets.',
        ],
      },
      {
        title: 'Phase 2 · First live experiment',
        window: 'Weeks 2–4',
        focus: 'Ship one narrow, measurable AI experience end to end.',
        actions: [
          'Pick a use case with clear metrics and controllable scope.',
          'Ship a small vertical slice that users can actually touch.',
          'Collect feedback and refine acceptance criteria for next iterations.',
        ],
      },
      {
        title: 'Phase 3 · 90-day portfolio',
        window: 'Weeks 4–12',
        focus: 'Turn the most promising ideas into a prioritized portfolio.',
        actions: [
          'Rank initiatives by impact, effort, and risk.',
          'Define ownership, success metrics, and checkpoints for each.',
          'Align leadership on investments beyond the initial 90 days.',
        ],
      },
    ],
  };
}

export default function RolloutBlueprintPage() {
  const [form, setForm] = useState<RolloutFormState>({
    role: '',
    companySize: 'mid',
    industry: '',
    motion: 'net-new',
    objective: 'revenue',
    regulated: false,
  });

  const blueprint = buildBlueprint(form);

  return (
    <div className="bg-slate-950/90">
      <AILabToolLayout
        title="AI Rollout Blueprint Generator"
        subtitle="Describe your team, motion, and goals. This tool assembles a phased rollout blueprint using Zion modules and the same patterns we recommend to clients."
      >
        <div className="grid gap-8 lg:grid-cols-5">
          <form
            className="space-y-5 lg:col-span-2 lg:border-r lg:border-slate-800/80 lg:pr-6"
            aria-label="AI rollout blueprint inputs"
          >
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-medium uppercase tracking-wide text-slate-200"
              >
                Your role
              </label>
              <p className="mt-1 text-[11px] text-slate-400">
                How you show up in this initiative (e.g., CTO, founder, ops lead, head of data).
              </p>
              <input
                id="role"
                type="text"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
                placeholder="Example: VP of Operations"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                  Company size
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  {([
                    ['small', '0–50'],
                    ['mid', '51–500'],
                    ['enterprise', '500+'],
                  ] as [CompanySize, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          companySize: value,
                        }))
                      }
                      className={`rounded-full border px-2.5 py-1 font-medium ${
                        form.companySize === value
                          ? 'border-sky-500/70 bg-sky-500/20 text-sky-100'
                          : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-sky-500/40 hover:text-sky-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-200"
                >
                  Industry
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Short description of your space (e.g., SaaS, healthcare, fintech).
                </p>
                <input
                  id="industry"
                  type="text"
                  value={form.industry}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      industry: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
                  placeholder="Example: B2B SaaS for financial services"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                Type of motion
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                {(
                  [
                    ['net-new', 'Net-new initiative'],
                    ['expansion', 'Expansion of wins'],
                    ['modernization', 'Modernize existing ops'],
                  ] as [MotionType, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        motion: value,
                      }))
                    }
                    className={`rounded-full border px-2.5 py-1 font-medium ${
                      form.motion === value
                        ? 'border-emerald-500/70 bg-emerald-500/15 text-emerald-100'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                Primary objective
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ['revenue', 'Revenue & pipeline'],
                    ['operations', 'Operations & efficiency'],
                    ['engineering', 'Engineering velocity'],
                    ['experience', 'Customer experience'],
                    ['compliance', 'Risk & compliance'],
                  ] as [PrimaryObjective, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        objective: value,
                      }))
                    }
                    className={`rounded-full border px-2.5 py-1 font-medium ${
                      form.objective === value
                        ? 'border-purple-500/70 bg-purple-500/20 text-purple-100'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-purple-500/40 hover:text-purple-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-1 flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2">
              <input
                type="checkbox"
                checked={form.regulated}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    regulated: event.target.checked,
                  }))
                }
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-purple-500 focus:ring-purple-400"
              />
              <span className="text-[11px] leading-5 text-slate-200">
                This initiative has strict governance or regulatory requirements (e.g. HIPAA, SOC 2,
                EU AI Act).
              </span>
            </label>
          </form>

          <div className="space-y-6 lg:col-span-3">
            <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Recommended blueprint
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-50">{blueprint.label}</h2>
              <p className="mt-2 text-sm text-slate-200">{blueprint.summary}</p>
              <p className="mt-3 text-[11px] text-slate-300">
                Suggested kickoff window:{' '}
                <span className="font-medium text-emerald-200">{blueprint.kickoffWindow}</span>{' '}
                based on your inputs.
              </p>
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Zion building blocks
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blueprint.primaryZionModules.map((mod) => (
                    <span
                      key={mod.href}
                      className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100"
                    >
                      {mod.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                90-day rollout phases
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                {blueprint.phases.map((phase) => (
                  <div
                    key={phase.title}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <p className="text-[11px] font-semibold text-slate-100">{phase.title}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{phase.window}</p>
                    <p className="mt-2 text-[11px] text-slate-300">{phase.focus}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                      {phase.actions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </AILabToolLayout>
    </div>
  );
}

