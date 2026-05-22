/** Stub for PM2 app "ai-route-optimizer" — heartbeat until real agent is enrolled. */
process.title = 'ai-route-optimizer';
console.log('[ai-route-optimizer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-route-optimizer] heartbeat —', new Date().toISOString()), 60_000);
