# TypeScript Type Coverage & Dead Code Finder

**Status:** ✅ Active  
**Triggers:** PR to `main`, push to `main`, weekly Monday 15:00 UTC digest  
**Fail condition:** Type coverage < configured threshold OR any `error`-severity findings  
**Telegram alerts:** On failures and weekly digest

---

## Problem

As code evolves, type strictness can erode:
- Implicit `any` parameters appear when types omitted
- Explicit `any` used as escape hatch
- Unused exports and variables accumulate
- Overall type coverage (percentage of typed declarations) drifts downward

This guardrail enforces strict TypeScript hygiene automatically.

---

## How It Works

1. **Collect** all `*.ts` and `*.tsx` files in repo
2. **Analyze** using TypeScript compiler API (deep) plus heuristic fallbacks:
   - Function parameters without types → **implicit-any** (error)
   - Explicit `any` types → **explicit-any** (error when blocklisted, else warning)
   - Unused exports/variables → **unused-export/unused-variable** (warning)
3. **Compute** type coverage ratio: typed declarations / total declarations
4. **Fail CI** if:
   - Coverage < `TYPE_COVERAGE_MIN` (default 90%)
   - Any error-severity findings present
5. **Write** report: `.hermes/memory/type-coverage/report-latest.json`
6. **Update** history: `.hermes/memory/type-coverage/history.json` (90-day rolling)
7. **Notify**: PR comments, main-branch GitHub issues, Telegram alerts

---

## Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `TS_CONFIG` | `tsconfig.json` | Path to tsconfig |
| `TYPE_COVERAGE_MIN` | `90` | Minimum acceptable type coverage % (0–100) |
| `TYPE_COVERAGE_ANY_BLOCKLIST` | `true` | Treat `any` usage as error (if true) or warning |
| `TYPE_COVERAGE_REPORT_PATH` | `.hermes/memory/type-coverage/report-latest.json` | JSON report path |
| `TYPE_COVERAGE_HISTORY_PATH` | `.hermes/memory/type-coverage/history.json` | History path |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | — | Telegram notifications |

---

## Report Format (JSON)

```json
{
  "timestamp": "2026-05-12T14:35:00.000Z",
  "totalDeclarations": 1250,
  "typedDeclarations": 1150,
  "anyCount": 23,
  "unusedExports": 5,
  "coveragePercent": 92.0,
  "findings": [
    {
      "file": "app/api/market-prices/route.ts",
      "line": 27,
      "column": 15,
      "type": "implicit-any",
      "message": "Parameter 'limit' has implicit any type",
      "severity": "error"
    }
    // ...
  ],
  "passes": true
}
```

---

## Severity

- `error` — Blocks CI merge. Fix before PR approval.
- `warning` — Reported but does not fail CI (unless coverage also fails). Good for gradual improvement.

By default:
- Implicit any → error
- Explicit any → error if `TYPE_COVERAGE_ANY_BLOCKLIST=true`; else warning
- Unused exports/variables → warning

---

## Adjusting Thresholds

If coverage dips temporarily due to refactor, you can:
1. Increase `TYPE_COVERAGE_MIN` in workflow env if you want to raise the bar over time
2. Add allowlist exceptions in the detector (future enhancement)
3. For a one-time waiver, merge a PR that intentionally lowers the threshold — use sparingly

---

## First Run

On first run, baseline history is created automatically. The first pass establishes the current coverage level. If below threshold, CI fails — fix or adjust threshold accordingly.

---

## False Positives

Heuristic analysis may miss some complex patterns. The TypeScript compiler API pass catches most real cases. If a finding seems incorrect:
- Verify TypeScript server (tsserver) reports the same
- If it's a false positive from regex heuristics, they are safely downgraded to warnings in fallback mode
- Consider adjusting code clarity or adding explicit types

---

## Performance

Runs in ~2–5 seconds on medium-sized codebase. Uses `actions/setup-node` caching. Parallelizable automatically across CI runners.

---

## Related Guardrails

- **#38 Test Coverage Enforcer** — ensures tests stay above baseline
- **#39 API Schema Validation** — runtime contract checks
- **#40 OpenAPI Drift Detector** — API contract drift detection
- **#30 Code Quality Analytics** — complexity, duplication, maintainability index

Together they enforce code hygiene at multiple levels.

---

## Future Enhancements

- Allowlist specific files/paths for `any` usage (e.g., `any` for dynamic JSON)
- Auto-fix suggestions: suggest exact type annotations
- Dead code auto-removal PRs (via prune-agent)
- Coverage trend graphs in Deploy Drift Dashboard
