'use client';

import DefaultSEO from '@/components/DefaultSEO';

export default function SEOAIPProductivityCalculator() {
  return (
    <>
      <DefaultSEO
        title="AI Productivity Score Calculator | Zion Tech Group"
        description="Calculate your team's productivity potential with AI adoption. Measure efficiency gains, estimate time savings, and get recommendations for maximizing productivity with AI tools."
        keywords={[
          'AI productivity calculator',
          'team productivity score',
          'AI adoption metrics',
          'productivity improvement tool',
          'AI efficiency calculator',
          'workforce productivity AI',
        ]}
        noIndex={false}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900">AI Productivity Score Calculator</h1>
          <p className="mt-4 text-lg text-slate-600">
            Redirecting to the interactive calculator...
          </p>
          <meta httpEquiv="refresh" content="0;url=/tools/productivity-score-calculator" />
        </div>
      </div>
    </>
  );
}
