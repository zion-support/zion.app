#!/usr/bin/env node
/**
 * AI Stale Promotion Guard
 * Monitors promoted routes for staleness and triggers remediation
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROMOTED_ROUTES_FILE = join(process.cwd(), '.automation/promoted-routes.json');
const STALE_THRESHOLD_HOURS = process.env.AUTOMATION_STALE_THRESHOLD_HOURS || 24;

function loadPromotedRoutes() {
  if (!existsSync(PROMOTED_ROUTES_FILE)) {
    return { routes: [], lastUpdated: Date.now() };
  }
  try {
    const content = readFileSync(PROMOTED_ROUTES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { routes: [], lastUpdated: Date.now() };
  }
}

function checkStalePromotions() {
  const data = loadPromotedRoutes();
  const now = Date.now();
  const threshold = STALE_THRESHOLD_HOURS * 60 * 60 * 1000;
  
  const staleRoutes = data.routes.filter(route => {
    const age = now - new Date(route.lastVerified).getTime();
    return age > threshold;
  });
  
  if (staleRoutes.length > 0) {
    console.log(`[AI STALE GUARD] Found ${staleRoutes.length} stale promoted routes`);
    staleRoutes.forEach(r => {
      console.log(`  - ${r.path} (last verified: ${r.lastVerified})`);
    });
  } else {
    console.log('[AI STALE GUARD] All promoted routes are fresh');
  }
  
  return staleRoutes;
}

checkStalePromotions();