#!/usr/bin/env node
/**
 * OpenClaw Agent: PM2 Automation Manager
 * Priority: HIGH
 * Monitors, manages, and auto-restarts PM2 processes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const REPORT_FILE = path.join(WORKSPACE, 'openclaw-agents', 'pm2-health-report.json');

console.log('⚙️ PM2 Automation Manager starting...\n');

const report = {
  timestamp: new Date().toISOString(),
  processes: [],
  automations: [],
  health: 'healthy',
  restarts: []
};

const CRITICAL_AUTOMATIONS = [
  'automation',
  'heartbeat',
  'monitor',
  'deploy',
  'sync'
];

async function getPM2List() {
  try {
    const output = execSync('pm2 jlist', { 
      cwd: WORKSPACE, 
      encoding: 'utf8',
      timeout: 10000 
    });
    return JSON.parse(output);
  } catch (e) {
    return [];
  }
}

async function main() {
  console.log('1️⃣ Checking PM2 processes...');
  const processes = await getPM2List();
  
  if (processes.length === 0) {
    console.log('   ⚠️ No PM2 processes found');
    report.health = 'no-processes';
  } else {
    console.log(`   Found ${processes.length} processes`);
    
    for (const proc of processes) {
      const info = {
        name: proc.name,
        status: proc.pm2_env?.status || 'unknown',
        memory: proc.monit?.memory ? Math.round(proc.monit.memory / 1024 / 1024) : 0,
        cpu: proc.monit?.cpu || 0,
        uptime: proc.pm2_env?.pm_uptime ? Date.now() - proc.pm2_env.pm_uptime : 0,
        restarts: proc.pm2_env?.restart_time || 0
      };
      
      report.processes.push(info);
      
      // Check health
      if (info.status === 'stopped' || info.status === 'errored') {
        console.log(`   ⚠️ ${info.name}: ${info.status}`);
        
        // Auto-restart if critical
        const isCritical = CRITICAL_AUTOMATIONS.some(a => info.name.toLowerCase().includes(a));
        if (isCritical) {
          console.log(`   🔄 Auto-restarting ${info.name}...`);
          try {
            execSync(`pm2 start ${info.name}`, { cwd: WORKSPACE, encoding: 'utf8' });
            report.restarts.push({ name: info.name, action: 'started', time: new Date().toISOString() });
          } catch (e) {
            report.restarts.push({ name: info.name, action: 'failed', error: e.message });
          }
        }
      } else if (info.status === 'online') {
        console.log(`   ✅ ${info.name}: online (${info.memory}MB, ${info.cpu}%)`);
      }
    }
  }

  // Check for missing automations
  console.log('\n2️⃣ Checking automation coverage...');
  const runningNames = processes.map(p => p.name.toLowerCase());
  
  for (const auto of CRITICAL_AUTOMATIONS) {
    const found = runningNames.some(n => n.includes(auto));
    if (!found) {
      report.automations.push({ name: auto, status: 'missing', severity: 'high' });
      console.log(`   ⚠️ Missing automation: ${auto}`);
    } else {
      report.automations.push({ name: auto, status: 'running', severity: 'low' });
    }
  }

  // Summary
  console.log('\n📊 PM2 Health Summary:');
  const online = report.processes.filter(p => p.status === 'online').length;
  const stopped = report.processes.filter(p => p.status === 'stopped' || p.status === 'errored').length;
  
  console.log(`   Online: ${online}`);
  console.log(`   Stopped/Errored: ${stopped}`);
  console.log(`   Restarts: ${report.restarts.length}`);
  
  if (stopped > 0) {
    report.health = 'degraded';
  } else {
    report.health = 'healthy';
  }
  console.log(`   Health: ${report.health.toUpperCase()}`);

  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log('\n✅ PM2 health report saved');
}

main().catch(console.error);
