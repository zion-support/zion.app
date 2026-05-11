#!/usr/bin/env node

/**
 * Free AI Image Generation Client — Pollinations.ai
 *
 * Pollinations.ai: Free image generation. Get a free API key at enter.pollinations.ai (no credit card).
 *
 * Usage:
 *   const { generateImage } = require('./lib/image-gen-client.cjs');
 *   const buffer = await generateImage('a futuristic AI dashboard');
 *   // or get URL: const url = getImageUrl('a cat in space');
 *
 * Env:
 *   POLLINATIONS_API_KEY  - Optional, for production (enter.pollinations.ai)
 *   POLLINATIONS_MODEL    - Optional: flux, gpt-image-large, seedream, kontext (default: flux)
 *   POLLINATIONS_WIDTH    - Optional: 512-1280 (default: 1024)
 *   POLLINATIONS_HEIGHT   - Optional: 512-1280 (default: 1024)
 */

const https = require('https');
const { URL } = require('url');

const POLLINATIONS_BASE = 'https://gen.pollinations.ai';
const POLLINATIONS_LEGACY = 'https://image.pollinations.ai';

function getImageUrl(prompt, options = {}) {
  const model = options.model || process.env.POLLINATIONS_MODEL || 'flux';
  const width = options.width || process.env.POLLINATIONS_WIDTH || 1024;
  const height = options.height || process.env.POLLINATIONS_HEIGHT || 1024;
  const key = options.apiKey || process.env.POLLINATIONS_API_KEY;

  const encodedPrompt = encodeURIComponent(String(prompt).replace(/\s+/g, ' '));
  const params = new URLSearchParams();
  params.set('model', model);
  params.set('width', String(width));
  params.set('height', String(height));
  if (key) params.set('key', key);
  const qs = params.toString();
  return `${POLLINATIONS_BASE}/image/${encodedPrompt}${qs ? '?' + qs : ''}`;
}

/**
 * Generate image and return as Buffer
 * @param {string} prompt - Image description
 * @param {object} options - { model, width, height, apiKey, timeout }
 * @returns {Promise<Buffer>}
 */
function generateImage(prompt, options = {}) {
  const url = getImageUrl(prompt, options);
  const timeout = options.timeout || 60000;
  const apiKey = options.apiKey || process.env.POLLINATIONS_API_KEY;

  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      timeout,
    };

    const req = https.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`Pollinations HTTP ${res.statusCode}`));
          return;
        }
        resolve(Buffer.concat(chunks));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Pollinations request timed out'));
    });
    req.end();
  });
}

/**
 * Check if image generation is available (requires POLLINATIONS_API_KEY)
 */
function isConfigured() {
  return !!process.env.POLLINATIONS_API_KEY;
}

module.exports = {
  generateImage,
  getImageUrl,
  isConfigured,
  POLLINATIONS_BASE,
  POLLINATIONS_LEGACY,
};
