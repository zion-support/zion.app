#!/usr/bin/env node
/**
 * Service Video Explainer Generator — autonomous video production
 * Generates 30–45 second promo videos for each service
 * Pipeline: script → TTS → canvas visuals → FFmpeg → MP4
 * Free tools: macOS 'say' or Edge TTS, canvas, ffmpeg
 * Output: public/videos/services/<service-id>.mp4
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SERVICES_FILE = path.join(process.cwd(), 'app', 'data', 'servicesData.ts');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'videos', 'services');
const LOG_FILE = path.join(process.cwd(), 'automation', 'reports', 'video-generation.log');
const BATCH_SIZE = parseInt(process.env.VIDEO_BATCH_SIZE) || 5;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(msg);
}

function parseBlocks(content) {
  const blocks = [];
  const re = /(\{[^}]*id:\s*"[^"]+"[^}]*\})/g;
  let m;
  while ((m = re.exec(content)) !== null) blocks.push(m[1].trim());
  return blocks;
}

function extractMeta(block) {
  return {
    id: (block.match(/id:\s*"([^"]+)"/) || [])[1],
    title: (block.match(/title:\s*"([^"]+)"/) || [])[1],
    category: (block.match(/category:\s*'([^']+)'/) || [])[1]
  };
}

// Step 1: Generate script (template-based; can be upgraded to LLM)
function generateScript(service) {
  const { title, category } = service;
  const categoryName = category === 'ai' ? 'AI' : 'IT';
  return `Introducing ${title} from Zion Tech Group.

Our ${categoryName} service delivers real results for businesses like yours.

We handle everything so you can focus on what matters.

Ready to transform your operations?

Contact us today to get started.`;
}

// Step 2: Generate TTS audio using macOS 'say' or edge-tts
async function generateAudio(serviceId, script, outputPath) {
  // Try edge-tts if available, else fallback to macOS say (requires screenshots)
  try {
    // Use say to create AIFF, then convert to mp3 via ffmpeg
    const aiffPath = outputPath.replace('.mp3', '.aiff');
    const escaped = script.replace(/"/g, '\\"');
    execSync(`say -v "Samantha" -o "${aiffPath}" "${escaped}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -i "${aiffPath}" -codec:a libmp3lame -qscale:a 2 "${outputPath}"`, { stdio: 'pipe' });
    fs.unlinkSync(aiffPath);
    return true;
  } catch (e) {
    log(`❌ TTS failed for ${serviceId}: ${e.message}`);
    return false;
  }
}

// Step 3: Generate visual slides using canvas (Node.js)
// We'll create a series of PNGs, then composite with audio
async function generateVisuals(service, outputPrefix) {
  // Placeholder: create solid color slide with text
  // Real implementation would use 'canvas' npm package
  // For now, create a dummy transparent PNG so pipeline doesn't break
  try {
    execSync(`convert -size 1920x1080 xc:none -fill white -gravity center -pointsize 72 -annotate 0 "${service.title}" "${outputPrefix}-%03d.png"`, { stdio: 'pipe' });
    return true;
  } catch {
    // ImageMagick not guaranteed; skip video generation
    return false;
  }
}

// Step 4: Assemble video with FFmpeg
function assembleVideo(audioPath, visualPattern, outputPath) {
  try {
    execSync(`ffmpeg -y -framerate 1 -i "${visualPattern}" -i "${audioPath}" -c:v libx264 -preset veryfast -r 30 -pix_fmt yuv420p -c:a aac -shortest "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    log(`❌ FFmpeg failed: ${e.message}`);
    return false;
  }
}

async function processService(service) {
  const { id, title } = service;
  const outPath = path.join(OUTPUT_DIR, `${id}.mp4`);
  if (fs.existsSync(outPath)) {
    log(`⏭️  ${id}: already exists`);
    return 'skipped';
  }

  log(`🎬 Generating video for ${id}: ${title}`);

  const script = generateScript(service);
  const audioPath = path.join(OUTPUT_DIR, `${id}.mp3`);
  const visualPrefix = path.join(OUTPUT_DIR, `${id}-frame`);

  // Generate audio
  const audioOk = await generateAudio(id, script, audioPath);
  if (!audioOk) return 'failed_audio';

  // Generate visuals
  const visualsOk = await generateVisuals(service, visualPrefix);
  if (!visualsOk) return 'failed_visuals';

  // Composite
  const visualPattern = `${visualPrefix}-%03d.png`;
  const videoOk = assembleVideo(audioPath, visualPattern, outPath);

  // Cleanup temp files
  try { fs.unlinkSync(audioPath); } catch {}
  try { fs.unlinkSync(visualPrefix + '-000.png'); } catch {}

  return videoOk ? 'created' : 'failed_ffmpeg';
}

async function run() {
  log('🎥 Video Generator starting...');
  const content = fs.readFileSync(SERVICES_FILE, 'utf8');
  const blocks = parseBlocks(content);
  log(`📦 Services: ${blocks.length}`);

  // Take first N pending (no video file yet)
  const toProcess = blocks.slice(0, BATCH_SIZE).map(extractMeta).filter(s => !fs.existsSync(path.join(OUTPUT_DIR, `${s.id}.mp4`)));
  log(`🎯 Processing batch: ${toProcess.length} videos`);

  if (toProcess.length === 0) {
    log('✅ All caught up — no videos needed');
    return;
  }

  for (let i = 0; i < toProcess.length; i++) {
    const svc = toProcess[i];
    const result = await processService(svc);
    log(`[${i+1}/${toProcess.length}] ${svc.id}: ${result}`);
    if (i < toProcess.length - 1) await new Promise(r => setTimeout(r, 1000));
  }

  log('✅ Batch complete');
}

run().catch(e => {
  log(`❌ ${e.message}`);
  process.exit(1);
});
