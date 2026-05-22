/** Stub for PM2 app "ai-security-scanner" — heartbeat until real agent is enrolled. */
process.title = 'ai-security-scanner';
console.log('[ai-security-scanner] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-security-scanner] heartbeat —', new Date().toISOString()), 60_000);
