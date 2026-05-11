#!/usr/bin/env node

/**
 * Free AI Embeddings Client — Google Gemini (primary), Hugging Face (fallback)
 *
 * Primary: Google AI Studio (Gemini) — 1,500 embedding requests/day free.
 * Fallback: Hugging Face Inference — 300 req/hr free (same token as LLM).
 *
 * Use for semantic search, RAG, similarity matching.
 *
 * Usage:
 *   const { embed } = require('./lib/embedding-client.cjs');
 *   const vec = await embed('your text');
 *   const vecs = await embedBatch(['text1', 'text2']);
 *
 * Env:
 *   GEMINI_API_KEY         - Free at aistudio.google.com/apikey (primary)
 *   HUGGINGFACE_HUB_TOKEN  - Free at huggingface.co/settings/tokens (fallback)
 *   GEMINI_EMBED_MODEL     - Optional: text-embedding-004 (default)
 *   HUGGINGFACE_EMBED_MODEL - Optional: sentence-transformers/all-MiniLM-L6-v2 (default)
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'text-embedding-004';
const GEMINI_EMBED_API = 'https://generativelanguage.googleapis.com/v1beta/models';
const HUGGINGFACE_EMBED_MODEL =
  process.env.HUGGINGFACE_EMBED_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
const HUGGINGFACE_EMBED_API = 'https://api-inference.huggingface.co/models';

async function embedGemini(apiKey, text, options = {}) {
  const model = options.model || GEMINI_EMBED_MODEL;
  const body = {
    content: {
      parts: [{ text: String(text).slice(0, 2000) }],
    },
  };
  const url = `${GEMINI_EMBED_API}/${model}:embedContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(options.timeout || 15000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Gemini Embed HTTP ${res.status}: ${data.error?.message || JSON.stringify(data.error)}`);
  }
  const embedding = data.embedding?.values ?? data.embeddings?.[0]?.values;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Invalid Gemini embedding response');
  }
  return embedding;
}

async function embedHuggingFace(token, text, options = {}) {
  const model = options.model || HUGGINGFACE_EMBED_MODEL;
  const url = `${HUGGINGFACE_EMBED_API}/${model}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ inputs: String(text).slice(0, 8000) }),
    signal: AbortSignal.timeout(options.timeout || 15000),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Hugging Face Embed HTTP ${res.status}: ${data.error}`);
  }
  const raw = Array.isArray(data) ? data : data;
  const vec = Array.isArray(raw[0]) ? raw[0] : raw;
  if (!vec || !Array.isArray(vec) || vec.length === 0) {
    throw new Error('Invalid Hugging Face embedding response');
  }
  return vec.map((n) => (typeof n === 'number' ? n : parseFloat(n)));
}

/**
 * Embed a single text and return vector (Gemini first, then Hugging Face)
 * @param {string} text
 * @param {object} options - { model, timeout }
 * @returns {Promise<number[]>}
 */
async function embed(text, options = {}) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const hfToken = process.env.HUGGINGFACE_HUB_TOKEN || process.env.HF_TOKEN;
  if (geminiKey) {
    try {
      return await embedGemini(geminiKey, text, options);
    } catch (err) {
      if (hfToken) {
        return await embedHuggingFace(hfToken, text, options);
      }
      throw err;
    }
  }
  if (hfToken) {
    return await embedHuggingFace(hfToken, text, options);
  }
  throw new Error(
    'No embeddings configured. Set GEMINI_API_KEY (aistudio.google.com/apikey) or HUGGINGFACE_HUB_TOKEN (huggingface.co/settings/tokens)'
  );
}

/**
 * Embed multiple texts (one request per text for compatibility)
 * @param {string[]} texts
 * @param {object} options
 * @returns {Promise<number[][]>}
 */
async function embedBatch(texts, options = {}) {
  const results = [];
  for (const t of texts) {
    results.push(await embed(t, options));
  }
  return results;
}

function isConfigured() {
  return !!(process.env.GEMINI_API_KEY || process.env.HUGGINGFACE_HUB_TOKEN || process.env.HF_TOKEN);
}

module.exports = {
  embed,
  embedBatch,
  isConfigured,
  GEMINI_EMBED_MODEL,
  HUGGINGFACE_EMBED_MODEL,
};
