# zion.app — Workspace Status
CI/CD, V32, Partners, Gmail, ghcli

- V32 RESPONDER — COMPLETE
  - R1a/R1b/R2: M1 reply_all_binding flows back from email_orchestrator into both _fast_path and _full_pipeline
  - R3: dedup skip guard (sent_reply_log.jsonl, 30 min window) — top-of-pipeline check in _v25_pipeline
  - R5: financial payment_received auto-ack bypasses grammar gate in _fast_path
  - 8 modules patched with `from __future__ import annotations` → unblocks M1 + w2/w3 imports
  - Dry-run 5/5 exit 0: 1 fast, 3 full, 1 escalated, 2 financial, reply_all_detail populated
  - HEAD: a52d231e, pushed to origin/main

- PARTNERS PAGE — LIVE
  - src/app/partners/page.tsx + nav link committed
  - 714/714 pages, 689 sitemap URLs, /partners route confirmed

- GITHUB ACTIONS — ≥500 FAILURES (BLIND)
  - Cannot triage: gh auth not configured → API returns stale data
  - Deploys #3344/#3346 were healing late May 20 per heartbeat
  - Fix: `gh auth login` when key available

- GMAIL / CALENDAR — OAUTH DISCONNECTED
  - gog_tokens.json missing → Gmail API unreachable (2896 unread unactionable)
  - Token expired May 18
  - Fix: `gog auth login` when credential available

- NPM BUILD — GREEN (exit 0)
  - 25 TS errors (structural JSX in AI components) still present — non-blocking for static export
