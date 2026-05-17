#!/usr/bin/env node
/**
 * AI Service FAQ Generator v2 — robust, batch-processed, resumable
 * Generates FAQs for services lacking them; respects rate limits; saves progress
 */

const fs = require('fs');
const path = require('path');

const SERVICES_FILE = path.join(process.cwd(), 'app', 'data', 'servicesData.ts');
const PROGRESS_FILE = path.join(process.cwd(), 'automation', 'cache', 'faq-gen-progress.json');
const BACKUP_DIR = path.join(process.cwd(), 'automation', 'backups', 'faq-gen');
const LOG_FILE = path.join(process.cwd(), 'automation', 'reports', 'faq-generation.log');

const LLM_ENDPOINT = process.env.EMAIL_LLM_ENDPOINT || 'http://localhost:3000/api/llm/chat';
const BATCH_SIZE = parseInt(process.env.FAQ_BATCH_SIZE) || 10;
const DELAY_MS = parseInt(process.env.FAQ_DELAY_MS) || 2000;

fs.mkdirSync(BACKUP_DIR, { recursive: true });
fs.mkdirSync(path.dirname(PROGRESS_FILE), { recursive: true });
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(msg);
}

function backupOriginal() {
  const ts = new Date().toISOString().replace(/[:]/g, '-').slice(0, 19);
  fs.copyFileSync(SERVICES_FILE, path.join(BACKUP_DIR, `servicesData.${ts}.ts`));
  log('📦 Backup created');
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
    id: (block.match(/id:\s*"([^"]+)"/) || [])[1] || 'unknown',
    title: (block.match(/title:\s*"([^"]+)"/) || [])[1] || 'Untitled',
    block
  };
}

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch {}
  return { completed: [], failed: [] };
}

function saveProgress(prog) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(prog, null, 2));
}

async function callLLM(prompt) {
  const resp = await fetch(LLM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, temperature: 0.35, max_tokens: 600 })
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  const text = (data.text || data.response || '').trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('No JSON in response');
}

async function generateFAQsForService(service) {
  const prompt = `Generate exactly 5 concise FAQs with short answers for:

Service: ${service.title}

Return JSON only:
{ "faqs": [ { "question": "...", "answer": "..." } ] }`;

  try {
    const result = await callLLM(prompt);
    return (result.faqs || []).filter(f => f.question && f.answer);
  } catch (e) {
    log(`❌ ${service.id}: ${e.message}`);
    return null;
  }
}

async function run() {
  log('🚀 FAQ Generator v2 starting...');
  backupOriginal();

  const content = fs.readFileSync(SERVICES_FILE, 'utf8');
  const blocks = parseBlocks(content);
  log(`📦 Total services: ${blocks.length}`);

  const progress = loadProgress();
  let patched = progress.completed.length;

  // Identify pending services (no faqs field and not already completed/failed)
  const pending = blocks.filter(block => {
    const meta = extractMeta(block);
    const hasFAQsAlready = block.includes('faqs:');
    const alreadyDone = progress.completed.includes(meta.id);
    const failed = progress.failed.includes(meta.id);
    return !hasFAQsAlready && !alreadyDone && !failed;
  });

  log(`⏳ Pending: ${pending.length} (already done: ${progress.completed.length})`);

  for (let i = 0; i < pending.length && i < BATCH_SIZE; i++) {
    const block = pending[i];
    const meta = extractMeta(block);

    log(`[${i+1}/${pending.length}] Generating FAQs for ${meta.id}…`);
    const faqs = await generateFAQsForService(meta);

    if (faqs && faqs.length >= 3) {
      const faqsArray = faqs.map(f => {
        const q = f.question.replace(/"/g, '\\"');
        const a = f.answer.replace(/"/g, '\\"');
        return `    { question: "${q}", answer: "${a}" }`;
      }).join(',\n');

      const newField = `,\n    faqs: [\n${faqsArray}\n    ]`;
      const newBlock = block.replace(/\}$/, newField + '\n  }');

      content = content.replace(block, newBlock, 1);
      progress.completed.push(meta.id);
      patched++;
      log(`✅ ${meta.id}: ${faqs.length} FAQs added`);
    } else {
      progress.failed.push(meta.id);
      log(`⚠️  ${meta.id}: no FAQs generated`);
    }

    saveProgress(progress);
    if (i < pending.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  fs.writeFileSync(SERVICES_FILE, content);
  log(`✅ Batch done — patched: ${patched}, failed this run: ${progress.failed.length}`);
  log('📋 Re-run to continue (progress saved)');
}

run().catch(e => {
  log(`❌ Fatal: ${e.message}`);
  process.exit(1);
});
