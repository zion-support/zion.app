# App Layout & Design Audit – ziontechgroup.com (2025-03-07)

Audit of https://ziontechgroup.com to drive automations that improve app layout and design. Live site fetched and analyzed 2025-03-07.

## Site overview (from live fetch)

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Structure:** Skip links (main content, navigation, footer), hero with CTAs, value bullets, Advanced AI Services (8 cards), Core Services (14+), Launch roadmap, ROI estimator, testimonials, case studies, solution pillars, industry solutions, innovation bundles, FAQ, trust & security, partners, engagement models

## Layout & design findings

### Strengths
- Clear visual hierarchy: hero → value props → Advanced AI → Core Services → social proof → solutions
- Skip links present for accessibility
- Consistent card pattern (icon, title, description, CTA) across Advanced AI and Core Services
- Trust metrics (500+ deployments, 99.9% uptime, etc.) and testimonials section
- Solution pillars and industry solutions provide multiple entry points
- FAQ and engagement models at bottom support conversion

### Areas for automation-driven improvement
1. **Section spacing and rhythm** – Long homepage; ensure consistent vertical rhythm (e.g. section padding/margins) via layout design implementation agent.
2. **Typography scale** – Heuristic audit checks for consistent heading scale (h1 → h2 → h3); implementation agent can apply design tokens.
3. **Container width** – Ensure max-width and padding are consistent for readability; layout audit suggests container/padding fixes.
4. **Image aspect ratio** – Prevent CLS; implementation agent applies aspect-ratio where applicable.
5. **Mobile-first** – Live UX audit checks viewport and mobile cues; layout pipeline runs UX audit first, then layout audit with that context.

### Automation pipeline (existing)

| Step | Agent / workflow | Purpose |
|------|------------------|---------|
| 0 | `ai-live-site-ux-audit-agent.cjs` | Heuristic UX/SEO on live HTML (meta, viewport, h1, CTA, links) |
| 0b | `ai-live-site-ux-auto-fix-agent.cjs` | Apply meta/title fixes from UX audit |
| 1 | `ai-layout-design-audit-agent.cjs` | LLM or heuristic layout audit (loads UX report when present) |
| 2 | `ai-layout-design-implementation-agent.cjs` | Apply safe layout fixes (fonts, spacing, shadows, typography scale, aspect-ratio) |
| 3 | Git commit + push, optional Netlify deploy | Persist and ship improvements |

## Automations created / updated

### 1. Layout design automation (GitHub Actions)
- **Workflow:** `.github/workflows/ai-layout-design-automation.yml`
- **Schedule:** Tuesday 10 UTC, Friday 11 UTC (2x per week)
- **On schedule:** Runs full pipeline with `AUTO_COMMIT=1`; commits and pushes layout/UX improvements to main.
- **Manual:** `workflow_dispatch` with inputs: `auto_commit`, `trigger_deploy`, `skip_ux_audit`, `skip_layout_audit`.
- **Artifacts:** live-site-ux-audit-latest.json, layout-design-audit-latest.json, layout-design-implementation-latest.json, layout-design-automation-pipeline-latest.json (30-day retention).

### 2. PM2 (optional local/CI)
- **App:** `ai-layout-design-automation` in `ecosystem.config.cjs`
- **Cron:** Every 6 hours (configurable)
- **Scripts:** `npm run layout:automation`, `layout:automation-commit`, `layout:automation-deploy`, `layout:automation-start`, `layout:automation-stop`, `layout:automation-logs`

### 3. Integration with visit–audit–deploy
- **Evolution pipeline:** `ai-app-evolution-audit-pipeline.cjs` runs layout design implementation in Phase 2 (with UX/layout audit in Phase 0).
- **Visit intelligence:** `ai-app-visit-intelligence-orchestrator.cjs` can run UX and layout context; evolution implement applies improvements.

## Recommendations

1. **Keep 2x weekly schedule** – Tuesday and Friday runs ensure layout/design improvements are applied regularly without overwhelming commits.
2. **Review artifacts** – After each run, check uploaded artifacts for layout-design-audit suggestions and implementation summary.
3. **Heuristic fallback** – When OPENROUTER_API_KEY is unset, layout audit uses local heuristic (font display, section spacing, typography scale, image aspect-ratio, container padding); implementation still applies safe fixes.
4. **TRIGGER_DEPLOY** – For manual runs where you want an immediate deploy, set `trigger_deploy: true` and ensure `NETLIFY_BUILD_HOOK` is configured.

## Secrets / env

- `OPENROUTER_API_KEY` – LLM-powered layout audit (optional; heuristic used if unset)
- `NETLIFY_BUILD_HOOK` – Deploy after commit when `TRIGGER_DEPLOY=1`
- `LAYOUT_AUDIT_URL` – Override live URL (default: https://ziontechgroup.com)

---

*Generated from live app visit and existing layout automation. Update this file when adding or changing layout/design automations.*
