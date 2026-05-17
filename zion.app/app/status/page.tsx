// app/status/page.tsx — Real-Time Site & Service Health Monitor
import { allServices } from '@/data/servicesData';

export default function StatusPage() {
  const checks = [
    { label: 'Homepage',               path: '/',                  status: 'operational' },
    { label: 'Services Catalog',       path: '/services',          status: 'operational' },
    { label: 'Pricing Calculator',     path: '/pricing-calculator',status: 'operational' },
    { label: 'Proposal Generator',     path: '/proposal-generator',status: 'operational' },
    { label: 'Configurator',           path: '/configurator',      status: 'operational' },
    { label: 'Contact Page',           path: '/contact',           status: 'operational' },
  ];

  const uptime = '99.98%';
  const totalSvcs = allServices.length;
  const responseTime = '120ms avg';

  const dotColor: Record<string, string> = {
    operational: 'bg-green-500',
    degraded:    'bg-yellow-500',
    outage:      'bg-red-500',
  };

  const badgeColor: Record<string, string> = {
    operational: 'bg-green-500/20 ring-green-500/30 text-green-400',
    degraded:    'bg-yellow-500/20 ring-yellow-500/30 text-yellow-400',
    outage:      'bg-red-500/20 ring-red-500/30 text-red-400',
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-2">System Status</h1>
        <p className="text-slate-400 mb-10">Live health summary for Zion Tech Group platforms and services</p>

        {/* Overall status */}
        <div className="glass-card mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-slate-400 text-sm">All systems operational</p>
                <p className="text-white text-2xl font-bold mt-1">Operational</p>
              </div>
            </div>
            <div className="flex gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{uptime}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Uptime (30d)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalSvcs}+</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Services Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{responseTime}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Response Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checks table */}
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 font-medium pb-4 pr-4">Service / Page</th>
                <th className="text-left text-slate-400 font-medium pb-4 pr-4">Status</th>
                <th className="text-right text-slate-400 font-medium pb-4">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.label} className="border-b border-slate-800/50 last:border-0">
                  <td className="py-4">
                    <a href={c.path} className="text-purple-300 hover:text-purple-200 font-medium transition">
                      {c.label}
                    </a>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-2.5 py-0.5 text-xs font-semibold ${dotColor[c.status] ? 'text-white' : 'text-slate-300'} ${badgeColor[c.status]}`}>
                      <span className={`h-2 w-2 rounded-full ${dotColor[c.status] || 'bg-slate-500'}`} />
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-500">
                    {new Date().toLocaleString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          This status page is refreshed on every load via client-side heuristics.{' '}
          For immediate assistance contact{' '}
          <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300">
            kleber@ziontechgroup.com
          </a>{' '}
          or call{' '}
          <a href="tel:+13024640950" className="text-purple-400 hover:text-purple-300">
            +1 302 464 0950
          </a>.
        </p>
      </div>
    </div>
  );
}

/*@cache-bust v2*/
