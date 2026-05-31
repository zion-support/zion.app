# Zion Tech Group — API Keys & Credentials Registry
> **Last Updated:** 2026-05-30
> **Maintained by:** OWL (automated) + all agents
> **Location:** `~/.hermes/.env` (primary), `docs/API_REGISTRY.md` (this file)

## 🔑 Active API Keys

### AI / LLM Providers
| Service | Key Name | Status | Tier | Notes |
|---------|----------|--------|------|-------|
| OpenAI | `OPENAI_API_KEY` | ✅ Active | Pay-as-you-go | gpt-4o, gpt-4o-mini |
| Google Gemini | `GEMINI_API_KEY` | ✅ Active | Free tier | gemini-1.5-pro |
| OpenRouter | `OPENROUTER_API_KEY` | ✅ Active | Pay-as-you-go | mixtral, llama-70b |
| Cursor | `CURSOR_API_KEY` | ✅ Active | Paid | Code generation |
| HuggingFace | `HF_API_KEY` | ✅ Active | Free tier | Model hub |

### Communication
| Service | Key Name | Status | Tier | Notes |
|---------|----------|--------|------|-------|
| Telegram Bot | `TELEGRAM_BOT_TOKEN` | ✅ Active | Free | Zion Agents group |
| Telegram OWL | `TELEGRAM_OWL_TOKEN` | ✅ Active | Free | OWL bot |

### Development & Infrastructure
| Service | Key Name | Status | Tier | Notes |
|---------|----------|--------|------|-------|
| GitHub | `GITHUB_TOKEN` | ✅ Active | Free | Auto-deploy via Netlify |
| Netlify | Auto-deploy | ✅ Active | Free | Linked to GitHub repo |

## 🆓 Free Tiers Available (Not Yet Activated)

### Analytics & Monitoring
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| PostHog | 1M events/mo | ⏳ Not activated | @windows_carol_bot |
| Langfuse | Self-hosted | ⏳ Not activated | @Kilo_openclaw_kleber_bot |
| Plausible | 10K pageviews | ⏳ Not activated | @windows_carol_bot |

### Email & Communication
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| Resend | 100 emails/day | ⏳ Not activated | @windows_carol_bot |
| Mailgun | 5K emails/mo | ⏳ Not activated | @windows_carol_bot |

### Database & Storage
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| Turso | 500MB SQLite | ⏳ Not activated | @Kilo_openclaw_kleber_bot |
| Upstash Redis | 10K commands/day | ⏳ Not activated | @Kilo_openclaw_kleber_bot |
| PlanetScale | 5GB storage | ⏳ Not activated | @Neo_kleber_bot |

### Automation & Workflows
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| n8n | Self-hosted | ⏳ Not activated | @Neo_kleber_bot |
| Make (Integromat) | 1K ops/mo | ⏳ Not activated | @windows_carol_bot |

### AI/ML Tools
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| Ollama | 100% free local | ⏳ Not activated | @Kilo_openclaw_kleber_bot |
| Replicate | Free credits | ⏳ Not activated | @Neo_kleber_bot |
| Together AI | Free credits | ⏳ Not activated | @Neo_kleber_bot |

### Authentication
| Service | Free Tier | Status | Agent to Activate |
|---------|-----------|--------|-------------------|
| Clerk | 10K MAU | ⏳ Not activated | @Rocket_Kleber_bot |
| Auth0 | 7K users | ⏳ Not activated | @Rocket_Kleber_bot |

## 🔧 Setup Instructions for Each Agent

### @windows_carol_bot (Browser Access)
**Tasks:**
1. Sign up for PostHog free tier → get API key
2. Sign up for Resend free tier → get API key
3. Sign up for Plausible analytics → get site ID
4. Configure Google Search API (100 searches/day free)

**How to store keys:**
```bash
echo "POSTHOG_API_KEY=phx_xxx" >> ~/.hermes/.env
echo "RESEND_API_KEY=re_xxx" >> ~/.hermes/.env
```

### @Kilo_openclaw_kleber_bot (Self-hosting)
**Tasks:**
1. Install Ollama locally → configure endpoint
2. Self-host n8n → create webhook endpoints
3. Self-host Langfuse → configure tracing
4. Set up Turso database → get connection string

**How to store keys:**
```bash
echo "OLLAMA_ENDPOINT=http://localhost:11434" >> ~/.hermes/.env
echo "N8N_WEBHOOK_URL=http://localhost:5678" >> ~/.hermes/.env
```

### @Neo_kleber_bot (Workflows)
**Tasks:**
1. Create n8n workflows for email→CRM→proposal pipeline
2. Set up Stripe staging account → get test keys
3. Configure Replicate API for image generation
4. Build notification webhooks

**How to store keys:**
```bash
echo "STRIPE_TEST_KEY=sk_test_xxx" >> ~/.hermes/.env
echo "REPLICATE_API_TOKEN=r8_xxx" >> ~/.hermes/.env
```

### @Windows_quel_bot (Web Development)
**Tasks:**
1. Set up Clerk auth for app authentication
2. Configure PlanetScale database
3. Set up Upstash Redis for caching
4. Enable GitHub Actions CI/CD

**How to store keys:**
```bash
echo "CLERK_PUBLISHABLE_KEY=pk_xxx" >> ~/.hermes/.env
echo "PLANETSCALE_CONNECTION_STRING=pscale_xxx" >> ~/.hermes/.env
```

### @Rocket_Kleber_bot (Frontend/UX)
**Tasks:**
1. Configure PostHog analytics on frontend
2. Set up live chat widget (Crisp free tier)
3. Enable Clerk authentication UI
4. Configure error tracking (Sentry free tier)

**How to store keys:**
```bash
echo "NEXT_PUBLIC_POSTHOG_KEY=phx_xxx" >> .env.local
echo "SENTRY_DSN=https://xxx@sentry.io/xxx" >> .env.local
```

## 📋 Key Rotation & Security Policy

1. **Never commit keys to git** — always use `.env` files
2. **Rotate keys every 90 days** for production services
3. **Use separate keys per agent** when possible
4. **Revoke compromised keys immediately**
5. **Store production keys only on secure machines**

## 🔗 Quick Links

- OpenAI Dashboard: https://platform.openai.com/keys
- OpenRouter Dashboard: https://openrouter.ai/keys
- GitHub Tokens: https://github.com/settings/tokens
- Netlify Dashboard: https://app.netlify.com
- Telegram BotFather: https://t.me/BotFather
- PostHog: https://app.posthog.com
- Resend: https://resend.com/api-keys
- n8n: https://docs.n8n.io/hosting/
- Ollama: https://ollama.ai

---

**To update this file:** Send message to @OWL with "update API keys" or modify `~/.hermes/.env` directly.
