// app/portal/tickets/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Support Tickets — Client Portal',
  description: 'Track and manage your support requests.',
};

export default function TicketsPage() {
  const tickets = [
    { id: 'TKT-0042', title: 'AI workflow failing on data validation step', status: 'Open', priority: 'High', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { id: 'TKT-0041', title: 'API key rotation — scheduled maintenance', status: 'Resolved', priority: 'Low', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { id: 'TKT-0040', title: 'Integration with Salesforce CRM', status: 'In Progress', priority: 'Medium', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ];

  return (
    <div className="container-page py-16">
      <Link href="/portal/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">&larr; Back to Client Portal</Link>
      <div className="glass-card max-w-2xl">
        <div className="text-5xl mb-4">&#x1F3AB;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Support Tickets</h1>
        <p className="text-slate-400 mb-8">Track and manage your support requests. We respond within SLA timeframes.</p>
        <div className="space-y-4">
          {tickets.map((t, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/30 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-mono">{t.id}</span>
                  <h3 className="text-white font-semibold mt-1">{t.title}</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${t.color}`}>{t.status}</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">Priority: {t.priority}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-purple-950/30 rounded-xl border border-purple-500/20">
          <p className="text-purple-300 text-sm">Can&apos;t find what you need? <a href="/contact/" className="underline hover:text-purple-200">Submit a support ticket</a> or call <a href="tel:+13024640950" className="underline">+1 302 464 0950</a>.</p>
        </div>
      </div>
    </div>
  );
}
