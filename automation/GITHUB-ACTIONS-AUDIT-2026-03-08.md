# GitHub Actions & Live App Audit (2026-03-08)

Audit of all GitHub Actions workflows and live app (https://ziontechgroup.com) to drive automations and improvements. Live site visited 2026-03-08.

## Scope

- **Workflows audited:** 88 workflow files in `.github/workflows/`
- **App:** Zion Tech Group – AI & IT Solutions (Next.js 16 static export, ~458 pages)
- **Live site:** https://ziontechgroup.com

## Live App Snapshot (2026-03-08)

- **Homepage:** Hero, Advanced AI Services (8 cards), Core Services, Launch roadmap, ROI estimator, case studies, testimonials, trust metrics. CTAs to /contact, /solutions, /pricing, /ai-services.
- **Key routes:** /, /services, /solutions, /contact, /about, /blog, /pricing, /industries, /case-studies, /products, /ai-services, /consultation, /site-map.
- **Forms:** Contact flows use commercial@ziontechgroup.com (app/utils/seoConstants).
- **Features:** ROI snapshot, launch advisor, interactive planning, case study filters by industry.
- **Links (2026-03-08):** Live site link audit: 157 links, 0 broken; codebase broken-link fixer: 617 links, 0 broken. See automation/LIVE-APP-BROKEN-LINKS-MISSING-PAGES-AUDIT-2026-03-08.md.

## Workflow Categories

| Category | Examples | Schedule / Trigger |
|----------|----------|---------------------|
| **CI/CD** | ci-cd.yml, deploy-on-push.yml, deploy-preflight.yml | push/PR, workflow_run, workflow_dispatch |
| **App evolution** | ai-app-visit-audit-implement-deploy.yml, ai-app-evolution-audit.yml | Wed 12 UTC, Sat 14 UTC, workflow_dispatch |
| **Content** | ai-content-ideas-deploy, ai-ultra-fast-content, ai-weekly-content-seo-hygiene | 3–6x daily, Mon 06 UTC |
| **Links & nav** | ai-broken-link-fixer.yml, ai-navigation-audit-fix.yml, ai-site-link-audit-automation.yml, **ai-weekly-live-link-audit.yml**, **ai-weekly-live-navigation-audit.yml**, **ai-broken-link-page-automation.yml** (fix + create pages + commit on create_pages) | Mon/Thu 06:30, Tue/Fri 07–08, **Thu 9**, **Fri 10**, Wed/Sat, manual |
| **Live app auto-fix** | **ai-weekly-live-app-audit-auto-fix.yml** | **Sat 9 UTC** (audit + **automation ideas** + **evolution ideas** + live nav + layout + SEO + fix + commit + deploy) |
| **Automation ideas from live** | **ai-weekly-automation-ideas-from-live-audit.yml** | **Sun 8 UTC** (UX + link + nav audits → merge automation ideas to backlog, commit) |
| **Quality & health** | production-health-monitor.yml, lighthouse-production.yml, ai-production-deploy-validation.yml, production-smoke-test.yml | 6h, Sun 12 UTC, after deploy |
| **Audit & improvement** | ai-github-actions-audit.yml, ai-automation-audit.yml, ai-automation-improvements.yml | Sun 9 UTC, Sat 11 UTC, Wed 10 UTC |
| **Security & deps** | ai-weekly-security-audit.yml, dependency-review.yml, codeql-analysis.yml | Weekly, PR |
| **Accessibility** | ai-accessibility-audit.yml, ai-live-accessibility-audit.yml | Tue 8 UTC (build), Thu 7 UTC (live) |
| **Live site audits** | ai-live-ux-audit.yml, ai-live-app-audit.yml | Tue 7 UTC (UX), Fri 8 UTC (live app) |
| **Live content (new)** | **ai-live-content-ideas-daily.yml**, **ai-content-max-velocity-deploy.yml**, **ai-content-ideas-and-evolution-deploy.yml**, **ai-content-burst-ultra.yml** | **Daily 6 UTC (live daily)**; **5x daily 3/9/12/18/21 UTC (max velocity)**; **2x daily 8/20 UTC (ideas + evolution)**; **4x daily 0/5/11/17 UTC (burst ultra)** |
| **Front page services** | **ai-front-page-services-content.yml** (Core Services sync, **Advanced AI sync**, promote apps) | **Tue 7 UTC, Fri 7 UTC**, workflow_dispatch |

## Re-audit (2026-03-08)

- **ai-weekly-live-app-audit-auto-fix.yml:** Netlify deploy step now uses `curl -sS -X POST -d {}` for build hook (consistent with deploy-on-push).
- **ai-github-actions-audit.yml:** Added Netlify deploy trigger after audit when schedule or auto_commit; switched to `node-version-file: '.nvmrc'`.

## New Automations Implemented (This Audit)

1. **ai-weekly-live-link-audit.yml** – Weekly live site link audit (Thu 9 UTC). Runs `site:links:audit` against production, uploads artifact; creates/updates issue if broken links exceed threshold (default 5). Uses `actions/github-script` for issue create/comment; report path fixed for Node require.
2. **ai-weekly-live-navigation-audit.yml** – Weekly live navigation audit (Fri 10 UTC). Crawls production nav/footer pages, extracts internal links, compares to nav constants and local routes (including dynamic /blog/[slug]); uploads `live-navigation-audit-latest.json`. Script: `automation/ai-live-navigation-audit.cjs` (npm run nav:live-audit). **ai-live-nav-sync-suggestions.cjs** (npm run nav:sync-suggestions) reads that report and writes `live-nav-sync-suggestions-latest.json` for nav constant sync ideas. No auto-fix.
3. **ai-weekly-live-app-audit-auto-fix.yml** – Weekly automated fix run (Sat 9 UTC). Runs live UX audit, merge live UX ideas to backlog, automation ideas from live audit, evolution ideas from audits, live nav audit, site link audit, broken-link fixer, create missing pages (live/codebase), UX auto-fix, layout audit + apply, SEO meta audit; commits and pushes to main; triggers Netlify deploy. Complements ai-live-app-audit (Fri, manual apply_fix/auto_commit).
4. **merge-live-app-ideas-to-backlog.cjs** – Merges `live-site-ux-audit-latest.json` ideas (from failed checks) into `app-evolution-backlog.json` as implementationTasks with source `live_site_ux_audit`. Used in evolution pipeline and weekly auto-fix.
5. **ci-cd.yml** – Uses `node-version-file: '.nvmrc'` for consistency with deploy-on-push and other workflows; single source of truth for Node version.

## Live Content Velocity (2026-03-08)

6. **ai-live-content-ideas-daily.yml** – Daily at 6 UTC: ideation (live site) + content audit ideas (live site) + content burst + homepage sync → build → commit + push + deploy. Complements ai-live-content-ideas (Mon/Wed/Fri 5 UTC).
7. **ai-content-max-velocity-deploy.yml** – 5x daily (3, 9, 12, 18, 21 UTC): content ideas to deploy pipeline (ideation + audit ideas + front page + burst) with AUTO_COMMIT=1 and TRIGGER_DEPLOY=1 → build → fallback commit + push + deploy. Same concurrency group `content-commit`. See automation/LIVE-SITE-CONTENT-AUDIT-2026-03-08.md.
8. **ai-content-ideas-and-evolution-deploy.yml** – 2x daily (8, 20 UTC): ideation + content audit ideas + automation-ideas-from-live-audit + evolution-ideas-from-audits + front page expansion + content burst + homepage sync → build → commit + push + deploy. Feeds live-app and evolution backlog into content. Concurrency: content-commit.
9. **ai-content-burst-ultra.yml** – 4x daily (0, 5, 11, 17 UTC): burst-only (template blog, case studies, industry pages), no LLM; commit + push + deploy. Concurrency: content-commit. See automation/LIVE-APP-CONTENT-AUTOMATION-AUDIT-2026-03-08.md.

## Recommendations (Future)

- Consider consolidating overlapping content-velocity workflows to reduce CI load.
- Keep production-health-monitor (6h), core-web-vitals (12h), and deploy validation as-is; they provide good coverage.
- Ensure OPENROUTER_API_KEY and NETLIFY_BUILD_HOOK are set in repo secrets for full automation.

## Secrets / Env

- `OPENROUTER_API_KEY` – evolution, content, audit agents
- `NETLIFY_BUILD_HOOK` – deploy triggers
- `GITHUB_TOKEN` / `GH_TOKEN` – for bot commits/push (write contents)

## References

- `automation/LIVE-APP-LAYOUT-DESIGN-AUDIT-2026-03-08.md` – Live app layout & design audit and layout automation integration
- `automation/LIVE-APP-BROKEN-LINKS-MISSING-PAGES-AUDIT-2026-03-08.md` – Live app broken links & missing pages audit (links + create-pages automations)
- `automation/LIVE-APP-AUTOMATION-AUDIT-2026-03-08-FULL.md` – Full live app automation audit (layout ideas → backlog, SEO in weekly auto-fix)
- `automation/LIVE-APP-CONTENT-AUTOMATION-AUDIT-2026-03-08.md` – Content automation audit (ideas + evolution deploy, burst ultra)
- `automation/ai-github-actions-audit-agent.cjs` – Workflow + app audit (OpenRouter)
- `automation/ai-github-actions-implementation-agent.cjs` – Applies workflow improvements from suggestions
- `automation/merge-github-actions-app-ideas-to-backlog.cjs` – Merges app automation ideas into evolution backlog
- `automation/merge-live-app-ideas-to-backlog.cjs` – Merges live UX audit ideas into evolution backlog
- `automation/ai-automation-ideas-from-live-audit.cjs` – Generates automation improvement ideas from live-audit reports, merges into evolution backlog
- `README.md` – Quick start, quality checks, automation overview

---

*Generated from GitHub Actions and live app audit. Update when adding or changing workflows.*
