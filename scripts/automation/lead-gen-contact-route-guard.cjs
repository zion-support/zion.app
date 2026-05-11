#!/usr/bin/env node
/* eslint-disable no-console */

async function get(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error('timeout')), 25000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'zion-lead-gen-guard/1.0' },
      redirect: 'follow',
      signal: controller.signal,
    });
    const body = await res.text();
    return { status: res.status, body, finalUrl: res.url };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const base = (process.env.LEAD_GEN_BASE_URL || 'https://ziontechgroup.com').replace(/\/$/, '');
  const contact = `${base}/contact`;
  const expected = (process.env.LEAD_GEN_EXPECTED_EMAIL || 'commercial@ziontechgroup.com').toLowerCase();

  const resp = await get(contact);
  const okStatus = resp.status >= 200 && resp.status < 400;
  const hasEmail = String(resp.body || '').toLowerCase().includes(expected);

  if (!okStatus || !hasEmail) {
    console.error('[lead-gen-guard] failed', {
      status: resp.status,
      hasEmail,
      expected,
      finalUrl: resp.finalUrl,
    });
    process.exit(1);
  }
  console.log('[lead-gen-guard] ok', { status: resp.status, email: expected, finalUrl: resp.finalUrl });
}

main().catch((e) => {
  console.error('[lead-gen-guard]', e.message || e);
  process.exit(1);
});
