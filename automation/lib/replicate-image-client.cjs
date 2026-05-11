#!/usr/bin/env node

/**
 * Replicate Image Generation Client — Free tier (FLUX, Imagen, Ideogram)
 *
 * Replicate: Free tier with FLUX, Imagen-4, Ideogram v3. Sign up at replicate.com.
 *
 * Usage:
 *   const { generateImage, getImageUrl } = require('./lib/replicate-image-client.cjs');
 *   const url = await getImageUrl('a futuristic AI dashboard');
 *   const buffer = await generateImage('a cat in space');
 *
 * Env:
 *   REPLICATE_API_TOKEN  - Required (free at replicate.com)
 *   REPLICATE_MODEL      - Optional: flux-schnell (default), flux-dev, flux-1.1-pro
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const REPLICATE_API = 'https://api.replicate.com/v1';
const DEFAULT_MODEL = 'black-forest-labs/flux-schnell';

const MODEL_MAP = {
  'flux-schnell': 'black-forest-labs/flux-schnell',
  'flux-dev': 'black-forest-labs/flux-dev',
  'flux-1.1-pro': 'black-forest-labs/flux-1.1-pro',
};

/**
 * Get model identifier from env or short name
 */
function getModel() {
  const raw = process.env.REPLICATE_MODEL || 'flux-schnell';
  return MODEL_MAP[raw] || raw;
}

/**
 * Generate image and return URL (async)
 * @param {string} prompt - Image description
 * @param {object} options - { model, width, height, timeout }
 * @returns {Promise<string>} URL of generated image
 */
async function getImageUrl(prompt, options = {}) {
  const token = options.apiToken || process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN required. Get free token at replicate.com');
  }

  const model = options.model || getModel();
  const timeout = options.timeout || 90000; // 90s for image gen

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeout);

  try {
    // Replicate API: POST /v1/predictions with model identifier (or version hash)
    const res = await fetch(`${REPLICATE_API}/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
        Prefer: 'wait=60',
      },
      body: JSON.stringify({
        version: model,
        input: {
          prompt: String(prompt).slice(0, 1000),
          image_width: options.width || 1024,
          image_height: options.height || 1024,
        },
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    clearTimeout(to);

    if (data.error) {
      throw new Error(`Replicate: ${data.error}`);
    }

    const output = data.output;
    if (Array.isArray(output) && output[0]) {
      return output[0];
    }
    if (typeof output === 'string') {
      return output;
    }
    if (data.urls?.get) {
      return data.urls.get;
    }
    if (data.status === 'starting' || data.status === 'processing') {
      throw new Error('Replicate: Prediction still processing (increase wait or poll)');
    }
    throw new Error('Replicate: No output in response');
  } catch (err) {
    clearTimeout(to);
    if (err.name === 'AbortError') {
      throw new Error('Replicate request timed out');
    }
    throw err;
  }
}

/**
 * Generate image and return as Buffer
 * @param {string} prompt - Image description
 * @param {object} options - { model, width, height, timeout }
 * @returns {Promise<Buffer>}
 */
async function generateImage(prompt, options = {}) {
  const url = await getImageUrl(prompt, options);
  const timeout = options.timeout || 30000;
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!res.ok) {
    throw new Error(`Replicate fetch image: HTTP ${res.status}`);
  }
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

function isConfigured() {
  return !!process.env.REPLICATE_API_TOKEN;
}

module.exports = {
  generateImage,
  getImageUrl,
  isConfigured,
  getModel,
};
