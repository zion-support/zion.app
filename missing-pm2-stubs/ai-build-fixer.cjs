/** Stub for PM2 app "ai-build-fixer" — heartbeat until real agent is enrolled. */
process.title = 'ai-build-fixer';
console.log('[ai-build-fixer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-build-fixer] heartbeat —', new Date().toISOString()), 60_000);
