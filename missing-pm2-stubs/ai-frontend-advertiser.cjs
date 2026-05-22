/** Stub for PM2 app "ai-frontend-advertiser" — heartbeat until real agent is enrolled. */
process.title = 'ai-frontend-advertiser';
console.log('[ai-frontend-advertiser] heartbeat — stub active at', new Date().toISOString());
setInterval(() => console.log('[ai-frontend-advertiser] heartbeat —', new Date().toISOString()), 60_000);
