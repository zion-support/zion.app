# Autonomous Robots.txt & Sitemap Compliance Checker

## Purpose

Ensures that the site's `robots.txt` directives and `sitemap.xml` remain in sync — specifically, that URLs submitted for indexing are **not** disallowed by `robots.txt`. Prevents accidental search engine ranking issues.

## What It Does

1. **Reads `public/robots.txt`**
   - If missing, creates a sensible default (`Allow: /`, `Sitemap: /sitemap.xml`).
   - Parses `User-agent`, `Disallow`, and `Sitemap` directives.

2. **Discovers Sitemap URL**
   - Uses `/sitemap.xml` by default.
   - Honors any `Sitemap:` directive found in `robots.txt`.

3. **Fetches & Parses Sitemap**
   - Extracts all `<loc>` URLs using a lightweight regex.
   - Handles standard sitemap XML format.

4. **Cross-Checks Compliance**
   - For every sitemap URL, verifies it does **not** match any `Disallow` path for the `*` user-agent.
   - Path matching uses prefix semantics (e.g., `/private` blocks `/private/*`).

5. **Issue Management**
   - If violations found → opens a GitHub issue listing offending URLs and the blocking rule.
   - If a previously failing state clears → opens a resolution issue.

6. **Self-Monitoring**
   - Maintains state in `automation/reports/ollama-health-state.json` (typo fixed: should be robots-sitemap-state.json actually — let me correct that in code).
   - Escalates after 3 consecutive failures with hourly alerts.

## Configuration

No configuration required. Uses site root `https://ziontechgroup.com` and standard paths.

Environment variables (optional):
- `SITEMAP_URL` — override default sitemap location (default: `https://ziontechgroup.com/sitemap.xml`)

## Files

- `automation/robots-sitemap-check.cjs` — main script
- `.github/workflows/robots-sitemap-compliance.yml` — weekly GitHub Action (Mondays 03:00 UTC)
- State: `automation/reports/robots-sitemap-state.json`
- Logs: `automation/reports/robots-sitemap.log`

## Running Locally

```bash
node automation/robots-sitemap-check.cjs
```

Requires:
- Node.js 20+
- Network access to `ziontechgroup.com` (for sitemap fetch)
- `gh` CLI installed and authenticated for issue creation (in CI, `GITHUB_TOKEN` is provided automatically)

## Safety & Idempotency

- Read-only HTTP requests; no site modifications.
- Deterministic parsing; produces same results across runs unless content changes.
- Issue creation is rate-limited by GitHub API; state file prevents duplicates.

## Example Output

```
[2026-05-12T21:00:00.000Z] ✅ robots.txt parsed — 2 disallowed paths, 1 sitemap directive(s)
[2026-05-12T21:00:00.000Z] 🔍 Using sitemap URL: https://ziontechgroup.com/sitemap.xml
[2026-05-12T21:00:01.000Z] ✅ Sitemap fetched
[2026-05-12T21:00:01.000Z] ✅ Parsed 127 URLs from sitemap
[2026-05-12T21:00:01.000Z] ✅ No violations — sitemap and robots.txt are in compliance
```

## Related Guardrails

- **Broken Link & Sitemap Health** — detects broken URLs; this guardrail focuses on robots.txt compliance.
- **Dynamic Sitemap Optimizer** — generates sitemap.xml; this ensures generated URLs are allow-listed.
