/** Stub for PM2 app "ai-pm2-config-drift-guard" — heartbeat until real agent is enrolled. */
process.title = 'ai-pm2-config-drift-guard';
console.log('[ai-pm2-config-drift-guard] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-pm2-config-drift-guard] heartbeat —', new Date().toISOString()), 60_000);
