/** Stub for PM2 app "ai-deploy-hook-availability-guard" — heartbeat until real agent is enrolled. */
process.title = 'ai-deploy-hook-availability-guard';
console.log('[ai-deploy-hook-availability-guard] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-deploy-hook-availability-guard] heartbeat —', new Date().toISOString()), 60_000);
