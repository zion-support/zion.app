#!/usr/bin/env node
/**
 * PM2 Auto-Scaler
 * ----------------
 * Monitors system load and adjusts PM2 process instances automatically.
 * Reads ecosystem.config.cjs, updates instance count based on CPU usage,
 * and reloads PM2 configuration.
 *
 * Runs as a cron job (every 5 minutes) to ensure optimal resource allocation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ECOSYSTEM_PATH = path.join(process.cwd(), 'ecosystem.config.cjs');
const LOG_PATH = path.join(process.cwd(), 'logs', 'pm2-scaler.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(line.trim());
}

// Load ecosystem config
let ecosystem;
try {
  // Since it's a CJS file, we can require it
  ecosystem = require(ECOSYSTEM_PATH);
} catch (e) {
  log(`Failed to load ecosystem config: ${e.message}`);
  process.exit(1);
}

// Helper to get CPU load (1-minute average)
function getCPULoad() {
  const load = os.loadavg(); // [1min, 5min, 15min]
  return load[0]; // 1-minute average
}

// Determine target instance count based on load
function calculateTargetInstances(currentInstances, cpuLoad) {
  const cpuCount = os.cpus().length;
  const loadPerCore = cpuLoad / cpuCount;

  // Scaling policy:
  // - If load per core > 0.7, scale up (max 2x CPU count)
  // - If load per core < 0.3 for two consecutive checks, scale down (min 1)
  // For simplicity, we'll implement a basic threshold.

  let target = currentInstances;
  if (loadPerCore > 0.8) {
    target = Math.min(currentInstances + 1, cpuCount * 2);
  } else if (loadPerCore < 0.3 && currentInstances > 1) {
    target = Math.max(currentInstances - 1, 1);
  }
  return target;
}

// Update ecosystem config with new instance count
function scaleApps(targetInstances) {
  let modified = false;
  if (ecosystem.apps) {
    for (const app of ecosystem.apps) {
      if (app.name && app.instances !== undefined) {
        if (app.instances !== targetInstances) {
          log(`Scaling ${app.name} from ${app.instances} to ${targetInstances} instances`);
          app.instances = targetInstances;
          modified = true;
        }
      }
    }
  }
  if (modified) {
    // Write back the updated config
    const updatedConfig = `module.exports = ${JSON.stringify(ecosystem, null, 2)};`;
    fs.writeFileSync(ECOSYSTEM_PATH, updatedConfig, 'utf8');
    log('Ecosystem config updated');
    // Reload PM2
    try {
      execSync('pm2 reload ecosystem.config.cjs', { stdio: 'inherit' });
      log('PM2 reloaded');
    } catch (e) {
      log(`Failed to reload PM2: ${e.message}`);
    }
  } else {
    log('No scaling needed');
  }
}

// Main
(function main() {
  try {
    const cpuLoad = getCPULoad();
    log(`Current CPU load (1min): ${cpuLoad.toFixed(2)}`);

    // Determine current instance count from first app (assume uniform)
    let currentInstances = 1;
    if (ecosystem.apps && ecosystem.apps.length > 0) {
      const firstApp = ecosystem.apps[0];
      if (firstApp.instances !== undefined) {
        currentInstances = firstApp.instances;
      }
    }
    log(`Current instance count: ${currentInstances}`);

    const target = calculateTargetInstances(currentInstances, cpuLoad);
    log(`Target instance count: ${target}`);

    if (target !== currentInstances) {
      scaleApps(target);
    } else {
      log('Scaling not required');
    }
  } catch (err) {
    log(`Error in PM2 scaler: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
})();