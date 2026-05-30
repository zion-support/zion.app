// app/email-dashboard/page.tsx — Email Analytics Dashboard
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  total_processed: number;
  total_replied: number;
  total_escalated: number;
  total_archived: number;
  reply_rate?: string;
  sentiment_distribution: Record<string, number>;
  intent_distribution: Record<string, number>;
  daily_stats: Record<string, { processed: number; replied: number; escalated: number }>;
  sender_stats: Record<string, { count: number; last_subject: string; last_date: string }>;
  last_updated: string | null;
}

const CONTACT = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  website: 'https://ziontechgroup.com',
};

export default function EmailDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data/email_analytics.json')
      .then(r => r.ok ? r.json() : Promise.reject('No data yet'))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 text-lg">⏳ Loading analytics...</div>
    </main>
  );

  if (error || !data) return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-slate-400 text-lg mb-4">📊 No analytics data yet</div>
        <p className="text-slate-500 text-sm">Run the Email Agent to start collecting data.</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/" className="btn-secondary">← Back to Home</Link>
          <Link href="/configurator/" className="btn-primary">⚡ Get a Proposal</Link>
        </div>
      </div>
    </main>
  );

  const replyRate = data.total_processed > 0
    ? ((data.total_replied / data.total_processed) * 100).toFixed(1)
    : '0';

  const topSenders = Object.entries(data.sender_stats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  const recentDays = Object.entries(data.daily_stats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 14);

  const topIntents = Object.entries(data.intent_distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-page py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Email Analytics Dashboard</h1>
            <p className="text-slate-400">Real-time email response metrics and insights</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn-secondary">← Home</Link>
            <Link href="/configurator/" className="btn-primary">⚡ Get Proposal</Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Processed', value: data.total_processed, icon: '📧', color: 'from-blue-500 to-cyan-500' },
            { label: 'Auto-Replied', value: data.total_replied, icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: 'Escalated', value: data.total_escalated, icon: '⚠️', color: 'from-orange-500 to-red-500' },
            { label: 'Archived', value: data.total_archived, icon: '📁', color: 'from-slate-500 to-slate-600' },
            { label: 'Reply Rate', value: `${replyRate}%`, icon: '📈', color: 'from-purple-500 to-indigo-500' },
          ].map((kpi, i) => (
            <div key={i} className="glass-card text-center">
              <div className="text-2xl mb-1">{kpi.icon}</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                {kpi.value}
              </div>
              <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Distribution */}
          <div className="glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">😊 Sentiment Distribution</h2>
            <div className="space-y-3">
              {Object.entries(data.sentiment_distribution).map(([sentiment, count]) => {
                const total = Object.values(data.sentiment_distribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                const colors: Record<string, string> = {
                  positive: 'bg-green-500', negative: 'bg-red-500', neutral: 'bg-slate-500', mixed: 'bg-yellow-500',
                };
                return (
                  <div key={sentiment}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 capitalize">{sentiment}</span>
                      <span className="text-slate-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className={`h-2 rounded-full ${colors[sentiment] || 'bg-slate-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Intents */}
          <div className="glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">🎯 Top Email Intents</h2>
            <div className="space-y-2">
              {topIntents.map(([intent, count]) => (
                <div key={intent} className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300 capitalize">{intent.replace(/_/g, ' ')}</span>
                  <span className="text-purple-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity */}
          <div className="glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">📅 Daily Activity (Last 14 Days)</h2>
            <div className="space-y-2">
              {recentDays.length === 0 ? (
                <p className="text-slate-500 text-sm">No daily data yet</p>
              ) : recentDays.map(([day, stats]) => (
                <div key={day} className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">{day}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-400">📧 {stats.processed}</span>
                    <span className="text-green-400">✅ {stats.replied}</span>
                    <span className="text-orange-400">⚠️ {stats.escalated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Senders */}
          <div className="glass-card">
            <h2 className="text-lg font-semibold text-white mb-4">👥 Top Senders</h2>
            <div className="space-y-2">
              {topSenders.length === 0 ? (
                <p className="text-slate-500 text-sm">No sender data yet</p>
              ) : topSenders.map(([sender, stats]) => (
                <div key={sender} className="py-1 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm truncate max-w-[200px]">{sender}</span>
                    <span className="text-purple-400 font-semibold">{stats.count}x</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{stats.last_subject}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="glass-card text-center py-8">
          <h2 className="text-xl font-bold text-white mb-2">Need Help With Your Email Automation?</h2>
          <p className="text-slate-400 mb-4">Our AI email responder handles 700+ services automatically</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`mailto:${CONTACT.email}`} className="btn-primary">✉ Email Us</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-secondary">☎ {CONTACT.phone}</a>
            <Link href="/configurator/" className="btn-secondary">⚡ Get Custom Proposal</Link>
          </div>
        </div>

        {data.last_updated && (
          <div className="text-center text-xs text-slate-600 mt-4">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </div>
        )}
      </div>
    </main>
  );
}
