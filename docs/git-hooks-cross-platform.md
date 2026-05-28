# Git hooks: cross-platform options

## Default (macOS / Linux / Git Bash)

```bash
npm run git:hooks:install
```

Hooks live in `scripts/git-hooks/` and call Node (`openclaw-pre-commit-hooks.cjs`).

## Lefthook (optional)

For environments where `core.hooksPath` shell hooks are awkward:

```bash
npm run openclaw:lefthook:install
```

Uses `lefthook.yml` at the repo root. **Uninstall** `core.hooksPath` first (`npm run git:hooks:uninstall`) so pre-commit does not run twice.

## Manual (any OS)

```bash
node automation/openclaw-pre-commit-hooks.cjs
node automation/openclaw-report-commit-budget.cjs
```
