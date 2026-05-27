# Zion Organizational Memory — AI Agent System

Unified AI system that turns Google Workspace (Gmail, Drive, Calendar) into a searchable, queryable organizational knowledge base.

## 📦 Components

1. **org_memory_agent.py** — Core agent with search, ask, summarize, digest commands
2. **vector_index.py** — Optional vector RAG builder for semantic search (requires `chromadb`)
3. **google_workspace.py** — Shared Google API helpers (OAuth refresh, Gmail/Drive/Calendar)
4. **org_memory_telegram_bot.py** — Optional Telegram bot for slash commands (requires python-telegram-bot)
5. **start_orgmem_bot.sh** — Launch script for the Telegram bot (uses tmux)

## ⚙️ Prerequisites

- **OAuth Tokens**: Must already exist at `/root/.openclaw/workspace/gog_tokens.json` (created by the gog skill)
- **LLM Free Tier API Key**: Add at least one to `zion.app/.env` to enable cloud LLM fallbacks during synthesis:
  - `GROQ_API_KEY` (fastest) — https://console.groq.com
  - `GEMINI_API_KEY` (high quality) — https://aistudio.google.com/apikey
  - Optional: others (`OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, etc.)
- **Python deps**: Currently uses only stdlib + unified llm_client (already in repo). Optional:
  - `pip install chromadb` for vector index
  - `pip install python-telegram-bot` for Telegram bot (already part of OpenClaw for sending, but receiving needs extra)

## 🚀 Quick Start

### 1. Manual Commands (No Bot)

Run the agent directly from shell:

```bash
cd /root/.openclaw/workspace/zion.app

# Search Gmail / indexed emails
python3 commands/org_memory_agent.py search "client proposal" --limit 10

# Ask a question (AI synthesizes answer from email context)
python3 commands/org_memory_agent.py ask "what is our Brazil pricing?"

# Summarize a full email thread
python3 commands/org_memory_agent.py summarize <THREAD_ID>

# Get yesterday's activity digest
python3 commands/org_memory_agent.py digest
```

Output is plain text; can be piped to Telegram via `send_telegram` function inside script or manually.

### 2. Index Emails for Fast Full-Text Search

On first run, the agent will create SQLite FTS database at `zion.app/data/org_memory.db` and index emails on demand (when searching, it falls back to live Gmail). For faster repeated search, you can pre-index:

```bash
# This will populate SQLite FTS with recent emails (Gmail live search)
python3 commands/org_memory_agent.py search "after:2026-05-01" --limit 50  # auto-indexes results
```

Currently, indexing happens per-email during search. To pre-index entire inbox, modify script or run a batch index command (future enhancement).

### 3. Vector RAG (Semantic Search)

If you install `chromadb` and have an embedding provider (Groq/Gemini or Ollama), you can build a semantic vector index:

```bash
# Install dependencies (if pip available)
python3 -m pip install --user chromadb duckdb parquet

# Index last 100 emails + 20 Drive files
python3 commands/vector_index.py index --query "after:2026-05-01" --limit 100 --drive-limit 20

# Semantic search
python3 commands/vector_index.py vsearch "pricing strategy"
```

**Note**: Vector index stored in `zion.app/data/chroma/`. Embeddings use Ollama by default; with API keys you can switch to Groq/Gemini inside `embed_text()`.

### 4. Telegram Bot (Optional)

If you install `python-telegram-bot` and have network access, run:

```bash
# Start bot in detached tmux session (auto-logs)
./zion.app/scripts/start_orgmem_bot.sh start

# View logs
./zion.app/scripts/start_orgmem_bot.sh logs

# Stop
./zion.app/scripts/start_orgmem_bot.sh stop
```

Once running, use Telegram commands:
- `/orgmem search <query>`
- `/orgmem ask <question>`
- `/orgmem summarize <thread_id>`
- `/orgmem digest`

**Note**: The main OpenClaw agent also delivers messages to Telegram; this standalone bot is optional and not required for core memory agent usage.

## 🔧 Configuration

All secrets live in `zion.app/.env` (copied from `.env.example`):

```bash
# At least one of these is needed for AI synthesis during rate limits
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AI...
# Optional others: OPENAI_API_KEY, ANTHROPIC_API_KEY, OPENROUTER_API_KEY, ...

# Telegram credentials (for bot; sending uses built-in gateway credentials)
TELEGRAM_BOT_TOKEN=8716864917:...
TELEGRAM_CHAT_ID=8435383377
```

## 📁 File Structure

```
workspace/
├── zion.app/
│   ├── commands/
│   │   ├── org_memory_agent.py      <-- main CLI agent
│   │   ├── org_memory_telegram_bot.py <-- optional Telegram bot
│   │   ├── vector_index.py          <-- vector RAG builder
│   │   └── google_workspace.py      <-- shared Google API helpers
│   ├── lib/
│   │   ├── llm_client.py            <-- unified LLM fallback client
│   │   └── free-llm-provider.cjs    <-- Node-free-provider list
│   ├── data/
│   │   ├── org_memory.db            <-- SQLite FTS index (auto-created)
│   │   └── chroma/                  <-- vector index dir (optional)
│   ├── .env                         <-- API keys
│   └── .env.example
├── gog_tokens.json                  <-- Google OAuth tokens (auto-generated)
└── HEARTBEAT.md                     <-- OpenClaw heartbeat tasks
```

## 🧠 How It Works

1. **Search** (`cmd_search`) checks SQLite FTS first (if indexed); else does live Gmail search, shows top results.
2. **Ask** (`cmd_ask`) fetches relevant emails, feeds to `llm_client` which routes through OpenAI→Anthropic→FreeCloud→Ollama. Uses whatever is available.
3. **Summarize** (`cmd_summarize`) pulls full email thread, summarizes with LLM.
4. **Digest** (`cmd_digest`) combines recent emails + upcoming calendar.
5. **Telegram Bot** wraps these commands as slash commands and replies in chat.

## 🔮 Roadmap

- [ ] Continuous ingestion: background daemon to index new emails automatically
- [ ] Drive document OCR + chunking for native Google Docs (via export)
- [ ] Automatic daily digest via OpenClaw heartbeat (08:00)
- [ ] Cross-reference calendar events with related email threads
- [ ] Knowledge graph of people, projects, decisions
- [ ] Auto-generated meeting minutes from calendar + email context

## 🆘 Troubleshooting

**ImportError: No module named 'google_workspace'**
→ Ensure `google_workspace.py` is in the same directory as org_memory_agent.py (commands/)

**Rate limit errors**
→ Set `GROQ_API_KEY` or `GEMINI_API_KEY` in `.env`. The free tiers are generous.

**Chromadb import error**
→ Vector search is optional. Skip or install chromadb: `pip install chromadb`

**Telegram bot fails to start**
→ Install python-telegram-bot: `pip install python-telegram-bot`

**OAuth token errors**
→ Run manual authentication via gog skill or delete `gog_tokens.json` and let skill regenerate.

---

**Status**: Core functionality verified live (13 May 2026). LLM fallbacks integrated. Ready for daily use.
