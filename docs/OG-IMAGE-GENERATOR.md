# Autonomous Open Graph Image Generator

**Status:** ✅ Active  
**Triggers:** Daily 01:00 UTC (scheduled), manual dispatch  
**Output:** Generates `public/og-images/<slug>.png`; auto-commits; Telegram summary  
**Telegram alerts:** On completion count or errors

---

## Problem

Social media shares require Open Graph (OG) images. Without them, links show plain text previews, reducing click-through rates and brand consistency. Manually creating OG images for each blog post or service page is tedious and often forgotten.

## Solution

Daily automatic OG image generator that:
- Scans content directories (`app/blog`, `app/services`, `app/ai-lab`, `app/content`)
- Reads page title and excerpt from frontmatter or generates excerpt from body
- Renders a 1200×630 PNG using Playwright (headless Chromium) with styled HTML template
- Saves to `public/og-images/<slug>.png`
- Commits and pushes to `main`
- Sends Telegram summary with image count

---

## How It Works

1. **Content discovery**: Finds all Markdown/MDX content files
2. **Frontmatter parsing**: Extracts `title` and `excerpt` (fallback to first paragraph)
3. **HTML rendering**: Builds a styled HTML page with title, excerpt, and site branding
4. **Screenshot**: Uses Playwright Chromium to capture 1200×630 PNG
5. **Storage**: Saves to `public/og-images/` with filename `<slug>.png`
6. **Git operations**: Commits and pushes images automatically (if any changed/added)
7. **Notification**: Sends Telegram message with count of generated images

---

## Output

Images saved: `public/og-images/<slug>.png`  
Manifest: `.hermes/memory/og-images/manifest.json` (list of generated files)

Example:
```
public/og-images/
├── building-autonomous-guardrails.png
├── ai-lab-overview.png
└── ...
```

---

## Configuration

No configuration needed. Defaults:

- Size: 1200×630 (standard OG image)
- Background: dark slate gradient (`#0f172a` → `#1e293b`)
- Text: white
- Logo: fetched from `https://ziontechgroup.com/logo.png` (hidden if fails)

To customize, edit `automation/og-image-generator.cjs` constants:

```js
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;
const BG_COLOR = '#0f172a';
const TEXT_COLOR = '#ffffff';
const LOGO_URL = 'https://ziontechgroup.com/logo.png';
```

---

## Safety

- **Read-only source analysis**: Does not modify content files
- **Writes only to `public/og-images/`**: No changes to source code or frontmatter (future opt-in)
- **Uses existing deps**: Playwright already in devDependencies from #45
- **Non-blocking**: CI exit code reflects success/failure; can be made required if needed

---

## Dependencies

- `@playwright/test` (chromium) — already used by #45
- Chromium browser — installed via `npx playwright install chromium`

Ensure devDependencies include:
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

---

## Manual Trigger

```bash
gh workflow run og-image-generator.yml
```

---

## Future Enhancements

- Auto-inject `ogImage` path into content frontmatter (opt-in via config)
- Support custom templates per content type (blog vs service)
- Add dynamic elements (date, author, category badges)
- Cache rendered images to avoid regenerating unchanged pages

---

## Related Guardrails

- **#48 Content Summarizer** — provides excerpt text used here
- **#49 Sitemap Optimizer** — SEO complementary
- **#4 Lighthouse** — OG image presence impacts SEO score
- **#45 Visual Regression** — could detect OG image template changes if needed

---

## Why Playwright vs Canvas?

Uses Playwright (already in devDeps) to avoid native `canvas` module complexities (Cairo, build-essential). Chromium headless is reliable on GitHub Actions and gives pixel-perfect text rendering with CSS.
