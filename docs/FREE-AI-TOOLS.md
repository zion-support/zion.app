# Free AI Tools — Zion Tech Group

The project uses a **multi-provider LLM chain** with advanced free AI tools. Providers are tried in order; the first successful response is used.

## Most advanced free options (2025)

| Use case | Best free option | Env / note |
|----------|------------------|------------|
| **Fastest LLM** | Groq (Llama 3.3 70B) | `GROQ_MODEL=llama-3.3-70b-versatile` |
| **Latest Flash** | Google Gemini 2.5 Flash | `GEMINI_MODEL=gemini-2.5-flash` or `gemini-2.5-flash-preview-*` |
| **Reasoning** | DeepSeek R1 | `DEEPSEEK_MODEL=deepseek-reasoner` |
| **Largest free** | Cerebras Qwen 3 235B | `CEREBRAS_MODEL=qwen-3-235b-a22b-instruct-2507` (within 1M tok/day) |
| **Embeddings** | Gemini (primary) or Hugging Face (fallback) | `GEMINI_API_KEY` or `HUGGINGFACE_HUB_TOKEN` |
| **Voice (no key)** | Web Speech API | Built into AI Chat Widget (mic + TTS) |
| **Images** | Pollinations.ai or Replicate FLUX | `POLLINATIONS_API_KEY` or `REPLICATE_API_TOKEN` |

## Provider Chain

| Order | Provider | Free Tier | Setup |
|-------|----------|----------|-------|
| 1 | **Ollama** | Unlimited (local) | `npm run llm:install` |
| 2 | **Groq** | Free tier, ultra-fast (Llama 3.3 70B optional) | [console.groq.com](https://console.groq.com) → API Keys |
| 3 | **Google Gemini** | 1.5k req/day (2.5 Flash optional) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| 4 | **Hugging Face** | 300 req/hr, 100k+ models | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| 5 | **Cerebras** | 1M tokens/day (Llama 3.1 8B, Qwen 3 235B) | [cloud.cerebras.ai](https://cloud.cerebras.ai) |
| 6 | **Cloudflare Workers AI** | 10k Neurons/day | [dash.cloudflare.com](https://dash.cloudflare.com) → Workers AI |
| 7 | **DeepSeek** | 5M tokens free (DeepSeek-V3, R1) | [platform.deepseek.com](https://platform.deepseek.com) |
| 8 | **Mistral AI** | Free tier (1 req/sec, 1B tokens/month) | [console.mistral.ai](https://console.mistral.ai) |
| 9 | **Together AI** | Free research models (Apriel 15B) | [together.ai](https://together.ai) |
| 10 | **Fireworks AI** | Free trial (10 RPM, 100+ models) | [fireworks.ai](https://fireworks.ai) |
| 11 | **Cohere** | 1k req/month trial | [dashboard.cohere.com](https://dashboard.cohere.com) |
| 12 | **OpenRouter** | Free models available | [openrouter.ai](https://openrouter.ai) |

## Free Embeddings (Gemini primary, Hugging Face fallback)

**Google AI Studio (Gemini)** — 1,500 embedding requests/day free. Primary provider.

**Hugging Face Inference** — 300 req/hr free. Same token as LLM (`HUGGINGFACE_HUB_TOKEN`). Used when Gemini is unavailable or fails.

- **Usage**: `automation/lib/embedding-client.cjs` — `embed(text)`, `embedBatch(texts)`
- **Setup**: Add `GEMINI_API_KEY` and/or `HUGGINGFACE_HUB_TOKEN` to `.env`
- **Test**: `npm run embedding:test`
- **Models**: Gemini `text-embedding-004` (default), HF `sentence-transformers/all-MiniLM-L6-v2` (default)

## Voice & Speech (Web Speech API)

**Browser-native** — Free, no API key. Works in Chrome, Edge, Safari.

- **Voice input**: Click mic in AI Chat Widget to speak your question (speech-to-text)
- **Text-to-speech**: Toggle speaker icon to have AI read replies aloud
- **Supported**: Chrome, Edge, Safari (not Firefox)

## Free Image Generation

### Pollinations.ai

**Pollinations.ai** — Free AI image generation. Get a free API key at [enter.pollinations.ai](https://enter.pollinations.ai) (no credit card).

- **Usage**: `automation/lib/image-gen-client.cjs` — `generateImage(prompt)`, `getImageUrl(prompt)`
- **Setup**: Add `POLLINATIONS_API_KEY` to `.env` (free key from enter.pollinations.ai)
- **Test**: `npm run image:generate "your prompt"` — saves `out-pollinations-test.png`
- **Models**: flux (default), gpt-image-large, seedream, kontext

### Replicate (FLUX, Imagen, Ideogram)

**Replicate** — Free tier with FLUX, Imagen-4, Ideogram v3. Sign up at [replicate.com](https://replicate.com).

- **Usage**: `automation/lib/replicate-image-client.cjs` — `generateImage(prompt)`, `getImageUrl(prompt)`
- **Setup**: Add `REPLICATE_API_TOKEN` to `.env` (free at replicate.com)
- **Test**: `npm run image:replicate "your prompt"` — saves `out-replicate-test.png`
- **Models**: flux-schnell (default), flux-dev, flux-1.1-pro

## Quick Setup

### 1. Ollama (Local, No Key)

```bash
npm run llm:install
# Then: ollama serve (or it auto-starts)
```

### 2. Groq (Free, Fast)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. Add to `.env`: `GROQ_API_KEY=gsk_...`

### 3. Google Gemini (Free)

1. Get key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Add to `.env`: `GEMINI_API_KEY=...`
3. Optional: `GEMINI_MODEL=gemini-2.5-flash-preview-09-2025` for latest model

### 4. Hugging Face Inference (300 req/hr free)

1. Create token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) with "Inference Providers" permission
2. Add to `.env`: `HUGGINGFACE_HUB_TOKEN=hf_...`
3. Optional: `HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct` (default)

### 5. Cerebras (1M tokens/day free)

1. Sign up at [cloud.cerebras.ai](https://cloud.cerebras.ai)
2. Create an API key (instant access, no waitlist)
3. Add to `.env`: `CEREBRAS_API_KEY=...`
4. Optional: `CEREBRAS_MODEL=llama3.1-8b` (default) or `gpt-oss-120b` for larger model

### 6. Cloudflare Workers AI (10k Neurons/day)

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to Workers AI → copy Account ID
3. Create API token with Workers AI Read + Edit
4. Add to `.env`: `CLOUDFLARE_ACCOUNT_ID=...`, `CLOUDFLARE_API_TOKEN=...`

### 7. DeepSeek (5M tokens free)

1. Sign up at [platform.deepseek.com](https://platform.deepseek.com)
2. Create an API key (5M tokens free on signup)
3. Add to `.env`: `DEEPSEEK_API_KEY=...`
4. Optional: `DEEPSEEK_MODEL=deepseek-chat` (default) or `deepseek-reasoner` for reasoning mode

### 8. Mistral AI (Free tier: 1 req/sec, 1B tokens/month)

1. Sign up at [console.mistral.ai](https://console.mistral.ai)
2. Create an API key
3. Add to `.env`: `MISTRAL_API_KEY=...`
4. Optional: `MISTRAL_MODEL=mistral-small-latest` (default)

### 9. Together AI (Free research models)

1. Sign up at [together.ai](https://together.ai)
2. Create an API key
3. Add to `.env`: `TOGETHER_API_KEY=...`
4. Optional: `TOGETHER_MODEL=servicenow/apriel-1.5-15b-thinker` (default)

### 10. Fireworks AI (free trial: 10 RPM)

1. Sign up at [fireworks.ai](https://fireworks.ai)
2. Create an API key (free credits on signup)
3. Add to `.env`: `FIREWORKS_API_KEY=...`
4. Optional: `FIREWORKS_MODEL=accounts/fireworks/models/llama-v3p1-8b-instruct` (default)

### 11. Cohere (1k req/month trial)

1. Sign up at [dashboard.cohere.com](https://dashboard.cohere.com)
2. Create a trial API key
3. Add to `.env`: `COHERE_API_KEY=...`

### 12. OpenRouter (Fallback)

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Add to `.env`: `OPENROUTER_API_KEY=sk-or-v1-...`

## Netlify / AI Chat Widget

For the production chat widget, add at least one cloud key to Netlify env vars:

- **Site settings** → **Environment variables**
- Add: `GROQ_API_KEY`, `GEMINI_API_KEY`, `HUGGINGFACE_HUB_TOKEN`, `CEREBRAS_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`+`CLOUDFLARE_API_TOKEN`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `COHERE_API_KEY`, or `OPENROUTER_API_KEY`

The chat works without any key (rule-based fallback for common questions), but LLM responses require at least one configured provider.

## Automation Agents

All automation agents (`ai-*-agent.cjs`, pipelines) use the same `automation/lib/llm-client.cjs`. They automatically benefit from Groq, Gemini, Hugging Face, Cerebras, DeepSeek, Mistral, Together, and other providers when configured.

### Optional model upgrades (and defaults)

- **Groq**: Uses `llama-3.3-70b-versatile` by default when `GROQ_API_KEY` is set. Override with `GROQ_MODEL=llama-3.3-70b-specdec` (~1.6k tok/s) or another Groq model if you prefer.
- **Gemini**: Uses `gemini-2.5-flash` by default when `GEMINI_API_KEY` is set. Override with `GEMINI_MODEL=gemini-2.5-flash-preview-09-2025` or another Gemini model for experimentation.
- **Cerebras**: Uses `qwen-3-235b-a22b-instruct-2507` by default when `CEREBRAS_API_KEY` is set (within 1M tokens/day). Override with `CEREBRAS_MODEL=gpt-oss-120b` or another Cerebras model if needed.
- **DeepSeek**: Uses `deepseek-reasoner` by default when `DEEPSEEK_API_KEY` is set for chain-of-thought reasoning. Override with `DEEPSEEK_MODEL=deepseek-chat` or another model for cheaper/faster runs.

## Testing

```bash
npm run llm:test
```

This tests the first available provider. To force a specific provider, set others to empty or disable Ollama with `OLLAMA_ENABLED=false`.
