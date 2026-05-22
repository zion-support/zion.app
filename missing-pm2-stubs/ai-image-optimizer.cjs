/** Stub for PM2 app "ai-image-optimizer" — heartbeat until real agent is enrolled. */
process.title = 'ai-image-optimizer';
console.log('[ai-image-optimizer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-image-optimizer] heartbeat —', new Date().toISOString()), 60_000);
