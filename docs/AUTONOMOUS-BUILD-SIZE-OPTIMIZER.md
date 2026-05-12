# Autonomous Build Size Optimizer

> Monitors bundle growth trends and triggers AI-powered optimization recommendations after consecutive threshold violations. Phase 1 (analysis) → Phase 2 (auto-apply).

## Overview

The build size optimizer protects user experience by preventing unchecked bundle bloat. It uses a **3-strike threshold** system:

- **Strike 1 & 2**: Warning only — consecutive growth >5% detected
- **Strike 3**: TRIGGERED — detailed recommendations posted to PR, merge blocked until addressed
- **Reset**: Any decrease or within-budget build resets the counter

## Architecture

```
┌─────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│  Build pipeline │───▶│bundle-size-monitor.sh│───▶│.bundle-size-       │
│  (npm run build)│    │(threshold check)     │    │monitor-state.json │
└─────────────────┘    └──────────────────────┘    └────────────────────┘
                                                         │
                                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│            GitHub Actions: build-size-optimizer.yml                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. Build with ANALYZE=true                                   │    │
│  │ 2. Run bundle-size-monitor.sh (updates state file)           │    │
│  │ 3. Run build-size-optimizer.cjs (analyzes state, generates  │    │
│  │    recommendations if triggered)                             │    │
│  │ 4. Post PR comment with optimization guidance                │    │
│  │ 5. Exit 1 to fail check if triggered & AUTO_APPLY=false     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                                         │
                                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Output: automation/reports/build-size-optimizer-latest.json        │
│  • Top 20 largest modules                                           │
│  • Recommendations: CODE_SPLIT, TREE_SHAKE, AGGRESSIVE_SPLIT        │
│  • Estimated savings per rec                                         │
│  • Consecutive failure count                                         │
└─────────────────────────────────────────────────────────────────────┘
```

## Configuration

### Thresholds (repo secrets or env vars)

| Variable | Default | Purpose |
|----------|---------|---------|
| `BUNDLE_SIZE_THRESHOLD` | `5` | Growth % threshold before strike (1–100) |
| `BUNDLE_CONSECUTIVE_LIMIT` | `3` | Number of consecutive exceeds before triggering recommendations |
| `BUNDLE_OPTIMIZER_AUTO_APPLY` | `false` | Phase 2: automatically apply safe optimizations (not yet implemented) |
| `BUNDLE_BASELINE` | `.bundle-size-baseline.json` | Baseline comparison file |
| `BUNDLE_REPORT` | `bundle-analysis.json` | Current build stats file |

### Setting secrets on GitHub

1. Repository → Settings → Secrets and variables → Actions
2. Add variable (e.g., `BUNDLE_SIZE_THRESHOLD`) with value `5`
3. Repeat for other vars as needed

## Workflow Artifacts

- **State file**: `.bundle-size-monitor-state.json` (tracked locally only, not committed)
- **Baseline**: `.bundle-size-baseline.json` (auto-generated on first run)
- **Report**: `automation/reports/build-size-optimizer-latest.json` (uploaded as artifact)
- **Workflow logs**: GitHub Actions UI → "Build Size Optimizer" job

## Interpretation

### When triggered (strike 3)

The PR comment will show:

```markdown
## 🔨 Build Size Optimizer: Action Required

Bundle has grown by **12.7%** across **3** consecutive build(s).

### 📊 Top Modules
  chunk-vendor.js: 245KB
  dashboard.js: 180KB
  heavy-component.js: 120KB

### 💡 Optimization Recommendations (3)
1. CODE_SPLIT — lazy-load large modules (est. save: 90KB)
2. TREE_SHAKE — verify vendor tree-shaking (est. save: 45KB)
3. AGGRESSIVE_SPLIT — route-based splitting (est. save: 60KB)

Total potential: 195KB (15% of bundle)
```

**Action required**: Apply suggested optimizations, push, and re-run workflow. Or enable `BUNDLE_OPTIMIZER_AUTO_APPLY=true` for Phase 2.

### Recommendations logic

| Type | Trigger | Suggested action | Estimated savings |
|------|---------|------------------|-------------------|
| `CODE_SPLIT` | ≥3 modules >50KB | Dynamic `import()` for routes/components | 30% of large module size |
| `TREE_SHAKE` | Vendor modules >100KB | Check sideEffects, ensure proper ESM, add `sideEffects: false` to package.json | 20–40% of vendor chunk |
| `AGGRESSIVE_SPLIT` | Total growth >10% | Route-based code splitting (React.lazy + Suspense, Next.js dynamic imports) | 10–20% of total bundle |

## Phase 2: Auto-Apply (future)

When `BUNDLE_OPTIMIZER_AUTO_APPLY=true`, the optimizer will:

1. Inject `dynamic import()` for modules marked `CODE_SPLIT`
2. Add webpack magic comments for better chunk naming
3. Update `next.config.js` `experimental.outputFileTracing` if needed
4. Run `npm test` to validate no regressions
5. On test failure: auto-revert changes and create incident report

**Currently disabled** — we're validating recommendation quality in Phase 1 first.

## Disabling / tuning

- To **temporarily disable**: remove the workflow file or set `BUNDLE_CONSECUTIVE_LIMIT=99`
- To **lower sensitivity**: increase `BUNDLE_SIZE_THRESHOLD` (e.g., `10` for 10%)
- To **reset counter manually**: delete `.bundle-size-monitor-state.json` and rebuild

## Related guardrails

- **AI Lab integrity guard** (`automation/reports/ai-lab-integrity-latest.json`) — ensures all AI tools healthy
- **Bundle size monitor** (`scripts/bundle-size-monitor.sh`) — baseline tracking and threshold enforcement
- **Release risk scorer** — aggregates multiple health signals including bundle trends

## Troubleshooting

**"No baseline found"** — First build; baseline auto-created. No action needed.

**"Could not determine bundle sizes"** — Build didn't generate stats. Ensure `ANALYZE=true` and `next-bundle-analyzer` installed.

**Stuck in triggered state** — Check `automation/reports/build-size-optimizer-latest.json` for recommendations; apply fixes and push; workflow will reset counter on successful within-budget build.

**False positive?** — Adjust `BUNDLE_SIZE_THRESHOLD` or investigate why legitimate features increased size (new dependencies, large assets).

---

## Changelog

- **2026-05-12** — Initial deployment (Phase 1: analysis-only, 3-strike threshold, PR blocking)
