#!/usr/bin/env node

/**
 * Test Replicate image generation (free tier: FLUX)
 * Usage: npm run image:replicate "your prompt"
 */

const path = require('path');
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch (_) {}

const { generateImage, isConfigured } = require('../lib/replicate-image-client.cjs');

const prompt = process.argv[2] || 'a minimalist AI and technology logo';

async function main() {
  if (!isConfigured()) {
    console.log('Replicate requires REPLICATE_API_TOKEN (free at replicate.com)');
    console.log('Add to .env: REPLICATE_API_TOKEN=r8_...');
    process.exit(1);
  }
  console.log('Testing Replicate FLUX image generation...');
  console.log('Prompt:', prompt);

  try {
    const buffer = await generateImage(prompt, { timeout: 90000 });
    const outPath = path.join(process.cwd(), 'out-replicate-test.png');
    require('fs').writeFileSync(outPath, buffer);
    console.log('OK: Image saved to', outPath);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
