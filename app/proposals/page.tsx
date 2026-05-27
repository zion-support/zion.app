// app/proposals/page.tsx — Saved Proposals Viewer
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Proposal {
  id: string;
  companyName: string;
  createdAt: string;
  services: string[];
  status: 'pending' | 'sent' | 'accepted' | 'declined';
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from an API endpoint
    // For now, check if there are any saved proposals in localStorage
    try {
      const saved = localStorage.getItem('zion_proposals');
      if (saved) {
        setProposals(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 py-20">
        <div className="container-page text-center text-slate-400">Loading proposals...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <h1 className="text-4xl font-bold text-white mb-2">Your Proposals</h1>
        <p className="section-subheading">View and manage your service proposals</p>

        {proposals.length === 0 ? (
          <div className="glass-card text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-white mb-2">No Proposals Yet</h2>
            <p className="text-slate-400 mb-6">Use our configurator to generate your first custom proposal.</p>
            <Link href="/configurator/" className="btn-primary inline-block">
              Create a Proposal →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {proposals.map((p, i) => (
              <div key={i} className="glass-card flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{p.companyName}</h3>
                  <p className="text-slate-400 text-sm">
                    {p.services.length} services • {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.services.slice(0, 4).map((s, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded bg-purple-900/30 text-purple-300">
                        {s}
                      </span>
                    ))}
                    {p.services.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-400">
                        +{p.services.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${{
                      pending: 'bg-yellow-900/30 text-yellow-300',
                      sent: 'bg-blue-900/30 text-blue-300',
                      accepted: 'bg-green-900/30 text-green-300',
                      declined: 'bg-red-900/30 text-red-300',
                    }[p.status]}`}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <section className="cta-section mt-20">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Proposal?</h2>
          <p className="text-slate-300 mb-6">
            Our team will design a tailored solution based on your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurator/" className="btn-primary text-lg">
              Start Configurator →
            </Link>
            <a href="tel:+13024640950" className="btn-secondary text-lg">
              ☎ +1 302 464 0950
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            ✉️ kleber@ziontechgroup.com | 📍 364 E Main St STE 1008, Middletown, DE 19709
          </p>
        </section>
      </div>
    </main>
  );
}