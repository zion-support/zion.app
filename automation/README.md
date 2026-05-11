# 🤖 AI Development System

Autonomous AI-powered development and improvement system for continuous codebase evolution.

## Overview

This system consists of multiple AI agents that work together to continuously analyze, improve, and develop the application:

### Core Agents

1. **AI Continuous Improvement** (`ai-continuous-improvement-agent.cjs`)
   - Continuously audits and improves the codebase
   - Fixes quality and reliability issues
   - Produces improvement reports for follow-up cycles

2. **AI Build Fixer** (`ai-build-fixer-agent.cjs`)
   - Detects and remediates build-breaking regressions
   - Applies guarded fixes for recurring failures
   - Improves build stability over time

3. **AI App Improvement Specialist** (`ai-app-improvement-specialist.cjs`)
   - Runs app-focused improvement cycles
   - Prioritizes safe, high-impact enhancements
   - Supports autonomous quality evolution

4. **AI PM2 Restart Guardian** (`ai-pm2-restart-guardian.cjs`)
   - Monitors restart spikes and unhealthy process states
   - Writes PM2 health reports
   - Auto-heals unstable processes with cooldown protection

5. **AI Smart Dependency Manager** (`ai-smart-dependency-manager.cjs`)
   - **Security & Optimization**: Autonomous dependency management
   - Detects and fixes security vulnerabilities automatically
   - Analyzes and removes unused dependencies
   - Identifies duplicate dependencies across the tree
   - Analyzes bundle size and suggests lighter alternatives
   - Calculates dependency health score (0-100)
   - Generates comprehensive dependency reports
   - Auto-commits fixes and optimizations

6. **AI Content Optimization** (`ai-content-optimization-automation.js`)
   - Optimizes content for SEO
   - Improves readability
   - Enhances engagement
   - Adds meta tags
   - Optimizes images

7. **Layout & Design Automation** (`ai-layout-design-automation-pipeline-full.cjs`) 🆕
   - **Layout/design improvements**: Audits live site and codebase, applies safe layout fixes
   - Runs Live Site UX Audit → Layout Design Audit (LLM or heuristic) → Layout Implementation
   - Optional auto-commit and push; can trigger Netlify deploy
   - Scheduled via PM2 cron (e.g. every 6 hours)
   - Use: `npm run layout:automation-commit` or `pm2 start ecosystem.config.cjs --only ai-layout-design-automation`

## Features

### Automated Improvements

- ✅ **Linting & Type Checking** - Automatically fixes ESLint and TypeScript errors
- 🔒 **Security Scanning** - Identifies and fixes security vulnerabilities
- ⚡ **Performance Optimization** - Detects and optimizes slow code
- ♿ **Accessibility** - Adds ARIA labels, alt text, and improves a11y
- 🧪 **Test Coverage** - Identifies missing tests
- 📝 **Code Quality** - Removes console.log, improves structure
- 📦 **Dependency Management** - Monitors outdated packages

### AI-Powered Generation

- 🎨 **Component Generation** - Create new React components with AI
- 🧪 **Test Generation** - Generate comprehensive test suites
- 📚 **Documentation** - Auto-generate component documentation
- 🔧 **Refactoring** - Intelligent code refactoring
- 🐛 **Bug Fixing** - AI-assisted bug resolution
- 💡 **Feature Suggestions** - Generate new feature ideas

### Continuous Operation

- ⏰ **Scheduled Runs** - Automatic periodic execution
- 🔄 **Health Monitoring** - Continuous system health checks
- 📊 **Reporting** - Detailed analysis and improvement reports
- 🚀 **Auto-Deploy** - Automatic commit and push to main branch

## Reliability validators (PM2 + AI Lab)

- `npm run validate:pm2-singleton-policy` — validates `automation/config/pm2-singleton-policy.json`
- `npm run validate:pm2-singleton-ecosystem` — policy singleton names must exist in `ecosystem.config.cjs` (runs in `ai-pm2-static-checks` CI)
- `npm run validate:ai-lab-route-contract` — `app/ai-lab/ai-lab-tools.ts` ↔ `automation/data/pages-to-visit.json` (`aiLab`) ↔ `config/smoke-routes.txt` (CI + `autonomy:prepush-gate`)
- `npm run ai-lab:legacy-scaffold-scan` — writes `ai-lab-legacy-scaffold-scan-latest.json` + rolling `ai-lab-legacy-scaffold-scan-history.json` (legacy gradient shell without `AILabToolLayout`; review-only)
- `npm run ai-lab:legacy-scaffold:escalate` — dynamic threshold from history (unless `AI_LAB_LEGACY_SCAFFOLD_THRESHOLD` set), cross-workflow cooldown via `automation/lib/incident-cooldown-mesh.cjs` + `observability-webhook-state.json`, writes `ai-lab-legacy-scaffold-watchdog-latest.json`; deduped GitHub issue; auto-closes on recovery
- `npm run ai-lab:legacy-scaffold-migrate` (`:apply`) — safe migrator for exact legacy template matches only (opt-in apply)
- `npm run ai-lab:safe-scaffold-open-pr` — if exact-template candidates exist: apply, lint, type-check, branch, draft PR (for CI: `.github/workflows/ai-ai-lab-safe-scaffold-migrate-pr.yml`)
- `npm run ai-lab:hub-links:smoke` + compare/escalate — Playwright smoke supports transient retry+jitter (`AI_LAB_HUB_LINKS_MAX_ATTEMPTS`, `AI_LAB_HUB_LINKS_RETRY_BASE_DELAY_MS`, `AI_LAB_HUB_LINKS_RETRY_MAX_DELAY_MS`) and explicit report targeting (`OUT_FILE`, `TARGET_NAME`); compare keeps flake-state/history; escalation suppresses flaky-only warnings (`AI_LAB_HUB_FLAKE_SUPPRESS_*`), routes warning vs critical notifications (`AI_LAB_HUB_*` webhooks/routing-key), and auto-close comments include recovery evidence from latest compare/prod reports.
- `npm run ai-lab:route-contract:auto-pr` — opens draft route-contract autofix PR and auto-assigns via CODEOWNERS fallback (override with `AI_LAB_ROUTE_CONTRACT_ASSIGNEE`).
- `npm run openclaw:skills:audit` — audits OpenClaw worker-skill cadence and PM2 wiring (`openclaw-autonomous-prompts`, guardian, trend adapter, regression memory), writes `openclaw-skill-cadence-audit-latest.json`, and is scheduled in `.github/workflows/ai-openclaw-skill-cadence-audit.yml` with deduped incident escalation/recovery.
- `npm run openclaw:skills:tune` — reads OpenClaw confidence trend + skill cadence audit and emits adaptive runtime hints (`OPENCLAW_FREQUENCY_SECONDS`, `OPENCLAW_MAX_PARALLEL`) into `openclaw-skill-auto-tuner-latest.json`; scheduled in `.github/workflows/ai-openclaw-skill-auto-tuner.yml` with stabilize-mode issue dedupe/recovery.
- `npm run openclaw:runtime:apply` — applies bounded OpenClaw runtime overrides (`openclaw-runtime-overrides.json`) from tuner output with guardrails and history (`openclaw-runtime-overrides-history.json`); scheduled in `.github/workflows/ai-openclaw-runtime-applier.yml` with skipped-apply deduped escalation and recovery closure.
- `npm run ai:experiment:ledger` — converts OpenClaw tuning/runtime outputs into a bounded experiment outcome ledger (`experiment-outcome-ledger-latest.json`, `experiment-outcome-ledger-history.json`) with degradation detection; scheduled in `.github/workflows/ai-experiment-outcome-ledger.yml` with deduped issue escalation + recovery auto-close.

**AI Lab integrity guardian** (`npm run ai-lab:integrity`): optional `AUTO_SMOKE_ROUTES_SYNC` regenerates `config/smoke-routes.txt` after remediating missing routes.

**Local deploy** (`node commands/deploy.cjs`): set `DEPLOY_PM2_DUPLICATE_RECONCILE=1` to run the duplicate-process healer once after the deploy lock clears (hosts with PM2).

## Installation

### Prerequisites

```bash
# Node.js 18+ required
node --version

# PM2 for process management
npm install -g pm2
```

### Environment Variables

Set up environment variables in Netlify or your deployment platform:

```bash
# AI API Keys (at least one required for AI Code Generator)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# GitHub Token for automated commits/pushes
GH_TOKEN=your_github_token

# Optional: Configuration
AUTO_COMMIT=true
AUTO_PUSH=true
MAX_CONCURRENT_TASKS=3
```

## Usage

### Manual Execution

#### AI Development Agent

```bash
# Run one-time analysis and improvements
node automation/ai-development-agent.cjs run

# Run continuously with periodic analysis
node automation/ai-development-agent.cjs continuous

# Analysis only (no changes)
node automation/ai-development-agent.cjs analyze
```

#### AI Code Generator

```bash
# Analyze a file
node automation/ai-code-generator.cjs analyze src/pages/index.tsx

# Generate a new component
node automation/ai-code-generator.cjs component Button "A reusable button component"

# Generate tests for a file
node automation/ai-code-generator.cjs tests src/components/Header.tsx

# Refactor code
node automation/ai-code-generator.cjs refactor src/utils/api.ts "Use async/await instead of promises"

# Fix bugs
node automation/ai-code-generator.cjs fix src/pages/dashboard.tsx "Fix memory leak in useEffect"

# Generate documentation
node automation/ai-code-generator.cjs docs src/components/Card.tsx

# Suggest new features
node automation/ai-code-generator.cjs features

# Optimize performance
node automation/ai-code-generator.cjs optimize src/pages/products.tsx
```

#### AI Master Orchestrator

```bash
# Run one orchestration cycle
node automation/ai-master-orchestrator.cjs run

# Run continuously
node automation/ai-master-orchestrator.cjs continuous
```

#### AI PM2 Optimization Agent 🆕

```bash
# Run one-time PM2 optimization
node automation/ai-pm2-optimization-agent.cjs run

# Run continuously (optimizes every 2 hours)
node automation/ai-pm2-optimization-agent.cjs continuous

# View current PM2 metrics only
node automation/ai-pm2-optimization-agent.cjs metrics

# Using npm scripts
npm run pm2:optimize              # One-time run
npm run pm2:optimize-continuous   # Continuous mode
npm run pm2:metrics               # View metrics
npm run pm2:optimize-report       # View latest report
```

### PM2 Management

```bash
# Start all AI agents
pm2 start ecosystem.config.cjs

# Start key reliability agents
pm2 start ecosystem.config.cjs --only ai-continuous-improvement
pm2 start ecosystem.config.cjs --only ai-build-fixer
pm2 start ecosystem.config.cjs --only ai-app-improvement-specialist
pm2 start ecosystem.config.cjs --only ai-smart-dependency-manager
pm2 start ecosystem.config.cjs --only ai-pm2-restart-guardian

# View logs
pm2 logs ai-continuous-improvement
pm2 logs ai-build-fixer
pm2 logs ai-smart-dependency-manager
pm2 logs ai-pm2-restart-guardian

# Monitor status
pm2 status
pm2 monit

# Stop agents
pm2 stop ecosystem.config.cjs

# Restart agents
pm2 restart ecosystem.config.cjs --update-env

# Delete agents
pm2 delete ecosystem.config.cjs
```

### PM2 Restart Guardian Report

`ai-pm2-restart-guardian` writes its latest health snapshot to:

- `automation/reports/pm2-restart-guardian-latest.json`

### Openclaw Autonomous System

Openclaw runs as a specialized autonomous subsystem for rapid app-improvement prompting.

- Runtime scripts:
  - `automation/openclaw-improver-history-merge.cjs` → `openclaw-improver-history-merged-latest.json`
  - `automation/gha-workflow-cost-estimator.cjs` → `gha-workflow-cost-estimate-latest.json`
  - `automation/aggregate-dashboard-deploy-guard.cjs` (`DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL=1` to hard-fail)
  - `automation/ai-report-history-cap-guard.cjs` (in `npm run reports:hygiene:check`)
  - `automation/openclaw-pr-hotfile-comment.cjs` + `openclaw-pr-hotfile-labels.cjs` (workflow `ai-openclaw-pr-hotfile-comment.yml` — refreshes router, comments, applies labels)
  - `automation/openclaw-autonomous-app-improver.cjs`
  - `automation/openclaw-autonomous-guardian.cjs`
  - `automation/openclaw-action-executor.cjs`
  - `automation/openclaw-auto-pr-router.cjs`
  - `automation/openclaw-prompt-quality-scorer.cjs`
  - `automation/openclaw-confidence-trend-adapter.cjs`
  - `automation/openclaw-deploy-confidence-gate.cjs`
  - `automation/openclaw-regression-memory-agent.cjs`
  - `automation/openclaw-deploy-preflight-orchestrator.cjs`
  - `automation/openclaw-merge-ledger-agent.cjs`
  - `automation/openclaw-conflict-predictor.cjs`
  - `automation/openclaw-report-write-coalescer.cjs`
  - `automation/openclaw-commit-window-guard.cjs`
- Skill config:
  - `automation/config/openclaw-agent-skills.json`
- Reports/logs:
  - `automation/reports/openclaw-autonomous-app-improver-latest.json`
  - `automation/reports/openclaw-autonomous-app-improver-history.json` (throttled git snapshot; env `OPENCLAW_GIT_HISTORY_*`)
  - `automation/reports/.runtime/openclaw-autonomous-app-improver-history.json` (full ring buffer; gitignored)
  - `automation/logs/openclaw-autonomous-app-improver.log`

Key commands:

```bash
npm run openclaw:autonomous-once
npm run openclaw:autonomous-guardian-once
npm run openclaw:stack:start
npm run openclaw:stack:status
npm run openclaw:insights
npm run openclaw:preflight
npm run openclaw:autonomy:stability
```

Optional **git hooks** (install once: `npm run git:hooks:install`): pre-commit runs `openclaw-pre-commit-hooks.cjs` (report budget + optional `PATCH_ROUTER_AUTO_REFRESH=1`); pre-push runs full stability only if `OPENCLAW_STABILITY_ON_PUSH=1`. See `scripts/git-hooks/README.md` and `docs/git-hooks-cross-platform.md`. Lefthook: `npm run openclaw:lefthook:install`. Merge-freeze push: `MERGE_FREEZE_ON_PUSH=1 npm run push:merge-freeze -- origin main`.

- **Autonomy handoff** (agents): `npm run openclaw:autonomy:handoff` → `openclaw-autonomy-handoff-latest.json` (also appended to `openclaw:insights`).
- **PR report budget**: `npm run openclaw:report:budget:pr` with `PR_BUDGET_BASE=origin/<branch>` (used in `ai-openclaw-pr-merge-stability.yml`).
- **Policy**: `openclaw-action-policy-engine.cjs` enforces hot-file `patchMode` on recommended commands unless `OPENCLAW_POLICY_IGNORE_PATCH_MODE=1`; history → `openclaw-action-policy-history.json`.
- **Runner**: `npm run openclaw:runner` / `openclaw:runner:exec` — telemetry `openclaw-runner-latest.json`; `OPENCLAW_RUNNER_FIXTURE_DIR` for `__tests__/openclaw-runner-contract.test.js`.
- **Policy MD dashboard**: `npm run openclaw:policy:dashboard` (also invoked from report aggregator).
- **Runner guard**: `.github/workflows/ai-openclaw-runner-guard.yml` — scheduled dry-run with one-shot self-heal retry, reason-specific remediation hooks before escalation, adaptive cooldown windows by reason/repeat count, reason-class repeat severity labels (`automation-slo-warning`/`automation-slo-critical`) on final failures, shared issue-body builder + fingerprint dedupe (`dedupe_result` output: route only on `commented`/`created`), bounded `openclaw-runner-history.json`, auto-close after healthy-streak recovery, **label strip** before recovery close, **reason routing** (`openclaw-runner-route-incident.cjs`, `notifyFormat` + critical-tier `notifyCriticalFormat`/`notifyCriticalEnvVar` per bucket, HTTP/HTTPS webhooks, delta-only + per-reason cooldown state in `openclaw-runner-route-state.json`, stale-state TTL cleanup, optional runbook comments + `runbookOwner` auto-assignee with CODEOWNERS fallback, secrets `OPENCLAW_RUNNER_NOTIFY_*` + optional `OPENCLAW_RUNNER_NOTIFY_*_CRITICAL`), **anomaly** detector with severity + bounded history (`openclaw-runner-anomaly-history.json`) + comment + **artifact upload** on anomaly, plus a dedicated deduped **critical anomaly** incident loop (`openclaw-runner-anomaly|critical|v1`) that opens only after 2 consecutive critical runs, auto-assigns owner (`OPENCLAW_RUNNER_ANOMALY_CRITICAL_ASSIGNEE` var fallback to CODEOWNERS), and auto-closes on severity recovery.
- **PR hot-file**: `ai-openclaw-pr-merge-stability.yml` upserts comments with `<!-- openclaw-hotfile:thread -->`.

Openclaw-specific workflows:
- `.github/workflows/ai-openclaw-autonomous-cycle.yml`
- `.github/workflows/ai-openclaw-freshness-sla.yml`
- `.github/workflows/ai-openclaw-incident-escalator.yml`
- `.github/workflows/ai-openclaw-auth-runtime-diagnostic.yml`
- `.github/workflows/ai-next-build-lock-guardian.yml`
- `.github/workflows/ai-openclaw-pr-merge-stability.yml`
- `.github/workflows/ai-openclaw-runner-guard.yml`
- `.github/workflows/ai-openclaw-anomaly-trend-breach.yml` (hourly tiered critical-cluster breach guard: warning/critical deduped issue loops + optional warn/crit webhooks)

Additional Openclaw reliability command:

```bash
npm run openclaw:auth:diagnose
npm run build:lock:check
npm run build:lock:heal
npm run openclaw:actions:policy
npm run artifacts:freshness:mesh
```

### CI observability (scheduled / dispatch)

- `npm run smoke:production:sample` — HTTPS sample against production (`SMOKE_FAIL_ON_ERROR=1` in Actions); report: `automation/reports/scheduled-production-smoke-latest.json`. Workflow: `ai-production-smoke-scheduled.yml`.
- `npm run smoke:health:append` — append prod + preview snapshot to `automation/reports/smoke-health-history.json` (capped; used by Deploy Drift Dashboard sparkline). Netlify preview smoke: `ai-netlify-preview-smoke-scheduled.yml` (every 2h) + `scripts/automation/smoke-netlify-deploy-preview.cjs` (failure class: transport/http/mixed).
- `npm run gha:audit:npm-cache` — flags workflows using `npm ci`/`install` without `setup-node` npm cache. Strict: `GHA_NPM_CACHE_AUDIT_STRICT=1`. Workflow: `ai-gha-npm-cache-audit-scheduled.yml`.
- `npm run routes:drift:sitemap` — static `app/**/page.tsx` routes vs live sitemap (`SITEMAP_URL`). Workflow: `ai-route-sitemap-drift-scheduled.yml`.
- `npm run deps:outdated:train` + `npm run deps:patch-only:report` — dependency train + patch-only classifier (monthly workflow `ai-dependency-upgrade-train-monthly.yml`).
- `npm run reports:aggregate` + `npm run deploy:aggregate:guard` — dashboard aggregation + deploy guard (`ai-aggregate-dashboard-refresh.yml`).
- `ai-openclaw-insights-ci.yml` — split Openclaw insight steps with artifacts (manual dispatch + weekly cron).
- `npm run aggregate:regression:check` — critical/Openclaw regression snapshot → `aggregate-dashboard-regression-latest.json` (runs in `ai-aggregate-dashboard-refresh.yml` after regenerate).
- `npm run observability:digest` — merges smoke + GHA cache audit + route/sitemap reports → `observability-digest-latest.json` (also embeds fingerprint digest + trend JSON and OpenClaw runner anomaly summary when report files exist under `automation/reports/`). Workflow: `ai-observability-digest.yml` now runs `smoke:health:append` + `release:risk:score` before `observability-digest.cjs` so `summary.releaseRisk*` is populated when inputs exist.
- `npm run autonomy:intelligence:plan` — converts observability + release-risk + trust/routing/runner signals into prioritized autonomous actions (`autonomy-intelligence-plan-latest.json`). Workflow: `ai-autonomy-intelligence-planner-daily.yml` (daily + manual), with deduped issue escalation below score 70 and auto-close on recovery at 80+.
- `npm run automation:fingerprint-digest:metrics` — exports `automation-fingerprint-incidents-metrics.prom` from latest digest + trend snapshots.
- PRs touching fingerprint digest logic get `automation-digest-touched` via `ai-automation-fingerprint-digest-pr-label.yml`.
- PRs touching `automation/**` run `ai-automation-fingerprint-digest-preflight.yml`; digest freshness SLA + recovery close: `npm run automation:fingerprint-digest:freshness` / `ai-automation-fingerprint-digest-freshness.yml`.
- `ai-gha-npm-cache-audit-pr.yml` — on PRs that touch `.github/workflows/**`, runs audit with **`GHA_NPM_CACHE_AUDIT_STRICT=1`**.
- `ai-route-sitemap-drift-scheduled.yml` — drift report + fingerprint escalation / recovery (`route-sitemap-drift-escalate.cjs`, fingerprint `route-sitemap-drift`).
- `ai-patch-only-auto-pr.yml` — gated draft PR for patch-only bumps; enable repo variable **`PATCH_ONLY_AUTO_PR=1`** or manual dispatch with **force**.
- `npm run aggregate:regression:escalate` — opens/updates fingerprint issue `aggregate-dashboard-regression` when aggregate regression alerts are non-zero.
- `ai-aggregate-regression-alert.yml` — 12-hour aggregate refresh + regression artifact + deduped issue escalation/recovery close.
- `npm run aggregate:regression:diff` — compares current vs previous aggregate regression snapshot, tracks worsening deltas and persists state.
- `ai-aggregate-regression-diff-alert.yml` — 12-hour worsening detector with deduped issue escalation (`aggregate-regression-diff-worsened`) and recovery auto-close.
- `npm run aggregate:regression:diff:history` — appends bounded trend points for worsened/recovered/stable status.
- `npm run release:risk:score` / `npm run release:risk:score:refresh` — unified risk score from regression diff + route drift + prod smoke streak (`release-risk-score-latest.json`). Workflow: `ai-release-risk-score.yml` (daily + dispatch). `npm run release:risk:escalate` posts cooldown-gated dedupe issue **`release-risk-elevated`**. `npm run release:risk:recovery:close` closes that issue after **consecutive** low-risk runs. `automation/release-risk-acceleration-guard.cjs` opens/closes deduped **`release-risk-acceleration-worsening`** when history shows sustained sharp worsening/recovery. `npm run release:risk:webhook:notify` optional Slack/Discord/generic. `RELEASE_RISK_SCALE_*` env vars tune component weights. See `docs/automation-release-risk.md`.
- `ai-automation-context-pr-comment.yml` — upserts one consolidated PR context thread using latest `main` snapshots (automation health + derived automation risk + release risk), reducing duplicate bot comments (`npm run automation:pr:context-comment`).
- `npm run automation:issue-index` + `npm run automation:triage:weekly:digest` — digest markdown → `weekly-automation-triage-digest-latest.md`; `npm run automation:triage:weekly:issue` upserts dedupe issue **`weekly-automation-triage-digest`**. Workflow: `ai-weekly-automation-triage-digest.yml` (weekly).
- `ai-conservative-autofix-audit.yml` — manual dispatch only; uploads `npm audit` JSON + runs lint (informational).
- `npm run deps:patch-only:stale-pr:cleanup` — closes stale draft patch-only PRs after `PATCH_ONLY_STALE_DAYS` (default 10).
- `ai-patch-only-stale-pr-cleanup.yml` — weekly stale patch-only draft PR cleanup.
- **EMA / fingerprint webhook digest** — `npm run automation:observability-webhook` reads `incident-suppression-registry-latest.json` + `automation-open-issues-index-latest.json`, posts to optional `AUTOMATION_DIGEST_SLACK_WEBHOOK` / `DISCORD_WEBHOOK_URL` / `GENERIC_WEBHOOK_URL`, and can escalate dual breaches to PagerDuty/Opsgenie (`OBSERVABILITY_PAGERDUTY_ROUTING_KEY`, `OBSERVABILITY_OPSGENIE_WEBHOOK_URL`); writes cooldown state + trend history (`observability-webhook-state.json`, `observability-ema-fp-history.json`). Workflow: `ai-observability-ema-webhook-daily.yml`.
- **Netlify preview smoke** — after deploy-on-push resolves `NETLIFY_DEPLOY_URL`, `npm run automation:smoke-netlify-preview` curls a few `config/smoke-routes.txt` paths on that host; report: `automation/reports/netlify-preview-smoke-latest.json`, artifact uploads every run, and repeated failures auto-escalate via `npm run automation:smoke-netlify-preview:escalate` (dedupe fingerprint `netlify-preview-smoke-repeated`) with streak state in `netlify-preview-smoke-state.json`. Resolver polling/cache: `NETLIFY_DEPLOY_POLL_ATTEMPTS`, `NETLIFY_DEPLOY_POLL_DELAY_MS`, `NETLIFY_DEPLOY_CACHE_TTL_MS`.
- **Sibling incident cross-links** — `npm run automation:sibling-crosslink` comments on open `automation-incident` issues that share the same `correlationId` in the body (rate-limited via `automation/reports/sibling-crosslink-state.json`). Workflow: `ai-incident-sibling-crosslink-weekly.yml`.
- **Automation health snapshot** — `npm run automation:health:snapshot` writes `automation/reports/automation-health-latest.json` (SLO 0–100, delta vs prior, telemetry freshness timestamps) + appends `automation/reports/automation-health-history.json` for trend sparklines. Refreshed in deploy-on-push + `ai-observability-ema-webhook-daily.yml` (both commit history when changed). PRs touching app/automation/workflows get an upserted context comment via `ai-automation-health-pr-comment.yml` (`npm run automation:health:pr-comment`).
- **Fingerprint digest cluster rollup** — when open FP issues ≥ `DIGEST_CLUSTER_COMPACT_MIN_OPEN` (default 6) or `DIGEST_CLUSTER_COMPACT_NOTIFY=1`, Slack/Discord/Telegram use a compact per-label-cluster summary instead of noisy per-issue lines (`DIGEST_CLUSTER_COMPACT_NOTIFY=0` disables auto mode).
- **Observability freshness guard** — `npm run automation:observability:freshness` validates `observability-ema-fp-history.json` freshness (default 48h max age) and opens a deduped issue on breach. Workflow: `ai-observability-history-freshness-guard.yml`.
- **GitHub integrity + fix-factory loop** — `npm run automation:github-actions:integrity:audit` scans workflow permissions/action pinning/timeouts into `github-actions-integrity-audit-latest.json`; `npm run automation:fix-factory:orchestrate` builds an autonomous remediation queue (`autonomous-fix-factory-plan-latest.{json,md}`, `autonomous-fix-factory-queue.json`) and can open deduped backlog incidents. Workflow: `ai-github-integrity-fix-factory.yml` runs every 10 minutes with artifact + state commit.
- **Workflow integrity trust score** — `npm run automation:workflow-integrity:audit` writes duplicate/malformed workflow findings to `github-workflow-integrity-audit-latest.json`; `npm run automation:workflow-trust:score` converts findings into `workflow-trust-score-latest.json` (`high|medium|low|critical`) for dashboard-visible reliability signal.
- **Lead form routing guard** — `npm run automation:lead-form-routing:guard` validates contact/newsletter routing to `commercial@ziontechgroup.com` and writes `lead-form-routing-guard-latest.json`; workflow `ai-lead-form-routing-guard-daily.yml` runs every 10 minutes with deduped issue escalation/recovery auto-close.
- **Synthetic lead routing intelligence** — `npm run automation:lead-routing:synthetic:v2` checks explicit contact/newsletter surfaces (`ContactFormClient`, `NewsletterSignup`, `BlogNewsletterSignup`, `contact/page`) for commercial-routing tokens and emits v2 reports. `npm run automation:lead-routing:synthetic:trend:v3` tracks streak/regression state and escalates sustained drift.
- **Workflow trust trend guard** — `npm run automation:workflow-trust:history:append` records bounded trust history; `npm run automation:workflow-trust:regression:guard` escalates sustained trust drops and auto-closes on recovery. Workflow: `ai-workflow-trust-regression-guard.yml` (every 30 minutes).

### GitHub Actions

The system automatically runs via GitHub Actions:

- **Every 6 hours** - AI Development Agent analyzes and improves code
- **On push to main** - Triggered after changes
- **Manual trigger** - Via GitHub Actions UI

View workflow: `.github/workflows/ai-development-agent.yml`

## Configuration

### AI Development Agent

Edit `automation/config/ai-development-config.json`:

```json
{
  "enabledFeatures": {
    "bugFixes": true,
    "performance": true,
    "codeQuality": true,
    "newFeatures": true,
    "testing": true,
    "documentation": true,
    "security": true,
    "accessibility": true,
    "seo": true
  },
  "priorities": {
    "critical": ["security", "bugFixes"],
    "high": ["performance", "accessibility"],
    "medium": ["codeQuality", "testing"],
    "low": ["documentation", "seo"]
  },
  "autoCommit": true,
  "autoPush": true,
  "maxChangesPerRun": 5,
  "analysisInterval": 3600000,
  "featureSuggestions": true,
  "aiProvider": "anthropic",
  "repository": "https://github.com/Zion-Holdings/zion.app",
  "canonicalUrl": "https://ziontechgroup.com"
}
```

## Reports & Logs

### Report Files

- `automation/logs/ai-development-report.json` - Development agent analysis
- `automation/logs/orchestrator-report.json` - Master orchestrator status
- `automation/logs/orchestrator-state.json` - System state and task queue

### Log Files

- `automation/logs/ai-development.log` - Development agent logs
- `automation/logs/ai-code-generator.log` - Code generator logs
- `automation/logs/ai-master-orchestrator.log` - Orchestrator logs

### Generated Files

- `automation/generated/` - AI-generated components, tests, and documentation

## Architecture

```
┌─────────────────────────────────────────┐
│      AI Master Orchestrator             │
│  (Coordinates all agents & tasks)       │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼──────────┐  ┌────▼─────────────┐
│  Development │  │  Code Generator  │
│    Agent     │  │   (AI-Powered)   │
└───┬──────────┘  └────┬─────────────┘
    │                  │
    │  ┌───────────────┘
    │  │
┌───▼──▼────────────────────────────────┐
│         Codebase Changes              │
│   (Auto-committed and pushed)         │
└───────────────────────────────────────┘
```

## Workflow

1. **Analysis Phase**
   - AI Development Agent scans codebase
   - Identifies errors, warnings, and improvements
   - Calculates health score and metrics

2. **Prioritization Phase**
   - Master Orchestrator receives analysis
   - Prioritizes tasks by severity and category
   - Queues tasks for execution

3. **Execution Phase**
   - Agents execute high-priority tasks
   - Apply automatic fixes
   - Use AI for complex improvements

4. **Commit Phase**
   - Changes are automatically staged
   - Descriptive commit messages generated
   - Pushed to main branch

5. **Reporting Phase**
   - Comprehensive reports generated
   - Metrics updated
   - Health history tracked

## Visit → Audit → Implement → Deploy

Canonical loop for **app improvement and evolution** driven by visiting https://ziontechgroup.com:

| Workflow | Schedule | What it does |
|----------|----------|--------------|
| **App Visit Audit Implement Deploy** | Wed 12 UTC, Sat 14 UTC, manual | Runs `ai-app-evolution-audit-pipeline.cjs`: Phase 0 (UX, layout, automation, site links) → Phase 1 (ideation + evolution ideas) → Phase 1.5 (evolution backlog apply AUTO_APPLY=1) → Phase 2 (blog, front page, product, services) → Phase 3 (commit + push to main + Netlify deploy). |
| **AI Live App Audit** | Fri 8 UTC, manual | Live UX + site link audits → `live-app-audit-latest.json`. Optional: `apply_fix` (broken link + UX auto-fix), `auto_commit` (commit/push). Complements live UX (Tue) and visit-audit-deploy (Wed/Sat). See `APP-VISIT-AUDIT-2025-03-07-LIVE.md`. |
| **AI Weekly Content & SEO Hygiene** | Mon 06 UTC, manual | Content freshness audit + SEO meta auditor; uploads reports as artifacts. |
| **AI App Evolution Audit** | Sat 14 UTC, manual | Same pipeline; alternate trigger. |
| **AI Weekly Live Ideas Implement** | Tue 8 UTC, manual | Lightweight: live UX + system intel + conversion funnel audits → evolution ideas from audits → backlog apply (AUTO_APPLY=1, MAX_APPLY=3) → optional commit/push and Netlify deploy. Complements full evolution pipeline (Wed/Sat). |
| **AI App Visit Intelligence** | Mon 14 UTC, manual | Visit pages → system intel + UX + conversion + local LLM specialists + evolution implement + auto-fix → commit/deploy. |
| **AI Navigation Audit & Fix** | Wed + Sat 8 UTC, manual | Runs `ai-navigation-audit-agent.cjs`: full audit (broken links, footer vs nav) + optional safe fixes (sync footer to RESOURCE_LINKS) + optional commit/push. |
| **AI Navigation & Pages Audit** | Thu 9:30 UTC, manual | Runs nav audit + nav fix + industry discovery + solutions/homepage sync + site link audit. Optional `create_pages` input creates missing pages via OpenRouter. Workflow: `ai-navigation-pages-audit.yml`. |
| **AI Ideas to Implementation** | 4x daily (4/8/12/16 UTC) | Ideation + blog + front page + product pages → commit + push to main + optional deploy. |
| **AI Content Ideas to Deploy** | 3x daily (9/14/19 UTC) | Ideation + front page + template burst → commit + push to main + deploy. |
| **AI Ultra-Fast Content** | 6x daily (4/8/12/16/20/22 UTC) | Industry + template blog/case studies + blog + front page + products → commit + push to main + deploy. |
| **AI Content Maximum Velocity** | 1x daily (10 UTC), manual | Ultra-fast with elevated limits (blog 14, products 5, industry 5, template 8/8) → push to main + deploy. |
| **AI Content Burst High Frequency** | 8x daily (1/4/7/10/13/16/19/22 UTC), manual | Template-only content burst (blog 4, case studies 4, industry 2, product 1) → commit + push + deploy. Maximum volume without extra LLM cost. See `automation/APP-CONTENT-AUDIT-2025-03-07.md`. |
| **AI Live Content Ideas** | Mon/Wed/Fri 5 UTC, manual | Live-site-driven: content-audit-ideas (fetches ziontechgroup.com) → ultra-fast pipeline (blog uses audit ideas) → upload ideas report artifact → commit + push + deploy. |
| **AI Services & Content Automation** | 3x daily (6/12/18 UTC), manual | Promote apps to front page, sync Core Services from /services to homepage, product pages, template blog/case studies, industry discovery → commit + deploy. |
| **AI Front Page Services & Content** | Tue 7 UTC, Fri 7 UTC, manual | Dedicated front-page run: services advertiser + Core Services sync + **Advanced AI sync** + product/template/industry → commit + deploy. |

See `automation/APP-VISIT-AUDIT-2025-03-07.md` for the full audit and automation recommendations. See `automation/APP-CONTENT-AUDIT-2025-03-07.md` for content automation audit and new high-frequency / live-ideas workflows.

### GitHub Actions & quality (scheduled)

| Workflow | Schedule / trigger | What it does |
|----------|--------------------|---------------|
| **AI GitHub Actions & App Audit** | Sun 9 UTC, manual | Audits all workflows + live app via OpenRouter; writes suggestions; implementation agent can apply safe workflow improvements and create new workflows. |
| **AI Live Site Accessibility Audit** | Thu 7 UTC, manual | Runs `ai-live-site-accessibility-audit-agent.cjs` against live ziontechgroup.com; uploads a11y report artifact. |
| **AI Live Site UX Audit** | Tue 7 UTC, manual | Runs `app:ux-audit` (heuristic UX/SEO) against live ziontechgroup.com; uploads report artifact (feeds layout/evolution). |
| **AI Layout Design Automation** | Tue 10 UTC, Fri 11 UTC, manual | Full pipeline: Live Site UX Audit → Layout Design Audit → Layout Implementation. Auto-commits and pushes on schedule. See `automation/APP-LAYOUT-DESIGN-AUDIT-2025-03-07.md`. |
| **AI Weekly Dependency Hygiene** | Sun 8 UTC, manual | npm audit + dependency outdated report; uploads artifacts; optionally creates/updates issue when critical or high vulns found. |
| **AI Accessibility Audit** | Tue 8 UTC, PR (app/**) | Build + serve dist + axe-core on key pages; comments on PR with violation count. |
| **Production Health Monitor** | Every 6h, manual | HTTP check + SSL expiry + security headers on key pages; creates issue on failures. |
| **AI Production Deploy Validation** | After Deploy on Push | Sitemap validation, SEO meta audit, production link check, quick Core Web Vitals (homepage) sample. |

### Autonomous Agent Expansion (GitHub-first)

New guardrails and autonomous monitors (balanced reliability + quality + growth):

| Workflow | Schedule / trigger | Command | Purpose |
|----------|--------------------|---------|---------|
| **Autonomous Release Guardian** | Every 30 min, manual | `npm run autonomy:release-guardian` | Polls promoted routes and flags release-health regressions; writes JSON/MD report and opens issue on warnings. |
| **Autonomous Quality Drift Sentinel** | Every 6h at :45, manual | `npm run autonomy:quality-drift` | Tracks lint/type/test/build drift and failure streaks; writes history + report artifacts and escalates on sustained failures. |
| **Autonomous Growth Signal Monitor** | Every 8h at :15, manual | `npm run autonomy:growth-signal` | Validates homepage/catalog growth integrity, promoted route health, and discovery signals with escalation when degraded. |
| **Autonomous Writer Queue Guard** | Every 20 min, manual | `npm run autonomy:queue-guard` | Detects concurrent autonomous writer runs and opens incidents for queue contention. |

Runbook:

- Keep autonomous writer workflows serialized with shared concurrency group `autonomous-main-writer`.
- Use `:strict` script variants for fail-fast enforcement in blocking pipelines.
- Treat issue spikes as threshold-tuning signals; adjust values in `scripts/automation/autonomy-agent-config.cjs`.
- Reports are written to `automation/reports/` and uploaded as workflow artifacts for cross-run analysis.

See `automation/GITHUB-ACTIONS-APP-AUDIT-2025-03-07.md` for the full GitHub Actions and app audit. See `automation/APP-LAYOUT-DESIGN-AUDIT-2025-03-07.md` for layout and design audit and automation details.

### Broken links & missing pages

| Automation | Schedule / trigger | What it does |
|-----------|--------------------|---------------|
| **AI Broken Link Fixer** | Mon + Thu 6:30 UTC, push to `app/**`/`src/**`, manual | Scans codebase for links (TS/TSX/JS/MD), validates internal routes and external URLs. Auto-fixes broken internal links (typos, trailing slash). Pushes to main on success. Workflow: `.github/workflows/ai-broken-link-fixer.yml`. Run locally: `node automation/ai-broken-link-fixer.cjs run`. |
| **Site Link Audit** | Manual | Crawls live site (ziontechgroup.com), collects internal links, checks HTTP status. Optional `--create-pages` creates missing pages via OpenRouter LLM. Run: `node automation/ai-site-link-audit-automation.cjs audit` or `OPENROUTER_API_KEY=xxx node automation/ai-site-link-audit-automation.cjs run --create-pages`. Report: `automation/reports/site-link-audit-latest.json`. |
| **Broken Link & Missing Page (codebase)** | Manual (workflow_dispatch) | `ai-broken-link-page-automation.cjs`: audits codebase for broken internal links, creates missing pages via OpenRouter. Workflow: `.github/workflows/ai-broken-link-page-automation.yml` with `create_pages` input. |

**Front page services sync:** `ai-front-page-core-services-sync-agent.cjs` keeps the homepage "Core Services" section in sync with `app/services/page.tsx`: when new service categories are added to /services, they are added to the front page. No LLM required. Run: `node automation/ai-front-page-core-services-sync-agent.cjs run`. Wired into AI Services & Content Automation and AI App Evolution Audit pipelines.

**Advanced AI services sync:** `ai-front-page-advanced-ai-sync-agent.cjs` discovers `app/ai-services/*` pages, adds missing entries to `AI_SERVICE_LINKS` in `app/constants/navigation.ts`, and adds new Advanced AI cards to the homepage when new advanced-ai slugs exist. Run: `npm run content:advanced-ai-sync`. Wired into AI Services & Content Automation and AI Front Page Services & Content workflow.
| **Navigation & Pages Audit** | Thu 9:30 UTC, manual | `ai-navigation-pages-audit-automation.cjs`: nav audit + fix + industry discovery + solutions/homepage sync + site link audit. Optional `--create-pages` (workflow input `create_pages`) creates missing pages via site link audit. Run: `npm run nav:pages:audit` or `npm run nav:pages:audit-create`. |

## Health Monitoring

The system tracks health metrics:

- **Lint Errors** - ESLint violations
- **Type Errors** - TypeScript errors
- **Security Issues** - npm audit vulnerabilities
- **Bundle Size** - Build output size
- **Test Coverage** - Percentage of tested code
- **Performance** - Page load times

Health Score calculation:
- Start at 100
- -10 points per critical error
- -5 points per medium error
- -2 points per warning
- -0.5 points per suggestion

## Best Practices

### For Development

1. **Monitor Reports** - Check daily reports for improvements
2. **Review Changes** - Periodically review automated commits
3. **Adjust Config** - Fine-tune agent behavior in config files
4. **Set Limits** - Use `maxChangesPerRun` to control pace
5. **API Keys** - Keep AI API keys in environment variables only

### For Deployment

1. **Use PM2** - Run agents as background processes
2. **Log Rotation** - Use log cleaner to manage log sizes
3. **Error Alerts** - Monitor PM2 logs for failures
4. **Resource Limits** - Set memory limits in ecosystem.config.cjs
5. **Backup State** - Regularly backup orchestrator state file

## Troubleshooting

### Agent Not Running

```bash
# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs ai-continuous-improvement --lines 100

# Restart agent
pm2 restart ai-continuous-improvement
```

### No Changes Being Made

1. Check `autoCommit` is `true` in config
2. Verify git credentials are configured
3. Check if there are actual issues to fix
4. Review logs for error messages

### AI Generator Fails

1. Verify API keys are set: `echo $ANTHROPIC_API_KEY`
2. Check API key validity
3. Ensure sufficient API credits
4. Review error logs for rate limiting

### High Memory Usage

1. Reduce `maxChangesPerRun` in config
2. Increase `max_memory_restart` in ecosystem.config.cjs
3. Run agents less frequently
4. Clear old logs and reports

## Deploy & incident correlation (optional secrets)

- **`NETLIFY_BUILD_HOOK`**: triggers production builds (existing).
- **`NETLIFY_AUTH_TOKEN`** + **`NETLIFY_SITE_ID`**: optional; `deploy-on-push` runs `scripts/automation/fetch-netlify-deploy-for-sha.cjs` after smoke checks to set `NETLIFY_DEPLOY_ID` / `NETLIFY_DEPLOY_URL` for `deploy-status-latest.json` (suppression registry + Deploy Drift Dashboard).
- **`npm run automation:issue-index`**: builds `automation-open-issues-index-latest.json` plus MTTR trend history in `automation-issue-mttr-history.json` (weekly workflow `ai-automation-issue-index-weekly.yml`; requires `gh` auth).
- **`automation/ai-mttr-slo-guard.cjs`** (daily `ai-mttr-slo-guard-daily.yml`): streak-based GitHub issue on global MTTR SLO breach, optional **PagerDuty** when critical streak + enough open `automation-fp-*` issues + cooldown (`MTTR_SLO_PD_*` env; repo secret `MTTR_SLO_PAGERDUTY_ROUTING_KEY`), per-fingerprint regression hints, composite health score, and `automation-mttr-slo-metrics.prom` for scraping.
- **`automation/ai-mttr-fingerprint-regression-guard.cjs`** (daily `ai-mttr-fingerprint-regression-daily.yml`): opens deduped per-fingerprint MTTR regression issues after sustained worsening (`MTTR_FP_*` knobs), applies warning/critical severity bands (`MTTR_FP_CRITICAL_*`), syncs severity labels on existing open issues, writes severity-transition comments, arbitrates mesh suppression by priority score (`priorityScore`), and emits suppression explainability report `mttr-fingerprint-suppression-explainability-latest.json`.

## Contributing

To add new agent capabilities:

1. Create new agent file in `automation/`
2. Add CLI interface for manual testing
3. Add to ecosystem.config.cjs for PM2
4. Update this README
5. Test thoroughly before enabling auto-commit

## License

Part of the Zion Tech Group project.

## Support

For issues or questions:
- Check logs in `automation/logs/`
- Review reports in report files
- Contact: https://ziontechgroup.com

---

**🤖 Powered by AI - Continuously improving your codebase**

