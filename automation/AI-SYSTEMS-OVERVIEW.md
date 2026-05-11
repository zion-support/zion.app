# 🤖 AI Systems Overview

Comprehensive overview of all autonomous AI systems in the Zion App.

Last Updated: March 5, 2026

## LLM Provider (Multi-Provider Chain)

All LLM-powered agents use a **multi-provider chain** (first available):
1. **Ollama** (local, free) — `npm run llm:install`
2. **Groq** (free tier, ultra-fast; Llama 3.3 70B optional) — `GROQ_API_KEY`
3. **Google Gemini** (free tier, 1.5k req/day; 2.5 Flash optional) — `GEMINI_API_KEY`
4. **Hugging Face** (300 req/hr free, 100k+ models) — `HUGGINGFACE_HUB_TOKEN`
5. **Cerebras** (1M tokens/day free) — `CEREBRAS_API_KEY`
6. **Cloudflare Workers AI** (10k Neurons/day) — `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN`
7. **DeepSeek** (5M tokens free) — `DEEPSEEK_API_KEY`
8. **Mistral AI** (free tier) — `MISTRAL_API_KEY`
9. **Together AI** (free research models) — `TOGETHER_API_KEY`
10. **Fireworks AI** (free trial: 10 RPM) — `FIREWORKS_API_KEY`
11. **Cohere** (1k req/month trial) — `COHERE_API_KEY`
12. **OpenRouter** — `OPENROUTER_API_KEY`

See `docs/FREE-AI-TOOLS.md`, `docs/LOCAL-LLM-SETUP.md`, and `docs/OPENROUTER-SETUP.md`

## Free Embeddings (Gemini primary, Hugging Face fallback)

**Google AI Studio (Gemini)** — 1,500 embedding requests/day free. **Hugging Face Inference** — 300 req/hr free (same token as LLM). Primary then fallback.

- **Path**: `automation/lib/embedding-client.cjs`
- **Usage**: `embed(text)`, `embedBatch(texts)`
- **Setup**: `GEMINI_API_KEY` and/or `HUGGINGFACE_HUB_TOKEN` in `.env`
- **Test**: `npm run embedding:test`

## Voice & Speech (Web Speech API)

**Browser-native** — Free, no API key. Chrome, Edge, Safari.

- **Voice input**: Mic button in AI Chat Widget (speech-to-text)
- **Text-to-speech**: Speaker toggle to have AI read replies aloud

## Free Image Generation

**Pollinations.ai** — Free AI image generation. Free API key at [enter.pollinations.ai](https://enter.pollinations.ai).

- **Path**: `automation/lib/image-gen-client.cjs`
- **Usage**: `generateImage(prompt)`, `getImageUrl(prompt)`
- **Setup**: `POLLINATIONS_API_KEY` in `.env`
- **Test**: `npm run image:generate "prompt"` — saves `out-pollinations-test.png`

**Replicate** — Free FLUX, Imagen, Ideogram. Free at [replicate.com](https://replicate.com).

- **Path**: `automation/lib/replicate-image-client.cjs`
- **Usage**: `generateImage(prompt)`, `getImageUrl(prompt)`
- **Setup**: `REPLICATE_API_TOKEN` in `.env`
- **Test**: `npm run image:replicate "prompt"` — saves `out-replicate-test.png`

## AI Improvement Systems

### Openclaw Autonomous Improvement Stack
**Status**: Active | **Paths**:
- `automation/openclaw-autonomous-app-improver.cjs`
- `automation/openclaw-autonomous-guardian.cjs`
- `automation/config/openclaw-agent-skills.json`

**Description**: High-frequency Openclaw prompting loop with structured action extraction, strict auth contract preflight, per-worker freshness, and self-healing guardian restarts.

**Features**:
- Structured action telemetry (`actionsFound`, `severityCounts`, `parseFailures`)
- Contract hardening (`AUTH_OK` token verification)
- Guardian restarts on staleness, failure bursts, low-value cycle bursts, and worker freshness drift
- Auth/runtime diagnostic report (`openclaw-auth-runtime-diagnostic-latest.json`) for Node22/CLI/contract drift
- Build lock contention guard (`next-build-lock-guardian-latest.json`) for safer autonomous deploy cycles
- Action policy gate (`openclaw-action-policy-latest.json`) to allowlist safe Openclaw actions before PR routing
- Artifact freshness mesh (`artifact-freshness-mesh-latest.json`) to detect stale core reports and auto-dispatch source workflows
- PM2 + GitHub workflow integration for continuous operation and incident escalation

**Runs**:
- PM2 continuous processes: `openclaw-autonomous-prompts`, `openclaw-autonomous-guardian`
- GitHub workflows:
  - `.github/workflows/ai-openclaw-autonomous-cycle.yml`
  - `.github/workflows/ai-openclaw-freshness-sla.yml`
  - `.github/workflows/ai-openclaw-incident-escalator.yml`
  - `.github/workflows/ai-openclaw-auth-runtime-diagnostic.yml`

### AI Lab integrity guardian + PM2 duplicate process healer
**Status**: Active | **Paths**:
- `automation/ai-lab-integrity-guardian.cjs` — validates `ai-lab-tools.ts` vs `app/ai-lab/**/page.tsx`; optional auto-scaffold (AILabToolLayout), optional GitHub issue; **pages-to-visit backfill** into `automation/data/pages-to-visit.json` (`aiLab`).
- `automation/pm2-duplicate-process-healer.cjs` — singleton duplicate detection; reads **`automation/config/pm2-singleton-policy.json`** (override with `PM2_SINGLETON_APPS`); **skips auto-heal** while `automation/.deploy-in-progress.lock` exists (written by `commands/deploy.cjs`).
- `npm run validate:pm2-singleton-policy` — policy file validator.

**Reports**: `automation/reports/ai-lab-integrity-latest.json`, `automation/reports/pm2-duplicate-healer-latest.json`

**Follow-ons (2026-03-21)**:
- CI: `npm run validate:pm2-singleton-ecosystem` (policy names ⊆ `ecosystem.config.cjs` apps) in `ai-pm2-static-checks.yml`
- Integrity guardian: `AUTO_SMOKE_ROUTES_SYNC` regenerates `config/smoke-routes.txt` after route remediation
- Local deploy: optional `DEPLOY_PM2_DUPLICATE_RECONCILE=1` runs duplicate healer once post-lock
- Report-only legacy UX backlog: `npm run ai-lab:legacy-scaffold-scan` → `automation/reports/ai-lab-legacy-scaffold-scan-latest.json`
- Weekly legacy watchdog: `.github/workflows/ai-ai-lab-legacy-scaffold-weekly.yml` (scan + deduped issue escalation/recovery close)
- Contract check: `.github/workflows/ai-ai-lab-integrity-smoke-contract.yml` enforces `smoke:routes:check` when integrity smoke sync is relevant

### 1. AI App Improvement Specialist (AAIS) ⭐ NEW
**Status**: Active | **Version**: 2.0.0 | **Path**: `automation/ai-app-improvement-specialist.cjs`

**Description**: Next-generation autonomous AI system for comprehensive app improvement

**Features**:
- Deep code analysis with pattern recognition
- Intelligent issue prioritization (critical → low)
- Automated refactoring and optimization
- Security vulnerability scanning and patching
- Performance profiling and bundle size analysis
- Accessibility and SEO improvements
- Architecture analysis (circular dependencies, coupling)
- Dependency health management
- Testing coverage analysis
- Comprehensive health scoring (0-100)
- Detailed reporting with actionable recommendations

**Operation Modes**:
- **Standard**: Balanced improvements (default)
- **Aggressive**: More improvements, faster iteration
- **Conservative**: Critical fixes only

**Runs**: Every 30 minutes via PM2 | Every 6 hours via GitHub Actions

**Commands**:
```bash
# One-time run
node automation/ai-app-improvement-specialist.cjs run

# Analysis only
node automation/ai-app-improvement-specialist.cjs analyze

# Continuous mode
AAIS_CONTINUOUS=true node automation/ai-app-improvement-specialist.cjs continuous

# Quick start script
./automation/start-ai-app-improvement-specialist.sh run

# PM2
pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist
```

**Current Health Score**: 96/100 ✅

---

### 2. AI Continuous Improvement Agent
**Status**: Active | **Path**: `automation/ai-continuous-improvement-agent.cjs`

**Description**: Advanced continuous improvement system with automated fixes

**Features**:
- Real-time error detection and fixing
- Proactive code quality improvements
- Performance optimization
- Security vulnerability patching
- Pattern-based learning

**Runs**: Every 10 minutes via PM2

---

### 3. AI Development Agent
**Status**: Active | **Path**: `automation/ai-development-agent.cjs`

**Description**: Autonomous code development and improvement

**Features**:
- Analyzes codebase for improvements
- Identifies bugs and technical debt
- Fixes linting and type errors
- Addresses security vulnerabilities
- Improves accessibility
- Enhances code quality

**Runs**: Every 6 hours via PM2

---

### 4. AI Master Orchestrator
**Status**: Active | **Path**: `automation/ai-master-orchestrator.cjs`

**Description**: Coordinates all AI agents and manages improvement queue

**Features**:
- Prioritizes tasks
- Manages improvement queue
- Monitors system health
- Generates comprehensive reports
- Commits and pushes changes automatically

**Runs**: Every hour via PM2

---

### 5. AI Code Generator
**Status**: On-demand | **Path**: `automation/ai-code-generator.cjs`

**Description**: AI-powered code generation (requires API keys)

**Features**:
- Generates new components using AI
- Creates comprehensive tests
- Refactors code
- Fixes complex bugs
- Generates documentation
- Suggests new features

**Requires**: `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`

**Runs**: Weekly on Sunday (feature suggestions)

---

### 6. AI Development Speed Accelerator (ADSA)
**Status**: On-demand + Scheduled | **Path**: `automation/ai-development-speed-accelerator.cjs`

**Description**: Ultra-fast AI-powered development accelerator that generates code, components, pages, APIs, hooks, and utilities at maximum speed using AI APIs, learning from existing patterns.

**Runs**: Weekly Tuesday 11 AM UTC via GitHub Actions (`.github/workflows/ai-development-speed-accelerator.yml`) and on manual dispatch; can also be run locally via `npm run speed:accelerate`.

---


## Automation Systems

### 6. Comprehensive Continuous Automation
**Status**: Active | **Path**: `scripts/automation/comprehensive-continuous-automation.cjs`

**Description**: Master orchestrator for fast operation

**Runs**: Every 5 minutes via PM2

---

### 7. Error Monitor
**Status**: Active | **Path**: `scripts/automation/error-monitor.cjs`

**Description**: Fast error detection

**Runs**: Every 5 minutes via PM2

---

### 8. Health Checker
**Status**: Active | **Path**: `scripts/automation/health-checker.cjs`

**Description**: Continuous health monitoring

**Runs**: Every 3 minutes via PM2

---

### 9. Auto Fixer
**Status**: Active | **Path**: `scripts/automation/auto-fixer.cjs`

**Description**: Fast automated fixes

**Runs**: Every 10 minutes via PM2

---

### 10. Syntax Fixer
**Status**: Active | **Path**: `scripts/automation/syntax-fixer.cjs`

**Description**: Fast syntax error fixing

**Runs**: Every 15 minutes via PM2

---

### 11. Dependency Manager
**Status**: Active | **Path**: `scripts/automation/dependency-manager.cjs`

**Description**: Hourly dependency checks

**Runs**: Every hour via PM2

---

### 12. Build Monitor
**Status**: Active | **Path**: `scripts/automation/build-monitor.cjs`

**Description**: Fast build monitoring

**Runs**: Every 10 minutes via PM2

---

### 13. Intelligent Orchestrator
**Status**: Active | **Path**: `scripts/automation/intelligent-automation-orchestrator.cjs`

**Description**: Master coordination

**Runs**: Every 20 minutes via PM2

---

## Content & Marketing Systems

### 14. AI Content Generator
**Status**: Active | **Path**: `automation/ai-content-generator-automation.cjs`

**Description**: ULTRA-FAST continuous content generation

**Runs**: Continuously (no interval)

---

### 15. AI Content Optimization
**Status**: Active | **Path**: `automation/ai-content-optimization-automation.js`

**Description**: Optimizes content for SEO and engagement

**Features**:
- SEO optimization
- Readability improvements
- Engagement enhancements
- Meta tags optimization
- Image optimization

---

### 16. AI SEO Monitor & Optimizer
**Status**: Active | **Path**: `automation/ai-seo-monitor-optimizer.cjs`

**Description**: Continuous SEO health monitoring and optimization

**Runs**: Every 30 minutes via PM2

---

### 17. LinkedIn Automation
**Status**: Active | **Path**: `automation/ai-social-media-automation.js`

**Description**: Continuous LinkedIn marketing

**Requires**: `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_URN` env vars

**Runs**: Every 4 hours via PM2

---

### 18. Instagram Automation
**Status**: Active | **Path**: `automation/ai-social-media-automation.js`

**Description**: Continuous Instagram marketing

**Requires**: `IG_USER_ID`, `IG_ACCESS_TOKEN` env vars

**Runs**: Every 4 hours via PM2 (offset from LinkedIn)

---

## Meta-Automation Systems

### 19. AI PM2 Optimization Agent
**Status**: Active | **Path**: `automation/ai-pm2-optimization-agent.cjs`

**Description**: Meta-automation to continuously improve PM2 ecosystem

**Runs**: Every 2 hours via PM2

---

### 20. Automation Dashboard
**Status**: Active | **Path**: `scripts/automation/automation-dashboard.cjs`

**Description**: Real-time monitoring dashboard

**Port**: 3001

**Runs**: Continuously via PM2

---

### 21. Log Cleaner
**Status**: Active | **Path**: `scripts/automation/log-cleaner.cjs`

**Description**: Daily log cleanup

**Runs**: Daily at 2 AM via PM2

---

### 22. Lighthouse Production Audit 🆕
**Status**: Active | **Path**: `automation/ai-lighthouse-production-audit.cjs`

**Description**: Audits the live production site (https://ziontechgroup.com) using Lighthouse

**Features**:
- Performance, accessibility, best-practices, SEO scores
- Stores results in `automation/reports/lighthouse-production-latest.json`
- Configurable thresholds for CI failure
- Trend analysis support

**Runs**: Weekly on Sunday via GitHub Actions and cron

**Commands**:
```bash
npm run lighthouse:production
npm run lighthouse:production-threshold  # Fail if any score < 80
```

---

### 22a1. AI Performance Regression Agent 🆕
**Status**: Active | **Path**: `automation/ai-performance-regression-agent.cjs`

**Description**: Tracks Lighthouse scores over time and detects performance regressions. Reads lighthouse-production-latest.json, appends to history, compares with previous run.

**Features**:
- Appends scores to `automation/data/lighthouse-performance-history.json` (last 30 entries)
- Detects regressions when any score drops ≥ REGRESSION_THRESHOLD (default 10)
- Output: `automation/reports/performance-regression-latest.json`
- No external APIs; runs after Lighthouse

**Runs**: As part of AI App Quality Audit workflow (weekly Sunday 5 AM UTC); optional in App Improvement Evolution pipeline (SKIP_PERF_REGRESSION=1)

**Commands**:
```bash
npm run perf:regression
npm run perf:regression-summary
```

---

### 22a2. AI Live Site Accessibility Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-live-site-accessibility-audit-agent.cjs`

**Description**: Runs axe-core against live ziontechgroup.com for accessibility compliance. Audits homepage and key pages (/, /contact, /services, /solutions, /about).

**Features**:
- Uses @axe-core/cli against production URLs
- Output: `automation/reports/live-site-accessibility-audit-latest.json`
- Env: A11Y_URL, A11Y_PAGES (comma-separated paths)
- No build required; audits live site directly

**Runs**: As part of AI App Quality Audit workflow (weekly Sunday 5 AM UTC); optional in App Improvement Evolution pipeline (SKIP_LIVE_A11Y=1)

**Commands**:
```bash
npm run a11y:live
npm run a11y:live-summary
```

---

### 22a3. AI App Quality Audit Workflow 🆕
**Status**: Active | **Path**: `.github/workflows/ai-app-quality-audit.yml`

**Description**: Runs Lighthouse + performance regression + live-site accessibility audit. Feeds into report aggregator. Runs evolution ideas from quality agent to merge actionable ideas into backlog.

**Runs**: Weekly Sunday 5 AM UTC; workflow_dispatch

---

### 22a3a. AI App Evolution Ideas from Quality Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-evolution-ideas-from-quality-agent.cjs`

**Description**: Reads quality reports (Lighthouse, performance regression, live-site accessibility) and generates evolution ideas for the app improvement backlog. Merges actionable suggestions into app-evolution-backlog.json.

**Features**:
- Reads lighthouse-production-latest.json, performance-regression-latest.json, live-site-accessibility-audit-latest.json
- Generates implementation tasks for low scores (<80 perf, <90 a11y/bp/seo), regressions, a11y violations
- Merges into app-evolution-backlog.json (MERGE_TO_BACKLOG=1, default)
- Output: automation/reports/evolution-ideas-from-quality-latest.json

**Runs**: After quality audit in ai-app-quality-audit workflow; also in evolution pipeline when quality audits run (full-quality)

**Commands**:
```bash
npm run app:evolution-ideas-from-quality
npm run app:evolution-ideas-from-quality-summary
```

---

### 22a3a2. AI Evolution Ideas from Audits Agent 🆕
**Status**: Active | **Path**: `automation/ai-evolution-ideas-from-audits-agent.cjs`

**Description**: Reads system-intelligence-audit and conversion-funnel-audit reports, generates evolution ideas for the backlog.

**Features**:
- Reads system-intelligence-audit-latest.json, conversion-funnel-audit-latest.json
- Generates ideas when system intel score < 80, untracked CTAs ≥ 30
- Merges into app-evolution-backlog.json
- Output: automation/reports/evolution-ideas-from-audits-latest.json

**Runs**: In app improvement evolution pipeline (after conversion funnel audit)

**Commands**:
```bash
npm run app:evolution-ideas-from-audits
npm run app:evolution-ideas-from-audits-summary
```

---

### 22a3a3. AI Schema Enhancement Suggestions Agent 🆕
**Status**: Active | **Path**: `automation/ai-schema-enhancement-suggestions-agent.cjs`

**Description**: Scans app for missing JSON-LD structured data (Organization, WebSite, BreadcrumbList, Article, FAQPage), generates evolution ideas.

**Features**:
- Scans app/ TSX/TS files for schema coverage
- Suggests Organization, WebSite, BreadcrumbList, Article, FAQPage where missing
- Merges into app-evolution-backlog.json
- Output: automation/reports/schema-enhancement-suggestions-latest.json

**Runs**: In app improvement evolution pipeline

**Commands**:
```bash
npm run app:schema-enhancement-suggestions
npm run app:schema-enhancement-suggestions-summary
```

---

### 22a3b. AI App Evolution Trigger on Regression 🆕
**Status**: Active | **Path**: `.github/workflows/ai-app-evolution-trigger-on-regression.yml`

**Description**: When performance regression is detected by ai-app-quality-audit, runs app improvement evolution pipeline with quality checks enabled.

**Runs**: After AI App Quality Audit completes (workflow_run); workflow_dispatch for manual trigger

---

### 22a3c. AI App Improvement Evolution (Full Quality) 🆕
**Status**: Active | **Path**: `.github/workflows/ai-app-improvement-evolution-full-quality.yml`

**Description**: Runs the full evolution pipeline WITH Lighthouse, performance regression, and live a11y (SKIP_LIGHTHOUSE=0).

**Runs**: First Sunday of each month at 7 AM UTC; workflow_dispatch

---

### 22a. AI App Audit Automation 🆕
**Status**: Active | **Path**: `automation/ai-app-audit-automation-agent.cjs`

**Description**: Audits live ziontechgroup.com with OpenRouter LLM. Fetches key pages, extracts content, generates improvement suggestions for content, UX, SEO, performance, conversion.

**Features**:
- Fetches homepage, services, solutions, case-studies, contact, about, blog, ai-services, industries
- Follows 301/302 redirects for full content
- Uses meta-llama/llama-3.2-3b-instruct:free (free tier)
- Outputs app-audit-suggestions.json for implementation agent

**Requires**: `OPENROUTER_API_KEY`

**Runs**: Weekly Saturday 10 AM UTC via GitHub Actions

**Commands**:
```bash
npm run app:audit
npm run app:audit-summary
npm run app:audit-apply      # Apply safe suggestions
npm run app:audit-apply-summary
```

---

### 22a2. AI App Audit Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-audit-implementation-agent.cjs`

**Description**: Applies safe high-priority suggestions from app audit (meta tags, SEO enhancements).

**Runs**: After app audit in workflow

**Commands**:
```bash
npm run app:audit-apply
```

---

### 22b. AI Layout & Design Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-layout-design-audit-agent.cjs`

**Description**: Audits https://ziontechgroup.com layout and design. Uses OpenRouter LLM when available; falls back to local heuristic audit when API key is missing.

**Features**:
- Fetches live production HTML for visual/layout audit
- Analyzes app/layout.tsx, Header, Footer, globals.css
- Uses openrouter/free for LLM-powered audit (when OPENROUTER_API_KEY set)
- **Local heuristic fallback**: font display, section spacing, typography scale, image aspect-ratio, container padding
- Generates JSON report with prioritized suggestions

**Requires**: `OPENROUTER_API_KEY`

**Runs**: Weekly Saturday 12 UTC via GitHub Actions | Weekly Saturday 5 AM via cron

**Commands**:
```bash
npm run layout:audit
npm run layout:audit-summary
npm run layout:audit-apply      # Apply safe layout improvements
npm run layout:audit-apply-summary
npm run layout:pipeline        # Audit + apply in one command
npm run layout:pipeline-commit  # Audit + apply + commit
```

### 22b2. AI Layout Design Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-layout-design-implementation-agent.cjs`

**Description**: Applies safe layout/design improvements: font display swap, section spacing token, simplified Navigation shadow, typography scale design tokens, image aspect-ratio for CLS prevention.

**Runs**: After layout audit in workflow

---

### 22b3. AI Layout Design Automation Pipeline (Full) 🆕
**Status**: Active | **Path**: `automation/ai-layout-design-automation-pipeline-full.cjs`

**Description**: Unified pipeline for layout and design improvements. Orchestrates: Live Site UX Audit → Layout Design Audit → Layout Implementation → optional commit & deploy.

**Features**:
- Step 0: Live Site UX Audit (heuristic, no LLM) — meta, og:image, viewport, schema, H1, CTA, links, layout checks
- Step 1: Layout Design Audit (LLM or heuristic fallback)
- Step 2: Layout Design Implementation (apply safe fixes)
- Step 3: Optional commit & deploy (AUTO_COMMIT=1, TRIGGER_DEPLOY=1)

**Runs**: Weekly Friday 11 UTC via GitHub Actions | Weekly Friday 11 AM via cron

**Commands**:
```bash
npm run layout:automation
npm run layout:automation-commit
npm run layout:automation-deploy
```

**Environment**: SKIP_UX_AUDIT=1, SKIP_LAYOUT_AUDIT=1, SKIP_LAYOUT_APPLY=1, DRY_RUN=1

---

### 22c2. AI Automation Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-automation-audit-agent.cjs`

**Description**: Audits the automation ecosystem: agents, workflows, cron jobs. Validates file paths, detects broken references, and uses OpenRouter LLM for improvement suggestions when available.

**Features**:
- Validates agent files and lib/openrouter-client references
- Checks workflow YAML for missing agent paths
- Verifies cron .env sourcing for OpenRouter jobs
- Excludes template-only workflows (ai-content-burst, ai-ultra-fast-content, ai-content-rapid) from OPENROUTER_API_KEY check
- LLM-powered suggestions when OPENROUTER_API_KEY set
- Integrates with report aggregator dashboard

**Requires**: `OPENROUTER_API_KEY` (optional, for LLM suggestions)

**Runs**: Weekly Saturday 11 AM UTC via GitHub Actions | Weekly Saturday 11 AM via cron

**Commands**:
```bash
npm run automation:audit
npm run automation:audit-summary
```

---

### 22c2b. AI Automation Self-Healing Agent 🆕
**Status**: Active | **Path**: `automation/ai-automation-self-healing-agent.cjs`

**Description**: Reads automation-audit-latest.json and applies fixable fixes automatically (e.g. creates automation/logs/ when missing).

**Features**:
- Fixes missing_log_dir by creating automation/logs/
- Runs after automation audit in daily pipeline and workflow
- Integrates with report aggregator (automationSelfHeal)
- DRY_RUN=1 for preview mode

**Runs**: After automation audit in daily pipeline | After automation audit in ai-automation-audit workflow

**Commands**:
```bash
npm run automation:self-heal
npm run automation:self-heal-summary
```

---

### 22c2c. AI Conversion Funnel Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-conversion-funnel-audit-agent.cjs`

**Description**: Audits the codebase for CTA links and buttons that should be tracked for conversion funnel analysis. Suggests gtag/GA4 event tracking for key actions (contact, primary CTA, discovery call).

**Features**:
- Scans app/ for CTA patterns (contact links, Start a Project, Book a Strategy Session)
- Detects existing gtag or data-cta-event tracking
- Outputs untracked CTAs and suggestions for conversion funnel: view_contact → click_cta → form_submit
- Integrates with report aggregator and automation improvements pipeline

**Runs**: Via automation improvements pipeline (weekly) | On-demand

**Commands**:
```bash
npm run conversion:funnel-audit
```

---

### 22c2c2. AI CTA Tracking Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-cta-tracking-implementation-agent.cjs`

**Description**: Adds data-cta-event tracking to high-priority CTAs from conversion funnel audit. Works with CtaTracking component for GA4 event tracking.

**Features**:
- Reads conversion-funnel-audit-latest.json
- Adds data-cta-event to contact links in priority files (page, Navigation, Footer, StickyMobileCTA, contact)
- When untracked > 50: expands beyond priority files to top files by CTA count (up to MAX_FILES)
- DRY_RUN=1 for preview, MAX_FILES=10 (default 5) to limit scope
- Integrates with app visit intelligence orchestrator and automation improvements pipeline

**Runs**: Via app visit intelligence (implement phase) | Via automation improvements (when untracked > 50) | On-demand

**Commands**:
```bash
npm run conversion:cta-implement
MAX_FILES=15 npm run conversion:cta-implement
```

---

### 22c2c3. Central Pages-to-Visit Config 🆕
**Status**: Active | **Path**: `automation/data/pages-to-visit.json`, `automation/lib/pages-to-visit.cjs`

**Description**: Single source of truth for pages visited by app improvement, visit intelligence, and audit pipelines. Core (6), extended (+8), audit-only (+3) tiers.

**Features**:
- Core: homepage, contact, services, solutions, about, blog
- Extended: case-studies, ai-services, products, pricing, industries, consultation, innovation-bundles, faq
- Audit-only: automation, micro-saas-services, search
- All pipelines (evolution, visit orchestrator, system intel, app audit, daily quick) use shared config

**Commands**:
```bash
npm run pages:config
```

---

### 22c2d. AI System Intelligence Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-system-intelligence-audit-agent.cjs`

**Description**: Audits ziontechgroup.com to make systems more intelligent. Multi-page heuristic checks for UX, conversion, engagement, accessibility, and performance. Optional LLM analysis for deeper insights.

**Features**:
- Fetches core + extended pages (14 total) via shared pages-to-visit config
- Checks: meta description, title, schema.org, CTA, forms, internal links, semantic HTML, image alt, font-display, trust signals, breadcrumbs, conversion tracking
- Optional LLM recommendations (Ollama primary, OpenRouter fallback) when SKIP_LLM≠1
- Outputs score, ideas, and actionable suggestions
- Integrates with daily pipeline, app evolution audit, automation improvements, report aggregator

**Runs**: Via daily automation pipeline, app evolution audit, automation improvements | On-demand

**Commands**:
```bash
npm run system:intelligence-audit
```

---

### 22c2d2. AI System Intelligence Auto-Fix Agent 🆕
**Status**: Active | **Path**: `automation/ai-system-intelligence-auto-fix-agent.cjs`

**Description**: Reads system-intelligence-audit-latest.json and applies fixable improvements to the codebase. No LLM required.

**Features**:
- Homepage: meta description (50-160 chars), title (30-60 chars) via layout.tsx
- Services: title expansion (30-60 chars when too short)
- Runs after system intelligence audit; part of app visit intelligence and app intelligence (TRIGGER_FIXES when score < 85)

**Runs**: Via app visit orchestrator, app intelligence agent | On-demand

**Commands**:
```bash
npm run system:intelligence-auto-fix
```

---

### 22c2e. AI App Intelligence Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-intelligence-agent.cjs`

**Description**: Makes app improvement systems more intelligent by aggregating audit insights, tracking score history, and auto-suggesting improvements. No LLM required.

**Features**:
- Aggregates UX, automation, site link, and conversion funnel reports
- Tracks score history for trend detection (improving/declining/stable)
- Auto-suggests improvements based on recurring patterns (meta description, title, broken links)
- TRIGGER_FIXES=1 runs UX auto-fix and system intelligence auto-fix when score < 85
- AUTO_COMMIT=1 merges insights into evolution backlog
- Integrates with automation improvements pipeline and report aggregator

**Runs**: Via automation improvements pipeline (weekly) | On-demand

**Commands**:
```bash
npm run app:intelligence
npm run app:intelligence-commit   # AUTO_COMMIT=1
```

---

### 22c3. AI Automation Improvements Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-automation-improvements-pipeline.cjs`

**Description**: Orchestrates automation health checks: automation audit + live site UX audit + conversion funnel audit + system intelligence audit + app intelligence + site link audit + report aggregator. Use before deploy or weekly to ensure automations are healthy.

**Features**:
- Runs automation audit (agents, workflows, cron)
- Runs automation self-healing (fixes missing logs, etc.)
- Runs live site UX audit (meta, title, schema, CTA checks)
- Runs conversion funnel audit (CTA tracking suggestions)
- Runs CTA tracking implementation when untracked CTAs > 50 (MAX_FILES=15)
- Runs system intelligence audit (UX, conversion, engagement, accessibility)
- Runs app intelligence (aggregates insights, trend detection, suggestions)
- Runs site link audit (validates live site links)
- Runs content health (freshness + site links summary)
- Refreshes report aggregator dashboard
- CREATE_PAGES=1 to create missing pages when broken links found
- TRIGGER_FIXES=1 to run UX auto-fix when app intelligence detects score < 85
- Auto-enables TRIGGER_FIXES when UX score < 85 (autonomous)

**Runs**: Weekly Wednesday 10 UTC via GitHub Actions | Weekly Wednesday 10 AM via cron

**Commands**:
```bash
npm run automation:improve
npm run automation:improve-create-pages   # CREATE_PAGES=1
npm run automation:improve-trigger-fixes   # TRIGGER_FIXES=1
```

### 22c3a. AI Content Health Agent 🆕
**Status**: Active | **Path**: `automation/ai-content-health-agent.cjs`

**Description**: Aggregates content health checks: freshness, site links. Runs content freshness scan, optionally site link audit. No LLM required.

**Features**:
- Runs content freshness agent (stale content detection)
- Optionally runs site link audit (SKIP_SITE_LINKS=1 to skip when already run)
- Outputs content-health-latest.json with summary
- Integrates with automation improvements pipeline and report aggregator

**Runs**: Via automation improvements pipeline | On-demand

**Commands**:
```bash
npm run content:health
```

---

### 22c3b. AI Automation Deployment Readiness Agent 🆕
**Status**: Active | **Path**: `automation/ai-automation-deployment-readiness-agent.cjs`

**Description**: Pre-deploy gate. Runs automation audit + UX audit + site link audit. Exit 0 = ready to deploy, exit 1 = not ready. Use before triggering Netlify deploy.

**Features**:
- Runs automation audit, UX audit, site link audit
- Returns ready/fail based on automation issues, broken links, UX score
- Integrates with deploy-preflight workflow (blocks deploy when not ready)
- Report: deployment-readiness-latest.json

**Commands**:
```bash
npm run deploy:readiness
```

---

### 22c. AI GitHub Actions & App Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-github-actions-audit-agent.cjs`

**Description**: Audits all GitHub Actions workflows and live ziontechgroup.com using OpenRouter LLM (meta-llama/llama-3.2-3b-instruct:free). Generates workflow improvements, new workflow suggestions, and app automation ideas.

**Features**:
- Reads all .github/workflows/*.yml
- Fetches key site pages (home, services, solutions, contact, about, blog, industries, consultation, automation, micro-saas-services)
- Uses OpenRouter free model for LLM analysis
- Outputs workflowImprovements, newWorkflowSuggestions, appAutomationIdeas
- Integrates with report aggregator dashboard

**Requires**: `OPENROUTER_API_KEY`

**Runs**: Weekly Sunday 9 AM UTC via GitHub Actions | Weekly Sunday 9 AM via cron

**Commands**:
```bash
npm run actions:audit
npm run actions:audit-summary
```

**GitHub**: Add `OPENROUTER_API_KEY` to repo secrets for workflow.

### 22c2. AI GitHub Actions Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-github-actions-implementation-agent.cjs`

**Description**: Applies safe workflow improvements from github-actions-audit-suggestions.json. Adds workflow_dispatch, creates new workflows (e.g. deploy-preflight), uses fallback improvements when LLM suggestions unavailable.

**Features**:
- Applies workflowImprovements from audit
- Creates new workflows from newWorkflowSuggestions
- Fallback: workflow_dispatch for ci-cd, deploy-preflight workflow
- AUTO_COMMIT=1 to commit and push applied changes
- workflow_dispatch with auto_commit input for manual improvement deployment

**Runs**: After ai-github-actions-audit in workflow | Weekly Sunday 9 AM via cron

**Deploy**: deploy-on-push.yml triggers Netlify deploy when CI/CD succeeds on main (requires NETLIFY_BUILD_HOOK). Optimized: no local build (Netlify builds from repo). workflow_dispatch for manual deploy. production-smoke-test.yml runs post-deploy validation. ai-production-deploy-validation.yml runs sitemap + SEO + link check after deploy. ai-weekly-security-audit.yml runs npm audit weekly and creates GitHub issue on high/critical vulns.

**Commands**:
```bash
npm run actions:impl
npm run actions:impl-summary
AUTO_COMMIT=1 npm run actions:impl   # Auto-commit improvements
```

---

### 22d. AI App Evolution Automation Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-evolution-automation-agent.cjs`

**Description**: Orchestrates app audit + OpenRouter LLM to generate implementation-ready evolution ideas. Audits ziontechgroup.com, produces evolution backlog with prioritized tasks, quick wins, and roadmap. Auto-commits backlog on schedule.

**Features**:
- Runs app audit (fetches live site, LLM analysis)
- Generates evolution ideas from audit suggestions
- Fallback improvement ideas when LLM unavailable (402/401)
- Implementation tasks with safeToAutoApply flag
- Optional AUTO_APPLY=1, AUTO_COMMIT=1 for automation

**Requires**: `OPENROUTER_API_KEY` (GitHub secrets for workflow)

**Runs**: Weekly Sunday 11 AM via cron | Weekly Sunday 11 AM UTC via GitHub Actions

**Commands**:
```bash
npm run app:evolution
npm run app:evolution-audit
npm run app:evolution-ideas
npm run app:evolution-summary
```

---

### 22e. AI App Improvement Orchestrator 🆕
**Status**: Active | **Path**: `automation/ai-app-improvement-orchestrator.cjs`

**Description**: Full pipeline orchestrator for app improvement and evolution. Runs site link audit → app audit → evolution ideas → implementation → optional commit & push → optional deploy trigger. Automates app improvement and deploys new ideas continuously.

**Features**:
- Site link audit (crawl live site, check for broken links)
- App audit (live ziontechgroup.com via OpenRouter LLM)
- App evolution (ideas from audit → backlog)
- Site link audit (validates all internal links; CREATE_PAGES=1 to create missing)
- Optional layout audit (LAYOUT_AUDIT=1)
- Optional content ideation (CONTENT_IDEAS=1)
- Optional evolution ideas (EVOLUTION_IDEAS=1) — new deployable ideas from live site
- App audit implementation (apply safe meta/SEO changes)
- Layout implementation (apply safe layout fixes)
- Auto-commit & push (AUTO_COMMIT=1)
- Optional Netlify deploy trigger (TRIGGER_DEPLOY=1, NETLIFY_BUILD_HOOK)

**Requires**: `OPENROUTER_API_KEY` (GitHub secrets for workflow)

**Runs**: Weekly Monday 12 UTC via GitHub Actions | Weekly Monday 12 PM via cron

**Commands**:
```bash
npm run app:improve           # Full pipeline (no commit)
npm run app:improve-commit    # Pipeline + commit & push
npm run app:improve-summary   # Show latest report
```

**Environment**: LAYOUT_AUDIT=1, CONTENT_IDEAS=1, EVOLUTION_IDEAS=1, CREATE_PAGES=1, TRIGGER_DEPLOY=1, SKIP_LLM=1

---

### 22e2. AI App Evolution Ideas Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-evolution-ideas-agent.cjs`

**Description**: Fetches live ziontechgroup.com, reads evolution backlog, uses LLM to generate NEW deployable evolution ideas. Enriches backlog with innovative suggestions.

**Features**:
- Fetches key pages from live site
- Merges new ideas into app-evolution-backlog.json
- Fallback heuristic ideas when LLM unavailable
- Runs as part of orchestrator (EVOLUTION_IDEAS=1) or standalone

**Commands**:
```bash
npm run app:evolution-ideas-run
npm run app:evolution-ideas-summary
```

---

### 23. AI Ecosystem Intelligence Agent 🆕
**Status**: Active | **Path**: `automation/ai-ecosystem-intelligence-agent.cjs`

**Description**: Analyzes the automation ecosystem and generates actionable suggestions for new automations, cron jobs, and improvements.

**Features**:
- Scans existing agents, workflows, and cron jobs
- Identifies gaps and improvement opportunities
- Suggests new automation ideas
- Proposes new cron jobs and GitHub workflows
- Generates implementation-ready recommendations

**Runs**: Daily at 6 AM via cron | Weekly Monday via GitHub Actions

**Commands**:
```bash
npm run ecosystem:intel
npm run ecosystem:suggestions
npm run ecosystem:summary
```

---

### 24. AI Content Freshness Agent 🆕
**Status**: Active | **Path**: `automation/ai-content-freshness-agent.cjs`

**Description**: Scans blog posts, case studies, and key pages for stale content.

**Features**:
- Extracts date metadata from content files
- Uses file mtime as fallback
- Configurable stale threshold (default 12 months)
- Blog metadata check (posts >18mo, missing dates)
- Generates actionable freshness reports

**Runs**: Weekly Monday 4 AM via cron | Weekly via GitHub Actions

**Commands**:
```bash
npm run content:freshness
npm run content:freshness-summary
npm run content:metadata-check
```

---

### 24b. AI Front Page Content Expansion Agent 🆕
**Status**: Active | **Path**: `automation/ai-front-page-content-expansion-agent.cjs`

**Description**: Uses OpenRouter LLM to generate new services and content for the main front page (industry solutions, case studies, innovation bundles, platform spotlights, FAQ, momentum signals).

**Features**:
- Scans existing industries, case studies, bundles to avoid duplicates
- Generates 2 industry solutions, 2 case studies, 1 innovation bundle
- Adds platform page spotlights, FAQ items, momentum signals
- Applies changes to `app/page.tsx` and `app/case-studies/page.tsx`

**Requires**: `OPENROUTER_API_KEY`

**Commands**:
```bash
npm run content:front-page-expand
```

---

### 24b2. AI Front Page Services Advertiser Agent 🆕
**Status**: Active | **Path**: `automation/ai-front-page-services-advertiser-agent.cjs`

**Description**: Promotes under-featured Zion AI product pages to the main front page. Scans `app/zion-ai-*` and `app/zion-*` pages, compares with `featuredApps`, and adds up to 5 apps (configurable via `MAX_ADD`) not yet prominently featured.

**Features**:
- LLM selection when `OPENROUTER_API_KEY` set; heuristic fallback when key missing
- Adds apps to `featuredApps` in `app/page.tsx`
- Integrated into content turbo and services-and-content pipelines

**Runs**: 3x daily (6/12/18 UTC) via AI Services & Content workflow (MAX_ADD=12) | 11x daily via Content Burst | Ultra-Fast pipeline

**Commands**:
```bash
npm run content:front-page-advertise
```

---

### 24b2a. AI App Collections Advertiser Agent 🆕
**Status**: Active | **Path**: `automation/ai-app-collections-advertiser-agent.cjs`

**Description**: Adds under-featured Zion AI product pages to `appCollections` on the front page. Complements the services advertiser by surfacing more apps in the AppCollectionGrid section. No LLM required.

**Options**: `MAX_ADD=3`, `COLLECTIONS=Operations,Finance` (comma-separated collection titles)

**Runs**: AI Services & Content workflow | Content Burst

**Commands**:
```bash
npm run content:app-collections-advertise
```

---

### 24b3. AI Zion Product Page Creator Agent 🆕
**Status**: Active | **Path**: `automation/ai-zion-product-page-creator-agent.cjs`

**Description**: Creates new Zion AI product pages and adds them to the front page. Uses OpenRouter LLM when available; falls back to predefined templates.

**Options**: `MAX_PAGES=1`, `SKIP_FRONT_PAGE=1`

**Commands**:
```bash
npm run content:create-product-page
```

---

### 24c. AI Content Fast Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-content-fast-pipeline.cjs`

**Description**: High-speed content generation orchestration. Runs blog generation (OpenRouter) and front-page expansion in parallel.

**Features**:
- Uses `meta-llama/llama-3.2-3b-instruct:free` or `openrouter/free` for zero-cost generation
- Parallel execution of blog + front page
- `MAX_BLOG_POSTS` limits new posts per run (default: 2)
- `AUTO_COMMIT=1` commits and pushes

**Requires**: `OPENROUTER_API_KEY`

**Runs**: Tue/Thu 4 AM UTC via cron and GitHub Actions

**Commands**:
```bash
npm run content:fast
AUTO_COMMIT=1 npm run content:fast-commit
```

---

### 24d. AI Content Ideation Agent 🆕
**Status**: Active | **Path**: `automation/ai-content-ideation-agent.cjs`

**Description**: Fetches live site, suggests new blog topics, industries, case studies via OpenRouter LLM.

**Output**: `automation/reports/content-ideation-latest.json`

**Commands**:
```bash
npm run content:ideate
```

---

### 24d2. Advanced AI Services Expansion + Content Pipeline 🆕
**Status**: Active | **Paths**:
- `automation/ai-advanced-ai-services-expansion-agent.cjs` — template-based new `/ai-services/*` Advanced AI pages
- `automation/ai-advanced-ai-content-pipeline.cjs` — loop: expansion → front-page Advanced AI sync → optional template blog
- `automation/ai-project-improvement-radar-agent.cjs` — periodic lint + type-check report (`project-improvement-radar-latest.json`)
- `automation/ai-observability-ema-local-guard.cjs` — local PM2 guard for observability EMA freshness + automation-health pressure (`observability-ema-local-guard-latest.json`)

**PM2**: `ai-advanced-ai-content-pipeline`, `ai-project-improvement-radar`, `ai-observability-ema-local-guard` in `ecosystem.config.cjs`

**Commands**:
```bash
npm run content:advanced-ai-expand
npm run content:advanced-ai-pipeline
CONTINUOUS_MODE=true npm run content:advanced-ai-pipeline:loop
npm run project:improvement-radar
CONTINUOUS_MODE=true npm run project:improvement-radar:loop
npm run observability:ema:local-guard
CONTINUOUS_MODE=true npm run observability:ema:local-guard:loop
```

**Notes**: Set `AUTO_COMMIT=1` on the pipeline when you want git commits (paths restricted to `app/ai-services`, nav, homepage, blog, reports). Radar exits non-zero when a step fails (PM2 will restart).

---

### 24e. AI Content Maximum Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-content-maximum-pipeline.cjs`

**Enhancements** (March 2026): Now includes Evolution Ideas (phase 1) and Product Page Creator (phase 2) for maximum content velocity.

**Description**: Ultra-fast content generation for maximum velocity. Runs ideation + content-audit-ideas + evolution ideas in parallel, then blog (with dynamic topics from ideation) + front page + product page creator + services advertiser in parallel. Higher concurrency (6 posts, 6 parallel LLM calls), auto-commit, optional Netlify deploy trigger.

**Features**:
- Ideation + content-audit-ideas + evolution ideas in parallel (feeds dynamic topics to blog)
- Product page creator creates new Zion AI product pages and adds to front page
- Blog uses `content-audit-ideas-latest.json` or `content-ideation-latest.json` when available
- `MAX_BLOG_POSTS=6`, `MAX_CONCURRENCY=6` for speed
- `AUTO_COMMIT=1` commits and pushes
- `TRIGGER_DEPLOY=1` calls `NETLIFY_BUILD_HOOK` after commit
- Syncs `BLOG_SLUGS` in `app/lib/blog-data.ts` when new posts created

**Requires**: `OPENROUTER_API_KEY`; `NETLIFY_BUILD_HOOK` for deploy trigger

**Runs**: Daily 4 AM UTC via cron and GitHub Actions (default pipeline)

**Commands**:
```bash
npm run content:maximum
AUTO_COMMIT=1 npm run content:maximum-commit
AUTO_COMMIT=1 TRIGGER_DEPLOY=1 npm run content:maximum-deploy
```

---

### 24f. AI Ideas to Implementation Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-ideas-to-implementation-pipeline.cjs`

**Description**: Maximum-velocity pipeline for ideation → content → deploy. Runs ideation, evolution ideas, content audit ideas in parallel, then blog, front page, product page creator, and services advertiser in parallel.

**Features**:
- Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
- Phase 2: Blog + Front Page + Product Page Creator + Services Advertiser (parallel)
- Auto-commit and Netlify deploy trigger
- `MAX_PRODUCT_PAGES=1` creates new Zion AI product pages per run
- `SKIP_EVOLUTION_IDEAS=1`, `SKIP_PRODUCT_PAGES=1` to disable steps

**LLM**: Ollama (primary) or `OPENROUTER_API_KEY`; `NETLIFY_BUILD_HOOK` for deploy trigger

**Runs**: Twice daily (4 AM and 4 PM UTC) via GitHub Actions; daily 4 PM via cron

**Commands**:
```bash
npm run content:ideas-implementation
npm run content:ideas-implementation-commit
npm run content:ideas-implementation-deploy
```

---

### 24g. AI App Evolution Audit Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-app-evolution-audit-pipeline.cjs`

**Description**: Unified pipeline for ziontechgroup.com: visit → audit → implement → deploy. Orchestrates automation health, site link validation, ideation, evolution ideas, content generation, and optional commit/deploy.

**Features**:
- Phase 0: Live Site UX Audit + UX Auto-Fix (heuristic, no LLM) + Automation Audit + Site Link Audit
- Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
- Phase 2: Blog + Front Page + Product Creator + Services Advertiser (parallel)
- Phase 3: Commit & Deploy (when `AUTO_COMMIT=1`)
- `SKIP_UX_AUDIT=1`, `SKIP_AUTOMATION_AUDIT=1`, `SKIP_SITE_LINKS=1` to disable Phase 0 steps

**Requires**: `OPENROUTER_API_KEY` for Phase 1/2; `NETLIFY_BUILD_HOOK` for deploy trigger

**Runs**: Weekly Saturday 14 UTC via GitHub Actions; weekly Saturday 2 PM via cron

**Commands**:
```bash
npm run app:evolution-audit
npm run app:evolution-audit-commit
npm run app:evolution-audit-deploy
npm run app:ux-audit       # Live Site UX Audit only (no LLM)
npm run app:ux-auto-fix   # UX Audit + Auto-Fix (meta/title)
```

---

### 24h. AI Live Site UX Audit Agent 🆕
**Status**: Active | **Path**: `automation/ai-live-site-ux-audit-agent.cjs`

**Description**: Fetches live ziontechgroup.com homepage and performs heuristic UX/SEO checks. No LLM required.

**Features**:
- Meta description, og:image, viewport, schema.org, H1, CTA presence, internal links, title
- Generates actionable improvement ideas
- Output: `automation/reports/live-site-ux-audit-latest.json`

**Runs**: As part of App Evolution Audit Pipeline (Phase 0) or standalone

**Commands**:
```bash
npm run app:ux-audit
```

---

### 24h2. AI Live Site UX Auto-Fix Agent 🆕
**Status**: Active | **Path**: `automation/ai-live-site-ux-auto-fix-agent.cjs`

**Description**: Reads live-site-ux-audit-latest.json and applies fixable UX/SEO improvements to the homepage (meta description, title). No LLM required.

**Features**:
- Trims meta description to 50-160 chars
- Shortens title to 30-60 chars
- Runs after UX audit in App Evolution Pipeline
- Output: `automation/reports/live-site-ux-auto-fix-latest.json`

**Runs**: After Live Site UX Audit in Phase 0 (when audit has failures)

**Commands**:
```bash
npm run app:ux-auto-fix   # Audit + Auto-Fix
```

---

### 24h3. AI Live Site UX Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-live-site-ux-implementation-agent.cjs`

**Description**: Reads live-site-ux-audit-latest.json and applies fixable UX/SEO improvements to the homepage. Handles title (30-60 chars) and meta description (50-160 chars). No LLM required.

**Runs**: After UX audit in App Evolution Audit Pipeline (Phase 0)

**Commands**:
```bash
npm run app:ux-audit-apply   # After app:ux-audit
```

---

### 24i. AI Local LLM App Automation Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-local-llm-app-automation-pipeline.cjs`

**Description**: Orchestrates app improvement and evolution using local LLM (Ollama primary, OpenRouter fallback). Fetches live ziontechgroup.com, generates ideas via LLM, implements improvements, and optionally commits/deploys.

**Features**:
- Site link audit (CREATE_PAGES=1 to create missing pages)
- Local LLM specialists (SEO, conversion, content, accessibility, performance) — runs 5 specialist agents in parallel
- Automation evolution ideas (LLM generates new automation ideas)
- Evolution ideas (LLM or heuristic fallback)
- Content audit ideas
- App audit (LLM or heuristic fallback)
- App evolution and implementation
- Auto-commit and Netlify deploy trigger
- `SKIP_SPECIALISTS=1` to skip specialist agents

**LLM**: Ollama (primary) or `OPENROUTER_API_KEY`; `NETLIFY_BUILD_HOOK` for deploy

**Runs**: Weekly Wednesday 12 UTC via GitHub Actions; workflow_dispatch

**Commands**:
```bash
npm run automation:local-llm
npm run automation:local-llm-commit
npm run automation:local-llm-deploy
```

---

### 24i2. AI Local LLM Specialists Orchestrator 🆕
**Status**: Active | **Path**: `automation/ai-local-llm-specialists-orchestrator.cjs`

**Description**: Runs 5 local LLM specialist agents in parallel for app improvement and evolution automation. Each specialist focuses on a domain: SEO, conversion, content, accessibility, performance.

**Specialist Agents**:
- **SEO Specialist** (`ai-local-llm-seo-specialist-agent.cjs`): Meta tags, schema.org, keywords, headings
- **Conversion Specialist** (`ai-local-llm-conversion-specialist-agent.cjs`): CTAs, trust signals, forms, friction reduction
- **Content Improvement** (`ai-local-llm-content-improvement-agent.cjs`): Clarity, engagement, content gaps, industry coverage
- **Accessibility Specialist** (`ai-local-llm-accessibility-specialist-agent.cjs`): WCAG 2.1, labels, focus, ARIA, semantics
- **Performance Specialist** (`ai-local-llm-performance-specialist-agent.cjs`): LCP, CLS, images, lazy loading, Core Web Vitals

**Features**:
- Parallel execution (all 5 agents run concurrently)
- Aggregates quick wins into unified report
- `MERGE_TO_BACKLOG=1` merges quick wins into app-evolution-backlog.json
- Auto-commit and Netlify deploy trigger

**LLM**: Ollama (primary) or `OPENROUTER_API_KEY`; heuristic fallback when no LLM

**Runs**: Weekly Thursday 14 UTC via GitHub Actions; weekly Thursday 3 PM via cron

**Commands**:
```bash
npm run automation:local-llm-seo
npm run automation:local-llm-conversion
npm run automation:local-llm-content-improvement
npm run automation:local-llm-accessibility
npm run automation:local-llm-performance
npm run automation:local-llm-specialists
npm run automation:local-llm-specialists-commit
npm run automation:local-llm-specialists-deploy
```

---

### 24i2b. AI Local LLM Automation Evolution Agent 🆕
**Status**: Active | **Path**: `automation/ai-local-llm-automation-evolution-agent.cjs`

**Description**: Uses local LLM to generate new automation ideas for app improvement and evolution. Scans agents, workflows, backlog, and live site to propose deployable automation enhancements. Merges ideas into app-evolution-backlog.json.

**Features**:
- New automation ideas (agents, pipelines, workflows)
- Pipeline improvement suggestions
- Quick wins for automation
- Prefers free local LLM over paid APIs

**LLM**: Ollama (primary) or `OPENROUTER_API_KEY`; heuristic fallback when no LLM

---

### 24j. AI App Visit Intelligence Orchestrator 🆕
**Status**: Active | **Path**: `automation/ai-app-visit-intelligence-orchestrator.cjs`

**Description**: Visits ziontechgroup.com, audits for intelligence improvements, and deploys new ideas to automate app improvement and evolution. Unified pipeline for site visit → audit → implement → deploy.

**Features**:
- Site visit (fetches 6 key pages: home, contact, services, solutions, about, blog)
- System intelligence audit (UX, conversion, engagement, a11y)
- Live site UX audit
- Conversion funnel audit
- Local LLM specialists (SEO, conversion, content, accessibility, performance) — optional
- Automation evolution ideas (new automation ideas for app improvement)
- UX auto-fix (meta, title)
- Report aggregator
- Auto-commit and Netlify deploy trigger

**Environment**: `AUTO_COMMIT=1`, `TRIGGER_DEPLOY=1`, `SKIP_LLM=1`, `SKIP_SPECIALISTS=1`, `SKIP_IMPLEMENT=1`

**Runs**: Weekly Monday 14 UTC via GitHub Actions; workflow_dispatch

**Commands**:
```bash
npm run app:visit-audit           # Audit only (no commit)
npm run app:visit-evolve          # Audit + implement + commit to main
npm run app:visit-evolve-deploy   # Audit + implement + commit + deploy
```

**Runs**: As part of Local LLM App Automation Pipeline (step 1c)

**Commands**:
```bash
npm run automation:local-llm-evolution-ideas
```

---

### 24j1. AI App Improvement Evolution Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-app-improvement-evolution-pipeline.cjs`

**Description**: Visits ziontechgroup.com, audits for improvements, implements safe fixes, generates evolution ideas, optionally runs content burst + services advertiser, and commits/deploys. Higher-frequency evolution automation (3x/week) for continuous app improvement.

**Features**:
- Site visit (6 key pages)
- Optional: Lighthouse + perf regression + live a11y (full-quality run); evolution ideas from quality
- System intelligence + UX + conversion funnel audits
- Evolution ideas from audits (system intel + conversion funnel)
- Schema enhancement suggestions (JSON-LD gaps)
- UX auto-fix, system intelligence auto-fix, CTA tracking implementation (when score < 85)
- Automation evolution ideas (adds to backlog)
- App evolution implement (AUTO_APPLY=1 for safe backlog items)
- Optional: Content burst (2 blog + 2 case studies), front page services advertiser (3 apps)
- Report aggregator
- Auto-commit and Netlify deploy trigger (TRIGGER_DEPLOY=1 on scheduled runs)

**Environment**: `AUTO_COMMIT=1`, `TRIGGER_DEPLOY=1`, `SKIP_CONTENT=1`, `TRIGGER_FIXES=1`

**Runs**: Tue + Wed + Fri 6 AM UTC via GitHub Actions; workflow_dispatch

**Commands**:
```bash
npm run app:improvement-evolution           # Audit + implement (no commit)
npm run app:improvement-evolution-commit    # Audit + implement + commit to main
npm run app:improvement-evolution-deploy   # Audit + implement + commit + deploy
```

---

### 24j1a. AI App Improvement Daily Quick Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-app-improvement-daily-quick-pipeline.cjs`

**Description**: Lightweight daily run for fast feedback. Site visit + UX/system intel auto-fixes + CTA tracking + backlog implementor. No content burst, no LLM-heavy steps. Complements the full evolution pipeline with daily incremental improvements.

**Features**:
- Site visit (3 key pages)
- System intelligence + UX audits
- UX auto-fix, system intelligence auto-fix, CTA tracking (when score < 85)
- Evolution backlog implementor (AUTO_APPLY=1, MAX_APPLY=3)
- Report aggregator
- Auto-commit and deploy on scheduled runs

**Runs**: Daily 8 AM UTC via GitHub Actions; workflow_dispatch

**Commands**:
```bash
npm run app:improvement-daily-quick
npm run app:improvement-daily-quick-commit
npm run app:improvement-daily-quick-deploy
```

---

### 24j1b. AI Evolution Backlog Implementor Agent 🆕
**Status**: Active | **Path**: `automation/ai-evolution-backlog-implementor-agent.cjs`

**Description**: Reads app-evolution-backlog.json and implements safeToAutoApply items. Lightweight, no LLM. Can run standalone or as part of daily quick pipeline.

**Environment**: `AUTO_APPLY=1`, `MAX_APPLY=N` (default 5)

**Commands**:
```bash
npm run app:backlog-implement
AUTO_APPLY=1 MAX_APPLY=3 npm run app:backlog-implement
```

---

### 24j. AI Content Burst Agent 🆕
**Status**: Active | **Path**: `automation/ai-content-burst-agent.cjs`

**Description**: Template-only maximum-velocity content. No LLM required. Runs template blog + template case studies + industry discovery + auto-create in parallel for fastest possible content creation.

**Features**:
- Template blog (12), template case studies (12), industry pages (6), product pages (4) per run
- All steps run in parallel (after industry discovery)
- Content cascade: homepage industry sync after creation (links generic → dedicated solution pages)
- `MAX_TEMPLATE_BLOG=12`, `MAX_TEMPLATE_CASE_STUDIES=12`, `MAX_INDUSTRY_PAGES=6`, `MAX_PRODUCT_PAGES=4`, `MAX_ADD=8`
- Zero API cost — template-based only
- Build validation before commit; Netlify deploy trigger after push
- Concurrency group `content-commit` prevents parallel content workflow commits

**Runs**: 11x daily (3/5/7/9/11/13/15/17/19/21/23 UTC) via GitHub Actions

**Commands**:
```bash
npm run content:burst
npm run content:burst-commit
npm run content:burst-deploy
```

---

### 24j3. AI Content Rapid Workflow 🆕
**Status**: Active | **Path**: `.github/workflows/ai-content-rapid.yml`

**Description**: High-frequency template-only content. Fills gaps between Content Burst runs. Same agent, defaults (8 blog, 8 case studies, 4 industry, 4 product pages, 6 front page apps per run).

**Features**:
- Runs at 4/6/8/10/12/14/16/18/20/22 UTC (10x daily)
- Combined with Content Burst + Content Velocity + Content Accelerator: ~26 content runs per day
- `MAX_TEMPLATE_BLOG=8`, `MAX_TEMPLATE_CASE_STUDIES=8`, `MAX_INDUSTRY_PAGES=4`, `MAX_PRODUCT_PAGES=4`, `MAX_ADD=6`
- Zero API cost — template-based only

**Runs**: 10x daily via GitHub Actions

**Commands**:
```bash
npm run content:rapid
```

---

### 24j4. AI Content Velocity Workflow 🆕
**Status**: Active | **Path**: `.github/workflows/ai-content-velocity.yml`

**Description**: Fills gaps at 0/1/2 UTC. Batches (3 blog, 3 case studies, 2 industry, 2 product pages, 3 front page apps per run). Maximum content velocity across the day.

**Features**:
- Runs at 0/1/2 UTC (3x daily)
- Combined with Burst (11x) + Rapid (10x) + Accelerator (2x): ~26 content runs per day
- `MAX_TEMPLATE_BLOG=3`, `MAX_TEMPLATE_CASE_STUDIES=3`, `MAX_INDUSTRY_PAGES=2`, `MAX_PRODUCT_PAGES=2`, `MAX_ADD=3`
- Zero API cost — template-based only

**Runs**: 3x daily via GitHub Actions

**Commands**:
```bash
npm run content:velocity
```

---

### 24j5. AI Content Accelerator Workflow 🆕
**Status**: Active | **Path**: `.github/workflows/ai-content-accelerator.yml`

**Description**: High-throughput off-peak runs. Maximum template content (15 blog, 15 case studies, 8 industry, 5 product pages, 10 front page apps per run). Runs at 1 AM and 2 PM UTC.

**Features**:
- Runs at 1 and 14 UTC (2x daily)
- Highest throughput per run: `MAX_TEMPLATE_BLOG=15`, `MAX_TEMPLATE_CASE_STUDIES=15`, `MAX_INDUSTRY_PAGES=8`, `MAX_PRODUCT_PAGES=5`, `MAX_ADD=10`
- Zero API cost — template-based only
- Build validation before commit; Netlify deploy trigger after push

**Runs**: 2x daily via GitHub Actions

**Commands**:
```bash
npm run content:accelerator
```

---

### 24j2. AI Ultra-Fast Content Pipeline
**Status**: Active | **Path**: `automation/ai-ultra-fast-content-pipeline.cjs`

**Description**: Maximum-velocity content generation. Phase 0 (no LLM): template blog + template case studies + industry discovery + auto-create. Phase 1-2: ideation + blog + front page + products. Throughput: 10 blog posts, 3 product pages, 3 industry pages, 5 template blog, 5 template case studies per run. Runs 6x daily (4/8/12/16/20/22 UTC).

**Features**:
- Phase 0: Industry discovery + auto-create + template blog + template case studies (no LLM)
- Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
- Phase 2: Blog (10) + Front Page + Product Creator (3) + Services Advertiser (parallel)
- `MAX_BLOG_POSTS=10`, `MAX_CONCURRENCY=10`, `MAX_PRODUCT_PAGES=3`, `MAX_INDUSTRY_PAGES=3`
- `SKIP_INDUSTRY_PAGES=1` to skip Phase 0

**LLM**: Ollama or `OPENROUTER_API_KEY` for Phase 1-2; Phase 0 requires no LLM

**Runs**: 6x daily (4/8/12/16/20/22 UTC) via GitHub Actions and cron

**Commands**:
```bash
npm run content:ultra-fast
npm run content:ultra-fast-commit
npm run content:ultra-fast-deploy
```

---

### 24j3. AI Content Ideas to Deploy Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-content-ideas-to-deploy-pipeline.cjs`

**Description**: Audits live site, generates content ideas (LLM), expands front page (LLM), runs template burst, then commits and deploys. Maximum content velocity with deploy-on-success. Fills gaps between ultra-fast and content burst.

**Features**:
- Phase 1: Content ideation + Content audit ideas (LLM — fetches ziontechgroup.com)
- Phase 2: Front page expansion (LLM — 2 industries, 2 case studies, 1 bundle, FAQ, momentum)
- Phase 3: Content burst (template blog + case studies + industry pages + services advertiser)
- Phase 4: Homepage industry sync
- Phase 5: Commit + push + deploy (when AUTO_COMMIT=1, TRIGGER_DEPLOY=1)

**Options**: `SKIP_IDEATION=1`, `SKIP_FRONT_PAGE=1`, `SKIP_BURST=1`, `MAX_TEMPLATE_BLOG=6`, `MAX_TEMPLATE_CASE_STUDIES=6`, `MAX_INDUSTRY_PAGES=4`, `MAX_ADD=5`

**LLM**: `OPENROUTER_API_KEY` or Ollama for ideation and front page expansion

**Runs**: 3x daily (9/14/19 UTC) via GitHub Actions and cron

**Commands**:
```bash
npm run content:ideas-deploy
npm run content:ideas-deploy-deploy   # AUTO_COMMIT=1 TRIGGER_DEPLOY=1
```

---

### 24k. AI Industry Solution Auto-Creator Agent 🆕
**Status**: Active | **Path**: `automation/ai-industry-solution-auto-creator-agent.cjs`

**Description**: Creates dedicated solution pages from industry discovery report using templates. No LLM required. Updates industries page hrefs and sitemap.

**Features**:
- Reads `industry-solution-discovery-latest.json` (run `nav:industry-discovery` first)
- Creates up to `MAX_PAGES=2` new solution pages per run
- Industry-specific app mappings (Technology & SaaS, Government, Banking, Telecom)
- Updates industries page and sitemap automatically

**Runs**: As part of Ultra-Fast Content Pipeline (Phase 0) or standalone

**Commands**:
```bash
npm run content:industry-create
```

---

### 24k2. AI Solutions Page Sync Agent 🆕
**Status**: Active | **Path**: `automation/ai-solutions-page-sync-agent.cjs`

**Description**: Keeps the solutions page Industry Solutions section in sync with the industries page. When industries page links to new solution pages, this agent adds the missing links to solutions page.

**Features**:
- Extracts industry hrefs from industries page
- Compares with solutions page Industry Solutions section
- With `--apply`: inserts missing links before "View All Industries"
- No LLM required

**Runs**: As part of Navigation & Pages Audit (after industry discovery)

**Commands**:
```bash
npm run nav:solutions-sync
npm run nav:pages:audit   # includes solutions sync
```

---

### 24l. AI Template Blog Creator Agent
**Status**: Active | **Path**: `automation/ai-template-blog-creator-agent.cjs`

**Description**: Creates blog posts from predefined templates. No LLM required. Fast, template-based content for instant indexable pages.

**Features**:
- 54 template topics (AI automation, securing AI models, implementation roadmap, CRM trends, DevOps automation, supply chain, responsible AI, HR/talent, edge AI, customer success, FinOps, agent frameworks, RAG, cybersecurity, sustainability/ESG, multimodal AI, product development, MLOps, sales enablement, generative AI, procurement, customer service, low-code AI, compliance, real estate, insurance, construction, warehousing, aviation, retail analytics, education, media, pharmaceuticals, fleet management, vector databases/RAG, cybersecurity operations, insurance underwriting, healthcare analytics, government services, fintech, climate tech, voice agents, document intelligence, quantum computing, blockchain/Web3, mining, agriculture, food & beverage, gaming, legal tech, and more)
- Creates standalone pages in `app/blog/[slug]/page.tsx`, updates blog index and BLOG_SLUGS
- `MAX_POSTS=10` per run (default in Content Burst)

**Runs**: As part of Content Burst, Content Rapid, Ultra-Fast Content Pipeline (Phase 0), or standalone

**Commands**:
```bash
npm run content:template-blog
```

---

### 24m. AI Template Case Study Creator Agent
**Status**: Active | **Path**: `automation/ai-template-case-study-creator-agent.cjs`

**Description**: Adds case studies to case-studies/page.tsx from predefined templates. No LLM required.

**Features**:
- 59 template case studies (Real Estate, Accounting, Veterinary, Home Services, Space, Apparel, Chemicals, Electronics, Transportation, Marketing, Legal, Education, Restaurants, Packaging, Warehousing, Mining, Construction, Hospitality, Non-Profit, Beauty & Wellness, Pharma, Banking, Energy, Aviation, Grocery, Staffing, Publishing, Fitness, Insurance, Construction change orders, Warehouse pick accuracy, Airlines crew scheduling, Retail personalization, University outcomes, Streaming moderation, Biotech trial recruitment, Aerospace supplier, Defense contractor, Maritime shipping, Telecom, Retail demand forecast, Oil & Gas refinery, FinTech, PropTech, EdTech, GovTech, Climate Tech, InsurTech, Mining, Agriculture, Food & Beverage, Gaming, Legal Tech, PropTech, CleanTech, and more)
- `MAX_CASE_STUDIES=12` per run (default in Content Burst)

**Runs**: As part of Content Burst, Content Rapid, Ultra-Fast Content Pipeline (Phase 0), or standalone

**Commands**:
```bash
npm run content:template-case-studies
```

---

### 25. AI Telegram Notification Agent 🆕
**Status**: Active | **Path**: `automation/ai-telegram-notification-agent.cjs`

**Description**: Sends automation alerts to Telegram (health, Lighthouse, security, stale content).

**Features**:
- Respects USER.md: no notifications 23:00–08:00 (America/Sao_Paulo)
- Urgent prefix `[URGENTE]` bypasses quiet hours
- Health, digest, Lighthouse, freshness subcommands

**Requires**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

**Runs**: Daily 9 AM digest via cron (after report aggregator)

**Commands**:
```bash
npm run telegram:send "message"
npm run telegram:health
npm run telegram:digest
npm run telegram:lighthouse
npm run telegram:freshness
```

---

### 26. AI Report Aggregator Agent 🆕
**Status**: Active | **Path**: `automation/ai-report-aggregator-agent.cjs`

**Description**: Aggregates automation reports into a single dashboard (JSON + HTML).

**Features**:
- Unified view: health, Lighthouse, content freshness, site health, dependencies
- Generates `aggregate-dashboard.json` and `aggregate-dashboard.html`
- Status: ok | warning | critical

**Runs**: Daily 7 AM via cron

**Commands**:
```bash
npm run reports:aggregate
```

---

### 27. AI Test Coverage Improvement Agent 🆕
**Status**: Active | **Path**: `automation/ai-test-coverage-improvement-agent.cjs`

**Description**: Identifies untested critical paths (app/, components/, lib/) and suggests tests.

**Features**:
- Runs coverage, finds uncovered/low-coverage critical files
- Generates actionable suggestions
- Complements ai-test-automation-agent (which generates tests)

**Runs**: Weekly Tuesday 5 AM via cron

**Commands**:
```bash
npm run test:coverage-improvement
```

---

### 28. AI Suggestion Importer Agent 🆕
**Status**: Active | **Path**: `automation/ai-suggestion-importer-agent.cjs`

**Description**: Reads ecosystem-suggestions.json and autonomously implements safe suggestions (cron jobs, etc.).

**Features**:
- Applies cron_job suggestions to automation.cron
- Logs workflow/enhancement suggestions for review
- Makes the ecosystem self-improving

**Runs**: Daily 6 AM via daily pipeline (after ecosystem intel)

**Commands**:
```bash
npm run suggestions:import
```

---

### 29. AI Daily Automation Pipeline 🆕
**Status**: Active | **Path**: `automation/ai-daily-automation-pipeline.cjs`

**Description**: Orchestrates key agents in sequence for a full daily run.

**Pipeline**: Ecosystem intel → Suggestion importer → Content freshness → SEO content refresh → Report aggregator → Telegram digest

**Runs**: Daily 6 AM via cron | Weekly Monday via GitHub Actions

**Commands**:
```bash
npm run automation:daily-pipeline
SKIP_TELEGRAM=1 npm run automation:daily-pipeline  # Skip Telegram
```

---

### 30. Broken Link Fixer - External Link History 🆕
**Status**: Active | **Path**: `automation/ai-broken-link-fixer.cjs`

**Enhancement**: Tracks external link health over time. Stores failure history in `automation/data/external-link-history.json`. Reports repeated failures (2+ times) for proactive maintenance.

---

### 30b. AI Broken Link & Page Automation 🆕
**Status**: Active | **Path**: `automation/ai-broken-link-page-automation.cjs`

**Description**: Audits the codebase for broken internal links and creates missing pages using OpenRouter LLM.

**Features**:
- Scans app/ and components/ for internal links
- Validates each link against existing pages
- Creates missing pages via OpenRouter (meta-llama free model) when `OPENROUTER_API_KEY` is set
- Excludes static assets (svg, json, etc.) and protocol-relative URLs
- Integrated into daily automation pipeline

**Runs**: Tue/Fri 7 AM via GitHub Actions | Part of `automation:daily-pipeline`

**Commands**:
```bash
npm run links:audit          # Audit only (no API key needed)
OPENROUTER_API_KEY=xxx npm run links:audit-fix  # Audit + create missing pages
```

**GitHub**: Add `OPENROUTER_API_KEY` to repo secrets for page-creation on manual dispatch.

---

### 30c. AI Site Link Audit Automation 🆕
**Status**: Active | **Path**: `automation/ai-site-link-audit-automation.cjs`

**Description**: Crawls the live production site (ziontechgroup.com), extracts internal links, validates HTTP status, and optionally creates missing pages via OpenRouter LLM.

**Features**:
- Fetches key pages from live site (home, services, products, solutions, etc.)
- Extracts all internal links from HTML
- Validates each link's HTTP status (200 vs 404)
- Creates missing pages via OpenRouter (meta-llama free model) when `--create-pages` and `OPENROUTER_API_KEY` are set
- Saves report to `automation/reports/site-link-audit-latest.json`
- Integrated into daily automation pipeline and broken-link workflow

**Runs**: Tue/Fri 8 AM via GitHub Actions | Part of `automation:daily-pipeline`

**Commands**:
```bash
npm run site:links:audit       # Audit live site (no API key needed)
OPENROUTER_API_KEY=xxx npm run site:links:audit-fix  # Audit + create missing pages
```

**GitHub**: Add `OPENROUTER_API_KEY` to repo secrets for page-creation on manual dispatch.

---

### 30d. AI Navigation Improvement Automation 🆕
**Status**: Active | **Path**: `automation/ai-navigation-improvement-automation.cjs`

**Description**: Audits ziontechgroup.com navigation and footer using OpenRouter LLM. Suggests improvements for nav/footer consistency, missing high-value pages, and conversion paths.

**Features**:
- Fetches live homepage HTML
- Compares nav constants and footer links against discovered routes
- Detects broken internal links
- Uses OpenRouter (meta-llama/llama-3.2-3b-instruct:free) for UX/IA improvement suggestions
- Saves report to `automation/reports/navigation-improvement-audit-latest.json`

**Runs**: Weekly Thursday 9 AM UTC via GitHub Actions | workflow_dispatch

**Commands**:
```bash
npm run nav:improve        # Full audit with LLM suggestions (OPENROUTER_API_KEY)
npm run nav:improve-audit  # Audit only (no API key needed)
```

**GitHub**: Add `OPENROUTER_API_KEY` to repo secrets for LLM suggestions.

---

### 31. AI Dependency Outdated Agent 🆕
**Status**: Active | **Path**: `automation/ai-dependency-outdated-agent.cjs`

**Description**: Lightweight agent that runs `npm outdated` and categorizes updates by major/minor/patch.

**Features**:
- Generates report with safe update recommendations
- Stores history in `automation/data/dependency-outdated-history.json`
- Complements ai-smart-dependency-manager

**Runs**: Weekly Thursday 5 AM via cron | Weekly Thursday via GitHub Actions

**Commands**:
```bash
npm run deps:outdated
npm run deps:outdated-summary
```

---

### 32. AI Bundle Size Monitor Agent 🆕
**Status**: Active | **Path**: `automation/ai-bundle-size-monitor-agent.cjs`

**Description**: Builds the app, measures output size, tracks history, and detects regressions.

**Features**:
- Alerts when bundle size increases >10% (configurable via BUNDLE_REGRESSION_THRESHOLD)
- Stores history in `automation/data/bundle-size-history.json`
- Complements PR bundle-size workflow

**Runs**: Weekly Friday 5 AM via cron | Weekly Thursday via GitHub Actions

**Commands**:
```bash
npm run bundle:monitor
npm run bundle:monitor-summary
```

---

### 33. AI Dead Code Detector Agent 🆕
**Status**: Active | **Path**: `automation/ai-dead-code-detector-agent.cjs`

**Description**: Uses depcheck to find unused dependencies and devDependencies.

**Features**:
- Generates actionable removal recommendations
- Reduces bundle size and maintenance burden

**Runs**: Weekly Thursday 4 AM via cron | Weekly Thursday via GitHub Actions

**Commands**:
```bash
npm run deadcode:detect
npm run deadcode:detect-summary
```

---

### 34. AI CI Failure Recovery Agent 🆕
**Status**: Active | **Path**: `automation/ai-ci-failure-recovery-agent.cjs`

**Description**: Diagnoses CI failures and attempts automated recovery (lint fix, type-check, tests).

**Features**:
- Runs lint:fix, type-check, test:ci
- Generates recovery report with next steps
- Optionally commits fixes when AUTO_COMMIT=1
- Triggered by GitHub Actions when CI fails on main

**Runs**: On-demand | workflow_dispatch | After CI failure via ai-ci-recovery.yml

**Commands**:
```bash
npm run ci:recovery
AUTO_COMMIT=1 npm run ci:recovery  # Auto-commit fixes
```

---

### 35. AI SEO Content Refresh Agent 🆕
**Status**: Active | **Path**: `automation/ai-seo-content-refresh-agent.cjs`

**Description**: Identifies high-value stale pages for content refresh (blog, services, solutions).

**Features**:
- Uses content freshness data
- Prioritizes by page type and staleness
- Generates actionable refresh recommendations
- Integrated into daily pipeline

**Runs**: Weekly Wednesday 5 AM via cron | Daily via pipeline

**Commands**:
```bash
npm run seo:content-refresh
npm run seo:content-refresh-summary
```

---

### 36. Python Agents (Lead Discovery, Email Interaction, Feature Promotion) 🆕
**Status**: Active | **Path**: `commands/`

**Description**: Python-based agents for lead discovery, email interaction, and feature promotion.

**Agents**:
- **Lead Discovery** (`zion_lead_discovery_agent.py`): Fetches leads from Crunchbase/Apollo, stores in PostgreSQL. Requires CRUNCHBASE_API_KEY, APOLLO_API_KEY, Postgres.
- **Email Interaction** (`zion_email_interaction_agent.py`): Monitors Gmail via gog CLI, AI-powered replies. Requires GOG_TOKEN, CURSOR_API_KEY.
- **Feature Promotion** (`zion_feature_promotion_agent.py`): Generates index.html from feature_promo.yml.

**Runs**: Lead discovery daily 8 AM | Email interaction every 2 hours | Feature promotion daily 7 AM (cron)

**Commands**:
```bash
npm run agents:lead-discovery
npm run agents:email-interaction
npm run agents:feature-promotion
npm run agents:python-all
```

---

### 37. AI Auto-Implementation Agent 🆕
**Status**: Active | **Path**: `automation/ai-auto-implementation-agent.cjs`

**Description**: Meta-agent that runs ecosystem intelligence and suggestion importer, optionally commits automation updates.

**Features**:
- Runs ecosystem intel → suggestion importer
- AUTO_COMMIT=1 to commit and push changes
- Makes the ecosystem self-improving

**Commands**:
```bash
npm run automation:auto-impl
AUTO_COMMIT=1 npm run automation:auto-impl-commit
```

---

### 38. AI Code Hygiene Agent 🆕
**Status**: Active | **Path**: `automation/ai-code-hygiene-agent.cjs`

**Description**: Proactive daily agent that runs lint:fix and type-check, commits auto-fixable changes before they reach CI.

**Features**:
- Runs npm run lint:fix
- Runs npm run type-check
- Commits only when lint made changes (AUTO_COMMIT=1)
- Complements ai-ci-failure-recovery-agent

**Runs**: Daily 5:30 AM via cron

**Commands**:
```bash
npm run hygiene:run
AUTO_COMMIT=1 npm run hygiene:run-commit
```

---

### 39. AI Cron Health Monitor Agent 🆕
**Status**: Active | **Path**: `automation/ai-cron-health-monitor-agent.cjs`

**Description**: Verifies cron jobs have run recently by checking log file mtimes.

**Features**:
- Maps cron jobs to log files
- Checks mtime against expected frequency
- Reports stale jobs that may have missed runs
- Integrated with report aggregator

**Runs**: Daily 8 AM via cron

**Commands**:
```bash
npm run cron:health
npm run cron:health-summary
```

---

### 40. AI Documentation Sync Agent 🆕
**Status**: Active | **Path**: `automation/ai-documentation-sync-agent.cjs`

**Description**: Keeps AI-SYSTEMS-OVERVIEW.md in sync with actual automation agents and workflows.

**Features**:
- Scans automation/ for ai-*.cjs agents
- Scans .github/workflows for workflows
- Reports agents/workflows missing from overview
- Integrated with report aggregator

**Runs**: Weekly Friday 6 AM via cron

**Commands**:
```bash
npm run docs:sync
npm run docs:sync-summary
```

---

### 41. AI Changelog Generator Agent 🆕
**Status**: Active | **Path**: `automation/ai-changelog-generator-agent.cjs`

**Description**: Auto-generates CHANGELOG.md from git commits (conventional commits).

**Features**:
- Parses commits since last N days (CHANGELOG_DAYS, default 30)
- Groups by type (feat, fix, chore, docs, etc.)
- AUTO_COMMIT=1 to commit changelog updates

**Runs**: Weekly Friday 7 AM via cron

**Commands**:
```bash
npm run changelog:generate
AUTO_COMMIT=1 npm run changelog:generate-commit
```

---

### 42. AI Memory Consolidation Agent 🆕
**Status**: Active | **Path**: `automation/ai-memory-consolidation-agent.cjs`

**Description**: Reads memory/YYYY-MM-DD.md files, extracts significant events and learnings, updates MEMORY.md with distilled content. Per AGENTS.md memory maintenance.

**Features**:
- Scans memory/ for daily files (last N days, MEMORY_DAYS_BACK=14)
- Extracts significant patterns (Added, Fixed, Merged, Decision, Lesson)
- Appends distilled entries to MEMORY.md with date prefix
- Trims MEMORY.md to last 100 entries (MEMORY_MAX_ENTRIES)
- DRY_RUN=1 for preview mode

**Runs**: Weekly Sunday 9 AM via cron

**Commands**:
```bash
npm run memory:consolidate
npm run memory:consolidate-summary
```

---

### 43. AI Dependency Vulnerability Alert Agent 🆕
**Status**: Active | **Path**: `automation/ai-dependency-vulnerability-alert-agent.cjs`

**Description**: Runs npm audit, sends Telegram alert for high/critical vulnerabilities.

**Features**:
- Complements weekly deps-security cron (low-risk auto-fix)
- Immediate visibility on critical/high vulns
- VULN_ALERT_THRESHOLD=high|critical

**Requires**: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

**Runs**: Weekly Sunday 3:30 AM via cron (after deps-security)

**Commands**:
```bash
npm run vuln:alert
npm run vuln:alert-summary
```

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│         AI App Improvement Specialist (NEW)              │
│         Comprehensive Analysis & Health Monitoring        │
│         Runs: Every 30 minutes                           │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────────┐
│              AI Master Orchestrator                       │
│              Coordinates All AI Agents                    │
│              Runs: Every hour                             │
└─────────────────────┬────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼────────┐ ┌─▼──────────────┐
│  Development │ │ Continuous  │ │  Code          │
│    Agent     │ │ Improvement │ │ Generator      │
│ (6 hours)    │ │ (10 min)    │ │ (Weekly)       │
└──────────────┘ └─────────────┘ └────────────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│          Comprehensive Continuous Automation              │
│          Master Fast Orchestrator                         │
│          Runs: Every 5 minutes                            │
└─────────────────────┬────────────────────────────────────┘
                      │
        ┌─────────────┼──────────────┬──────────────┐
        │             │              │              │
┌───────▼──────┐ ┌────▼────────┐ ┌──▼──────┐ ┌────▼──────┐
│ Error        │ │ Health      │ │ Auto    │ │ Syntax    │
│ Monitor      │ │ Checker     │ │ Fixer   │ │ Fixer     │
│ (5 min)      │ │ (3 min)     │ │ (10 min)│ │ (15 min)  │
└──────────────┘ └─────────────┘ └─────────┘ └───────────┘
```

## Health Monitoring

### Current System Health

- **Overall Health Score**: 96/100 ✅
- **Lint Errors**: 0 ✅
- **Type Errors**: 0 ✅
- **Security Vulnerabilities**: 0 ✅
- **Build Status**: Passing ✅
- **Accessibility Score**: 100/100 ✅
- **SEO Score**: 100/100 ✅
- **Test Coverage**: 11% ⚠️
- **Outdated Dependencies**: 7 ⚠️

### Health Score Breakdown

The health score (0-100) is calculated based on:

- **Code Quality** (30%)
  - Lint errors/warnings
  - Type errors
  - Code smells

- **Security** (35%)
  - Vulnerabilities (critical/high/moderate/low)
  - Insecure patterns

- **Build Status** (15%)
  - Build success/failure

- **Performance** (10%)
  - Bundle size
  - Large files

- **Testing** (5%)
  - Test coverage

- **Accessibility & SEO** (5%)
  - A11y score
  - SEO score

## PM2 Management

### View All Running Agents
```bash
pm2 list
```

### View Specific Agent
```bash
pm2 list | grep ai-app-improvement-specialist
```

### View Logs
```bash
# All AI agents
pm2 logs

# Specific agent
pm2 logs ai-app-improvement-specialist
```

### Start/Stop/Restart
```bash
# Start all agents
pm2 start ecosystem.config.cjs

# Start specific agent
pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist

# Stop all
pm2 stop all

# Stop specific
pm2 stop ai-app-improvement-specialist

# Restart all
pm2 restart all

# Restart specific
pm2 restart ai-app-improvement-specialist
```

### Monitor Status
```bash
pm2 monit
```

## Reports & Logs

### AI App Improvement Specialist Reports
- **Location**: `automation/reports/improvement-specialist/`
- **Latest**: `automation/reports/improvement-specialist/latest-report.json`
- **Historical**: `automation/reports/improvement-specialist/aais-report-{timestamp}.json`

### Logs
- **Location**: `automation/logs/`
- **AI App Improvement Specialist**: `automation/logs/aais-{date}.log`
- **Other Agents**: `automation/logs/{agent-name}.log`

## Environment Variables

### Required
- `GH_TOKEN` - GitHub token for automated commits/pushes

### Optional (for AI features)
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI GPT API key

### Optional (for social media)
- `LINKEDIN_ACCESS_TOKEN` - LinkedIn API token
- `LINKEDIN_URN` - LinkedIn URN
- `IG_USER_ID` - Instagram user ID
- `IG_ACCESS_TOKEN` - Instagram access token

### Configuration
- `AAIS_MODE` - Operation mode (standard|aggressive|conservative)
- `AAIS_CONTINUOUS` - Enable continuous mode (true|false)
- `AAIS_INTERVAL` - Minutes between runs (default: 30)
- `AAIS_AUTO_COMMIT` - Auto-commit changes (default: true)
- `AAIS_AUTO_PUSH` - Auto-push to remote (default: true)
- `AAIS_MAX_IMPROVEMENTS` - Max improvements per cycle (default: 15)
- `AAIS_MIN_HEALTH` - Target health score (default: 80)

## Best Practices

1. **Monitor Health Score**: Keep it above 80
2. **Review Reports**: Check daily for insights
3. **Update Dependencies**: Review outdated packages regularly
4. **Improve Test Coverage**: Add tests for critical paths
5. **Check Logs**: Monitor for errors or warnings
6. **Use Conservative Mode**: For production deployments
7. **Review Commits**: Check automated commits periodically

## Troubleshooting

### High CPU Usage
- Reduce PM2 agent frequency
- Use conservative mode
- Check for runaway processes

### High Memory Usage
- Increase `max_memory_restart` in ecosystem.config.cjs
- Reduce `maxImprovementsPerRun`
- Clear old logs

### Health Score Decreasing
- Check latest report for issues
- Run AI App Improvement Specialist in aggressive mode
- Review and fix critical issues manually

### Agent Not Running
```bash
# Check status
pm2 status

# Check logs
pm2 logs ai-app-improvement-specialist --lines 100

# Restart
pm2 restart ai-app-improvement-specialist
```

## Future Enhancements

- [ ] ML-based predictive maintenance
- [ ] Visual report dashboards (HTML/PDF)
- [x] Telegram notifications (ai-telegram-notification-agent.cjs)
- [ ] Multi-branch support
- [ ] Custom rule engine
- [ ] Integration with Jira/Linear
- [ ] Cost analysis tracking
- [ ] Technical debt visualization
- [ ] Performance benchmarking
- [ ] A/B testing automation
- [x] Ecosystem Intelligence Agent (suggests new automations)
- [x] Content Freshness Agent (stale content detection)
- [x] Weekly dependency security audit (cron)
- [x] Report aggregator (single dashboard view)
- [x] Test coverage improvement agent
- [x] Blog date metadata check
- [x] Python agents cron (lead discovery, email interaction, feature promotion)
- [x] Sitemap validation in CI (continue-on-error until coverage improved)
- [x] Auto-implementation agent (ecosystem intel + suggestion apply + optional commit)
- [x] Code hygiene agent (proactive lint/type fixes)
- [x] Cron health monitor (verify cron logs freshness)
- [x] Mid-week auto-implementation workflow (Wed 14 UTC)
- [x] Documentation sync agent (keeps AI-SYSTEMS-OVERVIEW in sync)
- [x] Changelog generator agent (conventional commits)
- [x] Dependency vulnerability alert agent (Telegram for high/critical)

---

**🤖 Powered by AI - Continuously Improving the Zion App**

Repository: https://github.com/Zion-Holdings/zion.app
Canonical URL: https://ziontechgroup.com

