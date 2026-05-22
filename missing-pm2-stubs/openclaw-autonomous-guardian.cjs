/** Stub for PM2 app "openclaw-autonomous-guardian" — heartbeat until real agent is enrolled. */
process.title = 'openclaw-autonomous-guardian';
console.log('[openclaw-autonomous-guardian] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[openclaw-autonomous-guardian] heartbeat —', new Date().toISOString()), 60_000);
