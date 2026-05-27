# Autonomous Test Coverage & Threshold Enforcement

> Prevents test-coverage erosion by enforcing minimum thresholds on PRs; auto-updates baseline on `main`.

**Status:** ✅ Guardrail #38 — Proposed / Implementation underway

---

## What It Does

- **Runs** on every PR to `main` (and manual dispatch)
- **Executes** `npm test -- --coverage` (Istanbul/Jest)
- **Parses** coverage JSON (`coverage/coverage-final.json`)
- **Compares** against baseline (`.hermes/memory/test-coverage/baseline.json`)
- **Fails** if:
  - Global coverage < configured minimum (default: 80%)
  - Any metric (lines/branches/functions/statements) regresses > threshold (default: 5%)
- **Auto-updates** baseline when PRs merge to `main` (if coverage improves or stable)
- **Posts** a summary comment on the PR
- **Alerts** via Telegram on failures
- **Archives** 90-day trend history

## Configuration

| Environment Variable | Default | Notes |
|---|---|---|
| `COVERAGE_MIN_GLOBAL` | `80` | Minimum global coverage percentage |
| `COVERAGE_REGRESSION_PCT` | `5` | Maximum allowed drop vs baseline (per metric) |
| `COVERAGE_INPUT` | `coverage/coverage-final.json` | Istanbul JSON report path |
| `COVERAGE_BASELINE_FILE` | `.hermes/memory/test-coverage/baseline.json` | Baseline storage |
| `COVERAGE_HISTORY_FILE` | `.hermes/memory/test-coverage/history.json` | 90-day trend log |
| `COVERAGE_UPDATE_BASELINE_ON_MAIN` | `true` | Auto-baseline update on `main` branch |

**GitHub Secrets (optional):**
- `COVERAGE_MIN_GLOBAL`
- `COVERAGE_REGRESSION_PCT`

## Files

- **Script:** `automation/test-coverage-enforcer.cjs`
- **Workflow:** `.github/workflows/test-coverage.yml`
- **Docs:** `docs/TEST-COVERAGE-ENFORCEMENT.md` (this file)
- **State:** `.hermes/memory/test-coverage/` (baseline + 90d history)

## Behavior Details

### On Pull Request
1. Checkout code; `npm ci`
2. Run `npm test -- --coverage --silent`
3. Parse coverage JSON
4. Load baseline (if exists)
5. Enforce:
   - Global ≥ `COVERAGE_MIN_GLOBAL`
   - Each metric within regression tolerance vs baseline
6. If any check fails → exit 1 → CI fails
7. Post PR comment with coverage breakdown

### On Main Branch Merge
- If `COVERAGE_UPDATE_BASELINE_ON_MAIN=true`, the baseline is refreshed automatically (future: a separate workflow or CI step can do this).
- The baseline file is committed to `main`; it evolves as coverage improves.

### History & Alerting
- Each run appends to `history.json` (90-day rolling window)
- Telegram notification on CI failure (includes GitHub Actions run link)

## Safety

- No external dependencies beyond Jest/Istanbul
- Baseline stored in-repo; deterministic comparison
- Fails closed — CI red if coverage below threshold
- Regression tolerance prevents false positives from minor fluctuations
- Dry-run not needed — gate is either pass/fail based on numbers

## Usage

### Local Testing
```bash
# Run tests with coverage
npm test -- --coverage

# Simulate enforcement (will exit non-zero on failure)
node automation/test-coverage-enforcer.cjs

# Override thresholds
COVERAGE_MIN_GLOBAL=90 COVERAGE_REGRESSION_PCT=2 node automation/test-coverage-enforcer.cjs
```

### Initial Baseline Setup
If no baseline exists, the enforcer will skip regression checks but still enforce the global minimum. Once coverage passes, baseline will be created automatically on `main` (when enabled).

## Future Enhancements

- Per-file minimum enforcement
- Coverage diff visualization in PR comment (added/removed uncovered lines)
- Auto-create GitHub issue when sustained downward trend detected
- Integrate with Codecov/Codacy as secondary source (optional)

## Related Guardrails

- **#36 Performance Budget** — CI gate for Web Vitals
- **#1 Build Size Guardian** — bundle size regression guard
- **Daily Digest** — aggregates coverage health into daily summary

---

Maintained by KiloClaw • Autonomous improvement cycle
