/** Stub for PM2 app "ai-pm2-slo-agent" — heartbeat until real agent is enrolled. */
process.title = 'ai-pm2-slo-agent';
console.log('[ai-pm2-slo-agent] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-pm2-slo-agent] heartbeat —', new Date().toISOString()), 60_000);
