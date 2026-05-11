import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const resources = [
  {
    name: 'Free AI Prompt Library',
    href: 'https://github.com/Zion-support/ai-prompts',
    desc: 'Curated open‑source prompts for ChatGPT, Claude, and more.',
  },
  {
    name: 'Next.js Starter Kit',
    href: 'https://github.com/Zion-support/nextjs-starter',
    desc: 'Zero‑config starter with Tailwind, TypeScript, and CI.',
  },
  {
    name: 'OpenAI API Free Tier Guide',
    href: 'https://platform.openai.com/docs/introduction',
    desc: 'How to get $18 free credit and start building.',
  },
  {
    name: 'Cloudflare Workers Free Tier',
    href: 'https://developers.cloudflare.com/workers/',
    desc: 'Deploy serverless functions with 100k requests‑day free.',
  },
  {
    name: 'Formspree Free Forms',
    href: 'https://formspree.io/',
    desc: 'Collect email leads without a backend (up to 50 submissions/mo).',
  },
];

export default function FreeResources() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Free Resources | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Free Resources & Tools</h1>
      <p className="mb-6 text-gray-300">
        Explore free, open‑source tools and guides that help you build AI‑powered products without spending a dime.
      </p>
      <ul className="space-y-4">
        {resources.map((r) => (
          <li key={r.name} className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold mb-1">{r.name}</h2>
            <p className="text-sm text-gray-400 mb-2">{r.desc}</p>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              Visit
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-purple-400 hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}
