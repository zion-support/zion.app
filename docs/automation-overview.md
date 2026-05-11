# Automation Overview

High-level overview of core automation systems powering continuous improvement for `ziontechgroup.com`.

- For a detailed, always-up-to-date map of agents and workflows, see `automation/AI-SYSTEMS-OVERVIEW.md`.
- For app-audit–specific strategy, see `docs/AUTOMATION-STRATEGY.md`.

## Site Improvement Loop

- **Daily quick improvements**: `npm run app:improvement-daily-quick`
- **Evolution pipeline**: `npm run app:improvement-evolution`
- **Site improvement agent** (this plan): `node automation/ai-site-improvement-agent.cjs`
  - Pulls latest `main`
  - Runs the daily quick pipeline
  - Optionally runs `app:audit` and `app:audit-apply`
  - Writes `automation/reports/site-improvement-agent-latest.json`

GitHub workflows:

- `ci-cd.yml` – main CI (lint, type-check, tests, build, sitemap validation)
- `deploy-on-push.yml` – Netlify deploy after successful CI on `main`
- `site-improv-agent.yml` – scheduled site improvement agent (daily at 07:00 UTC)

