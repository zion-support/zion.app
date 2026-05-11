#!/usr/bin/env node

/**
 * Unified LLM Client — Multi-provider with advanced free AI fallbacks
 *
 * Provider chain (first available):
 *   1. Ollama (local, free) — primary
 *   2. Groq (free tier, ultra-fast; Llama 3.3 70B optional)
 *   3. Google Gemini (free tier, 1.5k req/day; 2.5 Flash optional)
 *   4. Hugging Face Inference (300 req/hr free, 100k+ models)
 *   5. Cerebras (1M tokens/day free; Llama 3.1 8B, Qwen 3 235B)
 *   6. Cloudflare Workers AI (10k Neurons/day free)
 *   7. DeepSeek (5M tokens free; DeepSeek-V3, R1)
 *   8. Mistral AI (free tier: 1 req/sec, 1B tokens/month)
 *   9. Together AI (free research models: Apriel 15B)
 *  10. Cohere (1k req/month free trial)
 *  11. OpenRouter (fallback)
 *
 * Usage:
 *   const { createLLMClient } = require('./lib/llm-client.cjs');
 *   const llm = createLLMClient();
 *   const response = await llm.chat('Explain this code...');
 *
 * Env:
 *   OLLAMA_URL              - Ollama base URL (default: http://localhost:11434)
 *   OLLAMA_MODEL            - Model name (default: llama3.2:3b)
 *   OLLAMA_ENABLED          - Set to 'false' to skip Ollama
 *   GROQ_API_KEY            - Free tier: console.groq.com
 *   GEMINI_API_KEY          - Free tier: aistudio.google.com/apikey
 *   CLOUDFLARE_ACCOUNT_ID   - Workers AI: dash.cloudflare.com
 *   CLOUDFLARE_API_TOKEN    - Workers AI token (Workers AI Read+Edit)
 *   COHERE_API_KEY          - Free trial: dashboard.cohere.com
 *   OPENROUTER_API_KEY      - Fallback when others unavailable
 *   HUGGINGFACE_HUB_TOKEN   - HF Inference: huggingface.co/settings/tokens
 *   CEREBRAS_API_KEY        - 1M tokens/day free: cloud.cerebras.ai
 *   DEEPSEEK_API_KEY        - 5M tokens free: platform.deepseek.com
 *   MISTRAL_API_KEY         - Free tier: console.mistral.ai
 *   TOGETHER_API_KEY        - Free research models: together.ai
 *   FIREWORKS_API_KEY       - Free trial: fireworks.ai (10 RPM)
 *   GROQ_MODEL              - Optional: llama-3.3-70b-versatile, llama-3.3-70b-specdec (default: llama-3.1-8b-instant)
 *   GEMINI_MODEL            - Optional: gemini-2.5-flash-preview-05-20 (default: gemini-2.0-flash)
 *   CEREBRAS_MODEL          - Optional: llama3.1-8b (default)
 *   DEEPSEEK_MODEL          - Optional: deepseek-chat (default)
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const https = require('https');
const http = require('http');
const { URL } = require('url');

const OLLAMA_DEFAULT_URL = 'http://localhost:11434';
const OLLAMA_DEFAULT_MODEL = 'llama3.2:3b';
const OPENROUTER_MODELS = {
  free: 'meta-llama/llama-3.2-3b-instruct:free',
  'openrouter/free': 'meta-llama/llama-3.2-3b-instruct:free',
  fast: 'openrouter/auto',
  default: 'meta-llama/llama-3.2-3b-instruct:free',
  // Additional free fallback models (rate limit resistant)
  fallback: [
    'meta-llama/llama-3.2-1b-instruct:free',
    'qwen/qwen3-1.8b:free',
    'google/gemma-3-1b-it:free',
    'deepseek/deepseek-chat:free',
    'anthropic/claude-3-haiku-20240307:free',
  ],
  // For rate-limit scenarios - pick from fallback pool
  getFallbackModel: function(index = 0) {
    return this.fallback[index % this.fallback.length];
  },
};

function parseOllamaUrl(urlStr) {
  const u = new URL(urlStr || OLLAMA_DEFAULT_URL);
  return {
    protocol: u.protocol === 'https:' ? https : http,
    hostname: u.hostname,
    port: u.port || (u.protocol === 'https:' ? 443 : 80),
    path: u.pathname.replace(/\/$/, '') || '',
  };
}

async function ollamaRequest(baseUrl, path, body, timeout = 60000) {
  const base = parseOllamaUrl(baseUrl);
  const fullPath = `${base.path}${path}`;
  const data = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: base.hostname,
      port: base.port || (base.protocol === https ? 443 : 11434),
      path: fullPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout,
    };

    const req = base.protocol.request(options, (res) => {
      let buf = '';
      res.on('data', (chunk) => (buf += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          try {
            const err = JSON.parse(buf);
            reject(new Error(`Ollama HTTP ${res.statusCode}: ${err.error || buf.slice(0, 200)}`));
          } catch {
            reject(new Error(`Ollama HTTP ${res.statusCode}: ${buf.slice(0, 200)}`));
          }
          return;
        }
        resolve(buf);
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Ollama request timed out'));
    });
    req.write(data);
    req.end();
  });
}

async function openrouterRequest(apiKey, model, messages, options, siteUrl, appName) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || OPENROUTER_MODELS.default,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const data = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl || 'https://ziontechgroup.com',
        'X-Title': appName || 'Zion Tech Group Automation',
      },
      timeout: options.timeout || 60000,
    };

    const req = https.request(reqOptions, (res) => {
      let buf = '';
      res.on('data', (chunk) => (buf += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          try {
            const err = JSON.parse(buf);
            reject(new Error(`OpenRouter HTTP ${res.statusCode}: ${err.error?.message || buf.slice(0, 200)}`));
          } catch {
            reject(new Error(`OpenRouter HTTP ${res.statusCode}: ${buf.slice(0, 200)}`));
          }
          return;
        }
        resolve(buf);
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('OpenRouter request timed out'));
    });
    req.write(data);
    req.end();
  });
}

function parseOpenRouterResponse(body) {
  const response = JSON.parse(body);
  if (response.error) {
    const msg = typeof response.error === 'string' ? response.error : (response.error?.message || JSON.stringify(response.error));
    throw new Error(`OpenRouter error: ${msg}`);
  }
  if (response.choices?.[0]?.message?.content) {
    return {
      content: response.choices[0].message.content,
      usage: response.usage,
      model: response.model,
    };
  }
  throw new Error('Invalid OpenRouter response format');
}

// Groq — free tier, ultra-fast (OpenAI-compatible API)
// Models: llama-3.3-70b-versatile (default), llama-3.3-70b-specdec (~1.6k tok/s)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_DEFAULT_MODEL = 'llama-3.3-70b-versatile';

async function groqRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || GROQ_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Groq HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Groq response format');
}

// Google Gemini — free tier (1.5k req/day; 2.5 Flash default)
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

function messagesToGeminiFormat(messages) {
  const systemParts = [];
  const contents = [];
  for (const m of messages) {
    if (m.role === 'system') {
      systemParts.push(m.content);
    } else {
      const role = m.role === 'assistant' ? 'model' : 'user';
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  return { systemInstruction: systemParts.length ? { parts: [{ text: systemParts.join('\n\n') }] } : undefined, contents };
}

async function geminiRequest(apiKey, model, messages, options) {
  const { systemInstruction, contents } = messagesToGeminiFormat(messages);
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    systemInstruction: systemInstruction || undefined,
    contents: contents.length ? contents : [{ role: 'user', parts: [{ text: 'Hello' }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  };
  const modelName = model || GEMINI_DEFAULT_MODEL;
  const url = `${GEMINI_API_BASE}/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Gemini HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) {
    return { content: text, usage: data.usageMetadata, model: modelName };
  }
  throw new Error('Invalid Gemini response format');
}

// Cloudflare Workers AI — 10k Neurons/day free (OpenAI-compatible)
const CLOUDFLARE_DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

async function cloudflareRequest(accountId, apiToken, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || CLOUDFLARE_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Cloudflare HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Cloudflare response format');
}

// Cohere — 1k req/month free trial (Command R+)
const COHERE_API_URL = 'https://api.cohere.ai/v1/chat';
const COHERE_DEFAULT_MODEL = 'command-r-plus-08-2024';

function messagesToCohereFormat(messages) {
  const systemParts = [];
  const chatHistory = [];
  let message = null;
  for (const m of messages) {
    if (m.role === 'system') {
      systemParts.push(m.content);
    } else if (m.role === 'user') {
      if (message) chatHistory.push(message);
      message = { role: 'USER', message: m.content };
    } else if (m.role === 'assistant') {
      if (message) {
        chatHistory.push(message);
        chatHistory.push({ role: 'CHATBOT', message: m.content });
      }
      message = null;
    }
  }
  const lastUser = message?.message;
  return {
    message: lastUser || (messages.length ? messages[messages.length - 1].content : 'Hello'),
    chat_history: chatHistory.length ? chatHistory : undefined,
    preamble: systemParts.length ? systemParts.join('\n\n') : undefined,
  };
}

async function cohereRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const { message, chat_history, preamble } = messagesToCohereFormat(messages);
  const body = {
    model: model || COHERE_DEFAULT_MODEL,
    message,
    chat_history,
    preamble,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(COHERE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.message) {
    throw new Error(`Cohere HTTP ${res.status}: ${data.message}`);
  }
  if (data.text) {
    return {
      content: data.text,
      usage: data.meta,
      model: data.model_id || model,
    };
  }
  throw new Error('Invalid Cohere response format');
}

// Hugging Face Inference Providers — 300 req/hr free, OpenAI-compatible
const HUGGINGFACE_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HUGGINGFACE_DEFAULT_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

async function huggingfaceRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || HUGGINGFACE_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(HUGGINGFACE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Hugging Face HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Hugging Face response format');
}

// Cerebras — 1M tokens/day free (OpenAI-compatible; Qwen 3 235B default)
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';
const CEREBRAS_DEFAULT_MODEL = 'qwen-3-235b-a22b-instruct-2507';

async function cerebrasRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || CEREBRAS_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(CEREBRAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Cerebras HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Cerebras response format');
}

// DeepSeek — 5M tokens free (OpenAI-compatible; reasoning default)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_DEFAULT_MODEL = 'deepseek-reasoner';

async function deepseekRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || DEEPSEEK_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`DeepSeek HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid DeepSeek response format');
}

// Mistral AI — free tier (1 req/sec, 1B tokens/month, OpenAI-compatible)
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_DEFAULT_MODEL = 'mistral-small-latest';

async function mistralRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || MISTRAL_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Mistral HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Mistral response format');
}

// Fireworks AI — free trial (10 RPM, OpenAI-compatible, 100+ models)
const FIREWORKS_API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions';
const FIREWORKS_DEFAULT_MODEL = 'accounts/fireworks/models/llama-v3p1-8b-instruct';

async function fireworksRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || FIREWORKS_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(FIREWORKS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Fireworks HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Fireworks response format');
}

// Together AI — free research models (Apriel 15B, OpenAI-compatible)
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_DEFAULT_MODEL = 'servicenow/apriel-1.5-15b-thinker';

async function togetherRequest(apiKey, model, messages, options) {
  const maxTokens = options.maxTokens || 4096;
  const temperature = options.temperature ?? 0.7;
  const body = {
    model: model || TOGETHER_DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  const res = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 30000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Together HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  if (data.choices?.[0]?.message?.content) {
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
    };
  }
  throw new Error('Invalid Together response format');
}

function parseOllamaResponse(body) {
  const response = JSON.parse(body);
  if (response.error) {
    throw new Error(`Ollama error: ${response.error}`);
  }
  if (response.message?.content) {
    return {
      content: response.message.content,
      usage: response.eval_count ? { total_tokens: response.eval_count } : null,
      model: response.model,
    };
  }
  throw new Error('Invalid Ollama response format');
}

class LLMClient {
  constructor(options = {}) {
    this.ollamaUrl = options.ollamaUrl || process.env.OLLAMA_URL || process.env.OLLAMA_BASE_URL || OLLAMA_DEFAULT_URL;
    this.ollamaModel = options.ollamaModel || process.env.OLLAMA_MODEL || OLLAMA_DEFAULT_MODEL;
    this.ollamaEnabled = options.ollamaEnabled ?? (process.env.OLLAMA_ENABLED !== 'false' && process.env.OLLAMA_ENABLED !== '0');
    this.groqApiKey = options.groqApiKey || process.env.GROQ_API_KEY;
    this.geminiApiKey = options.geminiApiKey || process.env.GEMINI_API_KEY;
    this.cloudflareAccountId = options.cloudflareAccountId || process.env.CLOUDFLARE_ACCOUNT_ID;
    this.cloudflareApiToken = options.cloudflareApiToken || process.env.CLOUDFLARE_API_TOKEN;
    this.cohereApiKey = options.cohereApiKey || process.env.COHERE_API_KEY;
    this.huggingfaceToken =
      options.huggingfaceToken || process.env.HUGGINGFACE_HUB_TOKEN || process.env.HF_TOKEN;
    this.cerebrasApiKey = options.cerebrasApiKey || process.env.CEREBRAS_API_KEY;
    this.deepseekApiKey = options.deepseekApiKey || process.env.DEEPSEEK_API_KEY;
    this.mistralApiKey = options.mistralApiKey || process.env.MISTRAL_API_KEY;
    this.togetherApiKey = options.togetherApiKey || process.env.TOGETHER_API_KEY;
    this.fireworksApiKey = options.fireworksApiKey || process.env.FIREWORKS_API_KEY;
    this.openrouterApiKey = options.apiKey || options.openrouterApiKey || process.env.OPENROUTER_API_KEY;
    const rawModel = options.openrouterModel || options.model || process.env.OPENROUTER_MODEL || OPENROUTER_MODELS.default;
    this.openrouterModel = OPENROUTER_MODELS[rawModel] || rawModel;
    this.maxRetries = options.maxRetries ?? 2;
    this.timeout = options.timeout || 60000;
    this.appName = options.appName || 'Zion Tech Group Automation';
    this.siteUrl = options.siteUrl || 'https://ziontechgroup.com';
    this._lastProvider = null;
  }

  _buildMessages(prompt, options = {}) {
    const systemPrompt =
      options.systemPrompt ||
      'You are an expert software engineer working on the Zion Tech Group platform. Provide concise, actionable responses.';
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];
  }

  async complete(messages, options = {}) {
    const opts = { ...options, timeout: options.timeout || this.timeout };
    let lastError;

    if (this.ollamaEnabled) {
      try {
        const body = {
          model: this.ollamaModel,
          messages,
          stream: false,
          options: {
            num_predict: options.maxTokens || 4096,
            temperature: options.temperature ?? 0.7,
          },
        };
        const res = await ollamaRequest(this.ollamaUrl, '/api/chat', body, opts.timeout);
        this._lastProvider = 'ollama';
        return parseOllamaResponse(res);
      } catch (err) {
        lastError = err;
      }
    }

    if (this.groqApiKey) {
      try {
        const model = process.env.GROQ_MODEL || GROQ_DEFAULT_MODEL;
        const result = await groqRequest(this.groqApiKey, model, messages, opts);
        this._lastProvider = 'groq';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.geminiApiKey) {
      try {
        const model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
        const result = await geminiRequest(this.geminiApiKey, model, messages, opts);
        this._lastProvider = 'gemini';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.huggingfaceToken) {
      try {
        const model = process.env.HUGGINGFACE_MODEL || HUGGINGFACE_DEFAULT_MODEL;
        const result = await huggingfaceRequest(this.huggingfaceToken, model, messages, opts);
        this._lastProvider = 'huggingface';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.cerebrasApiKey) {
      try {
        const model = process.env.CEREBRAS_MODEL || CEREBRAS_DEFAULT_MODEL;
        const result = await cerebrasRequest(this.cerebrasApiKey, model, messages, opts);
        this._lastProvider = 'cerebras';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.cloudflareAccountId && this.cloudflareApiToken) {
      try {
        const result = await cloudflareRequest(
          this.cloudflareAccountId,
          this.cloudflareApiToken,
          process.env.CLOUDFLARE_MODEL || CLOUDFLARE_DEFAULT_MODEL,
          messages,
          opts
        );
        this._lastProvider = 'cloudflare';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.deepseekApiKey) {
      try {
        const model = process.env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL;
        const result = await deepseekRequest(this.deepseekApiKey, model, messages, opts);
        this._lastProvider = 'deepseek';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.mistralApiKey) {
      try {
        const model = process.env.MISTRAL_MODEL || MISTRAL_DEFAULT_MODEL;
        const result = await mistralRequest(this.mistralApiKey, model, messages, opts);
        this._lastProvider = 'mistral';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.togetherApiKey) {
      try {
        const model = process.env.TOGETHER_MODEL || TOGETHER_DEFAULT_MODEL;
        const result = await togetherRequest(this.togetherApiKey, model, messages, opts);
        this._lastProvider = 'together';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.fireworksApiKey) {
      try {
        const model = process.env.FIREWORKS_MODEL || FIREWORKS_DEFAULT_MODEL;
        const result = await fireworksRequest(this.fireworksApiKey, model, messages, opts);
        this._lastProvider = 'fireworks';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.cohereApiKey) {
      try {
        const result = await cohereRequest(this.cohereApiKey, COHERE_DEFAULT_MODEL, messages, opts);
        this._lastProvider = 'cohere';
        return result;
      } catch (err) {
        lastError = err;
      }
    }

    if (this.openrouterApiKey) {
      let attempt = 0;
      const maxAttempts = this.maxRetries + OPENROUTER_MODELS.fallback.length;
      let modelIndex = 0;
      while (attempt <= maxAttempts) {
        try {
          // Use fallback models after first attempt (for rate limiting)
          const model = attempt === 0 
            ? this.openrouterModel 
            : OPENROUTER_MODELS.getFallbackModel(modelIndex++);
          const res = await openrouterRequest(
            this.openrouterApiKey,
            model,
            messages,
            opts,
            this.siteUrl,
            this.appName
          );
          this._lastProvider = 'openrouter';
          return parseOpenRouterResponse(res);
        } catch (err) {
          lastError = err;
          const is429 = /429|rate limit/i.test(err.message);
          // Longer delay for rate limit errors
          const delay = is429 ? 45000 : Math.pow(2, attempt) * 1000;
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, delay));
          }
          attempt++;
        }
      }
    }

    throw lastError || new Error(
      'No LLM available. Start Ollama, or set GROQ_API_KEY, GEMINI_API_KEY, HUGGINGFACE_HUB_TOKEN, CEREBRAS_API_KEY, CLOUDFLARE_ACCOUNT_ID+CLOUDFLARE_API_TOKEN, DEEPSEEK_API_KEY, MISTRAL_API_KEY, TOGETHER_API_KEY, COHERE_API_KEY, or OPENROUTER_API_KEY.'
    );
  }

  async chat(prompt, options = {}) {
    const messages = this._buildMessages(prompt, options);
    const result = await this.complete(messages, options);
    return result.content;
  }

  async analyze(code, task = 'review', options = {}) {
    const tasks = {
      review: 'Review this code for bugs, performance issues, and best practices violations. Return a JSON array of issues found.',
      improve: 'Suggest improvements for this code. Return specific code changes.',
      document: 'Generate documentation for this code including JSDoc comments and a README section.',
      test: 'Generate unit tests for this code using Jest.',
      security: 'Analyze this code for security vulnerabilities. Return a JSON array of findings.',
      seo: 'Analyze this page component for SEO improvements. Return specific recommendations.',
    };
    const prompt = `${tasks[task] || task}\n\n\`\`\`\n${code}\n\`\`\``;
    return this.chat(prompt, options);
  }

  isConfigured() {
    return (
      this.ollamaEnabled ||
      !!this.groqApiKey ||
      !!this.geminiApiKey ||
      !!this.huggingfaceToken ||
      !!this.cerebrasApiKey ||
      (!!this.cloudflareAccountId && !!this.cloudflareApiToken) ||
      !!this.deepseekApiKey ||
      !!this.mistralApiKey ||
      !!this.togetherApiKey ||
      !!this.fireworksApiKey ||
      !!this.cohereApiKey ||
      !!this.openrouterApiKey
    );
  }

  getProviderInfo() {
    const fallback =
      this._lastProvider ||
      (this.ollamaEnabled
        ? 'ollama'
        : this.groqApiKey
          ? 'groq'
          : this.geminiApiKey
            ? 'gemini'
            : this.huggingfaceToken
              ? 'huggingface'
              : this.cerebrasApiKey
                ? 'cerebras'
                : this.cloudflareAccountId && this.cloudflareApiToken
                  ? 'cloudflare'
                  : this.deepseekApiKey
                    ? 'deepseek'
                    : this.mistralApiKey
                      ? 'mistral'
                      : this.togetherApiKey
                        ? 'together'
                        : this.fireworksApiKey
                          ? 'fireworks'
                          : this.cohereApiKey
                            ? 'cohere'
                            : this.openrouterApiKey
                              ? 'openrouter'
                              : null);
    const model =
      this._lastProvider === 'ollama'
        ? this.ollamaModel
        : this._lastProvider === 'groq'
          ? (process.env.GROQ_MODEL || GROQ_DEFAULT_MODEL)
          : this._lastProvider === 'gemini'
            ? (process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL)
            : this._lastProvider === 'huggingface'
              ? (process.env.HUGGINGFACE_MODEL || HUGGINGFACE_DEFAULT_MODEL)
              : this._lastProvider === 'cerebras'
                ? (process.env.CEREBRAS_MODEL || CEREBRAS_DEFAULT_MODEL)
                : this._lastProvider === 'cloudflare'
                  ? (process.env.CLOUDFLARE_MODEL || CLOUDFLARE_DEFAULT_MODEL)
                  : this._lastProvider === 'deepseek'
                    ? (process.env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL)
                    : this._lastProvider === 'mistral'
                      ? (process.env.MISTRAL_MODEL || MISTRAL_DEFAULT_MODEL)
                      : this._lastProvider === 'together'
                        ? (process.env.TOGETHER_MODEL || TOGETHER_DEFAULT_MODEL)
                        : this._lastProvider === 'fireworks'
                          ? (process.env.FIREWORKS_MODEL || FIREWORKS_DEFAULT_MODEL)
                          : this._lastProvider === 'cohere'
                          ? COHERE_DEFAULT_MODEL
                          : this.openrouterModel;
    return { provider: fallback, model, configured: this.isConfigured() };
  }
}

function createLLMClient(options = {}) {
  return new LLMClient(options);
}

module.exports = {
  LLMClient,
  createLLMClient,
  OPENROUTER_MODELS,
  OLLAMA_DEFAULT_MODEL,
  OLLAMA_DEFAULT_URL,
  GROQ_DEFAULT_MODEL,
  GEMINI_DEFAULT_MODEL,
  HUGGINGFACE_DEFAULT_MODEL,
  CEREBRAS_DEFAULT_MODEL,
  CLOUDFLARE_DEFAULT_MODEL,
  DEEPSEEK_DEFAULT_MODEL,
  MISTRAL_DEFAULT_MODEL,
  TOGETHER_DEFAULT_MODEL,
  COHERE_DEFAULT_MODEL,
};
