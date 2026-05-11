# Content Automation Setup

High-speed content generation using OpenRouter (free tier).

## Prerequisites

1. **OpenRouter API Key**: Get one at [openrouter.ai](https://openrouter.ai)
2. **Model**: Uses `openrouter/free` (zero-cost, 20 req/min, 200 req/day)

## Local Setup

```bash
# Add to .env (never commit)
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openrouter/free
```

## GitHub Actions

Add `OPENROUTER_API_KEY` to repo secrets:

1. Repo → Settings → Secrets and variables → Actions
2. New repository secret: `OPENROUTER_API_KEY` = your key

The workflow `ai-content-automation.yml` runs Mon/Wed/Fri 4 AM UTC and on `workflow_dispatch` (fast or turbo pipeline).

## Commands

| Command | Description |
|---------|-------------|
| `npm run content:turbo` | Ideation + blog + front page (parallel, 4 posts, concurrency 4) |
| `npm run content:turbo-commit` | Same + auto-commit and push |
| `npm run content:fast` | Blog + front page expansion (parallel, 2 posts) |
| `npm run content:fast-commit` | Same + auto-commit and push |
| `npm run content:audit-ideas` | Audit live site, LLM content opportunity analysis |
| `npm run content:ideate` | LLM-powered content ideas (blog, industries, case studies) |
| `npm run content:front-page-expand` | Front page only |

## Options

- `MAX_BLOG_POSTS=4` — Limit new blog posts per run (turbo default: 4, fast: 2)
- `MAX_CONCURRENCY=4` — Parallel blog generation (turbo default: 4)
- `SKIP_IDEATION=1` — Skip ideation step (turbo only)
- `SKIP_BLOG=1` — Skip blog generation
- `SKIP_FRONT_PAGE=1` — Skip front page expansion
- `AUTO_COMMIT=1` — Commit and push after generation
