# Live App Layout & Design Automation Audit – 2026-03-08

Audit of https://ziontechgroup.com for layout and design, with automations to improve the app. Live site visited 2026-03-08.

## Live site layout snapshot

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Structure:** Hero, momentum signals, Advanced AI strip, Advanced AI Services (10 cards), Core Services (14 cards), Launch roadmap, ROI estimator, Launch advisor, testimonials, trust metrics, case studies, solution pillars, industry solutions (~47 verticals), innovation bundles, Solution Finder, delivery timeline, FAQ, trust & security, technology partners, engagement models, CTA strip

### Layout & design observations

1. **Hero:** Single H1, subtext, three CTAs (Start a Project, Explore Solutions, View Pricing) + anchor to Advanced AI. Momentum bullets (go-live, risk, KPI). Dense but scannable.
2. **Sections:** Long page with many repeated card patterns (Advanced AI, Core Services, Core Engineering Services). Consistent “Learn more →” pattern.
3. **Visual hierarchy:** Headings (h2) per section; card grids with emoji + title + short copy. “Most advanced AI solutions” strip above Advanced AI adds clarity.
4. **Navigation:** Skip links (main content, nav, footer). Nav/footer link density is high; no obvious layout issues from crawl.
5. **Trust:** Enterprise stats (500+ deployments, 99.9% uptime, etc.), testimonials, case study filters, trust badges (SOC 2, ISO 27001, GDPR, HIPAA).
6. **Forms:** ROI snapshot, Launch advisor (objective + timeline), contact CTAs. No layout issues identified from content audit.

### Improvement opportunities (for automations)

| Area | Opportunity | Automation |
|------|-------------|------------|
| Section spacing | Standardize vertical rhythm between sections | Layout implementation agent (section token); Tailwind `section` spacing |
| Font loading | Reduce FOUT; ensure `display: 'swap'` on Inter | Layout implementation agent (font-display) |
| Shadow/performance | Simplify heavy shadow utilities on nav/buttons | Layout implementation agent (shadow simplify) |
| Above-the-fold | Ensure hero + first CTA strip are above fold on mobile | Live UX audit (viewport/heuristic); layout audit |
| Card density | Long homepage; consider fold breaks or “load more” for very long lists | Layout audit suggestions → evolution backlog |
| Consistency | Align card layout (icon, title, description, CTA) across Advanced AI and Core Services | Layout design audit (LLM) → suggestions |

## Existing layout & design automations

| Automation | Schedule / trigger | Purpose |
|------------|--------------------|--------|
| **ai-layout-design-audit.yml** | Sat 12 UTC, workflow_dispatch | Layout audit (live HTML + codebase) → report; optional apply |
| **ai-layout-design-automation.yml** | Tue 10 UTC, Fri 11 UTC, workflow_dispatch | Full pipeline: UX audit + layout audit + implementation; optional commit/deploy |
| **ai-layout-design-automation-weekly.yml** | Fri 11 UTC, workflow_dispatch | Full pipeline with AUTO_COMMIT=1; push to main |
| **ai-layout-improvement.yml** | Tue 14 UTC, workflow_dispatch | Layout improvement agent (prioritized improvements, optional push) |
| **ai-live-site-ux-audit-agent.cjs** | Used by evolution, weekly auto-fix, layout pipeline | Heuristic UX/SEO checks (meta, og:image, viewport, h1, CTAs) |
| **ai-layout-design-audit-agent.cjs** | layout:audit | LLM audit of layout/design; outputs layout-design-audit-latest.json |
| **ai-layout-design-implementation-agent.cjs** | layout:audit-apply | Applies safe fixes: font-display, section spacing, shadow simplify |
| **ai-layout-design-automation-pipeline-full.cjs** | layout:automation | Orchestrates UX audit → layout audit → implementation → optional commit/deploy |

## New automations (this audit)

### 1. Integrate layout design into weekly live app auto-fix

- **Goal:** So that the Saturday “live app audit + auto-fix” run also improves layout and design, not only UX and links.
- **Change:** In **ai-weekly-live-app-audit-auto-fix.yml**, after “Live Site UX Auto-Fix”, add:
  - **Layout Design Audit** (npm run layout:audit, continue-on-error)
  - **Layout Design Apply** (layout:audit-apply, continue-on-error)
- **Effect:** One weekly job covers: UX audit → merge ideas → link audit → broken-link fix → create missing pages → UX auto-fix → **layout audit → layout apply** → commit & push → deploy.
- **Report artifacts:** Include `layout-design-audit-latest.json` and `layout-design-implementation-latest.json` in the workflow’s upload-artifact step.

### 2. Layout design audit report in automation ideas

- **Goal:** Feed layout audit suggestions into the evolution backlog so they can be picked up by evolution apply or future sprints.
- **Option (future):** In `ai-automation-ideas-from-live-audit.cjs` or a new merge script, read `layout-design-audit-latest.json` and add high-priority layout/design tasks to `app-evolution-backlog.json` with source `layout_design_audit`. Not implemented in this audit; can be added in a follow-up.

## Implemented in this audit

1. **ai-weekly-live-app-audit-auto-fix.yml** – After “Live Site UX Auto-Fix”, added steps:
   - Run layout design audit (`npm run layout:audit`), continue-on-error.
   - Run layout design apply (`npm run layout:audit-apply`), continue-on-error.
   - Upload `layout-design-audit-latest.json` and `layout-design-implementation-latest.json` in the audit reports artifact.

2. **automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md** – Updated to document that the weekly live app auto-fix now includes layout design audit and apply; added reference to this layout/design audit doc.

## References

- `automation/LIVE-APP-AUTOMATION-AUDIT-2026-03-08.md` – Live app automation ideas and merge-live-app-ideas
- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow index and secrets
- `automation/ai-layout-design-audit-agent.cjs` – Layout audit (LLM)
- `automation/ai-layout-design-implementation-agent.cjs` – Safe layout fixes
- `automation/ai-layout-design-automation-pipeline-full.cjs` – Full layout pipeline
