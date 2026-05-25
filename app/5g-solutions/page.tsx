/* eslint-disable @typescript-eslint/no-unused-vars */
// app/5g-solutions/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '5G & Private Network Solutions',
  description: 'Private 5G networks, edge IoT, network slicing, and spectrum advisory for enterprise connectivity.',
  alternates: { canonical: '/5g-solutions' },};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">5G & Private Network Solutions</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-12">
<<<<<<< HEAD
<<<<<<< HEAD
          <span className="text-6xl mb-4 block">📡</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">5G & Private Network Solutions</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">Private 5G networks, edge IoT, network slicing, and spectrum advisory for enterprise connectivity.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['5G NR','Edge IoT','Network Slicing','Spectrum Advisory'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">{tag}</span>
            ))}
          </div>
=======
          <span className="text-6xl mb-4 block">{\'→📡\'}</span>
=======
          <span className="text-6xl mb-4 block">{'→📡'}</span>
>>>>>>> 50604a68 (fix(tsx): escape JSX inline quotes in analytics/5g/api-dev service page scripts)
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">5G & Private Network Solutions</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">Private 5G networks, edge IoT, network slicing, and spectrum advisory for enterprise connectivity.</p>
>>>>>>> 4bc61ade (fix(sub-pages): JSX encoding + undeclared placeholder vars in 4 industry pages)
          <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 inline-block">⚡ Get Your Custom Proposal →</Link>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Capabilities</h2>
<<<<<<< HEAD
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '📶', title: 'Private 5G Networks', desc: 'End-to-end private 5G deployment — spectrum, RAN, core, and device integration for campus and industrial environments.' },
              { emoji: '🔗', title: 'Edge IoT Connectivity', desc: 'Ultra-reliable low-latency connectivity for IoT devices, sensors, and autonomous systems at the network edge.' },
              { emoji: '✂️', title: 'Network Slicing', desc: 'Virtualised, isolated network slices tailored to specific use cases — low latency, high bandwidth, or massive IoT.' },
            ].map(item => (
              <div key={item.title} className="glass-card">
                <span className="text-3xl block mb-3">{item.emoji}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
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
            {[
              'Deep expertise in 5G NR, edge computing, and IoT architecture',
              'Vendor-agnostic advisory — the best solution for your needs, not ours',
              'End-to-end delivery from spectrum analysis to deployment and managed operations',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-300">
                <span className="text-purple-400 mt-1 shrink-0">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
=======
    [Why Zion Tech Group — expand per service page]
>>>>>>> 4bc61ade (fix(sub-pages): JSX encoding + undeclared placeholder vars in 4 industry pages)
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Industries We Serve</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
            We have deployed these solutions across organisations in Manufacturing, Logistics, Healthcare, Public Safety, Energy & Utilities.
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
