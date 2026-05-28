// app/portal/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Client Portal — Zion Tech Group',
};

export default function PortalPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Client Portal</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Access your dashboards, support tickets, billing, and knowledge base.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: 'Support Tickets',   href: '/portal/tickets',    desc: 'Track and manage your support requests' },
          { title: 'Billing & Invoices',href: '/portal/billing',    desc: 'View invoices, payment methods, and billing history' },
          { title: 'Knowledge Base',    href: '/portal/kb',         desc: 'Documentation, guides, and how-tos' },
          { title: 'Projects',          href: '/portal/projects',   desc: 'Active project dashboards and milestones' },
        ].map((card) => (
          <Link key={card.title} href={card.href} className="glass-card">
            <h3 className="font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-slate-400 text-sm">{card.desc}</p>
            <span className="text-purple-400 text-xs mt-3 inline-block">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
