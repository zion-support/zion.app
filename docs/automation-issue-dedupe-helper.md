# GitHub issue dedupe helper (autonomous workflows)

Use `scripts/automation/gh-issue-dedupe-or-create.cjs` to avoid opening duplicate incident issues when the same guard fires on a schedule.

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `ISSUE_TITLE` | yes | **Stable** title used for exact match against open issues |
| `ISSUE_BODY_FILE` | yes | Path to markdown body (created in a prior `run:` step) |
| `ISSUE_LABEL` | no | Single label (default: `bug`); prefer `ISSUE_LABELS` |
| `ISSUE_LABELS` | no | Comma-separated labels (e.g. `bug,automation`) |
| `ISSUE_FINGERPRINT` | no | Stable string; adds label `automation-fp-<sha12>` and matches any open issue with that label (even if title differs) |
| `COOLDOWN_HOURS` | no | If a matching issue was updated within N hours, skip comment/create |
| `SKIP_IF_OPEN` | no | If `1`/`true`, skip when any open issue matches title |
| `ISSUE_LIST_LIMIT` | no | Max open issues to scan for title match (default `200`) |

Requires `gh` CLI and `GITHUB_TOKEN` / `GH_TOKEN` (GitHub Actions provides `github.token`).

## Behavior

1. If `ISSUE_FINGERPRINT` is set, ensures the fingerprint label exists and looks for open issues with that label first (same thread for recurring alerts).
2. Otherwise lists open issues (up to `ISSUE_LIST_LIMIT`) and matches **exact** `ISSUE_TITLE`.
3. On match: either comments with the body file or respects cooldown / `SKIP_IF_OPEN`. After a successful comment, the script runs `gh issue edit --add-label` so **`ISSUE_LABELS`**, **`automation-fp-*`**, and **`automation-incident`** (when fingerprinting) are present even if the issue predates those labels.
4. On no match: creates a new issue with all labels (`ISSUE_LABELS` + fingerprint label + `automation-incident` when set).

## Example (workflow step)

```yaml
- name: Escalate (deduped)
  env:
    GH_TOKEN: ${{ github.token }}
    ISSUE_TITLE: My stable alert title
    ISSUE_BODY_FILE: incident-body.md
    COOLDOWN_HOURS: '12'
  run: node scripts/automation/gh-issue-dedupe-or-create.cjs || true
```

Reference implementation: `.github/workflows/ai-report-size-budget-guard.yml`.

## Close on recovery

When a guard returns healthy, close the matching fingerprint thread with `scripts/automation/gh-issue-close-on-recovery.cjs` (same `ISSUE_FINGERPRINT` string as escalation). Prefer YAML `env:` for `ISSUE_FINGERPRINT` on close-only steps so it is not confused with escalation exports in contract validation.

```bash
npm run issues:close-on-recovery
```

## Contract validation (preflight)

`npm run automation:preflight` runs `scripts/automation/validate-workflow-issue-dedupe-contract.cjs`:

- Every step that invokes `gh-issue-dedupe-or-create.cjs` must define `ISSUE_TITLE` and `ISSUE_FINGERPRINT` in that step.
- Each `export ISSUE_FINGERPRINT="..."` in an escalation step must be globally unique (except multiple distinct fingerprints in one step, e.g. PM2 critical vs warning).

## Incident digest & search keys

- Weekly digest: `docs/automation-fingerprint-incident-digest.md` / `npm run automation:fingerprint-digest`.
- Put a **Dedupe key** line in issue bodies (stable string matching `ISSUE_FINGERPRINT`) so logs and issues are grep-friendly.
