// @ts-nocheck
/**
 * LLM Fallback Router
 * Prioritizes cloud LLMs (Anthropic, OpenAI) with automatic fallback to local Ollama
 * when cloud is unavailable or for privacy-sensitive prompts.
 */

import { ollamaChat, ollamaChatStream, ollamaHealthCheck } from '../lib/ollama-provider.cjs';
import { callFreeCloudLLM } from '../lib/free-llm-provider.ts';

export type LLMProvider = 'openai' | 'anthropic' | 'freecloud' | 'ollama' | 'auto';

export interface ChatOptions {
  provider?: LLMProvider;
  model?: string;
  temperature?: number;
  stream?: boolean;
  forceLocal?: boolean; // Force Ollama even if cloud available
}

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

let ollamaHealthy: boolean | null = null;
let lastOllamaCheck = 0;

async function checkOllama(): Promise<boolean> {
  const now = Date.now();
  if (now - lastOllamaCheck < 30_000 && ollamaHealthy !== null) {
    return ollamaHealthy;
  }
  lastOllamaCheck = now;
  try {
    const health = await ollamaHealthCheck();
    ollamaHealthy = health.healthy;
    return ollamaHealthy;
  } catch {
    ollamaHealthy = false;
    return false;
  }
}

/**
 * Smart router: choose provider based on availability, preference, and forced flags
 */
export async function routeChat(
  messages: Array<{ role: string; content: string }>,
  opts: ChatOptions = {}
): Promise<{ content: string; provider: string; model: string }> {
  const { provider = 'auto', forceLocal = false, ...rest } = opts;

  // 1. Explicit provider selection
  if (provider === 'openai') {
    return await callOpenAI(messages, rest);
  }
  if (provider === 'anthropic') {
    return await callAnthropic(messages, rest);
  }
  if (provider === 'freecloud') {
    const { content } = await callFreeCloudLLM(messages, { temperature: rest.temperature, model: rest.model });
    return { content, provider: 'freecloud', model: rest.model || 'auto' };
  }
  if (provider === 'ollama' || forceLocal) {
    const content = await ollamaChat(messages, { ...rest });
    return { content, provider: 'ollama', model: rest.model || 'qwen3:4b' };
  }

  // 2. Auto mode: try cloud first, then free providers, then local
  if (!forceLocal) {
    try {
      const cloudOk = await Promise.race([
        checkCloudAvailability(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ]);
      if (cloudOk) {
        const useAnthropic = process.env.PREFER_ANTHROPIC === 'true';
        return useAnthropic ? await callAnthropic(messages, rest) : await callOpenAI(messages, rest);
      }
    } catch {
      // Cloud failed, continue to free tier
    }
    // Try free cloud LLMs before local Ollama
    try {
      const { content } = await callFreeCloudLLM(messages, { temperature: rest.temperature });
      return { content, provider: 'freecloud', model: 'auto' };
    } catch (e) {
      console.warn('Free cloud providers failed, falling back to Ollama:', e.message);
    }
  }

  // 3. Local fallback
  const localOk = await checkOllama();
  if (!localOk) {
    throw new Error(
      'No LLM providers available. Cloud unreachable and local Ollama model not ready. ' +
        'Run: ollama serve && ollama pull qwen3:4b'
    );
  }
  const content = await ollamaChat(messages, { ...rest });
  return { content, provider: 'ollama', model: rest.model || 'qwen3:4b' };
}

async function checkCloudAvailability(): Promise<boolean> {
  // Lightweight health check via known endpoints without consuming tokens
  // In production, rely on configured API keys validity
  return true; // Assume available — actual call will fail if not
}

async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  opts: ChatOptions
): Promise<{ content: string; provider: string; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || OPENAI_MODEL,
      messages,
      temperature: opts.temperature ?? 0.7,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  return { content, provider: 'openai', model: data.model };
}

async function callAnthropic(
  messages: Array<{ role: string; content: string }>,
  opts: ChatOptions
): Promise<{ content: string; provider: string; model: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  // Transform to Anthropic format
  const systemMsg = messages.find((m) => m.role === 'system');
  const userMsgs = messages.filter((m) => m.role !== 'system');
  const body = {
    model: opts.model || ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: systemMsg?.content,
    messages: userMsgs.map(({ role, content }) => ({ role, content })),
    stream: false,
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.content[0].text;
  return { content, provider: 'anthropic', model: data.model };
}

/**
 * Streamed fallback router
 */
export async function* routeChatStream(
  messages: Array<{ role: string; content: string }>,
  opts: ChatOptions = {}
): AsyncGenerator<{ delta: string; provider: string; model: string }> {
  const { provider = 'auto', forceLocal = false, ...rest } = opts;

  if (provider === 'ollama' || forceLocal) {
    const stream = ollamaChatStream(messages, { ...rest, stream: true });
    for await (const chunk of stream) {
      yield { delta: chunk, provider: 'ollama', model: rest.model || 'qwen3:4b' };
    }
    return;
  }

  // Cloud streaming varies by provider — for now, fall back to non-stream for cloud
  // In future, implement OpenAI/Anthropic stream variants
  const result = await routeChat(messages, { ...opts, stream: false });
  yield { delta: result.content, provider: result.provider, model: result.model };
}
