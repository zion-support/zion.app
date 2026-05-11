# Site Improvement Playbook

End-to-end flow for autonomous improvements to `ziontechgroup.com` driven by audits and agents.

## Core Pipelines

- **App Audit** – `npm run app:audit`
  - Audits live production pages using the multi-provider LLM chain (OpenRouter and fallbacks).
  - Writes `automation/reports/app-audit-automation-latest.json` and `automation/data/app-audit-suggestions.json`.
- **App Audit Apply** – `npm run app:audit-apply`
  - Reads `app-audit-suggestions.json` and applies safe, high-priority SEO/meta improvements.
  - Honours `automation/app-audit.config.json` for categories, priority thresholds, and apply rules.
- **Daily Quick Improvement** – `npm run app:improvement-daily-quick`
  - Fast, heuristic improvements (no heavy LLM) for UX, CTA tracking, and backlog implementation.
- **Evolution Pipelines**
  - `npm run app:improvement-evolution`
  - `npm run app:evolution-audit`

## Configuration

- `automation/app-audit.config.json`
  - Controls which categories and priorities are included in the app audit suggestions.
  - Example keys:
    - `enabledCategories`: `["content","ux","seo","performance","conversion","feature"]`
    - `minPriority`: `"medium"`
    - `maxSuggestions`: `40`
    - `quickWinsPerPage`: `5`
    - `requireHighPrioritySeoForApply`: `true`
- `automation/site-improv.config.json`
  - Controls the behaviour of the site improvement agent.
  - Example keys:
    - `mode`: `"daily-quick"`
    - `scope`: `"core"`
    - `runAppAudit`: `true`
    - `runAppAuditApply`: `true`
    - `allowLowRiskAutoApply`: `true`

## Agents and Workflows

- **AI App Audit Automation Agent**
  - Path: `automation/ai-app-audit-automation-agent.cjs`
  - Script: `npm run app:audit`
- **AI App Audit Implementation Agent**
  - Path: `automation/ai-app-audit-implementation-agent.cjs`
  - Script: `npm run app:audit-apply`
- **AI Site Improvement Agent**
  - Path: `automation/ai-site-improvement-agent.cjs`
  - Invoked from `.github/workflows/site-improv-agent.yml`.
  - Steps:
    1. `git pull --rebase origin main`
    2. `npm run app:improvement-daily-quick`
    3. Optionally `npm run app:audit` and `npm run app:audit-apply`
    4. Emit `automation/reports/site-improvement-agent-latest.json`

## Observability & Rollback

- **Automation Dashboard Page**
  - Path: `app/automation-status/page.tsx`
  - Reads `automation/reports/aggregate-dashboard.json` at build time.
  - Shows overall status and section-level health for AI systems.
- **Revert Helper**
  - Path: `commands/revert-last-automation.ts`
  - Prints the most recent automation-related commit and a suggested `git revert` command.
  - Intended for manual use when rolling back an automation-driven change.

## Future Ideas

- **Conversion Guard Agent**
  - Periodically crawls key funnels (homepage, top app pages, `/contact`, `/pricing`) and asserts the presence of canonical CTAs (e.g. `Start a Project` → `/contact?topic=project`, pricing links, consultation links).
  - Emits structured failures into `automation/reports/conversion-guard-latest.json` and surfaces them on the `automation-status` dashboard.
- **Broken-Experience Auto-Fix Agent**
  - Extends the existing link/image audits to propose or auto-create thin placeholder pages for frequently hit 404s, wired to contact/consultation flows.
  - Writes suggested routes and copy into `automation/data/broken-experience-suggestions.json` for manual review or safe auto-apply.
- **User Signal Ingestion**
  - Ingests anonymized analytics (click-through on CTAs, scroll depth, bounce rate by route) into a lightweight warehouse and correlates with audit scores.
  - Feeds a small prioritization model that reorders the evolution backlog toward the highest-impact UX and conversion fixes.

