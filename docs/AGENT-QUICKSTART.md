# Agent quickstart (local)

Minimal path for humans and agents working on this repo. Full context: **`AGENTS.md`**, **`SOUL.md`**, **`USER.md`**.

```bash
npm ci
npm run dev
```

Quality gates (run before pushing to `main`):

```bash
npm run lint:check
npm run type-check
npm run test:ci
npm run build
```

Strict site-improvement loop (from `README.md`):

```bash
npm run app:site-improve-strict
```

**Never commit** `.env`, tokens, or credentials. Standing owner permission for autonomous work is documented in **`USER.md`** (Standing mandate).
