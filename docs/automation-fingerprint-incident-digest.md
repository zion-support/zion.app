# Automation fingerprint incident digest

Scheduled workflow: `.github/workflows/ai-automation-fingerprint-digest-weekly.yml`

## What it does

- Lists open GitHub issues that have any `automation-fp-*` label (from `gh-issue-dedupe-or-create.cjs`).
- Writes `automation/reports/automation-fingerprint-incidents-latest.{json,md}` (gitignored locally when not committed).
- **Delta tracking** — compares to `automation-fingerprint-incidents-digest-last.json` (restored from Actions cache between runs) to compute **new** and **resolved** issue numbers; included in Markdown and prepended to Slack/Discord when non-empty.
- **Hotness** — increments per-issue counters in `automation-fingerprint-incidents-hotness-state.json` (cached) and sorts by **hours quiet × weight + recurrence** for “must-fix first” ordering in JSON, Markdown, rollup, and escalation text.
- Uploads reports + state files as workflow artifacts.
- **Cross-run state** — workflow restores/saves digest last, hotness, escalation, and **trend** JSON via `actions/cache` so delta/cooldown/hotness/trend history work across scheduled runs.
- **Trend file** — appends a row to `automation-fingerprint-incidents-trend.json` (open count, delta counts, severity, registry EMA) for dashboard sparklines (up to ~104 rows).
- **Auto-assign (opt-in)** — `AUTOMATION_FP_DIGEST_AUTO_ASSIGN_SUGGESTED=1` runs `gh issue edit --add-assignee` when `automation-fingerprint-digest-extras.json` `assigneeRules` match and the user is not already assigned.
- **Rollup critical comment (opt-in)** — `AUTOMATION_FP_DIGEST_ROLLUP_CRITICAL_COMMENT=1` posts a checklist comment on the rollup issue when **escalation severity is critical** and there are **new** issues this run.
- **Rich chat** — `AUTOMATION_FP_DIGEST_SLACK_USE_BLOCKS=1` sends Slack Block Kit; `AUTOMATION_FP_DIGEST_DISCORD_USE_EMBEDS=1` sends Discord embeds (SLA buckets + delta + top issues).
- **GitHub Project (opt-in)** — `DIGEST_PROJECT_OWNER` + `DIGEST_PROJECT_NUMBER` run `gh project item-add` for each **new** issue in the delta (requires workflow `projects: write` and a project the token can access). If the CLI add fails (or only Projects v2 is configured), set **`DIGEST_PROJECT_V2_NODE_ID`** to the board’s GraphQL node id to fall back to `addProjectV2ItemById`.
- **Rollup critical dedupe** — when `DIGEST_ROLLUP_CRITICAL_COMMENT` posts on the rollup, a SHA-256 of the sorted **new** issue ids is stored in `automation-fingerprint-incidents-rollup-critical-delta-last.json` (cached in Actions) so the **same** new-issue set does not spam duplicate comments.
- **CODEOWNERS fallback (opt-in)** — `DIGEST_USE_CODEOWNERS=1` uses `.github/CODEOWNERS` for `suggestedAssignee` / auto-assign when extras rules do not match. Path selection uses `DIGEST_CODEOWNERS_LOGICAL_PATH` (default: `automation/reports/incident-suppression-registry-latest.json`). Repo adds `/automation/` owners for routing.
- **Critical → PR nudge (opt-in)** — `DIGEST_CRITICAL_PR_COMMENT=1` comments on open PRs that touch `automation/` when severity is **critical**, only when **`GITHUB_EVENT_NAME=workflow_dispatch`** (manual run), so scheduled digest does not spam PRs.
- **Slack trend snippet (opt-in)** — with `DIGEST_SLACK_USE_BLOCKS` and `DIGEST_SLACK_INCLUDE_TREND=1`, the last few rows from the trend file are appended as an extra Slack block.
- **EMA sibling comment (opt-in)** — `AUTOMATION_FP_DIGEST_EMA_SIBLING_COMMENT=1` + threshold: when `incident-suppression-registry-latest.json` has `noise.emaOpenIncidents` ≥ threshold, posts context on the **hottest** open incident with links to other digest issues.
- **Dry run mode** — `DIGEST_DRY_RUN=1` generates JSON/MD/trend output but skips all external mutations (comments, labels, project adds, webhooks/escalation), useful for safe CI checks.
- **Prometheus export** — `automation/export-fingerprint-trend-prom.cjs` writes `automation-fingerprint-incidents-metrics.prom` from latest digest + trend snapshots.

### Optional notifications when open count &gt; 0

- **Telegram** — set repo variable `AUTOMATION_FP_DIGEST_TELEGRAM` to `1` and configure `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` secrets.
- **Slack** — secret `AUTOMATION_DIGEST_SLACK_WEBHOOK`.
- **Discord** — secret `AUTOMATION_DIGEST_DISCORD_WEBHOOK` (plain text in `content` field).
- **Delta-only mode** — set `AUTOMATION_FP_DIGEST_DELTA_NOTIFY_ONLY=1` to skip Slack/Discord/Telegram when there is no new/resolved delta since the previous run (after the first baseline run).

### Rolling digest issue

When `DIGEST_ROLLUP_ISSUE=1` (set in workflow), creates or updates an issue titled **Automation fingerprint incidents — rolling digest** (label `automation-fp-digest-rollup`) with:

- SLA buckets: **Fresh (&lt; 24h)**, **1–7 days**, **&gt; 7 days (stale)** with ownership hints.
- **Priority (hotness)** — top 15 by score.
- Optional **runbook links** from `automation/config/automation-fingerprint-digest-extras.json` (`matchTitleContains` → `url`, optional `default`).

**Rollup lifecycle** (optional):

- `AUTOMATION_FP_DIGEST_ROLLUP_AUTO_CLOSE=1` closes the rollup when open incident count is 0; it reopens when incidents return.
- `AUTOMATION_FP_DIGEST_ROLLUP_ASSIGNEE=<github-username>` assigns on create only.

### Escalation (optional)

**Warning tier** (original thresholds):

- Repo variables: `AUTOMATION_FP_DIGEST_ESCALATION_MIN_COUNT`, `AUTOMATION_FP_DIGEST_ESCALATION_STALE_DAYS`.
- Secrets: `AUTOMATION_DIGEST_ESCALATION_WEBHOOK`, `AUTOMATION_DIGEST_ESCALATION_PAGERDUTY_KEY`.

**Critical tier** (stricter; checked first):

- Repo variables: `AUTOMATION_FP_DIGEST_ESCALATION_CRITICAL_MIN_COUNT`, `AUTOMATION_FP_DIGEST_ESCALATION_CRITICAL_STALE_DAYS`.
- Secrets: `AUTOMATION_DIGEST_ESCALATION_CRITICAL_WEBHOOK`, `AUTOMATION_DIGEST_ESCALATION_CRITICAL_PAGERDUTY_KEY`.
- If critical secrets are unset, critical tier falls back to warning webhooks / PagerDuty keys.

**Cooldown** — `AUTOMATION_FP_DIGEST_ESCALATION_COOLDOWN_HOURS` (default 24) using `automation-fingerprint-incidents-escalation-state.json` (cached).

### Routing config

Edit `automation/config/automation-fingerprint-digest-extras.json`:

- `assigneeRules`: `{ "matchTitleContains": ["PM2"], "assignee": "github-user" }` — surfaces as `suggestedAssignee` in JSON; with `AUTOMATION_FP_DIGEST_AUTO_ASSIGN_SUGGESTED=1`, also applies assignee on the GitHub issue when missing.

Override path: env `DIGEST_EXTRAS_CONFIG`.

## Without token

`automation/generate-automation-fingerprint-incident-digest.cjs` writes stub files and exits 0 if `GH_TOKEN` / `GITHUB_TOKEN` is unset.

## npm

```bash
npm run automation:fingerprint-digest
```

## Environment reference

| Variable | Purpose |
| -------- | ------- |
| `DIGEST_ROLLUP_ISSUE` | `1` / `true` to upsert the rolling GitHub issue |
| `DIGEST_ROLLUP_AUTO_CLOSE` | `1` / `true` to close rollup when count reaches 0 (reopens automatically) |
| `DIGEST_ROLLUP_ASSIGNEE` | Optional GitHub username assigned when creating rollup issue |
| `DIGEST_DELTA_NOTIFY_ONLY` | `1` / `true` to notify only when delta is non-empty (after baseline) |
| `DIGEST_ESCALATION_MIN_COUNT` | Warning: escalate when open `automation-fp-*` count ≥ this |
| `DIGEST_ESCALATION_STALE_DAYS` | Warning: escalate when any incident’s `updatedAt` is older than this many days |
| `DIGEST_ESCALATION_CRITICAL_MIN_COUNT` | Critical tier when count ≥ this |
| `DIGEST_ESCALATION_CRITICAL_STALE_DAYS` | Critical tier when any incident older than this many days |
| `DIGEST_ESCALATION_COOLDOWN_HOURS` | Minimum hours between escalation sends (default `24`) |
| `DIGEST_ESCALATION_*` / `DIGEST_ESCALATION_CRITICAL_*` | Webhooks and PagerDuty routing keys (see above) |
| `DIGEST_AUTO_ASSIGN_SUGGESTED` | `1` / `true` to apply `assigneeRules` via `gh issue edit` |
| `DIGEST_ROLLUP_CRITICAL_COMMENT` | `1` / `true` for rollup comment on critical + new delta |
| `DIGEST_SLACK_USE_BLOCKS` | `1` / `true` for Slack Block Kit payload |
| `DIGEST_DISCORD_USE_EMBEDS` | `1` / `true` for Discord embeds |
| `DIGEST_PROJECT_OWNER` / `DIGEST_PROJECT_NUMBER` | `gh project item-add` for delta new issues |
| `DIGEST_PROJECT_V2_NODE_ID` | Projects v2 GraphQL project id; fallback if CLI add fails |
| `DIGEST_USE_CODEOWNERS` | `1` / `true` to resolve assignee from CODEOWNERS when extras miss |
| `DIGEST_CODEOWNERS_LOGICAL_PATH` | Repo-relative path for CODEOWNERS matching (default see script header) |
| `DIGEST_CRITICAL_PR_COMMENT` | `1` / `true` to nudge PRs touching `automation/` on critical (manual dispatch only) |
| `DIGEST_SLACK_INCLUDE_TREND` | `1` / `true` to append trend rows to Slack Block Kit payload |
| `DIGEST_EMA_SIBLING_COMMENT` / `DIGEST_EMA_SIBLING_THRESHOLD` | Comment on hottest issue when registry EMA ≥ threshold |
| `DIGEST_CLUSTER_COMPACT_NOTIFY` | `1` / `true` forces compact **cluster rollup** in Slack/Discord/Telegram; `0` / `false` disables auto mode |
| `DIGEST_CLUSTER_COMPACT_MIN_OPEN` | When `DIGEST_CLUSTER_COMPACT_NOTIFY` is unset, use compact mode when open FP issues ≥ this (default `6`) |
| `DIGEST_DRY_RUN` | `1` / `true` to skip all external mutations and only write local digest/trend artifacts |
| `DIGEST_APPLY_DELTA_LABEL` | `1` / `true` to add `DIGEST_DELTA_LABEL_NAME` to each issue in this run’s **new** delta |
| `DIGEST_DELTA_LABEL_NAME` | Label to apply (default `automation-fp-delta-seen`) |
| `DIGEST_EXTRAS_CONFIG` | Optional path to JSON routing config |

**Cluster rollup** — issues sharing any `automation-fp-*` label are grouped (connected components). In compact mode, chat notifications prefer one summary block per multi-issue cluster instead of repeating every issue line.

### Related automation

- **PR preflight** — `.github/workflows/ai-automation-fingerprint-digest-preflight.yml` runs on PRs touching `automation/**` (and digest workflows): `node --check` on the digest script, a **no-token** stub run, and `npm run automation:preflight`.
- **PR label routing** — `.github/workflows/ai-automation-fingerprint-digest-pr-label.yml` adds `automation-digest-touched` when digest logic/workflows are changed.
- **Digest freshness SLA** — `.github/workflows/ai-automation-fingerprint-digest-freshness.yml` (weekly + manual) runs `automation/check-fingerprint-digest-freshness.cjs` (see `npm run automation:fingerprint-digest:freshness`). Repo vars: `AUTOMATION_FP_DIGEST_FRESHNESS_MAX_HOURS` (default 192), `AUTOMATION_FP_DIGEST_FRESHNESS_COOLDOWN_HOURS` for dedupe cooldown.
- **Freshness recovery close** — the same freshness workflow auto-closes the stale issue fingerprint when SLA is healthy again.
- **Deploy watchdog hook** — set repo var `AUTOMATION_FP_DIGEST_DISPATCH_ON_DEPLOY_FAILURE=1` so `deploy-on-push.yml` **dispatches** the digest workflow when `deploy-watchdog-latest.json` reports unhealthy routes after deploy.
- **Observability merge** — `automation/observability-digest.cjs` embeds fingerprint JSON + trend **when those files exist** under `automation/reports/` (e.g. after a local or CI digest run), exposing `summary.fingerprintDigestOpen`, `fingerprintTrendLastOpen`, etc. Weekly digest workflow now runs this merge after generating digest artifacts.

### Slack threads (bot token)

Incoming webhooks (`AUTOMATION_DIGEST_SLACK_WEBHOOK`) **cannot** post thread replies. For threaded follow-ups, use a **Slack Bot** with `chat.postMessage`, passing `thread_ts` from the parent message (or from the first post’s response `ts`). Keep using webhooks for simple one-shot digests; use the Bot API when you need threads or reactions.

See also `docs/automation-issue-dedupe-helper.md`.
