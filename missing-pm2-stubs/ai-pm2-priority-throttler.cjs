/** Stub for PM2 app "ai-pm2-priority-throttler" — heartbeat until real agent is enrolled. */
process.title = 'ai-pm2-priority-throttler';
console.log('[ai-pm2-priority-throttler] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-pm2-priority-throttler] heartbeat —', new Date().toISOString()), 60_000);
