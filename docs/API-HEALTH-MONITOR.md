# Autonomous API Health & Latency Monitor

> Monitors production API endpoints every 5 minutes for availability, response time, and error rate. Self-hosted — no external services.

## Overview

Backend API health is now checked automatically every 5 minutes. This system:

- ** pings critical endpoints** (homepage, `/api/health`, AI chat, search, etc.)
- **measures p50/p95/p99 latency** and error rates
- **compares to baseline** (7-day rolling average)
- **alerts via Telegram** on degradation
- **creates GitHub issues** for critical threshold breaches (p95 >3s or error rate >5%)
- **stores history** locally (30-day rolling window)

---

## Architecture

```
┌──────────────────────┐
│ GitHub Actions       │
│ (every 5 minutes)    │
│ → automation/        │
│   api-health-monitor │
│   .cjs               │
└──────────┬───────────┘
           │
           ▼
┌───────────────────────────────────┐
│ Check endpoints (concurrency=3)  │
│  - GET / (TTFB homepage)         │
│  - GET /api/health               │
│  - POST /api/ai/chat             │
│  - GET /api/search               │
│  - (configurable via env)        │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ Collect metrics:                  │
│  - Response time (ms)             │
│  - Status code                    │
│  - Success/failure                │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ Compare to baseline (7d avg p95) │
│ Detect:                          │
│  • Latency spikes                │
│  • Error rate increases          │
│  • 5xx server errors             │
└──────────┬────────────────────────┘
           │
           ▼
    ┌──────┴───────┐
    │              │
    ▼              ▼
┌─────────┐  ┌────────────┐
│Telegram │  │GitHub Issue│
│alert    │  │if critical │
│(warning │  │threshold   │
│or       │  │breached    │
 │critical)│  │            │
└─────────┘  └────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ State persisted to               │
│ .hermes/memory/api-health/       │
│  - history.json (30d time-series)│
│  - latest.json (current run)     │
│  - api-health.log                │
└──────────────────────────────────┘
```

---

## Components

| File | Purpose |
|------|---------|
| `automation/api-health-monitor.cjs` | Main checker — HTTP requests, metrics, comparison, alerts |
| `.github/workflows/api-health-monitor.yml` | GitHub Actions workflow (every 5 min) |
| `.hermes/memory/api-health/history.json` | Time-series storage (30 days) |
| `.hermes/memory/api-health/latest.json` | Most recent report |
| `.hermes/memory/api-health/api-health.log` | Execution log |
| `docs/API-HEALTH-MONITOR.md` | This documentation |

---

## Monitored Endpoints (Default)

| Name | Method | Path | Expected Status |
|------|--------|------|-----------------|
| `homepage` | GET | `/` | 200, 301, 302 |
| `health` | GET | `/api/health` | 200 |
| `ai-chat` | POST | `/api/ai/chat` | 200 |
| `search` | GET | `/api/search` | 200 |

**Customize:** Set `API_ENDPOINTS` environment variable as JSON:
```json
[
  { "path": "/api/custom", "method": "GET", "expected": [200], "name": "custom" }
]
```

---

## Thresholds

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|------------------|-------------------|--------|
| p95 latency | >2000ms | >3000ms | Telegram alert; issue if critical |
| Error rate | +20% vs baseline + ≥3 failures | ≥5% error rate | Alert; issue if critical |
| 5xx errors | Any | Any | Immediate critical alert + issue |

---

## Alerts

### Telegram Format
```
🌐 API Health Report — May 12, 2026
Base: https://ziontechgroup.com

⚠️ 2 alert(s):

🔴 ai-chat: latency = 3450ms (baseline 1200)
🟡 search: error_rate_spike = error +25%

📊 Stats:
✅ homepage: p95=450ms, errors=0% (12 checks)
✅ health: p95=120ms, errors=0% (12 checks)
❌ ai-chat: p95=3450ms, errors=8% (12 checks)
✅ search: p95=890ms, errors=0% (12 checks)
```

### GitHub Issue Format
**Title:** `🚨 API Health Degradation — 05/12/2026 (2 critical)`

**Body includes:**
- Critical alerts table
- Endpoint summary (p95, error rate, check count)
- Timestamp and base URL

**Labels:** `automation`, `api`, `performance`

---

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `APP_URL` | No | `https://ziontechgroup.com` | Base URL for checks |
| `API_ENDPOINTS` | No | (built-in defaults) | JSON array of endpoint configs |
| `TELEGRAM_BOT_TOKEN` | For alerts | — | Telegram bot token |
| `TELEGRAM_CHAT_ID` | For alerts | `8435383377` | Telegram chat ID |
| `GITHUB_TOKEN` | For issues | — | GitHub CLI auth token |

---

## Storage

```
.hermes/memory/api-health/
├── api-health.log           # Daily execution log
├── history.json             # 30-day rolling time-series per endpoint
└── latest.json              # Last run full report
```

**`history.json` structure:**
```json
{
  "endpoints": {
    "ai-chat": {
      "days": {
        "2026-05-12": { "p95": 1230, "errorRate": 0.0, "totalChecks": 12, "failures": 0 },
        "2026-05-13": { "p95": 1450, "errorRate": 0.08, "totalChecks": 12, "failures": 1 }
      }
    }
  }
}
```

---

## GitHub Workflow

**Name:** API Health Monitor  
**Schedule:** Every 5 minutes (`*/5 * * * *`) — critical endpoints need frequent checks  
**Timeout:** 5 minutes

**Steps:**
1. Checkout + Node 20 + `npm ci`
2. Run `node automation/api-health-monitor.cjs`
3. Upload artifacts (report + history)

---

## Testing Locally

1. Set environment:
   ```bash
   export APP_URL=http://localhost:3000
   export TELEGRAM_BOT_TOKEN=your-bot-token  # optional
   ```
2. Run:
   ```bash
   node automation/api-health-monitor.cjs
   ```
3. Check output:
   - Console log summary
   - `.hermes/memory/api-health/latest.json`
   - `.hermes/memory/api-health/history.json` updated

4. Force a failure to test alerts:
   ```bash
   export APP_URL=https://httpstat.us/500
   node automation/api-health-monitor.cjs
   ```
   Should trigger Telegram alert + GitHub issue (if tokens set).

---

## Troubleshooting

**"No endpoints configured"** — Check `API_ENDPOINTS` JSON syntax. Use defaults if unset.

**"All checks failing"** — Verify `APP_URL` is correct and reachable from GitHub Actions runners. Test with `curl` locally.

**"High latency alerts on localhost"** — Localhost is slower by nature; set `APP_URL` to production for monitoring.

**"No Telegram alerts"** — Confirm `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in workflow secrets.

**"No GitHub issues created"** — Ensure `GITHUB_TOKEN` has `issues:write` permission. The workflow uses `permissions: issues: write` by default.

**History not accumulating** — The script stores 30-day rolling window. Check `history.json` size; old endpoints are pruned automatically.

---

## Future Enhancements

- **Dashboard UI** (`/admin/api-health`) with live latency graphs
- **Anomaly detection** beyond baseline (z-score, moving average)
- **Endpoint payload validation** (response schema check for JSON)
- **Cron schedule tuning** — critical endpoints every 2 min, others every 15 min
- **Notifications per endpoint** — separate Telegram channels for AI vs public APIs
- **Integration with Release Risk** — auto-halt deploy if API health degrades post-deploy
- **Response body size tracking** — detect unexpectedly large payloads
- **Geographic checks** — hit from multiple regions (GitHub Actions matrix)

---

## Why This Matters

- **Backend visibility:** Lighthouse only measures frontend. API health is equally critical.
- **AI endpoint guardrail:** `/api/ai/chat` is core to the product — monitor it like a heartbeat.
- **Early warning:** Detect slow degradation before complete outage.
- **Historical context:** Know if latency is normal or anomalous.
- **Free & autonomous:** No external monitoring costs; self-hosted, self-alerting.

---

*Created: 2026-05-12 — Autonomous implementation via OpenClaw (Task #26)*
