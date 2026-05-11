import React from 'react';
import Link from 'next/link';
import { BarChart, ExternalLink } from 'lucide-react';

const analyticsTools = [
  {
    name: 'Google Analytics',
    href: 'https://analytics.google.com/?ref=ziontech',
    desc: 'Free web traffic analytics with real-time data.',
    category: 'Web Analytics'
  },
  {
    name: 'Plausible',
    href: 'https://plausible.io/?ref=ziontech',
    desc: 'Privacy‑focused web analytics, simple and lightweight.',
    category: 'Web Analytics'
  },
  {
    name: 'Umami',
    href: 'https://github.com/plausible/umami?ref=ziontech',
    desc: 'Open‑source analytics dashboard, self‑hostable.',
    category: 'Analytics'
  },
  {
    name: 'Matomo Cloud',
    href: 'https://matomo.live/?ref=ziontech',
    desc: 'Free cloud analytics with GDPR‑compliant data storage.',
    category: 'Analytics'
  },
  {
    name: 'Fathom Analytics',
    href: 'https://us.fathom.co/?ref=ziontech',
    desc: 'Simple, privacy‑first web analytics.',
    category: 'Analytics'
  },
  {
    name: 'Clicky',
    href: 'https://www.clicky.com/?ref=ziontech',
    desc: 'Real-time analytics with a free tier for low-traffic sites.',
    category: 'Analytics'
  },
  {
    name: 'Statcounter',
    href: 'https://www.statcounter.com/?ref=ziontech',
    desc: 'Web stats tracker with free plan and detailed reports.',
    category: 'Analytics'
  },
];

const grouped = analyticsTools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof analyticsTools>);

export const metadata = {
  title: 'Free Analytics Tools | Zion Tech Group',
  description: 'Curated free analytics platforms. Referral links help keep our open‑source projects alive.',
};

export default function FreeAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <BarChart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Analytics Tools
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Explore free, privacy‑respecting analytics platforms for your website or app.
            Every referral helps sustain our open‑source work.
          </p>
        </div>

        {/* Grouped Tools */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, tools]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {tool.desc}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics Guidance?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Consult with us to design a data‑driven growth strategy.
          </p>
          <a
            href="/consulting"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Free Consultation
          </a>
        </div>

        {/* Back to Support */}
        <div className="mt-12 text-center">
          <a 
            href="/support"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Support Page
          </a>
        </div>
      </div>
    </div>
  );
}
