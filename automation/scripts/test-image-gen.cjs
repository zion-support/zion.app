#!/usr/bin/env node

/**
 * Test Pollinations.ai image generation
 * Usage: node automation/scripts/test-image-gen.cjs [prompt]
 * Example: node automation/scripts/test-image-gen.cjs "futuristic AI dashboard"
 */

const path = require('path');
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch (_) {}

const { generateImage, getImageUrl } = require('../lib/image-gen-client.cjs');

const prompt = process.argv[2] || 'a minimalist AI and technology logo';

async function main() {
  if (!process.env.POLLINATIONS_API_KEY) {
    console.log('Pollinations.ai requires POLLINATIONS_API_KEY (free at enter.pollinations.ai)');
    console.log('Add to .env: POLLINATIONS_API_KEY=your_key');
    process.exit(1);
  }
  console.log('Testing Pollinations.ai image generation...');
  console.log('Prompt:', prompt);
  console.log('URL:', getImageUrl(prompt));

  try {
    const buffer = await generateImage(prompt, { timeout: 45000 });
    const outPath = path.join(process.cwd(), 'out-pollinations-test.png');
    require('fs').writeFileSync(outPath, buffer);
    console.log('OK: Image saved to', outPath);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
