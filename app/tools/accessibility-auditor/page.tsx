import Metadata from 'next';
import AccessibilityAuditorClient from './AccessibilityAuditorClient';

export const metadata = {
  title: 'AI Accessibility Auditor | Free WCAG Compliance Checker',
  description: 'Analyze your website for accessibility issues with our AI-powered WCAG compliance checker. Get detailed reports on color contrast, keyboard navigation, ARIA labels, and more.',
  keywords: 'accessibility audit, WCAG checker, a11y, accessibility compliance, screen reader, color contrast checker, aria validation',
  openGraph: {
    title: 'AI Accessibility Auditor - Free WCAG Compliance Tool',
    description: 'Automatically detect accessibility violations and get actionable fixes.',
    type: 'website',
    images: ['/icon.svg'],
  },
};

export default function AccessibilityAuditorPage() {
  return <AccessibilityAuditorClient />;
}
