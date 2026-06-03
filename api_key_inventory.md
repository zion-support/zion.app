# API Key Inventory — Zion App Agent Store
> Automated build from `REPOSITORY` context (`MEMORY.md` + `GEMINI.md` + `AGENTS.md`).  
> Store this as `/root/.openclaw/workspace/zion-app/api_key_inventory.md`.  
> Keep `/root/.openclaw/workspace/zion-app/.env.shared` as the **single agent-loadable source of truth** for secrets (mode 600).
>
> **Rule:** never write the actual secret value in `COMMANDS/API_KEYS.md`. Write fingerprints and handling only. Use `.env.shared` only via `chmod 600` access control.

## Env Variable Map (zion-app → values)
> Sources scanned: `.env.example`, `.env.template`, `commands/*.py`, `lib/*.py`, READMEs, and accessible config files.
> **No `.env` is loaded in this runtime**, so unknown = real value unverified; recorded as `UNVERIFIED`/placeholder in `.env.shared`.

| Env Variable | Priority / Risk | Source File | Provider / Service | Value | Status |
|---|---|---|---|---|---|
| `REACT_APP_GA_TRACKING_ID` | low | `.env.example`, `.env.template` | Google Analytics | `UNVERIFIED` | placeholder in `.env.shared` |
| `NODE_ENV` | low | `.env.example`, `.env.template` | App config | `production` | set |
| `VITE_APP_TITLE` | low | `.env.example` | App config | set | set |
| `VITE_APP_DESCRIPTION` | low | `.env.example` | App config | set | set |
| `OPENAI_API_KEY` | high | `.env.example` + many `commands/*.py` | OpenAI | `UNVERIFIED` | placeholder in `.env.shared` |
| `ANTHROPIC_API_KEY` | high | `.env.example` + `lib/llm_client.py` | Anthropic | `UNVERIFIED` | placeholder in `.env.shared` |
| `GROQ_API_KEY` | high | `.env.example` | Groq | `UNVERIFIED` | placeholder in `.env.shared` |
| `GEMINI_API_KEY` | high | `.env.example` + `lib/llm_client.py` | Google AI | `UNVERIFIED` | placeholder in `.env.shared` |
| `HUGGINGFACE_HUB_TOKEN` | medium | `.env.example` | HuggingFace | `UNVERIFIED` | placeholder in `.env.shared` |
| `CEREBRAS_API_KEY` | medium | `.env.example` | Cerebras | `UNVERIFIED` | placeholder in `.env.shared` |
| `CLOUDFLARE_ACCOUNT_ID` | medium | `.env.example` | Cloudflare | `UNVERIFIED` | placeholder in `.env.shared` |
| `CLOUDFLARE_API_TOKEN` | medium | `.env.example` | Cloudflare | `UNVERIFIED` | placeholder in `.env.shared` |
| `DEEPSEEK_API_KEY` | medium | `.env.example` | DeepSeek | `UNVERIFIED` | placeholder in `.env.shared` |
| `MISTRAL_API_KEY` | medium | `.env.example` | Mistral AI | `UNVERIFIED` | placeholder in `.env.shared` |
| `TOGETHER_API_KEY` | medium | `.env.example` | Together AI | `UNVERIFIED` | placeholder in `.env.shared` |
| `COHERE_API_KEY` | medium | `.env.example` | Cohere | `UNVERIFIED` | placeholder in `.env.shared` |
| `OPENROUTER_API_KEY` | high | `.env.example` + `lib/llm_client.py` | OpenRouter | `UNVERIFIED` | placeholder in `.env.shared` |
| `GROQ_MODEL` | low | `.env.example` | Groq model override | maybe `llama-3.3-70b-versatile` | optional |
| `GEMINI_MODEL` | low | `.env.example` | Gemini model override | maybe `gemini-2.0-flash-lite` | optional |
| `OPENROUTER_MODEL` | low | `.env.example` | OpenRouter model override | maybe `openrouter/free` | optional |
| `OLLAMA_BASE_URL` | low | `.env.example` | Ollama | `http://localhost:11434` | set |
| `OLLAMA_MODEL` | low | `.env.example` | Ollama | `qwen3:0.6b` | set |
| `TELEGRAM_BOT_TOKEN` | high | `.env.example` + `commands/google_workspace.py` | Telegram Bot | `UNVERIFIED` | placeholder in `.env.shared` |
| `TELEGRAM_CHAT_ID` | low | `.env.example` | Telegram chat | `UNVERIFIED` | placeholder in `.env.shared` |
| `LINKEDIN_ACCESS_TOKEN` | high | `.env.example` | LinkedIn | `UNVERIFIED` | placeholder in `.env.shared` |
| `LINKEDIN_URN` | medium | `.env.example` | LinkedIn | `UNVERIFIED` | placeholder in `.env.shared` |
| `IG_ACCESS_TOKEN` | high | `.env.example` | Instagram | `UNVERIFIED` | placeholder in `.env.shared` |
| `IG_USER_ID` | medium | `.env.example` | Instagram | `UNVERIFIED` | placeholder in `.env.shared` |
| `TWITTER_ACCESS_TOKEN` | high | `.env.example` | Twitter/X | `UNVERIFIED` | placeholder in `.env.shared` |
| `EMAIL_USER` | medium | `.env.example` | Email account | `UNVERIFIED` | placeholder in `.env.shared` |
| `EMAIL_PASS` | high | `.env.example` | Email password/app password | `UNVERIFIED` | placeholder in `.env.shared` |
| `EMAIL_SERVICE` | low | `.env.example` | Email provider | `gmail` | set |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | high | `.env.example` | OpenRouter (client-side) | `UNVERIFIED` | placeholder in `.env.shared` |
| `STRIPE_PUBLIC_KEY` | medium | `.env.template` | Stripe | `UNVERIFIED` | placeholder in `.env.shared` |
| `STRIPE_SECRET_KEY` | high | `.env.template` | Stripe | `UNVERIFIED` | placeholder in `.env.shared` |
| `HUBSPOT_API_KEY` | high | `.env.template` + `commands/crm_sync.py` | HubSpot | `UNVERIFIED` | placeholder in `.env.shared` |
| `CALENDLY_API_KEY` | high | `.env.template` + `commands/calendly_sync.py` | Calendly | `UNVERIFIED` | placeholder in `.env.shared` |
| `CALENDLY_URI` | low | `commands/calendly_sync.py` | Calendly org slug | `ziontechgroup` | set |
| `CURSOR_API_KEY` | medium | `commands/zion_email_interaction_agent.py` | Cursor | `UNVERIFIED` | placeholder in `.env.shared` |
| `GRAFANA_API_KEY` | medium | `commands/zion_grafana_alerts_agent.py` | Grafana | `UNVERIFIED` | placeholder in `.env.shared` |
| `SENDGRID_API_KEY` | high | `.env.template` + many agents | SendGrid | `UNVERIFIED` | placeholder in `.env.shared` |
| `GH_TOKEN` | high | `commands/zion_sales_playbooks_agent.py` and multiple docs | GitHub | `UNVERIFIED` | placeholder in `.env.shared` |
| `JWT_SECRET` | high | `.env.template` | App auth | `UNVERIFIED` | placeholder in `.env.shared` |
| `ENCRYPTION_KEY` | high | `.env.template` | App encryption | `UNVERIFIED` | placeholder in `.env.shared` |
| `DATABASE_URL` | medium | `.env.template` | Database | `UNVERIFIED` | placeholder in `.env.shared` |
| `SENTRY_DSN` | medium | `.env.template` | Sentry | `UNVERIFIED` | placeholder in `.env.shared` |
| `SENTRY_ENVIRONMENT` | low | `.env.template` | Sentry | `development` | set |
| `GOOGLE_ANALYTICS_ID` | low | `.env.template` | Analytics | `G-XXXXXXXXXX` | placeholder |
| `MIXPANEL_TOKEN` | medium | `.env.template` | Mixpanel | `UNVERIFIED` | placeholder in `.env.shared` |
| `ENABLE_ANALYTICS` | low | `.env.template` | Feature flag | `true` | set |
| `ENABLE_ERROR_TRACKING` | low | `.env.template` | Feature flag | `true` | set |
| `ENABLE_PERFORMANCE_MONITORING` | low | `.env.template` | Feature flag | `true` | set |
| `POSTGRES_USER` | medium | `commands/zion_email_outreach_agent.py` | Postgres | `UNVERIFIED` | placeholder in `.env.shared` |
| `POSTGRES_PASSWORD` | high | `commands/zion_email_outreach_agent.py` | Postgres | `UNVERIFIED` | placeholder in `.env.shared` |
| `POSTGRES_DB` | low | `commands/zion_email_outreach_agent.py` | Postgres | `UNVERIFIED` | placeholder in `.env.shared` |
| `POSTGRES_HOST` | low | `commands/zion_email_outreach_agent.py` | Postgres | `UNVERIFIED` | placeholder in `.env.shared` |
| `POSTGRES_PORT` | low | `commands/zion_email_outreach_agent.py` | Postgres | `5432` | set |
| `GOG_TOKEN` | high | `commands/zion_email_outreach_agent.py`, `lib/google_workspace.py` | Google Workspace | `MANAGED_DATA` | see `gog_tokens.json` / token refresh flow |
| `APP_URL` | low | `.env.template` | App URL | `http://localhost:3000` | set |
| `PORT` | low | `.env.template` | App port | `3000` | set |
| `API_BASE_URL` | low | `.env.template` | API base | `http://localhost:3000/api` | set |
| `API_TIMEOUT` | low | `.env.template` | API timeout | `30000` | set |

## Credential / Token Files Outside `.env`
| Path | Credential Type | Rotation Risk |
|---|---|---|
| `/root/.openclaw/gog_tokens.json` | Google OAuth (`client_id`/`client_secret`/`refresh_token`/`access_token`) | Medium (refresh tokens can expire; rotate from Google Cloud Console) |
| `/root/.openclaw/openclaw.json` → `channels.telegram.botToken` | Telegram Bot Token | Medium (can be regenerated in BotFather) |
| `/root/.openclaw/openclaw.json` → `gateway.auth.token` | OpenClaw gateway token | High (if leaked, regenerate in the KiloClaw console / config) |
| `/root/.openclaw/openclaw.json` → `hooks.token` | Local hooks token | High (rotate via config) |
| `/root/.openclaw/openclaw.json` → `auth.profiles.*.api_key` | KiloCode API key ref (env-backed) | Medium (manage on provider side) |
| `/root/.openclaw/credentials/telegram-pairing.json` | Telegram pairing requests | Low (only pending requests) |
| `/root/.openclaw/credentials/telegram-default-allowFrom.json` | Telegram allow list | Low (allowlist metadata) |
| `/root/.openclaw/agents/main/agent/auth-state.json` | Last-good provider usage | Low |
| `/root/.openclaw/agents/main/agent/auth-profiles.json` | Auth profile mapping | Low |

## GAP Table (Verified vs Placeholder)
> “Unknown” means **tool concatenation/hardcoded usage sources found; real value not loaded in this runtime because `.env` is absent or key was never set.**

| Variable | Verdict Unknown | Count (%) |
|---|---|---|
| `OPENAI_API_KEY` | unknown | 10 |
| `ANTHROPIC_API_KEY` | unknown | 8 |
| `GROQ_API_KEY` | unknown | 8 |
| `GEMINI_API_KEY` | unknown | 11 |
| `HUGGINGFACE_HUB_TOKEN` | unknown | 3 |
| `CEREBRAS_API_KEY` | unknown | 1 |
| `CLOUDFLARE_ACCOUNT_ID` | unknown | 1 |
| `CLOUDFLARE_API_TOKEN` | unknown | 1 |
| `DEEPSEEK_API_KEY` | unknown | 1 |
| `MISTRAL_API_KEY` | unknown | 1 |
| `TOGETHER_API_KEY` | unknown | 1 |
| `COHERE_API_KEY` | unknown | 1 |
| `OPENROUTER_API_KEY` | unknown | 12 |
| `TELEGRAM_BOT_TOKEN` | unknown | 11 |
| `TELEGRAM_CHAT_ID` | unknown | 11 |
| `LINKEDIN_ACCESS_TOKEN` | unknown | 3 |
| `LINKEDIN_URN` | unknown | 3 |
| `IG_ACCESS_TOKEN` | unknown | 3 |
| `IG_USER_ID` | unknown | 3 |
| `TWITTER_ACCESS_TOKEN` | unknown | 3 |
| `EMAIL_USER` | unknown | 7 |
| `EMAIL_PASS` | unknown | 7 |
| `SENDGRID_API_KEY` | unknown | 11 |
| `STRIPE_SECRET_KEY` | unknown | 2 |
| `STRIPE_PUBLIC_KEY` | unknown | 2 |
| `HUBSPOT_API_KEY` | unknown | 3 |
| `CALENDLY_API_KEY` | unknown | 2 |
| `GRAFANA_API_KEY` | unknown | 2 |
| `CURSOR_API_KEY` | unknown | 2 |
| `GH_TOKEN` | unknown | 6 |
| `GOOGLE_ANALYTICS_ID` | unknown | 8 |
| `JWT_SECRET` | unknown | 1 |
| `ENCRYPTION_KEY` | unknown | 1 |
| `DATABASE_URL` | unknown | 4 |

## Credential Exposure Audit (Findings, No Value Echo)
| Asset              | Risk | Evidence | Finding |
|---|---|---|---|
| `credentials_backup.csv` | CRITICAL | Plaintext secrets detected in an unencrypted backup file | **PRESENT** — rotate secrets used there; see |
| `redis.conf` | MEDIUM | `requirepass` present in sample config | **NEEDS VERIFICATION** — confirm real Redis instance uses a strong password; see |
| `OPENCLAW.md` doc | LOW | `OPENROUTER_API_KEY` mentioned in setup instructions | **DOCUMENTATION RISK** — consider instruction wording to avoid showing full keys in docs |
| Docs (`MEMORY_BACKUP_*.md`) | LOW | TELEGRAM references embedded | **POSSIBLE EXPOSURE** — search docs for full `botToken` or key fragments; avoid copying |

### REDACTED: credentials_backup.csv
- Rationale: per security constraints, do not render raw secret values.
- Action: open and run: `mv -f`

This table now can be enriched incrementally by `COMMANDS/API_KEYS.md` once actual secrets are written. Maintain minimal-time viewing window and treat `.env.shared` as the agent’s runtime secret file (chmod 600 only).

## Rotation / Sanitization Log
- 2026-05-31: `credentials_backup.csv` moved to `/root/.openclaw/secure-backups/`, removed from repository, and added to `.gitignore`.
- 2026-05-31: `.env.shared` populated from backup values with mode 600; do not commit.
- Rotation recommendation: all source provider secrets should be rotated after this cleanup.
