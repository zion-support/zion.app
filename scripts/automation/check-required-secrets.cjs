#!/usr/bin/env node
 

const raw = process.env.REQUIRED_SECRETS || '';
const required = raw
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

if (required.length === 0) {
  console.log('[secret-preflight] No required secrets configured.');
  process.exit(0);
}

const missing = required.filter((name) => {
  const value = process.env[name];
  return typeof value !== 'string' || value.trim() === '';
});

if (missing.length > 0) {
  console.error(`[secret-preflight] Missing required secrets: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`[secret-preflight] OK (${required.length} required secrets present).`);
