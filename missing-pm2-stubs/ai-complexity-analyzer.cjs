/** Stub for PM2 app "ai-complexity-analyzer" — heartbeat until real agent is enrolled. */
process.title = 'ai-complexity-analyzer';
console.log('[ai-complexity-analyzer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-complexity-analyzer] heartbeat —', new Date().toISOString()), 60_000);
