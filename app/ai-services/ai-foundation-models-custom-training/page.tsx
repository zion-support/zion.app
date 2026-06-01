import Metadata from '@/components/Metadata';
export default function Page() {
  return (<>
    <Metadata title="AI Foundation Models & Custom Training" description="AI Foundation Models & Custom Training solutions for enterprise." />
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-transparent to-transparent" />
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/5 mb-6">
            <span className="text-fuchsia-400 text-xs font-semibold uppercase tracking-wider">Training</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">AI Foundation Models & Custom Training</h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">AI Foundation Models & Custom Training solutions for enterprise.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/contact" className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition">Get Started</a>
            <a href="/pricing" className="inline-flex items-center px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-purple-500/40 transition">View Pricing</a>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/60">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">Contact our team: +1 302 464 0950 | kleber@ziontechgroup.com</p>
          <a href="/contact" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg">Schedule Free Consultation</a>
        </div>
      </section>
    </main>
  </>);
}
