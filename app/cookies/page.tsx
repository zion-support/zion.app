import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'What cookies we use on ziontechgroup.com, how we use them, and how you can manage your preferences.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <Link href="/privacy/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
            ← Privacy Policy
          </Link>

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-slate-400 mb-10">
            Zion Tech Group uses cookies and similar technologies on <Link href="/" className="text-purple-400 hover:underline">ziontechgroup.com</Link>.
            This policy explains what types of cookies we use, why we use them, and how you can manage your preferences.
            For information about how we handle your personal data, please see our <Link href="/privacy/" className="text-purple-400 hover:underline">Privacy Policy</Link>.
          </p>

          <Section num="1" title="What Are Cookies?">
            <p className="text-slate-300">
              A cookie is a small text file stored on your device when you visit a website. Cookies are widely
              used to enable websites to remember your preferences, understand how you use the site, and
              personalise your experience. They cannot harm your device and do not spread viruses.
            </p>
          </Section>

          <Section num="2" title="How We Use Cookies">
            <p className="text-slate-300">
              We use cookies for the following purposes:
            </p>

            <div className="mt-6 space-y-4">
              <CookieCard
                name="Essential"
                purpose="Authentication, session management, CSRF protection, and security"
                examples="NextAuth session token; CSRF protection; consent-state cookie"
                optout="No — required for the site to function correctly"
              />
              <CookieCard
                name="Preference / Functional"
                purpose="Remember your language, theme, and saved filter state so you do not have to re-select them on each visit"
                examples="Language preference; dark-mode selection; service-search filter state"
                optout="Yes — you can disable this in your browser settings"
              />
              <CookieCard
                name="Analytics"
                purpose="Understand how visitors use the site so we can improve content, navigation, and performance"
                examples="Page views, session duration, device type, bounce rate — no personal identifiers are stored"
                optout="Yes — opt out at any time by declining non-essential cookies in the banner or closing this page without accepting"
              />
              <CookieCard
                name="Marketing"
                purpose="Support advertising and retargeting campaigns that help us reach organisations interested in our services"
                examples="Track campaign referrals; attribute conversions — no profile is built from personal data"
                optout="Yes — opt out via the cookie consent banner at the bottom of any page"
              />
            </div>
          </Section>

          <Section num="3" title="Third-Party Cookies">
            <p className="text-slate-300 mb-3">
              Some cookies are set by third-party services we integrate:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong className="text-white">Google Analytics</strong> — helps us measure site traffic and understand visitor behaviour. Data is anonymised.</li>
              <li><strong className="text-white">LinkedIn / X / GitHub</strong> — social links on our website may set third-party cookies when you interact with embedded content. Each platform manages its own cookies — please review their separate privacy policies.</li>
            </ul>
          </Section>

          <Section num="4" title="How Long Do Cookies Last?">
            <p className="text-slate-300 mb-3">
              Cookies expire at different times depending on their purpose:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong className="text-white">Session cookies</strong> — deleted when you close your browser</li>
              <li><strong className="text-white">Persistent cookies</strong> — remain on your device for up to 12 months, or until you delete them</li>
              <li><strong className="text-white">Third-party cookies</strong> — governed by the respective third-party's retention policy</li>
            </ul>
          </Section>

          <Section num="5" title="Managing Your Cookie Preferences">
            <p className="text-slate-300 mb-3">
              You can control cookies in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong className="text-white">Cookie consent banner</strong> — our banner appears on your first visit and lets you accept or decline non-essential cookies</li>
              <li><strong className="text-white">Browser settings</strong> — most browsers allow you to block or delete cookies from individual websites. Please note that disabling essential cookies may prevent the site from functioning correctly</li>
              <li><strong className="text-white">Do Not Track</strong> — some browsers support a DNT signal that communicates your preference not to be tracked across sites</li>
            </ul>

            <div className="mt-6 p-5 bg-slate-900/60 border border-slate-700 rounded-xl">
              <p className="text-slate-300">
                <strong className="text-white">Note:</strong> Blocking essential cookies may prevent you from using the configurator,
                submitting requests, or maintaining session state in the portal. If you have issues after changing
                cookie settings, please clear your browser cache and reload the page.
              </p>
            </div>
          </Section>

          <Section num="6" title="Updates to This Policy">
            <p className="text-slate-300">
              We may amend this Cookie Policy from time to time to reflect changes in our technology or
              regulatory requirements. The "Last updated" date at the bottom of this page shows when changes
              were most recently made. Continued use of the website following any update constitutes
              acceptance of the revised policy.
            </p>
          </Section>

          <Section num="7" title="Contact">
            <p className="text-slate-300 mt-3">
              If you have questions about our use of cookies, please contact us:
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

          <p className="text-slate-500 text-xs mt-10">
            Last updated: May 22, 2025
          </p>
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

function CookieCard({ name, purpose, examples, optout }: { name: string; purpose: string; examples: string; optout: string }) {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-700 rounded-xl">
      <h3 className="font-semibold text-purple-300 text-lg mb-2">{name}</h3>
      <p className="text-slate-300 text-sm mb-2">{purpose}</p>
      <p className="text-slate-400 text-sm mb-1">
        <span className="text-slate-500">Examples:</span> {examples}
      </p>
      <p className="text-slate-400 text-sm">
        <span className="text-slate-500">Opt-out:</span> {optout}
      </p>
    </div>
  );
}
