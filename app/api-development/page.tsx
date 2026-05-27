// app/api-development/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Development & Integration',
  description: 'REST, GraphQL, and gRPC API development with OpenAPI docs, SDKs, event-driven architecture, API gateway.',
  alternates: { canonical: '/api-development' },};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">API Development & Integration</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-6xl mb-4 block">{">🔧"}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">API Development & Integration</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">RESTful and GraphQL API design, microservices integration, API gateway management.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[<span key="REST API" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">REST API</span>,<span key="GraphQL" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">GraphQL</span>,<span key="Microservices" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">Microservices</span>,<span key="API Gateway" className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">API Gateway</span>].map(tag => tag)}
          </div>
          <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 inline-block">⚡ Get Your Custom Proposal →</Link>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[<div className="glass-card"><span className="text-3xl block mb-3">🔌</span><h3 className="text-lg font-semibold text-white mb-2">RESTful API Design</h3><p className="text-slate-400 text-sm">Standards-compliant REST API design with OpenAPI 3.1 specification, versioning strategy, and comprehensive documentation.</p></div>,<div className="glass-card"><span className="text-3xl block mb-3">🕸️</span><h3 className="text-lg font-semibold text-white mb-2">GraphQL Federation</h3><p className="text-slate-400 text-sm">Federated GraphQL architecture for composing multiple microservices into a unified, type-safe API layer.</p></div>,<div className="glass-card"><span className="text-3xl block mb-3">🔐</span><h3 className="text-lg font-semibold text-white mb-2">API Gateway & Security</h3><p className="text-slate-400 text-sm">Enterprise API gateway with rate limiting, authentication, WAF rules, and developer portal with interactive docs.</p></div>].map((item, i) => <div key={i}>{item}</div>)}
          </div>
        </div>

        {/* Why Zion Tech Group */}
        <div className="mb-16 glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Zion Tech Group</h2>
          <ul className="space-y-3">
            {[<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">Deep expertise in API-first architecture and microservices</span></li>,<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">OpenAPI 3.1 and GraphQL certified engineers on staff</span></li>,<li className="flex items-start gap-3 text-slate-300"><span className="text-purple-400 mt-1 shrink-0">✓</span><span className="text-sm">End-to-end delivery from design to deployment and monitoring</span></li>].map((item, i) => <div key={i}>{item}</div>)}
          </ul>
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Industries We Serve</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
            We have deployed these solutions across organisations in Technology, Fintech, E-commerce, Healthcare, Manufacturing.
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
