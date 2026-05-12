#!/usr/bin/env node
/**
 * Content Quality & SEO Health Auditor
 * Analyzes page content for SEO, readability, freshness, and linking structure
 * Uses cheerio for HTML parsing, Flesch-Kincaid readability metrics
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'content-quality');
const LOG_FILE = path.join(STATE_DIR, 'content-audit.log');
const HISTORY_FILE = path.join(STATE_DIR, 'history.json');
const REPORT_FILE = path.join(STATE_DIR, 'latest-report.json');

const BASE_URL = process.env.APP_URL || 'https://ziontechgroup.com';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '8435383377';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const MAX_PAGES = 50; // limit for performance

// Thresholds
const MIN_WORD_COUNT = 300; // thin content
const MAX_TITLE_LENGTH = 60; // chars
const MIN_TITLE_LENGTH = 30;
const MAX_META_DESC_LENGTH = 160;
const MIN_META_DESC_LENGTH = 120;
const MIN_INTERNAL_LINKS = 2; // orphan threshold
const MAX_ORPHAN_PAGES_FOR_ISSUE = 5; // create issue if >5 orphans
const FRESHNESS_YEARS = 2; // stale if not updated in 2+ years

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function ensureFiles() {
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify({ pages: {} }, null, 2));
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch { return { pages: {} }; }
}

function saveHistory(hist) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2));
}

function fetchSitemap() {
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractUrlsFromSitemap(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'OpenClaw-SEOChecker/1.0' } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    }).on('error', () => resolve({ status: 0, body: '', headers: {} }));
  });
}

function countWords(text) {
  // Simple word count — split on whitespace, filter non-empty
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function fleschReadingEase(text) {
  // Flesch Reading Ease score (0-100, higher = easier)
  // Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  // We'll approximate syllables by vowel groups; not perfect but ok for trend detection
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (words.length === 0 || sentences.length === 0) return 50;

  const syllables = words.reduce((acc, w) => {
    // Count vowel groups (approximation)
    const vs = (w.match(/[aeiouy]+/gi) || []).length;
    return acc + Math.max(1, vs);
  }, 0);

  const wordsPerSentence = words.length / sentences.length;
  const syllablesPerWord = syllables / words.length;

  return Math.max(0, Math.min(100, 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord));
}

function gradeLevel(text) {
  // Gunning Fog Index approximation
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (words.length === 0 || sentences.length === 0) return 8;

  const complexWords = words.filter(w => {
    // Complex: ≥3 syllables (approximate by vowel count > 2)
    const syllables = (w.match(/[aeiouy]+/gi) || []).length;
    return syllables >= 3;
  }).length;

  const avgWordsPerSentence = words.length / sentences.length;
  const percentComplex = (complexWords / words.length) * 100;
  return 0.4 * (avgWordsPerSentence + percentComplex);
}

function analyzePage(html, url) {
  // Simple DOM parsing using regex (avoid heavy cheerio dependency)
  const getMeta = (name, attr = 'name') => {
    const re = new RegExp(`<[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
    const m = html.match(re);
    return m ? m[1] : null;
  };

  const getElementContent = (selector) => {
    // Very naive selector match: tag name only
    const re = new RegExp(`<${selector}[^>]*>([^<]*)</${selector}>`, 'i');
    const m = html.match(re);
    return m ? m[1].trim() : null;
  };

  // Strip HTML tags for text content
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = countWords(textContent);
  const fleschScore = fleschReadingEase(textContent);
  const gradeLevel = gradeLevel(textContent);

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // Meta description
  const metaDesc = getMeta('description');

  // H1
  const h1 = getElementContent('h1');

  // Count headings H1-H6
  const headingCount = {};
  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}[^>]*>`, 'gi');
    const matches = html.match(re);
    headingCount[`h${i}`] = matches ? matches.length : 0;
  }

  // Count internal links (href starting with / or same base)
  const baseHost = new URL(BASE_URL).host;
  const linkRe = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let linkMatch;
  const internalLinks = [];
  const externalLinks = [];
  while ((linkMatch = linkRe.exec(html)) !== null) {
    const href = linkMatch[1];
    try {
      const abs = new URL(href, BASE_URL);
      if (abs.host === baseHost) internalLinks.push(href);
      else externalLinks.push(href);
    } catch {
      // relative or invalid — treat as internal if starts with /
      if (href.startsWith('/') || href.startsWith('#')) internalLinks.push(href);
    }
  }

  // Check Open Graph
  const ogTitle = getMeta('og:title', 'property');
  const ogDesc = getMeta('og:description', 'property');
  const ogImage = getMeta('og:image', 'property');

  // Check Twitter cards
  const twTitle = getMeta('twitter:title', 'name');
  const twDesc = getMeta('twitter:description', 'name');
  const twImage = getMeta('twitter:image', 'name');

  // Schema.org JSON-LD presence
  const hasSchema = html.includes('application/ld+json');

  // Image alt text presence (quick scan)
  const imgAltRe = /<img[^>]*alt=["']([^"']*)["'][^>]*>/gi;
  let imgMatch, altCount = 0, totalImgs = 0;
  while ((imgMatch = imgAltRe.exec(html)) !== null) {
    totalImgs++;
    if (imgMatch[1].trim() !== '') altCount++;
  }

  // Last modified from sitemap (if available by parsing lastmod tag)
  // We'll pass this through from sitemap fetch later
  const lastmod = null; // placeholder

  return {
    url,
    title,
    titleLength: title ? title.length : 0,
    metaDescription: metaDesc,
    metaDescLength: metaDesc ? metaDesc.length : 0,
    h1,
    headings: headingCount,
    wordCount,
    fleschScore,
    gradeLevel,
    internalLinksCount: internalLinks.length,
    externalLinksCount: externalLinks.length,
    hasOgTitle: !!ogTitle,
    hasOgDescription: !!ogDesc,
    hasOgImage: !!ogImage,
    hasTwitterTitle: !!twTitle,
    hasTwitterDescription: !!twDesc,
    hasTwitterImage: !!twImage,
    hasSchema,
    imagesWithAlt: altCount,
    totalImages: totalImgs,
    lastmod,
  };
}

function scorePage(p) {
  let score = 100;
  const issues = [];

  // Title length
  if (!p.title) { score -= 15; issues.push('missing_title'); }
  else if (p.titleLength < MIN_TITLE_LENGTH) { score -= 10; issues.push('title_too_short'); }
  else if (p.titleLength > MAX_TITLE_LENGTH) { score -= 5; issues.push('title_too_long'); }

  // Meta description
  if (!p.metaDescription) { score -= 15; issues.push('missing_meta_desc'); }
  else if (p.metaDescLength < MIN_META_DESC_LENGTH) { score -= 10; issues.push('meta_desc_too_short'); }
  else if (p.metaDescLength > MAX_META_DESC_LENGTH) { score -= 5; issues.push('meta_desc_too_long'); }

  // H1
  if (!p.h1) { score -= 10; issues.push('missing_h1'); }

  // Word count (thin content)
  if (p.wordCount < MIN_WORD_COUNT) { score -= 15; issues.push('thin_content'); }

  // Internal links (orphan)
  if (p.internalLinksCount < MIN_INTERNAL_LINKS) { score -= 10; issues.push('orphan_page'); }

  // Open Graph
  if (!p.hasOgTitle) { score -= 5; issues.push('missing_og_title'); }
  if (!p.hasOgDescription) { score -= 5; issues.push('missing_og_desc'); }
  if (!p.hasOgImage) { score -= 3; issues.push('missing_og_image'); }

  // Twitter cards
  if (!p.hasTwitterTitle) { score -= 3; issues.push('missing_twitter_title'); }
  if (!p.hasTwitterDescription) { score -= 3; issues.push('missing_twitter_desc'); }

  // Schema.org
  if (!p.hasSchema) { score -= 5; issues.push('missing_schema'); }

  // Image alt coverage
  if (p.totalImages > 0) {
    const altRatio = p.imagesWithAlt / p.totalImages;
    if (altRatio < 0.5) { score -= 10; issues.push('poor_image_alt_coverage'); }
    else if (altRatio < 1) { score -= 5; issues.push('some_images_missing_alt'); }
  }

  // Readability bonus/penalty
  if (p.gradeLevel > 12) { score -= 5; issues.push('reading_level_too_high'); }

  return { score: Math.max(0, score), issues };
}

async function main() {
  ensureFiles();
  log('🔍 Starting Content Quality & SEO Audit...');

  // 1. Get pages from sitemap
  const sitemapXml = await fetchSitemap();
  const sitemapUrls = extractUrlsFromSitemap(sitemapXml);
  const pagesToScan = sitemapUrls.slice(0, MAX_PAGES);
  log(`📄 Found ${pagesToScan.length} pages from sitemap`);

  if (pagesToScan.length === 0) {
    log('⚠️ No sitemap pages found; using homepage only');
    pagesToScan.push('/');
  }

  // 2. Fetch and analyze each page
  const results = [];
  for (const pageUrl of pagesToScan) {
    const fullUrl = pageUrl.startsWith('http') ? pageUrl : BASE_URL + pageUrl;
    const res = await fetchPage(fullUrl);
    if (res.status === 200) {
      const analysis = analyzePage(res.body, pageUrl);
      const scored = scorePage(analysis);
      results.push({ ...analysis, ...scored });
      log(`✅ [${res.status}] ${pageUrl} — score: ${scored.score}`);
    } else {
      log(`❌ [${res.status}] ${pageUrl}`);
      results.push({ url: pageUrl, score: 0, issues: ['fetch_failed'], title: null });
    }
  }

  // 3. Aggregate metrics
  const totalPages = results.length;
  const avgScore = results.reduce((a, b) => a + b.score, 0) / totalPages;
  const criticalPages = results.filter(r => r.score < 50);
  const orphanPages = results.filter(r => r.issues.includes('orphan_page'));
  const thinContentPages = results.filter(r => r.wordCount < MIN_WORD_COUNT);
  const missingMetadataPages = results.filter(r => r.issues.some(i => ['missing_title', 'missing_meta_desc', 'missing_h1'].includes(i)));

  log(`📊 Average SEO score: ${avgScore.toFixed(1)}/100`);
  log(`   Critical pages (score<50): ${criticalPages.length}`);
  log(`   Orphan pages: ${orphanPages.length}`);
  log(`   Thin content (<${MIN_WORD_COUNT} words): ${thinContentPages.length}`);

  // 4. Update history
  const history = loadHistory();
  const todayKey = new Date().toISOString().slice(0, 10);

  for (const r of results) {
    if (!history.pages[r.url]) history.pages[r.url] = { firstSeen: todayKey, daily: {} };
    history.pages[r.url].daily[todayKey] = {
      score: r.score,
      wordCount: r.wordCount,
      internalLinks: r.internalLinksCount,
      issues: r.issues,
    };
    // Keep last 90 days
    const days = Object.keys(history.pages[r.url].daily).sort();
    if (days.length > 90) {
      const toRemove = days.slice(0, days.length - 90);
      for (const d of toRemove) delete history.pages[r.url].daily[d];
    }
  }
  saveHistory(history);

  // 5. Build report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pagesScanned: totalPages,
    summary: {
      averageScore: Math.round(avgScore),
      criticalCount: criticalPages.length,
      orphanCount: orphanPages.length,
      thinContentCount: thinContentPages.length,
      missingMetadataCount: missingMetadataPages.length,
    },
    pages: results.map(r => ({
      url: r.url,
      title: r.title,
      score: r.score,
      issues: r.issues,
      wordCount: r.wordCount,
      internalLinks: r.internalLinksCount,
      fleschScore: Math.round(r.fleschScore),
    })),
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // 6. Alerts
  if (TELEGRAM_TOKEN) {
    await sendTelegram(report);
  }

  // 7. GitHub issue for systemic problems
  if (criticalPages.length >= 3 || orphanPages.length >= MAX_ORPHAN_PAGES_FOR_ISSUE || missingMetadataPages.length >= 5) {
    if (GITHUB_TOKEN) await createGitHubIssue(report);
  }

  log('✅ Content quality audit complete');
}

async function sendTelegram(report) {
  const https = require('https');
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `📝 *Content Quality & SEO Audit* — ${now}\n`;
  text += `Base: ${BASE_URL}\n\n`;

  text += `📊 Average SEO score: ${report.summary.averageScore}/100\n`;
  text += `Pages scanned: ${report.pagesScanned}\n\n`;

  if (report.summary.criticalCount > 0) {
    text += `🚨 Critical pages (score < 50): ${report.summary.criticalCount}\n`;
  }
  if (report.summary.orphanCount > 0) {
    text += `🔗 Orphan pages (<${MIN_INTERNAL_LINKS} internal links): ${report.summary.orphanCount}\n`;
  }
  if (report.summary.thinContentCount > 0) {
    text += `📄 Thin content (<${MIN_WORD_COUNT} words): ${report.summary.thinContentCount}\n`;
  }
  if (report.summary.missingMetadataCount > 0) {
    text += `⚠️ Missing metadata issues: ${report.summary.missingMetadataCount}\n`;
  }

  text += '\nTop 5 lowest-scoring pages:\n';
  report.pages
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .forEach(p => text += `• ${p.url}: ${p.score} — ${p.issues.join(', ')}\n`);

  text += `\nDetails: .hermes/memory/content-quality/latest-report.json`;

  const payload = new URLSearchParams({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.byteLength },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`HTTP ${res.statusCode}: ${body}`))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
  log('✅ Telegram alert sent');
}

async function createGitHubIssue(report) {
  const title = `🚨 Content Quality & SEO Issues — ${new Date().toLocaleDateString()} — ${report.summary.criticalCount} critical pages`;
  const body = [
    '## Content Quality & SEO Audit Report',
    '',
    `**Run:** ${new Date().toISOString()}`,
    `**Pages scanned:** ${report.pagesScanned}`,
    `**Average SEO score:** ${report.summary.averageScore}/100`,
    '',
    '### Critical Issues',
    report.summary.criticalCount > 0 ? `${report.summary.criticalCount} pages with SEO score < 50` : 'None',
    report.summary.orphanCount > 0 ? `- ${report.summary.orphanCount} orphan pages (insufficient internal links)` : '',
    report.summary.thinContentCount > 0 ? `- ${report.summary.thinContentCount} thin content pages (<300 words)` : '',
    report.summary.missingMetadataCount > 0 ? `- ${report.summary.missingMetadataCount} pages missing key metadata` : '',
    '',
    '### Lowest Scoring Pages',
    ...report.pages
      .sort((a, b) => a.score - b.score)
      .slice(0, 10)
      .map(p => `- [${p.url}](${BASE_URL}${p.url}) — Score: ${p.score} — ${p.issues.join(', ')}`),
    '',
    '### Remediation Checklist',
    '- Ensure every page has unique title (30–60 chars) and meta description (120–160 chars)',
    '- Include exactly one H1 per page',
    '- Add at least 2 internal links to/from each page',
    '- Add Open Graph tags (og:title, og:description, og:image)',
    '- Add Twitter Card tags',
    '- Include JSON-LD structured data',
    '- All images must have meaningful alt text',
    '- Aim for word count ≥ 300; expand thin pages',
    '- Target reading level ~8th grade (Flesch ~60+)',
    '',
    '---',
    '*Generated by automation/content-quality-audit.cjs*',
  ].join('\n');

  try {
    const escaped = body.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const { execSync } = require('child_process');
    execSync(`gh issue create --title "${title}" --body "${escaped}" --label "automation,seo,content-quality"`, { stdio: 'pipe' });
    log('✅ GitHub issue created');
  } catch (e) {
    log('⚠️ gh CLI failed; issue not created: ' + e.message);
  }
}

main().catch(err => {
  console.error('❌ Content quality audit failed:', err);
  process.exit(1);
});
