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
              href="/services"
              className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700"
            >
              Browse Services
            </Link>
            <Link
              href="/solutions"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enterprise Solutions
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              🤖 Agent Dashboard
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              View Pricing
            </Link>
            <Link
              href="/agents-monitoring"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Live Agent Monitoring →
            </Link>
          </div>

          {/* Live Activity Feed */}
          <LiveActivityFeed />

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              href="/services"
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
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                AI Agents
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Agent Operations</h2>
              <p className="mt-2 text-sm text-slate-600">
                Real-time monitoring of our AI agent fleet — waves, services, tasks, and activity log.
              </p>
            </Link>
            <Link
              href="/solutions"
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

          {/* Agent Monitoring Dashboard CTA */}
          <section className="mt-6 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-r from-purple-900/80 via-slate-900 to-pink-900/80 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-400">Live Now</p>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">🤖 AI Agent Operations Dashboard</h2>
                <p className="text-sm text-slate-300 max-w-xl">
                  Watch our AI agent fleet work in real time — {allServices.length}+ services cataloged across 44 development waves, with multiple agents active 24/7. See what they&apos;ve built and what they&apos;re working on right now.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
                >
                  🖥️ Agent Dashboard
                </Link>
                <Link
                  href="/agents-monitoring"
                  className="rounded-full border border-purple-400/50 bg-purple-500/10 px-6 py-2.5 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 transition-all"
                >
                  👤 Client View
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
              Platform capabilities spotlight
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Enterprise AI, IT & Cloud Solutions — All in One Place
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Explore our comprehensive catalog of {allServices.length}+ production-ready services spanning AI, cloud, security, data analytics, and intelligent automation — each with verified features, pricing, and direct contact access.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Browse All Services
              </Link>
              <Link
                href="/solutions"
                className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
              >
                Enterprise Solutions
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                🤖 Agent Dashboard
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                View Pricing
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Platform status
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Zion Tech Group platform is live and operational. {allServices.length}+ services cataloged across 44 development waves by our AI agent fleet.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  All services verified with real features, market pricing, and contact information.
                </p>
              </div>
              <Link
                href="/agents-monitoring"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                View Live Status
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Latest platform updates
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Wave 218 deployed: Regenerative Agriculture AI, Autonomous Construction, Emotion AI, Satellite Internet, AI Legal Assistants, Nuclear Fusion Energy, and Holographic Displays.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              <li>— Wave 218: 7 new services across 7 emerging technology categories</li>
              <li>— Wave 217: Carbon Capture, Brain-Computer Interfaces, Precision Fermentation</li>
              <li>— Monitoring dashboard: Real-time agent fleet tracking with client view</li>
              <li>— New pages: Services catalog, Solutions overview, Pricing tiers</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
              >
                Explore New Services
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Agent Activity
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
                  href="/services"
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

          <section className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  🚀 Explore Our Platform
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Discover What Zion Tech Group Offers
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Browse {allServices.length}+ verified services, watch our AI agents work in real time, and explore enterprise solutions tailored to your industry.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Link href="/services" className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center text-white mb-3 text-lg">📋</div>
                <h3 className="text-lg font-semibold text-slate-900">Service Catalog</h3>
                <p className="mt-2 text-sm text-slate-600">Browse all {allServices.length}+ services with features, pricing, and contact info</p>
              </Link>
              <Link href="/dashboard" className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-3 text-lg">🤖</div>
                <h3 className="text-lg font-semibold text-slate-900">Agent Dashboard</h3>
                <p className="mt-2 text-sm text-slate-600">Real-time monitoring of our AI agent fleet — waves, tasks, activity</p>
              </Link>
              <Link href="/solutions" className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-3 text-lg">🏢</div>
                <h3 className="text-lg font-semibold text-slate-900">Enterprise Solutions</h3>
                <p className="mt-2 text-sm text-slate-600">End-to-end solutions for AI, cloud, security, and automation</p>
              </Link>
            </div>
          </section>
        </main>
          {/* ALL SERVICES CATALOG */}
          <section id="all-services" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Complete Service Catalog</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              All AI &middot; IT &middot; Cloud &middot; Security &middot; Data &amp; Automation Services
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              <strong>{allServices.length}</strong> production-ready services from Zion Tech Group — enterprise-grade AI, IT infrastructure, cloud native, zero-trust security, data analytics, and intelligent automation. Every listing shows features, benefits, average market prices, and direct links to the full service page.
            </p>

            {/* AI Services */}
            {(() => {
              const ai = allServices.filter(s => s.category === 'ai').sort((a,b) => a.title.localeCompare(b.title));
              return ai.length > 0 ? (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">🤖 AI &amp; Machine Learning — {ai.length} services</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ai.map(s => (
                      <Link key={s.id} href={s.href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0" role="img" aria-label={s.title}>{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{s.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-500">From {s.pricing.basic}/mo</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;
            })()}

            {/* IT + Security */}
            {(() => {
              const itSec = allServices.filter(s => s.category === 'it' || s.category === 'security').sort((a,b) => a.title.localeCompare(b.title));
              return itSec.length > 0 ? (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">🖥️ IT &amp; Security — {itSec.length} services</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {itSec.map(s => (
                      <Link key={s.id} href={s.href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0" role="img" aria-label={s.title}>{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{s.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-500">From {s.pricing.basic}/mo</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;
            })()}

            {/* Cloud */}
            {(() => {
              const cloud = allServices.filter(s => s.category === 'cloud').sort((a,b) => a.title.localeCompare(b.title));
              return cloud.length > 0 ? (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">☁️ Cloud — {cloud.length} services</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cloud.map(s => (
                      <Link key={s.id} href={s.href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0" role="img" aria-label={s.title}>{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{s.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-500">From {s.pricing.basic}/mo</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;
            })()}

            {/* Data */}
            {(() => {
              const data = allServices.filter(s => s.category === 'data').sort((a,b) => a.title.localeCompare(b.title));
              return data.length > 0 ? (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">📊 Data &amp; Analytics — {data.length} services</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.map(s => (
                      <Link key={s.id} href={s.href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0" role="img" aria-label={s.title}>{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{s.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-500">From {s.pricing.basic}/mo</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;
            })()}

            {/* Automation */}
            {(() => {
              const auto = allServices.filter(s => s.category === 'automation').sort((a,b) => a.title.localeCompare(b.title));
              return auto.length > 0 ? (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">⚡ Automation — {auto.length} services</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {auto.map(s => (
                      <Link key={s.id} href={s.href} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0" role="img" aria-label={s.title}>{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{s.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-500">From {s.pricing.basic}/mo</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null;
            })()}
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