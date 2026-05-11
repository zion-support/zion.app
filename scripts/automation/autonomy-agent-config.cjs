#!/usr/bin/env node

const AUTONOMY_AGENT_CONFIG = {
  releaseGuardian: {
    scheduleCron: '*/30 * * * *',
    attempts: 3,
    intervalMs: 15000,
    unhealthyRoutesAlertThreshold: 2,
    strictFailureThreshold: 4,
    maxRoutesToCheck: 20,
  },
  qualityDrift: {
    scheduleCron: '45 */6 * * *',
    historyWindow: 30,
    failureStreakAlertThreshold: 2,
    strictFailureCountThreshold: 2,
    commandTimeoutMs: 12 * 60 * 1000,
  },
  growthSignal: {
    scheduleCron: '15 */8 * * *',
    minPromotedRoutes: 6,
    liveUnhealthyThreshold: 2,
    maxLiveRoutesToCheck: 12,
  },
  queueGuard: {
    scheduleCron: '*/20 * * * *',
    maxConcurrentWriters: 1,
    staleRunMinutes: 90,
    // Prefer explicit workflow file matching to avoid false positives.
    // Keywords remain as a fallback for renamed workflows.
    writerWorkflowFiles: [
      '.github/workflows/ai-ultra-fast-content.yml',
      '.github/workflows/ai-content-maximum-velocity.yml',
      '.github/workflows/ai-content-max-velocity-deploy.yml',
      '.github/workflows/ai-content-maximum-velocity.yml',
      '.github/workflows/ai-content-burst.yml',
      '.github/workflows/ai-content-burst-high-frequency.yml',
      '.github/workflows/ai-live-content-ideas.yml',
      '.github/workflows/ai-content-ideas-deploy.yml',
      '.github/workflows/ai-content-ideas-and-evolution-deploy.yml',
      '.github/workflows/ai-uninterruptable-content-loop.yml',
      '.github/workflows/ai-app-improvement-evolution.yml',
      '.github/workflows/ai-continuous-improvement.yml',
      '.github/workflows/ai-development-agent.yml',
      '.github/workflows/ai-app-improvement-daily-quick.yml',
    ],
    writerWorkflowKeywords: [
      'content',
      'autonomous',
      'automation',
      'uninterruptable',
      'ultra-fast',
    ],
  },
};

module.exports = { AUTONOMY_AGENT_CONFIG };
