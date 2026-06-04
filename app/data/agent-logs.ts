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
  { id: 'log-001', timestamp: '2026-06-14 22:30', bot: '@OWL', action: 'ORGANIZE #10 — Task board reorganization + delegation', result: 'Wave 213 research → @tablet (in-progress). Wave 213 integration → @OWL (queued). CI/CD timeout → @Rocket (queued). Wave 211 restructure verified (@Carol). Added B4: CI/CD --webpack migration. Updated all bot statuses.', category: 'coordination', duration: '45m' },
  { id: 'log-002', timestamp: '2026-06-14 22:00', bot: '@OWL', action: 'Deep crawl — full site verification', result: '18/18 core pages OK (200), 0 broken links. All nav pages + dashboard + agents-monitoring + services categories verified. Site healthy.', category: 'monitoring', duration: '12m' },
  { id: 'log-003', timestamp: '2026-06-14 21:00', bot: '@OWL', action: 'Deep crawl — wave 212 verification', result: '20/20 OK. 15 core pages + 5 wave 212 services all 200. Homepage monitoring: agents-monitoring ✅, dashboard ✅, Built by AI ✅. Wave 212 services live.', category: 'quality', duration: '15m' },
  { id: 'log-004', timestamp: '2026-06-14 19:30', bot: '@OWL', action: 'Deep link crawl — full site verification', result: '15/15 core pages OK (200), 0 broken links. Dashboard, monitoring, floating widget all verified.', category: 'quality', duration: '10m' },
  { id: 'log-005', timestamp: '2026-06-14 18:30', bot: '@OWL', action: 'Deep link crawl — wave 211 404 investigation', result: 'Found 3 wave 211 service pages returning 404 (ai-governance, edge-ai, data-contract). Root cause: wave211.ts file was never committed to git. Created commit with wave211.ts. CI/CD build succeeded, all 5 wave 211 services now 200 OK.', category: 'fix', duration: '30m' },
  { id: 'log-006', timestamp: '2026-06-14 01:00', bot: '@OWL', action: 'Agent monitoring dashboard + homepage banner + nav integration', result: 'Full dashboard at /agents-monitoring with Ops/Client views, 4 tabs, live agent status, cron jobs, activity log. Homepage banner added. Nav link + footer + floating dock entry.', category: 'integration', duration: '2h' },
  { id: 'log-007', timestamp: '2026-06-14 00:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #9 — Fleet rebalance', result: 'All P0 clear. Wave 211 research in progress (@tablet). Updated coord doc. Task distribution optimized.', category: 'coordination', duration: '30m' },
  { id: 'log-008', timestamp: '2026-06-13 03:00', bot: '@OWL', action: 'Deep link crawl + dashboard update', result: '15/15 pages OK, 41/41 links OK. Sitemap stale (599 URLs, missing w209/210). Dashboard data refreshed.', category: 'quality', duration: '20m' },
  { id: 'log-009', timestamp: '2026-06-13 03:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #6 — Fleet rebalance', result: 'Wave 211 research → @tablet. Wave 210 integration → @OWL. Quality pass → @Windows_quel. CI/CD → @Rocket.', category: 'coordination', duration: '25m' },
  { id: 'log-010', timestamp: '2026-06-13 02:00', bot: '@OWL', action: 'Wave 210 integration', result: '5 new services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite. 5 new categories. Pushed.', category: 'integration', duration: '1h' },
  { id: 'log-011', timestamp: '2026-06-13 01:30', bot: '@OWL', action: 'Sitemap config fix', result: 'Added missing next-sitemap.config.cjs — was causing 1905 stale entries.', category: 'fix', duration: '15m' },
  { id: 'log-012', timestamp: '2026-06-13 01:00', bot: '@OWL', action: 'Dashboard v5 + homepage banner', result: 'Tabbed interface (Fleet/Waves/Tasks/Activity), system metrics, Ops + Client views.', category: 'integration', duration: '1h' },
  { id: 'log-013', timestamp: '2026-06-13 00:00', bot: '@tablet_kleber_bot', action: 'Wave 210 research', result: '5 services: PostgreSQL, Nextcloud, Jellyfin, Terraform, Appwrite', category: 'research', duration: '2h' },
  { id: 'log-014', timestamp: '2026-06-12 21:15', bot: '@OWL', action: 'CI/CD timeout check', result: '❌ ALL "Deploy on Push" runs cancelled at 20min timeout. Dashboard /dashboard/ = 404.', category: 'infra', duration: '10m' },
  { id: 'log-015', timestamp: '2026-06-12 07:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #5', result: 'Fleet health check. Site 200 OK. Rebalanced tasks.', category: 'coordination', duration: '20m' },
  { id: 'log-016', timestamp: '2026-06-11 14:00', bot: '@windows_carol_bot', action: 'Navigation overhaul', result: 'Restructured PRIMARY_NAV_LINKS, added Solutions dropdown, Resources dropdown with monitoring links.', category: 'design', duration: '1h' },
  { id: 'log-017', timestamp: '2026-06-11 10:00', bot: '@OWL', action: 'FloatingAgentStatus widget', result: 'Added floating bottom-right widget showing 6 agents active + live clock. Visible on ALL pages.', category: 'integration', duration: '45m' },
  { id: 'log-018', timestamp: '2026-06-11 08:00', bot: '@OWL', action: 'FloatingActionDock — AI Agents priority', result: 'Added "⚡ AI Agents Live" as priority item in right-side floating dock.', category: 'design', duration: '30m' },
  { id: 'log-019', timestamp: '2026-06-10 16:00', bot: '@tablet_kleber_bot', action: 'Wave 209 research', result: '5 services researched for wave 209 integration.', category: 'research', duration: '2h' },
  { id: 'log-020', timestamp: '2026-06-10 12:00', bot: '@OWL', action: 'Wave 209 integration', result: '5 services integrated. Pushed to hero-carousel branch.', category: 'integration', duration: '1h' },
  { id: 'log-021', timestamp: '2026-06-10 08:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #4', result: 'Fleet coordination. Task board updated. Site health verified.', category: 'coordination', duration: '20m' },
  { id: 'log-022', timestamp: '2026-06-09 20:00', bot: '@windows_carol_bot', action: 'CI/CD pipeline hardening', result: 'Fixed workflow integrity. Added timeout guards. Deploy reliability improved.', category: 'infra', duration: '1h' },
  { id: 'log-023', timestamp: '2026-06-09 14:00', bot: '@Windows_quel_bot', action: 'Thin page enrichment', result: 'Content added to 12 thin service pages. Improved SEO and readability.', category: 'quality', duration: '2h' },
  { id: 'log-024', timestamp: '2026-06-09 10:00', bot: '@Rocket_Kleber_bot', action: 'Deploy optimization', result: 'Build time reduced. Static export verified. 795 pages generated.', category: 'deploy', duration: '1h' },
  { id: 'log-025', timestamp: '2026-06-08 18:00', bot: '@OWL', action: 'Agents-monitoring page', result: 'Created /agents-monitoring public page. Imports AgentDashboard component.', category: 'integration', duration: '45m' },
  { id: 'log-026', timestamp: '2026-06-08 12:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #3', result: 'Fleet rebalance. Wave 208 research assigned. Quality audit scheduled.', category: 'coordination', duration: '20m' },
  { id: 'log-027', timestamp: '2026-06-08 06:00', bot: '@tablet_kleber_bot', action: 'Wave 208 research', result: '14 services researched across multiple categories.', category: 'research', duration: '3h' },
  { id: 'log-028', timestamp: '2026-06-07 22:00', bot: '@OWL', action: 'Wave 208 integration', result: '14 services integrated. New categories: database, collaboration, media-streaming.', category: 'integration', duration: '2h' },
  { id: 'log-029', timestamp: '2026-06-07 14:00', bot: '@windows_carol_bot', action: 'Accessibility audit', result: 'Fixed 8 accessibility issues. Added ARIA labels. Improved keyboard navigation.', category: 'quality', duration: '1h' },
  { id: 'log-030', timestamp: '2026-06-07 08:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #2', result: 'Fleet health check. All agents reporting. Task board updated.', category: 'coordination', duration: '15m' },
  { id: 'log-031', timestamp: '2026-06-06 20:00', bot: '@OWL', action: 'Dashboard v1 — Initial creation', result: 'First version of AgentDashboard with fleet status, task board, activity log.', category: 'integration', duration: '2h' },
  { id: 'log-032', timestamp: '2026-06-06 14:00', bot: '@tablet_kleber_bot', action: 'Wave 207 research', result: '15 services researched — largest wave yet.', category: 'research', duration: '3h' },
  { id: 'log-033', timestamp: '2026-06-06 08:00', bot: '@OWL', action: 'Wave 207 integration', result: '15 services integrated. Pushed to hero-carousel.', category: 'integration', duration: '2h' },
  { id: 'log-034', timestamp: '2026-06-05 16:00', bot: '@Kilo_openclaw_kleber_bot', action: 'ORGANIZE #1 — Fleet initialization', result: 'First fleet organization. All 6 agents registered. Task board created.', category: 'coordination', duration: '30m' },
  { id: 'log-035', timestamp: '2026-06-05 10:00', bot: '@windows_carol_bot', action: 'PM2 agent setup', result: 'Configured PM2 for all 6 agents. Deploy watchdog active.', category: 'infra', duration: '1h' },
  { id: 'log-036', timestamp: '2026-06-04 20:00', bot: '@OWL', action: 'Multi-agent coordination doc', result: 'Created multi-agent-coordination.md. Defined roles, task board, handoff protocol.', category: 'coordination', duration: '45m' },
  { id: 'log-037', timestamp: '2026-06-04 14:00', bot: '@tablet_kleber_bot', action: 'Wave 206 research', result: '8 services researched for next integration wave.', category: 'research', duration: '2h' },
  { id: 'log-038', timestamp: '2026-06-04 08:00', bot: '@OWL', action: 'Wave 206 integration', result: '8 services integrated. Site now at 795+ services.', category: 'integration', duration: '2h' },
];

export const INITIAL_AGENT_STATUS: AgentStatus[] = [
  { name: 'Carol', telegram: '@windows_carol_bot', role: 'DevOps & Infrastructure', emoji: '🖥️', status: 'active', currentTask: 'Wave 211 restructure (new categories), CI/CD pipeline hardening', tasksCompleted: 348, lastAction: 'Restructured wave211 — 5 new service categories', lastActionTime: '2026-06-14 22:00', uptime: '99.2%', specialty: 'GitHub Actions, PM2, CI/CD', todayActions: 3, weekActions: 18 },
  { name: 'Kilo', telegram: '@Kilo_openclaw_kleber_bot', role: 'Intelligence & Orchestration', emoji: '🧠', status: 'active', currentTask: 'Fleet coordination, quality audits, multi-agent task routing', tasksCompleted: 512, lastAction: 'ORGANIZE #9 — Fleet rebalance + task delegation', lastActionTime: '2026-06-14 00:00', uptime: '99.8%', specialty: 'Orchestration, QA, Strategy', todayActions: 2, weekActions: 14 },
  { name: 'Tablet', telegram: '@tablet_kleber_bot', role: 'Content & Research', emoji: '📱', status: 'active', currentTask: 'Wave 213 research — finding 5 new services', tasksCompleted: 289, lastAction: 'Wave 212 research (AI Observability, Data Privacy, FinOps, Threat Intel, AI Transparency)', lastActionTime: '2026-06-14 21:00', uptime: '98.5%', specialty: 'Service Research, Content', todayActions: 4, weekActions: 22 },
  { name: 'Quel', telegram: '@Windows_quel_bot', role: 'Code & Implementation', emoji: '🔧', status: 'available', currentTask: 'Thin page enrichment + nav/design improvements (P2 backlog)', tasksCompleted: 201, lastAction: 'Thin page content enrichment pass', lastActionTime: '2026-06-09 10:00', uptime: '97.9%', specialty: 'Frontend, UX, Code Quality', todayActions: 0, weekActions: 8 },
  { name: 'Rocket', telegram: '@Rocket_Kleber_bot', role: 'Integration & Delivery', emoji: '🚀', status: 'available', currentTask: 'CI/CD timeout investigation, build pipeline optimization', tasksCompleted: 178, lastAction: 'Deployment pipeline hardening', lastActionTime: '2026-06-09 12:00', uptime: '99.1%', specialty: 'Build, Deploy, Performance', todayActions: 0, weekActions: 6 },
  { name: 'OWL', telegram: '@OWL', role: 'Wave Integration & Monitoring', emoji: '🦉', status: 'active', currentTask: 'Monitoring dashboard, wave integration, fleet coordination', tasksCompleted: 424, lastAction: 'Task board reorganization + delegation update', lastActionTime: '2026-06-14 22:00', uptime: '99.5%', specialty: 'Full-stack, Coordination, QA', todayActions: 6, weekActions: 32 },
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
];

export const CRON_JOBS = [
  { name: 'Link Monitor', interval: '360m', status: 'ok' as const, lastRun: '5m ago' },
  { name: 'Org Health', interval: '240m', status: 'ok' as const, lastRun: '1h ago' },
  { name: 'Wave Research', interval: '240m', status: 'ok' as const, lastRun: '30m ago' },
  { name: 'Deploy Check', interval: '60m', status: 'ok' as const, lastRun: '2m ago' },
];

export const TASKS = [
  { id: 'P0-1', task: 'Dashboard v6 — Enhanced monitoring + client view + restart protocol', owner: '@OWL', status: 'done' as const, priority: 'p0' as const },
  { id: 'P0-2', task: 'Activity log — 30+ historical entries recorded', owner: '@OWL', status: 'done' as const, priority: 'p0' as const },
  { id: 'P0-3', task: 'Homepage banner — prominent AI agent advertising', owner: '@OWL', status: 'done' as const, priority: 'p0' as const },
  { id: 'P0-4', task: 'Agent restart protocol — checklist for all bots', owner: '@OWL', status: 'done' as const, priority: 'p0' as const },
  { id: 'P1-1', task: 'Wave 213 research — find 5 new services', owner: '@tablet', status: 'in-progress' as const, priority: 'p1' as const },
  { id: 'P1-2', task: 'Wave 213 integration — deploy 5 new services', owner: '@OWL', status: 'queued' as const, priority: 'p1' as const },
  { id: 'P1-3', task: 'CI/CD timeout investigation (deploys failing at 20min)', owner: '@Rocket', status: 'queued' as const, priority: 'p1' as const },
  { id: 'P1-4', task: 'Wave 211 restructure verification — Carol renamed categories', owner: '@Carol', status: 'done' as const, priority: 'p1' as const },
  { id: 'B1', task: 'Service page auto-generation', owner: '@tablet', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B2', task: 'Thin page content enrichment', owner: '@Windows_quel', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B3', task: 'Site navigation/design improvements', owner: '@Windows_quel', status: 'queued' as const, priority: 'p2' as const },
  { id: 'B4', task: 'Build pipeline — switch CI/CD to --webpack for reliability', owner: '@Carol', status: 'queued' as const, priority: 'p2' as const },
  { id: 'X1', task: 'Email responder live', owner: '@Kilo', status: 'blocked' as const, priority: 'blocked' as const, needs: 'Gmail app password from Kleber' },
  { id: 'X2', task: 'GitHub Actions triage', owner: '@Carol', status: 'blocked' as const, priority: 'blocked' as const, needs: 'gh auth on remote machine' },
];
