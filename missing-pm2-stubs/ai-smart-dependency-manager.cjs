/** Stub for PM2 app "ai-smart-dependency-manager" — heartbeat until real agent is enrolled. */
process.title = 'ai-smart-dependency-manager';
console.log('[ai-smart-dependency-manager] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-smart-dependency-manager] heartbeat —', new Date().toISOString()), 60_000);
