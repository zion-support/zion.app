'use client';

import React, { useCallback, useState } from 'react';

type Role = 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

async function callZionChatApi(messages: { role: Role | 'system'; content: string }[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error('Chat API request failed');
  }

  const data = (await res.json()) as { content?: string };
  if (!data.content) {
    throw new Error('Chat API returned no content');
  }

  return data.content;
}

export default function AIMicroSaaSIdeaGeneratorPage() {
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [channel, setChannel] = useState('B2B SaaS');
  const [budgetLevel, setBudgetLevel] = useState<'lean' | 'standard' | 'enterprise'>('standard');
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      if (!industry.trim() || !audience.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);
      setMessages([]);

      try {
        const userPrompt = [
          `Industry or vertical: ${industry}`,
          `Primary audience: ${audience}`,
          `Primary distribution channel: ${channel}`,
          `Budget profile: ${budgetLevel === 'lean' ? 'lean / early stage' : budgetLevel === 'enterprise' ? 'enterprise / high trust' : 'standard growth'}.`,
          notes ? `Additional constraints: ${notes}` : '',
          '',
          'Propose 3–4 specific micro-SaaS ideas that:',
          '- Are realistic to launch in 8–12 weeks.',
          '- Map to Zion-like AI apps and services (e.g., AI Chatbot Builder, AI Email Marketing Pro, Workflow Automation, AI Document Processor).',
          '- Include: name, one-sentence pitch, target user, core AI capabilities, and 2–3 relevant Zion routes (by relative path).',
          'Format ideas as a short list with clear headings; do not use markdown tables.',
        ]
          .filter(Boolean)
          .join('\n');

        const apiMessages: { role: Role | 'system'; content: string }[] = [
          {
            role: 'system',
            content:
              'You are a Zion Micro-SaaS architect. Suggest focused, revenue-capable product ideas that can be built on top of Zion-style AI apps and services. Reference app pages via relative URLs like /zion-ai-chatbot-builder.',
          },
          { role: 'user', content: userPrompt },
        ];

        const reply = await callZionChatApi(apiMessages);
        setMessages([{ role: 'assistant', content: reply }]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while generating ideas. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [industry, audience, channel, budgetLevel, notes, isLoading],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
            Micro-SaaS AI ideation
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            AI Micro-SaaS Idea Generator
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Share who you want to serve and how you plan to reach them. Zion-style AI will propose concrete
            micro-SaaS concepts and show which Zion apps and services they align with.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
          <section className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 shadow-xl shadow-black/30">
            <form onSubmit={handleGenerate} className="space-y-4 text-xs text-slate-200">
              <div>
                <label
                  htmlFor="industry"
                  className="block text-[11px] font-semibold uppercase tracking-wide text-slate-200"
                >
                  Industry or vertical
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Example: B2B SaaS for RevOps, healthcare clinics, logistics &amp; fleet, marketing agencies.
                </p>
                <input
                  id="industry"
                  type="text"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/40"
                  placeholder="E.g., Mid-market SaaS companies with 10–30 sellers"
                />
              </div>

              <div>
                <label
                  htmlFor="audience"
                  className="block text-[11px] font-semibold uppercase tracking-wide text-slate-200"
                >
                  Primary buyer / user
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Who makes the purchase and who uses it day-to-day? (Roles, team size, region).
                </p>
                <input
                  id="audience"
                  type="text"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/40"
                  placeholder="E.g., Head of Customer Success; CSMs and support reps are daily users"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-[11px] text-slate-200">
                  <span className="block font-semibold uppercase tracking-wide">
                    Go-to-market channel
                  </span>
                  <select
                    value={channel}
                    onChange={(event) => setChannel(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  >
                    <option>B2B SaaS</option>
                    <option>Product-led growth</option>
                    <option>Agency / services-led</option>
                    <option>Marketplace / app store</option>
                    <option>Internal tooling</option>
                  </select>
                </label>

                <fieldset className="text-[11px] text-slate-200">
                  <legend className="block font-semibold uppercase tracking-wide">Budget profile</legend>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBudgetLevel('lean')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        budgetLevel === 'lean'
                          ? 'border-sky-400/80 bg-sky-500/15 text-sky-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-sky-400/60 hover:text-sky-100'
                      }`}
                    >
                      Lean / early stage
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetLevel('standard')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        budgetLevel === 'standard'
                          ? 'border-emerald-400/80 bg-emerald-500/15 text-emerald-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-100'
                      }`}
                    >
                      Standard growth
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetLevel('enterprise')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        budgetLevel === 'enterprise'
                          ? 'border-purple-400/80 bg-purple-500/15 text-purple-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-purple-400/60 hover:text-purple-100'
                      }`}
                    >
                      Enterprise / high trust
                    </button>
                  </div>
                </fieldset>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-[11px] font-semibold uppercase tracking-wide text-slate-200"
                >
                  Optional constraints
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Add details like geography, integrations, data sensitivity, or existing tools you want to build
                  around.
                </p>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/40"
                  placeholder="E.g., EU customers, SOC 2 expectations, HubSpot and Stripe already in place."
                />
              </div>

              <button
                type="submit"
                disabled={!industry.trim() || !audience.trim() || isLoading}
                className="inline-flex items-center justify-center rounded-full border border-sky-400/70 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-50 shadow-lg shadow-sky-900/40 hover:bg-sky-500/30 disabled:opacity-40"
              >
                {isLoading ? 'Generating micro-SaaS ideas…' : 'Generate micro-SaaS ideas with Zion AI'}
              </button>

              {error && (
                <p className="text-[11px] text-rose-300">
                  {error}{' '}
                  <span className="text-slate-400">
                    For a deeper roadmap, you can also{' '}
                    <a href="/consultation" className="underline">
                      request a consultation
                    </a>
                    .
                  </span>
                </p>
              )}
            </form>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/85 p-5 text-xs text-slate-200">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                AI-generated idea set
              </p>
              {messages.length === 0 ? (
                <p className="mt-2 text-[11px] text-slate-400">
                  You&apos;ll see 3–4 concrete micro-SaaS concepts here, each with a short pitch, target user,
                  and links to relevant Zion-style app pages (for example, AI Chatbot Builder, AI Email Marketing
                  Pro, Workflow Automation).
                </p>
              ) : (
                messages.map((msg, index) => (
                  <article
                    key={index}
                    className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px] leading-relaxed"
                  >
                    {msg.content}
                  </article>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-300">From idea to launch with Zion</p>
              <ul className="mt-1.5 space-y-1">
                <li>• Use idea output as a shortlist for discovery sprints.</li>
                <li>• Map ideas to Zion app pages and innovation bundles on the main site.</li>
                <li>• Engage Zion for architecture, build, and ongoing autonomous optimization.</li>
              </ul>
              <a
                href="/micro-saas-services"
                className="mt-3 inline-flex rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20"
              >
                Explore Zion Micro-SaaS services
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

