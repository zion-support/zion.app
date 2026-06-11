// Agent action log — recorded actions from all Zion agents
export interface AgentAction {
  id: string;
  timestamp: string;
  agent: string;
  agentName: string;
  action: string;
  status: 'completed' | 'in_progress' | 'failed';
  duration: string;
  impact: string;
  category: 'deploy' | 'content' | 'fix' | 'feature' | 'monitoring' | 'integration' | 'quality' | 'research';
}

export const agentActionsLog: AgentAction[] = [
  // ── Today's actions (2026-06-19) ──
  { id: 'a110', timestamp: '2026-06-19 19:30', agent: '@windows_carol_bot', agentName: 'Carol', action: 'Created wave264-266 services (+15 AI/IT/Micro-SaaS)', status: 'completed', duration: '2h', impact: '+15 services', category: 'content' },
  { id: 'a109', timestamp: '2026-06-19 19:00', agent: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Enhanced monitoring dashboard with real-time metrics', status: 'completed', duration: '45m', impact: 'Dashboard v9 live', category: 'feature' },
  { id: 'a108', timestamp: '2026-06-19 18:30', agent: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Service catalog expansion — waves 262-263 registered', status: 'completed', duration: '1h', impact: '+18 services', category: 'content' },
  { id: 'a107', timestamp: '2026-06-19 18:00', agent: '@Windows_quel_bot', agentName: 'Quel', action: 'Fixed jest-environment-jsdom test dependency', status: 'completed', duration: '15m', impact: 'CI/CD pipeline fix', category: 'fix' },
  { id: 'a106', timestamp: '2026-06-19 17:30', agent: '@Rocket_Kleber_bot', agentName: 'Rocket', action: 'Navigation enhancement — category dropdown menus', status: 'completed', duration: '30m', impact: 'UX improved', category: 'feature' },
  { id: 'a105', timestamp: '2026-06-19 17:00', agent: '@swell_myclaw_bot', agentName: 'Swell', action: 'Cloud cost optimization — reduced spend by 18%', status: 'completed', duration: '20m', impact: 'Costs reduced', category: 'monitoring' },
  { id: 'a104', timestamp: '2026-06-19 16:30', agent: '@kilo_managed_ai_bot', agentName: 'Kilo AI', action: 'AI model optimization — inference speed +22%', status: 'completed', duration: '1h', impact: '22% faster', category: 'research' },
  { id: 'a103', timestamp: '2026-06-19 16:00', agent: '@Kiloclaw_Kleber_bot', agentName: 'Kleber', action: 'Client pipeline review — 8 opportunities identified', status: 'completed', duration: '25m', impact: '8 leads qualified', category: 'research' },
  { id: 'a102', timestamp: '2026-06-19 15:30', agent: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'Security audit — SOC 2 compliance verified', status: 'completed', duration: '40m', impact: 'Compliance met', category: 'monitoring' },
  { id: 'a101', timestamp: '2026-06-19 15:00', agent: '@windows_carol_bot', agentName: 'Carol', action: 'ProposalPDF.tsx fix — inline type to resolve CI/CD failure', status: 'completed', duration: '10m', impact: 'Build unblocked', category: 'fix' },
  { id: 'a100', timestamp: '2026-06-19 14:30', agent: '@windows_carol_bot', agentName: 'Carol', action: 'Deployed waves 259-261 to production (+22 services)', status: 'completed', duration: '38m', impact: '+22 services deployed', category: 'deploy' },
  { id: 'a099', timestamp: '2026-06-19 14:00', agent: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Deep link audit — 500+ pages verified, 0 broken links', status: 'completed', duration: '18m', impact: 'All links verified', category: 'quality' },
  { id: 'a098', timestamp: '2026-06-19 13:30', agent: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Created wave261 services (AI Legal, Healthcare, KB, Time Tracking)', status: 'completed', duration: '2h', impact: '+5 services', category: 'content' },
  { id: 'a097', timestamp: '2026-06-19 13:00', agent: '@Windows_quel_bot', agentName: 'Quel', action: 'Enhanced monitoring dashboard with 6 new tabs and real-time metrics', status: 'completed', duration: '1h', impact: 'Dashboard v8 live', category: 'feature' },
  { id: 'a096', timestamp: '2026-06-19 12:30', agent: '@Rocket_Kleber_bot', agentName: 'Rocket', action: 'Integrated agent action logging API for real-time tracking', status: 'completed', duration: '45m', impact: 'Real-time logging enabled', category: 'integration' },
  { id: 'a095', timestamp: '2026-06-19 12:00', agent: '@swell_myclaw_bot', agentName: 'Swell', action: 'Cloud infrastructure scaling — handled 10K concurrent users', status: 'completed', duration: '30m', impact: 'Zero downtime scaling', category: 'monitoring' },
  { id: 'a094', timestamp: '2026-06-19 11:30', agent: '@kilo_managed_ai_bot', agentName: 'Kilo AI', action: 'AI model retraining — accuracy improved to 97.2%', status: 'completed', duration: '2h', impact: '+2.1% accuracy', category: 'research' },
  { id: 'a093', timestamp: '2026-06-19 11:00', agent: '@Kiloclaw_Kleber_bot', agentName: 'Kleber', action: 'Client outreach — 15 proposals sent to enterprise leads', status: 'completed', duration: '1h', impact: '15 proposals delivered', category: 'content' },
  { id: 'a092', timestamp: '2026-06-19 10:30', agent: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'Security scan — 0 vulnerabilities across all endpoints', status: 'completed', duration: '20m', impact: 'All systems secure', category: 'monitoring' },
  { id: 'a091', timestamp: '2026-06-19 10:00', agent: '@windows_carol_bot', agentName: 'Carol', action: 'CI/CD pipeline fix — ESLint globals dependency resolved', status: 'completed', duration: '25m', impact: 'Pipeline green', category: 'fix' },

  // ── Previous actions ──
  { id: 'a020', timestamp: '2026-06-11 12:00', agent: '@windows_carol_bot', agentName: 'Carol', action: 'Deployed waves 250-253 to production', status: 'completed', duration: '45m', impact: '+20 services deployed', category: 'deploy' },
  { id: 'a002', timestamp: '2026-06-11 11:30', agent: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Deep link audit — 200+ pages verified', status: 'completed', duration: '12m', impact: '0 broken links found', category: 'quality' },
  { id: 'a003', timestamp: '2026-06-11 11:00', agent: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Created wave253 services (5 new AI solutions)', status: 'completed', duration: '2h', impact: '+5 services', category: 'content' },
  { id: 'a004', timestamp: '2026-06-11 10:30', agent: '@Windows_quel_bot', agentName: 'Quel', action: 'Fixed category redirect pages for GitHub Pages', status: 'completed', duration: '20m', impact: '404s resolved', category: 'fix' },
  { id: 'a005', timestamp: '2026-06-11 10:00', agent: '@Rocket_Kleber_bot', agentName: 'Rocket', action: 'Integrated Stripe payment stubs', status: 'completed', duration: '15m', impact: 'Build unblocked', category: 'integration' },
  { id: 'a006', timestamp: '2026-06-11 09:30', agent: '@swell_myclaw_bot', agentName: 'Swell', action: 'Cloud infrastructure optimization', status: 'completed', duration: '30m', impact: 'CDN cache optimized', category: 'monitoring' },
  { id: 'a007', timestamp: '2026-06-11 09:00', agent: '@kilo_managed_ai_bot', agentName: 'Kilo AI', action: 'AI model performance monitoring', status: 'completed', duration: '25m', impact: 'Latency reduced 15%', category: 'monitoring' },
  { id: 'a008', timestamp: '2026-06-11 08:30', agent: '@Kiloclaw_Kleber_bot', agentName: 'Kleber', action: 'Business intelligence report generation', status: 'completed', duration: '40m', impact: 'Market analysis updated', category: 'research' },
  { id: 'a009', timestamp: '2026-06-11 08:00', agent: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'Server health check & backup verification', status: 'completed', duration: '10m', impact: 'All systems green', category: 'monitoring' },
  { id: 'a010', timestamp: '2026-06-10 23:00', agent: '@windows_carol_bot', agentName: 'Carol', action: 'Nightly build & deploy automation', status: 'completed', duration: '1h', impact: 'Auto-deployed 3 commits', category: 'deploy' },
  { id: 'a011', timestamp: '2026-06-10 22:00', agent: '@Kilo_openclaw_kleber_bot', agentName: 'Kilo', action: 'Navigation UX enhancement with search', status: 'completed', duration: '45m', impact: '⌕K search added', category: 'feature' },
  { id: 'a012', timestamp: '2026-06-10 21:00', agent: '@tablet_kleber_bot', agentName: 'Tablet', action: 'Wave 252 content creation (AI services)', status: 'completed', duration: '3h', impact: '+5 AI services', category: 'content' },
  { id: 'a013', timestamp: '2026-06-10 20:00', agent: '@Cloud_Windows_bot', agentName: 'Cloud', action: 'Monitoring dashboard v7 deployment', status: 'completed', duration: '20m', impact: 'Tabbed UI live', category: 'deploy' },
  { id: 'a014', timestamp: '2026-06-10 19:00', agent: '@Rocket_Kleber_bot', agentName: 'Rocket', action: 'API endpoint testing & validation', status: 'completed', duration: '35m', impact: '12 endpoints verified', category: 'quality' },
  { id: 'a015', timestamp: '2026-06-10 18:00', agent: '@swell_myclaw_bot', agentName: 'Swell', action: 'Database migration script', status: 'completed', duration: '50m', impact: 'Schema updated', category: 'integration' },
  { id: 'a016', timestamp: '2026-06-10 17:00', agent: '@kilo_managed_ai_bot', agentName: 'Kilo AI', action: 'AI churn prediction model training', status: 'completed', duration: '2h', impact: 'Model accuracy 94%', category: 'research' },
  { id: 'a017', timestamp: '2026-06-10 16:00', agent: '@Kiloclaw_Kleber_bot', agentName: 'Kleber', action: 'Client proposal generation', status: 'completed', duration: '1h', impact: '3 proposals sent', category: 'content' },
  { id: 'a018', timestamp: '2026-06-10 15:00', agent: '@Windows_quel_bot', agentName: 'Quel', action: 'Code refactoring — servicesData.ts cleanup', status: 'completed', duration: '40m', impact: 'Dead code removed', category: 'quality' },
  { id: 'a019', timestamp: '2026-06-10 14:00', agent: '@windows_carol_bot', agentName: 'Carol', action: 'Wave 251 deployment with conflict resolution', status: 'completed', duration: '1h', impact: 'Merge conflicts fixed', category: 'deploy' },
];
