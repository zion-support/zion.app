/** Stub for PM2 app "ai-pm2-restart-guardian" — heartbeat until real agent is enrolled. */
process.title = 'ai-pm2-restart-guardian';
console.log('[ai-pm2-restart-guardian] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-pm2-restart-guardian] heartbeat —', new Date().toISOString()), 60_000);
