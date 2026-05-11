#!/usr/bin/env node

/**
 * LLM Client — re-exports unified client (Ollama primary, OpenRouter fallback)
 *
 * All automation agents use this module. The unified client tries local
 * Ollama first, then falls back to OpenRouter.
 *
 * Usage:
 *   const { createLLMClient } = require('./lib/openrouter-client.cjs');
 *   const llm = createLLMClient();
 *   const response = await llm.chat('Explain this code...');
 *
 * Env:
 *   OLLAMA_URL       - Ollama base URL (default: http://localhost:11434)
 *   OLLAMA_MODEL     - Model name (default: llama3.2:3b)
 *   OLLAMA_ENABLED   - Set to 'false' to skip Ollama, use OpenRouter only
 *   OPENROUTER_API_KEY - Fallback when Ollama unavailable
 */

const {
  LLMClient,
  createLLMClient,
  OPENROUTER_MODELS,
  OLLAMA_DEFAULT_MODEL,
  OLLAMA_DEFAULT_URL,
} = require('./llm-client.cjs');

module.exports = {
  OpenRouterClient: LLMClient,
  createLLMClient,
  OPENROUTER_MODELS,
  OLLAMA_DEFAULT_MODEL,
  OLLAMA_DEFAULT_URL,
};
