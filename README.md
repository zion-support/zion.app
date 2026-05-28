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

LLM-powered automations use a **multi-provider chain** with automatic fallback:

1. **Cloud LLMs** (fast, high quality): OpenAI GPT-4.1, Anthropic Claude, Groq (Llama 4), Google Gemini, etc. Configure via env vars:
   - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `HUGGINGFACE_HUB_TOKEN`, `CEREBRAS_API_KEY`, `CLOUDFLARE_ACCOUNT_ID+CLOUDFLARE_API_TOKEN`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `TOGETHER_API_KEY`, `COHERE_API_KEY`, `OPENROUTER_API_KEY`
   - See `docs/FREE-AI-TOOLS.md` for free-tier options.

2. **Local Ollama** (private, free, always-on fallback) — automatically used when cloud is unavailable:
   - Default model: **Qwen3-4B** (~2.5GB, strong reasoning for its size). Equivalent reasoning class to 27B MoE models, optimized for local deployment.
   - Start: `ollama serve` — runs at `http://localhost:11434`
   - Pull: `ollama pull qwen3:4b` (or larger if GPU/RAM allows: `qwen3:14b`, `qwen3:32b`, `qwen3:30b-a3b`)
   - Env: `OLLAMA_BASE_URL` (default `http://localhost:11434`), `OLLAMA_MODEL` (default `qwen3:4b`)
   - Unified chat API exposed at `/api/llm/chat` — cloud LLMs or Ollama depending on availability.

### LLM router
- `lib/llm-fallback-router.cjs` — chooses provider automatically (`auto`), or force specific provider (`openai`, `anthropic`, `ollama`).
- API route: `app/api/llm/chat/route.ts` — unified chat endpoint for frontend and automations.
- Ollama provider: `lib/ollama-provider.cjs` — handles Qwen3 thinking mode (`/think`), streaming, health checks.

---

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

- **22** Components
- **1067** Pages
- **0** Utility modules

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

