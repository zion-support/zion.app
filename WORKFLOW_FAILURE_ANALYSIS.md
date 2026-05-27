# Workflow Failure Root Cause Analysis

## Date: 2026-03-22

## Findings

### 1. Missing API Keys (PRIMARY CAUSE)

The `ai-app-improvement-on-push.yml` workflow only passes:
```yaml
token: ${{ secrets.GITHUB_TOKEN }}
```

But the daily quick pipeline (`ai-app-improvement-daily-quick-pipeline.cjs`) runs AI agents that require:
- `OPENROUTER_API_KEY` - For LLM-powered improvements
- `GROQ_API_KEY` - Alternative LLM
- `GEMINI_API_KEY` - Google AI

**Without these, the AI agents fail silently or error out.**

### 2. Build Memory (FIXED)
- Already fixed with `NODE_OPTIONS='--max-old-space-size=4096'`

### 3. All Smoke/Monitoring Workflows Share This Issue
These all fail because they depend on the same pipeline:
- ai-production-smoke-scheduled
- ai-netlify-preview-smoke-scheduled
- ai-aggregate-regression-alert
- ai-automation-fingerprint-digest-*
- ai-openclaw-runtime-applier

## Solution

Add these secrets to GitHub repository:
1. `OPENROUTER_API_KEY` - Get from https://openrouter.ai
2. `GROQ_API_KEY` - Get from https://console.groq.com
3. `GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikey
4. `NETLIFY_BUILD_HOOK` - Get from Netlify site settings

Then update the workflow to pass them:

```yaml
- name: Run app improvement daily quick pipeline
  env:
    OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    AUTO_COMMIT: ${{ (github.event_name == 'push' || github.event.inputs.auto_commit != 'false') && '1' || '' }}
  run: node automation/ai-app-improvement-daily-quick-pipeline.cjs
```

## Workflows OK
- ci-cd.yml ✅ (just needs build memory - fixed)
- Basic smoke tests work when run locally

## Recommendations

1. **Add missing secrets** to GitHub repo (Settings → Secrets)
2. **Update workflows** to pass the secrets to scripts that need them
3. Test with `workflow_dispatch` after adding secrets
