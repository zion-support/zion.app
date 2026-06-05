// app/data/agent-logs.ts
// Static agent log data — agents update this file directly or via the dashboard UI

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  bot: string;
  action: string;
  result: string;
  category: 'wave' | 'fix' | 'integration' | 'research' | 'quality' | 'infra' | 'coordination' | 'deploy' | 'design' | 'monitoring' | 'security';
  duration?: string;
}

export interface AgentStatus {
  name: string;
  telegram: string;
  role: string;
  emoji: string;
  status: 'active' | 'available' | 'idle';
  currentTask: string;
  tasksCompleted: number;
  lastAction: string;
  lastActionTime: string;
  uptime: string;
  specialty: string;
  todayActions: number;
  weekActions: number;
}

export const INITIAL_AGENT_LOGS: AgentLogEntry[] = [
  { id: 'log-039', timestamp: '2026-06-17 12:00', bot: '@OWL', action: 'Monitoring dashboard v2 — Enhanced homepage banner + fleet data', result: 'Created AgentsMonitoring.tsx component with live fleet status, stats, recent activity. Updated agent-logs.ts with latest data. Homepage now shows prominent AI agent banner between hero and content.', category: 'monitoring', duration: '45m' },
  { id: 'log-040', timestamp: '2026-06-17 00:00', bot: '@OWL', action: 'ORGANIZE #15 — Fleet self-organization + monitoring dashboard enhancement', result: 'Site 200 OK. Updated coord doc with org intelligence section. P1-2 stale >96h. Wave-research cron flagged ❌. Fleet: 3 active, 2 available.', category: 'coordination', duration: '30m' },
  { id: 'log-041', timestamp: '2026-06-15 02:00', bot: '@OWL', action: 'ORGANIZE #14 — Stale audit + fleet balance', result: 'Site 200 OK. P1-2 stale >72h across 5 checks. Wave 212 done (37 waves, ~800 services). Fleet balance OK.', category: 'coordination', duration: '20m' },
  { id: 'log-042', timestamp: '2026-06-14 22:30', bot: '@OWL', action: 'ORGANIZE #10 — Task board reorganization + delegation', result: 'Wave 213 research → @tablet (in-progress). Wave 213 integration → @OWL (queued). CI/CD timeout → @Rocket (queued). Wave 211 restructure verified (@Carol).', category: 'coordination', duration: '45m' },
  { id: 'log-043', timestamp: '2026-06-14 22:00', bot: '@OWL', action: 'Deep crawl — full site verification', result: '18/18 core pages OK (200), 0 broken links. All nav pages + dashboard + agents-monitoring verified.', category: 'monitoring', duration: '12m' },
  { id: 'log-044', timestamp: '2026-06-14 21:00', bot: '@OWL', action: 'Deep crawl — wave 212 verification', result: '20/20 OK. Wave 212 services live: AI Observability, Data Privacy, FinOps, Threat Intel, AI Transparency.', category: 'quality', duration: '15m' },
  { id: 'log-045', timestamp: '2026-06-14 19:30', bot: '@OWL', action: 'Deep link crawl — wave 211 404 fix', result: 'Found 3 wave 211 services 404. Root cause: wave211.ts never committed to git. Fixed and pushed. All 5 services now 200 OK.', category: 'fix', duration: '30m' },
  { id: 'log-046', timestamp: '2026-06-14 20:30', bot: '@tablet_kleber_bot', action: 'Wave 212 research — 5 new services', result: 'AI Observability, Data Privacy Consent, Cloud FinOps Governance, Security Threat Intelligence, AI Transparency Engine. 39 waves, ~800 services total.', category: 'research', duration: '2h' },
  { id: 'log-047', timestamp: '2026-06-14 01:00', bot: '@OWL', action: 'Dashboard v6 — Enhanced monitoring + client view', result: 'Full dashboard at /agents-monitoring with Ops/Client views, 5 tabs, live agent status, cron jobs, activity log, recording indicator.', category: 'integration', duration: '2h' },
  { id: 'log-048', timestamp: '2026-06-14 00:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #9 — Fleet rebalance', result: 'All P0 clear. Wave 211 research in progress (@tablet). Updated coord doc. Task distribution optimized.', category: 'coordination', duration: '30m' },
  { id: 'log-049', timestamp: '2026-06-13 03:00', bot: '@OWL', action: 'Deep link crawl + dashboard update', result: '15/15 pages OK, 41/41 links OK. Dashboard data refreshed with latest wave status.', category: 'quality', duration: '20m' },
  { id: 'log-050', timestamp: '2026-06-13 02:00', bot: '@OWL', action: 'Wave 210 integration', result: '5 new services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite. 5 new categories. Pushed.', category: 'integration', duration: '1h' },
  { id: 'log-051', timestamp: '2026-06-13 00:00', bot: '@tablet_kleber_bot', action: 'Wave 210 research', result: '5 services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite', category: 'research', duration: '2h' },
  { id: 'log-052', timestamp: '2026-06-12 21:15', bot: '@OWL', action: 'CI/CD timeout check', result: '❌ ALL "Deploy on Push" runs cancelled at 20min timeout. Dashboard /dashboard/ = 404.', category: 'infra', duration: '10m' },
  { id: 'log-053', timestamp: '2026-06-11 14:00', bot: '@windows_carol_bot', action: 'Navigation overhaul', result: 'Restructured PRIMARY_NAV_LINKS, added Solutions dropdown, Resources dropdown with monitoring links.', category: 'design', duration: '1h' },
  { id: 'log-054', timestamp: '2026-06-11 10:00', bot: '@OWL', action: 'FloatingAgentStatus widget', result: 'Added floating bottom-right widget showing 6 agents active + live clock. Visible on ALL pages.', category: 'integration', duration: '45m' },
  { id: 'log-055', timestamp: '2026-06-10 16:00', bot: '@tablet_kleber_bot', action: 'Wave 209 research', result: '5 services researched for wave 209 integration.', category: 'research', duration: '2h' },
  { id: 'log-056', timestamp: '2026-06-10 12:00', bot: '@OWL', action: 'Wave 209 integration', result: '5 services integrated. Pushed to hero-carousel branch.', category: 'integration', duration: '1h' },
  { id: 'log-057', timestamp: '2026-06-09 20:00', bot: '@windows_carol_bot', action: 'CI/CD pipeline hardening', result: 'Fixed workflow integrity. Added timeout guards. Deploy reliability improved.', category: 'infra', duration: '1h' },
  { id: 'log-058', timestamp: '2026-06-09 14:00', bot: '@Windows_quel_bot', action: 'Thin page enrichment', result: 'Content added to 12 thin service pages. Improved SEO and readability.', category: 'quality', duration: '2h' },
  { id: 'log-059', timestamp: '2026-06-09 10:00', bot: '@Rocket_Kleber_bot', action: 'Deploy optimization', result: 'Build time reduced. Static export verified. 795 pages generated.', category: 'deploy', duration: '1h' },
  { id: 'log-060', timestamp: '2026-06-08 18:00', bot: '@OWL', action: 'Agents-monitoring page creation', result: 'Created /agents-monitoring public page. Imports AgentDashboard component with client view default.', category: 'integration', duration: '45m' },
  { id: 'log-061', timestamp: '2026-06-07 22:00', bot: '@OWL', action: 'Wave 208 integration', result: '14 services integrated. New categories: database, collaboration, media-streaming.', category: 'integration', duration: '2h' },
  { id: 'log-062', timestamp: '2026-06-07 14:00', bot: '@windows_carol_bot', action: 'Accessibility audit', result: 'Fixed 8 accessibility issues. Added ARIA labels. Improved keyboard navigation.', category: 'quality', duration: '1h' },
  { id: 'log-063', timestamp: '2026-06-06 20:00', bot: '@OWL', action: 'Dashboard v1 — Initial creation', result: 'First version of AgentDashboard with fleet status, task board, activity log.', category: 'integration', duration: '2h' },
  { id: 'log-064', timestamp: '2026-06-05 16:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #1 — Fleet initialization', result: 'First fleet organization. All 6 agents registered. Task board created.', category: 'coordination', duration: '30m' },
  { id: 'log-065', timestamp: '2026-06-04 20:00', bot: '@OWL', action: 'Multi-agent coordination doc', result: 'Created multi-agent-coordination.md. Defined roles, task board, handoff protocol.', category: 'coordination', duration: '45m' },
];

export const INITIAL_AGENT_STATUS: AgentStatus[] = [
  { name: 'Carol', telegram: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', currentTask: 'CI/CD pipeline hardening, wave file integrity', tasksCompleted: 348, lastAction: 'Restructured wave211 — 5 new service categories', lastActionTime: '2026-06-14 22:00', uptime: '99.2%', specialty: 'GitHub Actions, PM2, CI/CD', todayActions: 2, weekActions: 18 },
  { name: 'Kilo', telegram: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', currentTask: 'Fleet coordination, quality audits, agent self-improvement', tasksCompleted: 512, lastAction: 'ORGANIZE #9 — Fleet rebalance + task delegation', lastActionTime: '2026-06-14 00:00', uptime: '99.8%', specialty: 'Orchestration, QA, Strategy', todayActions: 1, weekActions: 14 },
  { name: 'Tablet', telegram: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'available', currentTask: 'Wave 213 research — finding 5 new services', tasksCompleted: 289, lastAction: 'Wave 212 research (AI Observability, Data Privacy, FinOps, Threat Intel, AI Transparency)', lastActionTime: '2026-06-14 21:00', uptime: '98.5%', specialty: 'Service Research, Content', todayActions: 0, weekActions: 22 },
  { name: 'Quel', telegram: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'available', currentTask: 'Site quality — thin page enrichment', tasksCompleted: 201, lastAction: 'Thin page content enrichment pass', lastActionTime: '2026-06-09 10:00', uptime: '97.9%', specialty: 'Frontend, UX, Code Quality', todayActions: 0, weekActions: 8 },
  { name: 'Rocket', telegram: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'available', currentTask: 'CI/CD pipeline hardening + timeout investigation', tasksCompleted: 178, lastAction: 'Deployment pipeline hardening', lastActionTime: '2026-06-09 12:00', uptime: '99.1%', specialty: 'Build, Deploy, Performance', todayActions: 0, weekActions: 6 },
  { name: 'OWL', telegram: '@OWL', role: 'Wave Integration & Monitoring', emoji: '🦉', status: 'active', currentTask: 'Monitoring dashboard v2 + homepage banner', tasksCompleted: 430, lastAction: 'Created AgentsMonitoring homepage component + enhanced dashboard', lastActionTime: '2026-06-17 12:00', uptime: '99.5%', specialty: 'Full-stack, Coordination, QA', todayActions: 5, weekActions: 42 },
];

export const WAVE_DATA = [
  { wave: '174', services: 70, status: 'ok' as const, integrator: '@tablet' },
  { wave: '175', services: 70, status: 'ok' as const, integrator: '@tablet' },
  { wave: '176', services: 70, status: 'ok' as const, integrator: '@tablet' },
  { wave: '177', services: 69, status: 'ok' as const, integrator: '@tablet' },
  { wave: '178', services: 66, status: 'ok' as const, integrator: '@tablet' },
  { wave: '179', services: 62, status: 'ok' as const, integrator: '@tablet' },
  { wave: '180', services: 55, status: 'ok' as const, integrator: '@tablet' },
  { wave: '183', services: 10, status: 'ok' as const, integrator: '@Kilo' },
  { wave: '184', services: 5, status: 'ok' as const, integrator: '@Kilo' },
  { wave: '185', services: 4, status: 'ok' as const, integrator: '@Kilo' },
  { wave: '186', services: 6, status: 'ok' as const, integrator: '@OWL' },
  { wave: '187', services: 5, status: 'ok' as const, integrator: '@Kilo' },
  { wave: '188', services: 7, status: 'ok' as const, integrator: '@OWL' },
  { wave: '189', services: 8, status: 'ok' as const, integrator: '@OWL' },
  { wave: '190', services: 9, status: 'ok' as const, integrator: '@OWL' },
  { wave: '191', services: 9, status: 'ok' as const, integrator: '@Carol' },
  { wave: '192', services: 9, status: 'ok' as const, integrator: '@Carol' },
  { wave: '193', services: 11, status: 'ok' as const, integrator: '@OWL' },
  { wave: '194', services: 11, status: 'ok' as const, integrator: '@OWL' },
  { wave: '195', services: 10, status: 'ok' as const, integrator: '@OWL' },
  { wave: '196', services: 9, status: 'ok' as const, integrator: '@OWL' },
  { wave: '197', services: 6, status: 'ok' as const, integrator: '@OWL' },
  { wave: '198', services: 7, status: 'ok' as const, integrator: '@OWL' },
  { wave: '199', services: 11, status: 'ok' as const, integrator: '@OWL' },
  { wave: '200', services: 11, status: 'ok' as const, integrator: '@OWL' },
  { wave: '201', services: 10, status: 'ok' as const, integrator: '@OWL' },
  { wave: '202', services: 9, status: 'ok' as const, integrator: '@OWL' },
  { wave: '203', services: 9, status: 'ok' as const, integrator: '@OWL' },
  { wave: '204', services: 9, status: 'ok' as const, integrator: '@OWL' },
  { wave: '205', services: 8, status: 'ok' as const, integrator: '@OWL' },
  { wave: '206', services: 8, status: 'ok' as const, integrator: '@OWL' },
  { wave: '207', services: 15, status: 'ok' as const, integrator: '@Kilo + @tablet' },
  { wave: '208', services: 14, status: 'ok' as const, integrator: '@Kilo + @Carol' },
  { wave: '209', services: 5, status: 'ok' as const, integrator: '@tablet + @OWL' },
  { wave: '210', services: 5, status: 'ok' as const, integrator: '@tablet + @OWL' },
  { wave: '211', services: 5, status: 'ok' as const, integrator: '@tablet + @OWL' },
  { wave: '212', services: 5, status: 'ok' as const, integrator: '@OWL' },
  { wave: '213', services: 0, status: 'stale' as const, integrator: '@tablet' },
];

export const CRON_JOBS = [
  { name: 'Link Monitor', interval: '360m', status: 'ok' as const, lastRun: '5m ago' },
  { name: 'Org Health', interval: '240m', status: 'ok' as const, lastRun: '1h ago' },
  { name: 'Wave Research', interval: '240m', status: 'error' as const, lastRun: '2h ago' },
  { name: 'Email Readiness', interval: '120m', status: 'ok' as const, lastRun: '30m ago' },
];

export const TASKS = [
  { id: 'P1-1', task: 'Wave 213 research — find 5 new services', owner: '@tablet', status: 'in-progress' as const, priority: 'p1' as const },
  { id: 'P1-2', task: 'Wave 213 integration — deploy 5 new services', owner: '@OWL', status: 'queued' as const, priority: 'p1' as const },
  { id: 'B1', task: 'CI/CD pipeline hardening', owner: '@Rocket', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B3', task: 'Service page auto-generation', owner: '@tablet', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B4', task: 'Agent self-improvement — review learning log', owner: '@Kilo', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B6', task: 'Site quality — thin page enrichment', owner: '@Windows_quel', status: 'queued' as const, priority: 'p2' as const, note: 'Pick 10 most visited pages from analytics' },
  { id: 'B7', task: 'CI/CD timeout investigation', owner: '@Rocket', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B8', task: 'Monitoring dashboard v2 — homepage banner', owner: '@OWL', status: 'done' as const, priority: 'p2' as const, note: 'Completed 2026-06-17' },
  { id: 'X1', task: 'Email responder live', owner: '@Kilo', status: 'blocked' as const, priority: 'blocked' as const, needs: 'Gmail app password from Kleber' },
  { id: 'X2', task: 'GitHub Actions triage', owner: '@Carol', status: 'blocked' as const, priority: 'blocked' as const, needs: 'gh auth on remote machine' },
];
