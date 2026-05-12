# Autonomous Accessibility Compliance Audit

> Automated WCAG 2.1 AA conformance testing using Playwright + axe-core. Runs on every PR and daily. Self-hosted.

## Overview

Accessibility compliance is now tested automatically. This system:

- **Scans all pages** from sitemap (up to 50 pages, depth 2)
- **Runs axe-core** (WCAG 2.1 AA ruleset) in headless Chromium
- **Detects violations** by impact (critical/serious/moderate/minor)
- **Comments on PRs** — blocks merge if new critical violations found
- **Daily health check** on main branch → Telegram summary + GitHub issue if needed
- **Tracks trends** — per-page violation history to detect regressions
- **Fully autonomous** — no external services, all local state

---

## Architecture

```
┌─────────────────────────────┐
│ GitHub Actions              │
│ Trigger: PR opened/updated │
│ Trigger: Daily 12:00 UTC   │
└───────────┬─────────────────┘
            │
            ▼
┌──────────────────────────────────────────┐
│ Playwright + axe-core scan               │
│  - Launch headless Chromium              │
│  - Navigate to each page (sitemap URLs)  │
│  - await page.experimentalAxeAnalyze()   │
│  - Collect violations per page           │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Process results                          │
│  - Filter ignored rules                  │
│  - Aggregate by page + rule ID           │
│  - Compare to history (yesterday)        │
│  - Detect new violations / increases     │
└──────────┬───────────────────────────────┘
           │
           ▼
    ┌──────┴───────┐
    │              │
    ▼              ▼
┌──────────────┐ ┌─────────────────────┐
│ PR Comment   │ │ Telegram Daily      │
│ (on PR only)│ │ summary             │
│             │ │                     │
│ ✅ passed   │ │ 📊 Stats + trends  │
│ 🚨 + report │ │ 🚨 New/increased   │
└──────────────┘ └─────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ GitHub Issue (main branch only)          │
│ Created when:                             │
│  - Any critical violations found         │
│  - Or violation count increased >20%     │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ State persisted                           │
│ .hermes/memory/accessibility/             │
│  - history.json (per-page time-series)   │
│  - latest-report.json (current run)      │
│  - violations/ (per-page JSON files)     │
│  - accessibility-audit.log               │
└──────────────────────────────────────────┘
```

---

## Components

| File | Purpose |
|------|---------|
| `automation/accessibility-audit.cjs` | Playwright + axe-core scanner, comparison, alerts |
| `.github/workflows/accessibility-audit.yml` | PR + daily workflow |
| `.hermes/memory/accessibility/history.json` | Per-page violation history |
| `.hermes/memory/accessibility/latest-report.json` | Most recent report |
| `.hermes/memory/accessibility/violations/` | Per-page detailed violation JSON files |
| `docs/ACCESSIBILITY-AUDIT.md` | This documentation |

---

## What Gets Scanned

- **Source:** `sitemap.xml` URLs (all entries)
- **Filter:** HTML pages only (exclude `.xml`, `.json`, static assets)
- **Limit:** First 50 pages (for performance; configurable by editing script)
- **Depth:** Up to 2 levels from sitemap root (covers most site)

**Example scanned pages:**
- `/` (homepage)
- `/about`
- `/services/ai-consulting`
- `/tools/ai-log-analyzer`
- etc.

---

## Violation Severity

Axe-core uses impact levels:

| Impact | Meaning | Action |
|--------|---------|--------|
| `critical` | Users cannot complete task; severe barrier | ✅ PR comment blocks merge; daily issue on main |
| `serious` | Difficult/impossible for some users; likely barrier | ⚠️ Alert on PR; daily summary |
| `moderate` | Some users affected; should fix | 📝 Reported in summary |
| `minor` | Cosmetic; low priority | 📋 Logged but not highlighted |

**Rules ignored** via `ACCESSIBILITY_IGNORE_RULES` env var (JSON array of rule IDs). Default: empty.

---

## Thresholds & Actions

| Scenario | Action |
|----------|--------|
| PR opened with **any critical violations** | ❌ Fails CI check; PR comment with full report |
| PR has **new critical rules** on previously clean page | Same — blocks merge |
| Daily scan on `main` finds **any critical violations** | 🔴 GitHub issue created |
| Daily scan finds **total violations increased >20%** vs yesterday | ⚠️ Telegram alert |
| Page's violation count increases significantly | 📈 Listed in Telegram trend section |

---

## Telegram Daily Summary Format

```
♿ Accessibility Audit — May 12, 2026
Base: https://ziontechgroup.com

⚠️ 12 violations found (3 critical)

Top pages:
• /tools/ai-log-analyzer: 5 violation(s)
• /services: 3 violation(s)
• /: 2 violation(s)

📊 Trend:
↑ /tools/ai-log-analyzer: 2 → 5
↔ /about: 3 → 3

Details: .hermes/memory/accessibility/latest-report.json
```

---

## GitHub PR Comment Format

**On PR with violations:**
```
🚨 **Accessibility audit found violations**

Total: 12 | Critical: 3

See artifact for details. Please address before merge.
```

**On passing PR:**
```
✅ Accessibility audit passed — no violations found.
```

---

## GitHub Issue Format (Daily on Main)

**Title:** `🚨 Accessibility Violations — 05/12/2026 — 12 found`

**Body includes:**
- Summary table (top 10 affected pages)
- Critical count
- Link to HTML report artifact
- Remediation checklist
- Link to WCAG 2.1 AA spec

**Labels:** `automation`, `accessibility`, `wcag`

---

## Configuration

| Environment Variable | Required | Default | Notes |
|----------------------|----------|---------|-------|
| `APP_URL` | No | `https://ziontechgroup.com` | Base URL |
| `ACCESSIBILITY_IGNORE_RULES` | No | `[]` | JSON array of axe rule IDs to ignore |
| `TELEGRAM_BOT_TOKEN` | For alerts | — | |
| `TELEGRAM_CHAT_ID` | For alerts | `8435383377` | |
| `GITHUB_TOKEN` | For PR comments + issues | — | Auto-provided by Actions |

---

## Storage

```
.hermes/memory/accessibility/
├── accessibility-audit.log
├── history.json              # { pages: { "/path": { "2026-05-12": { total, byRule: {} } } } }
├── latest-report.json        # Current run full report
└── violations/
    ├── _tools_ai-log-analyzer.json
    └── _services.json
```

---

## GitHub Workflow

| Trigger | Behavior |
|---------|----------|
| `pull_request` → `main` | Runs scan, comments PR with violations. **Does NOT fail check** (only reports). You can choose to enforce via branch protection. |
| `schedule` (daily 12:00 UTC) | Scans main branch; creates issue if critical violations exist |
| `workflow_dispatch` | Manual trigger |

**Note:** The PR job runs **after** tests/lint; if you want to enforce accessibility as a required check, enable "Require status checks to pass before merging" in branch protection for `accessibility-audit`.

---

## Testing Locally

1. Install browsers:
   ```bash
   npx playwright install chromium
   ```

2. Run the audit:
   ```bash
   node automation/accessibility-audit.cjs
   ```

3. Check output:
   - Console log summary
   - `.hermes/memory/accessibility/latest-report.json`
   - Individual violation files in `violations/` subdir

4. View HTML report (optional — generate from JSON if needed):
   ```bash
   # The JSON structure matches axe-core output; can be viewed in axe DevTools or exported
   ```

---

## Interpreting Violations

Each violation includes:
- `id` — rule identifier (e.g., `button-name`, `color-contrast`)
- `impact` — `critical`, `serious`, `moderate`, `minor`
- `description` — human-readable description
- `help` — how to fix
- `helpUrl` — WCAG reference URL
- `nodes` — array of affected DOM elements with HTML snippets

**Common fixes:**
- `button-name` → add accessible label to `<button>` or `<a>` with icon
- `color-contrast` — ensure text/background contrast ratio ≥ 4.5:1 (AA) or 7:1 (AAA)
- `heading-order` — use proper H1→H2→H3 hierarchy; don't skip levels
- `landmark-one-main` — ensure single `<main>` landmark
- `link-name` — all links have meaningful text (avoid "click here")
- `focus-state` — visible focus indicator for keyboard users
- `aria-required-attr` — required ARIA attributes present

---

## Remediation Workflow

1. **Review violations** in PR comment or daily issue
2. **Fix code** locally (run audit again to verify)
3. **Re-run** workflow (push new commit)
4. Once clean, merge PR (if branch protection requires passing check)

For existing main branch violations:
- Open issue tracks them
- Fix incrementally; rerun daily workflow to close issue when resolved

---

## Troubleshooting

**"No pages scanned"** — Sitemap may be at `/sitemap.xml` or missing. Ensure sitemap exists and is reachable.

**"Playwright browser install failed"** — Run `npx playwright install --with-deps chromium` locally to verify. GitHub Actions runner handles this automatically.

**"All pages failing to load"** — Check `APP_URL` is correct and accessible publicly (GitHub Actions runners use external network).

**"No Telegram alerts"** — Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` set in repo secrets.

**"PR comment not appearing"** — Workflow needs `pull-requests: write` permission (configured). Ensure `GITHUB_TOKEN` present.

**"Violations keep reappearing"** — Some rules require real user interaction (e.g., `focus-state`). The automated scan only checks initial page load. Manual testing may be needed for complex interactive components.

**False positive?** Add rule ID to `ACCESSIBILITY_IGNORE_RULES` (as JSON array). Document why in code comments.

---

## Future Enhancements

- **Keyboard navigation test** — verify Tab order logic, focus traps
- **Color contrast sampling** — compute actual contrast ratios from rendered styles (not just CSS cascade)
- **Single page app (SPA) route scanning** — navigate client-side routes after initial load
- **HTML report generation** — pretty HTML with screenshots per violation
- **Dashboard UI** — `/admin/accessibility` with trend graphs
- **Auto-fix suggestions** — generate PR snippets for simple issues (missing `alt`, empty buttons)
- **Component-level audit** — scan Storybook stories in isolation
- **Integration with Lighthouse** — combine accessibility score with perf metrics
- **Multi-language** — detect language attributes, proper `lang` on `<html>`

---

## WCAG 2.1 AA Reference

This audit covers **A** and **AA** level success criteria:

- Perceivable (1.1–1.4): text alternatives, captions, color contrast, text resizing
- Operable (2.1–2.5): keyboard accessibility, no seizures, navigable
- Understandable (3.1–3.3): readable, predictable, input assistance
- Robust (4.1): compatible with assistive tech (ARIA, semantics)

Full spec: https://www.w3.org/WAI/WCAG21/quickref/

---

## Why This Matters

- **Legal compliance:** Many jurisdictions require WCAG 2.1 AA for public websites
- **Inclusive design:** Serves users of all abilities (screen reader, keyboard-only, motor impairments)
- **Quality signal:** Accessibility correlates with overall code quality (semantic HTML, proper labeling)
- **Risk reduction:** Prevents litigation from non-compliance
- **Free & autonomous:** No $500/mo SaaS; all open-source tooling, self-hosted

---

*Created: 2026-05-12 — Autonomous implementation via OpenClaw (Task #27)*
