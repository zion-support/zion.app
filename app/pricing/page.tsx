// app/pricing/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Pricing — Zion Tech Group',
  description: 'Transparent pricing tiers for AI, IT, and Micro-SaaS services. From startup to enterprise.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Pricing & Plans</h1>
      <p className="text-slate-400 mb-4 max-w-2xl">
        Transparent pricing for AI, IT, Micro-SaaS, Cloud, Security, and Data solutions.
        Every engagement is custom — here's a general view of our market-rate pricing tiers.
      </p>
      <p className="text-slate-500 mb-12 max-w-2xl text-sm">
        📞 <a href="tel:+13024640950" className="text-purple-400 hover:underline">+1 302 464 0950</a> · ✉️ <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:underline">kleber@ziontechgroup.com</a> · 📍 364 E Main St STE 1008, Middletown DE 19709
      </p>
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {[
          {
            tier: 'Starter',
            price: '$49',
            period: '/month',
            desc: 'Perfect for small businesses and startups',
            features: ['1 Micro-SaaS tool', 'Basic AI features', 'Email support', 'Standard SLA (99%)', 'Up to 5 users'],
          },
          {
            tier: 'Professional',
            price: '$149',
            period: '/month',
            desc: 'For growing teams and SMBs',
            features: ['Up to 5 Micro-SaaS tools', 'Advanced AI features', 'Priority support', '99.9% SLA', 'Up to 25 users', 'API access', 'Custom integrations'],
            featured: true,
          },
          {
            tier: 'Enterprise',
            price: 'Custom',
            period: '',
            desc: 'For large organizations with complex needs',
            features: ['Unlimited services', 'Full AI/ML suite', '24/7 dedicated support', '99.99% SLA', 'Unlimited users', 'On-premise options', 'Custom SLA', 'Dedicated account manager'],
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
            {plan.desc && <div className="text-slate-500 text-xs mb-2">{plan.desc}</div>}
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
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Service Categories & Market Rates</h2>
        <p className="text-slate-400 mb-8">Average market prices for our most popular service categories. Contact us for custom quotes.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {cat: '🧠 AI & Machine Learning', range: '$149–$2,999/mo', examples: 'Chatbots, Analytics, NLP, Computer Vision, Code Review'},
            {cat: '☁️ Cloud & DevOps', range: '$99–$4,999/mo', examples: 'Migration, Kubernetes, CI/CD, Cost Optimization, DRaaS'},
            {cat: '🔐 Cybersecurity', range: '$499–$14,999/mo', examples: 'SOCaaS, Pen Testing, Compliance, Backup & DR, Training'},
            {cat: '📊 Data & Analytics', range: '$199–$5,999/mo', examples: 'Pipelines, Data Quality, Catalog, CDP, BI Dashboards'},
            {cat: '🚀 Micro-SaaS Products', range: '$15–$299/mo', examples: 'Invoice Cloud, Review Boost, URL Monitor, ChatWidget, Forms'},
            {cat: '🤖 Automation & RPA', range: '$49–$2,999/mo', examples: 'Workflow Automation, Email, Social Media, Testing'},
            {cat: '🖥️ IT Services', range: '$999–$29,999/mo', examples: 'Helpdesk, Cloud Review, VoIP, Migration, Pen Testing'},
            {cat: '⛓️ Blockchain & Web3', range: '$2,999–$24,999', examples: 'Smart Contract Audit, NFT Marketplace, Tokenization'},
            {cat: '📡 IoT & Edge', range: '$499–$9,999/mo', examples: 'Device Management, Digital Twin, Predictive Maintenance'},
          ].map((item) => (
            <div key={item.cat} className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
              <div className="text-white font-semibold text-sm mb-1">{item.cat}</div>
              <div className="text-purple-400 font-bold text-sm mb-1">{item.range}</div>
              <div className="text-slate-500 text-xs">{item.examples}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Get Started?</h3>
        <p className="text-slate-400 mb-6">Get a custom quote tailored to your specific needs. Same-day response guaranteed.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/contact/" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition">Contact Sales</a>
          <a href="tel:+13024640950" className="rounded-full border border-slate-600 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-purple-500 hover:text-white transition">Call +1 302 464 0950</a>
          <a href="mailto:kleber@ziontechgroup.com" className="rounded-full border border-slate-600 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-purple-500 hover:text-white transition">Email Us</a>
        </div>
        <p className="text-slate-500 text-xs mt-4">📍 364 E Main St STE 1008, Middletown DE 19709</p>
      </div>
    </div>
  );
}
