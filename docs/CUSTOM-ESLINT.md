# Autonomous ESLint Rule Extension & Custom Linter

**Status:** ✅ Active  
**Triggers:** PR to `main`, push to `main`, weekly Tuesday 16:00 UTC  
**Fail condition:** Any `error`-severity ESLint violation under autonomous rules  
**Telegram alerts:** On failures and weekly digest

---

## Problem

The default ESLint config doesn't enforce project-specific patterns that matter for long-term health:
- **Forbidden APIs**: `eval`, `Function`, unsafe `innerHTML`
- **Missing error handling**: async functions without `try/catch` or `.catch()`
- **Debug leftovers**: `console.log` in production
- **Strict typing**: `any` leakage
- **Unused code**: dead exports/variables
- **Naming inconsistencies**

This guardrail runs a dedicated ESLint config (`.eslintrc-autonomous.cjs`) that adds stricter, opinionated rules on top of the base config. It fails CI on violations and surfaces actionable PR comments.

---

## How It Works

1. Collect all source files (`**/*.{ts,tsx,js,jsx}`), respecting `.eslintignore` patterns and excluding generated/automation code
2. Run `eslint -c .eslintrc-autonomous.cjs` with `--max-warnings 0` so warnings also fail
3. Parse JSON report
4. On **PR failure**: post PR comment listing top 20–25 errors with file/line/rule
5. On **main push failure**: open GitHub issue labeled `eslint-autonomous`, `code-quality`, `blocker`
6. Telegram notification on failure
7. Weekly digest (Tuesday 16:00 UTC) sends success summary

---

## Rules Enforced

| Rule ID | Severity | Description |
|---------|----------|-------------|
| `no-eval` | error | No `eval()` usage |
| `no-new-func` | error | No `new Function()` |
| `no-inner-html` | error | Assignment to `innerHTML` flagged (XSS risk) |
| `require-async-try-catch` | error | Async functions must have `try/catch` or return with `.catch()` |
| `no-console` | warn | `console.log` forbidden; `console.warn`/`error` allowed |
| `@typescript-eslint/no-explicit-any` | error | No implicit or explicit `any` |
| `require-await` | warn | Async functions should contain `await` (ensures intent) |
| `@typescript-eslint/no-unused-vars` | warn | Unused variables/functions |
| `unused-imports/no-unused-imports` | warn | Unused imports |
| `camelcase` | error | Variables/functions in camelCase |
| `@typescript-eslint/naming-convention` | error | Consistent naming by symbol type |
| `complexity` | warn | Cyclomatic complexity ≤ 20 |
| `curly` | error | Always use braces in conditionals/loops |
| `no-magic-numbers` | warn | Warn on unexplained numeric literals (with common allowlist) |

---

## Configuration

The rules live in `.eslintrc-autonomous.cjs`, extend the base Next.js + TypeScript config, and override severity levels as needed. You can tune thresholds there.

Environment variables (workflow):

| Variable | Default | Purpose |
|----------|---------|---------|
| `TELEGRAM_BOT_TOKEN` | — | Telegram alerts |
| `TELEGRAM_CHAT_ID` | — | Telegram chat ID |

---

## Reports

- **Artifact**: `eslint-autonomous-report.json` (uploaded to workflow, 7d retention)
- **Daily output**: PR comments and GitHub issues contain summary excerpts

---

## Adjusting Rules

Edit `.eslintrc-autonomous.cjs` directly. Common adjustments:
- Raise complexity limit
- Add allowed `any` cases (not recommended; prefer explicit types)
- Extend naming conventions for project-specific patterns
- Suppress specific rule in a file via `/* eslint-disable rule-name */`

---

## Performance

Runs in ~5–10 seconds on typical codebase. Uses `actions/setup-node` caching; no extra dependencies beyond existing `eslint` and plugins.

---

## Related Guardrails

- **#30 Code Quality Analytics** — broader complexity and duplication trends
- **#41 Type Coverage Enforcer** — focuses on type strictness; complements this rule set with deeper type analysis
- **#36 Performance Budget** — ensures shipping size stays within budget

Together they maintain high code hygiene and prevent regressions.
