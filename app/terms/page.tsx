import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'Terms of Service | Zion Tech Group',
  description:
    'Terms of service for Zion Tech Group products, services, and platform usage.',
  alternates: { canonical: '/terms' },
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using Zion Tech Group services, website, or platform (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our Services. Use of the Services by an organization constitutes acceptance by that organization and its authorized users.',
  },
  {
    title: '2. Description of Services',
    content:
      'Zion Tech Group provides AI-powered software solutions, engineering services, cloud infrastructure management, cybersecurity consulting, and related professional services. Service availability and features may vary based on your subscription plan. We may update, suspend, or discontinue specific features with reasonable notice where practicable.',
  },
  {
    title: '3. User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Zion Tech Group reserves the right to suspend or terminate accounts that violate these terms. You must provide accurate and complete registration information and keep it current.',
  },
  {
    title: '4. Acceptable Use',
    content:
      'You agree to use the Services only for lawful purposes and in accordance with these Terms. You shall not: (a) transmit malicious code, malware, or any content designed to disrupt or damage systems; (b) attempt unauthorized access to our or any third party systems or data; (c) use the Services in a manner that interferes with or disrupts the integrity or performance of the Services; (d) use the Services to violate any applicable law, regulation, or third party rights; or (e) resell or sublicense the Services without our prior written consent. We may suspend or terminate access for violations of this section.',
  },
  {
    title: '5. Intellectual Property',
    content:
      'All content, software, trademarks, and materials provided through the Services are owned by or licensed to Zion Tech Group. You retain ownership of any data you submit through the Services. We do not claim ownership of your content. You grant us a limited license to use your content as necessary to provide and improve the Services. Feedback you provide may be used without obligation to you.',
  },
  {
    title: '6. Payment Terms',
    content:
      'Paid services are billed according to the pricing plan selected at the time of purchase. All fees are non-refundable except as required by law or as explicitly stated in your service agreement. We reserve the right to modify pricing with 30 days notice. You are responsible for any taxes applicable to your use of the Services. Failure to pay may result in suspension or termination of access.',
  },
  {
    title: '7. Service Level Agreements',
    content:
      'Enterprise customers may be subject to additional service level agreements (SLAs) as specified in their individual contracts. Standard platform uptime targets and support response times are documented in your plan details. Credits or remedies for SLA failures are governed by the applicable SLA or contract.',
  },
  {
    title: '8. Limitation of Liability',
    content:
      'To the maximum extent permitted by law, Zion Tech Group shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Services, including loss of profits, data, or business opportunity. Our total liability for any claims arising from or related to the Services shall not exceed the fees paid by you in the twelve (12) months preceding the claim. Some jurisdictions do not allow certain limitations; in such cases, our liability is limited to the maximum permitted by law.',
  },
  {
    title: '9. Termination',
    content:
      'Either party may terminate the service agreement with 30 days written notice. Upon termination, you will retain access to your data for 90 days for export. Zion Tech Group reserves the right to terminate accounts that violate these Terms immediately. Provisions that by their nature should survive (including intellectual property, limitation of liability, and indemnification) will survive termination.',
  },
  {
    title: '10. Changes to Terms',
    content:
      'We may update these Terms from time to time. We will notify you of material changes via email or through the platform. Continued use of the Services after changes take effect constitutes acceptance of the updated Terms. If you do not agree, you must stop using the Services before the effective date of the changes.',
  },
  {
    title: '11. Governing Law',
    content:
      'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in California, and you consent to personal jurisdiction in such courts.',
  },
  {
    title: '12. Contact',
    content:
      'For questions about these Terms, please contact us at legal@ziontechgroup.com or through our contact page. We will respond to legal and compliance inquiries in a timely manner.',
  },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-4xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} className="mb-6" />
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          Last updated: March 1, 2026
        </p>
        <p className="mt-4 max-w-2xl text-slate-300">
          These Terms govern your use of Zion Tech Group services, website, and platform. By accessing or using our Services, you agree to be bound by these Terms.
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
            If you have questions about these terms, please{' '}
            <a href="/contact" className="font-medium text-purple-300 hover:text-purple-200">
              contact us
            </a>
            . You can also review our{' '}
            <a href="/privacy" className="font-medium text-purple-300 hover:text-purple-200">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
