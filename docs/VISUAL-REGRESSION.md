# Autonomous CSS/UI Visual Regression Detector

**Status:** ✅ Active  
**Triggers:** Daily 02:30 UTC (scheduled), manual dispatch  
**Fail condition:** Pixel diff >2% on any page/viewport combo  
**Telegram alerts:** On alerts only

---

## Problem

CSS changes, component updates, or layout tweaks can unintentionally break page designs across devices. Manual visual checks don't scale; regressions often reach production before being noticed.

## Solution

Daily visual regression suite using Playwright:
- Captures full-page screenshots of key routes (home, services, AI Lab, admin) across mobile/tablet/desktop
- Compares against stored baselines using pixelmatch
- Flags visual changes >2% pixel difference
- Opens GitHub issues with before/after/diff images attached
- Sends Telegram alerts
- Auto-updates baseline when changes are under threshold (accepts minor drift)

---

## How It Works

1. Starts the Next.js app locally (build + `npm start`)
2. For each page + viewport combination:
   - Launches headless Chromium via Playwright
   - Navigates to page (waits for network idle)
   - Takes full-page screenshot → `.hermes/memory/visual-regression/current/`
3. Compares each screenshot to baseline in `.hermes/memory/visual-regression/baseline/`
4. Computes pixel diff ratio via `pixelmatch`
5. If diff ≤ 2%: copies current to baseline (accepts change)
6. If diff > 2%: saves diff image, fails CI, opens issue, sends Telegram alert
7. Artifacts (all images) uploaded to workflow for 7-day retention

---

## Configuration

Edit thresholds in `automation/visual-regression.cjs`:

```js
const PIXELMATCH_THRESHOLD = 0.02; // 2%
const PLAYWRIGHT_TIMEOUT = 30000; // 30s per page
```

Edit monitored pages:

```js
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services' },
  { path: '/ai-lab', name: 'ai-lab' },
  { path: '/admin', name: 'admin' }
];
```

Edit viewports:

```js
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
```

---

## Baseline Management

- First run auto-generates baselines (all screenshots copied)
- Minor changes (<2%) auto-absorbed into baseline (continuous drift)
- Major regressions (>2%) block CI and require manual review
- To intentionally refresh baseline after redesign: delete `.hermes/memory/visual-regression/baseline/*.png` and rerun workflow

---

## Dependencies

This guardrail requires:
- `@playwright/test` (includes chromium) — already in devDependencies
- `pixelmatch` (optional; fallback to file-size diff if missing)

If not present, install:
```bash
npm i -D @playwright/test pixelmatch
npx playwright install chromium
```

---

## Artifacts

- **Current screenshots**: `.hermes/memory/visual-regression/current/`
- **Baseline screenshots**: `.hermes/memory/visual-regression/baseline/`
- **Diff images** (red pixels highlight changes): `.hermes/memory/visual-regression/diffs/`
- **Workflow artifact**: `visual-regression-artifacts` (zipped, 7-day retention)

---

## Notes

- **Self-hosted**: No external SaaS; all processing happens in GitHub Actions
- **Deterministic**: Pixel-level diff; threshold-based decisions
- **Non-blocking by default**: Only alerts; can be made CI-blocking by setting `fail-fast` or treating exit code 1 as failure
- **App must be reachable**: Workflow starts local app on `http://localhost:3000`; ensure `npm start` works in CI
- **Flaky captures**: Network slowness can cause false positives; increase `PLAYWRIGHT_TIMEOUT` if needed

---

## Related Guardrails

- **#4 Lighthouse Monitor** — catches performance + accessibility regressions (complementary)
- **#11 Error Tracker** — surfaces JS errors during visual capture
- **#12 API Health Monitor** — ensures backend data available for pages
- **#36 Performance Budget** — includes image sizes that affect visual stability
