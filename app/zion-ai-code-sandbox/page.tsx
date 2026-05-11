'use client';

import React, { useCallback, useState } from 'react';

type Role = 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

type CodeIntent = 'review' | 'refactor' | 'tests';

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

export default function ZionAICodeSandboxPage() {
  const [language, setLanguage] = useState('TypeScript / React');
  const [intent, setIntent] = useState<CodeIntent>('review');
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      const trimmed = code.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setIsLoading(true);
      setMessages([]);

      try {
        const intentLabel =
          intent === 'review'
            ? 'review this code for correctness, security, and clarity'
            : intent === 'refactor'
            ? 'refactor this code for readability and maintainability'
            : 'propose focused tests for this code';

        const userPrompt = [
          `Language or stack: ${language}`,
          `Requested analysis: ${intentLabel}.`,
          notes ? `Additional context: ${notes}` : '',
          '',
          'Code:',
          '```',
          trimmed.slice(0, 6000),
          '```',
        ]
          .filter(Boolean)
          .join('\n');

        const apiMessages: { role: Role | 'system'; content: string }[] = [
          {
            role: 'system',
            content:
              'You are a Zion AI Code Assistant demo. Provide concise, high-signal feedback for engineers. Prefer bullet lists and short code blocks. Do not modify external systems.',
          },
          { role: 'user', content: userPrompt },
        ];

        const reply = await callZionChatApi(apiMessages);
        setMessages([{ role: 'assistant', content: reply }]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while analyzing the code. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [code, intent, language, notes, isLoading],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Engineering AI demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Zion AI Code Sandbox
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Paste a small snippet and see how a Zion-style AI code assistant could review, refactor, or suggest
            tests — powered by the same multi-provider LLM chain used in production automations.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
          <section className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 shadow-xl shadow-black/30">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <label className="text-xs text-slate-200">
                  <span className="block font-semibold uppercase tracking-wide">Language / stack</span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
                  >
                    <option>TypeScript / React</option>
                    <option>Node.js / Express</option>
                    <option>Python / FastAPI</option>
                    <option>Go backend</option>
                    <option>Infrastructure as Code</option>
                    <option>Other</option>
                  </select>
                </label>

                <fieldset className="text-xs text-slate-200">
                  <legend className="block text-[11px] font-semibold uppercase tracking-wide">
                    What should Zion AI focus on?
                  </legend>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIntent('review')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        intent === 'review'
                          ? 'border-emerald-400/80 bg-emerald-500/15 text-emerald-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-100'
                      }`}
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntent('refactor')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        intent === 'refactor'
                          ? 'border-sky-400/80 bg-sky-500/15 text-sky-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-sky-400/60 hover:text-sky-100'
                      }`}
                    >
                      Refactor
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntent('tests')}
                      className={`rounded-full border px-3 py-1 font-medium ${
                        intent === 'tests'
                          ? 'border-purple-400/80 bg-purple-500/15 text-purple-100'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-purple-400/60 hover:text-purple-100'
                      }`}
                    >
                      Tests
                    </button>
                  </div>
                </fieldset>
              </div>

              <div>
                <label
                  htmlFor="code-snippet"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-200"
                >
                  Code snippet
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Paste a focused function, component, or handler (avoid entire files). Sensitive credentials or
                  secrets should never be included.
                </p>
                <textarea
                  id="code-snippet"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  rows={10}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="// Paste code here..."
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-200"
                >
                  Optional context
                </label>
                <p className="mt-1 text-[11px] text-slate-400">
                  Mention constraints (e.g., performance, compliance, legacy API) so suggestions stay realistic.
                </p>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/40"
                  placeholder="Example: This runs on the critical path for checkout; keep latency low and avoid heavy dependencies."
                />
              </div>

              <button
                type="submit"
                disabled={!code.trim() || isLoading}
                className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-50 shadow-lg shadow-emerald-900/40 hover:bg-emerald-500/30 disabled:opacity-40"
              >
                {isLoading ? 'Analyzing with Zion AI…' : 'Analyze snippet with Zion AI'}
              </button>
            </form>

            {error && (
              <p className="text-[11px] text-rose-300">
                {error}{' '}
                <span className="text-slate-400">
                  For deeper reviews, contact the team via <a href="/contact" className="underline">/contact</a>.
                </span>
              </p>
            )}
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/85 p-5 text-xs text-slate-200">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Zion AI suggestions
              </p>
              {messages.length === 0 ? (
                <p className="mt-2 text-[11px] text-slate-400">
                  Run the sandbox to see how a Zion AI Code Assistant instance would summarize issues, propose
                  refactors, or outline test cases. This is a demo and does not modify your repository.
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
              <p className="font-semibold text-slate-300">From sandbox to production</p>
              <ul className="mt-1.5 space-y-1">
                <li>• Wire Zion AI Code Assistant into your CI pipeline for automated checks.</li>
                <li>• Use AI Code Reviewer on pull requests for consistent review quality.</li>
                <li>• Combine with DevOps Automation for safe, AI-assisted releases.</li>
              </ul>
              <a
                href="/zion-ai-code-assistant"
                className="mt-3 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20"
              >
                Open Zion AI Code Assistant
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

