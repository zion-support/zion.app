/** Stub for PM2 app "ai-broken-link-fixer" — heartbeat until real agent is enrolled. */
process.title = 'ai-broken-link-fixer';
console.log('[ai-broken-link-fixer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-broken-link-fixer] heartbeat —', new Date().toISOString()), 60_000);
