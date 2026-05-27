import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Zion Tech Group privacy policy — how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-10">
            Last updated: May 22, 2025. Zion Tech Group ("we", "us", "our") respects your privacy and is committed
            to protecting your personal data. This policy explains how we collect, use, and safeguard your
            information when you visit <Link href="/" className="text-purple-400 hover:underline">ziontechgroup.com</Link> or engage our services.
          </p>

          {/* 1. Information We Collect */}
          <Section num="1" title="Information We Collect">
            <p className="text-slate-300 mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong className="text-white">Contact details</strong> — name, email address, phone number, and mailing address when you submit our contact form, request a proposal, or schedule a consultation.</li>
              <li><strong className="text-white">Company information</strong> — organisation name, size, industry, and operational context when completing our service configurator or request for proposal.</li>
              <li><strong className="text-white">Usage data</strong> — pages visited, time on site, referring URLs, device type, browser version, and interactions with navigation elements collected via first-party analytics. We do not sell or share usage data with third-party advertising networks.</li>
              <li><strong className="text-white">Cookies</strong> — essential, analytics, preference, and marketing cookies as described in our <Link href="/cookies/" className="text-purple-400 hover:underline">Cookie Policy</Link>.</li>
            </ul>
          </Section>

          {/* 2. How We Use Your Information */}
          <Section num="2" title="How We Use Your Information">
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Respond to your inquiries and provide support</li>
              <li>Prepare and deliver custom proposals and service estimates</li>
              <li>Improve website performance, user experience, and service content</li>
              <li>Maintain the security and integrity of our platform</li>
              <li>Send service-related updates (not promotional email — you will not be added to a marketing list without explicit consent)</li>
            </ul>
          </Section>

          {/* 3. Data Sharing & Third Parties */}
          <Section num="3" title="Data Sharing &amp; Third Parties">
            <p className="text-slate-300">
              We do not sell your personal data. We share data with third-party processors only where necessary
              to deliver our services, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-3">
              <li><strong className="text-white">Cloud hosting</strong> — our infrastructure providers process data on our behalf under strict data processing agreements.</li>
              <li><strong className="text-white">Email platform</strong> — sends transactional email related to your inquiries; your email address is not shared with third parties.</li>
              <li><strong className="text-white">Analytics</strong> — anonymised usage data is used solely for internal improvement; no personal identifiers are exposed.</li>
            </ul>
          </Section>

          {/* 4. Cookies */}
          <Section num="4" title="Cookies">
            <p className="text-slate-300">
              We use cookies to enhance your browsing experience and analyse site traffic. For a full breakdown of
              each cookie type, see our <Link href="/cookies/" className="text-purple-400 hover:underline">Cookie Policy</Link>.
            </p>
          </Section>

          {/* 5. Data Retention */}
          <Section num="5" title="Data Retention">
            <p className="text-slate-300">
              Contact-form submissions are retained for 24 months after the last interaction.
              Aggregate analytics data is retained indefinitely on a fully anonymised basis.
              You may request deletion of your personal data at any time by emailing
              <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:underline"> kleber@ziontechgroup.com</a>.
            </p>
          </Section>

          {/* 6. Your Rights */}
          <Section num="6" title="Your Rights">
            <p className="text-slate-300 mt-3">Under applicable data protection laws (including GDPR and CCPA), you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-3">
              <li>Access a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your personal data</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-slate-300 mt-4">
              To exercise any of these rights, please contact us at
              <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:underline"> kleber@ziontechgroup.com</a>.
              We will respond within 30 days.
            </p>
          </Section>

          {/* 7. Security */}
          <Section num="7" title="Security">
            <p className="text-slate-300">
              We implement industry-standard security measures including HTTPS encryption, role-based access
              control, and regular security reviews to protect your data. No method of transmission over the
              Internet or method of electronic storage is 100% secure; we strive to use commercially
              acceptable means to protect your personal data but cannot guarantee absolute security.
            </p>
          </Section>

          {/* 8. Children's Privacy */}
          <Section num="8" title="Children's Privacy">
            <p className="text-slate-300">
              Our services are directed at businesses and professionals. We do not knowingly collect personal
              information from individuals under 18 years of age. If you believe a minor has provided us with
              personal data, please contact us immediately.
            </p>
          </Section>

          {/* 9. Changes to This Policy */}
          <Section num="9" title="Changes to This Policy">
            <p className="text-slate-300">
              We may update this Privacy Policy from time to time. When we do, we will post the updated date at
              the top of this page and update the "Last updated" timestamp. We encourage you to review this page
              periodically.
            </p>
          </Section>

          {/* 10. Contact */}
          <Section num="10" title="Contact Us">
            <p className="text-slate-300 mt-3">
              For privacy-related questions or data-access requests, please contact:
            </p>
            <div className="mt-4 p-6 bg-slate-900/60 border border-slate-700 rounded-xl">
              <p className="text-slate-300">
                <span className="text-white font-semibold">Zion Tech Group</span><br />
                Email: <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:underline">kleber@ziontechgroup.com</a><br />
                Phone: <a href="tel:+1-302-464-0950" className="text-purple-400 hover:underline">+1 302 464 0950</a><br />
                Address: 364 E Main St STE 1008, Middletown, DE 19709
              </p>
            </div>
          </Section>

          <div className="mt-12 p-6 border border-slate-700 rounded-xl bg-slate-900/40">
            <p className="text-slate-400 text-sm">
              This privacy policy is provided for informational purposes and does not constitute legal advice.
              Consult a qualified legal professional to tailor this policy to your specific regulatory obligations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
        <span className="text-sm font-bold text-purple-500 bg-purple-500/10 w-7 h-7 flex items-center justify-center rounded-full">{num}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
