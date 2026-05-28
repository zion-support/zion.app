# Autonomous Performance Budget Enforcer with CI Gate

**Status:** ✅ Active  
**Triggers:** On PR to `main` (required check), daily 03:00 UTC monitoring on `main`  
**Input:** Built local site (`.next/` or dev server)  
**Output:** CI fail on threshold exceed; PR comments with metric breakdown; Telegram digest

---

## Problem

Core Web Vitals (LCP, CLS, INP, TBT) and performance budgets degrade silently as features accumulate. Without automated enforcement:
- Page load slows down over time
- SEO rankings drop (Google uses performance as a ranking factor)
- User experience suffers
- Regressions go unnoticed until someone manually audits

## Solution

CI-enforced performance budgets using Lighthouse:
- Runs Lighthouse audit on every PR (against built site)
- Fails CI if:
  - LCP > 2500ms
  - CLS > 0.1
  - INP > 200ms
  - TBT > 200ms
  - Any metric regresses >10% from baseline (per route)
- Auto-updates baseline on `main` when performance improves or stays healthy
- Posts PR comments with detailed metric breakdown + optimization suggestions
- Daily digest on `main` health; weekly trend report
- Telegram notifications on failures

---

## How It Works

1. **Build & serve** — On PR: uses built artifact; on main schedule: starts local server
2. **Lighthouse audit** — Runs on sample pages (configurable route list)
3. **Extract metrics** — LCP, CLS, INP, TBT, FCP, SpeedIndex, PerformanceScore
4. **Compare to baseline** — Stored in `.hermes/memory/performance-budget/baseline.json`
5. **CI gate** — Exits non-zero on threshold breach or regression
6. **PR feedback** — Posts comment with route metrics and violations
7. **Baseline update** — On `main` merges, baseline is lowered (better performance) automatically
8. **Telegram** — Sends summary (success/failure counts)

---

## Configuration

Environment variables (defaults shown):

```bash
# Thresholds (hard limits)
PERF_BUDGET_LCP_MAX=2500          # ms (good: <2500)
PERF_BUDGET_CLS_MAX=0.1           # (good: <0.1)
PERF_BUDGET_INP_MAX=200           # ms (good: <200)
PERF_BUDGET_TBT_MAX=200           # ms (good: <200)

# Regression tolerance
PERF_BUDGET_REGRESSION_PCT=10     # allow up to 10% degradation from baseline before failing

# Baseline management
PERF_BUDGET_UPDATE_BASELINE_ON_MAIN=true  # auto-update baseline on main when performance improves

# Pages to audit (comma-separated paths)
PERF_BUDGET_SAMPLE_PAGES=/,/blog,/services,/ai-lab
```

---

## Baseline & History

**Baseline file:** `.hermes/memory/performance-budget/baseline.json`
```json
{
  "/": { "lcp": 1800, "cls": 0.05, "inp": 120, "tbt": 90, "performanceScore": 95, "updatedAt": "2026-05-12T..." },
  "/blog": { ... }
}
```

**History:** `.hermes/memory/performance-budget/history.json` — last 90 runs with timestamps, pass/fail, metrics.

Baseline values are **only lowered** (improved) on `main` merges. If a route's metric improves (e.g., LCP drops from 1800ms to 1500ms), baseline updates to the better value. If metric worsens, baseline stays unchanged (protects against regression).

---

## CI Behavior

- **On PR:** Runs after build; required status check (can be made required in branch protection). Fails CI if:
  - Any metric exceeds absolute threshold
  - Any metric regresses >10% compared to baseline for that route
- **On `main` (schedule):** Daily 03:00 UTC — updates baseline if performance improved; sends Telegram digest
- **Exit codes:** `0` = pass; `1` = fail (violations or regressions)

---

## Output

**Console:**
```
⚡ Autonomous Performance Budget Enforcer — starting

🚀 Starting local server...
   ✅ Local server ready on port 3000
   ✅ Chrome launched (port 9222)

🔬 Auditing http://localhost:3000/...
   LCP=1450ms, CLS=0.02, INP=95ms, TBT=45ms, Score=98

📊 Results:
   /: LCP=1450, CLS=0.02, INP=95, TBT=45
✅ All metrics within budget.

✅ Performance budget enforcement complete.
```

**GitHub PR comment:**
```
## ⚡ Performance Budget Report

✅ **All metrics within budget.** Great job!

### Page metrics:
- `/`: LCP=1450ms, CLS=0.020, INP=95ms, TBT=45ms, Score=98
- `/blog`: LCP=1820ms, CLS=0.045, INP=110ms, TBT=80ms, Score=92

_Automated by Performance Budget Enforcer._
```

On failure, violations and regressions are clearly listed.

---

## Safety

- **Read-only local audit:** No source code modifications; baseline JSON only writes to `.hermes/memory/`
- **Deterministic:** Lighthouse with consistent Chrome flags; thresholds fixed
- **Non-destructive:** Baseline updates only on `main` and **only when metrics improve** (lower LCP/CLS/INP/TBT, higher score)
- **Required CI gate:** Fails closed; PR cannot merge if performance degrades
- **Free & self-hosted:** Uses `lighthouse` + `chrome-launcher`; no external API costs

---

## Dependencies

```json
{
  "devDependencies": {
    "lighthouse": "^11.0.0",
    "chrome-launcher": "^1.8.0",
    "@octokit/rest": "^20.0.0"
  }
}
```

Install:
```bash
npm install -D lighthouse chrome-launcher @octokit/rest
```

---

## Manual Trigger

```bash
gh workflow run performance-budget.yml
```

---

## Future Enhancements

- **Field performance integration** — correlate RUM data with lab metrics
- **Tiered budgets** — different thresholds for critical routes (home, services) vs content
- **Bundle size correlation** — link performance regressions to bundle growth from #43
- **Visual regression cross-check** — if Lighthouse score drops, trigger #45 to see if UI changed
- **Historical trend dashboard** — embed chart in internal analytics page

---

## Related Guardrails

- **#45 Visual Regression** — catches UI changes that might impact performance
- **#43 Bundle Split Analyzer** — identifies heavy chunks that cause slow LCP
- **#4 Lighthouse** — broader audits; this is focused, gatekeeper variant
- **#52 Accessibility** — complementary UX quality gate

---

## Why Lighthouse?

Industry standard, Google-backed, well-documented. Provides all Core Web Vitals natively. Deterministic in controlled local environment (headless Chrome). Already used in #4; this gate tightens enforcement to PR level.
