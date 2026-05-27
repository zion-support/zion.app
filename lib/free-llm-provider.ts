// @ts-nocheck

/**
 * Free LLM Providers Module (CommonJS for Next.js)
 * Unified interface to multiple free LLM APIs.
 *
 * Provider order (best free → last free):
 *   Groq → Gemini → HuggingFace → Cerebras → Cloudflare → DeepSeek
 *   → Mistral → Together → Cohere → OpenRouter
 *
 * All calls are non-streaming. Integrate into llm-fallback-router.ts
 * by calling `callFreeCloudLLM(messages, opts)`.
 */

import { ollamaHealthCheck } from './ollama-provider.cjs';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_HUB_TOKEN;
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || 'llama-3.3-70b';
const CLOUDFLARE_MODEL = process.env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.3-70b-instruct';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const TOGETHER_MODEL = process.env.TOGETHER_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1';
const COHERE_MODEL = process.env.COHERE_MODEL || 'command-r-plus';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/quasar-alpha';

/**
 * Try all free providers in order until one succeeds.
 */
export async function callFreeCloudLLM(
  messages,
  opts = { temperature: 0.7, model: undefined }
) {
  const providers = [
    () => callGroq(messages, opts),
    () => callGemini(messages, opts),
    () => callHuggingFace(messages, opts),
    () => callCerebras(messages, opts),
    () => callCloudflare(messages, opts),
    () => callDeepSeek(messages, opts),
    () => callMistral(messages, opts),
    () => callTogether(messages, opts),
    () => callCohere(messages, opts),
    () => callOpenRouter(messages, opts),
  ];

  for (const p of providers) {
    try {
      return await p();
    } catch (err) {
      console.warn(`Free LLM provider failed: ${err.message}`);
    }
  }
  throw new Error('All free LLM providers failed. Configure at least one API key.');
}

// ── Groq ──
async function callGroq(messages, opts) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');
  const model = opts.model || GROQ_MODEL;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: 1024,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.choices[0].message.content, provider: 'groq', model };
}

// ── Gemini ──
async function callGemini(messages, opts) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const model = opts.model || GEMINI_MODEL;
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const systemInstruction = messages.find(m => m.role === 'system');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const body = { contents };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction.content }] };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { content: text, provider: 'gemini', model };
}

// ── HuggingFace ──
async function callHuggingFace(messages, opts) {
  if (!HUGGINGFACE_TOKEN) throw new Error('HUGGINGFACE_TOKEN not set');
  const model = opts.model || HUGGINGFACE_MODEL;
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt, parameters: { temperature: opts.temperature ?? 0.7 } }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`HF ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = typeof data === 'string' ? data : (data[0]?.generated_text || '');
  return { content: text, provider: 'huggingface', model };
}

// ── Cerebras ──
async function callCerebras(messages, opts) {
  if (!CEREBRAS_API_KEY) throw new Error('CEREBRAS_API_KEY not set');
  const model = opts.model || CEREBRAS_MODEL;
  const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.7 }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Cerebras ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.choices[0].message.content, provider: 'cerebras', model };
}

// ── Cloudflare Workers AI ──
async function callCloudflare(messages, opts) {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN not set');
  }
  const model = opts.model || CLOUDFLARE_MODEL;
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(20000),
    }
  );
  if (!res.ok) throw new Error(`Cloudflare ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.result?.response || '';
  return { content: text, provider: 'cloudflare', model };
}

// ── DeepSeek ──
async function callDeepSeek(messages, opts) {
  if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY not set');
  const model = opts.model || DEEPSEEK_MODEL;
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.7 }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.choices[0].message.content, provider: 'deepseek', model };
}

// ── Mistral ──
async function callMistral(messages, opts) {
  if (!MISTRAL_API_KEY) throw new Error('MISTRAL_API_KEY not set');
  const model = opts.model || MISTRAL_MODEL;
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.7 }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Mistral ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.choices[0].message.content, provider: 'mistral', model };
}

// ── Together ──
async function callTogether(messages, opts) {
  if (!TOGETHER_API_KEY) throw new Error('TOGETHER_API_KEY not set');
  const model = opts.model || TOGETHER_MODEL;
  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.7 }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Together ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.choices[0].message.content, provider: 'together', model };
}

// ── Cohere ──
async function callCohere(messages, opts) {
  if (!COHERE_API_KEY) throw new Error('COHERE_API_KEY not set');
  const model = opts.model || COHERE_MODEL;
  const last_msg = messages[messages.length - 1]?.content || '';
  const chat_history = messages.slice(0, -1).map(m => ({
    role: m.role,
    message: m.content,
  }));
  const res = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, message: last_msg, chat_history }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Cohere ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { content: data.text, provider: 'cohere', model };
}

// ── OpenRouter ──
async function callOpenRouter(messages, opts) {
  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not set');
  const model = opts.model || OPENROUTER_MODEL;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://ziontechgroup.com',
      'X-Title': 'Zion App',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.7 }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'openrouter',
    model: data.model || model,
  };
}

/**
 * Health check — returns list of configured (key present) free providers.
 */
export async function checkFreeProviders(): Promise<string[]> {
  const available: string[] = [];
  const testMessages = [{ role: 'user', content: 'test' }];
  const checks = [
    { name: 'groq', fn: () => callGroq(testMessages, {}) },
    { name: 'gemini', fn: () => callGemini(testMessages, {}) },
    { name: 'huggingface', fn: () => callHuggingFace(testMessages, {}) },
    { name: 'cerebras', fn: () => callCerebras(testMessages, {}) },
    { name: 'cloudflare', fn: () => callCloudflare(testMessages, {}) },
    { name: 'deepseek', fn: () => callDeepSeek(testMessages, {}) },
    { name: 'mistral', fn: () => callMistral(testMessages, {}) },
    { name: 'together', fn: () => callTogether(testMessages, {}) },
    { name: 'cohere', fn: () => callCohere(testMessages, {}) },
    { name: 'openrouter', fn: () => callOpenRouter(testMessages, {}) },
  ];
  for (const c of checks) {
    try {
      await c.fn();
      available.push(c.name);
    } catch {
      // skip
    }
  }
  return available;
}
