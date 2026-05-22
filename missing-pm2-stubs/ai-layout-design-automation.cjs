/** Stub for PM2 app "ai-layout-design-automation" — heartbeat until real agent is enrolled. */
process.title = 'ai-layout-design-automation';
console.log('[ai-layout-design-automation] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-layout-design-automation] heartbeat —', new Date().toISOString()), 60_000);
