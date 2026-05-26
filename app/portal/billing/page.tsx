// app/portal/billing/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Billing & Invoices — Client Portal',
  description: 'View your invoices, payment methods, and billing history. Secure client portal access.',
};

export default function BillingPage() {
  return (
    <div className="container-page py-16">
      <Link href="/portal/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">&larr; Back to Client Portal</Link>
      <div className="glass-card max-w-2xl">
        <div className="text-5xl mb-4">&#x1F4B3;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Billing &amp; Invoices</h1>
        <p className="text-slate-400 mb-8">View your invoices, update payment methods, and track payment history.</p>
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Invoice #INV-2026-001</h3>
                <p className="text-slate-400 text-sm">Consulting Services — May 2026</p>
              </div>
              <span className="text-purple-400 font-bold">$15,000.00</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Invoice #INV-2026-000</h3>
                <p className="text-slate-400 text-sm">Monthly Retainer — Apr 2026</p>
              </div>
              <span className="text-purple-400 font-bold">$12,500.00</span>
            </div>
          </div>
        </div>
        <div className="mt-8 p-4 bg-cyan-950/30 rounded-xl border border-cyan-500/20">
          <p className="text-cyan-300 text-sm">Need a detailed invoice or to update billing info? <a href="/contact/" className="underline hover:text-cyan-200">Contact us</a> or call <a href="tel:+13024640950" className="underline">+1 302 464 0950</a>.</p>
        </div>
      </div>
    </div>
  );
}
