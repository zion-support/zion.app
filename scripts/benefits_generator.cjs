/**
 * benefits_generator.cjs — Auto-generate benefit statements for all services
 * 
 * Replaces all `"benefits": []` with 3-6 concrete benefits derived from:
 *   1. Feature text → user-result benefit templates (deterministic)
 *   2. Description verbs / action phrases → implied outcomes
 *   3. Category-specific templates for gaps
 * 
 * Zero API cost. Deterministic. Idempotent (safe to re-run).
 * Usage: node scripts/benefits_generator.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_TS = path.join('app', 'data', 'servicesData.ts');

// ── Templates: convert feature phrases to benefit sentences ──────────────
// Strategy: extract a "How it maps to deliver value" statement

function slot(feature, category) {
  const f = feature.toLowerCase();
  if (f.includes('automated') || f.includes('auto-') || f.includes('auto '))
    return `Automate complex ${category} workflows to reduce manual effort and human error.`;
  if (f.includes('real-time') || f.includes('realtime') || f.includes('live '))
    return `Act on live data and events instantly rather than waiting for batch reports.`;
  if (f.includes('analytics') || f.includes('analytics') || f.includes('insights') || f.includes('reports'))
    return `Make decisions backed by real analytical insight instead of guesswork.`;
  if (f.includes('detection') || f.includes('detect') || f.includes('anomaly') || f.includes('monitoring'))
    return `Catch issues before they escalate with intelligent continuous monitoring.`;
  if (f.includes('compliance') || f.includes('audit') || f.includes('regulatory'))
    return `Meet regulatory requirements automatically and maintain complete audit trail.`;
  if (f.includes('orchestration') || f.includes('orchestrat') || f.includes('workflow'))
    return `Coordinate complex multi-step workflows end-to-end with no manual handoffs.`;
  if (f.includes('integrat') || f.includes('connector') || f.includes('api') || f.includes('sync'))
    return `Seamlessly connect all your tools and data sources in a unified workflow.`;
  if (f.includes('predict') || f.includes('forecast') || f.includes('forecasting'))
    return `Anticipate demand, risk, or opportunity before it happens — not after.`;
  if (f.includes('generation') || f.includes('generat') || f.includes('content'))
    return `Produce high-quality content at scale without the production bottlenecks.`;
  if (f.includes('optimization') || f.includes('optimiz') || f.includes('optimi'))
    return `Get more output from the same resources through continuous process optimisation.`;
  if (f.includes('security') || f.includes('secure') || f.includes('protect') || f.includes('threat'))
    return `Protect your organisation's digital assets and customer data from threats.`;
  if (f.includes('cost') || f.includes('expense') || f.includes('spending'))
    return `Cut operational costs while maintaining or improving service quality.`;
  if (f.includes('customer') || f.includes('support') || f.includes('cx ') || f.includes('client'))
    return `Improve customer experience and satisfaction through faster, more personalised service.`;
  if (f.includes('data') && (f.includes('quality') || f.includes('clean') || f.includes('validat')))
    return `Ensure data quality at every stage of the pipeline before decisions are made.`;
  if (f.includes('training') || f.includes('learning') || f.includes('education') || f.includes('tutor'))
    return `Accelerate skill development and knowledge transfer across your team.`;
  if (f.includes('migration') || f.includes('modernis') || f.includes('legacy') || f.includes('upgrade'))
    return `Modernise legacy systems without disrupting ongoing operations.`;
  if (f.includes('testing') || f.includes('qa ') || f.includes('test ') || f.includes('validat'))
    return `Catch defects and prevent regressions faster with automated quality gates.`;
  if (f.includes('supply') || f.includes('logistic') || f.includes('inventory'))
    return `Optimise supply chain efficiency and reduce delays across the fulfilment network.`;
  if (f.includes('cloud') && (f.includes('optim') || f.includes('cost') || f.includes('effici')))
    return `Reduce cloud spend and improve resource utilisation rights-sized to demand.`;
  return null;
}

function benefitFromFeature(feature, category) {
  const f = feature.toLowerCase();
  const direct = slot(feature, category);
  if (direct) return direct;
  // Fallback: title-case the feature as a readable sentence-ending benefit
  const title = feature.startsWith(feature[0].toUpperCase()) 
    ? feature 
    : feature.charAt(0).toUpperCase() + feature.slice(1);
  return `Deliver ${title.toLowerCase()} — giving your team a clear operational advantage.`;
}

function generateBenefits(service) {
  const { features, description, category } = service;
  if (!features || features.length === 0) return [];
  
  const seen = new Set();
  const benefits = [];
  
  // 1. From features (up to 3 benefit statements)
  const usedFeatures = new Set();
  for (const feature of features) {
    if (benefits.length >= 3) break;
    if (usedFeatures.has(feature)) continue;
    usedFeatures.add(feature);
    const b = benefitFromFeature(feature, category);
    if (!seen.has(b)) { seen.add(b); benefits.push(b); }
  }
  
  // 2. From description (up to 2 more)
  if (description && benefits.length < 5) {
    const desc = description.replace(/\.{3}/g, '').split(/[.!?]/);
    for (const sentence of desc) {
      const s = sentence.trim();
      if (s.length < 30 || s.length > 180) continue;
      // Only use substantive sentences (not single words, not "TBD" fragments)
      if (!/[a-z]{3,}/i.test(s)) continue;
      const benefit = s.startsWith(s[0].toUpperCase()) 
        ? s : s.charAt(0).toUpperCase() + s.slice(1);
      if (!seen.has(benefit) && benefits.length < 5) {
        seen.add(benefit);
        benefits.push(benefit);
      }
    }
  }
  
  // 3. Pad to at least 3 with category templates
  if (benefits.length < 3) {
    const catTemplates = {
      ai:         ['Leverage state-of-the-art AI capabilities without hiring a specialised team.','Deploy enterprise-grade AI solutions at a fraction of the typical cost.','Automate complex tasks to free your team to focus on high-impact work.'],
      it:         ['Reduce IT overhead and free your engineers to build, not maintain.','Strengthen your security posture without a dedicated in-house team.','Scale your infrastructure cost-effectively as your business grows.'],
      cloud:      ['Right-size your cloud spend and eliminate over-provisioned resources.','Build on managed infrastructure so your team focuses on product, not ops.','Spin up environments in minutes instead of days or weeks.'],
      security:   ['Stay ahead of threats with continuous, automated security monitoring.','Comply with industry regulations without a dedicated compliance team.','Rapidly respond to incidents with built-in detection, alerting, and remediation.'],
      data:       ['Turn raw data into actionable insight without a data engineering team.','Eliminate data silos and create a single source of truth.','Build on data pipelines that scale with your business.'],
      automation: ['Eliminate repetitive manual processes that drain productivity.','Connect your entire tech stack so data flows automatically.','Respond to business demands faster by replacing manual coordination.'],
    };
    for (const t of (catTemplates[category] || catTemplates.ai)) {
      if (!seen.has(t) && benefits.length < 5) {
        seen.add(t);
        benefits.push(t);
      }
    }
  }
  
  // 4. Ensure ≥3 benefits
  while (benefits.length < 3) {
    const filler = `Improve ${category} performance and accelerate delivery across your organisation.`;
    benefits.push(filler);
  }
  
  return benefits.slice(0, 6);
}

// ── Parse the TS file ────────────────────────────────────────────────────
const raw = fs.readFileSync(DATA_TS, 'utf8');

// Map id → service object (reconstruct the services.length-entry array)
const ENTRY_RE = /(\{[^}]+\{[^}]+\}[^}]*\},?|,\s*\{[^}]+\},?)/g;
const entries = raw.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || [];
console.log(`Matched ${entries.length} candidate objects`);

let updatedCount = 0;
let emptyKept    = 0;
const newEntries = entries.map((entry, idx) => {
  // Find fields in this entry
  const idMatch   = entry.match(/id:\s*'([^']+)'/);
  const titleM    = entry.match(/title:\s*'([^']+)'/);
  // Detect benefits: []
  const benefitsEmpty = entry.includes("benefits: []");
  if (!idMatch) return entry;
  
  const featureMatch = entry.match(/features:\s*\[([^\]]*)\]/);
  const descMatch    = entry.match(/description:\s*'([^']*)'/);
  const catMatch     = entry.match(/category:\s*'([^']+)'/);
  
  const features = featureMatch 
    ? featureMatch[1].split(/,\s*/).map(f => f.replace(/[^a-zA-Z0-9\s&+\-–—–—,.]/g,'').trim()).filter(Boolean)
    : [];
  const desc = descMatch ? descMatch[1] : '';
  const category = catMatch ? catMatch[1] : 'ai';
  
  if (!benefitsEmpty) {
    emptyKept++;
    return entry;
  }
  
  const benefits = generateBenefits({ id: idMatch[1], title: titleM?.[1] || idMatch[1], features, description: desc, category });
  updatedCount++;
  
  // Replace the benefits: [] block with the new array
  const newEntry = entry.replace(
    /benefits:\s*\[\]/,
    `benefits: [${benefits.map(b => `'${b.replace(/'/g, "\\'")}'`).join(', ')}]`
  );
  return newEntry;
});

const newContent = raw
  .split('\n')
  .map(line => line)
  .join('\n');

// Instead of line-by-line, let's work on objects directly
// Re-do: find "benefits: []" in each entry context and replace

function replaceBenefits(tsContent) {
  const result = [];
  let depth = 0;
  let currentObj = '';
  let inObj = false;
  let foundObj = false;
  
  for (const char of tsContent) {
    currentObj += char;
    if (char === '{' && !foundObj) {
      depth++;
      inObj = true;
    }
    if (char === '}' && inObj) {
      depth--;
      if (depth === 0) {
        // Full object collected — check it
        if (currentObj.includes('benefits: []')) {
          foundObj = true;
          // Extract id, features, desc, cat
          const idM    = currentObj.match(/id:\s*'([^']+)'/);
          const featM  = currentObj.match(/features:\s*\[([^\]]*)\]/);
          const descM  = currentObj.match(/description:\s*'([^']*)'/);
          const catM   = currentObj.match(/category:\s*'([^']+)'/);
          
          const title  = currentObj.match(/title:\s*'([^']+)'/)?.[1] || idM?.[1] || '';
          const features = featM
            ? featM[1].split(',').map(f => f.replace(/[^a-zA-Z0-9\s&+\-.,]/g,'').trim()).filter(Boolean)
            : [];
          const description = descM?.[1] || '';
          const category = catM?.[1] || 'ai';
          
          const benefits = generateBenefits({ id: idM?.[1], title, features, description, category });
          
          let replaced = currentObj.replace(
            /\s*benefits:\s*\[\]\s*,?/,
            `\n    benefits: [${benefits.map(b => `'${b.replace(/'/g, "\\'")}'`).join(', ')}],`
          );
          result.push(replaced);
          updatedCount++;
        } else {
          result.push(currentObj);
        }
        currentObj = '';
        inObj = false;
        foundObj = false;
      }
    }
  }
  // Push remainder
  if (currentObj) result.push(currentObj);
  
  return result.join('');
}

console.log(`\nRe-running benefits generator over ${entries.length} object candidates...`);

const output = replaceBenefits(raw);

if (output.length !== raw.length) {
  fs.writeFileSync(DATA_TS, output);
  console.log(`\n✅  Updated ${updatedCount} services with generated benefits`);
  console.log(`   (${emptyKept} unchanged — already had non-empty benefits)`);
  console.log(`   File: ${DATA_TS}`);
} else {
  console.log('⚠️  Output length same as input — check parsing');
}
