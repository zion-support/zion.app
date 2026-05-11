# AI Advanced-AI Content Engine

Focused automation for high-value **advanced AI solutions** content across the Zion Tech Group site.

This engine sits on top of the existing content pipelines and uses the shared multi-provider LLM client to:

- Continuously generate **new deep-dive blog posts** about advanced AI solutions.
- Periodically **refresh key `/ai-services/*` and `/solutions/*` pages** with richer, more concrete copy.
- Run safely inside existing pipelines and GitHub Actions with lint/type-check guardrails.

---

## Files & Entry Points

- `automation/config/advanced-ai-topics.json`  
  Structured configuration describing:
  - Topic ids, titles, priorities, and audiences.
  - Primary `/ai-services/*` route and related `/solutions/*` routes.
  - Preferred blog categories and example advanced-AI blog slugs.
  - Engine defaults (per-run limits, new vs refresh weights, minimum days between refresh).

- `automation/ai-advanced-ai-content-orchestrator.cjs`  
  Orchestrator that:
  - Loads `advanced-ai-topics.json`.
  - Selects a small batch of **new blog topics** (critical/high first, then medium/low).
  - Writes `automation/reports/advanced-ai-blog-topics-latest.json` with a `blogTopics` array.
  - Calls `automation/openrouter-content-generator.cjs` using the `TOPICS_JSON` env var so that only these topics are generated.
  - Invokes `automation/ai-advanced-ai-page-refresh-agent.cjs` to refresh key pages.

- `automation/ai-advanced-ai-page-refresh-agent.cjs`  
  Refresh agent that:
  - Reads `advanced-ai-topics.json` and builds a list of target TSX files for:
    - `targetRoutes.primaryService` (e.g. `/ai-services/ai-agents-autonomous/`),
    - `targetRoutes.solutionRoutes` (e.g. `/solutions/financial-services/`).
  - Selects a handful of pages per run, biased by priority.
  - Uses `automation/lib/llm-client.cjs` to:
    - Improve **only textual content** (headings, paragraphs, bullets),
    - Preserve imports, exports, component name, and overall JSX/layout.
  - Writes a structured log to `automation/reports/advanced-ai-refresh-log.json`.

- `automation/ai-content-maximum-pipeline.cjs` (updated)  
  Now includes:
  - **Phase 0**: `ai-advanced-ai-content-orchestrator.cjs` (can be skipped with `SKIP_ADVANCED_AI=1`).
  - **Phase 1**: existing ideation pipeline (content/audit/evolution ideas).
  - **Phase 2**: existing blog + front page + product + services steps.
  - If `AUTO_COMMIT=1`:
    - Runs `npm run lint:check` and `npm run type-check` before committing.
    - On failure, skips commit and appends an entry to `automation/reports/advanced-ai-content-failures.json`.

- `.github/workflows/ai-advanced-ai-content.yml`  
  Dedicated workflow that:
  - Runs **three times per day** and on manual dispatch.
  - Installs dependencies and executes:
    - `node automation/ai-content-maximum-pipeline.cjs` with:
      - `AUTO_COMMIT=1`, `TRIGGER_DEPLOY=1`,
      - `SKIP_ADVANCED_AI` left empty so the advanced-AI orchestrator is enabled.
  - Relies on:
    - `OPENROUTER_API_KEY` (and `OPENROUTER_MODEL`) for LLM access,
    - `NETLIFY_BUILD_HOOK` for triggering production deploys.

---

## How It Works (Flow)

1. **Topic Selection**
   - `advanced-ai-topics.json` defines the highest-priority advanced-AI themes (agents, RAG, multimodal, edge, orchestration, governance, observability, security, regulated industries, foundation models).
   - Each topic knows:
     - Where it lives in the app (`/ai-services/*`, `/solutions/*`),
     - What kind of pages to focus on (deep-dive blog, architecture playbook, case study, FAQ).

2. **New Content (Blog)**
   - Orchestrator selects up to `defaults.maxPerRun.newBlog` topics without existing blogs.
   - It builds a `blogTopics` payload with strong prompts:
     - Emphasizing **Problem Context**, **Architecture Overview**, **Implementation Patterns**, **Risk & Compliance**, **KPIs**, and **Example Workflows**.
   - The payload is written to `automation/reports/advanced-ai-blog-topics-latest.json`.
   - `openrouter-content-generator.cjs` reads this via `TOPICS_JSON` and:
     - Creates new `app/blog/<slug>/page.tsx` pages,
     - Updates the blog index (`app/blog/page.tsx`) and `BLOG_SLUGS` (`app/lib/blog-data.ts`),
     - Logs runs into `automation/data/openrouter-generated-content.json`.

3. **Existing Page Refresh**
   - Refresh agent selects a few key TSX pages per run based on:
     - Primary advanced-AI services routes,
     - Related industry/solution routes.
   - For each page, it:
     - Sends the current file to the LLM with instructions to **only** improve copy while preserving imports and layout,
     - Overwrites the file on success,
     - Logs the outcome (updated/error) to `advanced-ai-refresh-log.json`.

- `automation/ai-advanced-ai-ideas-agent.cjs`  
  Ideas engine that:
  - Reads current advanced-AI topics and recent generated blog history.
  - Asks the LLM for **new advanced-AI topics** (titles, audiences, angles).
  - Appends them to `automation/reports/advanced-ai-ideas-log.json` without changing config.
  - Feeds a growing backlog of ideas that the orchestrator can draw from over time.

4. **Pipeline & CI Integration**
   - `ai-content-maximum-pipeline.cjs` runs the advanced-AI orchestrator **before** the existing ideation + generic content steps.
   - When `AUTO_COMMIT=1`:
     - Lint and type-check must pass before git commit/push.
     - On failure, the pipeline skips commit and writes a structured failure entry.
   - `.github/workflows/ai-advanced-ai-content.yml` wires everything to:
     - Run multiple times per day,
     - Auto-commit to `main`,
     - Trigger Netlify deploys.

---

## Configuration & Environment

Required / recommended environment variables:

- **LLM & Providers** (via `automation/lib/llm-client.cjs`):
  - `OPENROUTER_API_KEY` (fallback provider),
  - Optional: `GROQ_API_KEY`, `GEMINI_API_KEY`, `HUGGINGFACE_HUB_TOKEN`, `CEREBRAS_API_KEY`,
    `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`,
    `TOGETHER_API_KEY`, `COHERE_API_KEY`, `FIREWORKS_API_KEY`, `OLLAMA_URL`.

- **Deployment**:
  - `NETLIFY_BUILD_HOOK` (Netlify build hook URL).

- **Pipeline knobs** (optional):
  - `ADVANCED_AI_MAX_CONCURRENCY` – limit concurrent LLM calls for blog generation (default: 3).
  - `SKIP_ADVANCED_AI=1` – disable advanced-AI orchestrator inside maximum pipeline if needed.

---

## Extending the Engine

- **Add a new advanced-AI topic**
  1. Edit `automation/config/advanced-ai-topics.json`.
  2. Add a new `"topics"` entry with:
     - `id`, `title`, `priority`, `audience`, `summary`,
     - `targetRoutes` (primary service + related solutions),
     - Optional `blog.preferredCategories` and `blog.suggestedSlugs`.
  3. Commit the change – future runs will automatically consider it for new posts and refreshes.

- **Adjust cadence or volume**
  - Change cron expressions in `.github/workflows/ai-advanced-ai-content.yml`.
  - Tweak `defaults.maxPerRun.newBlog` / `defaults.maxPerRun.refreshPages` in `advanced-ai-topics.json`.

- **Debugging & Observability**
  - Check:
    - `automation/logs/openrouter-generator.log` for blog generation,
    - `automation/reports/advanced-ai-blog-topics-latest.json` for the last topic batch,
    - `automation/reports/advanced-ai-refresh-log.json` for page refresh runs,
    - `automation/reports/advanced-ai-content-failures.json` when quality checks block commits.

This engine is designed to be **safe, incremental, and autonomous**, continuously pushing Zion’s positioning on advanced AI solutions forward while protecting build quality and deployment reliability.

