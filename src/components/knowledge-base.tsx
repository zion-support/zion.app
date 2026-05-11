'use client';

import { useState, useEffect } from 'react';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: Date;
}

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: 'kb-001',
    title: 'AI Auto-Deploy Configuration',
    category: 'deployment',
    content: 'Configured next.config.js for static export with basePath: "/zion-app". All builds now output to /out and deploy automatically via GitHub Pages workflow.',
    createdAt: new Date()
  },
  {
    id: 'kb-002',
    title: 'AI Agent Framework',
    category: 'infrastructure',
    content: 'Autonomous agents monitor build status, run health checks, and trigger redeployments when needed. They also log all actions in MEMORY.md for audit trails.',
    createdAt: new Date(),
    tags: ['automation', 'cron'],
  },
  {
    id: 'kb-003',
    title: 'CMS Integration Blueprint',
    category: 'documentation',
    content: 'Blueprint for integrating headless CMS (e.g., Sanity or Contentful) with Next.js App Router using the `next-source` utility. Includes TypeScript definitions and webhook triggers for content updates.',
    lastUpdated: new Date(),
    tags: ['cms', 'integration']
  },
  {
    id: 'kb-005',
    title: 'CI/CD Pipeline Blueprint',
    category: 'operations',
    content: 'Defines the full pipeline: lint -> build -> test -> deploy. Includes caching, artifact retention, and status badges. CI/CD workflow now handles static export and deploys to GitHub Pages without external tools.',
    createdAt: new Date(),
    tags: ['ci', 'deployment', 'ci/cd']
  },
  {
    id: 'kb-006',
    title: 'Cron Scheduler Configuration',
    category: 'ops',
    content: `The appropriate cron pattern for Zion Tech Group's current workload is: \n\\* * * * * node /root/.openclaw/workspace/zion.app/nightly-audit.js \\nexec node /root/.openclaw/workspace/zion.app/scripts/audit.js \\nexec node /root/.openclaw/workspace/zion.app/node_modules/.bin/gh && echo "Auto-prune stale branches every 24h" \\nexec node /root/.openclaw/workspace/zion.app/scripts/cleanup-branches.sh\ntask schedule:0 3 * * * /root/.openclaw/workspace/zion.app/scripts/nightly-audit.js\n`,
  }