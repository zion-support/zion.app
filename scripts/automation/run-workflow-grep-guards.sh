#!/usr/bin/env bash
# Shared checks for .github/workflows (used by workflow-*-guard.yml jobs).
# Usage:
#   run-workflow-grep-guards.sh           # all checks
#   run-workflow-grep-guards.sh --pin     # actions/* @v* + SHA comment + third-party @v* + docker/container/image :latest
#                                         + canonical pins for common actions/* (when used); see header Pin policy
#   run-workflow-grep-guards.sh --permissions  # invalid keys + top-level permissions: block
#   run-workflow-grep-guards.sh --push  # no raw push in YAML + concurrency + no cancel-in-progress:true on pushers
#   run-workflow-grep-guards.sh --setup-node-policy  # only: local node + setup-node, no hardcoded Node 20, npm cache path
#   run-workflow-grep-guards.sh --npm-ci-policy      # only: bare npm ci / multiline npm ci policy
#   run-workflow-grep-guards.sh --runs-on-policy   # only: ubuntu-latest or ${{ }} for runs-on
#   run-workflow-grep-guards.sh --policy-fast      # same as --setup-node-policy --npm-ci-policy --runs-on-policy (Ruby-free)
#   run-workflow-grep-guards.sh --push-token       # only: commit-and-push / push-main-with-retry must reference github.token (Ruby-free)
# Push helpers: scripts/automation/commit-and-push-main.sh (stage+commit+push),
#   scripts/automation/push-main-with-retry.sh (push only, one rebase retry).
#   Both deepen shallow clones before git pull --rebase (actions/checkout default depth).
# Local npm (package.json): workflows:grep-guards (full) and workflows:grep-guards:<subset> (pin, permissions, push, policy-fast, push-token, parse, dependabot, codeowners, merge-conflicts, package-dedup, etc.).
# Manual CI: .github/workflows/workflow-parse-ruby-fast.yml (Ruby parse only when parse-github-workflows-yaml.rb changes);
#   .github/workflows/workflow-ruby-parse-smoke-weekly.yml (scheduled grep anchors on parse-github-workflows-yaml.rb + full Ruby parse);
#   .github/workflows/workflow-grep-guards-fast.yml (grep guards only when run-workflow-grep-guards.sh changes);
#   .github/workflows/workflow-grep-guards-fast-smoke-weekly.yml (scheduled workflow-grep-guards-fast.yml path triggers + run anchor);
#   .github/workflows/workflow-grep-guards-weekly.yml (scheduled full grep guards on main, no Node);
#   .github/workflows/workflow-grep-guards-weekly-smoke-weekly.yml (scheduled workflow-grep-guards-weekly.yml Sunday cron + run anchor);
#   .github/workflows/workflow-push-helpers-bash-fast.yml (bash -n on push helpers when those scripts change);
#   .github/workflows/workflow-push-helpers-bash-weekly.yml (scheduled bash -n on push helpers);
#   .github/workflows/workflow-push-helpers-bash-weekly-smoke-weekly.yml (scheduled workflow-push-helpers-bash-weekly.yml Friday cron + bash -n anchors);
#   .github/workflows/workflow-push-helpers-behavior-smoke-weekly.yml (scheduled grep on push helpers for shallow deepen + rebase retry);
#   .github/workflows/workflow-dependabot-yml-smoke-weekly.yml (scheduled .github/dependabot.yml version + ecosystem anchors);
#   .github/workflows/dependabot-config-validate.yml (Ruby YAML parse on dependabot.yml changes + Monday schedule);
#   .github/workflows/dependabot-config-validate-smoke-weekly.yml (scheduled dependabot-config-validate.yml Ruby parse + cron anchors);
#   .github/workflows/workflow-action-pin-guard.yml (PR/push path-scoped --pin subset);
#   .github/workflows/workflow-action-pin-guard-smoke-weekly.yml (scheduled workflow-action-pin-guard.yml path + --pin anchors);
#   .github/workflows/workflow-action-pin-smoke-weekly.yml (scheduled full --pin grep pass);
#   .github/workflows/pin-actions-weekly.yml (weekly npm run pin-actions + push helper to main);
#   .github/workflows/pin-actions-weekly-smoke-weekly.yml (scheduled pin-actions-weekly.yml cron + push-helper + token anchors);
#   .github/workflows/workflow-labeler-config-smoke-weekly.yml (scheduled .github/labeler.yml + auto-label workflow anchors);
#   .github/workflows/workflow-yaml-sanity-smoke-weekly.yml (scheduled workflow-yaml-sanity.yml reusable-CI + path-contract anchors);
#   .github/workflows/workflow-reusable-ci-smoke-weekly.yml (scheduled reusable-workflow-ci.yml workflow_call + validate/contracts anchors);
#   .github/workflows/workflow-change-guard-smoke-weekly.yml (scheduled workflow-change-guard.yml protected-path + contract anchors);
#   .github/workflows/workflow-permissions-guard-smoke-weekly.yml (scheduled workflow-permissions-guard.yml trigger scope + --permissions anchor);
#   .github/workflows/workflow-grep-subset-dispatch-smoke-weekly.yml (scheduled workflow-grep-subset-dispatch.yml manual subset routing anchors);
#   .github/workflows/workflow-parse-ruby-only-dispatch-smoke-weekly.yml (scheduled workflow-parse-ruby-only-dispatch.yml Ruby-only manual path anchors);
#   .github/workflows/workflow-nvmrc-smoke-weekly.yml (scheduled .nvmrc + engines.node cross-check);
#   .github/workflows/workflow-package-lock-smoke-weekly.yml (scheduled package-lock.json presence + JSON parse);
#   .github/workflows/workflow-package-json-smoke-weekly.yml (scheduled package.json parse + name/scripts/engines + critical CI script keys);
#   .github/workflows/workflow-readme-smoke-weekly.yml (scheduled README.md title + site URL + dev/quality hints);
#   .github/workflows/workflow-agents-md-smoke-weekly.yml (scheduled AGENTS.md session + safety anchors);
#   .github/workflows/workflow-user-md-smoke-weekly.yml (scheduled USER.md standing mandate + safety);
#   .github/workflows/workflow-soul-md-smoke-weekly.yml (scheduled SOUL.md identity + continuity anchors);
#   .github/workflows/workflow-heartbeat-md-smoke-weekly.yml (scheduled HEARTBEAT.md mandate + safety);
#   .github/workflows/workflow-memory-md-smoke-weekly.yml (scheduled MEMORY.md log shape + continuity refs);
#   .github/workflows/workflow-cto-philosophy-md-smoke-weekly.yml (scheduled docs/CTO-OPERATING-PHILOSOPHY.md anchors);
#   .github/workflows/workflow-next-autonomous-ideas-md-smoke-weekly.yml (scheduled docs/NEXT-AUTONOMOUS-IDEAS.md anchors);
#   .github/workflows/workflow-agent-quickstart-md-smoke-weekly.yml (scheduled docs/AGENT-QUICKSTART.md anchors);
#   .github/workflows/workflow-contact-forms-audit-md-smoke-weekly.yml (scheduled CONTACT-FORMS-AUDIT.md + CONTACT_INFO anchors);
#   .github/workflows/workflow-tools-md-smoke-weekly.yml (scheduled TOOLS.md local-notes anchors);
#   .github/workflows/workflow-cto-directive-rule-mdc-smoke-weekly.yml (scheduled .cursor/rules/cto-operating-directive.mdc anchors);
#   .github/workflows/workflow-autonomy-rule-mdc-smoke-weekly.yml (scheduled .cursor/rules/autonomy-and-continuous-improvement.mdc anchors);
#   .github/workflows/workflow-seo-constants-smoke-weekly.yml (scheduled app/utils/seoConstants.ts CONTACT_INFO + site URL anchors);
#   .github/workflows/workflow-observability-ema-webhook-smoke-weekly.yml (scheduled ai-observability-ema-webhook-daily.yml auth/concurrency/push-helper anchors);
#   .github/workflows/ai-netlify-playwright-smoke.yml (scheduled Playwright smoke against Netlify deploy reports);
#   .github/workflows/ai-netlify-playwright-smoke-smoke-weekly.yml (scheduled ai-netlify-playwright-smoke.yml cron + playwright + artifact anchors);
#   .github/workflows/ai-production-deploy-validation.yml (post-deploy sitemap/SEO/link checks after Deploy on Push);
#   .github/workflows/ai-production-deploy-validation-smoke-weekly.yml (scheduled ai-production-deploy-validation.yml workflow_run + validation anchors);
#   .github/workflows/ai-production-smoke-scheduled.yml (scheduled production route smoke + issue dedupe/recovery);
#   .github/workflows/ai-production-smoke-scheduled-smoke-weekly.yml (scheduled ai-production-smoke-scheduled.yml 6h cron + issue hook anchors);
#   .github/workflows/ai-workflow-slo-monitor.yml (scheduled workflow reliability SLO analyzer + issue lifecycle hooks);
#   .github/workflows/ai-workflow-slo-monitor-smoke-weekly.yml (scheduled ai-workflow-slo-monitor.yml cron + thresholds + issue anchors);
#   .github/workflows/ai-workflow-flake-detector.yml (scheduled workflow flake detector + issue lifecycle hooks);
#   .github/workflows/ai-workflow-flake-detector-smoke-weekly.yml (scheduled ai-workflow-flake-detector.yml cron + issue/report anchors);
#   .github/workflows/ai-workflow-trust-regression-guard.yml (scheduled workflow trust regression sentinel + artifact trail);
#   .github/workflows/ai-workflow-trust-regression-guard-smoke-weekly.yml (scheduled ai-workflow-trust-regression-guard.yml 30m cron + trust anchors);
#   .github/workflows/ai-automation-health-monitor.yml (scheduled automation + cron health monitor with artifacts);
#   .github/workflows/ai-automation-health-monitor-smoke-weekly.yml (scheduled ai-automation-health-monitor.yml daily cron + health anchors);
#   .github/workflows/ai-openclaw-skill-auto-tuner.yml (scheduled Openclaw skill cadence audit + auto-tuning + stabilize escalation);
#   .github/workflows/ai-openclaw-skill-auto-tuner-smoke-weekly.yml (scheduled ai-openclaw-skill-auto-tuner.yml 6h cron + escalation anchors);
#   .github/workflows/ai-openclaw-skill-cadence-audit.yml (scheduled Openclaw skill cadence audit + issue escalation);
#   .github/workflows/ai-openclaw-skill-cadence-audit-smoke-weekly.yml (scheduled ai-openclaw-skill-cadence-audit.yml 8h cron + issue/report anchors);
#   .github/workflows/ai-openclaw-auth-runtime-diagnostic.yml (scheduled Openclaw auth/runtime drift diagnostic + issue escalation);
#   .github/workflows/ai-openclaw-auth-runtime-diagnostic-smoke-weekly.yml (scheduled ai-openclaw-auth-runtime-diagnostic.yml 6h cron + diagnostic report anchors);
#   .github/workflows/ai-openclaw-runtime-applier.yml (scheduled Openclaw runtime recommendation application + artifact bundle);
#   .github/workflows/ai-openclaw-runtime-applier-smoke-weekly.yml (scheduled ai-openclaw-runtime-applier.yml 6h cron + issue/report anchors);
#   .github/workflows/ai-openclaw-anomaly-trend-breach.yml (scheduled OpenClaw anomaly trend breach guard);
#   .github/workflows/ai-openclaw-anomaly-trend-breach-smoke-weekly.yml (scheduled ai-openclaw-anomaly-trend-breach.yml cron + anomaly guard anchors);
#   .github/workflows/ai-openclaw-autonomous-cycle.yml (scheduled OpenClaw autonomous cycle);
#   .github/workflows/ai-openclaw-autonomous-cycle-smoke-weekly.yml (scheduled ai-openclaw-autonomous-cycle.yml 6h cron + cycle commands/artefacts anchors);
#   .github/workflows/ai-openclaw-autonomy-handoff-snapshot.yml (scheduled OpenClaw autonomy handoff snapshot);
#   .github/workflows/ai-openclaw-autonomy-handoff-snapshot-smoke-weekly.yml (scheduled ai-openclaw-autonomy-handoff-snapshot.yml hourly cron + handoff validate/artefact anchors);
#   .github/workflows/ai-openclaw-freshness-sla.yml (scheduled OpenClaw freshness SLA evaluation);
#   .github/workflows/ai-openclaw-freshness-sla-smoke-weekly.yml (scheduled ai-openclaw-freshness-sla.yml 4h cron + SLA/issue hooks anchors);
#   .github/workflows/ai-openclaw-incident-escalator.yml (scheduled OpenClaw incident escalator);
#   .github/workflows/ai-openclaw-incident-escalator-smoke-weekly.yml (scheduled ai-openclaw-incident-escalator.yml 6h cron + incident/issue hooks anchors);
#   .github/workflows/ai-openclaw-insights-ci.yml (scheduled OpenClaw insights bundle pipeline);
#   .github/workflows/ai-openclaw-insights-ci-smoke-weekly.yml (scheduled ai-openclaw-insights-ci.yml weekly anchors for merge/queue/deploy + artefacts);
#   .github/workflows/ai-openclaw-pr-hotfile-comment.yml (scheduled PR hot-file advisory comment + labeler);
#   .github/workflows/ai-openclaw-pr-hotfile-comment-smoke-weekly.yml (scheduled ai-openclaw-pr-hotfile-comment.yml PR types + hot-file script anchors);
#   .github/workflows/ai-openclaw-pr-merge-stability.yml (scheduled OpenClaw PR merge stability path gate);
#   .github/workflows/ai-openclaw-pr-merge-stability-smoke-weekly.yml (scheduled ai-openclaw-pr-merge-stability.yml PR paths + stability/lint anchors);
#   .github/workflows/ai-openclaw-runner-guard.yml (scheduled OpenClaw runner guard dry-run + incident escalation);
#   .github/workflows/ai-openclaw-runner-guard-smoke-weekly.yml (scheduled ai-openclaw-runner-guard.yml 6h cron + runner/anomaly issue anchors);
#   .github/workflows/ai-accessibility-audit.yml (scheduled Accessibility Audit build + axe CLI on PR/schedule);
#   .github/workflows/ai-accessibility-audit-smoke-weekly.yml (scheduled ai-accessibility-audit.yml Tuesday cron + build/axe PR hook anchors);
#   .github/workflows/ai-automation-audit.yml (scheduled automation ecosystem audit + self-healing suggestions);
#   .github/workflows/ai-automation-audit-smoke-weekly.yml (scheduled ai-automation-audit.yml Saturday cron + preflight/audit/self-heal/report anchors);
#   .github/workflows/ai-broken-link-fixer.yml (scheduled broken link scanning + optional push);
#   .github/workflows/ai-broken-link-fixer-smoke-weekly.yml (scheduled ai-broken-link-fixer.yml cron + mode options + report/push wiring anchors);
#   .github/workflows/ai-advanced-ai-content.yml (scheduled advanced AI content pipeline with optional commit/deploy);
#   .github/workflows/ai-advanced-ai-content-smoke-weekly.yml (scheduled ai-advanced-ai-content.yml three-times-per-day schedule + pipeline/env anchors);
#   .github/workflows/workflow-tsconfig-smoke-weekly.yml (scheduled tsconfig.json parse + compilerOptions shape);
#   .github/workflows/workflow-eslint-config-smoke-weekly.yml (scheduled eslint.config.mjs ESM load smoke);
#   .github/workflows/workflow-next-jest-config-smoke-weekly.yml (scheduled next.config.mjs export + jest.config.cjs syntax);
#   .github/workflows/workflow-postcss-ecosystem-smoke-weekly.yml (scheduled postcss.config.mjs + ecosystem.config.cjs);
#   .github/workflows/workflow-config-ci-assets-smoke-weekly.yml (scheduled config/jest-quarantine + smoke-routes);
#   .github/workflows/workflow-public-manifest-smoke-weekly.yml (scheduled public/manifest.json PWA shape);
#   .github/workflows/workflow-public-icon-svg-smoke-weekly.yml (scheduled public/icon.svg PWA/metadata asset);
#   .github/workflows/workflow-public-robots-smoke-weekly.yml (scheduled public/robots.txt User-agent + Sitemap);
#   .github/workflows/workflow-netlify-toml-smoke-weekly.yml (scheduled netlify.toml build/publish/Node 20);
#   .github/workflows/workflow-tailwind-config-smoke-weekly.yml (scheduled tailwind.config.ts content/theme/export);
#   .github/workflows/workflow-app-globals-css-smoke-weekly.yml (scheduled app/globals.css Tailwind directives);
#   .github/workflows/workflow-app-layout-smoke-weekly.yml (scheduled app/layout.tsx metadata/viewport/shell);
#   .github/workflows/workflow-app-sitemap-smoke-weekly.yml (scheduled app/sitemap.ts static SEO export);
#   .github/workflows/workflow-app-robots-smoke-weekly.yml (scheduled app/robots.ts static robots + sitemap URL);
#   .github/workflows/workflow-app-page-smoke-weekly.yml (scheduled app/page.tsx Home + core imports);
#   .github/workflows/workflow-app-not-found-smoke-weekly.yml (scheduled app/not-found.tsx 404 shell);
#   .github/workflows/workflow-merge-conflict-markers-fast.yml (merge-marker scan when that script changes);
#   .github/workflows/workflow-merge-conflict-markers-fast-smoke-weekly.yml (scheduled workflow-merge-conflict-markers-fast.yml path + setup-node anchors);
#   .github/workflows/workflow-merge-conflict-markers-weekly.yml (scheduled merge-marker scan on main);
#   .github/workflows/workflow-merge-conflict-markers-weekly-smoke-weekly.yml (scheduled workflow-merge-conflict-markers-weekly.yml Sunday cron + scan anchors);
#   .github/workflows/workflow-cron-collision-pr.yml (PR/main cron report when workflows or tuner change);
#   .github/workflows/workflow-cron-collision-pr-smoke-weekly.yml (scheduled workflow-cron-collision-pr.yml path + tuner + artifact anchors);
#   .github/workflows/workflow-package-script-dedup-fast.yml (dedupe check when checker script changes);
#   .github/workflows/workflow-package-script-dedup-fast-smoke-weekly.yml (scheduled workflow-package-script-dedup-fast.yml path + setup-node anchors);
#   .github/workflows/workflow-push-helpers-bash-fast.yml (bash -n when push helpers change);
#   .github/workflows/workflow-push-helpers-bash-fast-smoke-weekly.yml (scheduled workflow-push-helpers-bash-fast.yml path + bash -n anchors);
#   .github/workflows/workflow-cron-collision-weekly.yml (scheduled cron overlap report on main);
#   .github/workflows/workflow-cron-collision-weekly-smoke-weekly.yml (scheduled workflow-cron-collision-weekly.yml Monday cron + tuner + artifact anchors);
#   .github/workflows/workflow-package-script-dedup-weekly.yml (scheduled package.json scripts dedupe on main);
#   .github/workflows/workflow-package-script-dedup-weekly-smoke-weekly.yml (scheduled workflow-package-script-dedup-weekly.yml Tuesday cron + dedupe anchors);
#   .github/workflows/workflow-automation-preflight-weekly.yml (scheduled npm run automation:preflight, no npm ci);
#   .github/workflows/workflow-automation-preflight-weekly-smoke-weekly.yml (scheduled workflow-automation-preflight-weekly.yml Thursday cron + preflight anchors);
#   .github/workflows/deploy-preflight.yml (manual deploy gate: lint/type/build + optional Netlify hook);
#   .github/workflows/deploy-preflight-smoke-weekly.yml (scheduled deploy-preflight.yml dispatch inputs + quality gate anchors);
#   .github/workflows/ci-cd.yml (main/develop CI: preflight, lint, typecheck, test, build);
#   .github/workflows/ci-cd-smoke-weekly.yml (scheduled ci-cd.yml trigger + npm CI anchor checks);
#   .github/workflows/deploy-on-push.yml (Netlify deploy after CI / push main + status reports);
#   .github/workflows/deploy-on-push-smoke-weekly.yml (scheduled deploy-on-push.yml workflow_run + token + hook anchors);
#   .github/workflows/dependency-review.yml (PR dependency + license gate on main);
#   .github/workflows/dependency-review-smoke-weekly.yml (scheduled dependency-review.yml PR permissions + action policy anchors);
#   .github/workflows/codeql-analysis.yml (scheduled + PR/push CodeQL for javascript-typescript);
#   .github/workflows/codeql-analysis-smoke-weekly.yml (scheduled codeql-analysis.yml Monday cron + CodeQL pin anchors);
#   .github/workflows/production-smoke-test.yml (post-deploy HTTP smoke via workflow_run);
#   .github/workflows/production-smoke-test-smoke-weekly.yml (scheduled production-smoke-test.yml deploy chain + routes anchors);
#   .github/workflows/production-health-monitor.yml (scheduled production URL health + SSL/issue hooks);
#   .github/workflows/production-health-monitor-smoke-weekly.yml (scheduled production-health-monitor.yml 6h cron + site anchors);
#   .github/workflows/lighthouse-production.yml (scheduled production Lighthouse audit report);
#   .github/workflows/lighthouse-production-smoke-weekly.yml (scheduled lighthouse-production.yml Sunday cron + lighthouse report anchors);
#   .github/workflows/stale.yml (daily stale issues/PRs via actions/stale);
#   .github/workflows/stale-smoke-weekly.yml (scheduled stale.yml cron + stale-action pin anchors);
#   .github/workflows/bundle-size.yml (PR path-scoped bundle size on main);
#   .github/workflows/bundle-size-smoke-weekly.yml (scheduled bundle-size.yml path triggers + npm build anchors);
#   .github/workflows/lighthouse-ci.yml (PR + weekly Lighthouse against static export);
#   .github/workflows/lighthouse-ci-smoke-weekly.yml (scheduled lighthouse-ci.yml triggers + build + npx lighthouse anchors);
#   .github/workflows/core-web-vitals-monitor.yml (scheduled CWV against production + issue hooks);
#   .github/workflows/core-web-vitals-monitor-smoke-weekly.yml (scheduled core-web-vitals-monitor.yml 12h cron + site anchors);
#   .github/workflows/workflow-grep-subset-dispatch.yml (grep subsets; ruby / integrity / bash / dependabot / codeowners / package-dedup / merge-conflict scan via same dispatch);
#   .github/workflows/workflow-parse-ruby-only-dispatch.yml (Ruby parse only, no grep);
#   .github/workflows/workflow-ruby-bash-validate-dispatch.yml (full grep, no npm);
#   .github/workflows/workflow-ruby-bash-validate-dispatch-smoke-weekly.yml (scheduled workflow-ruby-bash-validate-dispatch.yml Ruby+grep+bash -n anchors);
#   .github/workflows/workflow-report-push-guard.yml (PR/push path-scoped --push subset);
#   .github/workflows/workflow-report-push-guard-smoke-weekly.yml (scheduled workflow-report-push-guard.yml path + --push anchors);
#   .github/workflows/workflow-parse-ruby-fast.yml (Ruby parse when parser file changes);
#   .github/workflows/workflow-parse-ruby-fast-smoke-weekly.yml (scheduled workflow-parse-ruby-fast.yml path trigger + Ruby parse anchors);
#   .github/workflows/workflow-reusable-ci-dispatch.yml (validate light + optional contracts);
#   .github/workflows/workflow-reusable-ci-dispatch-smoke-weekly.yml (scheduled workflow-reusable-ci-dispatch.yml manual reusable-CI anchors);
#   .github/workflows/workflow-validate-light-weekly-smoke-weekly.yml (scheduled workflow-validate-light-weekly.yml reusable-CI + cron anchors);
#   .github/workflows/workflow-contracts-weekly-smoke-weekly.yml (scheduled workflow-contracts-weekly.yml reusable-CI + cron-report anchors);
#   .github/workflows/workflow-node-contracts-dispatch.yml (contracts only);
#   .github/workflows/workflow-node-contracts-dispatch-smoke-weekly.yml (scheduled workflow-node-contracts-dispatch.yml contracts-only manual anchors);
#   .github/workflows/workflow-integrity-audit-dispatch.yml (integrity auditor + artifact).
#   .github/workflows/workflow-integrity-audit-dispatch-smoke-weekly.yml (scheduled workflow-integrity-audit-dispatch.yml auditor + artifact anchors);
# Pin policy (see --pin block): checkout v6.0.2, setup-node v6.3.0, upload-artifact v7.0.0,
#   download-artifact v8, cache v5.0.3, github-script v8.0.0, stale v10.2.0, labeler v6.0.1,
#   dependency-review-action v4, github/codeql-action v4.33.0 — one canonical full SHA each when used.
# Also always rejects pull_request_target (runs after selective flags too).
# Also rejects obvious GitHub PAT / fine-grained token strings in workflow YAML and Bearer + PAT patterns.
# Rejects ${{ secrets.GITHUB_TOKEN }} (use ${{ github.token }}).
# Rejects git merge conflict marker lines in workflow YAML.
# Verifies uses: ./relative paths point at existing files.
# Workflows that run commit-and-push-main.sh or push-main-with-retry.sh must mention github.token (checkout or env).
# Also rejects self-hosted runner labels (repo policy: GitHub-hosted only).
# Rejects hardcoded setup-node node-version: 20 / "20" (use node-version-file: .nvmrc).
# Requires cache-dependency-path when setup-node uses cache: npm (correct lockfile hash for cache key).
# Rejects bare `run: npm ci` / `- run: npm ci` and indented `npm ci` in multiline shell (same flags).
# Static runs-on: labels must be ubuntu-latest unless the value is a ${{ }} expression.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
WF=".github/workflows"
# All *.yml / *.yaml under workflows/ (recursive), matching parse-github-workflows-yaml.rb.
wf_files0() { find "$WF" -type f \( -name '*.yml' -o -name '*.yaml' \) -print0; }

RUN_PIN=0
RUN_PERM=0
RUN_PUSH=0
RUN_SETUP_NODE_POLICY_ONLY=0
RUN_NPM_CI_POLICY_ONLY=0
RUN_RUNS_ON_POLICY_ONLY=0
RUN_PUSH_TOKEN_ONLY=0

run_push_token_guards() {
  echo "== commit-and-push / push-main-with-retry invocations must reference github.token =="
  bad_token=()
  while IFS= read -r -d '' f; do
    uses_push_helper=0
    if grep -qE 'bash[[:space:]]+scripts/automation/commit-and-push-main\.sh' "$f" || grep -qE 'bash[[:space:]]+scripts/automation/push-main-with-retry\.sh' "$f"; then
      uses_push_helper=1
    fi
    if [[ "$uses_push_helper" -eq 1 ]] && ! grep -q 'github\.token' "$f"; then
      bad_token+=("$f")
    fi
  done < <(wf_files0)
  if [ ${#bad_token[@]} -gt 0 ]; then
    echo "::error::Workflows that run commit-and-push-main.sh or push-main-with-retry.sh must reference github.token (e.g. actions/checkout with: token, or env) so git push can authenticate."
    printf '%s\n' "${bad_token[@]}"
    exit 1
  fi
  echo "All push-helper workflows reference github.token."
}

run_setup_node_policy_guards() {
  echo "== Workflows that invoke node (scripts/automation) must use setup-node =="
  # Runners ship a Node, but .nvmrc must drive the version for reproducibility.
  bad_node_setup=()
  while IFS= read -r -d '' f; do
    if grep -qE 'node automation/|node scripts/|(^|[[:space:](])node -e[[:space:]]|node <<' "$f"; then
      if ! grep -q 'setup-node@' "$f"; then
        bad_node_setup+=("$f")
      fi
    fi
  done < <(wf_files0)
  if [ ${#bad_node_setup[@]} -gt 0 ]; then
    echo "::error::Workflows that run node against repo scripts must include actions/setup-node with node-version-file: .nvmrc (or equivalent)."
    printf '%s\n' "${bad_node_setup[@]}"
    exit 1
  fi
  echo "All node-based workflow jobs declare setup-node."

  echo "== setup-node must not hardcode Node 20 (use node-version-file: .nvmrc) =="
  if grep -RInE 'node-version:[[:space:]]+['"'"']20['"'"']|node-version:[[:space:]]+"20"' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Pin Node via node-version-file: '.nvmrc' instead of node-version: 20 (keeps CI aligned with local dev)."
    exit 1
  fi
  echo "No hardcoded Node 20 in setup-node steps."

  echo "== setup-node cache: npm requires cache-dependency-path =="
  bad_npm_cache=()
  while IFS= read -r -d '' f; do
    # Match cache: npm, cache: 'npm', cache: "npm" (quoted forms must not bypass this rule).
    if grep -qE 'cache:[[:space:]]+(npm|'\''npm'\''|"npm")' "$f" && ! grep -q 'cache-dependency-path:' "$f"; then
      bad_npm_cache+=("$f")
    fi
  done < <(wf_files0)
  if [ ${#bad_npm_cache[@]} -gt 0 ]; then
    echo "::error::When using setup-node with cache: npm, set cache-dependency-path (e.g. package-lock.json) so the cache key tracks lockfile changes."
    printf '%s\n' "${bad_npm_cache[@]}"
    exit 1
  fi
  echo "All npm-cached setup-node steps declare cache-dependency-path."
}

run_npm_ci_policy_guards() {
  echo "== npm ci must use --prefer-offline --no-audit --fund=false =="
  if grep -RInE '^[[:space:]]*(-[[:space:]]+)?run:[[:space:]]+npm ci[[:space:]]*(#.*)?$' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Use: npm ci --prefer-offline --no-audit --fund=false (consistent CI installs + less noise)."
    exit 1
  fi
  if grep -RInE '^[[:space:]]+npm ci[[:space:]]*(#.*)?$' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Multiline run: scripts must use npm ci --prefer-offline --no-audit --fund=false (not bare npm ci)."
    exit 1
  fi
  echo "No bare npm ci install lines."
}

run_runs_on_policy_guards() {
  echo "== runs-on must be ubuntu-latest or a GitHub Actions expression =="
  bad_runs_on="$(
    grep -RInE '^[[:space:]]*runs-on:[[:space:]]+' "$WF" --include='*.yml' --include='*.yaml' | grep -vE 'ubuntu-latest|(\$\{)' || true
  )"
  if [[ -n "$bad_runs_on" ]]; then
    echo "::error::Use runs-on: ubuntu-latest (repo policy). For dynamic runner labels use \${{ ... }} only."
    echo "$bad_runs_on"
    exit 1
  fi
  echo "All static runs-on labels match policy."
}

if [[ $# -eq 0 ]]; then
  RUN_PIN=1
  RUN_PERM=1
  RUN_PUSH=1
else
  for arg in "$@"; do
    case "$arg" in
      --pin) RUN_PIN=1 ;;
      --permissions) RUN_PERM=1 ;;
      --push) RUN_PUSH=1 ;;
      --setup-node-policy) RUN_SETUP_NODE_POLICY_ONLY=1 ;;
      --npm-ci-policy) RUN_NPM_CI_POLICY_ONLY=1 ;;
      --runs-on-policy) RUN_RUNS_ON_POLICY_ONLY=1 ;;
      --policy-fast)
        RUN_SETUP_NODE_POLICY_ONLY=1
        RUN_NPM_CI_POLICY_ONLY=1
        RUN_RUNS_ON_POLICY_ONLY=1
        ;;
      --push-token) RUN_PUSH_TOKEN_ONLY=1 ;;
      -h|--help)
        echo "Usage: $0 [--pin] [--permissions] [--push] [--setup-node-policy] [--npm-ci-policy] [--runs-on-policy] [--policy-fast] [--push-token]"
        echo "  Default (no args): pin + permissions + push + trust/local/push-helper checks + setup-node + npm ci + runs-on policy."
        echo "  Policy flags can be combined (e.g. --setup-node-policy --runs-on-policy)."
        echo "  --policy-fast: all three policy-only checks (setup-node + npm-ci + runs-on); skips pin/permissions/push/Ruby."
        echo "  --push-token: only push-helper workflows must reference github.token (fast; no Ruby)."
        echo "  --setup-node-policy: only Node/setup-node / .nvmrc / npm cache-dependency-path rules (fast; no Ruby)."
        echo "  --npm-ci-policy: only npm ci --prefer-offline --no-audit --fund=false enforcement (fast)."
        echo "  --runs-on-policy: only runs-on ubuntu-latest / expression check (fast)."
        exit 0
        ;;
      *)
        echo "Unknown option: $arg" >&2
        exit 2
        ;;
    esac
  done
fi

if [[ "$RUN_SETUP_NODE_POLICY_ONLY" -eq 1 || "$RUN_NPM_CI_POLICY_ONLY" -eq 1 || "$RUN_RUNS_ON_POLICY_ONLY" -eq 1 ]]; then
  RUN_PIN=0
  RUN_PERM=0
  RUN_PUSH=0
  [[ "$RUN_SETUP_NODE_POLICY_ONLY" -eq 1 ]] && run_setup_node_policy_guards
  [[ "$RUN_NPM_CI_POLICY_ONLY" -eq 1 ]] && run_npm_ci_policy_guards
  [[ "$RUN_RUNS_ON_POLICY_ONLY" -eq 1 ]] && run_runs_on_policy_guards
  echo "Workflow grep guard(s) passed."
  exit 0
fi

if [[ "$RUN_PUSH_TOKEN_ONLY" -eq 1 ]]; then
  run_push_token_guards
  echo "Workflow grep guard(s) passed."
  exit 0
fi

if [[ "$RUN_PIN" -eq 1 ]]; then
  echo "== Floating actions/*@v* =="
  if grep -RInE 'uses:[[:space:]]+actions/[^@[:space:]]+@v[0-9]' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Pin github.com/actions/* steps to full commit SHAs with a version comment (see pin-actions-weekly / ci-cd)."
    exit 1
  fi
  echo "No floating actions/* version tags in workflows."

  echo "== SHA-pinned actions/* without inline comment =="
  if grep -RInE 'uses:[[:space:]]+actions/[^#]+@[a-f0-9]{40}[[:space:]]*$' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Add an inline comment after each SHA-pinned actions/* ref (e.g. \"# v6.3.0\") so reviewers see the tag equivalent."
    exit 1
  fi
  echo "All SHA-pinned actions/* lines include a version comment."

  echo "== Floating org/action@v* on non-actions/* steps =="
  if grep -RInE 'uses:[[:space:]]+[^[:space:]]+/[^@[:space:]]+@v[0-9]' "$WF" --include='*.yml' --include='*.yaml' | grep -vE 'uses:[[:space:]]+actions/'; then
    echo "::error::Pin third-party actions (github/*, etc.) to full commit SHAs with a version comment — do not use floating @v tags."
    exit 1
  fi
  echo "No floating non-actions/* version tags."

  echo "== Docker actions must not use :latest =="
  if grep -RInE 'uses:[[:space:]]+docker://[^[:space:]]+:latest' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Pin docker:// actions to a digest or immutable tag (not :latest)."
    exit 1
  fi
  echo "No docker:// :latest references."

  echo "== Container/service images must not use :latest =="
  if grep -RInE '^[[:space:]]*container:[[:space:]]*[^#[:space:]]+:latest([[:space:]]|$)' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Pin container: image tags to digests or fixed tags (no :latest)."
    exit 1
  fi
  if grep -RInE '^[[:space:]]*image:[[:space:]]*[^#[:space:]]+:latest([[:space:]]|$)' "$WF" --include='*.yml' --include='*.yaml'; then
    echo "::error::Pin service image: tags to digests or fixed tags (no :latest)."
    exit 1
  fi
  echo "No container/image :latest references."

  echo "== actions/upload-artifact canonical pin (v7.0.0) =="
  if grep -RInE 'uses:[[:space:]]+actions/upload-artifact@' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'bbbca2ddaa5d8feaa63e36b76fdaad77386f024f'; then
    echo "::error::Pin actions/upload-artifact to the repo canonical SHA for v7.0.0 (bbbca2ddaa5d8feaa63e36b76fdaad77386f024f)."
    exit 1
  fi
  echo "All upload-artifact steps use the canonical v7.0.0 pin."

  echo "== actions/download-artifact canonical pin (v8) =="
  if grep -RInE 'uses:[[:space:]]+actions/download-artifact@' "$WF" --include='*.yml' --include='*.yaml' | grep -v '3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c'; then
    echo "::error::Pin actions/download-artifact to the repo canonical SHA for v8 (3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c)."
    exit 1
  fi
  echo "All download-artifact steps use the canonical v8 pin."

  echo "== actions/cache canonical pin (v5.0.3) =="
  if grep -RInE 'uses:[[:space:]]+actions/cache@' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'cdf6c1fa76f9f475f3d7449005a359c84ca0f306'; then
    echo "::error::Pin actions/cache to the repo canonical SHA for v5.0.3 (cdf6c1fa76f9f475f3d7449005a359c84ca0f306)."
    exit 1
  fi
  echo "All cache steps use the canonical v5.0.3 pin."

  echo "== actions/checkout canonical pin (v6.0.2) =="
  if grep -RInE 'uses:[[:space:]]+actions/checkout@' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'de0fac2e4500dabe0009e67214ff5f5447ce83dd'; then
    echo "::error::Pin actions/checkout to the repo canonical SHA for v6.0.2 (de0fac2e4500dabe0009e67214ff5f5447ce83dd)."
    exit 1
  fi
  echo "All checkout steps use the canonical v6.0.2 pin."

  echo "== actions/setup-node canonical pin (v6.3.0) =="
  if grep -RInE 'uses:[[:space:]]+actions/setup-node@' "$WF" --include='*.yml' --include='*.yaml' | grep -v '53b83947a5a98c8d113130e565377fae1a50d02f'; then
    echo "::error::Pin actions/setup-node to the repo canonical SHA for v6.3.0 (53b83947a5a98c8d113130e565377fae1a50d02f)."
    exit 1
  fi
  echo "All setup-node steps use the canonical v6.3.0 pin."

  echo "== actions/github-script canonical pin (v8.0.0) =="
  if grep -RInE 'uses:[[:space:]]+actions/github-script@' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'ed597411d8f924073f98dfc5c65a23a2325f34cd'; then
    echo "::error::Pin actions/github-script to the repo canonical SHA for v8.0.0 (ed597411d8f924073f98dfc5c65a23a2325f34cd)."
    exit 1
  fi
  echo "All github-script steps use the canonical v8.0.0 pin."

  echo "== actions/stale canonical pin (v10.2.0) =="
  if grep -RInE 'uses:[[:space:]]+actions/stale@' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'b5d41d4e1d5dceea10e7104786b73624c18a190f'; then
    echo "::error::Pin actions/stale to the repo canonical SHA for v10.2.0 (b5d41d4e1d5dceea10e7104786b73624c18a190f)."
    exit 1
  fi
  echo "All stale steps use the canonical v10.2.0 pin."

  echo "== actions/labeler canonical pin (v6.0.1) =="
  if grep -RInE 'uses:[[:space:]]+actions/labeler@' "$WF" --include='*.yml' --include='*.yaml' | grep -v '634933edcd8ababfe52f92936142cc22ac488b1b'; then
    echo "::error::Pin actions/labeler to the repo canonical SHA for v6.0.1 (634933edcd8ababfe52f92936142cc22ac488b1b)."
    exit 1
  fi
  echo "All labeler steps use the canonical v6.0.1 pin."

  echo "== actions/dependency-review-action canonical pin (v4) =="
  if grep -RInE 'uses:[[:space:]]+actions/dependency-review-action@' "$WF" --include='*.yml' --include='*.yaml' | grep -v '2031cfc080254a8a887f58cffee85186f0e49e48'; then
    echo "::error::Pin actions/dependency-review-action to the repo canonical SHA for v4 (2031cfc080254a8a887f58cffee85186f0e49e48)."
    exit 1
  fi
  echo "All dependency-review-action steps use the canonical v4 pin."

  echo "== github/codeql-action canonical pin (v4.33.0) =="
  if grep -RInE 'uses:[[:space:]]+github/codeql-action/' "$WF" --include='*.yml' --include='*.yaml' | grep -v 'b1bff81932f5cdfc8695c7752dcee935dcd061c8'; then
    echo "::error::Pin github/codeql-action/* steps to the repo canonical SHA for v4.33.0 (b1bff81932f5cdfc8695c7752dcee935dcd061c8)."
    exit 1
  fi
  echo "All codeql-action steps use the canonical v4.33.0 pin."
fi

if [[ "$RUN_PERM" -eq 1 ]]; then
  echo "== Top-level permissions block =="
  missing=()
  while IFS= read -r -d '' f; do
    if ! grep -q '^permissions:' "$f"; then
      missing+=("$f")
    fi
  done < <(wf_files0)
  if [ ${#missing[@]} -gt 0 ]; then
    echo "::error::Each workflow file must declare a top-level permissions: block (not only job-level)."
    printf '%s\n' "${missing[@]}"
    exit 1
  fi
  echo "All workflow files declare top-level permissions."

  echo "== Invalid projects: write permission =="
  if grep -RIn --include='*.yml' --include='*.yaml' --regexp='^[[:space:]]+projects:[[:space:]]+write' "$WF"; then
    echo "::error::Found invalid permission key 'projects'. Use 'repository-projects'."
    exit 1
  fi
  echo "Workflow permission keys look valid."
fi

if [[ "$RUN_PUSH" -eq 1 ]]; then
  echo "== No raw git push origin HEAD:main in workflow YAML =="
  raw=()
  while IFS= read -r rec; do
    [[ -z "$rec" ]] && continue
    line="${rec#*:*:}"
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    raw+=("$rec")
  done < <(grep -RIn --include='*.yml' --include='*.yaml' 'git push origin HEAD:main' "$WF" 2>/dev/null || true)
  if [[ ${#raw[@]} -gt 0 ]]; then
    echo "::error::Do not invoke raw git push to main from workflow YAML; use scripts/automation/commit-and-push-main.sh or scripts/automation/push-main-with-retry.sh."
    printf '%s\n' "${raw[@]}"
    exit 1
  fi
  echo "No raw git push to main in workflow YAML."

  pushes_in_file() {
    local f="$1"
    grep -qE 'bash[[:space:]]+scripts/automation/commit-and-push-main\.sh|bash[[:space:]]+scripts/automation/push-main-with-retry\.sh' "$f"
  }

  echo "== Concurrency for workflows that push to main =="
  missing=()
  while IFS= read -r -d '' f; do
    if pushes_in_file "$f" && ! grep -q '^concurrency:' "$f"; then
      missing+=("$f")
    fi
  done < <(wf_files0)
  if [ ${#missing[@]} -gt 0 ]; then
    echo "::error::Workflows that push to main must declare a top-level concurrency: block (use cancel-in-progress: false when serializing commits)."
    printf '%s\n' "${missing[@]}"
    exit 1
  fi
  echo "All push-to-main workflows declare concurrency."

  echo "== Push workflows must not use cancel-in-progress: true =="
  bad=()
  while IFS= read -r -d '' f; do
    if ! pushes_in_file "$f"; then
      continue
    fi
    if grep -qE '^[[:space:]]*cancel-in-progress:[[:space:]]*true[[:space:]]*$' "$f"; then
      bad+=("$f")
    fi
  done < <(wf_files0)
  if [ ${#bad[@]} -gt 0 ]; then
    echo "::error::Workflows that push to main must use cancel-in-progress: false (or omit); true can abort mid-commit."
    printf '%s\n' "${bad[@]}"
    exit 1
  fi
  echo "No push-to-main workflow uses cancel-in-progress: true."
fi

echo "== Forbidden pull_request_target trigger =="
if grep -RInE '^[[:space:]]*pull_request_target[[:space:]]*:' "$WF" --include='*.yml' --include='*.yaml'; then
  echo "::error::Do not use pull_request_target (elevated token on fork PRs). Use pull_request with least-privilege permissions instead."
  exit 1
fi
echo "No pull_request_target trigger in workflows."

echo "== No git merge conflict markers in workflows =="
if grep -RInE '^<<<<<<<|^>>>>>>>|^=======$' "$WF" --include='*.yml' --include='*.yaml'; then
  echo "::error::Resolve merge conflict markers in workflow YAML before merging."
  exit 1
fi
echo "No merge conflict markers in workflows."

echo "== No GitHub token strings in workflow YAML =="
if grep -RInE 'github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|ghu_[A-Za-z0-9]{20,}|ghs_[A-Za-z0-9]{20,}|ghr_[A-Za-z0-9]{20,}' "$WF" --include='*.yml' --include='*.yaml'; then
  echo "::error::Do not embed GitHub tokens in workflows. Use secrets.* or github.token; revoke any leaked PAT."
  exit 1
fi
echo "No obvious PAT material in workflows."

echo "== No hardcoded Authorization: Bearer PATs =="
if grep -RInE 'Bearer[[:space:]]+(github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|ghu_[A-Za-z0-9]{20,}|ghs_[A-Za-z0-9]{20,}|ghr_[A-Za-z0-9]{20,})' "$WF" --include='*.yml' --include='*.yaml'; then
  echo "::error::Do not hardcode Bearer tokens in workflows; pass secrets via env (secrets.*) or github.token."
  exit 1
fi
echo "No hardcoded Bearer PAT patterns."

echo "== Prefer github.token over secrets.GITHUB_TOKEN =="
if grep -RInF '${{ secrets.GITHUB_TOKEN }}' "$WF" --include='*.yml' --include='*.yaml'; then
  echo "::error::Use github.token instead of secrets.GITHUB_TOKEN (same default token; clearer and avoids duplicate secret name)."
  exit 1
fi
echo "No legacy secrets.GITHUB_TOKEN references."

echo "== No self-hosted runners (use GitHub-hosted ubuntu-latest) =="
if grep -RIn --include='*.yml' --include='*.yaml' 'self-hosted' "$WF"; then
  echo "::error::Self-hosted runners are not allowed in this repo policy (supply-chain). Use runs-on: ubuntu-latest (or windows/macos if justified and reviewed)."
  exit 1
fi
echo "No self-hosted runner labels in workflows."

echo "== Local uses: ./ paths must exist =="
missing_local=()
while IFS= read -r -d '' f; do
  while IFS= read -r line; do
    [[ "$line" == *'${{'* ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    if [[ "$line" =~ uses:[[:space:]]+(\./[^[:space:]#]+) ]]; then
      rel="${BASH_REMATCH[1]#./}"
      if [[ ! -f "$ROOT/$rel" ]]; then
        missing_local+=("$f: missing file $rel")
      fi
    fi
  done < <(grep -E 'uses:[[:space:]]+\./' "$f" 2>/dev/null || true)
done < <(wf_files0)
if [ ${#missing_local[@]} -gt 0 ]; then
  echo "::error::A workflow references uses: ./... but the file is not present at repo root:"
  printf '%s\n' "${missing_local[@]}"
  exit 1
fi
echo "All local uses: ./ references resolve to files."

echo "== Push helper shell scripts exist and are executable =="
for rel in scripts/automation/commit-and-push-main.sh scripts/automation/push-main-with-retry.sh; do
  if [[ ! -f "$ROOT/$rel" ]]; then
    echo "::error::Missing required push helper: $rel"
    exit 1
  fi
  if [[ ! -x "$ROOT/$rel" ]]; then
    echo "::error::Push helper must be executable in git: $rel (e.g. git update-index --chmod=+x $rel)"
    exit 1
  fi
done
echo "Push helper scripts are present and executable."

run_push_token_guards

run_setup_node_policy_guards

run_npm_ci_policy_guards

run_runs_on_policy_guards

echo "Workflow grep guard(s) passed."
