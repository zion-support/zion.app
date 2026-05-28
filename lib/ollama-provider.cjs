/**
 * Ollama Local LLM Provider (CommonJS)
 * Provides fallback to locally-run models via Ollama API (localhost:11434)
 */

/**
 * @typedef {Object} OllamaMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 */

/**
 * @typedef {Object} OllamaChatOptions
 * @property {string} [model]
 * @property {number} [temperature]
 * @property {number} [topP]
 * @property {number} [numPredict]
 * @property {number} [numCtx]
 * @property {boolean} [stream]
 */

const DEFAULT_OLLAMA_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen3:0.6b';

/**
 * Parse Qwen3 hybrid responses: output may be in `thinking` or `response` fields
 * @param {Record<string, unknown>} raw
 * @returns {string}
 */
function extractQwenResponse(raw) {
  const thinking = raw.thinking;
  const response = raw.response;
  return (response?.trim() || thinking?.trim() || '').replace(/<\/think>/g, '').trim();
}

/**
 * Chat completion via Ollama
 * @param {OllamaMessage[]} messages
 * @param {OllamaChatOptions} [options]
 * @returns {Promise<{content: string, model: string}>}
 */
async function ollamaChat(messages, options = {}) {
  const baseUrl = DEFAULT_OLLAMA_BASE.replace(/\/$/, '');
  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.7;
  const topP = options.topP ?? 0.9;
  const numPredict = options.numPredict ?? 1024;
  const numCtx = options.numCtx ?? (model.includes("0.6b") ? 2048 : 8192);

  const processedMessages = messages.map((m, idx) => {
    if (idx === messages.length - 1 && m.role === 'user') {
      const wantsThink = m.content.includes('/think') || m.content.includes('think step by step');
      const cleanContent = wantsThink
        ? m.content.replace(/\/think/g, '').trim() + ' /think'
        : m.content.replace(/\/no_think/g, '').trim() + ' /no_think';
      return { ...m, content: cleanContent };
    }
    return m;
  });

  const payload = {
    model,
    messages: processedMessages,
    stream: false,
    options: {
      temperature,
      top_p: topP,
      num_predict: numPredict,
      num_ctx: numCtx,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const message = data.message;
    const content = message?.content ? extractQwenResponse({ ...message }) : extractQwenResponse(data);

    return {
      content,
      model: data.model || model,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Ollama request timed out after 60s');
      }
      throw new Error(`Ollama chat failed: ${err.message}`);
    }
    throw err;
  }
}

/**
 * Check if Ollama is running and the model is available
 * @returns {Promise<{healthy: boolean, model: string, error?: string}>}
 */
async function ollamaHealthCheck() {
  try {
    const baseUrl = DEFAULT_OLLAMA_BASE.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { healthy: false, model: DEFAULT_MODEL, error: `HTTP ${res.status}` };
    const data = await res.json();
    const models = data.models || [];
    const available = models.some((m) => m.name.startsWith(DEFAULT_MODEL.split(':')[0]));
    if (!available) {
      return {
        healthy: false,
        model: DEFAULT_MODEL,
        error: `Model ${DEFAULT_MODEL} not found. Available: ${models.map((m) => m.name).join(', ')}`,
      };
    }
    return { healthy: true, model: DEFAULT_MODEL };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { healthy: false, model: DEFAULT_MODEL, error: `Ollama unreachable: ${msg}` };
  }
}

/**
 * Streamed variant (for real-time UX)
 * @param {OllamaMessage[]} messages
 * @param {OllamaChatOptions} [options]
 * @yields {string}
 */
async function* ollamaChatStream(messages, options = {}) {
  const baseUrl = DEFAULT_OLLAMA_BASE.replace(/\/$/, '');
  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.7;
  const topP = options.topP ?? 0.9;
  const numPredict = options.numPredict ?? 1024;
  const numCtx = options.numCtx ?? (model.includes("0.6b") ? 2048 : 8192);

  const processedMessages = messages.map((m, idx) => {
    if (idx === messages.length - 1 && m.role === 'user') {
      const wantsThink = m.content.includes('/think') || m.content.includes('think step by step');
      const cleanContent = wantsThink
        ? m.content.replace(/\/think/g, '').trim() + ' /think'
        : m.content.replace(/\/no_think/g, '').trim() + ' /no_think';
      return { ...m, content: cleanContent };
    }
    return m;
  });

  const payload = {
    model,
    messages: processedMessages,
    stream: true,
    options: { temperature, top_p: topP, num_predict: numPredict, num_ctx: numCtx },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Ollama stream error ${res.status}`);

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const delta = json.message?.content || '';
          if (delta) yield delta;
        } catch {
          // skip malformed JSON
        }
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  ollamaChat,
  ollamaHealthCheck,
  ollamaChatStream,
};
