# Autonomous Accessibility Scorecard Dashboard

**Status:** ✅ Active  
**Triggers:** Daily 08:30 UTC (scheduled), manual dispatch  
**Fail condition:** Median a11y score drop >10 points OR new failing routes (<50) detected  
**Telegram alerts:** On regressions; weekly digest (Sunday)

---

## Problem

Accessibility audits (#13) run per-PR and daily, but scores are scattered across workflow artifacts. There's no consolidated view of site-wide accessibility health, trend tracking, or early warning for regressions.

## Solution

Daily scorecard aggregator that:
- Collects Lighthouse accessibility audit results from recent #13 workflow runs
- Computes aggregate statistics (median, min, max, failing route count)
- Maintains 90-day rolling history
- Alerts when median score drops >10 points or new failing routes appear
- Posts weekly digest summary
- Stores artifacts for audit and trend analysis

---

## How It Works

1. **Artifact collection**: Downloads latest successful `accessibility-audit.yml` run artifacts from GitHub Actions (uses `GITHUB_TOKEN`)
2. **Parsing**: Extracts per-route accessibility scores (0–100) from Lighthouse JSON output
3. **Aggregation**: Computes median, min, max, average, count of routes, and number failing (<50)
4. **Comparison**: Compares median to previous day; flags drop >10 points
5. **History**: Appends to `.hermes/memory/accessibility-scorecard/history.json` (90-day rolling)
6. **Alerts**: If regressions detected, CI fails, GitHub issue opened, Telegram sent
7. **Weekly digest**: Sunday run posts summary to Telegram

---

## Output

**Current scorecard:** `.hermes/memory/accessibility-scorecard/scorecard.json`
**History:** `.hermes/memory/accessibility-scorecard/history.json` (90 days)
**Artifact:** `accessibility-scorecard` (uploaded to workflow, 90-day retention)

Example `scorecard.json`:
```json
{
  "date": "2026-05-12",
  "timestamp": "2026-05-12T08:30:00.000Z",
  "routeCount": 15,
  "stats": {
    "median": 92.5,
    "min": 67,
    "max": 100,
    "avg": 90.2,
    "failing": 1
  },
  "alerts": []
}
```

---

## Configuration

Edit thresholds in `automation/accessibility-scorecard.cjs`:

```js
const SCORE_DROP_THRESHOLD = 10; // points
const FAILURE_THRESHOLD = 50;   // below this = failing route
const HISTORY_DAYS = 90;
```

---

## Safety

- **Read-only**: Only downloads workflow artifacts; no repository writes (except optional issue creation)
- **No external services**: Uses GitHub API (authenticated via `GITHUB_TOKEN`)
- **Historical**: Maintains independent history; doesn't modify source files
- **Fail-closed**: Alerts on regressions but doesn't block merges (unless CI configured to treat exit 1 as failure)

---

## Dependencies

- `jq` (used in shell to parse GitHub API JSON; preinstalled on Ubuntu runners)
- GitHub `GITHUB_TOKEN` (automatically provided in Actions)

---

## Manual Run

```bash
gh workflow run accessibility-scorecard.yml
```

---

## Troubleshooting

**No artifacts found:**
Ensure #13 (`accessibility-audit.yml`) workflow has run successfully and artifacts are not expired. Artifacts typically expire after 90 days; adjust retention if needed.

**No routes showing:**
Verify #13 outputs Lighthouse JSON with accessibility scores. Expected format: `{ url: "...", accessibilityScore: 92, audits: {...} }`.

**False positives on score drop:**
Transient Lighthouse variations can cause small fluctuations. The 10-point threshold should avoid noise. Adjust `SCORE_DROP_THRESHOLD` if needed.

---

## Related Guardrails

- **#13 Accessibility Compliance Audit** — provides per-route audit data this scorecard aggregates
- **#4 Lighthouse Monitor** — broader performance metrics (complementary)
- **#11 Error Tracker** — may catch a11y-related JS errors
- **#45 Visual Regression** — UI changes that impact a11y may be caught here via score drops

---

## Future Enhancements

- Serve a local dashboard at `/admin/accessibility-scorecard` with trend charts
- Auto-open remediation issues with route-specific a11y violation details from Lighthouse
- Integrate with #13 to fail CI on site-wide median drop threshold
- Track per-route score history to identify consistently problematic pages
