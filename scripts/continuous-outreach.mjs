// Continuous Outreach Orchestrator - Wrapper
// Calls the Python implementation

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const py = spawn('python3', [
    '/root/.openclaw/workspace/zion-app/scripts/zion-outreach-engine.py'
], { stdio: 'inherit' });

py.on('close', (code) => {
    console.log(`Outreach cycle complete (exit ${code})`);
    process.exit(code);
});