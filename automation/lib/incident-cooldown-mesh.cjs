#!/usr/bin/env node
/**
 * Shared cross-workflow escalation cooldown mesh (file-backed).
 * Used to reduce duplicate GitHub noise when multiple automations fire close together.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MESH_PATH = path.join(ROOT, 'automation', 'reports', 'automation-incident-cooldown-mesh.json');
const OBS_STATE = path.join(ROOT, 'automation', 'reports', 'observability-webhook-state.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function loadMesh() {
  const d = readJson(MESH_PATH);
  if (!d || typeof d !== 'object') {
    return { version: 1, updatedAt: null, fingerprints: {} };
  }
  if (!d.fingerprints || typeof d.fingerprints !== 'object') d.fingerprints = {};
  return d;
}

function writeMesh(mesh) {
  mesh.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(MESH_PATH), { recursive: true });
  fs.writeFileSync(MESH_PATH, `${JSON.stringify(mesh, null, 2)}\n`, 'utf8');
}

/**
 * Record that a workflow fingerprint recently escalated (issue, pager, etc.).
 * @param {string} fingerprint
 * @param {{ meta?: Record<string, unknown> }} [opts]
 */
function recordEscalation(fingerprint, opts = {}) {
  if (!fingerprint) return;
  const mesh = loadMesh();
  mesh.fingerprints[fingerprint] = {
    lastEscalationAt: new Date().toISOString(),
    ...(opts.meta ? { meta: opts.meta } : {}),
  };
  writeMesh(mesh);
}

/**
 * Generic suppression check across mesh fingerprints.
 * Useful when a workflow should avoid escalating if another automation just escalated.
 * @param {string} selfFp
 * @param {{ windowHours?: number }} [opts]
 */
function shouldSuppressEscalation(selfFp, opts = {}) {
  const windowH = Number(opts.windowHours || process.env.MESH_CROSS_WORKFLOW_HOURS || 8);
  const currentPriority = Number(opts.currentPriority || 0);
  const cutoff = Date.now() - windowH * 3600000;
  const mesh = loadMesh();
  for (const [fp, row] of Object.entries(mesh.fingerprints || {})) {
    if (selfFp && fp === selfFp) continue;
    const t = row?.lastEscalationAt ? new Date(row.lastEscalationAt).getTime() : 0;
    if (t && t >= cutoff) {
      const otherPriority = Number(row?.meta?.priorityScore || 0);
      if (otherPriority >= currentPriority) {
        return {
          suppress: true,
          reason: `mesh:${fp}`,
          lastAt: row.lastEscalationAt,
          competingPriority: otherPriority,
        };
      }
    }
  }
  return { suppress: false, reason: null, lastAt: null, competingPriority: null };
}

/**
 * Legacy scaffold drift: skip new GitHub escalation if another workflow escalated recently.
 * Checks mesh fingerprints (excluding self) + observability webhook lastAlertAt.
 */
function shouldSuppressLegacyEscalation(selfFp = 'ai-lab-legacy-scaffold-drift') {
  if (process.env.AI_LAB_LEGACY_MESH_DISABLE === '1') {
    return { suppress: false, reason: 'mesh-disabled' };
  }
  const windowH = Number(process.env.MESH_CROSS_WORKFLOW_HOURS || 8);
  const cutoff = Date.now() - windowH * 3600000;

  const mesh = loadMesh();
  for (const [fp, row] of Object.entries(mesh.fingerprints || {})) {
    if (fp === selfFp) continue;
    const t = row?.lastEscalationAt ? new Date(row.lastEscalationAt).getTime() : 0;
    if (t && t >= cutoff) {
      return { suppress: true, reason: `mesh:${fp}`, lastAt: row.lastEscalationAt };
    }
  }

  const obs = readJson(OBS_STATE);
  const lastAlert = obs?.lastAlertAt ? new Date(obs.lastAlertAt).getTime() : 0;
  if (lastAlert && lastAlert >= cutoff) {
    return { suppress: true, reason: 'observability-webhook-state', lastAt: obs.lastAlertAt };
  }

  return { suppress: false, reason: null };
}

module.exports = {
  MESH_PATH,
  recordEscalation,
  shouldSuppressEscalation,
  shouldSuppressLegacyEscalation,
  loadMesh,
};
