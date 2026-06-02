import Metadata from "@/components/Metadata";
export default function Page() {
  return (<>
    <Metadata title="Zion AI Fraud Detection | Zion Tech Group" description="AI-powered fraud detection for real-time transaction monitoring and anomaly detection." />
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" />
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-400/20 bg-red-400/5 mb-6">
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">AI Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">Zion AI Fraud Detection</h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">Real-time AI fraud detection with 99.5%+ accuracy. Sub-100ms transaction analysis, adaptive ML models, and automated compliance for financial institutions.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/contact" className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition">Get Started</a>
            <a href="/pricing" className="inline-flex items-center px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-purple-500/40 transition">View Pricing</a>
          </div>
        </div>
      </section>
      <section className="py-16 border-t border-slate-800/60"><div className="container-page"><h2 className="text-3xl font-bold text-white mb-8">Key Features</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6"><div className="text-3xl mb-3">&#128267;</div><h3 className="text-lg font-semibold text-white mb-2">Real-Time Detection</h3><p className="text-sm text-slate-400">Analyze transactions in milliseconds with sub-100ms latency.</p></div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6"><div className="text-3xl mb-3">&#128200;</div><h3 className="text-lg font-semibold text-white mb-2">99.5%+ Accuracy</h3><p className="text-sm text-slate-400">Industry-leading detection rate with minimal false positives.</p></div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6"><div className="text-3xl mb-3">&#128274;</div><h3 className="text-lg font-semibold text-white mb-2">AML Compliance</h3><p className="text-sm text-slate-400">Automated anti-money laundering and suspicious activity reporting.</p></div>
      </div></div></section>
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/60">
        <div className="container-page text-center"><h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2><p className="text-slate-400 max-w-xl mx-auto mb-8">+1 302 464 0950 | kleber@ziontechgroup.com</p><a href="/contact" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg">Free Consultation</a></div>
      </section>
    </main>
  </>);
}
