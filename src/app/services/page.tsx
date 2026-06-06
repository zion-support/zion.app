import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Services — Zion Tech Group',
  description: 'Browse the full Zion service catalog by category.',
};

const CONTACT_PHONE = '+1 302 464 0950';
const CONTACT_EMAIL = 'kleber@ziontechgroup.com';
const CONTACT_ADDRESS = '364 E Main St STE 1008, Middletown, DE 19709';

const categories = [
  {
    label: 'AI & Machine Learning',
    emoji: '🧠',
    description: 'Predictive models, computer vision, NLP, generative AI, and applied AI delivery.',
    benefits: ['Faster decision-making with explainable outputs', 'Lower operating cost with document and workflow automation', 'Measurable ROI from pilots through production'],
    features: ['Custom model development', 'LLM integration and fine-tuning', 'Predictive analytics', 'Computer vision and OCR'],
    href: '/services?category=ai',
    market: 'Average AI engagements start at $999/mo and range to custom enterprise retainers depending on scope, data readiness, and integration complexity.',
  },
  {
    label: 'IT Services',
    emoji: '🖥️',
    description: 'Managed IT, help desk, endpoint management, identity, and infrastructure operations.',
    benefits: ['Reduced downtime with proactive monitoring', 'Simplified procurement with vendor consolidation', 'Improved security posture across devices and identities'],
    features: ['Unified endpoint management', 'Identity and access management', 'Incident response and support', 'Backup and disaster recovery'],
    href: '/services?category=it',
    market: 'Managed IT support is typically $8,000-$18,000/mo for mid-market customers; enterprise support and SOC services run higher based on device count and compliance requirements.',
  },
  {
    label: 'Cloud Services',
    emoji: '☁️',
    description: 'Migration, multi-cloud orchestration, cost management, and modern platform engineering.',
    benefits: ['Lower cloud waste with structured FinOps', 'Faster deployments with repeatable infrastructure', 'Optional redundancy across AWS, Azure, and GCP'],
    features: ['Cloud migration and modernization', 'Multi-cloud orchestration', 'Serverless and container platforms', 'FinOps and cost governance'],
    href: '/services?category=cloud',
    market: 'Cloud migration engagements commonly start at $10,000/mo for retainers and $50K-$120K for migration projects; ongoing platform support varies by environment size.',
  },
  {
    label: 'Security Services',
    emoji: '🔐',
    description: 'Zero-trust security, compliance, threat intelligence, and incident readiness.',
    benefits: ['Lower breach exposure with layered controls', 'Faster audit preparation with documented processes', 'Clear ownership for incident response'],
    features: ['Zero-trust architecture', 'Compliance and policy automation', 'Threat intelligence and hunting', 'Incident response and tabletop exercises'],
    href: '/services?category=security',
    market: 'Security program engagements typically range from $3,000-$15,000/mo retainers; enterprise GRC and SOC services often start at $25,000/mo depending on regulated scope.',
  },
  {
    label: 'Data & Analytics',
    emoji: '📊',
    description: 'Lakehouses, BI platforms, real-time analytics, observation, and governance for decision-ready data.',
    benefits: ['Better decisions with governed, trusted datasets', 'Faster reporting with fewer engineering bottlenecks', 'Consistent definitions across departments and systems'],
    features: ['Data warehouse modernization', 'Real-time analytics', 'Metadata and governance', 'BI and product analytics'],
    href: '/services?category=data',
    market: 'Data and analytics engagements commonly start at $5,000/mo for managed reporting and $15,000-$45,000/mo for platform modernization and embedded analytics.',
  },
  {
    label: 'Automation & DevOps',
    emoji: '🤖',
    description: 'CI/CD pipelines, workflow automation, observability, incident operations, and platform reliability.',
    benefits: ['Faster release cycles with repeatable pipelines', 'Lower human error through workflow automation', 'Faster recovery from production incidents'],
    features: ['CI/CD and platform automation', 'Workflow orchestration RPA', 'Observability and monitoring', 'Incident response automation'],
    href: '/services?category=automation',
    market: 'Automation and DevOps support typically costs $4,500-$16,000/mo; SRE and incident response retainers often start at $8,000/mo depending on uptime requirements.',
  },
  {
    label: 'Blockchain & Web3',
    emoji: '⛓️',
    description: 'Smart contract auditing, tokenization, protocol integration, and decentralized application support.',
    benefits: ['Lower technical risk with verified contracts', 'Faster integration into existing product stacks', 'Experience with compliance and custody requirements'],
    features: ['Smart contract audits', 'Tokenization and rewards systems', 'Protocol integration', 'Web3 product delivery'],
    href: '/services?category=blockchain',
    market: 'Blockchain engagements commonly start at $8,000-$25,000/mo for advisory and delivery; smart contract audits are often $5K-$20K per scope depending on contract complexity and chain type.',
  },
  {
    label: 'IoT & Edge',
    emoji: '📡',
    description: 'Edge compute, device fleets, real-time telemetry, and connected-product platforms.',
    benefits: ['Faster local decisions with edge inference', 'Lower bandwidth cost with telemetry filtering', 'Safer operations with real-time monitoring'],
    features: ['Edge compute and AI-on-device', 'Connected device fleets', 'Real-time telemetry and analytics', 'Industrial IoT and monitoring systems'],
    href: '/services?category=iot',
    market: 'IoT platform and implementation engagements commonly start at $12,000/mo; industrial and edge projects often start at $25K-$80K depending on device scale and safety requirements.',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]"></div>
        <div className="relative container-page pt-24 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Services</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl">
              Zion Tech Group delivers production-ready services across AI, cloud, security, data, automation, blockchain, IoT, and managed infrastructure.
              Each engagement ships with transparent pricing, defined SLAs, and measurable success criteria.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Pricing</Link>
              <Link href="/contact" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Contact sales</Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300">
              <div>📞 {CONTACT_PHONE}</div>
              <div>✉️ {CONTACT_EMAIL}</div>
              <div>📍 {CONTACT_ADDRESS}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <h2 className="text-lg font-semibold text-white">{item.label}</h2>
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Benefits</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {item.benefits.map((b) => <li key={b}>• {b}</li>)}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Capabilities</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {item.features.map((f) => (
                      <li key={f} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Market range</p>
                  <p className="mt-2 text-sm text-slate-300">{item.market}</p>
                </div>
                <div className="mt-6">
                  <Link href={item.href} className="text-sm font-semibold text-blue-300 hover:text-blue-200">View services →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
