# Live App Content Automation Audit (2026-03-08)

Audit of https://ziontechgroup.com to design and implement automations that create and deploy new content and ideas as fast as possible. Live site visited 2026-03-08.

## Live site snapshot

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Sections:** Hero, Advanced AI Services (10 cards), Core Services, Launch roadmap (4 apps), ROI estimator, Launch advisor, case studies, testimonials, trust metrics, solution pillars, industry solutions
- **Content types:** Blog, case studies (industry-filtered), industry solution pages (~40+ verticals), AI service pages, product pages, pricing, consultation
- **CTAs:** /contact, /solutions, /pricing, /ai-services, /site-map

## Goals

1. **More content automatically** – Increase frequency of template-based content (blog, case studies, industry pages) and ensure every content run that produces changes triggers a deploy.
2. **New ideas → implementation faster** – Feed live-audit and evolution ideas into content pipelines; run evolution-ideas and backlog-implement in weekly or daily flows.
3. **Deploy on every content change** – All content workflows that commit should trigger Netlify deploy (already in place for most; ensure max-velocity and burst-only paths set AUTO_COMMIT/TRIGGER_DEPLOY correctly).

## Existing content automations (reference)

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| ai-content-max-velocity-deploy | 5x daily (3,9,12,18,21 UTC) | Ideation + audit ideas + front page + burst → build → commit + deploy |
| ai-live-content-ideas-daily | Daily 6 UTC | Ideation + content audit ideas + burst → build → commit + deploy |
| ai-content-burst-high-frequency | 8x daily (1,4,7,10,13,16,19,22 UTC) | Template burst only; commit + deploy |
| ai-content-ideas-deploy | 3x daily (9,14,19 UTC) | Ideas to deploy pipeline; commit + deploy |
| ai-ultra-fast-content | 6x daily | Phase 0–2 full pipeline; content-commit |
| ai-front-page-services-content | Tue/Fri 7 UTC | Core + Advanced AI sync, promote apps; content-commit |
| ai-weekly-live-app-audit-auto-fix | Sat 9 UTC | UX + link + nav + layout + SEO + fix → commit + deploy |

## New automations implemented (this audit)

1. **Max-velocity workflow: AUTO_COMMIT + TRIGGER_DEPLOY** – The workflow already does its own git commit step; the pipeline script is run without AUTO_COMMIT so it doesn’t double-commit. No change needed for pipeline; ensure workflow step always commits and triggers deploy when there are changes (already correct). Optional: pass AUTO_COMMIT=1 TRIGGER_DEPLOY=1 to pipeline so a single code path handles commit (reduces drift). Implemented: workflow explicitly sets AUTO_COMMIT=1 and TRIGGER_DEPLOY=1 for the pipeline so the pipeline can commit when it generates content; workflow’s “Commit, push, and deploy” step remains as fallback when pipeline doesn’t commit (e.g. no changes).

2. **Content ideas + evolution ideas pipeline** – New script or workflow that runs: (a) content ideation + content audit ideas (live site), (b) evolution ideas from audits / automation ideas from live audit, (c) content burst. Then build, commit, deploy. This ties “new ideas” from live app and evolution backlog into content creation. Implemented: **ai-content-ideas-and-evolution-deploy.yml** – 2x daily (8 UTC, 20 UTC); runs ideation, content audit ideas, automation-ideas-from-live-audit, evolution-ideas-from-audits (optional), content burst, homepage industry sync, build, commit + deploy. Uses content-commit concurrency.

3. **Burst-only “ultra” schedule** – Already have ai-content-burst-high-frequency 8x/day. Optional: add 2 more burst-only runs at different hours (e.g. 5 UTC, 11 UTC) for even faster template content. Implemented: **ai-content-burst-ultra.yml** – 4 extra runs at 0, 5, 11, 17 UTC; burst only, no LLM; commit + deploy. Same content-commit group. Total burst-only: 12 runs/day.

4. **Weekly auto-fix: run evolution ideas** – In ai-weekly-live-app-audit-auto-fix, after “Automation ideas from live audit”, add optional step to run evolution-ideas-from-audits and/or backlog-implement (small batch) so new ideas land in backlog and a few get applied the same day. Implemented: add step “Evolution ideas from audits” (optional, continue-on-error) after automation ideas; merges evolution ideas into backlog so Saturday run enriches backlog for next evolution run.

## Recommendations

- Keep `content-commit` concurrency so only one content-commit job runs at a time.
- Ensure `OPENROUTER_API_KEY` and `NETLIFY_BUILD_HOOK` are set in repo secrets.
- If CI load is high, consider reducing burst-ultra to 2 extra runs (e.g. 5 and 17 UTC only).

## References

- `automation/LIVE-SITE-CONTENT-AUDIT-2026-03-08.md` – Content audit and velocity
- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow index
- `automation/ai-content-ideas-to-deploy-pipeline.cjs` – Ideation + front page + burst
- `automation/ai-content-burst-agent.cjs` – Template blog, case studies, industry
- `automation/ai-automation-ideas-from-live-audit.cjs` – Live audit → backlog tasks
