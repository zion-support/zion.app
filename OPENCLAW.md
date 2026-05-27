# OpenClaw Setup for App Improvement

This workspace now supports running OpenClaw without disrupting the app's Node 20 toolchain.

## What was configured

- OpenClaw CLI is installed globally (`openclaw@latest`).
- Node 22 is installed for OpenClaw runtime compatibility.
- Wrapper script: `scripts/openclaw-app-improve.sh`
  - Runs OpenClaw with Node 22
  - Boots an isolated OpenClaw managed browser profile
  - Switches back to Node 20
  - Runs `npm run app:improvement-cycle`
- NPM scripts:
  - `npm run openclaw:status`
  - `npm run openclaw:app-improve`
  - `npm run openclaw:autonomous-once`
  - `npm run openclaw:autonomous`
  - `npm run openclaw:autonomous-guardian-once`
  - `npm run openclaw:autonomous-guardian`
  - `npm run openclaw:autonomous:start`
  - `npm run openclaw:autonomous:stop`
  - `npm run openclaw:autonomous:status`
  - `npm run openclaw:autonomous:logs`
  - `npm run openclaw:stack:start`
  - `npm run openclaw:stack:restart`
  - `npm run openclaw:stack:status`
  - `npm run openclaw:stack:logs`
  - `npm run openclaw:autonomy-cycle`
  - `npm run openclaw:prompt:score`
  - `npm run openclaw:actions:queue`
  - `npm run openclaw:pr:route`
  - `npm run openclaw:confidence:trend`
  - `npm run openclaw:deploy:gate`
  - `npm run openclaw:regression:memory`
  - `npm run openclaw:preflight`
  - `npm run openclaw:insights` (starts with `openclaw:improver:history:merge` → `openclaw-improver-history-merged-latest.json`)
  - `npm run openclaw:improver:history:merge`
  - `npm run gha:cost:estimate` (heuristic scheduled CI minutes → `gha-workflow-cost-estimate-latest.json`)
  - `npm run deploy:aggregate:guard` (optional hard gate: `DEPLOY_BLOCK_ON_AGGREGATE_CRITICAL=1`)
  - `npm run openclaw:merge:ledger`
  - `npm run openclaw:conflict:predict`
  - `npm run openclaw:reports:coalesce`
  - `npm run openclaw:commit:window:open`
  - `npm run openclaw:commit:window:close`
  - `npm run openclaw:autonomy:stability`
  - `npm run openclaw:merge:freeze:prepare` / `finalize` / `run` (orchestrates commit window + optional PM2 quiesce around risky commands)
  - `npm run openclaw:patch:router` (maps conflict-predictor hot files → patch modes)
  - `npm run openclaw:report:budget` (blocks low-value report-only commits unless signals allow)
  - `npm run deploy:local:supervised` (lock heal + `deploy:local` with retries / optional PM2 quiesce)
  - `npm run git:hooks:install` / `git:hooks:uninstall` (optional hooksPath: report budget on commit; optional stability on push)
  - `npm run push:merge-freeze` (wraps `git push` with merge-freeze when `MERGE_FREEZE_ON_PUSH=1`)
  - `npm run openclaw:autonomy:handoff` (single JSON handoff for agents: queue + router + gate + policy)
  - `npm run openclaw:report:budget:pr` (CI/PR report-only budget vs `PR_BUDGET_BASE`, default `origin/main`)
  - `npm run openclaw:lefthook:install` (optional Lefthook; see `docs/git-hooks-cross-platform.md`)
  - `npm run openclaw:handoff:validate` (structural check for `openclaw-autonomy-handoff-latest.json`)
  - `npm run openclaw:runner` / `openclaw:runner:exec` (dry-run vs execute approved queue; see `openclaw-approved-action-runner.cjs`)

## Run

```bash
npm run openclaw:status
npm run openclaw:app-improve
npm run openclaw:autonomous-once
```

## OpenRouter API key (gateway / embedded LLM)

OpenClaw can use **OpenRouter** for models like `openrouter/openrouter/free` or `openrouter/auto`. Configure the key **outside the repo** — never commit API keys.

**If a key was pasted into chat or committed, rotate it immediately** at [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys).

### Option A — env file (recommended for this repo)

1. Copy the example: `docs/openclaw-openclaw.env.example` → `~/.openclaw/openclaw.env`
2. Set `OPENROUTER_API_KEY=sk-or-v1-...` and `chmod 600 ~/.openclaw/openclaw.env`
3. `scripts/openclaw-app-improve.sh` automatically sources that file before starting the gateway.

### Option B — shell export

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
npm run openclaw:app-improve
```

### Option C — OpenClaw onboard (writes user config)

```bash
source ~/.nvm/nvm.sh && nvm use 22
openclaw onboard --auth-choice apiKey --token-provider openrouter --token "$OPENROUTER_API_KEY"
```

See also [OpenClaw OpenRouter docs](https://docs.openclaw.ai/providers/openrouter) and `docs/OPENROUTER-SETUP.md` for CI (`secrets.OPENROUTER_API_KEY`).

For continuous high-frequency autonomous prompting:

```bash
OPENCLAW_FREQUENCY_SECONDS=30 OPENCLAW_MAX_PARALLEL=2 npm run openclaw:autonomous
```

To self-heal autonomous prompting when stale:

```bash
OPENCLAW_GUARDIAN_STALE_SECONDS=300 npm run openclaw:autonomous-guardian
```

To run a full autonomous implementation/deploy cycle:

```bash
npm run openclaw:autonomy-cycle
```

To generate autonomous insights and deploy confidence:

```bash
npm run openclaw:insights
```

## Notes

- OpenClaw requires Node 22+, while this repo uses Node 20 via `.nvmrc`.
- The wrapper handles the runtime switch automatically.
- Autonomous prompt logs and report:
  - `automation/logs/openclaw-autonomous-app-improver.log`
  - `automation/reports/openclaw-autonomous-app-improver-latest.json`
- Prompt worker skill catalog:
  - `automation/config/openclaw-agent-skills.json`
- PM2 supervised OpenClaw autonomy processes:
  - `openclaw-autonomous-prompts`
  - `openclaw-autonomous-guardian`
  - `openclaw-prompt-quality-scorer`
  - `openclaw-deploy-confidence-gate`
  - `openclaw-confidence-trend-adapter`
  - `openclaw-regression-memory-agent`
  - `openclaw-merge-ledger-agent`
  - `openclaw-conflict-predictor`
  - `openclaw-report-write-coalescer`
  - `openclaw-autonomy-handoff` (hourly merge of reports → handoff JSON)
- New Openclaw GitHub Actions workflows:
  - `.github/workflows/ai-openclaw-autonomous-cycle.yml`
  - `.github/workflows/ai-openclaw-freshness-sla.yml`
  - `.github/workflows/ai-openclaw-incident-escalator.yml`
  - `.github/workflows/ai-openclaw-auth-runtime-diagnostic.yml`
  - `.github/workflows/ai-openclaw-pr-merge-stability.yml` (PRs touching `automation/` or npm lockfiles)
  - `.github/workflows/ai-openclaw-autonomy-handoff-snapshot.yml` (hourly handoff artifact)
- If your browser cannot be launched automatically, configure the executable path:

```bash
source ~/.nvm/nvm.sh
nvm use 22
openclaw config set browser.executablePath "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

## Worker catalog

Openclaw workers are configured in `automation/config/openclaw-agent-skills.json`.

Key workers include:
- quality and UX improvement
- automation and reliability optimization
- workflow reliability and release safety specialists
- PM2 SLO, docs sync, and security ops specialists

Each worker now supports richer controls: `riskTier`, `timeoutSeconds`, `maxRetries`, `cadenceSeconds`, and `outputSchema`.

### Action policy + hot files

`npm run openclaw:actions:policy` applies allowlist/confidence rules and **patch-mode enforcement** from the hot-file router (on queue items that include `patchMode`):

- `section_scoped`: only ultra-safe commands pass (lint, type-check, test:ci, build lock check/heal).
- `append_only_preferred`: also allows bounded audits (reports aggregate, SEO audit, automation audit summary, smoke routes, AI Lab integrity).

Set `OPENCLAW_POLICY_IGNORE_PATCH_MODE=1` to disable hot-file command gating (emergency only).

**PR advisory:** `ai-openclaw-pr-hotfile-comment.yml` refreshes `openclaw:conflict:predict` + `openclaw:hot:patch:route`, posts the hot-file overlap comment, and applies labels from `automation/openclaw-pr-hotfile-labels.cjs` (e.g. `autonomy-hotfile-high`, `autonomy-hotfile-medium`, `autonomy-patch-section-scoped`).

`npm run openclaw:insights` ends with `openclaw:autonomy:handoff`, writing `automation/reports/openclaw-autonomy-handoff-latest.json` (JSON Schema: `automation/config/openclaw-autonomy-handoff.schema.json`).

Policy runs append denial reason histograms to `automation/reports/openclaw-action-policy-history.json` (bounded; tune with `OPENCLAW_POLICY_HISTORY_MAX`).

- **Policy history markdown:** `npm run openclaw:policy:dashboard` → `automation/reports/openclaw-policy-history-dashboard-latest.md` (also invoked from `reports:aggregate` / report aggregator).
- **Runner telemetry:** every `openclaw:runner` run writes `automation/reports/openclaw-runner-latest.json` (`reason`, `dryRunPlanned`, `skippedHold`, `exitCode`, …). Use `OPENCLAW_RUNNER_FIXTURE_DIR` for tests.
- **PR hot-file comments** upsert via `<!-- openclaw-hotfile:thread -->` marker (`ai-openclaw-pr-merge-stability.yml`).
- **Scheduled guard:** `.github/workflows/ai-openclaw-runner-guard.yml` runs queue/policy refresh + runner dry-run; on failure opens/updates a fingerprint-deduped issue (`gh-issue-dedupe-or-create.cjs` exports `dedupe_result` / `issue_number`); **routing** runs only when `dedupe_result` is `commented` or `created` (not on cooldown skip). Optional webhooks use `notifyFormat` (`generic` \| `slack` \| `discord`) and optional critical-tier `notifyCriticalFormat` routes in routing JSON + HTTP(S) URLs, with per-reason stale-state TTL cleanup and optional `runbookOwner` auto-assignee (CODEOWNERS fallback when explicit owner is empty); on recovery strips severity/reason labels then auto-closes; bounded-history **anomaly** JSON + severity/history + optional issue comment, **artifact upload** when an anomaly fires, and a separate deduped **critical anomaly** incident (`openclaw-runner-anomaly|critical|v1`) auto-opens after two consecutive critical detections, auto-assigns owner (repo var `OPENCLAW_RUNNER_ANOMALY_CRITICAL_ASSIGNEE` fallback CODEOWNERS `/automation/`), and auto-closes on severity clear; weekly fingerprint digest + `observability-digest-latest.json` include runner anomaly summary when present.
- **Trend breach guard:** `.github/workflows/ai-openclaw-anomaly-trend-breach.yml` runs hourly and applies tiered breach loops from rolling 24h critical anomaly counts: warning fingerprint (`openclaw-runner-anomaly-trend-breach|24h|v1`) and critical fingerprint (`openclaw-runner-anomaly-trend-breach|24h|critical|v1`) with auto-close symmetry and optional warn/critical webhooks.

## Structured output contract

Openclaw worker prompts request JSON action output:

```json
{
  "actions": [
    {
      "type": "workflow-change",
      "severity": "high",
      "targetPath": ".github/workflows/example.yml",
      "command": "npm run lint:check",
      "summary": "Add retry and timeout for flaky job",
      "confidence": 0.82
    }
  ]
}
```

If a worker returns legacy text, Openclaw stores a backward-compatible `legacy-text` action record and increments parse-failure telemetry.

## Health and SLO signals

`automation/reports/openclaw-autonomous-app-improver-latest.json` includes:
- lifecycle counters: `cycles`, `promptsSent`, `successes`, `failures`
- quality counters: `actionsFound`, `severityCounts`, `parseFailures`, `lowValueCycles`
- contract counters: `contractFailures`
- per-worker freshness: `workerFreshness`
- policy signals: `workerPolicy.skippedByCadence`, `workerPolicy.skippedByRiskTier`
- preflight diagnostics: `preflight.contractCheckMode`, `preflight.rawResponseShape`, `preflight.authVerdict`
- trend history (bounded git snapshot): `automation/reports/openclaw-autonomous-app-improver-history.json`
- full ring buffer (local/PM2 only, gitignored): `automation/reports/.runtime/openclaw-autonomous-app-improver-history.json`
- throttle env: `OPENCLAW_GIT_HISTORY_MIN_WRITE_SECONDS` (default `3600`), `OPENCLAW_GIT_HISTORY_SNAPSHOT_ENTRIES` (default `48`)

Guardian restart triggers include:
- stale or missing report
- failure burst
- repeated low-value cycles
- auth preflight contract failures
- stale worker freshness windows

## Incident and recovery playbook

1. Run one-shot checks:
   - `npm run openclaw:autonomous-once`
   - `npm run openclaw:autonomous-guardian-once`
2. Inspect report:
   - `automation/reports/openclaw-autonomous-app-improver-latest.json`
3. Validate PM2 processes:
   - `npm run openclaw:stack:status`
4. Restart stack if unhealthy:
   - `npm run openclaw:stack:restart`
5. Use GitHub workflow artifacts and issue output from Openclaw SLA/incident workflows for cross-run diagnosis.
6. If preflight/auth repeatedly fails, run:
   - `npm run openclaw:auth:diagnose`
   - review `automation/reports/openclaw-auth-runtime-diagnostic-latest.json`

## Deploy confidence bands

`automation/reports/openclaw-deploy-confidence-gate-latest.json` now emits:
- `confidence` (0-100)
- `band` (`allow`, `caution`, `hold`)
- `decision` (`allow_deploy` or `hold_deploy`)
- `reasons` with threshold and safety diagnostics

Hysteresis is enabled so a prior `hold` state does not flap directly to `caution` on weak recovery.

## Autonomous effectiveness KPIs

Track these to evaluate Openclaw impact quality over time:
- `actionable_yield` = actionsFound / promptsSent
- `schema_validity_rate` from prompt quality score report
- `execution_success_rate` = successes / promptsSent
- `duplicate_action_rate` from deterministic queue dedupe ratio
- `false_hold_rate` where gate holds but post-check quality gates pass cleanly
- `false_allow_rate` where gate allows but post-check quality gates fail
7. If deploy/build lock contention appears, run:
   - `npm run build:lock:check`
   - `npm run build:lock:heal`
