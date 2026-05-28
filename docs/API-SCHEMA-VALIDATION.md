# Autonomous Schema Validation & API Contract Guard

> Ensures every API route declares a Zod-based request/response schema and stays in contract.

**Status:** ✅ Guardrail #39 — Implemented & Deployed

---

## Purpose

API endpoints without typed validation are a reliability and security risk. This guardrail enforces that every route under `app/api/` exports explicit Zod schemas for requests (and optionally responses). It runs on every PR and on `main` to prevent contract drift.

## What It Does

- **Scans** all `app/api/**/route.ts` (or `.js/.tsx`) files
- **Detects** exported Zod objects (`schema`, `requestSchema`, `responseSchema`, `outputSchema`)
- **Fails** CI if a route lacks required schemas
- **Posts** a helpful PR comment listing violations
- **Alerts** via Telegram on failure
- **Logs** 90-day history to `.hermes/memory/api-schema/`

## Configuration

| Env Var | Default | Meaning |
|---|---|---|
| `API_SCHEMA_API_DIR` | `app/api` | Directory to scan for route files |
| `API_SCHEMA_OPENAPI_DIR` | `openapi` | Optional OpenAPI spec directory for future conformance |
| `API_SCHEMA_REQUIRE_REQUEST` | `true` | Require request validation schema |
| `API_SCHEMA_REQUIRE_RESPONSE` | `true` | Require response validation schema |
| `API_SCHEMA_CHECK_OPENAPI` | `false` | Validate against OpenAPI spec if present |

## Files

- **Script:** `automation/api-schema-validator.cjs`
- **Workflow:** `.github/workflows/api-schema-validation.yml`
- **Docs:** `docs/API-SCHEMA-VALIDATION.md` (this file)
- **State:** `.hermes/memory/api-schema/history.json`

## Schema Pattern

Every API route should look like:

```ts
import { z } from 'zod';

// Request validation
export const schema = z.object({
  message: z.string(),
  userId: z.string().uuid(),
});

// Optional: response validation
export const responseSchema = z.object({
  success: z.boolean(),
  result: z.string(),
});

export async function POST(req: Request) {
  // validated via `schema` automatically if using helper
  const body = await req.json();
  // ...handle
}
```

The validator searches for:

- `export const schema = z.object(...)`  (covers request)
- `export const requestSchema = z.object(...)`
- `export const responseSchema = z.object(...)`
- `export const outputSchema = z.object(...)`

## CI Integration

- **On PR** to `main`: runs automatically; fails if any route missing a schema
- **On push** to `main`: runs daily; detects drift introduced without PR (admin pushes)
- **Manual dispatch** available

When a violation is found:

1. CI step exits non-zero → PR cannot merge until fixed
2. A comment is posted on the PR listing affected routes
3. Telegram alert is sent to the channel

## Best Practices

- Use Zod for all input validation; reuse schemas across client/server
- Keep responseSchema lightweight; focus on shape, not exhaustive field checks
- For file-based routes (`route.ts`), place schemas at top-level exports
- For catch-all routes, still export a placeholder schema (even if `z.any()` is discouraged)

## Future Enhancements

- Cross-check request/response shapes against OpenAPI spec files in `openapi/`
- Detect schema duplication and suggest shared schema extraction
- Enforce consistent naming (`schema` vs `requestSchema`)
- Auto-fix scaffolding for new routes (template)

## Related Guardrails

- **#27 Accessibility** — also validates DOM/component contracts
- **#31 Security Headers** — relies on stable endpoint responses
- **#26 API Health** — runtime verification complements static contracts

---

Maintained by KiloClaw • Autonomous improvement cycle
