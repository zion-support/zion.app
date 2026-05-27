# OpenRouter API Key Setup (Fallback)

Automation agents use **local Ollama as primary** and **OpenRouter as fallback** when Ollama is unavailable. See `docs/LOCAL-LLM-SETUP.md` for full setup.

## Local Development

1. Copy `.env.example` to `.env` (or `.env.local` for Next.js overrides)
2. **Primary:** Install Ollama (`npm run llm:install`) — no API key needed
3. **Fallback:** Set `OPENROUTER_API_KEY` and `NEXT_PUBLIC_OPENROUTER_API_KEY` for when Ollama is unavailable
4. Automation scripts load `.env` automatically via dotenv
5. Next.js loads `.env` and `.env.local` for the AI Chat Widget

## GitHub Actions

Add `OPENROUTER_API_KEY` to repository secrets for workflows that use OpenRouter:

- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
- **Name:** `OPENROUTER_API_KEY`
- **Value:** Your OpenRouter API key (starts with `sk-or-v1-`)

Workflows using this secret:

- `ai-app-audit-automation.yml`
- `ai-automation-audit.yml`
- `ai-automations.yml`
- `ai-pr-code-review.yml`
- `ai-seo-content-optimizer.yml`
- `ai-layout-design-audit.yml`
- `ai-broken-link-page-automation.yml`

## Netlify (Production Build)

For the AI Chat Widget to work in production, add `NEXT_PUBLIC_OPENROUTER_API_KEY` to Netlify:

- **Site settings** → **Environment variables** → **Add a variable**
- **Key:** `NEXT_PUBLIC_OPENROUTER_API_KEY`
- **Value:** Your OpenRouter API key
- **Scopes:** Builds and deploys

## Cron Jobs

Cron jobs that use OpenRouter (navigation audit, layout audit, app audit) source `.env` automatically when the file exists. Ensure `.env` is present on the cron host with `OPENROUTER_API_KEY` set.
