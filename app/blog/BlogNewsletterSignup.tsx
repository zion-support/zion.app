'use client';

import React, { useState, useCallback } from 'react';
import { CONTACT_INFO } from '../utils/seoConstants';

/**
 * Blog "Stay Updated" signup. Sends to commercial@ziontechgroup.com via mailto
 * so the filled form reaches the commercial team (no backend required).
 */
export default function BlogNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;

      const subject = encodeURIComponent('Blog newsletter signup / Stay Updated');
      const body = encodeURIComponent(
        `Newsletter signup from blog page.\n\nEmail: ${email.trim()}\n\n(Submitted via ziontechgroup.com/blog)`,
      );
      window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
      setSubmitted(true);
    },
    [email],
  );

  if (submitted) {
    return (
      <div className="mt-16 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/35 via-fuchsia-900/25 to-pink-900/35 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Check your email client</h2>
        <p className="mx-auto mt-2 max-w-xl text-slate-200">
          Your email client should have opened with the message addressed to{' '}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="text-purple-300 underline hover:text-purple-200"
          >
            {CONTACT_INFO.email}
          </a>
          . Send it to subscribe. If it didn&apos;t open, email us directly at that address.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/35 via-fuchsia-900/25 to-pink-900/35 p-8 text-center">
      <h2 className="text-2xl font-bold text-white">Stay Updated</h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-200">
        Get practical AI delivery insights and product updates directly in your inbox.
      </p>
      <form
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          className="flex-1 rounded-xl border border-slate-600/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
        >
          Subscribe
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-400">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
