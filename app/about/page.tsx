import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Zion Tech Group',
  description: 'Zion Tech Group is an AI, IT, and Micro SAAS company helping enterprises transform operations with intelligent systems. Based in Middletown, DE.',
  openGraph: {
    title: 'About Us — Zion Tech Group',
    description: 'Zion Tech Group is an AI, IT, and Micro SAAS company helping enterprises transform operations with intelligent systems.',
    type: 'website',
    url: 'https://ziontechgroup.com/about',
    siteName: 'Zion Tech Group',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Zion Tech Group',
    description: 'Zion Tech Group is an AI, IT, and Micro SAAS company helping enterprises transform operations with intelligent systems.',
  },
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              About Zion Tech Group
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We build intelligent systems that transform businesses and create new possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Zion Tech Group exists to democratize enterprise-grade AI and IT solutions. We believe every business — from startups to Fortune 500s — deserves access to intelligent automation, predictive analytics, and modern cloud infrastructure.
            </p>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Founded with a vision to bridge the gap between cutting-edge research and practical business applications, we deliver solutions that measurable impact your bottom line.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <div className="text-2xl font-bold text-white">599+</div>
                  <div className="text-slate-400 text-sm">Services Delivered</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">🏢</div>
                <div>
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-slate-400 text-sm">Core Categories</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">🌍</div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-slate-400 text-sm">US-Based Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">What We Do</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: '🧠', title: 'AI & Machine Learning', desc: 'Custom ML models, NLP, computer vision, recommendation engines, and autonomous agents tailored to your business.' },
            { icon: '☁️', title: 'Cloud & Infrastructure', desc: 'Multi-cloud architecture, Kubernetes, serverless, DevOps automation, and 24/7 monitoring.' },
            { icon: '🔐', title: 'Cybersecurity', desc: 'Zero-trust architecture, threat detection, penetration testing, compliance audits, and managed SOC.' },
            { icon: '🤖', title: 'Automation & RPA', desc: 'Intelligent process automation, workflow orchestration, and robotic process automation.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Our Team</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          We are a distributed team of engineers, data scientists, and business strategists headquartered in Middletown, Delaware. Our team combines deep technical expertise with hands-on enterprise experience across healthcare, finance, retail, logistics, and government sectors.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Every engagement is led by senior engineers — no junior-only teams. We believe in shipping production-grade solutions, not prototypes.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Let's Build Something Together</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you need a single AI model or a full digital transformation, our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact/" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              📞 Contact Us
            </a>
            <a href="/services/" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition">
              🛠️ View Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
