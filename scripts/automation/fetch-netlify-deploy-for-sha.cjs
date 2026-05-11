#!/usr/bin/env node
/**
 * Optional: resolve Netlify deploy id/url for the current commit via Netlify API.
 * Writes NETLIFY_DEPLOY_ID and NETLIFY_DEPLOY_URL to GITHUB_ENV when running in Actions.
 *
 * Env:
 *   NETLIFY_AUTH_TOKEN - Personal access token with deploy read (required)
 *   NETLIFY_SITE_ID     - Site API id (required)
 *   GITHUB_SHA          - Full commit sha to match (required)
 *   GITHUB_ENV          - Set by GitHub Actions for env propagation
 *   NETLIFY_DEPLOY_POLL_ATTEMPTS — default 5 (waits for new deploy to appear)
 *   NETLIFY_DEPLOY_POLL_DELAY_MS — default 12000
 *   NETLIFY_DEPLOY_CACHE_TTL_MS — default 900000 (15m) for warm cache reuse
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(process.cwd(), 'automation', 'reports', 'netlify-deploy-lookup-cache-latest.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'zion-deploy-correlation/1.0',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on('error', reject);
    req.setTimeout(25_000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

function pickDeployUrl(pick) {
  if (!pick) return '';
  return (
    pick.deploy_ssl_url ||
    pick.ssl_url ||
    pick.url ||
    (pick.admin_url ? String(pick.admin_url).replace(/\/deploys\/.*/, `/deploys/${pick.id}`) : '')
  );
}

function findMatchingDeploy(deploys, sha, short) {
  if (!Array.isArray(deploys)) return null;
  return deploys.find(
    (d) =>
      d &&
      (d.commit_ref === sha ||
        d.commit_ref === short ||
        (typeof d.commit_ref === 'string' && sha.startsWith(d.commit_ref)) ||
        (typeof d.sha === 'string' && (d.sha === sha || d.sha.startsWith(short)))),
  );
}

function writeGithubEnv(pick) {
  const deployUrl = pickDeployUrl(pick);
  const ghEnv = process.env.GITHUB_ENV;
  if (ghEnv) {
    const esc = (s) => String(s).replace(/\n/g, ' ');
    fs.appendFileSync(ghEnv, `NETLIFY_DEPLOY_ID=${esc(pick.id)}\n`);
    if (deployUrl) {
      fs.appendFileSync(ghEnv, `NETLIFY_DEPLOY_URL=${esc(deployUrl)}\n`);
    }
    console.log('Wrote Netlify deploy metadata to GITHUB_ENV:', pick.id);
  } else {
    console.log('NETLIFY_DEPLOY_ID=', pick.id);
    console.log('NETLIFY_DEPLOY_URL=', deployUrl || '');
  }
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(payload) {
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  } catch {
    /* non-fatal */
  }
}

async function main() {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  const sha = (process.env.GITHUB_SHA || '').trim();

  if (!token || !siteId || !sha || sha === 'unknown') {
    console.log('fetch-netlify-deploy-for-sha: skip (missing NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, or GITHUB_SHA)');
    process.exit(0);
  }

  const short = sha.slice(0, 7);
  const url = `https://api.netlify.com/api/v1/sites/${encodeURIComponent(siteId)}/deploys?per_page=20`;
  const maxAttempts = Math.min(12, Math.max(1, Number(process.env.NETLIFY_DEPLOY_POLL_ATTEMPTS || 5)));
  const delayMs = Math.min(120_000, Math.max(3_000, Number(process.env.NETLIFY_DEPLOY_POLL_DELAY_MS || 12_000)));
  const cacheTtlMs = Math.max(60_000, Number(process.env.NETLIFY_DEPLOY_CACHE_TTL_MS || 15 * 60_000));

  let lastDeploys = null;
  const cache = readCache();
  if (
    cache &&
    cache.siteId === siteId &&
    cache.sha === sha &&
    cache.deployId &&
    cache.deployUrl &&
    cache.fetchedAt &&
    Date.now() - new Date(cache.fetchedAt).getTime() <= cacheTtlMs
  ) {
    console.log('fetch-netlify-deploy-for-sha: using warm cache hit');
    writeGithubEnv({ id: cache.deployId, deploy_ssl_url: cache.deployUrl });
    process.exit(0);
  }

  try {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const deploys = await getJson(url, token);
      lastDeploys = deploys;

      if (!Array.isArray(deploys)) {
        console.warn('Unexpected Netlify response shape');
        process.exit(0);
      }

      const match = findMatchingDeploy(deploys, sha, short);
      if (match && match.id) {
        console.log(`fetch-netlify-deploy-for-sha: matched commit on attempt ${attempt}/${maxAttempts}`);
        writeGithubEnv(match);
        writeCache({
          fetchedAt: new Date().toISOString(),
          siteId,
          sha,
          deployId: match.id,
          deployUrl: pickDeployUrl(match),
        });
        process.exit(0);
      }

      console.log(
        `fetch-netlify-deploy-for-sha: no sha match yet (attempt ${attempt}/${maxAttempts}); next poll in ${delayMs}ms`,
      );

      if (attempt < maxAttempts) {
        await sleep(delayMs);
      }
    }

    const deploys = Array.isArray(lastDeploys) ? lastDeploys : [];
    const fallback = findMatchingDeploy(deploys, sha, short) || deploys[0];
    if (!fallback || !fallback.id) {
      console.log('No Netlify deploy matched; skipping env export.');
      process.exit(0);
    }
    console.warn('fetch-netlify-deploy-for-sha: using fallback deploy (no exact sha match after polling)');
    writeGithubEnv(fallback);
    writeCache({
      fetchedAt: new Date().toISOString(),
      siteId,
      sha,
      deployId: fallback.id,
      deployUrl: pickDeployUrl(fallback),
      fallback: true,
    });
  } catch (err) {
    console.warn('fetch-netlify-deploy-for-sha (non-fatal):', err.message || err);
    process.exit(0);
  }
}

main();
