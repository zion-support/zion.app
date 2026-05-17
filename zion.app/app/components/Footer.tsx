// app/components/Footer.tsx
import Link from 'next/link';
import {
  PRIMARY_NAV_LINKS,
  AI_SERVICE_LINKS,
  IT_SERVICE_LINKS,
  CLOUD_SERVICE_LINKS,
  SECURITY_SERVICE_LINKS,
  DATA_SERVICE_LINKS,
  AUTOMATION_SERVICE_LINKS,
  RESOURCE_LINKS,
  type NavigationLink,
} from '@/constants/navigation';

const SITE_NAME = 'Zion Tech Group';
const PHONE = '+1 302 464 0950';
const EMAIL = 'kleber@ziontechgroup.com';
const ADDRESS = '364 E Main St STE 1008, Middletown DE 19709';

function ServiceGrid({ title, links, max = 10 }: { title: string; links: readonly NavigationLink[]; max?: number }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-3 tracking-wide">{title}</h3>
      <ul className="space-y-1.5">
        {links.slice(0, max).map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="text-xs text-slate-400 hover:text-purple-400 transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
        {links.length > max && (
          <li className="text-xs text-slate-500">+{links.length - max} more</li>
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  const socialYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-900/40 mt-auto" role="contentinfo">
      {/* Main footer grid */}
      <div className="container-page py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-7 text-sm">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {SITE_NAME}
          </Link>
          <p className="text-slate-400 mt-2 text-xs leading-relaxed">
            416+ AI, IT &amp; Micro-SaaS services — enterprise automation, cybersecurity, cloud,
            and data solutions headquartered in Middletown, DE.
          </p>
          <address className="not-italic text-xs text-slate-500 mt-3 space-y-1">
            <div>{ADDRESS}</div>
            <div>
              <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-purple-400 hover:underline">{PHONE}</a>
            </div>
            <div>
              <a href={`mailto:${EMAIL}`} className="text-purple-400 hover:underline">{EMAIL}</a>
            </div>
          </address>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide">Company</h3>
          <ul className="space-y-1.5">
            {PRIMARY_NAV_LINKS.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="text-xs text-slate-400 hover:text-purple-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide">Resources</h3>
          <ul className="space-y-1.5">
            {RESOURCE_LINKS.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="text-xs text-slate-400 hover:text-purple-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* AI services — top 10 */}
        <ServiceGrid title="AI &amp; Automation" links={AI_SERVICE_LINKS} max={10} />

        {/* IT services — top 10 */}
        <ServiceGrid title="IT Infrastructure" links={IT_SERVICE_LINKS} max={10} />

        {/* Cloud + Security */}
        <div className="space-y-4">
          <ServiceGrid title="Cloud &amp; DevOps" links={CLOUD_SERVICE_LINKS} max={6} />
          <ServiceGrid title="Security" links={SECURITY_SERVICE_LINKS} max={6} />
        </div>

        {/* Data + Automation */}
        <div className="space-y-4">
          <ServiceGrid title="Data &amp; Analytics" links={DATA_SERVICE_LINKS} max={6} />
          <ServiceGrid title="Automation" links={AUTOMATION_SERVICE_LINKS} max={6} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            &copy; {socialYear} {SITE_NAME}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/status" className="hover:text-slate-300 transition-colors">System Status</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
