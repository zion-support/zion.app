# Autonomous Structured Data (Schema.org) Validator

**Status:** ✅ Active  
**Triggers:** Weekly Monday 09:00 UTC (scheduled), manual dispatch  
**Input:** Crawls `http://localhost:3000` (or live site) sitemap; fetches all pages  
**Output:** Validates JSON-LD and Microdata; opens GitHub issues on failures; Telegram summary

---

## Problem

Search engines rely on structured data (schema.org markup) to generate rich snippets (articles, products, FAQs, breadcrumbs). Missing or malformed schema:
- Reduces SEO visibility and rich result eligibility
- Triggers warnings in Google Search Console
- Leads to inconsistent indexing

Manual checks don't scale across dozens of pages.

## Solution

Weekly automated crawl + validation:
- Fetches sitemap.xml for all page URLs
- Extracts `<script type="application/ld+json">` blocks
- Validates required fields per schema type (Article, Product, Service, FAQPage, BreadcrumbList, WebSite)
- Detects missing required properties, wrong types, invalid formats
- Opens GitHub issues on regressions with fix guidance
- Sends Telegram digest with health score and new problems

---

## How It Works

1. **Sitemap discovery** — GET `/sitemap.xml`, parse `<loc>` URLs
2. **Page fetch** — GET each page (User-Agent: SchemaValidator/1.0)
3. **Extraction** — Regex extraction of JSON-LD script blocks; basic Microdata detection
4. **Validation** — AJV JSON Schema validator against per-type required-field rules
5. **Issue tracking** — Deduplicates identical failures across runs; opens new GitHub issues
6. **History** — Saves run state to `.hermes/memory/schema-validator/` (history.json, issues.json)
7. **Notification** — Telegram summary with health percentage and invalid count

---

## Supported Schema Types & Required Fields

| Type | Required Fields |
|------|----------------|
| `Article` | `@type`, `headline`, `image`, `author`, `datePublished`, `publisher` |
| `Product` | `@type`, `name`, `image`, `description`, `offers` (with `@type=Offer`, `price`, `priceCurrency`) |
| `Service` | `@type`, `name`, `description`, `provider`, `serviceType` |
| `FAQPage` | `@type`, `mainEntity[]` with `@type=Question`, `name`, `acceptedAnswer` (`@type=Answer`, `text`) |
| `BreadcrumbList` | `@type`, `itemListElement[]` with `@type=ListItem`, `position`, `name`, `item` (URL) |
| `WebSite` | `@type`, `name`, `url` |

Additional optional fields (description, image, etc.) are allowed but not required.

---

## Configuration

No configuration needed by default. Optional environment variables:

```bash
SCHEMA_VALIDATOR_TYPES=Article,Product,Service,FAQPage,WebSite,BreadcrumbList  # types to validate
SCHEMA_MIN_REQUIRED_PCT=80          # minimum % of pages with any schema (warning only)
SCHEMA_CRITICAL_TYPES=Article,Product  # require schema on every page of these content types
SCHEMA_OPEN_ISSUES=true             # auto-open GitHub issues on failures
GITHUB_TOKEN=ghp_...                # required to open issues
GITHUB_REPOSITORY=Zion-support/zion.app
```

---

## Output & State

**Artifacts:**
- `.hermes/memory/schema-validator/history.json` — per-page last-check, totals, health score
- `.hermes/memory/schema-validator/issues.json` — open/closed issue tracking (deduplication keys)

**GitHub Issues:**
- Auto-opened when new schema violations detected
- Labels: `automation`, `schema`, `seo`
- Title: `[Schema] Invalid structured data on /path`
- Body includes page URL, schema type, and specific field errors

**Telegram:**
- Single summary message after each run: health %, total/invalid counts
- Errors during fetch/parse also notified

---

## Safety & Behavior

- **Read-only HTTP fetch**: No code modifications; only reads pages
- **Non-blocking**: CI job does not fail the workflow on schema errors (alerts only); can be made required if needed
- **Deduplication**: Same error on same page won't re-open issues
- **Local-first**: Tries `http://localhost:3000` first (dev/local); falls back gracefully if site down
- **No external API cost**: Self-hosted AJV validation; no paid SEO tools

---

## Dependencies

- `ajv` — JSON Schema validator (add to devDependencies if missing)
- Standard Node.js built-ins: `https`, `http`, `zlib`, `fs`, `path`

Add to `package.json`:
```bash
npm install -D ajv
```

---

## Manual Trigger

```bash
gh workflow run schema-validator.yml
```

---

## Future Enhancements

- **Microdata deep validation** — full attribute checking for itemscope/itemtype
- **Rich result eligibility scoring** — Google's Search Gallery rules checker
- **Auto-fix suggestions** — generate corrected JSON-LD snippets in PR comments
- **Coverage % enforcement** — fail CI if too many pages lack any schema
- **Sitemap priority/ changefreq alignment** — cross-check with sitemap optimizer
- **Schema version tracking** — detect migration from JSON-LD to Microdata or vice versa

---

## Related Guardrails

- **#53 Open Graph Image Generator** — complementary social/SEO metadata
- **#49 Dynamic Sitemap & Route Priority Optimizer** — provides the sitemap this validator consumes
- **#4 Lighthouse** — OG/schema presence impacts SEO score
- **#52 Accessibility Scorecard** — both improve search result appearances

---

## Why Weekly?

Structured data changes infrequently (mostly on content publish). Weekly cadence catches:
- New pages missing required schema
- Template regressions that drop fields
- Typos in JSON-LD structure

Daily is overkill; weekly Monday 09:00 UTC gives weekend content a day to settle.
