# Live App Audit – ziontechgroup.com (2025-03-07)

Audit of https://ziontechgroup.com to drive automation fixes and new automation ideas. Complements `APP-VISIT-AUDIT-2025-03-07.md` and `GITHUB-ACTIONS-APP-AUDIT-2025-03-07.md`.

## Live site snapshot (homepage)

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Sections:** Hero, Advanced AI Services (8 cards), Core Services, Launch roadmap, ROI estimator, case studies, testimonials, trust metrics
- **Key CTAs:** /contact, /solutions, /pricing, /ai-services, /site-map
- **Forms/mailto:** commercial@ziontechgroup.com (seoConstants.ts)

## Automation improvements implemented (this audit)

### 1. Evolution pipeline – remove duplicate evolution apply
- **Issue:** Phase 1.5 and Phase 2 both ran evolution automation with AUTO_APPLY=1, doubling runs and token usage.
- **Fix:** Removed the second evolution apply from Phase 2; only Phase 1.5 runs evolution backlog apply.

### 2. New workflow: AI Live App Audit (optional fixes)
- **Purpose:** Single workflow that fetches key live pages, runs UX + link + content checks, writes an audit report, and optionally runs safe fix agents (broken links, UX auto-fix) and commits.
- **Schedule:** Weekly Friday 8 UTC + workflow_dispatch.
- **Artifacts:** live-app-audit-report (JSON + optional markdown).

### 3. Post-deploy: CWV in deploy validation
- **Current:** core-web-vitals-monitor runs every 12h; lighthouse-production weekly.
- **Improvement:** Production deploy validation workflow runs a quick CWV check (homepage only, Lighthouse) after deploy and appends to step summary, so every deploy has a performance signal.

### 4. Pages to visit
- **Verified:** `/site-map` is in production-health-monitor and deploy validation; `pages-to-visit.json` includes `/site-map` in auditOnly. No change needed.

### 5. Documentation
- **README:** New row for "AI Live App Audit" in Visit → Audit table; note evolution pipeline fix.
- **This file:** Single reference for live-app audit and automation improvements from this run.

## Secrets / env

- `OPENROUTER_API_KEY` – evolution, content, audit agents
- `NETLIFY_BUILD_HOOK` – deploy triggers
- `GH_TOKEN` or `GITHUB_TOKEN` – broken link fixer push

---

*Generated from live app audit. Update when adding or changing live-app automations.*
