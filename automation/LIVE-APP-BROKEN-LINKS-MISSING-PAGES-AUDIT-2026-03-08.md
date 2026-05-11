# Live App Audit: Broken Links & Missing Pages (2026-03-08)

Audit of https://ziontechgroup.com to verify broken-link and create-missing-pages automations. Live site visited and local scripts run 2026-03-08.

## Audit Summary

| Check | Result |
|-------|--------|
| **Live site link audit** | 157 internal links crawled, **0 broken** |
| **Codebase broken-link fixer** | 617 links scanned, **0 broken** |
| **Missing pages (live)** | **0** (all linked routes return 200) |
| **Missing pages (codebase)** | Handled by ai-broken-link-page-automation when referenced links have no page |

## Live Site Snapshot

- **Base URL:** https://ziontechgroup.com
- **Crawl paths:** 69 (home, services, solutions, blog, contact, case-studies, industries, etc.)
- **Links collected:** 157 unique internal links (all validated OK)
- **Report:** `automation/reports/site-link-audit-latest.json`

## Automations in Place

### Fix broken links
- **ai-broken-link-fixer.cjs** – Scans app/components and app for href/Link; validates internal (file existence) and external (HTTP); auto-fixes internal broken links. Report: `automation/reports/broken-link-fixer-latest-report.json`.
- **Workflow:** `ai-broken-link-fixer.yml` – Mon/Thu 06:30 UTC, on push to app/src/components, workflow_dispatch.

### Create missing pages
- **ai-site-link-audit-automation.cjs** – Crawls live site, checks each internal link HTTP status; with `--create-pages` and `OPENROUTER_API_KEY`, creates missing pages (404s) via LLM. Report: `automation/reports/site-link-audit-latest.json`.
- **ai-broken-link-page-automation.cjs** – Audits codebase for internal links that don’t have a page; with `OPENROUTER_API_KEY`, creates up to 10 missing pages per run via LLM.
- **Workflows:**
  - **ai-site-link-audit-automation.yml** – Tue/Fri 08 UTC; optional create_pages via workflow_dispatch.
  - **ai-broken-link-page-automation.yml** – Tue/Fri 07 UTC; optional create_pages via workflow_dispatch (runs fixer + live create + codebase create, then commit & push).

### Weekly auto-fix (links + pages)
- **ai-weekly-live-app-audit-auto-fix.yml** – Sat 9 UTC. Runs: live UX audit, merge ideas, automation ideas, evolution ideas, live nav audit, site link audit, broken-link fixer, **create missing pages (live)** when broken > 0, **create missing pages (codebase)** when `OPENROUTER_API_KEY` set, UX auto-fix, layout audit + apply, SEO meta audit; commit & push; Netlify deploy.

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

## Conclusion

- No broken links on live site or in codebase at audit time.
- No missing pages required; all linked routes exist and return 200.
- Existing automations are sufficient: weekly auto-fix, weekly live link audit, broken-link fixer, and create-missing-pages workflows will fix any future breakage when OPENROUTER_API_KEY is set.

## References

- `automation/LIVE-SITE-LINK-AUDIT-2026-03-08.md` – Link audit and automation summary
- `automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md` – Workflow index
- `automation/ai-broken-link-fixer.cjs`
- `automation/ai-site-link-audit-automation.cjs`
- `automation/ai-broken-link-page-automation.cjs`
