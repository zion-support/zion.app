# Zion Tech Group

Production website and AI solutions platform powering https://ziontechgroup.com.

## Quick start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Quality checks

```bash
npm run lint:check
npm run type-check
npm run test:ci
```

## Key areas

- `app/` – Next.js App Router pages and components
- `automation/` – autonomous agents and optimization scripts
- `commands/` – utility and orchestration scripts

## Automation (AI audits)

LLM-powered automations use a **multi-provider chain** (first available):

1. **Ollama** (local, free) — `npm run llm:install`
2. **Groq** (free tier, ultra-fast) — [console.groq.com](https://console.groq.com)
3. **Google Gemini** (free tier, 1.5k req/day) — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
4. **Hugging Face** (300 req/hr) — [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
5. **Cerebras** (1M tokens/day) — [cloud.cerebras.ai](https://cloud.cerebras.ai)
6. **Cloudflare Workers AI** (10k Neurons/day) — [dash.cloudflare.com](https://dash.cloudflare.com)
7. **DeepSeek** (5M tokens free) — [platform.deepseek.com](https://platform.deepseek.com)
8. **Mistral AI** (free tier) — [console.mistral.ai](https://console.mistral.ai)
9. **Together AI** (free research models) — [together.ai](https://together.ai)
10. **Cohere** (1k req/month trial) — [dashboard.cohere.com](https://dashboard.cohere.com)
11. **OpenRouter** (fallback)

Add `GROQ_API_KEY`, `GEMINI_API_KEY`, `HUGGINGFACE_HUB_TOKEN`, `CEREBRAS_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`+`CLOUDFLARE_API_TOKEN`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `COHERE_API_KEY`, or `OPENROUTER_API_KEY` to `.env` for cloud fallbacks. See `docs/FREE-AI-TOOLS.md`.

Openclaw autonomous operations:
- Runbook: `OPENCLAW.md`
- Git hooks (report budget on commit; optional patch-router refresh; optional stability on push): `npm run git:hooks:install` — see `scripts/git-hooks/README.md` and `docs/git-hooks-cross-platform.md` (Lefthook: `npm run openclaw:lefthook:install`)
- Autonomy handoff artifact for agents: `npm run openclaw:autonomy:handoff` → `automation/reports/openclaw-autonomy-handoff-latest.json`
- Runtime reports: `automation/reports/openclaw-autonomous-app-improver-latest.json`
- Skills catalog: `automation/config/openclaw-agent-skills.json`
- CI workflows:
  - `.github/workflows/ai-openclaw-autonomous-cycle.yml`
  - `.github/workflows/ai-openclaw-freshness-sla.yml`
  - `.github/workflows/ai-openclaw-incident-escalator.yml`
  - `.github/workflows/ai-openclaw-pr-merge-stability.yml` (PRs touching `automation/` or lockfiles)

**Free embeddings**: Gemini (1,500 req/day) or Hugging Face (300 req/hr) — `npm run embedding:test`

**Free image generation**: Pollinations.ai — `npm run image:generate "prompt"` | Replicate FLUX — `npm run image:replicate "prompt"`

**Voice & TTS**: Web Speech API (browser, no key) — mic and speaker in AI Chat Widget

```bash
npm run llm:test         # Test LLM (Ollama, Groq, Gemini, Cloudflare, Cohere, or OpenRouter)
npm run image:generate   # Test AI image generation (Pollinations.ai)
npm run app:audit        # Audit live site with LLM
npm run app:audit-apply  # Apply safe suggestions
npm run app:site-improve # Run quality gates + app audit/apply cycle
```

### Site improvement automation flow

Use this sequence for a deployment-safe autonomous improvement loop:

```bash
npm run lint:check
npm run type-check
npm run test:ci
npm run app:site-improve
npm run build
```

For an all-in-one strict run:

```bash
npm run app:site-improve-strict
```

This flow is hosting-platform agnostic. It works with Vercel, Netlify, GitHub Pages, Cloudflare Pages, S3+CloudFront, or any CI/CD that can run npm scripts and publish static artifacts.

## Deployment expectations (platform agnostic)

Minimum pipeline for PR and main deployments:

1. `npm run lint:check`
2. `npm run type-check`
3. `npm run test:ci`
4. `npm run build`

If AI-driven evolution is enabled in CI, run `npm run app:site-improve` before `npm run build` and persist reports from `automation/reports/` as build artifacts.

### Local deploy (heavy / lock contention)

For local publishes when `.next` lock contention or PM2 churn is likely, prefer the supervised path (lock heal + retries + optional quiesce — see `automation/openclaw-deploy-supervisor.cjs`):

```bash
npm run deploy:local:supervised
```

Optional merge-freeze-wrapped push (pauses writer apps around `git push`):

```bash
MERGE_FREEZE_ON_PUSH=1 npm run push:merge-freeze -- origin main
```

## Notes

- This repository includes both product UI and automation workflows.
- Never commit secrets (`.env`, tokens, credentials).


## Project Structure

This project contains:

- **134** Components
- **1205** Pages
- **0** Utility modules

### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-10T11:27:09.805Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-10T09:00:01.585Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-10T08:59:56.872Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-09T09:00:01.647Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-09T08:59:56.769Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-08T09:00:01.833Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-08T08:59:56.911Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-07T09:00:06.723Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-07T08:59:57.561Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-06T09:00:02.393Z*


### Components

- adaptive-security-intelligence
- adaptive-threat-response-system
- advanced-autonomous-wave
- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-experiment-priority-engine
- autonomous-innovation-agent
- autonomous-innovation-engine
- autonomous-learning-engine
- ... and 124 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-05-06T08:59:56.770Z*


### Components

- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-innovation-engine
- code-auto-fix
- code-evolution-system
- code-reviewer
- content-generator
- deployment-orchestrator
- financial-advisor
- ... and 12 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-04-07T16:12:08.368Z*


### Components

- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-innovation-engine
- code-auto-fix
- code-evolution-system
- code-reviewer
- content-generator
- deployment-orchestrator
- financial-advisor
- ... and 12 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-04-07T05:21:19.641Z*


### Components

- ai-chat-assistant
- autonomous-brain
- autonomous-dashboard
- autonomous-innovation-engine
- code-auto-fix
- code-evolution-system
- code-reviewer
- content-generator
- deployment-orchestrator
- financial-advisor
- ... and 12 more

For detailed component documentation, see the [docs/components](./docs/components) directory.

---

*Last updated: 2026-04-07T00:58:03.321Z*

