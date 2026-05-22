/** Stub for PM2 app "ai-git-workflow" — heartbeat until real agent is enrolled. */
process.title = 'ai-git-workflow';
console.log('[ai-git-workflow] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-git-workflow] heartbeat —', new Date().toISOString()), 60_000);
