#!/usr/bin/env node
/**
 * Lead Routing Synthetic Intelligence v2
 * Additive guardrail: verifies key app surfaces retain commercial routing references.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const OUT_JSON = path.join(REPORT_DIR, 'lead-routing-synthetic-intelligence-v2-latest.json');
const OUT_MD = path.join(REPORT_DIR, 'lead-routing-synthetic-intelligence-v2-latest.md');

const REQUIRED_EMAIL = 'commercial@ziontechgroup.com';
const TARGETS = [
  {
    file: 'app/utils/seoConstants.ts',
    required: true,
    requiredIncludes: [REQUIRED_EMAIL],
  },
  {
    file: 'app/components/ContactFormClient.tsx',
    required: true,
    requiredIncludes: ['mailto:${CONTACT_INFO.email}', 'onSubmit={handleSubmit}'],
  },
  {
    file: 'app/components/NewsletterSignup.tsx',
    required: true,
    requiredIncludes: ['mailto:${CONTACT_INFO.email}'],
  },
  {
    file: 'app/blog/BlogNewsletterSignup.tsx',
    required: true,
    requiredIncludes: ['mailto:${CONTACT_INFO.email}'],
  },
  {
    file: 'app/contact/page.tsx',
    required: true,
    requiredIncludes: ['href: `mailto:${CONTACT_INFO.email}`'],
  },
];

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const findings = [];
  for (const target of TARGETS) {
    const abs = path.join(ROOT, target.file);
    const blob = read(abs);
    if (!blob) {
      findings.push({
        file: target.file,
        severity: target.required ? 'critical' : 'warning',
        detail: 'file missing or unreadable',
      });
      continue;
    }
    const requiredIncludes = target.requiredIncludes || [REQUIRED_EMAIL];
    const missing = requiredIncludes.filter((token) => !blob.includes(token));
    if (missing.length > 0) {
      findings.push({
        file: target.file,
        severity: target.required ? 'critical' : 'warning',
        detail: `missing routing token(s): ${missing.join(', ')}`,
      });
    }
  }

  const critical = findings.filter((f) => f.severity === 'critical').length;
  const warning = findings.filter((f) => f.severity === 'warning').length;
  const status = critical > 0 ? 'critical' : warning > 0 ? 'warning' : 'nominal';
  const score = Math.max(0, 100 - critical * 40 - warning * 10);

  const payload = {
    generatedAt: new Date().toISOString(),
    version: 2,
    status,
    score,
    requiredEmail: REQUIRED_EMAIL,
    checkedFiles: TARGETS.map((t) => t.file),
    counts: { total: findings.length, critical, warning },
    findings,
  };
  writeJson(OUT_JSON, payload);

  const lines = [
    '# Lead routing synthetic intelligence v2',
    '',
    `Generated: ${payload.generatedAt}`,
    `Status: **${status}** | Score: **${score}**`,
    '',
    '## Findings',
    '',
  ];
  if (!findings.length) {
    lines.push('- No findings. Routing references are healthy.');
  } else {
    for (const f of findings) {
      lines.push(`- [${f.severity}] ${f.file}: ${f.detail}`);
    }
  }
  lines.push('');
  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `lead_routing_v2_status=${status}\n`, 'utf8');
  }
  console.log(`lead-routing-synthetic-intelligence-v2: status=${status} findings=${findings.length}`);
}

main();
