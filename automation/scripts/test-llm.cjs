#!/usr/bin/env node
/**
 * Quick test for LLM client (Ollama primary, OpenRouter fallback)
 * Run: node automation/scripts/test-llm.cjs  or  npm run llm:test
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { createLLMClient } = require('../lib/openrouter-client.cjs');

async function main() {
  const llm = createLLMClient({ appName: 'Zion LLM Test' });
  const info = llm.getProviderInfo();

  console.log('LLM Client Test');
  console.log('  Configured:', llm.isConfigured());
  console.log('  Provider:', info.provider || '(will use ollama first, openrouter fallback)');
  console.log('');

  if (!llm.isConfigured()) {
    console.error('No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  console.log('Sending test prompt...');
  const start = Date.now();
  const reply = await llm.chat('Reply with exactly: OK', { maxTokens: 50 });
  const elapsed = Date.now() - start;
  const used = llm.getProviderInfo();

  console.log('  Response:', reply?.slice(0, 100) || '(empty)');
  console.log('  Provider used:', used.provider);
  console.log('  Elapsed:', elapsed + 'ms');
  console.log('');
  console.log('LLM test passed.');
}

main().catch((err) => {
  console.error('LLM test failed:', err.message);
  process.exit(1);
});
