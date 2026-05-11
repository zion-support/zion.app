/* eslint-disable */
import Metadata from 'next';

type ChangelogEntry = {
  date: string;
  title: string;
  summary: string;
  tags: string[];
};

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-18',
    title: 'AI Experiments hub and rollout copilots live',
    summary:
      'Introduced the AI Experiments hub, ROI Impact Estimator, Solution Finder, and in-browser rollout copilots so teams can model automation upside and discover the right Zion apps directly in the browser.',
    tags: ['AI Lab', 'In-browser tools', 'ROI'],
  },
  {
    date: '2026-03-18',
    title: 'Autonomous improvement pipeline helper',
    summary:
      'Added an app improvement cycle script and a local deploy helper that mirror the CI/CD pipeline used for Netlify, making it easier to run audits and deploy safely from any environment.',
    tags: ['Automation', 'Deployment', 'Continuous improvement'],
  },
];

export const metadata = {
  title: 'Changelog | Zion Tech Group',
  description:
    'Recent improvements to the Zion Tech Group platform, including new AI products, autonomous automation, and site experience updates.',
  alternates: { canonical: '/changelog' },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Product updates</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Changelog</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            A running log of new AI products, autonomous agents, and experience improvements shipped to
            ziontechgroup.com.
          </p>
        </header>

        <div className="space-y-4">
          {ENTRIES.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold text-white">{entry.title}</h2>
                <time className="text-xs text-slate-400">{entry.date}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-200">{entry.summary}</p>
              {entry.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

