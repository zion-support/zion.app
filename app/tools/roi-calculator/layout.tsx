import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ROI Calculator',
  description: 'Estimate the business value and ROI of AI & IT services for your organization. Free interactive calculator — adjust your budget to see payback period, monthly return, and year-1 net gain.',
  openGraph: {
    title: 'ROI Calculator',
    description: 'Free interactive ROI calculator — adjust your budget to see payback period, monthly return, and year-1 net gain for AI & IT services.',
    type: 'website',
  },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}