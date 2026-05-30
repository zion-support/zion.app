// app/services/[id]/page.tsx — Dynamic Service Detail Page
import { notFound } from 'next/navigation';
import { allServices } from '@/data/servicesData';
import Link from 'next/link';
import ROICalculator from '@/components/ROICalculator';
import SmartServiceCard from '@/components/SmartServiceCard';

const CAT_LABELS: Record<string,string> = {
  ai: 'AI Services', it: 'IT', cloud: 'Cloud', security: 'Security',
  data: 'Data & AI', automation: 'Automation', consulting: 'Consulting',
};

interface PageProps { params: Promise<{ id: string }>; }

// Note: All pages are statically generated at build time (output: export)
// Top 50 services are included to keep build time reasonable

export async function generateStaticParams() {
  // Generate top 200 most important/popular services
  const sorted = [...allServices].sort((a, b) => {
    const scoreA = (a.features?.length || 0) * 3 + (a.benefits?.length || 0) * 2 + (a.popular ? 50 : 0);
    const scoreB = (b.features?.length || 0) * 3 + (b.benefits?.length || 0) * 2 + (b.popular ? 50 : 0);
    return scoreB - scoreA;
  });
  const top = sorted.slice(0, 200);
  const params: { id: string }[] = [];
  const seen = new Set<string>();
  for (const service of top) {
    if (seen.has(service.id)) continue;
    seen.add(service.id);
    params.push({ id: service.id });
    if (service.id.includes('_')) {
      const alt = service.id.replace(/_/g, '-');
      if (!seen.has(alt)) { seen.add(alt); params.push({ id: alt }); }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const service = allServices.find((s) => s.id === id);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.title,
    description: service.description || `Explore ${service.title} at Zion Tech Group — enterprise-grade solutions.`,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params;
  // Accept both kebab-case and underscore-case IDs
  const service = allServices.find(
    (s) => s.id === id || s.id.replace(/-/g, '_') === id || s.id.replace(/_/g, '-') === id
  );
  if (!service) notFound();

  const catLabel = CAT_LABELS[service.category] || service.category;

  // Schema.org structured data for rich search snippets on service pages
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description || "",
    provider: {
      "@type": "Organization",
      name: "Zion Tech Group",
      url: "https://ziontechgroup.com",
    },
    url: `https://ziontechgroup.com/services/${service.id}/`,
    category: catLabel,
    serviceOutput:
      (service.features || []).slice(0, 5).join("; "),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: catLabel,
      itemListElement:
        service.pricing && Object.keys(service.pricing).length > 0
          ? Object.entries(service.pricing).map(([tier, price]) => ({
              "@type": "Offer",
              price: String(price).replace(/[^0-9.-]/g, ""),
              priceCurrency: "USD",
              name: tier,
            }))
          : undefined,
    },
  };

  // BreadcrumbList schema — mirrors visible breadcrumb nav for sitelink display in SERPs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Breadcrumbs",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ziontechgroup.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://ziontechgroup.com/services/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: catLabel,
        item: `https://ziontechgroup.com/services/?category=${encodeURIComponent(service.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: service.title,
        item: `https://ziontechgroup.com/services/${service.id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container-page">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/services/" className="hover:text-purple-400 transition">Services</Link>
          <span className="mx-2">/</span>
          <Link href={`/services/?category=${encodeURIComponent(service.category)}`} className="hover:text-purple-400 transition">{catLabel}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">{service.title}</span>
        </nav>

        {/* Hero */}
        <div className="glass-card mb-12">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 uppercase tracking-wider">
            {catLabel}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 mt-3">{service.title}</h1>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{service.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Features */}
          <div className="lg:col-span-2 glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="text-purple-400 mt-1 shrink-0">✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-xl font-semibold text-white mb-4">Pricing</h2>
              <div className="space-y-3">
                {Object.entries(service.pricing).map(([tier, price]) => (
                  <div key={tier} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-300 capitalize">{tier}</span>
                    <span className="text-purple-300 font-semibold">{price as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-3">Get Started</h3>
              <p className="text-slate-400 text-sm mb-4">
                Ready to get started? Contact us for a custom quote.
              </p>
              <div className="space-y-3">
                <a href="tel:+13024640950" className="btn-primary w-full text-center block">
                  ☎ +1 302 464 0950
                </a>
                <a href="mailto:kleber@ziontechgroup.com" className="btn-secondary w-full text-center block">
                  ✉️ Email Us
                </a>
                <Link href="/configurator/" className="btn-secondary w-full text-center block">
                  Get Custom Proposal →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="glass-card mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <span className="text-green-400 text-lg shrink-0">✓</span>
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator */}
        <ROICalculator serviceTitle={service.title} category={service.category} />



        {/* Deployment Roadmap — AI-inferred phase + milestone plan per category */}
        {(() => {
          // Infer phase steps from service description + category
          const s = service;
          const isComplex = s.features.length >= 4;
          const hasEnterprise = s.pricing.enterprise !== '$0';
          const phases = (() => {
            if (s.category === 'ai') return [
              { label:'1. Scope & Data Audit',          weeks:'Week 1–2', tasks:['Define use-cases + success KPIs','Inventory existing data sources + formats','Data quality + labelling review','Tech-stack + model-selection workshop'], color:'#8b5cf6' },
              { label:'2. Model & Pipeline Build',       weeks:'Week 3–5', tasks:['Fine-tune / prompt-engineer model','Build inference pipeline + API','Unit tests + eval on hold-out set','Internal demo + feedback loop'], color:'#a78bfa' },
              { label:'3. Pilot & Evaluation',           weeks:'Week 6–7', tasks:['Pilot with 10–20 real use-cases','Collect user feedback + KPI report','Fix edge-cases + regressions','Finalize production config'], color:'#c4b5fd' },
              { label:'4. Production Roll-out',          weeks:'Week 8',    tasks:['CI/CD pipeline + rollback plan','User training + documentation','Go-live monitoring + alert setup','30-day health-check call'], color:'#7c3aed' },
              { label:'5. Optimize & Scale',            weeks:'Ongoing',   tasks:['Monthly quality review','Model fine-tune on new data','Usage analytics + cost optimisation','Feature backlog prioritisation'], color:'#6d28d9' },
            ];
            if (s.category === 'automation') return [
              { label:'1. Process Discovery',           weeks:'Week 1–2', tasks:['Map current-state process (as-is)','Identify highest-ROI automation targets','Define success metrics (e.g. 80% less time)','Tool + platform selection'], color:'#ec4899' },
              { label:'2. Workflow Build',              weeks:'Week 3–5', tasks:['Build first 2–3 workflow automations','Integrate source + target systems','Unit-test + staging environment test','Security + access-control review'], color:'#f472b6' },
              { label:'3. Pilot & Iterate',             weeks:'Week 6',    tasks:['Pilot with business stakeholders','Collect process feedback + metrics','Iterate on remaining workflows','Handover SOP + knowledge transfer'], color:'#fb7185' },
              { label:'4. Roll-out & Monitor',          weeks:'Week 7–8', tasks:['Schedule roll-out across full team','Monitoring dashboard + alerts','Documentation + training videos','Kick-off continuous improvement'], color:'#f43f5e' },
              { label:'5. Optimize & Scale',            weeks:'Ongoing',   tasks:['Usage analytics review','New workflow requests triage','Integration cost optimisation','Quarterly roadmap sync'], color:'#e11d48' },
            ];
            if (s.category === 'it') return [
              { label:'1. Discovery & Planning',        weeks:'Week 1–2', tasks:['Infrastructure audit + gap analysis','Architecture design + review','Tool + platform evaluation','Project plan + sprint breakdown'], color:'#0ea5e9' },
              { label:'2. Environment Setup',           weeks:'Week 3–4', tasks:['Provision development + staging env','Baseline security hardening','CI/CD pipeline scaffold','Monitoring + logging baseline'], color:'#38bdf8' },
              { label:'3. Implementation',              weeks:'Week 5–8', tasks:['Incremental feature delivery (sprints)','UAT + stakeholder sign-off','Documentation + runbooks','Load + security testing'], color:'#60a5fa' },
              { label:'4. Production Launch',           weeks:'Week 9',    tasks:['Cut-over runbook + rollback plan','Production monitoring + on-call setup','Team training + handover','Go-live announcement'], color:'#2563eb' },
              { label:'5. SLA Support & Iteration',     weeks:'Ongoing',   tasks:['Monthly SLA performance review','Patch + update schedule','Capacity planning','Quarterly roadmap meeting'], color:'#1d4ed8' },
            ];
            if (s.category === 'security') return [
              { label:'1. Asset & Risk Assessment',     weeks:'Week 1–2', tasks:['Asset inventory + data-flow mapping','Vulnerability scanning + risk scoring','Compliance gap analysis (SOC2, NIST, etc.)','Prioritised remediation backlog'], color:'#ef4444' },
              { label:'2. Controls Implementation',     weeks:'Week 3–6', tasks:['Deploy critical mitigation controls','IAM policy tightening','EDR + SIEM deployment + tuning','Secure configuration baseline across estate'], color:'#f87171' },
              { label:'3. Validation & Testing',        weeks:'Week 7',    tasks:['Penetration test + red-team drill','SIEM rule tuning + alert validation','Tabletop incident response exercise','Emergency runbook finalisation'], color:'#dc2626' },
              { label:'4. Evidential & Audit Prep',     weeks:'Week 8+',   tasks:['Evidence collection per framework','Audit-ready report generation','Programme maturity scoring','Continuous monitoring setup'], color:'#b91c1c' },
              { label:'5. Ongoing Threat & Evolution',  weeks:'Ongoing',   tasks:['Monthly threat-intel review','Policy review + update cycle','Annual penetration test schedule','Emerging-tech risk assessment'], color:'#991b1b' },
            ];
            // cloud, data, and catch-all
            return [
              { label:'1. Requirements & Design',      weeks:'Week 1–2', tasks:['Stakeholder requirements workshop','Solution architecture + diagram review','Estimate effort + resource plan','Success metrics + SLAs agreed'], color:'#10b981' },
              { label:'2. Foundation Build',           weeks:'Week 3–5', tasks:['Core infrastructure + data pipeline','Access control + security hardening','Integration with existing systems','Automated test suite setup'], color:'#34d399' },
              { label:'3. Test & Validate',            weeks:'Week 6–7', tasks:['User acceptance testing','Performance + load testing','Security review + sign-off','Change management communication'], color:'#6ee7b7' },
              { label:'4. Deployment & Stabilisation', weeks:'Week 8',    tasks:['Blue-green or canary deployment','Hypercare period (3–5 days)','Post-launch performance review','Documentation + knowledge transfer'], color:'#059669' },
              { label:'5. Optimise & Evolve',          weeks:'Ongoing',   tasks:['Usage + cost analytics','Feature iteration backlog','Vendor relationship + renewals','Quarterly business review'], color:'#047857' },
            ];
          })();
          return (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🗺️</span>
                <h2 className="text-2xl font-semibold text-white">Deployment Roadmap</h2>
                <span className="text-xs text-slate-500 bg-slate-800 rounded-full px-3 py-1">AI-Inferred • {phases.length} phases</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">Estimated timeline for {s.title} — adapt to your team size and complexity.</p>
              <div className="relative">
                {phases.map((ph, i) => (
                  <div key={i} className="flex gap-4 pb-8 last:pb-0">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center gap-0 shrink-0 w-16">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{borderColor:ph.color, background: i===0 ? ph.color : 'transparent'}}>
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      {i < phases.length - 1 && <div className="flex-1 w-0.5 bg-slate-700 my-1" />}
                    </div>
                    {/* Phase card */}
                    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 flex-1">
                      <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
                        <h3 className="font-semibold text-white">{ph.label}</h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-slate-300">{ph.weeks}</span>
                      </div>
                      <ul className="p-4 space-y-2">
                        {ph.tasks.map((t, j) => (
                          <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:kleber@ziontechgroup.com" className="btn-primary text-sm px-6 py-3">📅 Schedule Planning Call</a>
                <Link href="/configurator/" className="btn-secondary text-sm px-6 py-3">⚙️ Customise This Roadmap →</Link>
              </div>
            </div>
          );
        })()}

        {/* Related Services — expand to 8 + category link */}
        {(() => {
          const sameCat = allServices
            .filter((s) => s.category === service.category && s.id !== service.id)
            .slice(0, 8);
          if (sameCat.length === 0) return null;
          const catLabel = (CAT_LABELS[service.category] || service.category).replace(' Services', '');
          return (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Related Services</h2>
              <p className="text-slate-400 text-sm mb-6">Other {catLabel} services you may be interested in</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sameCat.map((s) => {
                    // Relevance: share of features + benefits overlap
                    const myFeats = new Set(service.features || []);
                    const myBens  = new Set(service.benefits  || []);
                    const sFeats  = new Set(s.features || []);
                    const sBens   = new Set(s.benefits  || []);
                    const sharedF = [...sFeats].filter(f => myFeats.has(f)).length;
                    const sharedB = [...sBens].filter(b  => myBens.has(b)).length;
                    const total   = sFeats.size + sBens.size;
                    const relevance = total > 0 ? Math.round((sharedF + sharedB) / total * 100) : 0;
                    const relType: 'related' | 'recommended' | 'featured' =
                      relevance > 60 ? 'recommended' : 'related';
                    return (
                      <SmartServiceCard
                        key={s.id}
                        service={s}
                        relationship={relType}
                        relevance={relevance}
                      />
                    );
                  })}
              </div>
              <div className="text-center mt-6">
                <Link href={`/services?category=${service.category}`}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                  View all {catLabel} services →
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Bottom CTA */}
        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how {service.title} can transform your business.
            364 E Main St STE 1008, Middletown, DE 19709 · +1 302 464 0950
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:kleber@ziontechgroup.com" className="btn-primary text-lg px-8">Get a Custom Quote</a>
            <Link href="/pricing-calculator/" className="btn-secondary text-lg px-8">Pricing Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
