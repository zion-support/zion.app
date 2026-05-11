import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Expense Tracker | Zion Tech Group',
  description:
    'Automate expense capture, categorization, and policy compliance with receipt OCR and smart routing.',
  alternates: { canonical: '/zion-ai-expense-tracker' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Expense Tracker',
        category: 'Operations',
        description:
          'Automate expense capture, categorization, and policy compliance with receipt OCR, smart routing, and approval workflows so finance and employees spend less time on expense admin.',
        iconEmoji: '💳',
        features: [
          {
            title: 'Receipt Capture & OCR',
            description:
              'Capture receipts via mobile or email. AI extracts merchant, amount, date, and category for automatic entry and matching.',
          },
          {
            title: 'Smart Categorization',
            description:
              'Auto-categorize expenses by policy rules and learning from past submissions. Reduce manual tagging and policy violations.',
          },
          {
            title: 'Policy & Compliance',
            description:
              'Enforce spending limits, approval thresholds, and allowed categories. Flag out-of-policy items before submission or approval.',
          },
          {
            title: 'Approval Workflows',
            description:
              'Configurable multi-level approvals, delegation, and escalation. Integrate with your existing approval hierarchy.',
          },
          {
            title: 'ERP & Finance Integration',
            description:
              'Sync to NetSuite, SAP, QuickBooks, or your GL. Map categories and cost centers for accurate posting and reconciliation.',
          },
          {
            title: 'Audit & Reporting',
            description:
              'Full audit trail, exception reports, and spend analytics. Support for compliance and internal audit with exportable records.',
          },
        ],
        useCases: [
          {
            title: 'Employee Expense Submission',
            description:
              'Employees submit receipts on the go; AI categorizes and checks policy. Approvers see clean, compliant reports and one-click approve.',
            icon: '📱',
          },
          {
            title: 'Finance Close & Reconciliation',
            description:
              'Expenses flow into GL with correct categories and cost centers. Fewer reclasses and faster month-end close.',
            icon: '📊',
          },
          {
            title: 'Policy & Fraud Prevention',
            description:
              'Catch policy violations and anomalies before payment. Audit trails and reporting for internal and external audits.',
            icon: '🛡️',
          },
        ],
        benefits: [
          'Faster expense submission and approval',
          'Fewer policy violations and rework',
          'Accurate GL posting and reconciliation',
          'Audit-ready trails and reporting',
          'Integration with ERP and finance systems',
        ],
        ctaLabel: 'Get Started with Zion AI Expense Tracker',
      }}
    />
  );
}
