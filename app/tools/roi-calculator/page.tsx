// app/tools/roi-calculator/page.tsx — ROI Calculator (server wrapper + ping tracking)
// Metadata exported by layout.tsx

import Link from 'next/link';
import type { Metadata } from 'next';
import RouterPing from './pingClient';
import ROICalculatorClient from './ROICalculatorClient';

export const metadata: Metadata = {
  title: 'ROI Calculator — Zion Tech Group',
  description: 'Calculate the return on investment for AI and IT services with our free ROI calculator.',
  alternates: { canonical: '/tools/roi-calculator' },
};

export default function ROICalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <RouterPing />

      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ROI Calculator',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'All',
            description:
              'Free interactive ROI calculator for AI & IT services. Adjust your monthly budget to see estimated payback period, monthly return, and year-1 net gain.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />

      <div className="container-page max-w-4xl">
        {/* ── Back Link ── */}
        <Link
          href="/tools/"
          className="text-purple-400 text-sm hover:underline mb-8 inline-block"
        >
          ← All Tools
        </Link>

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">📈</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ROI Calculator
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Estimate the business value AI &amp; IT services deliver for your
            organisation. Drag the slider below to see payback period, monthly
            return, and year-1 net gain — all in real time.
          </p>
        </div>

        {/* ── Interactive Calculator ── */}
        <ROICalculatorClient />

        {/* ── How It Works ── */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-white font-semibold mb-2">1. Set Your Budget</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Move the slider or tap a preset (Small Team, Mid-Size Org,
                Enterprise) to choose your monthly investment.
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-white font-semibold mb-2">2. See the Impact</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The calculator instantly estimates monthly return, payback
                period, and year-1 net gain based on industry productivity
                benchmarks.
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-white font-semibold mb-2">3. Book a Review</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ready to go deeper? Schedule a free ROI review with our team
                for a tailored breakdown specific to your workflows.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Use This Calculator ── */}
        <section className="mb-12 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-slate-900/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Use This Calculator?
          </h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
              <span>
                <strong className="text-white">Realistic benchmarks</strong> — Based on
                productivity lift data from AI, automation, cloud, and IT
                categories (3.2×, 2.5×, 2.0×, and 1.8× respectively).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
              <span>
                <strong className="text-white">No sign-up required</strong> — Free,
                private, runs entirely in your browser. Nothing is sent to a
                server.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
              <span>
                <strong className="text-white">Instant feedback</strong> — Every slider
                movement updates the three key metrics in real time so you can
                explore different scenarios.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
              <span>
                <strong className="text-white">Actionable next step</strong> — Book a
                free ROI review directly when you&apos;re ready for a custom
                analysis.
              </span>
            </li>
          </ul>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 open:border-purple-500/30 transition-all">
              <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center gap-2">
                <span>What does the productivity lift represent?</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                  ▼
                </span>
              </summary>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                The lift multiplier (e.g., 3.2× for AI services) is based on
                industry studies of time-to-value improvements when adopting
                managed AI/IT solutions vs. building in-house. It reflects
                combined savings in development time, ongoing maintenance, and
                operational overhead.
              </p>
            </details>

            <details className="group rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 open:border-purple-500/30 transition-all">
              <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center gap-2">
                <span>Why is the payback period fixed at 6 months?</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                  ▼
                </span>
              </summary>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Most managed AI &amp; IT services reach deployment maturity within
                4–8 weeks, and the productivity gains more than offset the
                investment by month 6. This is a conservative estimate — many
                clients see positive ROI within 3 months.
              </p>
            </details>

            <details className="group rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 open:border-purple-500/30 transition-all">
              <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center gap-2">
                <span>Can I use this for my specific department or team?</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                  ▼
                </span>
              </summary>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Absolutely. The presets (Small Team, Mid-Size Org, Enterprise)
                give you a starting point, but you can fine-tune the slider to
                any value between $500 and $50,000/month. For a fully custom
                analysis, book a free ROI review.
              </p>
            </details>

            <details className="group rounded-xl bg-slate-800/40 border border-slate-700/50 p-5 open:border-purple-500/30 transition-all">
              <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center gap-2">
                <span>Is my data saved or tracked when I use this?</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                  ▼
                </span>
              </summary>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                No. The calculator runs entirely client-side — no form
                submission, no API calls, no data persistence. We only track a
                lightweight page-view ping to understand which tools are most
                useful.
              </p>
            </details>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/15 to-slate-900/40 p-10">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready for a Custom ROI Analysis?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto leading-relaxed">
            Our team will build a tailored ROI model for your specific
            workflows, team size, and service category — free and no
            obligation.
          </p>
          <a
            href="mailto:kleber@ziontechgroup.com"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            📅 Schedule a Free ROI Review
          </a>
          <p className="text-slate-500 text-xs mt-4">
            Or email kleber@ziontechgroup.com directly
          </p>
        </div>
      </div>
    </main>
  );
}
