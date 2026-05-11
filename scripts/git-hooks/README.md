# Git hooks (OpenClaw)

This repo can use **hooksPath** so hooks live in version control.

## Install

From the repository root:

```bash
npm run git:hooks:install
```

This runs `git config core.hooksPath scripts/git-hooks` (repo-local).

## Uninstall

```bash
npm run git:hooks:uninstall
```

## Behavior

| Hook        | What it does |
|-------------|----------------|
| `pre-commit` | Runs `node automation/openclaw-pre-commit-hooks.cjs` (report budget + optional router refresh). |
| `pre-push`   | No-op unless `OPENCLAW_STABILITY_ON_PUSH=1`, then runs `npm run openclaw:autonomy:stability`. |

### Patch router auto-refresh

```bash
PATCH_ROUTER_AUTO_REFRESH=1 git commit ...
```

When the conflict-predictor snapshot is older than the merge-ledger `generatedAt`, regenerates predictor + hot-file patch router before the commit finishes.

### Lefthook (Windows-friendly alternative)

Do **not** use both `core.hooksPath` and Lefthook for the same hook (double runs). Either:

- `npm run git:hooks:install`, or  
- `npm run openclaw:lefthook:install` (uses root `lefthook.yml`).

## Skip hooks (emergency / automation)

```bash
SKIP_OPENCLAW_GIT_HOOKS=1 git commit ...
SKIP_OPENCLAW_GIT_HOOKS=1 git push ...
```

## Executable bit

If hooks do not run, ensure they are executable:

```bash
chmod +x scripts/git-hooks/pre-commit scripts/git-hooks/pre-push
```
