# Live App Automation Audit – 2026-03-08

Audit of https://ziontechgroup.com to identify and implement new automations that drive app improvement and evolution. Live site visited 2026-03-08.

## Live site snapshot

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Sections:** Hero, Advanced AI Services (10 cards), Core Services, Launch roadmap, ROI estimator, Launch advisor, case studies, testimonials, trust metrics, solution pillars, industry solutions
- **CTAs:** /contact, /solutions, /pricing, /ai-services, /site-map
- **Content:** Blog, case studies (industry-filtered), industry solution pages (~40+ verticals), AI service pages, product pages, pricing, consultation

## New automation ideas (from this audit)

### 1. Automation ideas from live audit → backlog

- **Goal:** Turn live-site audit outputs (UX, link, nav, content) into concrete automation improvement ideas and merge into evolution backlog.
- **Implementation:** `ai-automation-ideas-from-live-audit.cjs` – reads latest reports (live-site-ux, site-link-audit, live-navigation, content-audit-ideas), generates automation improvement tasks (e.g. "Run UX audit daily", "Add broken-link threshold to weekly"), dedupes, merges into `app-evolution-backlog.json` with source `live_audit_automation_ideas`.
- **Workflow:** `ai-weekly-automation-ideas-from-live-audit.yml` – Sun 8 UTC; runs live UX audit, site link audit, nav audit (or uses cached reports), runs automation-ideas script, merges to backlog; optional commit when backlog updated.

### 2. Evolution pipeline: ensure automation-ideas run before apply

- **Goal:** So that evolution backlog is fed by live-audit automation ideas weekly, the evolution audit pipeline already runs live UX audit and merge-live-app-ideas; we add an optional step to run automation-ideas-from-live-audit after Phase 0 so new automation ideas land in backlog before Phase 1.5 (AUTO_APPLY).
- **Change:** In `ai-app-evolution-audit-pipeline.cjs`, after merge-live-app-ideas, run `ai-automation-ideas-from-live-audit.cjs` when `SKIP_AUTOMATION_IDEAS=0` (default).

### 3. Single “app improvement and evolution” weekly workflow

- **Goal:** One workflow that: (1) audits live app (UX + links + nav), (2) merges all ideas into backlog (UX + automation ideas), (3) runs evolution apply, (4) runs content/improvements, (5) commits and deploys. Reduces overlap with ai-weekly-live-app-audit-auto-fix and ai-app-visit-audit-implement-deploy.
- **Implementation:** Reuse/align with existing **ai-weekly-live-app-audit-auto-fix.yml** (Sat 9 UTC) and **ai-app-visit-audit-implement-deploy.yml** (Wed 12 UTC, Sat 14 UTC). Add automation-ideas-from-live-audit step to weekly auto-fix so automation ideas are merged the same day as UX/link fixes.

## Implemented in this audit

1. **ai-automation-ideas-from-live-audit.cjs** – Reads `live-site-ux-audit-latest.json`, `site-link-audit-latest.json`, `live-navigation-audit-latest.json`, `content-audit-ideas-latest.json`; generates automation improvement tasks; merges into `app-evolution-backlog.json` with source `live_audit_automation_ideas`. npm script: `app:automation-ideas-from-live-audit`.
2. **ai-weekly-automation-ideas-from-live-audit.yml** – Sun 8 UTC; runs UX audit, site link audit, nav:live-audit (or skip if reports exist), then automation-ideas-from-live-audit; commits backlog when updated.
3. **ai-app-evolution-audit-pipeline.cjs** – After merge-live-app-ideas, runs ai-automation-ideas-from-live-audit.cjs (always when UX audit ran).
4. **ai-weekly-live-app-audit-auto-fix.yml** – Added step "Automation ideas from live audit" after "Merge live UX ideas into evolution backlog"; runs automation-ideas-from-live-audit so Saturday auto-fix also refreshes automation ideas in backlog.

## References

- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow index
- `automation/APP-AUTOMATION-AUDIT-2026-03-08.md` – Live app & automation fixes
- `automation/merge-live-app-ideas-to-backlog.cjs` – UX ideas → backlog
- `automation/merge-github-actions-app-ideas-to-backlog.cjs` – GitHub Actions ideas → backlog
- `automation/ai-automation-ideas-from-live-audit.cjs` – Automation ideas from live-audit reports → backlog
