import Banner from './components/Banner';
import Layout from './components/Layout';
import Link from 'next/link';
import { whatsNewItems } from './features/featuredItems';
import ProductRecommenderSection from './components/ai/ProductRecommenderSection';
import { AIComponents } from './components/ai-components';
import { getHomepageAICatalogItems, getHomepageHeroCtas, getHomepageLiveNowItems } from './config/aiCatalog';
import { allServices } from '@/app/data/servicesData';
import LiveActivityFeed from './components/marketing/LiveActivityFeed';
import ClientTestimonials from './components/marketing/ClientTestimonials';

export default function Home() {
  const confidence = getPromotionConfidence();
  const aiCatalogHighlights = applyConfidenceGate(getHomepageAICatalogItems(), confidence);
  const liveNowItems = applyConfidenceGate(getHomepageLiveNowItems(), confidence);
  const heroCtas = applyConfidenceGate(getHomepageHeroCtas(), confidence);

  return (
    <Layout>
      {/* Banner */}
      <Banner items={whatsNewItems} />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Zion AI Platform
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            AI products, autonomous workflows, and continuous app evolution
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Build with production-ready AI services, in-browser intelligent experiences, and
            autonomous automation pipelines that keep improving your app quality, conversion paths,
            and delivery speed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="#ai-product-recommender"
              className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700"
            >
              Try AI Product Recommender
            </Link>
            <Link
              href="/ai-lab"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore AI Lab
            </Link>
            {heroCtas.map((cta) => (
              <Link key={cta.href} href={cta.href} className={cta.className}>
                {cta.label}
              </Link>
            ))}
            <Link
              href="/automation"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              View Automation Engine
            </Link>
            <Link
              href="/ai-services/autonomous-growth-intelligence"
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              Explore Autonomous Growth Intelligence
            </Link>
            <Link
              href="#ai-catalog"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View all AI products & experiences
            </Link>
          </div>

          {/* Live Activity Feed */}
          <LiveActivityFeed />

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              href="/ai-services"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                AI Services
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Enterprise AI Delivery</h2>
              <p className="mt-2 text-sm text-slate-600">
                Generative AI, autonomous agents, RAG, and multimodal intelligence with governance.
              </p>
            </Link>
            <Link
              href="/ai-lab"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                AI Lab
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">In-Browser Intelligence</h2>
              <p className="mt-2 text-sm text-slate-600">
                Interactive tools for readiness scoring, governance risk, rollout planning, and growth
                strategy.
              </p>
            </Link>
            <Link
              href="/automation"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Automation
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Autonomous Improvement</h2>
              <p className="mt-2 text-sm text-slate-600">
                Agent pipelines for audits, performance checks, quality gates, and deployment-safe
                content evolution.
              </p>
            </Link>
          </section>

          <section className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
              Intelligent experiences spotlight
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              New RAG workspace + live autonomous tools now available
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Launch deterministic citation-quality simulations in the new Autonomous RAG Knowledge
              Workspace, then jump to conversion, retention, incident, and deployment intelligence tools
              already live across AI Lab.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ai-lab/autonomous-rag-knowledge-workspace"
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Open Autonomous RAG Knowledge Workspace
              </Link>
              <Link
                href="/ai-lab/autonomous-media-prompt-studio"
                className="rounded-lg border border-fuchsia-300 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-800 hover:bg-fuchsia-100"
              >
                Launch Media Prompt Studio
              </Link>
              <Link
                href="/ai-lab/autonomous-conversion-copilot"
                className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
              >
                Explore Conversion Copilot
              </Link>
              <Link
                href="/ai-lab/autonomous-revenue-forecast-studio"
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Open Revenue Forecast Studio
              </Link>
              <Link
                href="/ai-lab/autonomous-incident-commander"
                className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100"
              >
                Open Incident Commander
              </Link>
              <Link
                href="/ai-lab/autonomous-agent-skill-orchestrator"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                Open Agent Skill Orchestrator
              </Link>
              <Link
                href="/ai-lab/autonomous-experiment-priority-engine"
                className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-100"
              >
                Open Experiment Priority Engine
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Deploy status intelligence
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {readiness
                    ? `Latest autonomous readiness: ${readiness.ready ? 'ready to deploy' : 'blocked - needs attention'}.`
                    : 'No local readiness report found yet. Run deploy readiness automation to populate this status.'}
                </p>
                {deployStatus ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Last deploy status: {deployStatus.status ?? 'unknown'} ({(deployStatus.sha ?? 'unknown').slice(0, 8)})
                  </p>
                ) : null}
              </div>
              <Link
                href="/ai-lab/deploy-drift-dashboard"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                Open deployment readiness console
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Weekly AI launch digest
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {digest
                ? `${digest.totalLaunchCommits ?? 0} AI launch commits tracked in the latest digest cycle.`
                : 'No launch digest found yet. Run the weekly digest workflow to populate this panel.'}
            </p>
            {digest?.weeklyHighlights?.length ? (
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {digest.weeklyHighlights.slice(0, 5).map((item) => (
                  <li key={item}>{'- ' + item}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/ai-lab/deploy-drift-dashboard"
                className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
              >
                Open deploy drift dashboard
              </Link>
              <Link
                href="/ai-lab"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Explore all AI Lab launches
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-white to-violet-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
                  🚀 New intelligent experience
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  AI Solutions Architect is live on every page
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-slate-600">
                  Use the floating <strong>Design my AI rollout</strong> widget (bottom-right) to generate a tailored,
                  multi-phase plan and jump directly to the most relevant Zion AI products and services.
                </p>
              </div>
              <Link
                href="/contact#engagement"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                data-cta-event="cta_contact"
                data-cta-label="page"
              >
                Talk with a solutions architect
              </Link>
            </div>
          </section>

          {/* Client Testimonials */}
          <ClientTestimonials />

          <ProductRecommenderSection sectionId="ai-product-recommender" />

          <section id="ai-catalog" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              AI products, services, and live experiences
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything Zion is building and shipping now
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              Explore the complete AI catalog across live in-browser tools, autonomous improvement systems,
              enterprise AI services, and continuously evolving product modules.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {AIComponents.map((item) => (
                <Link
                  key={item.id}
                  href={`/ai-services/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                    {item.name.toUpperCase()}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  🛠️ Developer AI Tools
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Essential Developer Tools
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Analyze code complexity, test API response times, and more — all free.
                </p>
              </div>
              <Link
                href="/ai-tools"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                All Tools
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Link
                href="/tools/json-to-typescript-converter"
                className="rounded-xl border border-amber-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v1a3 3 0 003 3h14a3 3 0 003-3V6a3 3 0 00-3-3H5a3 3 0 00-3 3v1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">JSON to TypeScript</h3>
                <p className="mt-2 text-sm text-slate-600">Convert JSON to TypeScript interfaces</p>
              </Link>
              <Link
                href="/tools/code-complexity-analyzer"
                className="rounded-xl border border-amber-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Code Complexity Analyzer</h3>
                <p className="mt-2 text-sm text-slate-600">AI-powered code analysis and suggestions</p>
              </Link>
              <Link
                href="/tools/api-response-tester"
                className="rounded-xl border border-amber-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">API Response Tester</h3>
                <p className="mt-2 text-sm text-slate-600">Test API latency and performance</p>
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 via-white to-emerald-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                  🛠️ Free AI Tools
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Use AI Tools Right Now — Free
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Calculate ROI, analyze documents, build chatbots — no signup required. 
                  Try our free in-browser AI tools.
                </p>
              </div>
              <Link
                href="/ai-tools"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Try All Tools
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Link
                href="/ai-tools"
                className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">ROI Calculator</h3>
                <p className="mt-2 text-sm text-slate-600">Calculate your AI investment returns</p>
              </Link>
              <Link
                href="/tools/file-analyzer"
                className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">File Analyzer</h3>
                <p className="mt-2 text-sm text-slate-600">AI file analysis</p>
              </Link>
              <Link
                href="/tools/sql-query-generator"
                className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">API Designer</h3>
                <p className="mt-2 text-sm text-slate-600">Visual API builder</p>
              </Link>
              <Link
                href="/tools/website-analyzer"
                className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10 5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Website Analyzer</h3>
                <p className="mt-2 text-sm text-slate-600">SEO & performance audit</p>
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-grey-200 bg-grey-50 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-grey-600">
                  🧩 Additional Utilities
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Extra Productivity Tools
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Explore more utilities to boost your workflow and productivity.
                </p>
              </div>
              <Link
                href="/tools"
                className="rounded-lg border border-grey-300 bg-grey-50 px-4 py-2 text-sm font-semibold text-grey-700 hover:bg-grey-100"
              >
                Browse All Utilities
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Link
                href="/tools/pdf-generator"
                className="rounded-xl border border-grey-300 bg-white p-4 transition hover:border-grey-400 hover:shadow-lg hover:shadow-grey-400/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-grey-400 to-amber-400 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V5a2 2 0 012-2h12a2 2 0 012 2v11a4 4 0 01-4 4zm0 0h12a2 2 0 002-2V5a2 2 0 012-2h4a2 2 0 012 2v11a4 4 0 01-4 4zm-6 0h12a2 2 0 002-2V5a2 2 0 012-2h-4a2 2 0 01-2 2v11a4 4 0 01-4 4zM7 16a3 3 0 01-6 0v2M4 7h16a2 2 0 002-2V5a2 2 0 012-2H4a2 2 0 01-2 2v11a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">PDF Generator</h3>
                <p className="mt-2 text-sm text-slate-600">Create PDFs from HTML content</p>
              </Link>
              <Link
                href="/tools/cron-generator"
                className="rounded-xl border border-grey-300 bg-white p-4 transition hover:border-grey-400 hover:shadow-lg hover:shadow-grey-400/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-grey-400 to-amber-400 rounded-xl flex items-center justify-center text-white mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Cron Generator</h3>
                <p className="mt-2 text-sm text-slate-600">Generate cron expressions</p>
              </Link>
            </div>
          </section>
        </main>
          {/* Services grouped */}
          <section id="all-services" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Complete Service Catalog</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              All AI &middot; IT &middot; Cloud &middot; Security &middot; Data &amp; Automation Services
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              <strong>{allServices.length}</strong> production-ready services from Zion Tech Group.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/services" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Browse all services</Link>
              <Link href="/ai-lab" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">AI Lab</Link>
              <Link href="/automation" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Automation</Link>
            </div>
          </section>
          {/* END SERVICE CATALOG */}

          {/* SERVICE COMPARISON TABLE */}
          <ServiceComparisonTable />


        {/* AI Component Showcase */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            🤖 AI Components
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            All AI-Powered Components Now Live
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600">
            Explore the full suite of AI tools powering Zion Tech Group's platform.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {AIComponents.map((component) => (
              <div key={component.id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-lg hover:shadow-violet-600/10">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{component.name}</h3>
                    <p className="mt-1 text-sm text-slate-700">{component.description}</p>
                  </div>
                  <div className="ml-4 text-sm text-slate-500 flex items-center space-x-1">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${component.status === 'active' ? 'bg-green-100 text-green-800' : component.status === 'under-development' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {component.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">{component.aiInsight}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CONTACT CTA BANNER */}
      <Link href="/contact" className="mt-6 block">
        <section className="rounded-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-center shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Ready to transform your business?</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Let Zion Tech Group build your future
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-blue-100">
            <strong>Phone:</strong> +1 302 464 0950 &nbsp;&middot;&nbsp;
            <strong>Email:</strong> kleber@ziontechgroup.com &nbsp;&middot;&nbsp;
            <strong>Address:</strong> 364 E Main St STE 1008, Middletown, DE 19709
          </p>
          <p className="mt-1 text-xs text-blue-200">Enterprise AI &middot; IT Infrastructure &middot; Cloud &middot; Security &middot; Automation — {allServices.length}+ services, one partner</p>
          <p className="mt-4 text-lg font-semibold text-white underline decoration-blue-300 decoration-2 underline-offset-4">
            Get Your Free Consultation &rarr;
          </p>
        </section>
      </Link>

    </Layout>
  );
}