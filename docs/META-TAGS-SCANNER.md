# Autonomous Meta Tags Quality Scanner

**Status:** ✅ Active  
**Triggers:** Weekly Wednesday 11:00 UTC (scheduled), manual dispatch  
**Input:** Crawls sitemap; fetches all pages; extracts meta tags  
**Output:** GitHub issues on violations; Telegram quality digest; baseline tracking

---

## Problem

SEO relies on well-crafted meta tags. Common issues go unnoticed:
- Titles too short (<50 chars) or too long (>60–80 chars)
- Duplicate meta descriptions across pages
- Missing canonical URLs
- Overly broad `noindex` on key pages (home, services, blog)
- Missing Open Graph tags (`og:title`, `og:description`, `og:image`) — affects social sharing (#53)

No automated quality gate exists to catch these problems before search engines penalize the site.

## Solution

Weekly automated meta tags scanner:
- Fetches sitemap.xml → all page URLs
- Extracts `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">`, and Open Graph tags
- Validates against configurable thresholds
- Opens GitHub issues on errors/warnings with fix guidance
- Sends Telegram summary: quality score %, issue breakdown, top problems
- Tracks baseline for trend monitoring

---

## Validation Rules

| Tag | Check | Threshold |
|-----|-------|-----------|
| `<title>` | Length | 50–60 chars ideal; error >80; warn >70 or <50 |
| `<meta name="description">` | Length | 120–160 chars; warn <120 or >160 |
| | Uniqueness | Warn if duplicate description found across pages |
| `<link rel="canonical">` | Presence | Error if missing on any page |
| `<meta name="robots">` | `noindex` on key pages | Warn if `noindex` on `/`, `/blog`, `/services`, `/ai-lab` |
| Open Graph `og:title` | Presence | Info-level if missing (ties to #53 OG images) |
| `og:description` | Presence | Info-level if missing |
| `og:image` | Presence | Info-level if missing |

**Severity levels:**
- `error` — should fix promptly (SEO impact)
- `warn` — recommended improvement
- `info` — nice-to-have (OG tags for social sharing)

---

## Configuration

Environment variables:

```bash
# Title length bounds
META_TITLE_MIN=50
META_TITLE_MAX=60
# Warn if title >70 (implicit)

# Description length bounds
META_DESC_MIN=120
META_DESC_MAX=160

# Feature toggles
META_CHECK_CANONICAL=true
META_CHECK_ROBOTS=true
META_OPEN_ISSUES=true

# GitHub (for issue creation)
GITHUB_TOKEN=ghp_...
GITHUB_REPOSITORY=Zion-support/zion.app
```

---

## Output

**GitHub Issues:**
- Title: `[Meta Tags] Quality issue on /path`
- Body includes: URL, field, message, severity, link to file
- Labels: `automation`, `seo`, `meta-tags`
- Deduplication: same field + message on same URL won't re-open

**Telegram:**
```
🏷️ Meta tags scan: 84 pages, 23 issues (8 errors, 10 warnings, 5 info). Quality score: 90%.
```

**State:**
- `.hermes/memory/meta-tags-scanner/baseline.json` — last run totals, quality score trend
- `.hermes/memory/meta-tags-scanner/issues.json` — tracked issue keys

---

## Safety

- **Read-only HTTP fetch**: Only reads pages; no code/file modifications
- **Non-blocking**: CI job does not fail the workflow on meta issues (informational); can be made required if needed
- **Deterministic**: String length and uniqueness checks; no external API
- **Issue deduplication**: Avoids spam; new issues only for fresh violations

---

## Dependencies

No new external dependencies. Uses Node.js built-ins (`https`, `http`, `zlib`, `fs`, `path`).

---

## Manual Trigger

```bash
gh workflow run meta-tags-scanner.yml
```

---

## Future Enhancements

- **Auto-fix PRs** — for simple issues (missing canonical, short title) generate PR with suggested fixes
- **Keyword optimization** — check title/description for target keywords per page
- **Traffic-aware priority** — prioritize issues on high-traffic pages (from #48 summarizer or analytics)
- **Schema.org cross-check** — ensure meta tags align with structured data (#54)
- **Competitor benchmark** — compare title/description length against top 10 SERP results
- **A/B testing integration** — suggest alternative titles/descriptions for review

---

## Related Guardrails

- **#53 OG Image Generator** — ensures OG tags present; complementary social/SEO
- **#54 Schema Validator** — structured data quality
- **#49 Sitemap Optimizer** — provides the sitemap this scanner consumes
- **#4 Lighthouse** — broader SEO audits; this is focused meta-only gate

---

## Example Issues

```
[Meta Tags] Quality issue on /blog/accelerating-nextjs
Field: title
Issue: Title too long (85 chars, should be ≤60)
Severity: error
```

```
[Meta Tags] Quality issue on /services/web-development
Field: description
Issue: Duplicate description across multiple pages
Severity: warn
```

```
[Meta Tags] Quality issue on /
Field: robots
Issue: noindex on important page (/) — verify intentional
Severity: warn
```

---

## Quality Score Calculation

```
Quality Score = (Pages with zero errors / Total pages) × 100

Warnings and info do not affect score — only errors count.
Example: 80 pages, 5 with errors → 93.75% quality score.
```

Score appears in Telegram digest and baseline history for trend tracking.
