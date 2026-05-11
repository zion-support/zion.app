# Live App & Automation Audit – 2026-03-08

Audit of https://ziontechgroup.com and the automation stack to fix and improve automations. Implemented changes are committed and pushed to main.

## Live site (from fetch)

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Sections:** Hero, Advanced AI Services, Core Services, Launch roadmap, ROI estimator, case studies, testimonials, trust metrics
- **CTAs:** /contact, /solutions, /pricing, /ai-services, /site-map

## Fixes implemented

### 1. Broken-link fixer: skip anchor-only links

- **Issue:** `#main-content`, `#site-navigation`, `#site-footer` were extracted, sent to external validation (which fails for fragment-only URLs), and recorded in `external-link-history.json` as repeated failures.
- **Fix:** In `ai-broken-link-fixer.cjs`:
  - During link extraction, filter out anchor-only, mailto, tel, javascript, and data URLs so they are never validated or reported as broken.
  - When writing external-link history, only record real external URLs (http/https or other `://`); do not record fragment-only or mailto/tel.
- **Data:** Cleaned `automation/data/external-link-history.json` to remove `#main-content`, `#site-navigation`, `#site-footer` entries. Left font URLs (fonts.googleapis.com, fonts.gstatic.com) as they are real external links; they are allowlisted in the fixer so not flagged as broken.

### 2. Site-link-audit report shape

- **Issue:** Live app audit report expected `internalLinks` and `pagesChecked` from site-link-audit; report was using fallbacks.
- **Fix:** In `ai-site-link-audit-automation.cjs`, add `internalLinks: links.length` and `pagesChecked: CONFIG.crawlPaths.length` to the result so the weekly live link audit and live app audit report have consistent data.

### 3. AI Live App Audit: add SEO meta step

- **New:** In `.github/workflows/ai-live-app-audit.yml`:
  - Added step "SEO meta audit (quick)" that runs `node automation/ai-seo-meta-auditor.cjs audit` (non-blocking: `|| true`).
  - Extended the "Write live app audit report" step to include `seo` summary: `pagesAudited`, `issuesCount`, `avgScore` from `seo-meta-report.json`.
  - Included `automation/reports/seo-meta-report.json` in the uploaded artifacts.

## Automation summary (unchanged)

- **Weekly Live Link Audit:** Thu 9 UTC; runs `npm run site:links:audit`, parses `site-link-audit-latest.json` (`broken`, `totalLinks`), creates/updates issue if broken ≥ threshold.
- **AI Live App Audit:** Fri 8 UTC; UX audit + site link audit + SEO meta audit → `live-app-audit-latest.json`; optional apply_fix (broken link + UX auto-fix) and auto_commit.
- **Broken Link Fixer:** Mon/Thu 6:30 UTC, push to app/src; codebase scan + internal/external validation; auto-fix internal links; push to main.

## Secrets / env

- `OPENROUTER_API_KEY` – evolution, content, audit, create-pages
- `NETLIFY_BUILD_HOOK` – deploy triggers
- `GH_TOKEN` / `GITHUB_TOKEN` – broken link fixer push

---

*Generated from live app and automation audit. Update when changing live-app or link-audit automations.*
