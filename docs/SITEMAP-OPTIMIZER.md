# Autonomous Dynamic Sitemap & Route Priority Optimizer

**Status:** ✅ Active  
**Triggers:** Weekly Sunday 06:00 UTC (scheduled), manual dispatch  
**Output:** Writes `public/sitemap.xml`; pings search engines  
**Telegram alerts:** On update or errors

---

## Problem

Static sitemap.xml files typically list all routes with uniform priority and change frequency. This gives search engines no signal about which pages are most important or frequently updated, potentially wasting crawl budget on stale or low-value pages.

## Solution

Weekly sitemap regenerator that:
- Discovers all routes from `app/` directory (Next.js App Router)
- Assigns each route a priority heuristically:
  - Home: 1.0
  - Services: 0.9
  - AI Lab: 0.8
  - Static/blog/articles: 0.7
  - Dynamic/others: 0.5
- Sets `changefreq` based on last file modification date:
  - Modified <7 days → daily
  - Modified <30 days → weekly
  - Older → monthly
- Commits updated `sitemap.xml` to repository
- Pings Google and Bing to refresh index
- Sends Telegram notification

---

## How It Works

1. Walks `app/` to find all `page.tsx`/`page.ts` files, builds route paths
2. For each route:
   - Finds newest file modification time in route directory tree
   - Assigns priority by route path heuristics
   - Computes change frequency from modification age
3. Generates valid `sitemap.xml` (XML 0.9 spec)
4. Writes to `public/sitemap.xml`
5. Commits and pushes (if changed)
6. Pings search engines via their sitemap ping endpoints
7. Sends Telegram summary

---

## Configuration

Edit thresholds/priorities in `automation/sitemap-optimizer.cjs`:

```js
const PRIORITY_HOME = 1.0;
const PRIORITY_SERVICES = 0.9;
const PRIORITY_AI_LAB = 0.8;
const PRIORITY_STATIC = 0.7;
const PRIORITY_DYNAMIC = 0.5;
```

Customize priority rules by editing `determinePriority()` function.

---

## Output

- **Sitemap file**: `public/sitemap.xml` (committed to repo)
- **History**: `.hermes/memory/sitemap-optimizer/history.json`

Example `<url>` entry:
```xml
<url>
  <loc>https://ziontechgroup.com/services</loc>
  <lastmod>2026-05-12</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

---

## Safety

- **Non-destructive**: Only writes to `public/sitemap.xml`; previous version is backup-restorable via Git
- **No external secrets**: Search engine pings are unauthenticated public endpoints
- **Deterministic**: Pure file system scan; no external API calls

---

## Dependencies

None — uses Node.js built-ins.

---

## Related Guardrails

- **#4 Lighthouse Monitor** — SEO score includes sitemap presence
- **#11 Error Tracker** — monitors 404s that could indicate sitemap issues
- **#12 API Health Monitor** — ensures routes in sitemap are reachable

---

## Future Enhancements

- Integrate with Google Search Console API for index coverage feedback
- Auto-exclude routes with `robots.txt` `noindex`
- Weight priority by Google Analytics traffic (if accessible)
- Split large sitemaps into index + chunks (max 50k URLs)
