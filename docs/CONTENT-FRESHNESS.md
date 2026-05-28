# Autonomous Content Freshness & Stale Content Archiver

**Status:** ✅ Active  
**Triggers:** Weekly Tuesday 10:00 UTC (scheduled), manual dispatch  
**Input:** Scans all content files under `app/` with frontmatter dates  
**Output:** GitHub issues for stale content; optional auto-archiving; Telegram digest

---

## Problem

Content gets outdated:
- Blog posts >2 years old may contain obsolete tech recommendations
- Service pages >3 years old may reflect deprecated offerings
- AI Lab pages >1 year old may miss fast-moving advancements

No automated tracking exists to flag stale content for review, leading to:
- Misleading visitors with outdated info
- SEO penalties for low-quality/old content
- Missed opportunities to update/redirect/archive

## Solution

Weekly automated freshness scanner:
- Walks `app/blog`, `app/services`, `app/ai-lab`, `app/content`
- Reads `datePublished` / `lastmod` frontmatter
- Compares age against configurable TTL per content type
- Opens GitHub issues for stale items needing review
- Optional auto-archiving (disabled by default) — adds `archived: true` flag
- Sends Telegram summary: total scanned, stale count, oldest items

---

## Age Thresholds (Configurable)

| Content Type | TTL (days) | Approx. Years |
|--------------|------------|---------------|
| Blog posts | 730 | 2 years |
| Services | 1095 | 3 years |
| AI Lab | 365 | 1 year |
| General content | 730 | 2 years |

Change via environment variables (see Configuration).

---

## How It Works

1. **Discover content** — Recursively finds `*.md` / `*.mdx` in configured directories
2. **Parse frontmatter** — Extracts `datePublished`, `date`, `lastmod`, `updatedAt`
3. **Compute age** — Days between reference date (prefers `lastmod`, falls back to `publish`) and now
4. **Apply TTL** — Compares against per-type threshold
5. **Track issues** — Deduplicates; opens new GitHub issues for each stale item (unless already open)
6. **Auto-archive (optional)** — If `CONTENT_FRESHNESS_AUTO_ARCHIVE=true`, adds `archived: true` frontmatter and suggests redirect
7. **Notify** — Telegram summary with counts and oldest items

---

## Configuration

Environment variables:

```bash
# TTL per content type (in days)
CONTENT_FRESHNESS_BLOG_TTL_DAYS=730
CONTENT_FRESHNESS_SERVICE_TTL_DAYS=1095
CONTENT_FRESHNESS_AI_LAB_TTL_DAYS=365
CONTENT_FRESHNESS_CONTENT_TTL_DAYS=730

# Behavior flags
CONTENT_FRESHNESS_AUTO_ARCHIVE=false    # If true, adds `archived: true` to frontmatter (DANGEROUS — review first!)
CONTENT_FRESHNESS_OPEN_ISSUES=true      # Auto-open GitHub issues on stale content

# GitHub credentials (needed for issue opening)
GITHUB_TOKEN=ghp_...
GITHUB_REPOSITORY=Zion-support/zion.app
```

---

## Output

**GitHub Issues:**
- Title: `[Content Freshness] Review needed: <filename>`
- Body includes:
  - File path
  - Reason (age exceeds TTL)
  - Age in days
  - Suggested action (review/update/archive)
  - Link to file on GitHub
- Labels: `automation`, `content`, `freshness`
- Deduplication: same file + reason won't re-open

**Telegram:**
```
🕒 Content freshness scan: 142 files, 12 stale, 3 new issues.
```

**State files:**
- `.hermes/memory/content-freshness/age-cache.json` — last known age per file
- `.hermes/memory/content-freshness/issues.json` — tracked issue keys

---

## Safety

- **Read-only scan by default**: Only reads files; no modifications unless `AUTO_ARCHIVE=true` (off by default)
- **GitHub issues only**: Opens issues for human review; does not auto-merge changes
- **Deterministic**: Pure date math; consistent thresholds
- **Non-destructive**: Never deletes content; only flags for attention
- **Issue deduplication**: Won't spam issues for same stale item

---

## Dependencies

No new external dependencies. Uses Node.js built-ins and existing `@octokit/rest` (already added by #55).

---

## Manual Trigger

```bash
gh workflow run content-freshness.yml
```

---

## Future Enhancements

- **Auto-suggest redirects** — when archiving, suggest target page (e.g., service → alternative or contact)
- **Priority scoring** — weight by traffic (from analytics), combine with age to prioritize reviews
- **Content category tagging** — detect topic (via summarizer #48) and apply different TTLs per topic
- **Update suggestions** — use LLM to draft updated content snippets for review
- **Archive PR generation** — auto-create PR that moves stale content to `archive/` folder and adds redirects
- **Integration with #49 sitemap** — remove stale pages from sitemap automatically

---

## Related Guardrails

- **#48 Content Summarizer** — could auto-generate "update needed" summaries
- **#49 Sitemap Optimizer** — stale content should be removed from sitemap
- **#53 OG Image Generator** — archived content may need OG image cleanup
- **#54 Schema Validator** — archived pages may need `noindex` schema changes

---

## Workflow Example

```
Weekly Tuesday 10:00 UTC:
1. Scan 142 content files
2. Find 12 stale items:
   - 5 blog posts >2y old (no updates)
   - 3 service pages >3y old
   - 4 AI Lab pages >1y old
3. Open 3 new GitHub issues (others already tracked)
4. Send Telegram: "🕒 Content freshness scan: 142 files, 12 stale, 3 new issues."
5. Human reviewers triage issues, update/archive as needed
```

---

## Opting Out

To exclude a specific page from freshness checks, add to frontmatter:
```yaml
freshness:
  ignore: true
```
(Feature not yet implemented — planned for v2.)
