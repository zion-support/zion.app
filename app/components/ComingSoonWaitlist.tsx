'use client';

import { useState, useEffect } from 'react';

type WaitlistEntry = {
  email: string;
  interest: string;
  timestamp: number;
};

interface ComingSoonWaitlistProps {
  title?: string;
  description?: string;
  interestAreas?: string[];
  className?: string;
}

const INTEREST_OPTIONS = [
  'Enterprise AI Services',
  'AI Lab Tools',
  'Autonomous Automation',
  'AI Governance & Trust',
  'Custom AI Solutions',
  'Integration APIs',
];

export default function ComingSoonWaitlist({
  title = 'Coming Soon',
  description = 'Be the first to know when this feature launches.',
  interestAreas = INTEREST_OPTIONS,
  className = '',
}: ComingSoonWaitlistProps) {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(interestAreas[0]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Store in localStorage for demo (in production, send to API)
    const entry: WaitlistEntry = { email, interest, timestamp: Date.now() };
    const existing = JSON.parse(localStorage.getItem('zion_waitlist') || '[]');
    const updated = [...existing, entry];
    localStorage.setItem('zion_waitlist', JSON.stringify(updated));

    setSubmitted(true);
  };

  return (
    <div className={`rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm ${className}`}>
      <div className={`transition-all duration-500 ease-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{title}</span>
        </div>

        {submitted ? (
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <div className="mb-2 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold text-emerald-800">You&apos;re on the list!</p>
            <p className="mt-1 text-sm text-emerald-700">
              We&apos;ll notify you at <span className="font-mono">{email}</span> when this feature launches.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-600">{description}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="waitlist-email" className="block text-xs font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="waitlist-interest" className="block text-xs font-medium text-slate-700">
                  I&apos;m interested in
                </label>
                <select
                  id="waitlist-interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {interestAreas.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {error && (
                <p className="text-xs text-rose-600">{error}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                Join Waitlist
              </button>
            </form>
          </>
        )}
        <p className="mt-3 text-center text-xs text-slate-500">
          Join {Math.floor(Math.random() * 500) + 1000} others waiting for early access
        </p>
      </div>
    </div>
  );
}