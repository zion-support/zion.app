import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Agents Monitoring — Zion Tech Group',
  description: 'Live monitoring dashboard for Zion agents.',
};

export default function AgentsDashboardPage() {
  return (
    <section className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold">Agents Monitoring Dashboard</h1>
        <p className="text-slate-300 mt-2">Fleet health, link audit status, uptime, and latest actions.</p>
        <div className="mt-6">
          <Link href="/agents-dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 inline-block">
            Open standalone dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
