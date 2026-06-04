// app/agents-monitoring/page.tsx — Public Agent Monitoring Dashboard (Client View)
import { Metadata } from 'next';
import AgentDashboard from '@/components/AgentDashboard';

export const metadata: Metadata = {
  title: 'AI Agent Operations — Live Monitoring | Zion Tech Group',
  description: 'Real-time monitoring of Zion Tech Group AI agent fleet. Watch 6 autonomous agents build, test, and deploy 795+ services 24/7.',
  alternates: { canonical: 'https://ziontechgroup.com/agents-monitoring' },
};

export default function AgentsMonitoringPage() {
  return <AgentDashboard defaultView="client" defaultTab="showcase" />;
}
