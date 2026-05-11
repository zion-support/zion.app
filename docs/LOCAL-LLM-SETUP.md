# Local LLM Setup (Ollama) — Primary Option

Automation agents use **local free LLMs (Ollama) as primary**, with OpenRouter as fallback when Ollama is unavailable.

## Quick Start

```bash
# Install Ollama and pull default model
npm run llm:install

# Or manually:
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &
ollama pull llama3.2:3b

# Test
npm run llm:test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_URL` | `http://localhost:11434` | Ollama API base URL |
| `OLLAMA_MODEL` | `llama3.2:3b` | Model name |
| `OLLAMA_ENABLED` | `true` | Set to `false` to skip Ollama and use OpenRouter only |

## Fallback to OpenRouter

When Ollama is not running or fails, the client automatically falls back to OpenRouter:

- Set `OPENROUTER_API_KEY` in `.env` for fallback
- Use `OLLAMA_ENABLED=false` to force OpenRouter (e.g. in CI/GitHub Actions)

## GitHub Actions

GitHub Actions runners do not have Ollama. Workflows use `.env` with `OPENROUTER_API_KEY` — the client falls back to OpenRouter when Ollama is unavailable.

## Other Models

```bash
ollama pull llama3.2:1b    # Smaller, faster
ollama pull llama3.1:8b   # Larger, better quality
ollama pull mistral       # Alternative
```

Then set `OLLAMA_MODEL=llama3.1:8b` (or your model) in `.env`.
