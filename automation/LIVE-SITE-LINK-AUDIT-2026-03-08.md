# Live Site Link Audit (2026-03-08)

Audit of https://ziontechgroup.com for broken links and missing pages. Drives automations to fix links and create missing pages.

## Audit Summary (2026-03-08)

| Check | Result |
|-------|--------|
| **Live site link audit** | 156 internal links crawled, **0 broken** |
| **Codebase link scan** | 623 links validated, **0 broken** |
| **Codebase referenced vs pages** | **0** referenced links without a page |

**Last run:** Live audit and codebase scan executed 2026-03-08; all links OK. No missing pages detected.

## Automations in Place

### Fix broken links
- **ai-broken-link-fixer.cjs** – Scans app/components for href/Link; validates internal (file existence) and external (HTTP); auto-fixes internal broken links. Reports to `automation/reports/broken-link-fixer-latest-report.json`.
- **Workflow:** `ai-broken-link-fixer.yml` – Mon/Thu 06:30 UTC, on push to app/src/components, workflow_dispatch.

### Create missing pages
- **ai-site-link-audit-automation.cjs** – Crawls live site, checks each internal link HTTP status; with `--create-pages` and `OPENROUTER_API_KEY`, creates missing pages (404s) via LLM. Report: `automation/reports/site-link-audit-latest.json`.
- **ai-broken-link-page-automation.cjs** – Audits codebase for internal links that don’t have a page; with `OPENROUTER_API_KEY`, creates up to 10 missing pages per run via LLM.
- **Workflows:**
  - `ai-site-link-audit-automation.yml` – Tue/Fri 08 UTC; optional create_pages via workflow_dispatch.
  - `ai-broken-link-page-automation.yml` – Tue/Fri 07 UTC; optional create_pages via workflow_dispatch (runs fixer + live create + codebase create, then commit & push).

### Weekly auto-fix (links + pages)
- **ai-weekly-live-app-audit-auto-fix.yml** – Sat 9 UTC. Runs: live UX audit, site link audit, broken-link fixer, **create missing pages (live)** when broken > 0, **create missing pages (codebase)** when `OPENROUTER_API_KEY` set, UX auto-fix, commit & push, Netlify deploy.

### Weekly live link report
- **ai-weekly-live-link-audit.yml** – Thu 9 UTC. Runs site link audit; creates/updates issue if broken count ≥ threshold (default 5). Uploads `site-link-audit-latest.json`.

## Commands

```bash
npm run site:links:audit          # Live site link audit only
npm run site:links:audit-fix      # Live audit + create missing pages (needs OPENROUTER_API_KEY)
npm run site:links:validate       # Exit 1 if any broken
npm run links:fix                 # Run broken-link fixer once
npm run links:scan                # Scan only, no fix
npm run links:audit               # Codebase audit (referenced vs pages)
npm run links:audit-fix           # Codebase audit + create missing pages
```

## References

- `automation/ai-broken-link-fixer.cjs`
- `automation/ai-site-link-audit-automation.cjs`
- `automation/ai-broken-link-page-automation.cjs`
- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md`
