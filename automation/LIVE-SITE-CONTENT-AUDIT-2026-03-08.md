# Live Site Content Audit (2026-03-08)

Audit of https://ziontechgroup.com to drive automations that create and deploy new content as fast as possible.

## Site Snapshot (2026-03-08)

- **Homepage:** Hero, Advanced AI Services (8 cards), Core Services, Launch roadmap (4 apps), ROI estimator, Launch advisor, case studies, testimonials, trust metrics. CTAs: /contact, /solutions, /pricing, /ai-services.
- **Content types:** Blog, case studies (industry-filtered), industry solution pages (~40+ verticals), AI service pages, product (Zion AI app) pages, pricing, consultation.
- **Gaps / opportunities:**
  - More blog posts from live-site-driven ideation (ideation + audit ideas already exist; increase frequency).
  - More template-based content (blog, case studies, industry pages) without extra LLM cost — already covered by content burst and ultra-fast.
  - Ensure every content run that produces changes triggers a deploy (Netlify build hook).
  - Stagger content workflows to avoid overlapping commits; use concurrency group `content-commit`.

## Existing Content Automations (Summary)

| Workflow | Schedule | What it does |
|----------|----------|--------------|
| ai-content-burst-high-frequency | 8x/day (1,4,7,10,13,16,19,22 UTC) | Template blog + case studies + industry pages; commit + deploy |
| ai-ultra-fast-content | 6x/day (4,8,12,16,20,22 UTC) | Phase 0 (template) + Phase 1 (ideation + audit ideas + evolution) + Phase 2 (blog + front page + products); commit in workflow steps |
| ai-content-ideas-deploy | 3x/day (9,14,19 UTC) | Ideation + audit ideas + front page expansion + burst; build check; commit + deploy |
| ai-live-content-ideas | Mon/Wed/Fri 5 UTC | Content audit ideas (live) + ultra-fast pipeline; commit + deploy |

## New Automations Implemented (This Audit)

1. **ai-live-content-ideas-daily.yml** – Daily live-driven content: ideation + content audit ideas (both fetch live site) → content burst (template) → commit + deploy. Runs at 6 UTC daily (off-peak). Ensures at least one “live-site-informed” run every day in addition to Mon/Wed/Fri live-content-ideas.
2. **ai-content-max-velocity-deploy.yml** – Maximum content velocity with guaranteed deploy. Runs 5x daily (3, 9, 12, 18, 21 UTC). Single pipeline: ideation → audit ideas → front page expansion → content burst → build validation → commit + push + Netlify deploy. Uses same concurrency group as other content workflows.

## Recommendations

- Keep `content-commit` concurrency group so only one content-commit job runs at a time; others queue.
- Ensure `OPENROUTER_API_KEY` and `NETLIFY_BUILD_HOOK` are set in repo secrets for full automation.
- For even faster content without LLM: run content burst more often (already 8x/day); consider adding 2–3 more burst-only runs at different hours if CI capacity allows.

## References

- `automation/ai-content-ideation-agent.cjs` – Fetches live site, suggests blog/industry/case study ideas
- `automation/ai-content-audit-ideas-agent.cjs` – Gap analysis from live site
- `automation/ai-content-ideas-to-deploy-pipeline.cjs` – Ideation + front page + burst + deploy
- `automation/ai-content-burst-agent.cjs` – Template blog, case studies, industry pages
- `automation/ai-ultra-fast-content-pipeline.cjs` – Phase 0–2 full pipeline
- `GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow categories and references
