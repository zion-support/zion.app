/* eslint-disable @typescript-eslint/no-unused-vars */
// app/analytics/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Analytics & BI',
  description: 'Executive BI dashboards, predictive forecasting, embedded analytics, and self-serve analytics platforms.',
  alternates: { canonical: '/analytics' },};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Data Analytics & Business Intelligence</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-12">
<<<<<<< HEAD
<<<<<<< HEAD
          <span className="text-6xl mb-4 block">{">📊"}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Analytics & Business Intelligence</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">Data analytics, BI dashboards, predictive insights, and AI-powered reporting.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[<span key="BI Dashboards" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">BI Dashboards</span>,<span key="Predictive Analytics" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">Predictive Analytics</span>,<span key="Data Viz" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">Data Viz</span>,<span key="AI Insights" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">AI Insights</span>].map(tag => tag)}
          </div>
=======
          <span className="text-6xl mb-4 block">{\'→📊\'}</span>
=======
          <span className="text-6xl mb-4 block">{'→📊'}</span>
>>>>>>> 50604a68 (fix(tsx): escape JSX inline quotes in analytics/5g/api-dev service page scripts)
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Data Analytics & Business Intelligence</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">Executive BI dashboards, predictive forecasting, embedded analytics, and self-serve analytics platforms.</p>
>>>>>>> 4bc61ade (fix(sub-pages): JSX encoding + undeclared placeholder vars in 4 industry pages)
          <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 inline-block">⚡ Get Your Custom Proposal →</Link>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Capabilities</h2>
<<<<<<< HEAD
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[<div className="glass-card"><span className="text-3xl block mb-3">📈</span><h3 className="text-lg font-semibold text-white mb-2">BI Dashboards</h3><p className="text-slate-400 text-sm">Real-time interactive dashboards with drill-down analytics, custom metrics, and automated reporting across your data sources.</p></div>,<div className="glass-card"><span className="text-3xl block mb-3">🔮</span><h3 className="text-lg font-semibold text-white mb-2">Predictive Analytics</h3><p className="text-slate-400 text-sm">ML-driven forecasting, trend analysis, and anomaly detection to anticipate business outcomes before they happen.</p></div>,<div className="glass-card"><span className="text-3xl block mb-3">📊</span><h3 className="text-lg font-semibold text-white mb-2">Data Visualization</h3><p className="text-slate-400 text-sm">Rich visual analytics with charts, heatmaps, geo-maps, and custom data storytelling for executive and operational audiences.</p></div>].map((item, i) => <div key={i}>{item}</div>)}
          </div>
=======
    [Features content TBD — auto-populated from service data]
>>>>>>> 4bc61ade (fix(sub-pages): JSX encoding + undeclared placeholder vars in 4 industry pages)
        </div>

        {/* Why Zion Tech Group */}
        <div className="mb-16 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Zion Tech Group</h2>
<<<<<<< HEAD
          <ul className="space-y-3">
            {[<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">Proven expertise across BI, ML, and data engineering</span></li>,<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">End-to-end delivery from data pipeline to executive dashboards</span></li>,<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">Custom solutions tailored to your industry and scale</span></li>].map((item, i) => <div key={i}>{item}</div>)}
          </ul>
=======
    [Why Zion Tech Group — expand per service page]
>>>>>>> 4bc61ade (fix(sub-pages): JSX encoding + undeclared placeholder vars in 4 industry pages)
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Industries We Serve</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
            We have deployed these solutions across organisations in Finance, Retail & E-commerce, Healthcare, Manufacturing, Energy.
          </p>
        </div>

        {/* CTA */}
        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's Build This Together</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you need a scoped proof-of-concept or a full enterprise engagement, we will tailor a plan that fits your timeline and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">⚡ Get Custom Proposal</Link>
            <Link href="/contact/" className="btn-secondary text-lg px-10 py-4">Talk to an Expert</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
