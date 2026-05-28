# OpenAPI Spec Consistency & Drift Detector

**Status:** ✅ Active  
**Trigger:** On PR to `main`, daily at 12:00 UTC, manual dispatch  
**Fail condition:** Breaking API contract change detected  
**Telegram alerts:** On drift + on daily summary

---

## Problem

API routes evolve over time. Without an explicit contract (OpenAPI spec), clients can break silently when:
- Required request fields are added
- Response fields are removed or renamed
- Status codes change
- Parameter semantics shift

This guardrail enforces contract discipline by comparing the implemented routes against a stored OpenAPI baseline and failing on breaking changes.

---

## How It Works

1. **Scan** all `app/api/**/route.ts` (or `.js`) files
2. **Extract** method, path, query params, body fields, response keys using static analysis
3. **Build** an OpenAPI 3.0 spec from code (auto-generated)
4. **Compare** against baseline (`.hermes/memory/openapi-drift/spec.json`)
5. **Detect**:
   - **Breaking**: New required fields, removed response fields, removed endpoints/methods
   - **Additions**: New non-breaking fields or routes
   - **Removals**: Deprecated endpoints (non-breaking if truly removed, but flagged)
6. **Fail CI** if any breaking changes
7. **Update baseline** when no breaking changes (spec is healthy)
8. **History** maintained in `.hermes/memory/openapi-drift/history.json` (90-day rolling)

---

## Configuration

Environment variables (all optional):

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAPI_SPEC_PATH` | `.hermes/memory/openapi-drift/spec.json` | Baseline spec file |
| `OPENAPI_HISTORY_PATH` | `.hermes/memory/openapi-drift/history.json` | Drift history |
| `OPENAPI_DRIFT_THRESHOLD_HOURS` | `24` | Alert threshold (used by future enhancments) |
| `TELEGRAM_BOT_TOKEN` | — | Telegram bot token for alerts |
| `TELEGRAM_CHAT_ID` | — | Telegram chat ID for alerts |

---

## Outputs

- `.hermes/memory/openapi-drift/spec.json` — Current (updated) baseline
- `.hermes/memory/openapi-drift/history.json` — Time-series of drift events
- `.hermes/memory/openapi-drift/violations.json` — Written on failure with structured details
- GitHub PR comment if drift detected on PR
- GitHub issue opened on `main` for persistent breaking changes
- Telegram summary on success/failure

---

## First Run Behavior

On first execution, **no baseline exists**. The script creates one from the current codebase and exits successfully. Subsequent runs compare against that baseline.

This means the guardrail starts enforcing from the second run onward — ideal for safe bootstrapping.

---

## Adding an Explicit OpenAPI Spec (Optional)

To strictly control the contract, create your own OpenAPI spec (e.g., `docs/openapi.json`) and configure:

```bash
export OPENAPI_SPEC_PATH=/root/.openclaw/workspace/docs/openapi.json
```

The detector will then compare the generated spec from code against your canonical spec instead of auto-generated baseline.

---

## Failure Modes & Resolution

| Condition | Action |
|-----------|--------|
| Breaking change detected | CI fails; Telegram alert; PR blocked |
| Non-breaking additions | CI passes; Telegram notice; baseline updates |
| Route removed | Flagged as removal; baseline updates; review needed |
| No baseline yet | Baseline created; CI passes |

To resolve a failure:
1. Review PR changes — did you intentionally modify the contract?
2. If intentional, update the baseline by merging to `main` (it will auto-update)
3. If unintentional, revert or adjust the PR to maintain compatibility

---

## Implementation Notes

- Static analysis — no runtime or network calls
- Works with both TypeScript and JavaScript routes
- Detects changes in request body shape, query params, and response keys
- Status code changes are currently noted in descriptions but not scored as breaking unless 2xx→non-2xx
- The baseline auto-updates only when CI passes (no breaking drift)

---

## Related Guardrails

- **#39 — API Schema Validation** — ensures each route exports Zod schemas for runtime validation
- **#1 — Build Size Guardian** — ensures size budgets are met
- **#13 — Accessibility Compliance** — structural quality checks

Together these form the API hygiene suite: schema at runtime, contract at CI-time.
