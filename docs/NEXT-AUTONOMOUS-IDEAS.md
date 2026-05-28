# Next autonomous improvement ideas (backlog)

Prioritized, **additive** directions aligned with `docs/CTO-OPERATING-PHILOSOPHY.md`. Pick one wave at a time; each should end with passing `lint:check`, `type-check`, and `test:ci` where applicable.

## Intelligence & autonomy

1. **RAG-style site context for AI Chat** — Optional: ingest trimmed `app/` + `content/` summaries into a small JSON or embedding index (local/Ollama/Gemini per `README.md` chain) so the widget answers from *this* repo’s facts, not generic fluff.
2. **Structured “what shipped” feed** — Generate or maintain `content/` or a JSON feed from recent `CHANGELOG.md` / git tags for the homepage “latest” strip so promos stay truthful.
3. **Smarter link crawler artifact** — Extend existing audit scripts to output a single `automation/reports/broken-links-latest.json` consumed by CI with a **non-zero exit** only above a severity threshold (avoid flaky gates).

## Reliability & observability

4. **Smoke test matrix doc** — One-page `docs/SMOKE-MATRIX.md`: which routes are covered by production smoke, Netlify preview smoke, and manual checks; link from `README.md`.
5. **Dependency train visibility** — Surface `depcheck` / `npm outdated` snapshots in `automation/reports/` on a schedule (workflow already partially exists) with **trend JSON** for the deploy-drift dashboard.

## Product & UX

6. **Contact funnel analytics (privacy-preserving)** — If using an analytics provider, document events for “mailto opened” / form submit attempts without PII; otherwise document why mailto-only is intentional.
7. **AI Lab discovery** — Ensure every promoted AI Lab route appears in sitemap + one hub page section with stable anchors for smoke tests.

## Meta (Cursor / agents)

8. **Rule consolidation pass** — Merge overlapping `.cursor/rules/*.mdc` *descriptions* into pointers (not duplicate policy walls); keep `alwaysApply` rules under ~40 lines each.
9. **Onboarding snippet** — Done: `docs/AGENT-QUICKSTART.md` (expand with troubleshooting if needed).

## Next wave (new — 2026-03-21)

10. **Conflict markers guard (tracked files)** — **Shipped:** `scripts/automation/check-merge-conflict-markers.cjs`, `npm run check:merge-conflicts`, and first step in `automation/openclaw-pre-commit-hooks.cjs` (Lefthook pre-commit).
11. **Homepage “what shipped” stub** — Wire one JSON or MD fragment (from `CHANGELOG.md` or last N commits on CI) into the main hero or automation strip so promos stay verifiable.
12. **Client-side chat context bundle** — Ship a static `public/ai-context.json` (generated in CI from safe, non-secret facts: services list, contact, key URLs) for the widget to load before LLM calls—step toward RAG without new backends.

---

*Last updated: 2026-03-21 — owner mandate persisted in USER/SOUL/HEARTBEAT/MEMORY/AGENTS/Cursor rules; see items 10–12 for the next implementation wave.*
