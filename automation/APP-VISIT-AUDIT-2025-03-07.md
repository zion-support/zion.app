# App Visit Audit – ziontechgroup.com (2025-03-07)

Audit of https://ziontechgroup.com to drive automations for implementing and deploying new ideas and continuous app improvement.

## Site Overview (from live fetch)

- **Product**: Zion Tech Group – AI & IT Solutions
- **Tagline**: Design, Launch, and Scale AI Operations With Confidence
- **Value props**: Faster go-live, lower execution risk, clear KPI tracking
- **Key sections**: Advanced AI Services (7 cards), Core Services (14+), Launch roadmap, ROI estimator, case studies, testimonials, trust metrics

## Existing Automations (already in repo)

These pipelines already implement “visit → audit → ideas → implement → deploy”:

| Automation | Schedule | Purpose |
|------------|----------|---------|
| **AI App Evolution Audit** | Sat 14 UTC | Phase 0: automation + site links + UX/layout; Phase 1: ideation + evolution ideas; Phase 2: blog + front page + product + services; Phase 3: commit & deploy |
| **AI App Evolution Automation** | Sun 11 UTC | App audit → LLM evolution ideas → backlog; optional commit/push |
| **AI App Visit Intelligence** | Mon 14 UTC | Visit site → system intel + live UX + conversion funnel + local LLM specialists + evolution implement + UX auto-fix + commit/deploy |
| **AI Ideas to Implementation** | 4/8/12/16 UTC daily | Ideation + evolution ideas + blog + front page + product pages; commit + optional deploy |
| **AI Content Ideas to Deploy** | 9/14/19 UTC daily | Ideation + front page expansion + template burst; commit + deploy |

## Audit Findings – What to Automate Further

### 1. **Unified “Visit → Audit → Implement → Deploy” trigger**
- **Idea**: Single workflow that can be run manually or on a schedule to: fetch key pages → run all audits (UX, system intel, conversion, links) → generate evolution ideas → run safe implementations → commit and push → trigger Netlify deploy.
- **Status**: Partially covered by `ai-app-evolution-audit-pipeline.cjs` and `ai-app-visit-intelligence-orchestrator.cjs`. Recommendation: add one workflow that explicitly runs “evolution audit pipeline” with `AUTO_COMMIT=1` and `TRIGGER_DEPLOY=1` and documents it as the canonical “visit-audit-implement-deploy” run.

### 2. **Pages to visit**
- **Current**: `automation/data/pages-to-visit.json` defines core (6), extended (9 including Partners), auditOnly (4 including Site Map). Visit intelligence uses `includeExtended: true`.
- **Suggestion**: Ensure `/site-map` is used consistently (route is `app/site-map/page.tsx`; sitemap.xml is at `/sitemap.xml`). Partners page is at `/partners` and is in RESOURCE_LINKS and extended pages.

### 3. **Evolution backlog → implementation**
- **Current**: `ai-app-evolution-automation-agent.cjs` writes `app-evolution-backlog.json` and can apply “safe” improvements when `AUTO_APPLY=1`. Visit intelligence runs it with `AUTO_APPLY=1`.
- **Implemented**: Evolution audit pipeline now runs evolution automation with `AUTO_APPLY=1` in Phase 2 (Evolution Backlog Apply; optional skip via `SKIP_EVOLUTION_APPLY=1`). Backlog items are applied and committed with the rest of the pipeline.

### 4. **Deploy after commit**
- **Current**: Evolution audit pipeline and visit intelligence support `TRIGGER_DEPLOY=1` and `NETLIFY_BUILD_HOOK`. Ideas-to-implementation and content-ideas-deploy also trigger deploy.
- **Recommendation**: Default `TRIGGER_DEPLOY=1` for the main “visit-audit-implement-deploy” workflow so every run that commits also deploys.

### 5. **New automation ideas to implement**
- **Lighthouse / Core Web Vitals**: Already have `lighthouse-production.yml`, `core-web-vitals-monitor.yml`. Ensure one runs after deploy or on a schedule and fails the run if below threshold (optional).
- **Broken link check**: `ai-site-link-audit-automation.cjs` and `ai-broken-link-fixer.cjs` exist; evolution audit already runs site link audit in Phase 0.
- **SEO meta refresh**: Evolution automation fallback includes “Refresh meta descriptions”; ensure SEO meta auditor runs periodically (e.g. in evolution audit or visit intelligence).
- **Content freshness**: `ai-content-freshness-agent.cjs` exists; can be invoked from a weekly “hygiene” run.

## Recommendations Implemented

1. **Add GitHub workflow** `ai-app-visit-audit-implement-deploy.yml`: runs evolution audit pipeline with AUTO_COMMIT and TRIGGER_DEPLOY, 2x weekly (e.g. Wed + Sat) and workflow_dispatch.
2. **Evolution audit pipeline**: Phase 2 runs evolution automation with AUTO_APPLY=1 (Evolution Backlog Apply); Phase 3 commits *all* changes and triggers deploy when TRIGGER_DEPLOY=1.
3. **Content velocity**: All content workflows push to `origin HEAD:main`. Added `ai-content-maximum-velocity.yml` — runs once daily (10 UTC) with elevated limits (blog 14, products 5, industry 5, template 8/8) for maximum content output.
4. **Documentation**: This file plus README updates so “visit audit → implement → deploy” is the single place to look for the full loop.
4. **Navigation audit & fix**: Added `ai-navigation-audit-fix.yml` — runs nav audit (run + optional fix), Wed + Sat 8 UTC; manual inputs: `apply_fix`, `auto_commit`. Nav audit finds broken links and footer/nav sync; fix applies safe RESOURCE_LINKS sync.
6. **Weekly content + SEO hygiene**: `ai-weekly-content-seo-hygiene.yml` runs content freshness + SEO meta auditor every Monday 06 UTC; uploads reports as artifacts.
7. **Weekly live ideas implement**: `ai-weekly-live-ideas-implement.yml` runs Tue 8 UTC: live UX + system intel + conversion funnel audits → evolution ideas from audits → backlog apply → optional commit/deploy. Complements full evolution pipeline.
8. **GitHub Actions audit → evolution backlog**: After `ai-github-actions-audit-agent` and implementation agent, `merge-github-actions-app-ideas-to-backlog.cjs` merges `appAutomationIdeas` into `app-evolution-backlog.json`; optional commit when auto_commit and backlog changed.
9. **Post-deploy CWV sample**: `ai-production-deploy-validation.yml` includes optional Core Web Vitals (homepage) step when Lighthouse is available; non-blocking.

## Secrets / Env Required

- `OPENROUTER_API_KEY` – evolution ideas, content, app audit
- `NETLIFY_BUILD_HOOK` – deploy after push
- Optional: `GROQ_API_KEY`, `GEMINI_API_KEY` for local LLM specialists

---

*Generated from app visit audit for automation design. Update this file when adding or changing visit/audit/implement/deploy automations.*
