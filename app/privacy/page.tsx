import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Privacy Policy | Zion Tech Group',
  description:
    'Privacy policy for Zion Tech Group. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  {
    title: '1. Information We Collect',
    content:
      'We collect information you provide directly, such as your name, email address, company name, and project details when you contact us, create an account, or use our Services. We also collect usage data including page views, feature usage, and performance metrics to improve our platform.',
  },
  {
    title: '2. How We Use Your Information',
    content:
      'We use your information to provide and improve our Services, communicate with you about your account and projects, send relevant updates about our platform, process payments, and comply with legal obligations. We do not sell your personal data to third parties.',
  },
  {
    title: '3. Data Storage and Security',
    content:
      'Your data is stored on secure, encrypted infrastructure with industry-standard access controls. We implement technical and organizational measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.',
  },
  {
    title: '4. Data Sharing',
    content:
      'We may share your information with trusted service providers who assist us in operating our platform (such as hosting, analytics, and payment processing). These providers are contractually bound to protect your data. We may also disclose information when required by law.',
  },
  {
    title: '5. Cookies and Tracking',
    content:
      'We use cookies and similar technologies to maintain session state, remember preferences, and analyze platform usage. You can control cookie settings through your browser. Essential cookies required for platform functionality cannot be disabled.',
  },
  {
    title: '6. Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data. You can also request a copy of your data in a portable format. To exercise these rights, contact us at privacy@ziontechgroup.com. We will respond within 30 days.',
  },
  {
    title: '7. Data Retention',
    content:
      'We retain your personal data for as long as your account is active or as needed to provide Services. After account termination, we retain data for up to 90 days for backup purposes, after which it is securely deleted.',
  },
  {
    title: '8. International Data Transfers',
    content:
      'If you access our Services from outside the United States, your data may be transferred to and processed in the United States. We ensure appropriate safeguards are in place for international data transfers.',
  },
  {
    title: '9. Children\'s Privacy',
    content:
      'Our Services are not directed to individuals under 16. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the data promptly.',
  },
  {
    title: '10. Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. We will notify you of material changes via email or platform notification. The date at the top of this page indicates when the policy was last revised.',
  },
  {
    title: '11. Contact Us',
    content:
      'For privacy-related questions or requests, contact our privacy team at privacy@ziontechgroup.com or through our contact page. For general inquiries, reach us at commercial@ziontechgroup.com.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-4xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} className="mb-6" />
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          Last updated: March 1, 2026
        </p>
        <p className="mt-4 max-w-2xl text-slate-300">
          We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, store, and share your information when you use our Services.
        </p>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{section.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6">
          <p className="text-sm text-slate-300">
            For questions about this policy, please{' '}
            <a href="/contact" className="font-medium text-purple-300 hover:text-purple-200">
              contact us
            </a>
            . You can also review our{' '}
            <a href="/terms" className="font-medium text-purple-300 hover:text-purple-200">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
