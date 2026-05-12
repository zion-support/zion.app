# Autonomous Content Quality & SEO Auditor

> Monitors page content for SEO completeness, readability, freshness, and internal linking health. Self-hosted, no external APIs.

## Overview

Content quality and SEO compliance are now checked automatically. This system:

- **Fetches all sitemap pages** (up to 50)
- **Parses HTML** to extract: title, meta description, headings, word count, links, Open Graph, Twitter Cards, JSON-LD
- **Scores each page** 0–100 based on SEO best practices
- **Measures readability** (Flesch Reading Ease, Grade Level)
- **Detects issues:** thin content, orphan pages, missing metadata, poor alt coverage
- **Tracks trends** — per-page score history (90 days)
- **Alerts** — Telegram daily summary, GitHub issues for systemic problems
- **PR integration** — comments on content-change PRs with findings

---

## Architecture

```
┌──────────────────────────────┐
│ GitHub Actions               │
│ Daily 16:00 UTC              │
│ + PR on content changes      │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│ automation/content-quality-audit.cjs        │
│  1. Fetch sitemap URLs                      │
│  2. HTTP GET each page (HTML)               │
│  3. Parse with regex (lightweight)          │
│     - title, meta, headings, text           │
│     - internal/external links               │
│     - Open Graph, Twitter Cards             │
│     - JSON-LD schema                        │
│  4. Compute metrics:                        │
│     • Word count                            │
│     • Flesch Reading Ease                   │
│     • Gunning Fog Index                     │
│     • SEO score (0-100)                     │
│  5. Apply thresholds                       │
│  6. Compare to 90d history                  │
│  7. Alert + Issue                           │
└──────────┬───────────────────────────────────┘
           │
           ▼
    ┌──────┴───────┐
    │              │
    ▼              ▼
┌──────────────┐ ┌─────────────────────┐
│ PR Comment   │ │ Telegram Daily      │
│ (on content  │ │ Summary             │
│  change PR) │ │                     │
│             │ │ 📊 Average SEO     │
│ 🚨 Critical │ │ score, top issues  │
│ issues      │ │                    │
│             │ └─────────────────────┘
└──────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│ GitHub Issue (if systemic problems)         │
│ • ≥3 pages with score < 50                  │
│ • ≥5 orphan pages                           │
│ • ≥5 pages missing key metadata            │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│ State persisted                              │
│ .hermes/memory/content-quality/              │
│  - history.json (90-day per-page)           │
│  - latest-report.json                        │
│  - content-audit.log                         │
└─────────────────────────────────────────────┘
```

---

## Components

| File | Purpose |
|------|---------|
| `automation/content-quality-audit.cjs` | Fetcher + parser + scorer |
| `.github/workflows/content-quality-audit.yml` | Daily + PR-on-content-change |
| `.hermes/memory/content-quality/history.json` | Per-page score history (90d) |
| `docs/CONTENT-QUALITY-AUDIT.md` | This documentation |

---

## What Gets Analyzed

**Pages:** From `sitemap.xml` (all URLs; limited to first 50 for speed)

**Extracted elements:**

| Element | Checked | Why |
|---------|---------|-----|
| `<title>` | Exists, length 30–60 chars | SEO ranking, click-through |
| `<meta name="description">` | Exists, length 120–160 chars | Search snippet |
| `<h1>` | Exactly one per page | Heading hierarchy |
| `<h2>`–`<h6>` | Count only | Structure |
| Body text | Word count, readability | Thin content, user experience |
| Internal links | Count | Site connectivity, orphan detection |
| `<img alt>` | Coverage ratio | Accessibility + SEO |
| Open Graph (`og:*`) | title, description, image | Social sharing |
| Twitter Card (`twitter:*`) | title, description, image | Social sharing |
| JSON-LD (`application/ld+json`) | Presence | Structured data for rich snippets |

---

## Scoring Rubric (0–100)

Start at 100, subtract for issues:

| Issue | Penalty |
|-------|---------|
| Missing title | -15 |
| Title too short (<30) or too long (>60) | -10 or -5 |
| Missing meta description | -15 |
| Meta desc too short/long | -10 / -5 |
| Missing H1 | -10 |
| Word count < 300 | -15 |
| Internal links < 2 | -10 |
| Missing og:title | -5 |
| Missing og:description | -5 |
| Missing og:image | -3 |
| Missing Twitter title | -3 |
| Missing Twitter description | -3 |
| Missing JSON-LD schema | -5 |
| <50% images have alt | -10 |
| Some images missing alt (≥80% but <100%) | -5 |
| Reading level >12th grade | -5 |

**Interpretation:**
- **80–100:** Good — SEO-healthy page
- **50–79:** Needs improvement — some fixes needed
- **<50:** Critical — significant SEO/content issues

---

## Key Metrics

| Metric | Target | Tool purpose |
|--------|--------|--------------|
| SEO score | ≥70 average across site | Overall content health |
| Word count | ≥300 per article/page | Avoid thin content penalty |
| Internal links | ≥2 per page | Prevent orphan pages |
| Title length | 30–60 chars | Optimal SERP display |
| Meta description | 120–160 chars | Compelling snippet |
| Reading level | ≤12th grade | Broad accessibility |
| Alt coverage | 100% | WCAG + SEO image search |

---

## Thresholds & Actions

| Condition | Severity | Action |
|-----------|----------|--------|
| Any page SEO score < 50 on PR | Warning | PR comment with details |
| >10% of pages have score < 50 | Critical | Daily Telegram alert |
| >5 orphan pages (internal links < 2) | Critical | GitHub issue |
| Average SEO score drops >10 pts vs 7-day avg | Warning | Telegram alert |
| >25% of pages are thin content (<300 words) | Warning | Telegram + issue |

---

## Telegram Daily Summary

```
📝 Content Quality & SEO Audit — May 12, 2026
Base: https://ziontechgroup.com

📊 Average SEO score: 72/100
Pages scanned: 42

🚨 Critical pages (score < 50): 3
🔗 Orphan pages (<2 internal links): 6
📄 Thin content (<300 words): 8
⚠️ Missing metadata issues: 12

Top 5 lowest-scoring pages:
• /blog/old-post: 32 — missing_title, thin_content, orphan_page
• /services: 45 — missing_meta_desc, poor_image_alt_coverage
• /about: 48 — missing_schema, reading_level_too_high

Details: .hermes/memory/content-quality/latest-report.json
```

---

## PR Comment Example

**On content-change PR with issues:**
```
🚨 Content Quality & SEO audit found critical issues

SEO score avg: 62/100
Critical pages: 2
Orphan pages: 3
Thin content: 4

See artifact for full report. Consider improving content before merge.
```

**On clean PR:**
```
✅ Content audit passed — SEO score 78/100, no critical issues.
```

---

## GitHub Issue Example

**Title:** `🚨 Content Quality & SEO Issues — 05/12/2026 — 3 critical pages`

**Body includes:**
- Summary of all problem categories
- Table of lowest-scoring pages with direct links
- Remediation checklist per issue type
- Links to SEO best practices (Google, Moz)

**Labels:** `automation`, `seo`, `content-quality`

---

## Configuration

| Variable | Default | Notes |
|----------|---------|-------|
| `APP_URL` | `https://ziontechgroup.com` | Base URL for links |
| `TELEGRAM_BOT_TOKEN` | (required for alerts) | |
| `TELEGRAM_CHAT_ID` | `8435383377` | |
| `GITHUB_TOKEN` | — | Auto-injected by Actions |

---

## Storage

```
.hermes/memory/content-quality/
├── content-audit.log
├── history.json   # { pages: { "/url": { "2026-05-12": { score, wordCount, issues[] } } } }
└── latest-report.json
```

---

## GitHub Workflow

| Trigger | What it does |
|---------|---------------|
| `pull_request` (paths: app/, components/, content/) | Parses changed pages, runs audit, comments PR |
| `schedule` daily 16:00 UTC | Full site scan, Telegram summary, issue if systemic |
| `workflow_dispatch` | Manual run |

---

## Testing Locally

```bash
node automation/content-quality-audit.cjs
```

Check output:
- Console log per-page score
- `.hermes/memory/content-quality/latest-report.json`
- `.hermes/memory/content-quality/history.json` updated

Force issues:
- Edit a page to remove `<title>` → score drops
- Reduce word count below 300 → thin_content flag
- Remove internal links → orphan_page flag

---

## Remediation Guide

### 1. SEO Title & Description
```tsx
// In page component or layout
export const metadata = {
  title: 'AI Consulting Services — Zion Tech Group', // 30–60 chars
  description: 'Expert AI consulting and implementation for enterprise teams. Get tailored solutions.', // 120–160 chars
};
```

### 2. Add Missing H1
```tsx
export default function ServicesPage() {
  return (
    <>
      <h1>Our AI & IT Services</h1>  {/* Exactly one H1 per page */}
      {/* Rest of content */}
    </>
  );
}
```

### 3. Thin Content — Expand
- Add detailed paragraphs
- Include use cases, benefits, technical specs
- Target 500+ words for pillar pages

### 4. Orphan Pages — Add Internal Links
```tsx
// From related pages, add links:
<Link href="/services/ai-consulting">Our AI Consulting</Link>
```

### 5. Open Graph Tags
```tsx
// In page metadata export
export const metadata = {
  openGraph: {
    title: 'Page title',
    description: 'Page description for social sharing',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page title',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
};
```

### 6. Schema.org JSON-LD
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Page description",
  })
}} />
```

---

## Reading Level Targets

- **Flesch Reading Ease:** 60–70 (fairly easy to read)
- **Grade Level:** ≤ 10 (accessible to broad audience)
- If grade >12: simplify sentences, avoid jargon, break long sentences

---

## Future Enhancements

- **Keyword analysis** — TF-IDF to suggest primary keywords per page
- **Competitor gap analysis** — compare metadata against top 10 SERP results (would need external API)
- **Content freshness** — Git commit date vs publish date; flag stale >2 years
- **Duplicate content detection** — near-duplicate pages across site
- **Internal link suggestions** — recommend related pages to link to
- **Dashboard UI** — `/admin/seo` with score trends, page-by-page drilldown
- **Sitemap lastmod comparison** — cross-check sitemap `<lastmod>` vs actual content updates
- **Image alt text quality** — NLP to check if alt is descriptive vs "image123"
- **Mobile speed integration** — combine with Lighthouse performance score

---

## Why This Matters

- **SEO traffic:** Higher rankings → more organic leads
- **User engagement:** Readable, well-structured content keeps visitors
- **Technical SEO completeness:** Metadata is table stakes for indexing
- **Content strategy:** Identify thin/old pages needing refresh
- **Competitive edge:** Many sites neglect on-page SEO; automated guardrail keeps you ahead

---

*Created: 2026-05-12 — Autonomous implementation via OpenClaw (Task #29)*
