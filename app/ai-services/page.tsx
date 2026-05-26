// app/ai-services/page.tsx — AI Services Hub (replaces placeholder)
'use client';

import Link from 'next/link';

import { useState, useMemo } from 'react';
import { allServices } from '@/data/servicesData';
import type { Service } from '@/data/servicesData';

const aiServices = allServices.filter((s: Service) => s.category === 'ai');

const FEATURED_AI_IDS = [
  'ai-analytics',
  'ai-chatbot-builder-pro',
  'ai-code-assistant-enterprise',
  'ai-customer-support',
  'ai-knowledge-graph',
  'ai-meeting-assistant-pro',
  'ai-voice-agent-platform',
  'ai-agentic-workflows',
  'ai-autonomous-qa-engineering',
  'ai-secrets-management',
];

export default function AIServicesPage() {
  const [query, setQuery] = useState('');
  const featured = useMemo(
    () => aiServices.filter((s: Service) => FEATURED_AI_IDS.includes(s.id)),
    []
  );
  const rest = useMemo(
    () =>
      aiServices.filter(
        (s: Service) =>
          !FEATURED_AI_IDS.includes(s.id) &&
          (!query.trim() ||
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase()))
      ),
    [query]
  );

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">AI Services</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-6xl mb-4 block">🤖</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Services</h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-6">
            {aiServices.length}+ AI-powered services — from chatbots to computer vision, predictive analytics to autonomous agents.
          </p>
          <Link
            href="/configurator/"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            ⚡ Get Your Custom AI Proposal →
          </Link>
        </div>

        {/* Featured */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⭐</span> Featured AI Services
          </h2>
          <p className="text-slate-400 mb-8">Our most-requested AI solutions</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {featured.map((service: Service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="glass-card flex flex-col group hover:border-purple-500/50 transition"
              >
                <span className="text-3xl mb-3">{service.icon || '🤖'}</span>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition leading-snug">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 flex-1 line-clamp-3">
                  {service.description}
                </p>
                <span className="text-purple-400 text-xs mt-3 font-medium">View details →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* All AI Services */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">All AI Services</h2>
              <p className="text-slate-400 text-sm mt-1">
                {aiServices.length} services — search and filter
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter AI services…"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {rest.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rest.map((service: Service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="glass-card flex flex-col p-5 group hover:border-purple-500/40 transition"
                >
                  <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition leading-snug mb-1">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 flex-1 mt-1">
                    {service.description}
                  </p>
                  <span className="text-purple-400 text-xs mt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Details <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No AI services match your filter.</p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center glass-card p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Can't find what you need?</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            We can build a custom AI solution tailored to your exact requirements. Let's talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+13024640950" className="btn-primary">📞 +1 302 464 0950</a>
            <Link href="/contact/" className="btn-secondary">✉️ Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
