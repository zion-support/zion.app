# Autonomous Dependency Update & Safe Auto-Merge Bot

> Keeps dependencies current with zero manual intervention, while enforcing safety gates.

## Overview

The Dependency Update Bot runs daily (06:00 UTC) to detect outdated packages, create PRs for minor/patch updates, and optionally auto-merge when all checks pass. It's designed for **security**, **hygiene**, and **developer sanity**.

**Status:** ✅ Guardrail #37 — Active

## What It Does

1. **Scans** `package.json` + `package-lock.json` using `npm outdated --json`
2. **Filters** — includes minor/patch only by default; majors excluded (configurable)
3. **Batches** — groups updates into PRs of ≤20 packages (configurable) to keep reviews manageable
4. **Creates** — isolated Git branch (`deps/update-YYYY-MM-DD-HHMM`) + PR with changelog summary
5. **CI Gates** — PR triggers full CI (lint, type-check, tests, build) automatically
6. **Safe Auto-Merge** (optional) — merges only if:
   - All required CI checks pass
   - No version conflicts
   - Bundle size increase ≤ threshold (future guard)
7. **Alerts** — Telegram summary every morning with outcomes
8. **Audit Trail** — state stored in `.hermes/memory/dependency-bot/history.json`

## Configuration

| Environment Variable | Default | Purpose |
|---|---|---|
| `DEPENDENCY_BOT_DRY_RUN` | `true` | Test mode — no PRs created |
| `DEPENDENCY_BOT_ALLOW_MAJOR` | `false` | Include major version updates |
| `DEPENDENCY_BOT_IGNORE` | `""` | Comma-separated package names to skip |
| `DEPENDENCY_BOT_MAX_BATCH` | `20` | Max packages per PR |
| `DEPENDENCY_BOT_MANUAL_REVIEW` | `true` | Require human approval before merge |
| `DEPENDENCY_BOT_MAX_PR_AGE_HOURS` | `48` | Auto-abandon stale PRs |

**Secrets (GitHub Actions):**
- `GITHUB_TOKEN` — provided automatically; used by `gh` CLI
- Optional: `DEPENDENCY_BOT_ALLOW_MAJOR`, `DEPENDENCY_BOT_IGNORE`, `DEPENDENCY_BOT_MAX_BATCH`, `DEPENDENCY_BOT_MANUAL_REVIEW`

## Files

- **Script:** `automation/dependency-update-bot.cjs`
- **Workflow:** `.github/workflows/dependency-update-bot.yml` (scheduled daily + manual dispatch)
- **Docs:** `docs/DEPENDENCY-UPDATE-BOT.md` (this file)
- **State:** `.hermes/memory/dependency-bot/` (history, last-run, PR log)

## Safety Guarantees

- **No forced auto-merge** — manual review required by default; can be relaxed when confidence high
- **No major bumps** — excluded unless explicitly enabled (breaking changes need human eyes)
- **CI-gated** — every PR must pass lint, type-check, tests, build
- **Batch limits** — prevents sweeping changes; keeps PRs reviewable
- **Lockfile integrity** — uses `npm ci` in clean workspace; lockfile always committed
- **Graceful failures** — transients retry once; failures send Telegram alert
- **Dry-run by default** — test thoroughly before enabling production mode

## Operation Details

### Daily Run
1. Workflow triggers at 06:00 UTC
2. Checks out repo; installs dependencies via `npm ci`
3. Executes `node automation/dependency-update-bot.cjs`
4. Bot produces:
   - New Git branch
   - `package.json` + `package-lock.json` updates
   - Pull Request via `gh pr create`
5. Telegram summary sent (success or failure)

### PR Lifecycle
- PR opens with clear changelog: `- pkg: old → new`
- CI runs automatically on PR
- If `DEPENDENCY_BOT_MANUAL_REVIEW=true` (default): human merges via GitHub UI after verifying CI
- If auto-merge enabled: bot can merge automatically after CI passes (future enhancement)

### State & History
All runs are logged under `.hermes/memory/dependency-bot/`:
- `history.json` — array of runs with branch, updates, PR URL, timestamp
- `last-run.json` — most recent execution metadata

## Usage

### Manual Trigger
Go to **Actions → Dependency Update Bot → Run workflow** and optionally set "dry-run" input.

### Local Testing
```bash
# Dry-run (safe)
DEPENDENCY_BOT_DRY_RUN=true node automation/dependency-update-bot.cjs

# Include major updates (careful!)
DEPENDENCY_BOT_ALLOW_MAJOR=true node automation/dependency-update-bot.cjs

# Ignore specific packages
DEPENDENCY_BOT_IGNORE="lodash,react" node automation/dependency-update-bot.cjs
```

### Post-Merge Cleanup
After PRs merge, branches can be cleaned manually or via log-retention-manager (future integration).

## Alerting

Telegram messages include:
- Number of outdated packages found
- PRs opened (with direct links)
- Any errors or skipped packages

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| "No outdated packages" but you know there are | `npm outdated` cache stale | Run `npm update --dry-run` locally; check registry |
| PR fails CI | Breaking change in dependency | Review CI logs; adjust `DEPENDENCY_BOT_IGNORE` |
| Bot not creating PRs | `gh` not authenticated | Ensure `GITHUB_TOKEN` has `repo` scope (provided by Actions) |
| Too many PRs per day | Large dependency set | Reduce `DEPENDENCY_BOT_MAX_BATCH` or increase frequency |

## Future Enhancements

- Bundle size delta guard (reject if >10% increase)
- Auto-merge pilot for low-risk updates (patch only, 100% test pass, no bundle change)
- CHANGELOG extraction from npm release notes into PR body
- Retry logic with exponential backoff
- Integration with log-retention-manager to prune merged branches

## Related Guardrails

- **#3 Build Size Guardian** — catches bundle bloat from dependency updates
- **#20 Weekly Dependency Health** — flags known vulnerabilities
- **#36 Performance Budget** — ensures new deps don't degrade Core Web Vitals
- **Hermes Daily Digest** — aggregates dependency bot health into daily summary

---

Maintained by KiloClaw • Autonomous improvement cycle • Standing owner permission applies
