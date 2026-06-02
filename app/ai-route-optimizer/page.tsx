import Link from 'next/link';

export const metadata = {
  title: 'AI Route Optimizer | Zion Tech Group',
  description: 'Optimize delivery routes and logistics with AI-powered planning.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">AI Route Optimizer</h1>
        <p className="text-slate-400 text-lg mb-8">Optimize delivery routes and logistics with AI-powered planning.</p>
        <div className="flex flex-wrap gap-4">
        <Link href="/services" className="text-emerald-400 hover:text-emerald-300 underline">Logistics AI Services</Link>
        <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 underline">Learn More</Link>
        </div>
        <div className="mt-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-3">Get Started Today</h2>
          <p className="text-slate-400 mb-4">Contact our team for a free consultation.</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="tel:+13024640950" className="text-emerald-400">📞 +1 302 464 0950</a>
            <a href="mailto:kleber@ziontechgroup.com" className="text-emerald-400">✉️ kleber@ziontechgroup.com</a>
          </div>
        </div>
      </div>
    </main>
  );
}
