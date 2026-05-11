import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Innovation Bundles | Zion Tech Group',
  description:
    'Pre-designed AI bundles for faster rollout. Combine apps across customer success, revenue, operations, security, and more.',
  alternates: { canonical: '/innovation-bundles' },
};

type BundleModule = { name: string; href: string };

type InnovationBundle = {
  title: string;
  description: string;
  impact: string;
  href: string;
  cta: string;
  icon: string;
  modules: BundleModule[];
};

const bundles: InnovationBundle[] = [
  {
    title: 'Customer Success Engine',
    description:
      'Unify onboarding, support, and feedback into one customer success platform that drives retention.',
    impact: 'Higher retention',
    href: '/zion-ai-onboarding-pro',
    cta: 'Launch success engine',
    icon: '🎯',
    modules: [
      { name: 'AI Onboarding Pro', href: '/zion-ai-onboarding-pro' },
      { name: 'AI Customer Support Pro', href: '/zion-ai-customer-support-pro' },
      { name: 'AI Customer Sentiment Tracker', href: '/zion-ai-customer-sentiment-tracker' },
    ],
  },
  {
    title: 'Revenue Command Center',
    description:
      'Unify inbound capture, lead qualification, and outreach orchestration into one revenue engine.',
    impact: 'Faster qualified pipeline',
    href: '/zion-smart-crm-automation',
    cta: 'Launch revenue bundle',
    icon: '💼',
    modules: [
      { name: 'AI Lead Scoring', href: '/zion-ai-lead-scoring' },
      { name: 'AI Email Marketing Pro', href: '/zion-ai-email-marketing-pro' },
      { name: 'Smart CRM Automation', href: '/zion-smart-crm-automation' },
    ],
  },
  {
    title: 'Autonomous Operations Desk',
    description:
      'Turn documents, meetings, and team handoffs into structured automations with audit trails.',
    impact: 'Less manual back-office work',
    href: '/zion-workflow-automation',
    cta: 'Build ops desk',
    icon: '🧠',
    modules: [
      { name: 'Workflow Automation', href: '/zion-workflow-automation' },
      { name: 'AI Document Processor', href: '/zion-ai-document-processor' },
      { name: 'AI Meeting Assistant', href: '/zion-ai-meeting-assistant' },
    ],
  },
  {
    title: 'Compliance-Ready Delivery Pod',
    description:
      'Combine secure infrastructure with intelligent policy checks for high-trust enterprise rollouts.',
    impact: 'Reduced governance risk',
    href: '/zion-cybersecurity-audit',
    cta: 'Plan secure rollout',
    icon: '🔒',
    modules: [
      { name: 'Security Shield', href: '/zion-security-shield' },
      { name: 'AI Contract Analyzer', href: '/zion-ai-contract-analyzer' },
      { name: 'Cloud Vault', href: '/zion-cloud-vault' },
    ],
  },
  {
    title: 'Talent & Operations Hub',
    description:
      'Unify recruitment, onboarding, and workforce analytics into one talent intelligence platform.',
    impact: 'Faster hiring, better retention',
    href: '/zion-ai-recruitment-pro',
    cta: 'Launch talent hub',
    icon: '👥',
    modules: [
      { name: 'AI Recruitment Pro', href: '/zion-ai-recruitment-pro' },
      { name: 'AI Onboarding Pro', href: '/zion-ai-onboarding-pro' },
      { name: 'AI Talent Analytics', href: '/zion-ai-talent-analytics' },
    ],
  },
  {
    title: 'Content & Marketing Engine',
    description:
      'Combine SEO, content creation, and campaign automation into one growth-focused marketing stack.',
    impact: 'Higher visibility, faster campaigns',
    href: '/zion-ai-seo-optimizer',
    cta: 'Launch marketing engine',
    icon: '📣',
    modules: [
      { name: 'AI SEO Optimizer', href: '/zion-ai-seo-optimizer' },
      { name: 'Content Studio', href: '/zion-content-studio' },
      { name: 'AI Marketing Automation', href: '/zion-ai-marketing-automation' },
    ],
  },
  {
    title: 'Engineering Velocity Hub',
    description:
      'Accelerate development cycles with AI-assisted coding, automated reviews, and deployment pipelines.',
    impact: 'Faster ship cycles',
    href: '/zion-ai-code-assistant',
    cta: 'Launch engineering hub',
    icon: '⚡',
    modules: [
      { name: 'AI Code Assistant', href: '/zion-ai-code-assistant' },
      { name: 'AI Code Reviewer', href: '/zion-ai-code-reviewer' },
      { name: 'DevOps Automation', href: '/zion-devops-automation' },
    ],
  },
  {
    title: 'Supply Chain Intelligence',
    description:
      'Unify demand forecasting, inventory optimization, and predictive maintenance for end-to-end operations.',
    impact: 'Lower costs, fewer disruptions',
    href: '/zion-ai-supply-chain-optimizer',
    cta: 'Build supply chain AI',
    icon: '📦',
    modules: [
      { name: 'AI Supply Chain Optimizer', href: '/zion-ai-supply-chain-optimizer' },
      { name: 'AI Predictive Maintenance', href: '/zion-ai-predictive-maintenance' },
      { name: 'Smart Inventory Manager', href: '/zion-smart-inventory-manager' },
    ],
  },
  {
    title: 'Data & Analytics Engine',
    description:
      'Unify data pipelines, visualization, and predictive analytics into one decision intelligence platform.',
    impact: 'Smarter data-driven decisions',
    href: '/zion-ai-data-visualizer',
    cta: 'Launch analytics engine',
    icon: '📊',
    modules: [
      { name: 'AI Data Visualizer', href: '/zion-ai-data-visualizer' },
      { name: 'AI Data Pipeline', href: '/zion-ai-data-pipeline' },
      { name: 'AI Predictive Analytics', href: '/zion-ai-predictive-analytics' },
    ],
  },
  {
    title: 'Finance & Risk Intelligence',
    description:
      'Unify financial forecasting, fraud detection, and risk assessment into one enterprise-grade finance platform.',
    impact: 'Smarter risk decisions',
    href: '/zion-ai-financial-forecaster',
    cta: 'Launch finance bundle',
    icon: '💹',
    modules: [
      { name: 'AI Financial Forecaster', href: '/zion-ai-financial-forecaster' },
      { name: 'AI Fraud Detector', href: '/zion-ai-fraud-detector' },
      { name: 'AI Risk Assessor', href: '/zion-ai-risk-assessor' },
    ],
  },
  {
    title: 'Advanced AI & Enterprise Intelligence Hub',
    description:
      'Combine generative AI, autonomous agents, model orchestration, and enterprise copilots for next-generation AI operations.',
    impact: 'Cutting-edge AI capabilities',
    href: '/ai-services/generative-ai-enterprise',
    cta: 'Explore Advanced AI',
    icon: '🧠',
    modules: [
      { name: 'Generative AI Enterprise', href: '/ai-services/generative-ai-enterprise' },
      { name: 'AI Agents & Autonomous Workflows', href: '/ai-services/ai-agents-autonomous' },
      { name: 'AI Model Orchestration', href: '/ai-services/ai-model-orchestration' },
      { name: 'AI Copilot & Enterprise Assistants', href: '/ai-services/ai-copilot-enterprise' },
    ],
  },
];

export default function InnovationBundlesPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-[18rem] w-[18rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Innovation Bundles' },
          ]}
          className="mb-6"
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Innovation Bundles
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pre-designed bundles for faster rollout
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Each bundle combines complementary AI apps into a unified platform. Start with one
            high-impact bundle and expand as your team scales.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call →
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Why Innovation Bundles
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Pre-tested combinations for faster rollout
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Each bundle combines complementary AI apps that work together out of the box. Pre-integrated workflows reduce implementation time and lower integration costs.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Faster time to value</h3>
              <p className="mt-2 text-sm text-slate-300">
                Skip the integration phase. Bundles are designed to work together from day one.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Lower total cost</h3>
              <p className="mt-2 text-sm text-slate-300">
                Pre-tested combinations reduce custom integration work and accelerate ROI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Proven workflows</h3>
              <p className="mt-2 text-sm text-slate-300">
                Each bundle reflects patterns we have deployed successfully across industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            From bundle selection to production
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-lg font-bold text-purple-300">1</span>
              <h3 className="mt-4 font-semibold text-white">Choose a bundle</h3>
              <p className="mt-2 text-sm text-slate-300">
                Pick the bundle that matches your highest-priority workflow or business function.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-lg font-bold text-purple-300">2</span>
              <h3 className="mt-4 font-semibold text-white">Pilot (2–4 weeks)</h3>
              <p className="mt-2 text-sm text-slate-300">
                Deploy a scoped pilot with clear KPIs. Validate impact before scaling.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-lg font-bold text-purple-300">3</span>
              <h3 className="mt-4 font-semibold text-white">Integrate & train</h3>
              <p className="mt-2 text-sm text-slate-300">
                Connect to your systems, train your team, and establish runbooks.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-lg font-bold text-purple-300">4</span>
              <h3 className="mt-4 font-semibold text-white">Scale</h3>
              <p className="mt-2 text-sm text-slate-300">
                Expand to more modules or add custom workflows as your team grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {bundles.map((bundle) => (
            <div
              key={bundle.title}
              className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-400/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-3xl">
                    {bundle.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{bundle.title}</h2>
                    <span className="text-xs font-medium text-purple-300">{bundle.impact}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{bundle.description}</p>
              <div className="mt-4 space-y-2">
                {bundle.modules.map((mod) => (
                  <a
                    key={mod.name}
                    href={mod.href}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm text-slate-200 transition hover:border-purple-400/40 hover:text-white"
                  >
                    <span className="block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                    {mod.name}
                  </a>
                ))}
              </div>
              <a
                href={bundle.href}
                className="mt-5 inline-flex items-center text-sm font-semibold text-purple-300 transition hover:text-purple-200"
              >
                {bundle.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Common questions about Innovation Bundles
          </h2>
          <dl className="mt-8 space-y-6">
            <div className="border-b border-slate-700/50 pb-6">
              <dt className="text-base font-semibold text-slate-100">Can I combine multiple bundles?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                Yes. Many teams start with one bundle (e.g., Customer Success Engine) and add others (e.g., Revenue Command Center) as they expand. We design for modular adoption.
              </dd>
            </div>
            <div className="border-b border-slate-700/50 pb-6">
              <dt className="text-base font-semibold text-slate-100">How does pricing work for bundles?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                Bundle pricing is typically lower than the sum of individual apps. Contact us for a tailored quote based on your scope and deployment timeline.
              </dd>
            </div>
            <div className="border-b border-slate-700/50 pb-6">
              <dt className="text-base font-semibold text-slate-100">Can I swap apps within a bundle?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                Yes. We can customize bundles to fit your workflows. For example, you might substitute one app for another in the same category.
              </dd>
            </div>
            <div className="border-b border-slate-700/50 pb-6">
              <dt className="text-base font-semibold text-slate-100">How long does implementation take?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                Most bundle pilots launch in 2–4 weeks. Full rollout with integrations and training typically takes 6–12 weeks depending on scope.
              </dd>
            </div>
            <div className="border-b border-slate-700/50 pb-6">
              <dt className="text-base font-semibold text-slate-100">Do bundles include support and training?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                Yes. Implementation includes runbooks, team training, and handoff guidance. Enterprise plans add dedicated success managers.
              </dd>
            </div>
            <div>
              <dt className="text-base font-semibold text-slate-100">What if I need a custom bundle?</dt>
              <dd className="mt-2 text-sm text-slate-300">
                We design tailored combinations for specific workflows. Book a discovery call to discuss your requirements and get a custom proposal.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/35 via-fuchsia-900/25 to-pink-900/35 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Need a custom bundle?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-200">
            Our team can design a tailored combination of apps, integrations, and delivery milestones
            matched to your specific workflows and goals.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Talk to a Specialist
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              Browse All Apps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
