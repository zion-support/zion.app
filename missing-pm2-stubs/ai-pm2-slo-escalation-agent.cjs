/** Stub for PM2 app "ai-pm2-slo-escalation-agent" — heartbeat until real agent is enrolled. */
process.title = 'ai-pm2-slo-escalation-agent';
console.log('[ai-pm2-slo-escalation-agent] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-pm2-slo-escalation-agent] heartbeat —', new Date().toISOString()), 60_000);
