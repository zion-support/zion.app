#!/usr/bin/env node

/**
 * Netlify serverless function: AI Chat
 *
 * Uses multi-provider LLM chain via automation/lib/llm-client:
 * Ollama → Groq → Gemini → HF → Cerebras → Cloudflare → DeepSeek → Mistral → Together → Fireworks → Cohere → OpenRouter
 *
 * When deployed on Netlify, add at least one cloud key for LLM responses:
 * GROQ_API_KEY, GEMINI_API_KEY, HUGGINGFACE_HUB_TOKEN, CEREBRAS_API_KEY,
 * CLOUDFLARE_ACCOUNT_ID+CLOUDFLARE_API_TOKEN, DEEPSEEK_API_KEY, MISTRAL_API_KEY, TOGETHER_API_KEY,
 * FIREWORKS_API_KEY, COHERE_API_KEY, or OPENROUTER_API_KEY
 *
 * Env: See docs/FREE-AI-TOOLS.md for setup
 */

const path = require('path');

// Load .env from project root (Netlify injects env vars; .env for local dev)
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch (_) {}

// RAG-style context for the assistant (no embeddings in serverless — keep cold start low)
const ZION_CONTEXT = `
Zion Tech Group (ziontechgroup.com) — AI Delivery Studio.
Services: AI & ML, Web, Cloud, Cybersecurity, Data Analytics, DevOps, AI Talent Matching, Micro SaaS, Blockchain, Consulting, IoT, Data Engineering, API, Mobile.
Advanced AI: Generative AI, Agents, RAG, Copilots, Governance, Edge & Real-Time, Regulated Industries (HIPAA, SOC 2, EU AI Act), Multimodal, MLOps, Model Orchestration.
Pricing: Starter $2,499/mo (3 modules), Professional $6,999/mo (12 modules), Enterprise custom.
Contact: commercial@ziontechgroup.com | +1 302 464 0950 | 364 E Main St STE 1008, Middletown, DE 19709. /contact for discovery call.
Pages: /solutions, /pricing, /products, /ai-services, /case-studies, /consultation, /about.
`;

function ensureSystemContext(messages) {
  const hasSystem = messages.some((m) => m.role === 'system');
  if (hasSystem) {
    return messages.map((m) =>
      m.role === 'system' ? { role: 'system', content: ZION_CONTEXT.trim() + '\n\n' + m.content } : m
    );
  }
  return [{ role: 'system', content: ZION_CONTEXT.trim() }, ...messages];
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages array required' }) };
  }
  const messagesWithContext = ensureSystemContext(messages);

  try {
    const llmPath = path.join(process.cwd(), 'automation', 'lib', 'llm-client.cjs');
    const { createLLMClient } = require(llmPath);
    const llm = createLLMClient({
      apiKey: process.env.OPENROUTER_API_KEY,
      appName: 'Zion Tech Group AI Assistant',
      siteUrl: 'https://ziontechgroup.com',
    });

    if (!llm.isConfigured()) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error: 'LLM not configured',
          hint: 'Set GROQ_API_KEY, GEMINI_API_KEY, HUGGINGFACE_HUB_TOKEN, CEREBRAS_API_KEY, CLOUDFLARE_ACCOUNT_ID+CLOUDFLARE_API_TOKEN, DEEPSEEK_API_KEY, MISTRAL_API_KEY, TOGETHER_API_KEY, FIREWORKS_API_KEY, COHERE_API_KEY, or OPENROUTER_API_KEY in Netlify env',
        }),
      };
    }

    const result = await llm.complete(messagesWithContext, {
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: result.content }),
    };
  } catch (err) {
    console.error('[chat]', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'LLM request failed' }),
    };
  }
};
