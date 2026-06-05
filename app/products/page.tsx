// app/products/page.tsx — Products & Platforms
'use client';
import Link from 'next/link';
import { allServices } from '@/data/servicesData';

const PRODUCTS: readonly {
  key: string;
  title: string;
  desc: string;
  emoji: string;
  count: number;
  cta: string;
  bullets: readonly string[];
}[] = [
  {
    key: 'ai',
    title: 'AI & Machine Learning',
    desc: 'Generative AI, autonomous agents, computer vision, RAG platforms, LLM orchestration, and enterprise copilots.',
    emoji: '🤖',
    count: 307,
    cta: '/services/ai',
    bullets: [
      'Enterprise AI Copilots & Assistants',
      'Autonomous Agents & Workflow Orchestration',
      'RAG & Knowledge Systems',
      'Computer Vision & Multimodal AI',
      'AI Governance & Responsible AI',
      'Foundation Model Custom Training',
    ],
  },
  {
    key: 'it',
    title: 'IT Infrastructure',
    desc: 'DevOps, DevSecOps, API platforms, site reliability engineering, and infrastructure-as-code tooling.',
    emoji: '🔧',
    count: 110,
    cta: '/services/it',
    bullets: [
      'CI/CD & Automated Deployments',
      'API Gateway & Rate-Limiting',
      'Infrastructure as Code (IaC)',
      'Edge Computing & IoT Infrastructure',
      'Zero-Trust Network Architecture',
      'Backup & Disaster Recovery',
    ],
  },
  {
    key: 'cloud',
    title: 'Cloud & DevOps',
    desc: 'Multi-cloud migration, managed Kubernetes, serverless platforms, and 24/7 cloud operations.',
    emoji: '☁️',
    count: 68,
    cta: '/services/cloud',
    bullets: [
      'Multi-Cloud Migration',
      'Managed Kubernetes & Containers',
      'Serverless & Event-Driven Architecture',
      'Cost Optimisation & FinOps',
      'Cloud Security Posture Management',
      'DRaaS & High Availability',
    ],
  },
  {
    key: 'security',
    title: 'Cybersecurity',
    desc: 'Threat detection, SIEM, SOAR, compliance automation, identity management, and zero-trust controls.',
    emoji: '🛡',
    count: 49,
    cta: '/services/security',
    bullets: [
      'SIEM, SOAR & XDR',
      'AI-Powered Threat Detection',
      'Compliance Automation (FedRAMP, SOC 2, GDPR)',
      'Identity & Access Management (IAM)',
      'Zero-Trust Architecture',
      'Penetration Testing & Red Teaming',
    ],
  },
  {
    key: 'data',
    title: 'Data & Analytics',
    desc: 'Enterprise BI, predictive analytics, data lakes, real-time streaming, and self-serve analytics tools.',
    emoji: '📊',
    count: 39,
    cta: '/services/data',
    bullets: [
      'Executive BI Dashboards',
      'Predictive ML Forecasting',
      'Data Lake & Lakehouse Architecture',
      'Embedded Analytics & SDKs',
      'Semantic Layer & Metric Governance',
      'Self-Serve SQL Builder',
    ],
  },
  {
    key: 'automation',
    title: 'Process Automation',
    desc: 'RPA, intelligent document processing, workflow orchestration, and hyper-automation playbooks.',
    emoji: '⚡',
    count: 29,
    cta: '/services/automation',
    bullets: [
      'RPA + AI Agent Orchestration',
      'Intelligent Document Processing (IDP)',
      'Workflow Orchestration (low-code)',
      'Finance & HR Process Automation',
      'Customer-Service Automation',
      'Supply-Chain Event Automation',
    ],
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <nav className="mb-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Products</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Products &amp; Platforms
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Six product families, <strong className="text-white">{PRODUCTS.reduce((s, p) => s + p.count, 0).toLocaleString()}</strong> services — structured
            into AI, IT, Cloud, Security, Data, and Automation. Pick a family to drill into the
            full service catalog.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {PRODUCTS.map((p) => (
            <div
              key={p.key}
              className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition flex flex-col"
            >
              <div className="text-4xl mb-3">{p.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-1">{p.title}</h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{p.desc}</p>
              <ul className="space-y-1.5 mb-6 flex-1">
                {p.bullets.map((b, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>{b}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
                <span className="text-slate-400 text-sm">
                  {p.count.toLocaleString()} service{p.count > 1 ? 's' : ''}
                </span>
                <Link
                  href={p.cta}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
                >
                  Browse →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't Find What You Need?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            We build custom systems on top of any of these platforms — or stitch several together
            into a single AI-first solution. Tell us what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurator/" className="btn-primary text-lg px-10 py-4">
              ⚙️ Build a Custom Solution
            </Link>
            <Link href="/contact/" className="btn-secondary text-lg px-10 py-4">
              Talk to an Expert
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
