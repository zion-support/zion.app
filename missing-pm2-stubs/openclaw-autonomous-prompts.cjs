/** Stub for PM2 app "openclaw-autonomous-prompts" — heartbeat until real agent is enrolled. */
process.title = 'openclaw-autonomous-prompts';
console.log('[openclaw-autonomous-prompts] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[openclaw-autonomous-prompts] heartbeat —', new Date().toISOString()), 60_000);
