'use client';

import React, { useState } from 'react';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

type Goal = 'growth' | 'efficiency' | 'experience' | 'resilience';

interface IdeaFormState {
  idea: string;
  audience: string;
  goal: Goal;
  urgency: 'now' | 'soon' | 'exploring';
}

interface BlueprintSection {
  title: string;
  items: string[];
}

interface IdeaBlueprint {
  routes: string[];
  components: string[];
  automations: string[];
  rollout: BlueprintSection[];
}

function generateBlueprint(input: IdeaFormState): IdeaBlueprint {
  const baseRoutes = ['/ai-lab', '/ai-solutions'];

  const goalRoutes: Record<Goal, string[]> = {
    growth: ['/ai-growth-tools', '/zion-ai-marketing-automation'],
    efficiency: ['/automation', '/ai-ops-automation'],
    experience: ['/customer-experience', '/zion-ai-chatbot-builder'],
    resilience: ['/security', '/zion-security-shield'],
  };

  const goalComponents: Record<Goal, string[]> = {
    growth: ['ROIImpactEstimator', 'SolutionFinder', 'LaunchReadinessAdvisor'],
    efficiency: ['PerformanceMonitor', 'SystemMonitor', 'EnhancedPerformanceOptimizer'],
    experience: ['AIChatWidget', 'Testimonials', 'FuturisticHero'],
    resilience: ['SecurityEnhancer', 'PerformanceDashboard', 'ServicePageTemplate'],
  };

  const automations: string[] = [
    'AI Content & SEO pipelines for copy, metadata, and internal links',
    'AI Layout Design Automation for responsive layout and UX polish',
    'AI Navigation & Site Link audits to connect the new feature into the funnel',
    'AI Performance Optimizer for bundle and Core Web Vitals checks',
  ];

  const rollout: BlueprintSection[] = [
    {
      title: 'Phase 1 · Discovery & framing',
      items: [
        'Validate the idea against existing Zion product patterns and target audience.',
        'Identify the most relevant product and solution routes to host the new experience.',
        'Draft high-level UX flows the autonomous agents can refine.',
      ],
    },
    {
      title: 'Phase 2 · First live experience',
      items: [
        'Create a dedicated section on the homepage and a focused feature route.',
        'Wire in AI Lab-style telemetry to show how the feature is evolving.',
        'Run content, layout, and navigation automation in “suggestion-first” mode.',
      ],
    },
    {
      title: 'Phase 3 · Autonomy & optimization',
      items: [
        'Enable continuous AI audits to refine copy, CTAs, and navigation entry points.',
        'Use performance and UX agents to keep the experience fast and accessible.',
        'Promote top learnings into reusable templates for similar future features.',
      ],
    },
  ];

  return {
    routes: [...baseRoutes, ...goalRoutes[input.goal]],
    components: goalComponents[input.goal],
    automations,
    rollout,
  };
}

export default function IdeaToFeatureBlueprintPage() {
  const [form, setForm] = useState<IdeaFormState>({
    idea: '',
    audience: '',
    goal: 'growth',
    urgency: 'soon',
  });
  const [blueprint, setBlueprint] = useState<IdeaBlueprint | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.idea.trim() || !form.audience.trim()) {
      return;
    }
    setBlueprint(generateBlueprint(form));
  };

  return (
    <div className="bg-slate-950/90">
      <AILabToolLayout
        title="AI Idea-to-Feature Blueprint"
        subtitle="Explain what you want to launch and who it is for. The blueprint shows how Zion’s autonomous platform would shape routes, components, and automation to ship it fast."
      >
        <div className="grid gap-8 lg:grid-cols-5">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 lg:border-r lg:border-slate-800/80 lg:pr-6"
          >
            <fieldset className="space-y-5">
              <div>
                <label
                  htmlFor="idea"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-200"
                >
                  Idea
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Describe the product or feature you want to ship in 1–3 sentences.
                </p>
                <textarea
                  id="idea"
                  value={form.idea}
                  onChange={(event) => setForm((prev) => ({ ...prev, idea: event.target.value }))}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
                  placeholder="Example: AI assistant that turns raw customer interviews into prioritized roadmap ideas."
                />
              </div>

              <div>
                <label
                  htmlFor="audience"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-200"
                >
                  Primary audience
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Who benefits most from this? Teams, roles, industries, or segments.
                </p>
                <input
                  id="audience"
                  type="text"
                  value={form.audience}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, audience: event.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring"
                  placeholder="Example: Product managers and founders shipping B2B SaaS."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                    Primary goal
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {(
                      [
                        ['growth', 'Growth'],
                        ['efficiency', 'Efficiency'],
                        ['experience', 'Experience'],
                        ['resilience', 'Resilience'],
                      ] as [Goal, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, goal: value }))}
                        className={`rounded-full border px-2.5 py-1 font-medium ${
                          form.goal === value
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
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-200">
                    Urgency
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    {[
                      ['now', 'Now'],
                      ['soon', 'This quarter'],
                      ['exploring', 'Exploring'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            urgency: value as IdeaFormState['urgency'],
                          }))
                        }
                        className={`rounded-full border px-2.5 py-1 font-medium ${
                          form.urgency === value
                            ? 'border-emerald-500/70 bg-emerald-500/15 text-emerald-100'
                            : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-sky-500/70 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-50 shadow-lg shadow-sky-900/40 hover:bg-sky-500/30"
              >
                Generate blueprint
              </button>
            </fieldset>
          </form>

          <div className="lg:col-span-3">
            {!blueprint ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
                <p className="max-w-md">
                  Share your idea and audience on the left. You&rsquo;ll get a deterministic,
                  in-browser blueprint showing how Zion&rsquo;s autonomous agents would translate
                  it into routes, components, and automation.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    Suggested routes
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Where this feature would live across ziontechgroup.com so visitors can discover
                    it naturally.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blueprint.routes.map((route) => (
                      <span
                        key={route}
                        className="inline-flex items-center rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 font-mono text-[11px] text-sky-100"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    Zion components to reuse
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Core building blocks the platform would assemble into a polished experience.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blueprint.components.map((component) => (
                      <span
                        key={component}
                        className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-100"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    Automation pipeline
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Which autonomous agents would keep this feature fast, discoverable, and up to
                    date once it is live.
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {blueprint.automations.map((line) => (
                      <li key={line} className="text-[11px] text-slate-300">
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 text-xs text-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    Rollout plan
                  </p>
                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    {blueprint.rollout.map((phase) => (
                      <div
                        key={phase.title}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                      >
                        <p className="text-[11px] font-semibold text-slate-100">{phase.title}</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                          {phase.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </AILabToolLayout>
    </div>
  );
}

