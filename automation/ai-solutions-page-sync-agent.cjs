#!/usr/bin/env node

/**
 * AI Solutions Page Sync Agent
 *
 * Ensures the solutions page Industry Solutions section includes all industry
 * links from the industries page. When industries page is updated with new
 * solution pages, this agent adds the missing links to solutions page.
 *
 * Usage:
 *   node automation/ai-solutions-page-sync-agent.cjs run
 *   node automation/ai-solutions-page-sync-agent.cjs run --apply
 *
 * With --apply: writes changes to app/solutions/page.tsx
 * Without: reports missing links only
 *
 * Output: automation/reports/solutions-page-sync-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INDUSTRIES_PAGE = path.join(ROOT, 'app', 'industries', 'page.tsx');
const SOLUTIONS_PAGE = path.join(ROOT, 'app', 'solutions', 'page.tsx');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SolutionsSync] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function extractIndustriesFromPage() {
  const content = fs.readFileSync(INDUSTRIES_PAGE, 'utf8');
  const industries = [];
  const blockRe = /\{\s*industry:\s*['"]([^'"]+)['"],[\s\S]*?href:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    const href = m[2];
    if (href.startsWith('/solutions/') && href !== '/solutions') {
      industries.push({ industry: m[1], href });
    }
  }
  return industries;
}

function extractSolutionLinksFromPage() {
  const content = fs.readFileSync(SOLUTIONS_PAGE, 'utf8');
  const links = [];
  const re = /href="(\/solutions\/[^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m[1] !== '/solutions') links.push(m[1]);
  }
  return [...new Set(links)];
}

function industryLabelFromHref(href) {
  const slug = href.replace('/solutions/', '');
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
    .replace(/And/g, '&')
    .replace(/3pl/g, '3PL')
    .replace(/SaaS/g, 'SaaS')
    .replace(/Cpg/g, 'CPG');
}

function run(apply = false) {
  ensureDirs();
  log('Scanning industries and solutions pages...');

  const industries = extractIndustriesFromPage();
  const industryHrefs = new Set(industries.map((i) => i.href));
  const industryByHref = Object.fromEntries(industries.map((i) => [i.href, i.industry]));

  const solutionLinks = extractSolutionLinksFromPage();
  const solutionHrefs = new Set(solutionLinks);

  const missing = [];
  for (const href of industryHrefs) {
    if (!solutionHrefs.has(href)) {
      missing.push({
        href,
        label: industryByHref[href] || industryLabelFromHref(href),
      });
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    industriesCount: industries.length,
    solutionLinksCount: solutionLinks.length,
    missingCount: missing.length,
    missing,
    applied: false,
  };

  if (missing.length === 0) {
    log('Solutions page is in sync with industries page.');
    const outPath = path.join(REPORTS_DIR, 'solutions-page-sync-latest.json');
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    return report;
  }

  log(`Found ${missing.length} industry links missing from solutions page:`);
  missing.forEach((m) => log(`   - ${m.label} → ${m.href}`));

  if (apply) {
    log('Applying changes to solutions page...');
    let content = fs.readFileSync(SOLUTIONS_PAGE, 'utf8');

    const insertMarker = '<Link\n              href="/industries"';
    const linkBlock = missing
      .map(
        (m) =>
          `            <Link
              href="${m.href}"
              className="inline-flex items-center rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
            >
              ${m.label}
              <ArrowRight className="ml-2 h-3.5 w-3.5 text-purple-400" />
            </Link>`
      )
      .join('\n');

    if (content.includes(insertMarker)) {
      content = content.replace(
        insertMarker,
        linkBlock + '\n            ' + insertMarker
      );
      fs.writeFileSync(SOLUTIONS_PAGE, content);
      report.applied = true;
      log('Solutions page updated.');
    } else {
      log('Could not find insert point. Manual update may be needed.');
    }
  } else {
    log('Run with --apply to add missing links.');
  }

  const outPath = path.join(REPORTS_DIR, 'solutions-page-sync-latest.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  log(`Report saved to ${outPath}`);

  return report;
}

const apply = process.argv.includes('--apply');
run(apply);
