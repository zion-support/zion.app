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

export default function ZionAIChatbotPlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Welcome to the Zion AI Chatbot Playground. Ask a question and see how a Zion-style assistant would respond. This sandbox is stateless and does not connect to your internal systems.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMessage: ChatMessage = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const history = messages.slice(-6); // keep context short for speed
        const apiMessages: { role: Role | 'system'; content: string }[] = [
          {
            role: 'system',
            content:
              'You are a Zion-style AI chatbot demo. Answer as a helpful assistant for Zion Tech Group visitors, based only on the conversation. Do not claim to access private data or CRMs.',
          },
          ...history,
          userMessage,
        ].map((m) => ({ role: m.role as Role | 'system', content: m.content }));

        const reply = await callZionChatApi(apiMessages);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while generating a reply. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Live AI demo</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Zion AI Chatbot Playground
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Explore how a Zion AI chatbot can answer visitor questions in real time. This playground uses the
            same multi-provider LLM chain as the production assistant, but runs as a safe, stateless demo in
            your browser.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
          <section className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-xl shadow-black/30">
            <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Sandbox conversation</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Ask about AI apps, services, or implementation. No credentials, CRMs, or private data are used in
                this sandbox.
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm sm:px-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-600/20 text-purple-200'
                        : 'bg-gradient-to-br from-purple-500/20 to-sky-500/20 text-sky-200'
                    }`}
                  >
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600/25 text-purple-50'
                        : 'border border-slate-800/80 bg-slate-900/90 text-slate-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <p className="text-xs text-slate-400">Zion AI is thinking with the multi-provider stack…</p>
              )}

              {error && (
                <p className="text-xs text-rose-300">
                  {error}{' '}
                  <span className="text-slate-400">
                    You can still reach the team at{' '}
                    <a href="mailto:commercial@ziontechgroup.com" className="underline">
                      commercial@ziontechgroup.com
                    </a>
                    .
                  </span>
                </p>
              )}
            </div>

            <form onSubmit={handleSend} className="border-t border-slate-800/80 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask something a visitor might ask your AI chatbot..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500/40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-500 hover:to-sky-400 disabled:opacity-40"
                >
                  {isLoading ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 text-xs text-slate-300">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">How this demo works</p>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                <li>• Uses the same multi-provider LLM chain as the production assistant.</li>
                <li>• Runs as a stateless, browser-visible sandbox with no CRM or internal system access.</li>
                <li>• Great for exploring tone, answer style, and guardrails before a full implementation.</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Next steps with Zion AI Chatbot Builder
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                <li>1. Configure knowledge sources, handoffs, and escalation paths.</li>
                <li>2. Connect to your helpdesk, CRM, or data warehouse.</li>
                <li>3. Add governance, analytics, and continuous optimization workflows.</li>
              </ul>
              <a
                href="/zion-ai-chatbot-builder"
                className="mt-3 inline-flex rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold text-purple-100 hover:bg-purple-500/20"
              >
                Open Zion AI Chatbot Builder
              </a>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

