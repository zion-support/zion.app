import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Zion Tech Group — governing your use of our website and services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-slate-400 mb-10">
            These Terms of Service ("Terms") govern your access to and use of <Link href="/" className="text-purple-400 hover:underline">ziontechgroup.com</Link> and any services provided by Zion Tech Group ("we", "us", "our"). By accessing the website or engaging our services, you agree to be bound by these Terms.
          </p>

          <Section num="1" title="Use of the Website">
            <p className="text-slate-300">
              You may browse our website and public content for informational purposes. Commercial scraping,
              automated data extraction, or harassment of our systems is prohibited. You agree not to misuse
              the website or attempt to access restricted areas.
            </p>
          </Section>

          <Section num="2" title="Service Engagement">
            <p className="text-slate-300 mb-3">
              Engaging our services is governed by a separate proposal or contract. These Terms apply generally
              to all website visitors; any conflicting terms in a signed proposal or master services agreement
              take precedence for that specific engagement.
            </p>
          </Section>

          <Section num="3" title="Intellectual Property">
            <p className="text-slate-300 mb-3">
              All content on this site — code, design, text, imagery, logos — is owned by or licensed to
              Zion Tech Group and protected by intellectual property laws. You may not reproduce, distribute, or
              create derivative works without written permission.
            </p>
          </Section>

          <Section num="4" title="User Submissions">
            <p className="text-slate-300">
              If you submit questions, feedback, or content through our contact forms or services portal,
              you grant us a non-exclusive, royalty-free licence to use that content in connection with our
              business. You retain ownership of any materials you develop and own independently.
            </p>
          </Section>

          <Section num="5" title="Warranties &amp; Disclaimer">
            <p className="text-slate-300">
              Our website and services are provided "as is" without warranties of any kind, either express or
              implied. We do not warrant that the site will be uninterrupted, error-free, or free of harmful
              components. Technical information is for general guidance only and does not constitute professional
              advice.
            </p>
          </Section>

          <Section num="6" title="Limitation of Liability">
            <p className="text-slate-300">
              To the maximum extent permitted by applicable law, Zion Tech Group shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including lost profits, arising
              from your use of the website or services, even if we have been advised of the possibility
              thereof. Our total aggregate liability shall not exceed the amount paid by you for the specific
              service giving rise to the claim.
            </p>
          </Section>

          <Section num="7" title="Indemnification">
            <p className="text-slate-300">
              You agree to indemnify and hold harmless Zion Tech Group, its officers, directors, employees,
              and agents from any claim, damage, loss, or expense (including reasonable legal fees) arising
              from your breach of these Terms or your use of the website or services.
            </p>
          </Section>

          <Section num="8" title="Termination">
            <p className="text-slate-300">
              We may suspend or restrict your access to the website at any time without notice if we believe,
              in our sole discretion, that you have breached these Terms.
            </p>
          </Section>

          <Section num="9" title="Governing Law">
            <p className="text-slate-300">
              These Terms are governed by the laws of the State of Delaware, United States, without regard
              to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction
              of the courts located within Delaware.
            </p>
          </Section>

          <Section num="10" title="Changes to These Terms">
            <p className="text-slate-300">
              We reserve the right to modify these Terms at any time. Material changes will be communicated
              via the website or email. Your continued use of the website after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section num="11" title="Contact">
            <p className="text-slate-300 mt-3">Questions? Contact us at:</p>
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
              These Terms of Service are provided for informational purposes and do not constitute legal advice.
              Consult a qualified legal professional to tailor this document to your specific business needs and
              applicable jurisdiction.
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
