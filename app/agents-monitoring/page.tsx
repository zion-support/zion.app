import { Metadata } from 'next';
import AgentsMonitoringPage from '@/components/AgentsMonitoringPage';

export const metadata: Metadata = {
  title: 'AI Agent Monitoring Dashboard — Live Operations | Zion Tech Group',
  description: 'Permanent record of all AI agent actions. 9 agents building, testing, and deploying 795+ services with full audit trail and performance metrics.',
  alternates: { canonical: 'https://ziontechgroup.com/agents-monitoring' }
};

export default function AgentsMonitoringPageRoute() {
  return <AgentsMonitoringPage />;
}