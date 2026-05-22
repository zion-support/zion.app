/** Stub for PM2 app "ai-netlify-hook-smoke-agent" — heartbeat until real agent is enrolled. */
process.title = 'ai-netlify-hook-smoke-agent';
console.log('[ai-netlify-hook-smoke-agent] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-netlify-hook-smoke-agent] heartbeat —', new Date().toISOString()), 60_000);
