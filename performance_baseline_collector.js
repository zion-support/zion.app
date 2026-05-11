const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// File to store baseline data (NDJSON)
const BASELINE_FILE = path.join(__dirname, 'performance', 'baselines', `${new Date().toISOString().split('T')[0]}.jsonl`);

// Ensure directory exists
fs.mkdirSync(path.dirname(BASELINE_FILE), { recursive: true });

// Helper to append metric entry
function logMetric(component, metrics) {
    const entry = {
        timestamp: new Date().toISOString(),
        component,
        ...metrics
    };
    fs.appendFileSync(BASELINE_FILE, JSON.stringify(entry) + '\n');
}

// System-level metrics (CPU, memory, load avg, disk, network)
function collectSystemMetrics() {
    return new Promise((resolve) => {
        exec('top -bn1 | head -5', (err, stdout) => {
            if (err) return resolve({});
            // Very simple parsing for demo purposes
            const lines = stdout.split('\n');
            const cpuLine = lines.find(l => l.includes('Cpu(s)')) || '';
            const memLine = lines.find(l => l.includes('MiB Mem')) || '';
            const loadLine = lines.find(l => l.includes('load average')) || '';
            const cpuMatch = cpuLine.match(/([\d.]+)\s*id/);
            const memMatch = memLine.match(/([\d.]+)\s*total/);
            const loadMatch = loadLine.match(/load average:\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
            const metrics = {
                cpu_idle: cpuMatch ? parseFloat(cpuMatch[1]) : null,
                mem_total_mb: memMatch ? parseFloat(memMatch[1]) : null,
                load_1m: loadMatch ? parseFloat(loadMatch[1]) : null,
                load_5m: loadMatch ? parseFloat(loadMatch[2]) : null,
                load_15m: loadMatch ? parseFloat(loadMatch[3]) : null
            };
            resolve(metrics);
        });
    });
}

// PM2 process metrics
function collectPM2Metrics() {
    return new Promise((resolve) => {
        exec('pm2 jlist', (err, stdout) => {
            if (err) return resolve([]);
            try {
                const list = JSON.parse(stdout);
                const metrics = list.map(p => ({
                    name: p.name,
                    pid: p.pm_id,
                    cpu: p.monit.cpu,
                    memory_mb: p.monit.memory / (1024 * 1024),
                    status: p.pm2_env.status,
                    uptime_ms: p.pm2_env.pm_uptime
                }));
                resolve(metrics);
            } catch (e) {
                resolve([]);
            }
        });
    });
}

// Application-level metrics – skill execution timings (placeholder)
function collectSkillMetrics() {
    // In a real setup, skill execution would push metrics via hooks.
    // Here we simulate with an empty array.
    return [];
}

// Alert suppression metrics – read from suppression log if exists
function collectSuppressionMetrics() {
    const logPath = path.join(__dirname, 'logs', 'alert_suppression.log');
    if (!fs.existsSync(logPath)) return [];
    const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
    const entries = lines.map(l => JSON.parse(l));
    const summary = {};
    entries.forEach(e => {
        const key = e.decision;
        summary[key] = (summary[key] || 0) + 1;
    });
    return [{ suppressed: summary['SUPPRESSED'] || 0, notified: summary['NOTIFIED'] || 0 }];
}

async function runCollector() {
    try {
        const sys = await collectSystemMetrics();
        logMetric('system', sys);
        const pm2 = await collectPM2Metrics();
        pm2.forEach(m => logMetric('pm2_process', m));
        const skills = collectSkillMetrics();
        skills.forEach(m => logMetric('skill', m));
        const suppression = collectSuppressionMetrics();
        suppression.forEach(m => logMetric('alert_suppression', m));
        console.log('✅ Performance baseline collected');
    } catch (e) {
        console.error('❌ Baseline collection error', e);
    }
}

if (require.main === module) {
    runCollector();
}
