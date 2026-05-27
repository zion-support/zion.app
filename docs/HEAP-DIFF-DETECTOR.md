# Autonomous Memory Leak Detector & Heap Snapshot Comparator

**Status:** ✅ Active  
**Triggers:** Hourly (scheduled), manual dispatch  
**Fail condition:** Retained heap growth >20% over 24h median in any PM2 process  
**Telegram alerts:** On alerts; weekly digest (Sunday 00:00 UTC)

---

## Problem

Memory leaks in long-running Node.js processes degrade performance and can cause OOM crashes. Without automated monitoring, heap growth goes unnoticed until production incidents occur.

## Solution

Hourly heap diff detector that:
- Queries PM2-managed processes for memory metrics (`heapUsed`, `rss`)
- Computes median baseline over the last 24 hours
- Alerts when retained heap grows >20% compared to baseline
- Opens GitHub issues on sustained alerts with recent snapshot excerpts
- Sends Telegram notifications
- Keeps 30-day rolling history for trend analysis

---

## How It Works

1. Uses `pm2 jlist --format json` to collect memory stats of all running processes
2. Filters processes with `heapUsed` ≥ 50MB (avoids noise on small workers)
3. Compares current `heapUsed` to median of past 24 hours (robust to spikes)
4. If growth >20%, flags as potential leak
5. Writes snapshot to `.hermes/memory/heap-diff/snapshots/heap-<timestamp>.json`
6. Updates history at `.hermes/memory/heap-diff/history.json` (30-day rolling)
7. On alert: CI job fails, GitHub issue opened, Telegram sent
8. On weekly schedule (Sunday 00:00 UTC): sends success digest

---

## Configuration

Edit thresholds in `automation/heap-diff-detector.cjs`:

```js
const RETAINED_GROWTH_RATE = 0.20; // 20%
const MIN_HEAP_SIZE_MB = 50;       // only monitor processes >50MB
const HISTORY_DAYS = 30;
```

---

## Reports

- **Latest snapshot**: `.hermes/memory/heap-diff/snapshots/heap-*.json`
- **History**: `.hermes/memory/heap-diff/history.json`
- **Artifact**: `heap-diff-snapshot` (uploaded to workflow, 7d retention)

---

## Notes

- **Non-invasive**: Does not inject code or modify running processes; only reads PM2 stats.
- **PM2 required**: Assumes production processes managed by PM2 (already in use).
- **Baseline warm-up**: First 24h will have no baseline; detector will skip growth calculation until enough history exists.
- **False positives**: Short-lived spikes may trigger alerts; use median to reduce noise. Adjust threshold if needed.

---

## Enhancements (Future)

- Integrate `heapdump` module for actual V8 heap snapshot diffing (object count, dominator trees)
- Suggest leak sources by analyzing retained object types (detached DOM, Closure arrays, Map/Set bloat)
- Per-process thresholds (web vs API workers may differ)
- Deploy-aware comparison (compare post-deploy vs pre-deploy baselines)

---

## Related Guardrails

- **#4 Lighthouse Monitor** — measures performance impact of memory leaks on FCP/LCP
- **#11 Error Tracker** — may surface OOM errors
- **#36 Performance Budget** — includes heap size in budget (future)
