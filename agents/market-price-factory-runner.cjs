#!/usr/bin/env node
/**
 * Market Price Research Factory Runner
 * Spawns multiple price research workers in parallel
 * 
 * Usage: node market-price-factory-runner.cjs [options]
 *   --concurrency N    Number of parallel workers (default: 3)
 *   --scope all|new    Which apps to research (default: new)
 *   --delay MS         Delay between batches (default: 1000)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const APPS_FILE = path.join(WORKSPACE, 'automation/data/app-catalog.json');
const PRICES_FILE = path.join(WORKSPACE, 'automation/data/market-prices.json');
const WORKER_SCRIPT = path.join(__dirname, 'price-research-worker.cjs');

const args = process.argv.slice(2);

// Parse flags
const flags = {
  concurrency: 3,
  scope: 'new',
  delay: 1000
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--concurrency' && args[i + 1]) {
    flags.concurrency = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--scope' && args[i + 1]) {
    flags.scope = args[i + 1];
    i++;
  } else if (args[i] === '--delay' && args[i + 1]) {
    flags.delay = parseInt(args[i + 1]);
    i++;
  }
}

console.log('🏭 Market Price Research Factory');
console.log('================================');
console.log(`Concurrency: ${flags.concurrency}`);
console.log(`Scope: ${flags.scope}\n`);

// Load apps
const appsData = JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
const apps = appsData.apps || [];

// Load existing prices
let pricesData = { prices: [], lastUpdated: null };
if (fs.existsSync(PRICES_FILE)) {
  pricesData = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
}

// Filter apps to research
const appsToResearch = apps.filter(app => {
  if (flags.scope === 'all') return true;
  const existing = pricesData.prices.find(p => p.slug === app.slug);
  return !existing || !existing.estimatedPrice;
});

console.log(`Apps to research: ${appsToResearch.length}`);

if (appsToResearch.length === 0) {
  console.log('✅ All apps already have prices');
  process.exit(0);
}

// Run workers in parallel with concurrency control
async function runWorkers() {
  const results = [];
  const workers = [];
  
  for (let i = 0; i < appsToResearch.length; i++) {
    const app = appsToResearch[i];
    
    // Wait if at concurrency limit
    if (workers.length >= flags.concurrency) {
      await Promise.any(workers.map(p => p.catch(() => null)));
      // Clean up finished workers
      for (let j = workers.length - 1; j >= 0; j--) {
        if (workers[j].status === 'fulfilled' || workers[j].status === 'rejected') {
          workers.splice(j, 1);
        }
      }
    }
    
    console.log(`[${i + 1}/${appsToResearch.length}] Starting worker for: ${app.title}`);
    
    const workerPromise = new Promise((resolve, reject) => {
      const worker = spawn('node', [WORKER_SCRIPT, JSON.stringify(app)], {
        cwd: WORKSPACE,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      let errorOutput = '';
      
      worker.stdout.on('data', (data) => { output += data; });
      worker.stderr.on('data', (data) => { errorOutput += data; });
      
      worker.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(output));
          } catch {
            reject(new Error(`Failed to parse: ${output}`));
          }
        } else {
          reject(new Error(`Worker exited with code ${code}: ${errorOutput}`));
        }
      });
      
      worker.on('error', reject);
    });
    
    workers.push(workerPromise);
    
    // Track result
    workerPromise.then(result => {
      results.push(result);
      console.log(`   ✅ ${result.slug}: $${result.estimatedPrice || '?'}/mo (${result.confidence})`);
    }).catch(err => {
      console.log(`   ❌ Error: ${err.message}`);
    });
    
    // Delay between starts
    await new Promise(r => setTimeout(r, flags.delay));
  }
  
  // Wait for remaining workers
  console.log('\n⏳ Waiting for remaining workers...\n');
  await Promise.allSettled(workers);
  
  return results;
}

runWorkers().then(results => {
  // Save all prices
  const existingSlugs = new Set(pricesData.prices.map(p => p.slug));
  
  for (const price of results) {
    if (!existingSlugs.has(price.slug)) {
      pricesData.prices.push(price);
    } else {
      const idx = pricesData.prices.findIndex(p => p.slug === price.slug);
      pricesData.prices[idx] = { ...pricesData.prices[idx], ...price };
    }
  }
  
  pricesData.lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(PRICES_FILE, JSON.stringify(pricesData, null, 2));
  
  console.log('\n📊 Final Summary:');
  console.log(`   Total processed: ${results.length}`);
  console.log(`   With prices: ${results.filter(r => r.estimatedPrice).length}`);
  console.log(`   Saved to: ${PRICES_FILE}`);
  
  // Also update the app-catalog
  const updater = spawn('node', [path.join(__dirname, 'market-price-updater.cjs')], {
    cwd: WORKSPACE
  });
  
  updater.on('close', (code) => {
    if (code === 0) {
      console.log('✅ App catalog updated with prices');
    }
  });
}).catch(console.error);
