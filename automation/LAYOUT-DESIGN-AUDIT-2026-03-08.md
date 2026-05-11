# Layout & Design Audit – ziontechgroup.com (2026-03-08)

Live site visited: https://ziontechgroup.com. This audit drives automations to improve app layout and design.

## Scope

- **Site:** Zion Tech Group | AI & IT Solutions (Next.js 16 static export, ~458 pages)
- **Audit date:** 2026-03-08
- **Focus:** Layout structure, responsive design, typography/spacing, visual hierarchy, CTAs, performance (CLS), and automation coverage

## Live Site Snapshot

### Homepage structure (observed)

- **Hero:** H1 "Design, Launch, and Scale AI Operations With Confidence"; subline; CTAs (Start a Project, Explore Solutions, View Pricing, Advanced AI Services)
- **Trust bullets:** Faster go-live, lower risk, clear KPI tracking
- **Launch roadmap:** 4 app cards (Chatbot, Support Pro, Email Assistant, Marketing Automation); app category counts
- **Advanced AI Services:** 8 cards (Generative AI, Agents, RAG, Copilots, Multimodal, Governance, Observability, etc.)
- **Core Services:** Grid of service cards (AI/ML, Web, Cloud, Security, Data, DevOps, Talent, Micro-SaaS, Blockchain, Consulting, IoT, Data Engineering, API, Mobile)
- **Trust metrics:** 500+ deployments, 99.9% uptime, &lt;48h kickoff, 3.2x ROI, 76+ apps, 43 verticals
- **ROI estimator:** Sliders and snapshot handoff
- **Launch advisor:** Objective + timeline → recommended path
- **Testimonials:** 6 quote cards
- **Case studies:** Many industry cards with filters
- **Solution pillars:** 5 paths (Advanced AI, App Suite, Engineering, Security, Scale-Ready)
- **Industry solutions:** Long list of verticals with cards
- **Footer:** Skip links, sitemap-style links, CTAs (Explore Services, Learn About Zion, Start a Project)

### Layout & design observations

| Area | Observation | Automation / fix |
|------|-------------|-------------------|
| **Typography** | Consistent headings and body; design tokens help. | Layout implementation agent adds `--font-size-*`, `--line-height-*` in `globals.css` when missing. |
| **Spacing** | Sections use varied padding. | Layout implementation adds `section: 4rem` in Tailwind when missing. |
| **Font loading** | Inter used; FOUT risk if no swap. | Layout implementation adds `display: 'swap'` to Inter in `app/layout.tsx`. |
| **Images** | Many cards/icons; CLS risk. | Layout implementation adds `aspect-ratio` in `globals.css` for images when missing. |
| **Navigation** | Complex shadow on active state. | Layout implementation simplifies to `shadow-lg` in `Navigation.tsx` when applicable. |
| **Containers** | Long pages; consistent container padding improves scan. | Layout audit (LLM/heuristic) suggests standardizing `px-4 sm:px-6 lg:px-8`. |
| **Responsive** | Content is dense on mobile; cards and grids need breakpoints. | Layout audit agent checks responsive patterns; improvement agent can apply fixes. |
| **CTAs** | Clear primary/secondary CTAs across hero, sections, footer. | UX audit checks CTA presence; layout audit can suggest hierarchy/contrast. |

## Automations that improve layout and design

### 1. Existing agents (unchanged)

- **`ai-layout-design-audit-agent.cjs`** – Fetches live HTML, analyzes layout/typography/spacing/a11y/performance; outputs `layout-design-audit-latest.json`. Run: `npm run layout:audit`.
- **`ai-layout-design-implementation-agent.cjs`** – Applies safe fixes from audit: font display swap, section spacing, typography scale, image aspect-ratio, simplified nav shadow. Run: `npm run layout:audit-apply`.
- **`ai-layout-design-automation-pipeline-full.cjs`** – Full pipeline: Live Site UX Audit → Layout Design Audit → Layout Implementation → optional commit & deploy. Run: `npm run layout:automation`, `npm run layout:automation-commit`, `npm run layout:automation-deploy`.
- **`ai-live-site-ux-audit-agent.cjs`** – Heuristic UX checks (meta, viewport, H1, CTAs, links). Feeds into layout audit context.
- **`ai-live-site-ux-auto-fix-agent.cjs`** – Applies meta/title fixes from UX audit.

### 2. GitHub Actions workflows

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| **ai-layout-design-audit.yml** | Sat 12:00 UTC, manual | Run layout audit + apply; upload report artifact (no push). |
| **ai-layout-improvement.yml** | Tue 14:00 UTC, manual | Run AI Layout Improvement Agent; commit and push to main when there are changes. |
| **ai-layout-design-automation-weekly.yml** (new) | Fri 11:00 UTC, manual | Run full layout pipeline (UX audit + layout audit + apply) with auto-commit and push to main. |

### 3. New automation: weekly layout design automation (commit + push)

- **File:** `.github/workflows/ai-layout-design-automation-weekly.yml`
- **Purpose:** Improve app layout and design continuously by running the full pipeline and merging safe changes to main.
- **Steps:** Checkout (write) → Setup Node (.nvmrc) → Install deps → Run `AUTO_COMMIT=1 npm run layout:automation` → Push to main.
- **Concurrency:** Single run at a time for this group.
- **Secrets:** Uses `GITHUB_TOKEN` (or `GH_TOKEN`) for push.

## Recommendations

1. **Run layout automation weekly** – Schedule or trigger `ai-layout-design-automation-weekly` so UX + layout fixes are applied and merged regularly.
2. **Keep OPENROUTER_API_KEY set** – Enables LLM-powered layout audit when available; fallback is heuristic-only.
3. **Review layout-design-audit-latest.json** – After each run, check suggestions for manual follow-up (e.g. container padding consistency across many components).
4. **Use .nvmrc in all layout workflows** – Single source of truth for Node version (e.g. 20).

## References

- `automation/ai-layout-design-audit-agent.cjs` – Layout audit
- `automation/ai-layout-design-implementation-agent.cjs` – Apply safe layout fixes
- `automation/ai-layout-design-automation-pipeline-full.cjs` – Full pipeline
- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow audit
- `README.md` – Quick start and quality checks

---

*Generated from live site audit 2026-03-08. Update when adding or changing layout/design automations.*
