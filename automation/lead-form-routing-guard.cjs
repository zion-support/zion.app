#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'lead-form-routing-guard-latest.json');
const TARGET_EMAIL = 'commercial@ziontechgroup.com';

const CHECKS = [
  {
    file: 'app/utils/seoConstants.ts',
    requiredIncludes: ["email: 'commercial@ziontechgroup.com'"],
    kind: 'contact-source-of-truth',
  },
  {
    file: 'app/components/ContactFormClient.tsx',
    requiredIncludes: ['mailto:${CONTACT_INFO.email}', 'onSubmit={handleSubmit}'],
    forbiddenIncludes: ['mailto:privacy@', 'mailto:press@'],
    kind: 'contact-form',
  },
  {
    file: 'app/components/NewsletterSignup.tsx',
    requiredIncludes: ['mailto:${CONTACT_INFO.email}'],
    kind: 'newsletter-form',
  },
  {
    file: 'app/blog/BlogNewsletterSignup.tsx',
    requiredIncludes: ['mailto:${CONTACT_INFO.email}'],
    kind: 'blog-newsletter-form',
  },
  {
    file: 'app/contact/page.tsx',
    requiredIncludes: ['href: `mailto:${CONTACT_INFO.email}`'],
    kind: 'contact-page-mailto',
  },
];

function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch {
    return '';
  }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const findings = [];
  const details = [];
  for (const check of CHECKS) {
    const content = read(check.file);
    if (!content) {
      findings.push({
        type: 'missing-file',
        severity: 'critical',
        file: check.file,
        detail: 'Expected lead/contact file not found.',
      });
      continue;
    }
    const missingReq = (check.requiredIncludes || []).filter((x) => !content.includes(x));
    const forbiddenPresent = (check.forbiddenIncludes || []).filter((x) => content.includes(x));
    if (missingReq.length) {
      findings.push({
        type: 'missing-required-routing-token',
        severity: 'critical',
        file: check.file,
        detail: `Missing required tokens: ${missingReq.join(', ')}`,
      });
    }
    if (forbiddenPresent.length) {
      findings.push({
        type: 'forbidden-routing-token',
        severity: 'critical',
        file: check.file,
        detail: `Forbidden tokens present: ${forbiddenPresent.join(', ')}`,
      });
    }
    details.push({
      file: check.file,
      kind: check.kind,
      ok: missingReq.length === 0 && forbiddenPresent.length === 0,
      missingRequired: missingReq,
      forbiddenPresent,
    });
  }

  const status = findings.length ? 'critical' : 'healthy';
  const payload = {
    generatedAt: new Date().toISOString(),
    targetEmail: TARGET_EMAIL,
    status,
    findings,
    checks: details,
  };
  writeJson(REPORT, payload);
  console.log('lead-form-routing-guard:', JSON.stringify({ status, findings: findings.length }));
}

main();
