# App Content Audit – ziontechgroup.com (2025-03-07)

Audit of https://ziontechgroup.com to design automations that create more content automatically and as fast as possible. Live site fetched and analyzed 2025-03-07.

## Site overview (from live fetch)

- **Product:** Zion Tech Group – AI & IT Solutions
- **Tagline:** Design, Launch, and Scale AI Operations With Confidence
- **Key sections:** Hero with CTAs, Advanced AI Services (8 cards), Core Services (14+), Launch roadmap, ROI estimator, case studies (40+ industry angles), testimonials, solution pillars, industry solutions (30+ verticals), innovation bundles, FAQ, trust metrics, partners

## Content types already automated

| Type | Agent / pipeline | Notes |
|------|------------------|--------|
| Blog | openrouter-content-generator.cjs, ai-template-blog-creator-agent.cjs | LLM + template (no LLM) |
| Case studies | ai-template-case-study-creator-agent.cjs | Template-only, many industries |
| Industry solution pages | ai-industry-solution-discovery-agent.cjs + ai-industry-solution-auto-creator-agent.cjs | Template-based |
| Product pages | ai-zion-product-page-creator-agent.cjs | LLM |
| Front page expansion | ai-front-page-content-expansion-agent.cjs, ai-front-page-services-advertiser-agent.cjs | LLM |
| Evolution ideas | ai-app-evolution-ideas-agent.cjs | Live site + LLM |
| Content audit ideas | ai-content-audit-ideas-agent.cjs | Fetches live pages, LLM suggests blog/industry/case study ideas |

## Existing content workflows (schedule)

| Workflow | Schedule | Content produced |
|----------|----------|-------------------|
| AI Ultra-Fast Content | 6x daily (4/8/12/16/20/22 UTC) | Industry + template blog/case studies + ideation + blog + front page + products |
| AI Content Maximum Velocity | 1x daily (10 UTC) | Same pipeline, elevated limits |
| AI Content Ideas to Deploy | 3x daily (9/14/19 UTC) | Ideation + front page + template burst |
| AI Ideas to Implementation | 4x daily (4/8/12/16 UTC) | Ideation + blog + front page + product pages |
| App Visit Audit Implement Deploy | Wed 12 UTC, Sat 14 UTC | Full evolution pipeline + content |

## Gaps and opportunities

1. **Template-only content at higher frequency** – Template blog, template case studies, and industry auto-create require no LLM. Running them more often (e.g. 8x daily) increases content volume without extra API cost.
2. **Live-site-driven ideas → content** – Content-audit-ideas already fetches live site and outputs blog/industry/case study ideas. Running it on a schedule and then feeding that report into the blog/industry generators (e.g. ultra-fast with IDEATION_REPORT_PATH) ties new content to live-site gaps.
3. **Concurrency** – All content workflows use `concurrency: content-commit` so only one commits at a time; adding more scheduled runs increases throughput by filling more time slots.

## New automations implemented (this audit)

1. **AI Content Burst High Frequency** (`.github/workflows/ai-content-burst-high-frequency.yml`)
   - Runs content burst (template blog + case studies + industry + services advertiser + optional product pages) **8x daily** at 1, 4, 7, 10, 13, 16, 19, 22 UTC.
   - Moderate limits per run: template blog 4, case studies 4, industry 2, product 1.
   - Commit + push to main + Netlify deploy. Uses same concurrency group as other content workflows.

2. **AI Live Content Ideas** (`.github/workflows/ai-live-content-ideas.yml`)
   - **Live-site-driven content:** Runs content-audit-ideas (fetches ziontechgroup.com key pages, LLM suggests ideas), then ultra-fast pipeline with ideation report so blog/topics come from live site gaps.
   - Schedule: Mon/Wed/Fri 5 UTC; workflow_dispatch.
   - Uploads content-audit-ideas report as artifact. Commit + push + deploy.

## Secrets / env

- `OPENROUTER_API_KEY` – content-audit-ideas, blog, front page, product creators
- `NETLIFY_BUILD_HOOK` – deploy after push

---

*Generated from live app visit for content automation design. Update this file when adding or changing content automations.*
