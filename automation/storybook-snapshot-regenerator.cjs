#!/usr/bin/env node
/**
 * Automatic Storybook Snapshot Regenerator — Full Implementation
 *
 * Detects JSON Schema changes → builds Storybook → captures full-page screenshot via Puppeteer
 * Compares with previous snapshot using pixelmatch → if >0.5% change, creates GitHub issue
 *
 * Outputs: .hermes/memory/storybook-regression-report.json (issue metadata)
 * Artifacts: .hermes/memory/storybook-snapshots/{previous,current,diff}/
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, 'storybook-static');
const SNAPSHOT_DIR = path.join(ROOT, '.hermes', 'memory', 'storybook-snapshots');
const PREV_DIR = path.join(SNAPSHOT_DIR, 'previous');
const CURR_DIR = path.join(SNAPSHOT_DIR, 'current');
const DIFF_DIR = path.join(SNAPSHOT_DIR, 'diff');
const REPORT_PATH = path.join(ROOT, '.hermes', 'memory', 'storybook-regression-report.json');
const SERVER_PORT = 6006;

// Config
const THRESHOLD_PERCENT = 0.5; // Trigger if >0.5% pixel change
const SCREENSHOT_FILE = 'full.png';

// Ensure directories
[CURR_DIR, PREV_DIR, DIFF_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function buildStorybook() {
  log('📦 Building Storybook...');
  try {
    execSync('npm run build-storybook', { stdio: 'pipe' });
    log('✅ Storybook build complete');
  } catch (e) {
    log('❌ Storybook build failed');
    throw e;
  }
}

function startStaticServer() {
  log(`🌐 Starting static server on port ${SERVER_PORT}...`);
  // Use Python's http.server for simplicity (available on Ubuntu runners)
  const server = spawn('python3', ['-m', 'http.server', String(SERVER_PORT)], {
    cwd: STATIC_DIR,
    detached: true,
    stdio: 'pipe',
  });
  server.unref();
  return new Promise((resolve) => setTimeout(() => resolve(server), 3000));
}

function stopServer(server) {
  if (server) {
    try { server.kill('SIGKILL'); } catch (e) {}
  }
}

async function captureScreenshot() {
  log('🎥 Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const url = `http://localhost:${SERVER_PORT}/`;
  log(`📍 Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  // Wait a moment for fonts
  await page.waitForTimeout(2000);
  const screenshotPath = path.join(CURR_DIR, SCREENSHOT_FILE);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  log(`📸 Screenshot saved: ${screenshotPath}`);
  await browser.close();
}

function compareImages(oldPath, newPath) {
  log('🔍 Comparing images...');
  const img1 = PNG.sync.read(fs.readFileSync(oldPath));
  const img2 = PNG.sync.read(fs.readFileSync(newPath));

  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const changePercent = (numDiffPixels / totalPixels) * 100;

  log(`📊 Pixels: ${numDiffPixels}/${totalPixels} changed (${changePercent.toFixed(2)}%)`);

  // Save diff image (highlight mismatches in red)
  diff.data = Buffer.from(diff.data); // ensure mutable
  // Simple diff visualization: highlight where pixels differ by making them red
  for (let i = 0; i < diff.data.length; i += 4) {
    if (diff.data[i] !== 0 || diff.data[i+1] !== 0 || diff.data[i+2] !== 0) {
      diff.data[i] = 255;     // R
      diff.data[i+1] = 0;     // G
      diff.data[i+2] = 0;     // B
      diff.data[i+3] = 255;   // A
    }
  }
  const diffPath = path.join(DIFF_DIR, 'diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  log(`🖼️  Diff image saved: ${diffPath}`);

  return { numDiffPixels, totalPixels, changePercent };
}

function createRegressionReport({ changePercent, numDiffPixels, totalPixels }) {
  const title = `🎨 Storybook Visual Regression Detected (${changePercent.toFixed(2)}% change)`;
  const body = `## Visual regression detected in Storybook snapshots

- **Change:** ${changePercent.toFixed(2)}% (${numDiffPixels} / ${totalPixels} pixels)
- **Threshold:** ${THRESHOLD_PERCENT}%
- **Generated:** ${new Date().toISOString()}

### Diff Image
The diff image highlighting changes (red pixels) is attached as a workflow artifact `storybook-snapshots`. You can download the artifact from the workflow run to inspect.

### Next Steps
1. Review the visual changes in the diff image
2. If changes are intentional, update the baseline by approving this run
3. If not, fix the underlying component or story to restore expected appearance

**Labels:** storybook, visual-regression, automation
`;
  const report = { title, body, changePercent, numDiffPixels, totalPixels, threshold: THRESHOLD_PERCENT };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`📝 Regression report written: ${REPORT_PATH}`);
  return report;
}

async function main() {
  log('🚀 Starting Storybook Snapshot Regenerator...');

  // 1. Build Storybook
  buildStorybook();

  // 2. Start static file server
  startStaticServer();

  // 3. Capture screenshot
  await captureScreenshot();

  // 4. Stop server
  execSync(`pkill -f "python3 -m http.server ${SERVER_PORT}" || true`);

  // 5. Compare with previous
  const currentImg = path.join(CURR_DIR, SCREENSHOT_FILE);
  const prevImg = path.join(PREV_DIR, SCREENSHOT_FILE);

  if (!fs.existsSync(prevImg)) {
    log('ℹ️  No previous snapshot found — initializing baseline');
    fs.copyFileSync(currentImg, prevImg);
    log('✅ Baseline set');
    // Write a baseline report with no issue
    const baselineReport = {
      status: 'baseline_initialized',
      currentSnapshot: currentImg,
      baselineSnapshot: prevImg,
      generatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(baselineReport, null, 2));
    process.exit(0);
  }

  const { numDiffPixels, totalPixels, changePercent } = compareImages(prevImg, currentImg);

  // 6. Decide if regression exceeds threshold
  if (changePercent > THRESHOLD_PERCENT) {
    log(`⚠️ Change exceeds ${THRESHOLD_PERCENT}% — creating regression report`);
    createRegressionReport({ changePercent, numDiffPixels, totalPixels });
    // Update baseline? We might want to keep manual approval. Let's NOT overwrite baseline automatically.
    // Instead, keep current in current dir; baseline remains old until manually approved.
    process.exit(1); // Signal failure to create issue
  } else {
    log(`✅ Change within threshold (${changePercent.toFixed(2)}% ≤ ${THRESHOLD_PERCENT}%)`);
    // Update baseline to current
    fs.copyFileSync(currentImg, prevImg);
    const okReport = {
      status: 'no_regression',
      changePercent: parseFloat(changePercent.toFixed(2)),
      baselineUpdated: true,
      generatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(okReport, null, 2));
    process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
