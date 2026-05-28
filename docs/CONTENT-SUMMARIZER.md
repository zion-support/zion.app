# Autonomous Content Summarizer & Excerpt Generator

**Status:** ✅ Active  
**Triggers:** Weekly Sunday 05:00 UTC (scheduled), manual dispatch  
**Output:** Summaries in `.hermes/memory/content-summarizer/summaries/`  
**Telegram alerts:** Weekly completion summary; errors

---

## Problem

Content pages (blog posts, service descriptions, AI Lab writeups) often lack compelling meta descriptions and excerpts, hurting SEO click-through rates. Manually writing summaries for every page is time-consuming and easily forgotten.

## Solution

Weekly automated content analyzer that:
- Scans content directories (`app/content`, `app/blog`, `app/services`, `app/ai-lab`)
- Extracts plain text from Markdown/TSX files
- Ranks sentences by importance using TF-IDF-like scoring
- Generates concise excerpts (40–160 chars) suitable for meta descriptions
- Suggests relevant tags/keywords via frequency analysis
- Produces sidecar JSON files for review and integration into frontmatter

---

## How It Works

1. Recursively discovers `.md`, `.mdx`, `.tsx`, `.jsx` files in content directories
2. Strips markdown/JSX syntax and frontmatter to get raw text
3. Tokenizes text; removes stop words
4. Scores sentences by term frequency (richer content = higher score)
5. Picks top-ranked sentence as excerpt candidate
6. Extracts top 5 keywords by frequency
7. Writes JSON suggestion file per content page
8. Uploads artifacts; sends Telegram digest with count

---

## Output

Per-content JSON (`summaries/<filename>_relative_path.json`):
```json
{
  "file": "app/blog/my-post.mdx",
  "timestamp": "2026-05-12T05:00:00.000Z",
  "excerpt": "This post explores how to build autonomous guardrails...",
  "metaDescription": "Learn to build autonomous guardrails...",
  "suggestedKeywords": ["autonomous", "guardrails", "nodejs", "ci-cd"],
  "topSentences": [
    "First sentence of high importance...",
    "Second key point...",
    ...
  ]
}
```

Index: `.hermes/memory/content-summarizer/summaries-index.json`

---

## Usage

### Weekly automated run
No action needed — runs every Sunday 05:00 UTC.

### Manual run
```bash
gh workflow run content-summarizer.yml
```

### Applying suggestions
Review generated JSON files in `.hermes/memory/content-summarizer/summaries/`. Then:
- Copy `excerpt` or `metaDescription` into page frontmatter
- Add `suggestedKeywords` to tags array
- Commit updates

Future: auto-apply via PR (optional enhancement).

---

## Configuration

Edit thresholds in `automation/content-summarizer.cjs`:

```js
const MIN_SUMMARY_LENGTH = 40;
const MAX_SUMMARY_LENGTH = 160; // optimal for SEO meta descriptions
const TOP_KEYWORDS = 5;
```

Edit monitored directories:
```js
const CONTENT_DIRS = ['app/content', 'app/blog', 'app/services', 'app/ai-lab', 'public/content'];
```

---

## Safety

- **Read-only analysis**: Does not modify any source files; only writes suggestions to `.hermes/memory/`
- **Local NLP**: No external APIs; pure Node.js string processing
- **Non-blocking**: No CI failures; purely advisory

---

## Dependencies

None beyond Node.js standard library. Works with any content format.

---

## Enhancement Ideas

- Auto-update frontmatter with excerpt/keywords (opt-in)
- Use a more advanced summarization algorithm (TextRank)
- Integrate with AI Lab summarizer model for AI-enhanced excerpts
- Generate OpenGraph image titles from summaries

---

## Related Guardrails

- **#4 Lighthouse Monitor** — meta descriptions impact SEO score
- **#11 Error Tracker** — monitors pages after content updates
- **#45 Visual Regression** — ensures layout holds after excerpt length changes
