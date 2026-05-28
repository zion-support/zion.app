# CTO operating philosophy (Zion Tech Group)

This document translates the **continuous improvement** mandate into **actionable, in-repo** behavior. It complements `AGENTS.md`, `README.md`, and `.cursor/rules/autonomy-and-continuous-improvement.mdc`.

## Repositories

| Remote | Typical use |
|--------|-------------|
| `origin` | Primary clone URL used in this workspace (e.g. `Zion-support/zion.app`). |
| `holdings` | Optional second remote for `Zion-Holdings/zion.app` when org policy requires pushing there—use `git push holdings main` after `git fetch` / merge alignment. |

**Note:** Deploying [ziontechgroup.com](https://ziontechgroup.com) depends on hosting CI/CD and secrets configured on GitHub and the host. Agents in this repo can prepare changes and workflows; they cannot substitute for platform credentials.

## Foundation (stability)

- **GitHub Actions:** Prefer **incremental** workflow reviews (naming, `on:` triggers, permissions, artifact retention). Avoid mass deletions; fix or consolidate duplicates with a short note in `automation/` or `ci-cd-reports/`.
- **Branch policy:** Keep **`main` as the single integration branch** for this project. Resolve conflicts locally before push; never force-push shared history without an explicit, documented reason.
- **PM2 / Husky / Lefthook:** Treat documented scripts (`package.json`, `ecosystem.config.cjs`, `scripts/git-hooks/`) as source of truth. When something fails, **fix the root cause** and add a guard or health check rather than spawning redundant watchdog layers unless the repo already patterns that way.

## Autonomous automation (additive)

- **Do not rip out** existing agent factories or core automation entrypoints. Add **new** scripts under `automation/`, `commands/`, or `.github/workflows/` when behavior expands.
- **Cloud-first:** Prefer GitHub Actions and scheduled jobs with clear inputs/outputs and reports under `automation/reports/` so runs need no local machine.
- **Self-healing:** Encode recovery as **idempotent scripts + CI checks** (e.g. regenerate reports, open issues with logs) rather than informal “spawn another agent” loops that are hard to audit.

## Growth, services, content

- **SaaS and pricing:** New offers belong in **content**, **services data**, and **legal/accurate** copy; avoid inventing binding prices without product approval—use patterns already in `app/data/` and marketing pages.
- **Content:** Favor structured, reusable data and components; align with SEO helpers in `app/utils/seoConstants.ts`.
- **Contact & leads:** Commercial email is centralized in **`CONTACT_INFO.email`** in `app/utils/seoConstants.ts` (`commercial@ziontechgroup.com`). Privacy/legal addresses stay on their dedicated pages. Re-audit when adding forms (`CONTACT-FORMS-AUDIT.md`).

## Frontend & UX

- **Link and navigation health:** Use existing audit/site-improve scripts in `package.json` where possible; fix broken routes and missing pages in small, testable PR-sized commits.
- **Responsive behavior:** Prefer shared layout/components and automated checks (lint, tests, Storybook where applicable) over one-off page hacks.
- **Homepage promos:** Surface real shipped features; avoid stale banners—tie announcements to actual routes or changelog entries.

## Meta (tools & research)

- **Cursor:** Prefer `.cursor/rules/` and short, **alwaysApply** rules that point to files like this one instead of duplicating long policy in every session.
- **Research:** Integrate new external tools only after checking license, cost, and secret handling; document in `docs/` or `TOOLS.md` when adoption is real.

## Success criteria (practical)

Each iteration should leave the repo **more tested, documented, and deployable** than before—without new secrets in git and without deleting user data or production-critical paths without cause.

## Idea backlog

See **`docs/NEXT-AUTONOMOUS-IDEAS.md`** for the next waves of intelligence, reliability, and UX improvements.
