# Deployment – ziontechgroup.com

This project is deployed to production as a static-exported Next.js 16 site on **Netlify**, with GitHub Actions driving CI/CD.

## Branches and source of truth

- **Main branch**: `main` in this repository is the source of truth for `https://ziontechgroup.com`.
- Feature work should land via PRs into `main`. CI must be green before deploy workflows run.

## CI/CD pipeline

### 1. CI checks (CI/CD Pipeline)

The primary CI workflow (`.github/workflows/ci-cd.yml`) is responsible for:

- Installing dependencies with the Node version from `.nvmrc`.
- Running `npm run lint:check`.
- Running `npm run type-check`.
- Running `npm run test:ci`.
- Building the app with `npm run build` (static export).

Only after this workflow completes successfully on `main` does the deploy workflow run.

### 2. Deploy on push (Netlify)

The **Deploy on Push** workflow (`.github/workflows/deploy-on-push.yml`) is triggered when:

- The **CI/CD Pipeline** workflow completes successfully on `main`, or
- It is invoked manually via `workflow_dispatch`.

What it does:

1. Checks out the same commit that passed CI.
2. Sets up Node using `.nvmrc`.
3. Triggers a Netlify build by POSTing to `NETLIFY_BUILD_HOOK` (stored as a GitHub secret).
4. Waits briefly, then runs a small smoke test against key routes on `https://ziontechgroup.com`.
5. Optionally runs a lightweight UX audit using `automation/ai-live-site-ux-audit-agent.cjs`.

Netlify independently builds the site from this repository on the commit that triggered the hook.

### 3. Deploy preflight (manual, guarded)

The **Deploy Preflight** workflow (`.github/workflows/deploy-preflight.yml`) is a manually triggered, guarded path:

- Validates the codebase with:
  - `npm run lint:check`
  - `npm run type-check`
  - `npm run build`
  - `npm run nav:audit-scan`
  - Optional site link audit and deployment readiness checks
- Optionally triggers the same `NETLIFY_BUILD_HOOK` used in the deploy-on-push workflow.

Use this when you want an explicit “pre-deploy checklist” run from CI.

## Local deployment helper

For local usage that mirrors CI as closely as possible, you can run:

```bash
npm run deploy:local
```

This script (`commands/deploy.cjs`) will:

1. Run `npm run lint:check`.
2. Run `npm run type-check`.
3. Run `npm run test:ci`.
4. Run `npm run build`.
5. If all steps succeed and `NETLIFY_BUILD_HOOK` is set in the local environment, POST to the same Netlify build hook used in CI.

You can skip the remote deploy and only run the checks by setting:

```bash
SKIP_REMOTE_DEPLOY=1 npm run deploy:local
```

## Autonomous improvement & deploy loops

Multiple automation agents and GitHub Actions workflows continuously improve the app and its workflows. Examples:

- **AI Continuous Improvement Agent (ACIA)** – fixes lint, type, and security issues and auto-commits.
- **AI App Audit & Implementation** – runs `npm run app:audit` and `npm run app:audit-apply` to propose and apply safe app improvements.
- **AI Layout Design & UX agents** – keep layouts, navigation, and UX consistent with best practices.

These agents typically:

1. Analyze the live site (`https://ziontechgroup.com`) and the repo.
2. Propose or apply safe changes.
3. Commit and push to `main`.
4. Let the CI/CD + Netlify pipeline handle deployment.

When making manual changes, keep `main` green and compatible with these autonomous workflows by:

- Ensuring `npm run lint:check`, `npm run type-check`, and `npm run test:ci` pass locally.
- Using `npm run deploy:local` when you want a local preflight that mirrors CI + deploy behavior.

