#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APPROVED_QUEUE_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-action-approved-queue-latest.json');
const QUEUE_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-action-queue-latest.json');
const OUTPUT_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-pr-router-packets-latest.json');

function readJson(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function normalizeDomain(category) {
  if (category === 'quality' || category === 'automation') return 'reliability';
  if (category === 'performance') return 'ux';
  if (category === 'seo') return 'seo';
  return 'platform';
}

function main() {
  const queue = readJson(APPROVED_QUEUE_FILE, null) || readJson(QUEUE_FILE, { queue: [] });
  const items = Array.isArray(queue.queue) ? queue.queue : [];
  const packets = {};

  for (const item of items) {
    const domain = normalizeDomain(item.category);
    if (!packets[domain]) packets[domain] = [];
    packets[domain].push(item);
  }

  const packetList = Object.entries(packets).map(([domain, grouped], idx) => ({
    packetId: `packet-${domain}-${idx + 1}`,
    domain,
    branch: `autonomy/${domain}-${new Date().toISOString().slice(0, 10)}`,
    title: `autonomy(${domain}): apply queued OpenClaw improvements`,
    items: grouped.map((i) => ({
      id: i.id,
      sourceWorker: i.sourceWorker,
      recommendedCommand: i.recommendedCommand,
      summary: i.summary,
    })),
  }));

  const payload = {
    generatedAt: new Date().toISOString(),
    source: QUEUE_FILE,
    totalPackets: packetList.length,
    packets: packetList,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2));
  console.log(`OpenClaw PR router packets generated: ${OUTPUT_FILE} (${packetList.length} packets)`);
}

main();
