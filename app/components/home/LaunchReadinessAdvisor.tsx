'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Goal = 'revenue' | 'operations' | 'engineering' | 'compliance';
type Timeline = '30' | '60' | '90';

type PlaybookModule = {
  name: string;
  href: string;
};

type Playbook = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  primaryCta: string;
  expectedImpact: string;
  modules: PlaybookModule[];
  nextSteps: string[];
};

const timelineLabels: Record<Timeline, string> = {
  '30': '0-30 days',
  '60': '31-60 days',
  '90': '61-90 days',
};

const playbooks: Record<Goal, Playbook> = {
  revenue: {
    slug: 'revenue-command-center',
    title: 'Revenue Command Center',
    summary:
      'Unify lead qualification, outreach sequencing, and CRM handoffs to increase pipeline velocity.',
    href: '/zion-smart-crm-automation',
    primaryCta: 'Launch revenue workflow',
    expectedImpact: 'Faster qualified pipeline',
    modules: [
      { name: 'AI Lead Scoring', href: '/zion-ai-lead-scoring' },
      { name: 'AI Email Marketing Pro', href: '/zion-ai-email-marketing-pro' },
      { name: 'Smart CRM Automation', href: '/zion-smart-crm-automation' },
    ],
    nextSteps: [
      'Identify one revenue stage with the highest response lag.',
      'Define conversion and response-time KPIs for the pilot.',
      'Plan weekly optimization reviews with sales and growth leaders.',
    ],
  },
  operations: {
    slug: 'autonomous-operations-desk',
    title: 'Autonomous Operations Desk',
    summary:
      'Automate document intake, meeting capture, and workflow routing to reduce manual operational effort.',
    href: '/zion-workflow-automation',
    primaryCta: 'Automate operations',
    expectedImpact: 'Lower manual back-office load',
    modules: [
      { name: 'Workflow Automation', href: '/zion-workflow-automation' },
      { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
      { name: 'AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
    ],
    nextSteps: [
      'Map one repeatable process with frequent handoffs.',
      'Standardize intake fields and routing ownership.',
      'Enable exception handling and escalation runbooks before scale.',
    ],
  },
  engineering: {
    slug: 'engineering-velocity-sprint',
    title: 'Engineering Velocity Sprint',
    summary:
      'Improve developer throughput and delivery reliability with AI-assisted coding, testing, and release checks.',
    href: '/zion-devops-automation',
    primaryCta: 'Boost engineering delivery',
    expectedImpact: 'Shorter release cycles',
    modules: [
      { name: 'AI Code Assistant', href: '/zion-ai-code-assistant' },
      { name: 'AI Code Reviewer', href: '/zion-ai-code-reviewer' },
      { name: 'AI API Tester', href: '/zion-ai-api-tester' },
    ],
    nextSteps: [
      'Choose one release workflow where handoff delays are highest.',
      'Set baseline metrics for cycle time and defect escape rate.',
      'Apply AI checks to pull requests and regression test paths first.',
    ],
  },
  compliance: {
    slug: 'compliance-ready-delivery-pod',
    title: 'Compliance-Ready Delivery Pod',
    summary:
      'Pair secure infrastructure and policy-aware checks for high-trust rollouts with stronger governance.',
    href: '/zion-cybersecurity-audit',
    primaryCta: 'Plan secure rollout',
    expectedImpact: 'Reduced governance risk',
    modules: [
      { name: 'Security Shield', href: '/zion-security-shield' },
      { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
      { name: 'Cloud Vault', href: '/zion-cloud-vault' },
    ],
    nextSteps: [
      'List controls required for data handling, access, and auditability.',
      'Define risk sign-off checkpoints across security and compliance teams.',
      'Align monitoring and incident response before production go-live.',
    ],
  },
};

function getKickoffWindow(timeline: Timeline, readinessScore: number) {
  if (timeline === '30') {
    return readinessScore >= 4 ? '2-3 week pilot sprint' : '4-week scoped pilot';
  }

  if (timeline === '60') {
    return readinessScore >= 4 ? '4-6 week phased rollout' : '6-8 week staged rollout';
  }

  return readinessScore >= 4 ? '8-10 week enterprise rollout' : '10-12 week hardening rollout';
}

export default function LaunchReadinessAdvisor() {
  const [goal, setGoal] = useState<Goal>('revenue');
  const [timeline, setTimeline] = useState<Timeline>('60');
  const [requiresGovernance, setRequiresGovernance] = useState(false);
  const [readinessScore, setReadinessScore] = useState(3);

  const selectedGoal: Goal = requiresGovernance ? 'compliance' : goal;
  const recommendedPlaybook = useMemo(() => playbooks[selectedGoal], [selectedGoal]);
  const kickoffWindow = useMemo(
    () => getKickoffWindow(timeline, readinessScore),
    [timeline, readinessScore]
  );

  const readinessLabel =
    readinessScore <= 2 ? 'Foundational readiness' : readinessScore <= 4 ? 'Growing readiness' : 'High readiness';

  return (
    <div className="rounded-3xl border border-purple-400/25 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 shadow-2xl shadow-purple-900/20 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Launch advisor</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Get a recommended rollout path</h3>
          <p className="mt-2 text-sm text-slate-300">
            Select your primary objective and timeline to get a practical launch recommendation with clear next steps.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Primary objective
              </span>
              <select
                value={goal}
                onChange={(event) => setGoal(event.target.value as Goal)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/75 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-purple-400"
              >
                <option value="revenue">Increase revenue and conversion</option>
                <option value="operations">Reduce manual operations load</option>
                <option value="engineering">Improve engineering delivery speed</option>
                <option value="compliance">Strengthen security and compliance</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Target launch window
              </span>
              <select
                value={timeline}
                onChange={(event) => setTimeline(event.target.value as Timeline)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/75 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-purple-400"
              >
                <option value="30">{timelineLabels['30']}</option>
                <option value="60">{timelineLabels['60']}</option>
                <option value="90">{timelineLabels['90']}</option>
              </select>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3">
              <input
                type="checkbox"
                checked={requiresGovernance}
                onChange={(event) => setRequiresGovernance(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 text-purple-500 focus:ring-purple-400"
              />
              <span className="text-sm text-slate-200">
                This initiative has strict governance or regulatory requirements.
              </span>
            </label>

            <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="launch-readiness-score" className="text-sm font-semibold text-slate-100">
                  Team readiness score
                </label>
                <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-purple-200">
                  {readinessScore}/5
                </span>
              </div>
              <input
                id="launch-readiness-score"
                type="range"
                min={1}
                max={5}
                step={1}
                value={readinessScore}
                onChange={(event) => setReadinessScore(Number(event.target.value))}
                className="mt-3 w-full accent-purple-400"
              />
              <p className="mt-2 text-xs text-slate-400">{readinessLabel}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-400/30 bg-slate-950/75 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
            Recommended launch path
          </p>
          <h4 className="mt-2 text-xl font-semibold text-white">{recommendedPlaybook.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{recommendedPlaybook.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-purple-400/35 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">
              {recommendedPlaybook.expectedImpact}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200">
              Suggested kickoff: {kickoffWindow}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Core modules</p>
            <ul className="mt-2 space-y-2">
              {recommendedPlaybook.modules.map((module) => (
                <li key={module.href}>
                  <a
                    href={module.href}
                    className="text-sm text-slate-200 transition hover:text-purple-300"
                  >
                    {module.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">First actions</p>
            <ol className="mt-2 space-y-2">
              {recommendedPlaybook.nextSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-[11px] text-slate-200">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={recommendedPlaybook.href}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-pink-500"
            >
              {recommendedPlaybook.primaryCta}
            </a>
            <a
              href={`/contact?playbook=${recommendedPlaybook.slug}&timeline=${timeline}`}
              className="inline-flex items-center rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/20"
            >
              Discuss this plan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
