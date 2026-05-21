'use client';

import { pingTool } from '@/data/tools_ping_client';
// app/tools/roi-calculator/page.tsx — Standalone ROI Calculator
import ROICalculatorClient from './ROICalculatorClient';

export const metadata = {
  title: 'ROI Calculator | Zion Tech Group',
  description: 'Estimate the business value and ROI of AI & IT services for your organization. Free interactive calculator.',
};

export default function ROICalculatorPage() {
  useEffect(() => { pingTool('roi-calculator'); }, []);

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page max-w-3xl">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📈</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">ROI Calculator</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Estimate the business value AI &amp; IT services deliver for your organisation.
            Drag the slider to see payback period, monthly return, and year-1 net gain.
          </p>
        </div>

        <ROICalculatorClient />

        {/* ── CTA ── */}
        <div className="mt-12 text-center">
          <a href="mailto:kleber@ziontechgroup.com" className="btn-primary text-lg px-8 py-4 inline-block">
            📅 Schedule a Free ROI Review
          </a>
        </div>
      </div>
    </main>
  );
}
