/** Stub for PM2 app "ai-performance-optimizer" — heartbeat until real agent is enrolled. */
process.title = 'ai-performance-optimizer';
console.log('[ai-performance-optimizer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-performance-optimizer] heartbeat —', new Date().toISOString()), 60_000);
