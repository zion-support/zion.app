import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Sentiment Analyzer | Zion Tech Group',
  description:
    'Analyze customer sentiment across support tickets, reviews, and social channels in real time with AI-powered sentiment analysis.',
  alternates: { canonical: '/zion-ai-sentiment-analyzer' },
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            This solution has been consolidated
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Zion AI Sentiment Analyzer
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Sentiment analysis capabilities are now part of our comprehensive{' '}
            <strong className="text-white">Zion AI Customer Sentiment Tracker</strong>, which
            analyzes customer sentiment across support tickets, reviews, and social channels in real time.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/zion-ai-customer-sentiment-tracker"
              className="inline-flex rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              View Zion AI Customer Sentiment Tracker →
            </a>
            <a
              href="/solutions"
              className="inline-flex rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              Browse All Solutions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
