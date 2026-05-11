#!/usr/bin/env node

/**
 * Test embeddings — Gemini (1,500 req/day) or Hugging Face (300 req/hr) free tier
 * Run: npm run embedding:test
 */

const path = require('path');
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch (_) {}

const { embed, isConfigured } = require('../lib/embedding-client.cjs');

async function main() {
  if (!isConfigured()) {
    console.log('Set GEMINI_API_KEY (aistudio.google.com/apikey) or HUGGINGFACE_HUB_TOKEN (huggingface.co/settings/tokens)');
    process.exit(1);
  }
  const text = 'Zion Tech Group offers AI solutions for enterprise.';
  console.log('Embedding:', text.slice(0, 50) + '...');
  const vec = await embed(text);
  console.log('Vector length:', vec.length);
  console.log('First 5 values:', vec.slice(0, 5).map((v) => v.toFixed(4)));
  console.log('OK');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
