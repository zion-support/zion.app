import Metadata from 'next';

export const metadata = {
  title: 'AI Log Analyzer - Zion App',
  description: 'AI-powered log analysis and debugging assistant. Paste your logs and get instant insights, error categorization, and actionable recommendations.',
  keywords: ['log analyzer', 'debugging', 'error analysis', 'AI debugging', 'log parser'],
};

export default function AILogAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
