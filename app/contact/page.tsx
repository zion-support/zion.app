// app/contact/page.tsx
import Link from 'next/link';
import { LocalBusinessJsonLd } from '@/components/LocalBusinessStructuredData';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Zion Tech Group. Call, email, or visit us in Middletown, DE.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <LocalBusinessJsonLd />
      <div className="container-page">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-300 mb-4 max-w-2xl mx-auto">
            From AI strategy to cloud infrastructure and automation — free discovery call, same-day proposal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-purple-400 font-semibold mb-1">Phone</h3>
                <a href="tel:+13024640950" className="text-slate-300 text-lg hover:text-purple-400 transition">
                  +1 302 464 0950
                </a>
              </div>
              <div>
                <h3 className="text-purple-400 font-semibold mb-1">Email</h3>
                <a href="mailto:kleber@ziontechgroup.com" className="text-slate-300 text-lg hover:text-purple-400 transition">
                  kleber@ziontechgroup.com
                </a>
              </div>
              <div>
                <h3 className="text-purple-400 font-semibold mb-1">Address</h3>
                <p className="text-slate-300">
                  364 E Main St STE 1008<br />
                  Middletown, DE 19709
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/configurator/" className="btn-primary w-full text-center block">
                Get Your Custom Proposal →
              </Link>
              <Link href="/services/" className="btn-secondary w-full text-center block">
                Browse All Services
              </Link>
              <a href="tel:+13024640950" className="btn-secondary w-full text-center block">
                ☎ Call Now
              </a>
            </div>
          </div>
        </div>

        <section className="cta-section text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s Build Something Great</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Whether you need AI integration, IT infrastructure, or a custom software solution,
            we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+13024640950" className="btn-primary text-lg">
              ☎ +1 302 464 0950
            </a>
            <a href="mailto:kleber@ziontechgroup.com" className="btn-secondary text-lg">
              ✉️ kleber@ziontechgroup.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
