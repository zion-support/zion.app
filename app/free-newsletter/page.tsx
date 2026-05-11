'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function FreeNewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Mailchimp POST endpoint placeholder
      const res = await fetch('https://YOUR_MAILCHIMP_ACTION_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `EMAIL=${encodeURIComponent(email)}`,
        mode: 'no-cors',
      });
      if (res.ok) setStatus('success');
      else throw new Error();
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head>
        <title>Free Newsletter Signup | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Join Our Free Newsletter</h1>
      <p className="mb-6 text-gray-300">Get the latest AI insights, tutorials, and product updates—no cost, no fuss.</p>
      <form className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="you@example.com"
          />
        </label>
        {status === 'error' && (
          <p className="text-sm text-red-400">Something went wrong. Try again later.</p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60"
        >
          {status === 'sending' ? 'Signing up…' : 'Subscribe'}
        </button>
      </form>
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
