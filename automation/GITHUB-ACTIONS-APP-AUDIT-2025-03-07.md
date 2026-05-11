# GitHub Actions & App Audit (2025-03-07)

Audit of all GitHub Actions workflows and live app (https://ziontechgroup.com) to drive new automations and improvements.

## Scope

- **Workflows audited:** 76 workflow files in `.github/workflows/`
- **App:** Zion Tech Group – AI & IT Solutions (Next.js 16 static export, ~458 pages)
- **Live site:** https://ziontechgroup.com

## Workflow Categories (Summary)

| Category | Examples | Schedule / Trigger |
|----------|----------|---------------------|
| **CI/CD** | ci-cd.yml, deploy-on-push.yml, deploy-preflight.yml | push/PR, workflow_run, workflow_dispatch |
| **App evolution** | ai-app-visit-audit-implement-deploy.yml, ai-app-evolution-audit.yml, ai-app-visit-intelligence.yml | Wed/Sat, Mon, workflow_dispatch |
| **Content** | ai-content-ideas-deploy, ai-ultra-fast-content, ai-weekly-content-seo-hygiene | 3–6x daily, Mon 06 UTC |
| **Links & nav** | ai-broken-link-fixer.yml, ai-navigation-audit-fix.yml, ai-site-link-audit-automation.yml | Mon/Thu, Wed/Sat, manual |
| **Quality & health** | production-health-monitor.yml, lighthouse-production.yml, ai-production-deploy-validation.yml | 6h, Sun 12 UTC, after deploy |
| **Audit & improvement** | ai-github-actions-audit.yml, ai-automation-audit.yml, ai-automation-improvements.yml | Sun 9 UTC, Sat 11 UTC, Wed 10 UTC |
| **Security & deps** | ai-weekly-security-audit.yml, dependency-review.yml, codeql-analysis.yml | Weekly, PR |
| **Accessibility** | ai-accessibility-audit.yml, ai-live-accessibility-audit.yml | Tue 8 UTC (build), Thu 7 UTC (live), PR (app/**) |
| **Live site audits** | ai-live-ux-audit.yml, ai-live-accessibility-audit.yml | Tue 7 UTC (UX), Thu 7 UTC (a11y) |

## App Audit (Live Visit)

From visiting https://ziontechgroup.com:

- **Homepage:** Hero, Advanced AI Services (8 cards), Core Services, Launch roadmap, ROI estimator, case studies, testimonials, trust metrics. CTAs to /contact, /solutions, /pricing, /ai-services.
- **Key routes:** /services, /solutions, /contact, /about, /blog, /pricing, /industries, /case-studies, /products, /ai-services, /consultation, /site-map.
- **Forms/mailto:** All contact flows use CONTACT_INFO.email (commercial@ziontechgroup.com) from app/utils/seoConstants.ts.
- **Automations already cover:** Visit → audit → evolution → implement → deploy (ai-app-visit-audit-implement-deploy, evolution audit, visit intelligence); broken links (codebase + live); content/SEO hygiene; nav audit/fix; layout/design pipeline; dependency hygiene; live a11y.

## Findings

### Strengths

- **Visit → Audit → Implement → Deploy** loop is well covered (ai-app-visit-audit-implement-deploy, evolution audit, visit intelligence).
- **Broken links:** Codebase (ai-broken-link-fixer) and live site (ai-site-link-audit) both covered.
- **Production health:** production-health-monitor (6h), SSL check, security headers, issue creation on failure (fixed: github-script now receives failure count via env).
- **Post-deploy:** deploy-on-push smoke test + UX verification; ai-production-deploy-validation (sitemap, SEO, link check).
- **Content & SEO:** Weekly content freshness + SEO meta (Mon 06 UTC); multiple content velocity workflows.
- **Live audits:** Live a11y (Thu 7 UTC); live UX audit added (Tue 7 UTC) for heuristic UX/SEO report artifact.

### Improvements Applied (This Audit)

1. **production-health-monitor.yml** – Fixed Create issue step: pass `steps.health.outputs.failures` via `env.FAILURES` into github-script so issue body/comment show correct count (no more `${${{ }}}` syntax error).
2. **ai-live-ux-audit.yml** – New workflow: runs `npm run app:ux-audit` (ai-live-site-ux-audit-agent.cjs) weekly Tue 7 UTC; uploads live-site-ux-audit-latest.json artifact (retention 30 days). No LLM; report can feed layout/evolution pipelines.

## New Workflows Implemented (Cumulative)

- **ai-live-accessibility-audit.yml** – Weekly live-site a11y (Thu 7 UTC), upload artifact.
- **ai-weekly-dependency-hygiene.yml** – Weekly npm audit + outdated report (Sun 8 UTC), upload artifact; optional issue on critical vulns.
- **ai-live-ux-audit.yml** – Weekly live-site UX/heuristic audit (Tue 7 UTC), upload artifact.
- **ai-weekly-live-ideas-implement.yml** – Weekly Tue 8 UTC: live UX + system intel + conversion funnel → evolution ideas from audits → backlog apply → optional commit/deploy.
- **merge-github-actions-app-ideas-to-backlog.cjs** – Merges appAutomationIdeas from GitHub Actions audit into app-evolution-backlog.json (used in ai-github-actions-audit.yml).

## Improvements Applied (Cumulative)

- **ai-accessibility-audit.yml** – Serve `dist` instead of `out` for axe audit (matches next.config.mjs distDir).
- **production-health-monitor.yml** – Issue creation uses env.FAILURES for failure count in github-script.

## Secrets / Env

- `OPENROUTER_API_KEY` – evolution, content, audit agents
- `NETLIFY_BUILD_HOOK` – deploy triggers
- Optional: `GROQ_API_KEY`, `GEMINI_API_KEY` for local LLM specialists

## References

- `automation/APP-VISIT-AUDIT-2025-03-07.md` – Visit → audit → implement → deploy
- `automation/README.md` – Visit table, broken links, layout automation, GitHub Actions table
- `automation/ai-github-actions-audit-agent.cjs` – Workflow + app audit (OpenRouter)
- `automation/ai-github-actions-implementation-agent.cjs` – Applies workflow improvements and new workflows from suggestions

---

*Generated from GitHub Actions and app audit. Update when adding or changing workflows.*
