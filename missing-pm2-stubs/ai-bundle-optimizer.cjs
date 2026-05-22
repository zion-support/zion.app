/** Stub for PM2 app "ai-bundle-optimizer" — heartbeat until real agent is enrolled. */
process.title = 'ai-bundle-optimizer';
console.log('[ai-bundle-optimizer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-bundle-optimizer] heartbeat —', new Date().toISOString()), 60_000);
