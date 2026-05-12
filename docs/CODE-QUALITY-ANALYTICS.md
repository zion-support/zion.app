# Autonomous Code Quality & Complexity Analytics

> Automated static analysis of codebase health: cyclomatic complexity, file size, duplication, maintainability index. Self-hosted, no external SaaS.

## Overview

Code maintainability is now monitored automatically. This system:

- **Analyzes all code files** (TS/TSX, JS, shell scripts) in the repository
- **Computes per-function cyclomatic complexity** (decision points count)
- **Tracks file size** (LOC — lines of code)
- **Detects code duplication** via fingerprinting (similar 5-line blocks)
- **Calculates Maintainability Index** (MI) — composite score 0–100
- **Compares to historical baseline** — detects degradation over time
- **Alerts** — Telegram weekly digest, GitHub issues for systemic problems
- **PR integration** — comments on pull requests with complexity changes
- **Fully autonomous** — all local analysis, no external API

---

## Architecture

```
┌──────────────────────────────┐
│ GitHub Actions               │
│ Weekly (Sunday 17:00 UTC)    │
│ + On PR (code changes)       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ automation/code-quality-analytics.cjs    │
│  1. Collect all source files             │
│     app/, components/, automation/       │
│  2. Per-file static analysis:            │
│     - Cyclomatic complexity (decision    │
│       points: if/for/while/switch/etc)   │
│     - Function count per file            │
│     - LOC (non-blank, non-comment)       │
│     - Comment density %                  │
│     - Maintainability Index (MI)         │
│  3. Duplicate detection:                 │
│     - Fingerprint 5-line sliding windows │
│     - Find blocks appearing ≥2 files or  │
│       ≥3 times in same file              │
│  4. Aggregate site-wide metrics         │
│  5. Compare to last week's baseline      │
│  6. Alert + Issue                        │
└──────────┬───────────────────────────────┘
           │
           ▼
    ┌──────┴───────┐
    │              │
    ▼              ▼
┌──────────────┐ ┌─────────────────────┐
│ PR Comment   │ │ Telegram Weekly     │
│ (summary)    │ │ Digest              │
│              │ │                     │
│ 🔧 Complexity│ │ 📊 Avg MI, trends  │
│ changes      │ │ 🚨 Hotspots        │
│              │ │                    │
│ 🚨 Issues:   │ └─────────────────────┘
│ - High comp  │
│ - Large file │
└──────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ GitHub Issue (if systemic)                │
│ • ≥3 high-complexity files                │
│ • ≥2 extremely large files (>1000 LOC)    │
│ • ≥3 duplicate code blocks                │
│ • MI drop >10 points vs last week          │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ State persisted                            │
│ .hermes/memory/code-quality/               │
│  - history.json (global weekly + file     │
│    90-day individual)                     │
│  - latest-report.json                      │
│  - code-quality.log                        │
└──────────────────────────────────────────┘
```

---

## Components

| File | Purpose |
|------|---------|
| `automation/code-quality-analytics.cjs` | Complexity analyzer, duplicate detector, MI calculator |
| `.github/workflows/code-quality-analytics.yml` | Weekly + PR workflow |
| `.hermes/memory/code-quality/history.json` | Global weekly history + per-file 90d trends |
| `docs/CODE-QUALITY-ANALYTICS.md` | This file |

---

## What Gets Analyzed

**File patterns:**
- `app/**/*.ts`, `app/**/*.tsx` (Next.js app router)
- `components/**/*.ts`, `components/**/*.tsx`
- `automation/**/*.cjs` (Node scripts)
- `scripts/**/*.sh` (shell scripts)
- `lib/**/*.js` (any JS utilities)

**Excluded:** `node_modules/`, `.next/`, `public/`, `docs/`, `coordination/`

---

## Metrics Collected

| Metric | Unit | Description | Good Target |
|--------|------|-------------|-------------|
| Cyclomatic Complexity | count per function | Decision points (if/for/while/switch/catch) | ≤10 avg, ≤20 max |
| LOC (Lines of Code) | count | Non-blank, non-comment lines | ≤500 per file |
| Function Count | count | Number of functions in file | — |
| Comment Density | % | Comment lines / total lines | ≥15% |
| Maintainability Index (MI) | 0–100 | Composite: complexity, LOC, comments | ≥70 (good), <50 (bad) |
| Duplicate Blocks | count | 5-line blocks appearing ≥2× | 0 ideally |
| Duplicate Files | count | Files sharing duplicate blocks | — |

---

## Scoring & Thresholds

### Per-File Complexity
- **Complexity per function** = 1 + decision points
  - Decision points: `if`, `for`, `while`, `do`, `switch`, `catch`, ternary `?`, logical `&&`, `||`
  - Nested complexity counts extra
- **Thresholds:**
  - Single function >15 → warning
  - Single function >25 → critical
  - File average complexity (total comp / functions) >10 → monitor

### File Size (LOC)
- **Small:** <300 LOC → ✅ healthy
- **Medium:** 300–500 LOC → ⚠️ watch
- **Large:** 500–1000 LOC → ⚠️ consider splitting
- **Very Large:** >1000 LOC → ❌ critical (God file)

### Maintainability Index (MI)
Formula approximation:
```
MI = 171 - 0.69×ln(complexity) - 0.32×ln(LOC) - 0.23×ln(commentDensity×100+1)
```
- **≥80:** Excellent
- **70–79:** Good
- **60–69:** Moderate (needs attention)
- **<60:** Poor (refactor soon)

### Code Duplication
- **Block size:** 5 consecutive lines
- **Fingerprint:** length + first 50 chars normalized
- **Thresholds:**
  - Block appears in ≥2 files → flagged as duplication
  - Block appears ≥3 times total → flagged
  - Total duplicate blocks >3 → issue

---

## Actions Taken

| Condition | Severity | Action |
|-----------|----------|--------|
| Any function complexity >25 | Critical | PR comment; weekly alert |
| Any file >1000 LOC | Critical | PR comment; weekly alert |
| >3 high-complexity files | Systemic | GitHub issue |
| >2 extremely large files | Systemic | GitHub issue |
| Duplicate blocks >3 | Warning | Telegram + issue if many |
| MI drops >10 pts vs last week | Critical | GitHub issue |
| MI drops 5–10 pts | Warning | Telegram alert |

---

## Report Format

### Telegram Weekly Digest
```
🔧 Code Quality Analytics — May 12, 2026
Repo: zion.app

📊 Files: 124 | LOC: 18,432
   Avg complexity: 4.2 | MI: 76/100

🚨 High-complexity files: 2
📏 Large files (>1000 LOC): 1
📋 Duplicate blocks: 4

Top 5 most complex:
1. automation/api-health-monitor.cjs: comp=28, LOC=423, MI=62
2. app/api/ai/chat/route.ts: comp=22, LOC=380, MI=58
3. automation/daily-digest.cjs: comp=18, LOC=512, MI=65

Trend: MI -2 pts vs last week

Details: .hermes/memory/code-quality/latest-report.json
```

### PR Comment
```
🔧 Code Quality Analytics — review complexity changes

Files changed: 8 | LOC: +120/-45
High complexity: 1 new (api-health-monitor.cjs)
Large files: 0
Duplicate blocks: 1 detected

See artifact for full breakdown.
```
(If clean: `✅ Code quality check passed — no high-complexity or large files detected.`)

---

## GitHub Issue Example

**Title:** `🚨 Code Quality Degradation — 05/12/2026 — 2 complex, 1 large, 4 duplicates`

**Body includes:**
- Summary table (complexity, LOC, MI)
- List of problematic files with links to GitHub
- Specific functions with high cyclomatic complexity (if we tracked per-function; currently per-file)
- Duplicate code blocks (snippet preview)
- Remediation checklist (refactor, split, dedupe)
- Trend chart data (MI over time)

**Labels:** `automation`, `code-quality`, `tech-debt`

---

## Configuration

| Env Var | Required | Purpose |
|---------|---------|---------|
| `TELEGRAM_BOT_TOKEN` | For alerts | — |
| `TELEGRAM_CHAT_ID` | For alerts | Default `8435383377` |
| `GITHUB_TOKEN` | For PR comments + issues | Auto-injected |

---

## Storage

```
.hermes/memory/code-quality/
├── code-quality.log
├── history.json   # { global: { "2026-05-12": { avgComplexity, avgMI, counts... } }, files: { "path/to/file.ts": { history: { "2026-05-12": { complexity, loc, mi } } } } }
└── latest-report.json
```

---

## GitHub Workflow

| Trigger | Behavior |
|---------|----------|
| `pull_request` (code files) | Analyzes changed files, comments PR with complexity/LOC info |
| `schedule` weekly (Sun 17:00 UTC) | Full repo scan, Telegram digest, GitHub issue if degradation |
| `workflow_dispatch` | Manual run |

---

## Testing Locally

```bash
node automation/code-quality-analytics.cjs
```

Check:
- Console output with per-file metrics
- `.hermes/memory/code-quality/latest-report.json`
- `.hermes/memory/code-quality/history.json` updated

**Force a high-complexity detection:**
- Temporarily add a deeply nested `if` block in a file
- Re-run → that file's complexity should increase

**Test duplication:**
- Copy a 5-line block into two files
- Re-run → duplicate count increases

---

## Remediation Guide

### 1. Reduce Cyclomatic Complexity
**Before (complexity 8):**
```typescript
function processOrder(order) {
  if (order.type === 'A') {
    if (order.amount > 1000) {
      // …
    } else {
      // …
    }
  } else if (order.type === 'B') {
    // …
  } else {
    // …
  }
  // more branches...
}
```

**After (complexity 4):**
```typescript
function processOrder(order) {
  const handlers = { A: handleA, B: handleB, default: handleDefault };
  const handler = handlers[order.type] || handlers.default;
  return handler(order);
}
```
Extract nested logic into separate functions.

### 2. Split Large Files
**Before (1200 LOC):** `automation/api-health-monitor.cjs` monolith
**After:**
- `lib/api-checker.js` (core checking logic)
- `lib/alerting.js` (Telegram/issue creation)
- `lib/reporting.js` (metrics aggregation)
- `automation/api-health-monitor.cjs` (orchestrator)

Each module <300 LOC.

### 3. Remove Duplication
**Before:**
```javascript
// File A
const headers = { 'Content-Type': 'application/json' };
fetch(url, { headers, method: 'POST' });

// File B — identical
const headers = { 'Content-Type': 'application/json' };
fetch(url, { headers, method: 'POST' });
```

**After:** Extract shared utility:
```javascript
// lib/http.js
export function postJSON(url, body) {
  return fetch(url, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(body) });
}
```

### 4. Improve Maintainability Index
- Add comments to complex logic
- Reduce branching
- Break long functions (<50 LOC ideal)
- Increase test coverage (not currently tracked, but MI correlates)

---

## Interpreting Trends

| Trend | Meaning | Action |
|-------|---------|--------|
| MI steady ≥75 | Healthy | Continue |
| MI dropping >5 pts | Warning | Investigate recent complex commits |
| MI <60 | Poor | Schedule refactor sprint |
| Complexity ↑ across multiple files | Architecture degrading | Enforce complexity budget in PR reviews |
| Duplicate blocks ↑ | Copy-paste increasing | Enforce DRY principle |

---

## Future Enhancements

- **Per-function complexity** listing (currently per-file aggregate)
- **ESLint rule enforcement** (e.g., `max-statements`, `max-depth`, `max-params`)
- **Test coverage correlation** — combine with `npm test -- --coverage`
- **Dependency coupling analysis** — count imports/exports per module
- **Hotspot heatmap** — visualize top 10 files needing refactor
- **Dashboard UI** — `/admin/code-quality` interactive graphs
- **Auto-suggest refactorings** — generate PR that extracts function
- **Technical debt budget** — fail PR if complexity increase exceeds limit
- **Language expansion** — add Python, Go if needed later

---

## Why This Matters

- **Maintainability:** High complexity ⇒ bugs, slower feature development
- **Onboarding:** New engineers can understand clean code faster
- **Refactoring priority:** Data-driven debt reduction
- **Prevent "Big Ball of Mud":** Early warnings before architecture collapses
- **Long-term velocity:** Healthy codebase ships features faster
- **Free & autonomous:** No SonarQube/Snyk Code subscription fees

---

*Created: 2026-05-12 — Autonomous implementation via OpenClaw (Task #30)*
