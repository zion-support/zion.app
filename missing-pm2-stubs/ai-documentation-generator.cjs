/** Stub for PM2 app "ai-documentation-generator" — heartbeat until real agent is enrolled. */
process.title = 'ai-documentation-generator';
console.log('[ai-documentation-generator] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-documentation-generator] heartbeat —', new Date().toISOString()), 60_000);
