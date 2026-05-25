// app/pricing/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Pricing',
  description: 'Transparent pricing tiers for AI, IT, and Micro-SaaS services. From startup to enterprise.',
  alternates: { canonical: '/pricing/' },
};

export default function PricingPage() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify('{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Pricing \\u2014 Zion Tech Group",\n  "description": "Transparent pricing tiers for AI, IT, and Micro-SaaS services. From startup to enterprise.",\n  "url": "https://ziontechgroup.com/pricing"\n}') }} />
    <div className="container-page py-16">
      {/* JSON-LD: WebPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing — Zion Tech Group",
            description:
              "Transparent pricing tiers for AI, IT, and Micro-SaaS services. From startup to enterprise.",
            url: "https://ziontechgroup.com/pricing",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ziontechgroup.com" },
                { "@type": "ListItem", position: 2, name: "Pricing", item: "https://ziontechgroup.com/pricing" },
              ],
            },
          })),
        }}
      />
      <h1 className="text-4xl font-bold text-white mb-4">Pricing</h1>
      <p className="text-slate-400 mb-12 max-w-2xl">
        Every engagement is custom — but here's a general view of our pricing tiers.
        Use the <Link href="/pricing-calculator/" className="text-purple-400 underline">Pricing Calculator</Link> for an instant estimate.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            tier: 'Starter',
            price: '$2,500',
            period: '/month',
            features: ['Up to 5 services', 'Email support', 'Monthly report', 'Standard SLA'],
          },
          {
            tier: 'Professional',
            price: '$7,500',
            period: '/month',
            features: ['Up to 20 services', 'Priority support', 'Weekly report', '99.9% SLA', 'Dedicated account manager'],
            featured: true,
          },
          {
            tier: 'Enterprise',
            price: 'Custom',
            period: '',
            features: ['Unlimited services', '24/7 support', 'Real-time reporting', '99.99% SLA', 'Custom integrations', 'On-premise options'],
          },
        ].map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-2xl border p-6 ${
              plan.featured
                ? 'border-purple-500/50 bg-purple-900/10 shadow-lg shadow-purple-500/10'
                : 'border-slate-700/50 bg-slate-900/40'
            }`}
          >
            <div className="text-slate-400 text-sm font-medium mb-1">{plan.tier}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {plan.price}<span className="text-sm text-slate-500">{plan.period}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-purple-400 mt-0.5" aria-hidden="true">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/contact/"
              className={`mt-6 block text-center rounded-full px-6 py-2.5 text-sm font-semibold ${
                plan.featured
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'border border-slate-600 text-slate-300 hover:border-purple-500 hover:text-white'
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-slate-400 mb-4">Need a custom solution? Let us build a tailored proposal.</p>
        <Link href="/proposal-generator/" className="btn-primary">Generate Custom Proposal</Link>
      </div>
    </div>
  );
}
