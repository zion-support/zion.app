// app/dashboard/page.tsx — Agent Operations Dashboard (Ops View)
import { Metadata } from 'next';
import AgentDashboard from '@/components/AgentDashboard';

export const metadata: Metadata = {
  title: 'Agent Operations Dashboard — Zion Tech Group',
  description: 'Real-time monitoring of AI agent operations, task delegation, wave integration status, and fleet health for Zion Tech Group.',
  alternates: { canonical: 'https://ziontechgroup.com/dashboard' },
};

export default function DashboardPage() {
  return <AgentDashboard defaultView="operations" defaultTab="fleet" />;
}
