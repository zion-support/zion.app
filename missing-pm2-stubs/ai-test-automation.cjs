/** Stub for PM2 app "ai-test-automation" — heartbeat until real agent is enrolled. */
process.title = 'ai-test-automation';
console.log('[ai-test-automation] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-test-automation] heartbeat —', new Date().toISOString()), 60_000);
