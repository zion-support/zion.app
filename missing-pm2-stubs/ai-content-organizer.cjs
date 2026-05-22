/** Stub for PM2 app "ai-content-organizer" — heartbeat until real agent is enrolled. */
process.title = 'ai-content-organizer';
console.log('[ai-content-organizer] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-content-organizer] heartbeat —', new Date().toISOString()), 60_000);
