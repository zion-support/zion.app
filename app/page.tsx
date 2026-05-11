import Banner from './components/Banner';
import DonateSection from './components/DonateSection';
import { whatsNewItems } from './features/featuredItems';
import Link from 'next/link';
import ProductRecommenderSection from './components/ai/ProductRecommenderSection';
import AdSlot from './components/ai/AdSlot';
import DependencyBadge from './components/DependencyBadge';
import fs from 'fs';
import path from 'path';
import { getHomepageAICatalogItems, getHomepageHeroCtas, getHomepageLiveNowItems } from './config/aiCatalog';
import OpenCollectiveWidget from './components/OpenCollectiveWidget';
import TopToolsShowcase from './components/TopToolsShowcase';

type DeploymentReadinessReport = {
  timestamp?: string;
  ready?: boolean;
};

type DeployStatusReport = {
  generatedAt?: string;
  status?: string;
  sha?: string;
  netlifyDeployId?: string | null;
  netlifyDeployUrl?: string | null;
};

type SuppressionRegistryReport = {
  generatedAt?: string;
  noise?: { emaOpenIncidents?: number };
  totalOpenIncidents?: number;
  tuning?: { noiseLevel?: string; reason?: string };
};

type NetlifyPreviewSmokeReport = {
  generatedAt?: string;
  skipped?: boolean;
  unhealthyCount?: number;
  baseUrl?: string;
};

type PromotionConfidenceReport = {
  generatedAt?: string;
  gatedThreshold?: number;
  routeScores?: Array<{ route: string; score: number }>;
};

type LaunchDigestReport = {
  generatedAt?: string;
  totalLaunchCommits?: number;
  weeklyHighlights?: string[];
};
type AutomationHealthReport = {
  generatedAt?: string;
  severity?: 'nominal' | 'warning' | 'critical' | string;
  emaOpenIncidents?: number;
  previewUnhealthyCount?: number;
  openFingerprintIssues?: number;
  deployStatus?: string;
  sloScore?: number;
  sloDeltaFromPrevious?: number | null;
  registryGeneratedAt?: string | null;
  telemetryFreshness?: {
    suppressionRegistryAt?: string | null;
    deployStatusAt?: string | null;
    previewSmokeAt?: string | null;
    issueIndexAt?: string | null;
    observabilityEmaFpHistoryAt?: string | null;
    smokeHealthHistoryAt?: string | null;
    automationHealthHistoryAt?: string | null;
  };
};

type AutomationHealthHistoryFile = {
  points?: Array<{ sloScore?: number }>;
};

function getDeploymentReadiness(): DeploymentReadinessReport | null {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'deployment-readiness-latest.json',
    );
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as DeploymentReadinessReport;
  } catch {
    return null;
  }
}

function getDeployStatus(): DeployStatusReport | null {
  try {
    const reportPath = path.join(process.cwd(), 'automation', 'reports', 'deploy-status-latest.json');
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as DeployStatusReport;
  } catch {
    return null;
  }
}

function getPromotionConfidence(): PromotionConfidenceReport | null {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'promotion-confidence-latest.json',
    );
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as PromotionConfidenceReport;
  } catch {
    return null;
  }
}

function getLaunchDigest(): LaunchDigestReport | null {
  try {
    const reportPath = path.join(process.cwd(), 'automation', 'reports', 'ai-launch-digest-latest.json');
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as LaunchDigestReport;
  } catch {
    return null;
  }
}

function getSuppressionRegistry(): SuppressionRegistryReport | null {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'incident-suppression-registry-latest.json',
    );
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as SuppressionRegistryReport;
  } catch {
    return null;
  }
}

function getNetlifyPreviewSmoke(): NetlifyPreviewSmokeReport | null {
  try {
    const reportPath = path.join(
      process.cwd(),
      'automation',
      'reports',
      'netlify-preview-smoke-latest.json',
    );
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as NetlifyPreviewSmokeReport;
  } catch {
    return null;
  }
}

function getAutomationHealth(): AutomationHealthReport | null {
  try {
    const reportPath = path.join(process.cwd(), 'automation', 'reports', 'automation-health-latest.json');
    if (!fs.existsSync(reportPath)) return null;
    return JSON.parse(fs.readFileSync(reportPath, 'utf8')) as AutomationHealthReport;
  } catch {
    return null;
  }
}

function getAutomationHealthHistory(): number[] {
  try {
    const p = path.join(process.cwd(), 'automation', 'reports', 'automation-health-history.json');
    if (!fs.existsSync(p)) return [];
    const j = JSON.parse(fs.readFileSync(p, 'utf8')) as AutomationHealthHistoryFile;
    const pts = Array.isArray(j.points) ? j.points : [];
    return pts.slice(-18).map((x) => Number(x.sloScore ?? 0));
  } catch {
    return [];
  }
}

function sloTinySpark(scores: number[]): string {
  if (scores.length === 0) return '';
  const last = scores.slice(-18);
  const max = Math.max(...last, 1);
  return last
    .map((v) => {
      const r = v / max;
      if (r < 0.25) return '.';
      if (r < 0.5) return ':';
      if (r < 0.75) return '*';
      return '#';
    })
    .join('');
}

function normalizeRouteFromHref(href: string): string {
  if (!href.startsWith('/')) return href;
  return href.split('#')[0]?.split('?')[0] ?? href;
}

function applyConfidenceGate<T extends { href: string }>(
  items: T[],
  confidence: PromotionConfidenceReport | null,
): T[] {
  const threshold = confidence?.gatedThreshold ?? 60;
  const scoreByRoute = new Map((confidence?.routeScores ?? []).map((item) => [item.route, item.score]));
  return items.filter((item) => {
    const route = normalizeRouteFromHref(item.href);
    const score = scoreByRoute.get(route);
    if (typeof score !== 'number') return true;
    return score >= threshold;
  });
}

export default function Home() {
  const confidence = getPromotionConfidence();
  const aiCatalogHighlights = applyConfidenceGate(getHomepageAICatalogItems(), confidence);
  const liveNowItems = applyConfidenceGate(getHomepageLiveNowItems(), confidence);
  const heroCtas = applyConfidenceGate(getHomepageHeroCtas(), confidence);
  const readiness = getDeploymentReadiness();
  const deployStatus = getDeployStatus();
  const digest = getLaunchDigest();
  const suppression = getSuppressionRegistry();
  const netlifySmoke = getNetlifyPreviewSmoke();
  const autoHealth = getAutomationHealth();
  const sloHistory = getAutomationHealthHistory();
  const sloSpark = sloTinySpark(sloHistory);

  const ema = suppression?.noise?.emaOpenIncidents;
  const deployNetlify = deployStatus?.netlifyDeployUrl;
  const emaOk = typeof ema !== 'number' || ema < 4;
  const smokeOk =
    !netlifySmoke ||
    netlifySmoke.skipped === true ||
    (typeof netlifySmoke.unhealthyCount === 'number' && netlifySmoke.unhealthyCount === 0);
  const automationHealthOk = emaOk && smokeOk && autoHealth?.severity !== 'critical';

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Banner items={whatsNewItems} />
      <section
        aria-label="Automation health"
        className="border-b border-slate-200 bg-slate-900 text-slate-100"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-white">Automation health</span>
            {typeof ema === 'number' ? (
              <span className="text-slate-300">
                Incident EMA: <span className="font-mono text-emerald-300">{ema.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-slate-400">Registry snapshot not in repo build</span>
            )}
            {deployStatus ? (
              <span className="text-slate-300">
                Deploy:{' '}
                <span className="font-mono uppercase text-slate-100">{deployStatus.status ?? 'unknown'}</span>
                {deployStatus.sha ? ` · ${deployStatus.sha.slice(0, 7)}` : ''}
              </span>
            ) : null}
            {deployNetlify ? (
              <a
                href={deployNetlify}
                className="text-cyan-300 underline decoration-cyan-500/60 underline-offset-2 hover:text-cyan-200"
                target="_blank"
                rel="noreferrer"
              >
                Netlify preview
              </a>
            ) : null}
            {netlifySmoke && !netlifySmoke.skipped && typeof netlifySmoke.unhealthyCount === 'number' ? (
              <span className={netlifySmoke.unhealthyCount > 0 ? 'text-amber-300' : 'text-emerald-300'}>
                Preview smoke: {netlifySmoke.unhealthyCount === 0 ? 'OK' : `${netlifySmoke.unhealthyCount} route(s)`}
              </span>
            ) : null}
            {autoHealth ? (
              <span className="text-slate-300">
                FP issues: <span className="font-mono text-violet-300">{autoHealth.openFingerprintIssues ?? 'n/a'}</span>
              </span>
            ) : null}
            {typeof autoHealth?.sloScore === 'number' ? (
              <span className="text-slate-300">
                SLO:{' '}
                <span className="font-mono text-sky-300">{autoHealth.sloScore}</span>
                {autoHealth.sloDeltaFromPrevious != null ? (
                  <span
                    className={
                      autoHealth.sloDeltaFromPrevious > 0
                        ? 'text-emerald-300'
                        : autoHealth.sloDeltaFromPrevious < 0
                          ? 'text-rose-300'
                          : 'text-slate-400'
                    }
                  >
                    {' '}
                    ({autoHealth.sloDeltaFromPrevious > 0 ? '+' : ''}
                    {autoHealth.sloDeltaFromPrevious})
                  </span>
                ) : null}
                {sloSpark ? (
                  <span className="ml-1 font-mono text-[10px] text-slate-500" title="SLO history spark (recent)">
                    {sloSpark}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                autoHealth?.severity === 'critical'
                  ? 'bg-rose-900/80 text-rose-100'
                  : automationHealthOk
                    ? 'bg-emerald-900/80 text-emerald-200'
                    : 'bg-amber-900/80 text-amber-100'
              }`}
            >
              {autoHealth?.severity === 'critical' ? 'Critical' : automationHealthOk ? 'Nominal' : 'Review'}
            </span>
            <a
              href="/ai-lab/deploy-drift-dashboard"
              className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
            >
              Drift dashboard
            </a>
            <a
              href="/automation"
              className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
            >
              Automation
            </a>
            <DependencyBadge />
          </div>
        </div>
      </section>
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
            <a
              href="#ai-product-recommender"
              className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700"
            >
              Try AI Product Recommender
            </a>
            <a
              href="/ai-lab"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore AI Lab
            </a>
            {heroCtas.map((cta) => (
              <a key={cta.href} href={cta.href} className={cta.className}>
                {cta.label}
              </a>
            ))}
            <a
              href="/automation"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              View Automation Engine
            </a>
            <a
              href="/ai-services/autonomous-growth-intelligence"
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              Explore Autonomous Growth Intelligence
            </a>
            <a
              href="#ai-catalog"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View all AI products & experiences
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <a
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
          </a>
          <a
            href="/ai-lab"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">AI Lab</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">In-Browser Intelligence</h2>
            <p className="mt-2 text-sm text-slate-600">
              Interactive tools for readiness scoring, governance risk, rollout planning, and growth
              strategy.
            </p>
          </a>
          <a
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
          </a>
        </section>

        <section className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Intelligent experiences spotlight</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            New RAG workspace + live autonomous tools now available
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-700">
            Launch deterministic citation-quality simulations in the new Autonomous RAG Knowledge
            Workspace, then jump to conversion, retention, incident, and deployment intelligence tools
            already live across AI Lab.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/ai-lab/autonomous-rag-knowledge-workspace"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Open Autonomous RAG Knowledge Workspace
            </a>
            <a
              href="/ai-lab/autonomous-media-prompt-studio"
              className="rounded-lg border border-fuchsia-300 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-800 hover:bg-fuchsia-100"
            >
              Launch Media Prompt Studio
            </a>
            <a
              href="/ai-lab/autonomous-conversion-copilot"
              className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
            >
              Explore Conversion Copilot
            </a>
            <a
              href="/ai-lab/autonomous-revenue-forecast-studio"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Open Revenue Forecast Studio
            </a>
            <a
              href="/ai-lab/autonomous-incident-commander"
              className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100"
            >
              Open Incident Commander
            </a>
            <a
              href="/ai-lab/autonomous-agent-skill-orchestrator"
              className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
            >
              Open Agent Skill Orchestrator
            </a>
            <a
              href="/ai-lab/autonomous-experiment-priority-engine"
              className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-100"
            >
              Open Experiment Priority Engine
            </a>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            <a
              href="/ai-lab/deployment-readiness-console"
              className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
            >
              Open deployment readiness console
            </a>
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
                <li key={item}>- {item}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="/ai-lab/deploy-drift-dashboard"
              className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
            >
              Open deploy drift dashboard
            </a>
            <a
              href="/ai-lab"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore all AI Lab launches
            </a>
          </div>
        </section>

        <section
          id="ai-solutions-architect"
          className="mt-8 rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-white to-violet-50 p-6 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
            New intelligent experience
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">AI Solutions Architect is live on every page</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-700">
            Use the floating <strong>Design my AI rollout</strong> widget (bottom-right) to generate a tailored,
            multi-phase plan and jump directly to the most relevant Zion AI products and services.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/ai-services/ai-strategy-roadmap"
              className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700"
            >
              Start with AI strategy
            </a>
            <a
              href="/contact#engagement"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
             data-cta-event="cta_contact" data-cta-label="page">
              Talk with a solutions architect
            </a>
          </div>
        </section>

        <ProductRecommenderSection items={aiCatalogHighlights} sectionId="ai-product-recommender" />
        <SmartContentSummarizer />

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
            {aiCatalogHighlights.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-300 hover:bg-violet-50"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">{item.badge}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                Live now
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                New intelligent experiences and autonomous products
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Explore the newest in-browser AI launches and autonomous workflows currently
                improving conversion, reliability, and deployment speed.
              </p>
            </div>
            <a
              href="/products"
              className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
            >
              Browse all AI products
            </a>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {liveNowItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{item.badge}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">{item.description}</p>
              </a>
            ))}
            <a
              href="/automation"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Automation
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Autonomous Deployment Ops</p>
              <p className="mt-1 text-xs text-slate-600">
                Continuous AI audits and deployment-safe improvement pipelines.
              </p>
            </a>
          </div>
        </section>

        {/* AI Tools Section */}
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
            <a
              href="/ai-tools"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Try All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <a
              href="/ai-tools"
              className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">ROI Calculator</h3>
              <p className="mt-2 text-sm text-slate-600">Calculate your AI investment returns</p>
            </a>
            <a
              href="/ai-tools"
              className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Document Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">AI-powered document analysis</p>
            </a>
            <a
              href="/ai-tools"
              className="rounded-xl border border-green-200 bg-white p-4 transition hover:border-green-400 hover:shadow-lg hover:shadow-green-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Chatbot Builder</h3>
              <p className="mt-2 text-sm text-slate-600">Create AI chatbots in minutes</p>
            </a>
          </div>
        </section>

        {/* New AI Experiences Section */}
        <section className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                ✨ New AI Experiences
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Interact with AI Like Never Before
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Experience voice AI, smart recommendations, intelligent notifications, and more — 
                all running directly in your browser.
              </p>
            </div>
            <a
              href="/ai-experiences"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Explore All AI Experiences
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/ai-experiences"
              className="rounded-xl border border-violet-200 bg-white p-4 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Voice AI Assistant</h3>
              <p className="mt-2 text-sm text-slate-600">Speak naturally and get instant AI responses</p>
            </a>
            <a
              href="/ai-experiences"
              className="rounded-xl border border-violet-200 bg-white p-4 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Smart Recommendations</h3>
              <p className="mt-2 text-sm text-slate-600">AI-powered suggestions personalized for you</p>
            </a>
            <a
              href="/ai-experiences"
              className="rounded-xl border border-violet-200 bg-white p-4 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Intelligent Notifications</h3>
              <p className="mt-2 text-sm text-slate-600">Smart alerts that learn your preferences</p>
            </a>
            <a
              href="/ai-experiences"
              className="rounded-xl border border-violet-200 bg-white p-4 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">AI Chat Companion</h3>
              <p className="mt-2 text-sm text-slate-600">Conversational AI that truly understands</p>
            </a>
          </div>
        </section>

        {/* AI Operations Hub */}
        <section className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                🎛️ AI Control Center
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Manage Your AI Operations
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Monitor service health, calculate ROI, analyze documents, and access all AI tools from one dashboard.
              </p>
            </div>
            <a
              href="/ai-dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open AI Dashboard
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <a
              href="/ai-dashboard"
              className="rounded-xl border border-blue-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Service Health</h3>
              <p className="mt-2 text-sm text-slate-600">Real-time monitoring</p>
            </a>
            <a
              href="/ai-tools"
              className="rounded-xl border border-blue-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">ROI Calculator</h3>
              <p className="mt-2 text-sm text-slate-600">Calculate returns</p>
            </a>
            <a
              href="/ai-tools"
              className="rounded-xl border border-blue-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Document Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">AI analysis</p>
            </a>
            <a
              href="/ai-lab"
              className="rounded-xl border border-blue-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">AI Lab</h3>
              <p className="mt-2 text-sm text-slate-600">Experiments</p>
            </a>
          </div>
        </section>

        {/* Developer Tools Section */}
        <section className="mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                🛠️ Developer AI Tools
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Free AI-Powered Developer Tools
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Analyze code complexity, test API response times, and more — all free.
              </p>
            </div>
            <a
              href="/ai-tools"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              All Developer Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <a
              href="/tools/json-to-typescript-converter"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">JSON to TypeScript</h3>
              <p className="mt-2 text-sm text-slate-600">Convert JSON to TypeScript interfaces</p>
            </a>
            <a
              href="/tools/code-complexity-analyzer"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Code Complexity Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">AI-powered code analysis and suggestions</p>
            </a>
            <a
              href="/tools/api-response-tester"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">API Response Tester</h3>
              <p className="mt-2 text-sm text-slate-600">Test API latency and performance</p>
            </a>
          </div>
        </section>

        {/* AI Status Section */}
        <section className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                📊 AI Services Status
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Real-Time AI Service Health
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Monitor the uptime, latency, and status of all Zion AI services.
              </p>
            </div>
            <a
              href="/ai-status"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              View Status Dashboard
            </a>
          </div>
        </section>

        {/* More Developer Tools */}
        <section className="mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                🧰 More Developer Tools
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Additional Free AI Tools
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                File analyzer, website analyzer, and more AI-powered developer utilities.
              </p>
            </div>
            <a
              href="/ai-tools"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              View All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <a
              href="/tools/file-analyzer"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">File Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">AI file analysis</p>
            </a>
            <a
              href="/tools/sql-query-generator"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">SQL Generator</h3>
              <p className="mt-2 text-sm text-slate-600">AI query builder</p>
            </a>
            <a
              href="/tools/api-designer"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0119 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">API Designer</h3>
              <p className="mt-2 text-sm text-slate-600">Visual API builder</p>
            </a>
            <a
              href="/tools/website-analyzer"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10 5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Website Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">SEO & performance audit</p>
            </a>
          </div>
        </section>

        {/* What's New - CSS Minifier & Gitignore Generator */}
        <section className="mt-8 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-orange-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                CSS & Git Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Minify or beautify CSS with live analysis stats (rules, colors, !important count).
                Generate .gitignore files for 18+ languages, frameworks, and tools with search and custom rules.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/css-minifier-beautifier"
              className="rounded-xl border border-rose-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-lg hover:shadow-rose-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CSS Minifier & Beautifier</h3>
              <p className="mt-2 text-sm text-slate-600">
                Minify CSS for production or beautify for readability. Includes analysis panel showing rule count, unique selectors, colors used, media queries, !important usage, and size savings percentage. Toggle 2 or 4-space indentation.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/gitignore-generator"
              className="rounded-xl border border-orange-200 bg-white p-5 transition hover:border-orange-400 hover:shadow-lg hover:shadow-orange-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">.gitignore Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Generate .gitignore files for 18+ languages (Node, Python, Go, Rust, Java, Swift), frameworks (Next.js, Vue, Django, Rails), DevOps (Docker, Terraform), and OS files. Search templates, pick &ldquo;Popular&rdquo; presets, add custom rules, and download instantly. 100% client-side.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - XML Formatter & HMAC Generator */}
        <section className="mt-8 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                XML & Crypto Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Format, validate, and minify XML with detailed stats and error reporting.
                Generate HMAC signatures for API auth, webhooks, and request signing.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/xml-formatter-validator"
              className="rounded-xl border border-orange-200 bg-white p-5 transition hover:border-orange-400 hover:shadow-lg hover:shadow-orange-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">XML Formatter & Validator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Pretty-print or minify XML with real-time validation, error details with line numbers, element/attribute stats, and configurable indentation. 100% client-side.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/hmac-generator"
              className="rounded-xl border border-rose-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-lg hover:shadow-rose-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">HMAC Signature Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Generate HMAC-SHA256/384/512 signatures with hex and Base64 output. Perfect for webhook verification (Stripe, GitHub), API request signing, and JWT generation. Includes Node.js verification snippets.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - UUID Generator & Timestamp Converter */}
        <section className="mt-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                🆕 Just Launched
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                New Developer Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Generate UUIDs (v4 &amp; v7) with bulk export, and convert timestamps between formats
                with a live clock and time difference calculator.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/uuid-generator"
              className="rounded-xl border border-indigo-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">UUID Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Generate UUID v4 (random) or v7 (time-ordered) identifiers with bulk generation, format options
                (uppercase, braces, no hyphens), copy-all, and download as .txt.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/timestamp-converter"
              className="rounded-xl border border-sky-200 bg-white p-5 transition hover:border-sky-400 hover:shadow-lg hover:shadow-sky-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Timestamp Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert between Unix timestamps, ISO 8601, and human-readable dates. Live updating clock,
                auto-detect format, and time difference calculator.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Color Converter & JSON Diff Viewer */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 Just Launched
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                New Design & Developer Tools
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert colors between HEX, RGB, HSL, and CMYK with live preview and harmonies.
                Compare JSON objects with structural diffing and filtering.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/color-converter"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Color Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert colors between HEX, RGB, HSL, and CMYK with live preview, editable channels,
                color harmonies (complementary, triadic, analogous), and instant CSS export.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/json-diff-viewer"
              className="rounded-xl border border-teal-200 bg-white p-5 transition hover:border-teal-400 hover:shadow-lg hover:shadow-teal-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON Diff Viewer</h3>
              <p className="mt-2 text-sm text-slate-600">
                Compare two JSON objects side-by-side with recursive structural diffing. Filter by
                added, removed, or changed. Shows path-level changes with copy support.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Base64 Encoder & URL Slug Generator */}
        <section className="mt-8 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                🆕 What's New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Encoding & SEO Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Encode text and files to Base64 with drag-and-drop support, and generate SEO-friendly
                URL slugs with case variants, stop word removal, and live preview.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/base64-encoder-decoder"
              className="rounded-xl border border-rose-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-lg hover:shadow-rose-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Base64 Encoder / Decoder</h3>
              <p className="mt-2 text-sm text-slate-600">
                Encode or decode text and files to/from Base64 with file upload, download output,
                character count stats, and expansion ratio display.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/url-slug-generator"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">URL Slug Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert any text to clean, SEO-friendly URL slugs. Supports dash/underscore separators,
                4 case styles, stop word removal, and shows all case variants.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* Even More Developer Tools */}
        <section className="mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                🛠️ Developer Utilities
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Essential Developer Tools
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                JWT decoder, cron generator, and more utilities.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/jwt-decoder"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">JWT Decoder</h3>
              <p className="mt-2 text-sm text-slate-600">Decode & inspect tokens</p>
            </a>
            <a
              href="/tools/cron-generator"
              className="rounded-xl border border-cyan-200 bg-white p-4 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Cron Generator</h3>
              <p className="mt-2 text-sm text-slate-600">Schedule expressions</p>
            </a>
          </div>
        </section>

        {/* What's New - CSV/JSON Converter & Env File Parser */}
        <section className="mt-8 rounded-2xl border border-lime-200 bg-gradient-to-r from-lime-50 via-white to-amber-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-lime-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Data & Config Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert CSV to JSON and back with smart quoting and file upload.
                Parse and manage .env files with auto secret detection and .env.example export.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/csv-json-converter"
              className="rounded-xl border border-lime-200 bg-white p-5 transition hover:border-lime-400 hover:shadow-lg hover:shadow-lime-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CSV ↔ JSON Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Bidirectional converter between CSV and JSON. Handles quoted fields, commas, and newlines.
                Upload files, copy output, or download results instantly.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/env-file-parser"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Env File Parser</h3>
              <p className="mt-2 text-sm text-slate-600">
                Parse .env files with automatic secret detection, inline editing, secret masking,
                and one-click .env.example generation with placeholder values.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - CSS Gradient Generator & Regex Tester */}
        <section className="mt-8 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-violet-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Design & Regex Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Generate stunning CSS gradients with live preview, color stops, and presets.
                Test regular expressions with real-time match highlighting and capture group inspection.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/css-gradient-generator"
              className="rounded-xl border border-pink-200 bg-white p-5 transition hover:border-pink-400 hover:shadow-lg hover:shadow-pink-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CSS Gradient Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create linear, radial, and conic gradients with a visual editor. Add color stops, pick from 8 curated presets, randomize, and copy ready-to-use CSS instantly.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-pink-700 bg-pink-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/regex-tester"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Regex Tester</h3>
              <p className="mt-2 text-sm text-slate-600">
                Test regular expressions with real-time match highlighting, capture group details, toggle-able flags, 10 common pattern presets, and a built-in cheat sheet.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - AI Document Analyzer */}
        <section className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                AI Document Analyzer — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Upload any text document or paste content for instant analysis — word counts, readability scoring,
                keyword extraction, and writing insights. 100% client-side, nothing leaves your browser.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/document-analyzer"
              className="rounded-xl border border-violet-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10 md:col-span-2"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">AI Document Analyzer</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Upload documents (TXT, MD, CSV, JSON, code files) or paste text for instant analysis.
                    Get word counts, readability scores (Flesch), keyword extraction, reading time estimates,
                    lexical diversity metrics, and writing improvement suggestions. Drag-and-drop support,
                    100% private — all processing in your browser.
                  </p>
                  <span className="inline-block mt-3 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">New tool</span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* What's New - Chmod Calculator & String Entropy Analyzer */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Sysadmin & Security Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Build Unix file permissions visually with the Chmod Calculator — owner/group/other controls, special bits, and 12 presets.
                Analyze string randomness and password strength with the Entropy Analyzer — character class breakdown, pattern detection, and brute-force bit estimation.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/chmod-calculator"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Chmod Permission Calculator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Visually build Unix file permissions with owner/group/other toggles, SetUID/SetGID/Sticky bits, 12 common presets (644, 755, 777, etc.), and instant octal/symbolic/chmod command output.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/string-entropy-analyzer"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">String Entropy Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">
                Analyze the randomness and information density of any string. Character class breakdown with visual bars, top-frequency characters, pattern detection warnings (sequential, keyboard patterns), unique char ratio, and brute-force bit estimation. 8 example inputs included.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Markdown Table Generator & DNS Lookup */}
        <section className="mt-8 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Data & Networking Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert CSV data into clean Markdown tables, ASCII tables, or HTML with live preview, alignment controls, and instant export.
                Query DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME, SOA, and CAA — all from your browser.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/markdown-table-generator"
              className="rounded-xl border border-teal-200 bg-white p-5 transition hover:border-teal-400 hover:shadow-lg hover:shadow-teal-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Markdown Table Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste CSV or TSV data and instantly generate Markdown tables, ASCII box tables, or HTML tables. Toggle header rows, choose alignment (left/center/right), see a live rendered preview, and copy or download the output.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/dns-lookup"
              className="rounded-xl border border-cyan-200 bg-white p-5 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">DNS Record Lookup</h3>
              <p className="mt-2 text-sm text-slate-600">
                Query DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME, SOA, and CAA records. Select multiple record types at once, see query times, copy individual values, and export results. Uses Google Public DNS — 100% client-side.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-cyan-700 bg-cyan-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - CORS Tester & User-Agent Parser */}
        <section className="mt-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-slate-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Web Debugging & Security Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Test CORS headers for any URL and see exactly which origins, methods, and credentials are allowed.
                Parse User-Agent strings to detect browser, OS, device type, and bot status — including AI crawlers like GPTBot and Claude.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/cors-tester"
              className="rounded-xl border border-indigo-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CORS Header Tester</h3>
              <p className="mt-2 text-sm text-slate-600">
                Test Cross-Origin Resource Sharing configuration for any URL. See allowed origins, methods, headers, and credentials at a glance. Origin verification shows exactly whether your app domain is permitted. Quick presets for common APIs.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/user-agent-parser"
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-lg hover:shadow-slate-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">User-Agent Parser</h3>
              <p className="mt-2 text-sm text-slate-600">
                Parse any User-Agent string to instantly detect browser name &amp; version, operating system, device type &amp; vendor, rendering engine, and CPU architecture. Includes bot detection for 20+ crawlers — Googlebot, GPTBot, Claude, Bingbot, Ahrefs, and more.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - JSON Schema Validator & SQL Formatter */}
        <section className="mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Schema Validation & SQL Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Validate JSON against JSON Schema with detailed error paths and type checking.
                Format and beautify SQL queries with intelligent keyword detection and indentation.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/json-schema-validator"
              className="rounded-xl border border-cyan-200 bg-white p-5 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON Schema Validator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Validate JSON data against JSON Schema with full support for type checking, required properties, string/number constraints, array validation, nested objects, and composition keywords (allOf, anyOf, oneOf, not). Shows exact error paths with keyword labels.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-cyan-700 bg-cyan-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/sql-formatter"
              className="rounded-xl border border-blue-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">SQL Query Formatter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Format and beautify SQL queries with intelligent keyword capitalization, smart indentation for subqueries and CTEs, and support for SELECT, INSERT, UPDATE, CREATE TABLE, and more. Choose between spaces or tabs. Includes example queries to try instantly.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - API Request Builder & Markdown Live Editor */}
        <section className="mt-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                API & Markdown Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Build and test HTTP requests with full auth, headers, and body support — plus a live markdown
                editor with instant preview and export to HTML or Markdown files.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/api-request-builder"
              className="rounded-xl border border-indigo-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">API Request Builder</h3>
              <p className="mt-2 text-sm text-slate-600">
                Build HTTP requests with method selection, custom headers, request body editing, Bearer/Basic/API key
                authentication, and a formatted response viewer with timing and size metrics. Includes request history.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/markdown-live-editor"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Markdown Live Editor</h3>
              <p className="mt-2 text-sm text-slate-600">
                Write markdown with instant side-by-side preview. Supports headers, code blocks, tables, task lists,
                blockquotes, and links. Export as clean HTML or Markdown file. Includes quick reference cheatsheet.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Number Base Converter & JSON Path Explorer */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-violet-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Number Systems & JSON Querying — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert between binary, octal, decimal, hex and base-36 with live bit visualization.
                Query JSON data interactively with JSONPath expressions and instant results.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/number-base-converter"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Number Base Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert between binary, octal, decimal, hexadecimal, and base-36 in real-time.
                Includes bit visualization (8/16/32/64-bit), signed/unsigned display, one-click copy,
                and swap source base. Supports arbitrarily large integers.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/json-path-explorer"
              className="rounded-xl border border-violet-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON Path Explorer</h3>
              <p className="mt-2 text-sm text-slate-600">
                Query JSON data with JSONPath expressions — see results as you type. Supports child access,
                array indexing, slicing, wildcards, recursive descent, and filter expressions.
                Includes collapsible tree view, syntax reference, and preloaded sample data.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Color Blindness Simulator & JSON to CSV Converter */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Accessibility & Data Conversion — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Simulate color blindness for accessible design reviews. Convert JSON arrays to CSV
                with nested object flattening, custom delimiters, and live preview.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/color-blindness-simulator"
              className="rounded-xl border border-rose-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-lg hover:shadow-rose-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Color Blindness Simulator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Preview how your designs appear to users with protanopia, deuteranopia, tritanopia,
                and achromatopsia. Build custom palettes, compare side-by-side, check WCAG contrast
                ratios, and get accessibility tips. 8% of men have color vision deficiency.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/json-to-csv-converter"
              className="rounded-xl border border-cyan-200 bg-white p-5 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON to CSV Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert JSON arrays, nested objects, or NDJSON to CSV with configurable delimiters,
                automatic nested object flattening, custom null values, and quote control. Includes
                live preview table, file upload, and one-click download. 100% client-side.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-cyan-700 bg-cyan-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Base32 Encoder & CSS Unit Converter */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-violet-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Security & CSS Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Encode and decode Base32 for 2FA secrets and API keys. Convert CSS units instantly
                with configurable viewport and font-size settings.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/base32-encoder-decoder"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Base32 Encoder / Decoder</h3>
              <p className="mt-2 text-sm text-slate-600">
                Encode and decode text to Base32 — the standard used in TOTP 2FA secrets
                (Google Authenticator), DNS records, and recovery keys. Supports Base32Hex
                variant, includes practical examples, and one-click copy. 100% client-side.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/css-unit-converter"
              className="rounded-xl border border-violet-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CSS Unit Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert between px, rem, em, vw, vh, pt, cm, and more. Configure root font-size,
                parent font-size, and viewport dimensions for accurate conversions. Includes
                presets, quick CSS copy, and a full unit reference guide.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Subnet Calculator & ASCII Art Generator */}
        <section className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Networking & Creative Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Calculate IP subnets with full network analysis, host ranges, and CIDR splitting.
                Generate block-style ASCII art text for terminal banners, README headers, and more.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/subnet-calculator"
              className="rounded-xl border border-blue-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">IP Subnet Calculator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Enter any CIDR notation to instantly calculate network address, broadcast, first/last usable hosts,
                subnet mask, wildcard mask, and total hosts. Includes IP class detection, private range identification,
                subnet splitting guidance, and a quick-reference CIDR table. Perfect for network planning and troubleshooting.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/ascii-art-generator"
              className="rounded-xl border border-indigo-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">ASCII Art Text Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert any text into block-style ASCII art with customizable fill and empty characters (blocks, hashes, stars, binary).
                Features a shadow variant generator, one-click copy, and download as .txt.
                Supports A-Z, 0-9, and common symbols. Great for terminal banners, README files, and code comments.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Certificate Decoder & Image Color Extractor */}
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Security & Design Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Decode X.509 SSL/TLS certificates with full subject, issuer, validity, and fingerprint analysis.
                Extract dominant color palettes from images with export to CSS, SCSS, Tailwind, and JSON.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/certificate-decoder"
              className="rounded-xl border border-emerald-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Certificate Decoder</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste any PEM-encoded X.509 certificate to instantly decode subject, issuer, validity period,
                signature algorithm, public key info, Subject Alternative Names, and SHA-256/SHA-1 fingerprints.
                Includes expiry warnings, CA detection, key usage display, and one-click copy.
                Essential for DevOps, security audits, and SSL troubleshooting.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/image-color-extractor"
              className="rounded-xl border border-pink-200 bg-white p-5 transition hover:border-pink-400 hover:shadow-lg hover:shadow-pink-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Image Color Extractor</h3>
              <p className="mt-2 text-sm text-slate-600">
                Upload any image to extract its dominant color palette using k-means clustering.
                Get colors as HEX, RGB, or HSL with percentage breakdowns. Export as CSS variables,
                SCSS, Tailwind config, or JSON. Supports drag-and-drop, configurable palette size (3-12 colors),
                and a visual palette strip. Perfect for designers building brand-consistent palettes.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-pink-700 bg-pink-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - HTML to JSX Converter & Mock API Generator */}
        <section className="mt-8 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-purple-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                React & API Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert HTML to React JSX with automatic className, htmlFor, inline style, and self-closing tag conversion.
                Generate realistic mock API data with a visual schema editor and 25+ field types.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/html-to-jsx"
              className="rounded-xl border border-orange-200 bg-white p-5 transition hover:border-orange-400 hover:shadow-lg hover:shadow-orange-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">HTML to JSX Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste any HTML and instantly convert it to React-compatible JSX. Handles 12+ attribute conversions
                including class→className, for→htmlFor, and tabindex→tabIndex. Converts inline style strings to
                React style objects, self-closes void elements, and transforms HTML comments to JSX syntax.
                Includes live example presets and a visual conversion reference table.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/mock-api-generator"
              className="rounded-xl border border-purple-200 bg-white p-5 transition hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Mock API Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Build realistic fake API responses with a visual schema editor. Choose from 25+ field types
                including uuid, name, email, phone, price, IP address, and more. Supports JSON, curl, and
                Fetch.js output formats with configurable record count. Download as JSON or copy to clipboard.
                Perfect for prototyping, testing, and demos without a real backend.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - JSON to Zod & Hash Identifier */}
        <section className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Developer & Security Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert JSON to Zod validation schemas with smart type detection for emails, URLs, dates, and UUIDs.
                Identify hash types across 25+ algorithms with security analysis and confidence scoring.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/json-to-zod"
              className="rounded-xl border border-violet-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON to Zod Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste any JSON and instantly generate a complete Zod schema with TypeScript type inference.
                Smart detection maps emails to <code className="text-xs bg-violet-50 px-1 rounded">z.string().email()</code>,
                URLs to <code className="text-xs bg-violet-50 px-1 rounded">z.string().url()</code>, ISO dates to{' '}
                <code className="text-xs bg-violet-50 px-1 rounded">z.string().datetime()</code>, and more.
                Supports strict and passthrough modes, mixed-type arrays with unions, and safe key quoting.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/hash-identifier"
              className="rounded-xl border border-indigo-200 bg-white p-5 transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Hash Identifier</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste any hash string to instantly identify its type — MD5, SHA-1, SHA-256, SHA-512, bcrypt, Argon2,
                scrypt, NTLM, BLAKE2, SHA-3, and 20+ more algorithms. Includes security ratings (broken → strong),
                confidence scoring, and quick examples. A reference table shows hash lengths at a glance.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - JSON to TOML Converter & CSS Specificity Calculator */}
        <section className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-rose-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Config & CSS Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Convert JSON to TOML (and back) with full support for nested tables, array of tables, and all TOML data types.
                Calculate CSS specificity scores with visual breakdowns, selector comparison, and cascade order reference.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/json-to-toml-converter"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON ↔ TOML Converter</h3>
              <p className="mt-2 text-sm text-slate-600">
                Convert between JSON and TOML formats with bidirectional conversion. Supports nested tables, dotted keys,
                array of tables (Cargo.toml style), inline arrays and tables, and all TOML data types. Perfect for creating
                Cargo.toml, pyproject.toml, or Hugo config files from JSON data. Upload files, download output, and load samples.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/css-specificity-calculator"
              className="rounded-xl border border-rose-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-lg hover:shadow-rose-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">CSS Specificity Calculator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Calculate CSS specificity scores in (a, b, c) format — IDs, classes/attributes/pseudo-classes, and elements/pseudo-elements.
                Visual bar charts show each component, auto-ranked results show which selector wins. Compare selectors side-by-side,
                try 18 real-world examples, and reference the full cascade order. Essential for debugging CSS conflicts.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Favicon Generator & .htaccess Generator */}
        <section className="mt-8 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-slate-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Favicon & Server Config Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Generate favicons from text, emoji, or uploaded images in all standard sizes with one-click download.
                Build Apache .htaccess rules visually — redirects, rewrites, browser caching, and security headers without memorizing syntax.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/favicon-generator"
              className="rounded-xl border border-violet-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Favicon Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create professional favicons from text, emoji, or uploaded images. Customize background color, text color,
                font, and border radius. Download all standard sizes (16px to 512px) at once, with ready-to-paste HTML snippet.
                Supports Apple Touch Icons, Android Chrome icons, and PWA splash screens.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-violet-700 bg-violet-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/htaccess-generator"
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-lg hover:shadow-slate-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-blue-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">.htaccess Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Build Apache .htaccess files with a visual interface. Configure 301/302 redirects with preset templates,
                custom mod_rewrite rules, browser caching by file type, security headers (HSTS, CSP, X-Frame-Options),
                bot blocking, custom error pages, and more. Copy or download the generated file instantly.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>

        {/* What's New - Cookie Decoder & JSON Schema Generator */}
        <section className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                🆕 What&apos;s New
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Security & Schema Tools — Just Launched
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Parse and audit HTTP cookies with security analysis for Secure, HttpOnly, SameSite flags.
                Generate JSON Schema and TypeScript types from sample data with smart format detection.
              </p>
            </div>
            <a
              href="/tools"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              All Tools
            </a>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href="/tools/cookie-decoder"
              className="rounded-xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Cookie Decoder & Analyzer</h3>
              <p className="mt-2 text-sm text-slate-600">
                Parse Set-Cookie and Cookie headers with full attribute breakdown — Secure, HttpOnly, SameSite, Max-Age, Domain, Path, and more.
                Get a security score with critical/warning/info recommendations. Supports multiple cookies and includes an attribute reference guide.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">New tool</span>
            </a>
            <a
              href="/tools/json-schema-generator"
              className="rounded-xl border border-teal-200 bg-white p-5 transition hover:border-teal-400 hover:shadow-lg hover:shadow-teal-600/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">JSON Schema Generator</h3>
              <p className="mt-2 text-sm text-slate-600">
                Paste any JSON and instantly generate a JSON Schema (2020-12 draft) and TypeScript interface.
                Smart format detection for emails, URLs, dates, UUIDs, phone numbers, and hex colors.
                Configurable options for required fields, additional properties, examples, and descriptions. Download as .json or .ts.
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">New tool</span>
            </a>
          </div>
        </section>


      <DonateSection />
      <OpenCollectiveWidget />
      <section className="mt-12 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Support Zion Tech Group</h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Your contributions help keep our free tools available and improve the platform.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a href="https://github.com/sponsors/Zion-support" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all">
            GitHub Sponsors
          </a>
          <a href="https://ko-fi.com/ziontech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all">
            Ko-fi
          </a>
          <a href="https://www.buymeacoffee.com/ziontech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all">
            Buy Me a Coffee
          </a>
        </div>
      </section>

      <TopToolsShowcase />

</main>
    </div>
  );
}