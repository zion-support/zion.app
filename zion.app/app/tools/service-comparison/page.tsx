// app/tools/service-comparison/page.tsx
import Link from 'next/link';
import { allServices, type Service } from '../../data/servicesData';

export const metadata = {
  title: 'Service Comparison — Zion Tech Group',
  description: 'Compare AI, IT, and Micro-SaaS services side-by-side to find the right solution.',
};

export default function ServiceComparisonPage() {
  const featured = allServices.filter((s: Service) => s.popular).slice(0, 8);
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Service Comparison</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Compare features, pricing tiers, and benefits across our services to find the perfect fit.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-4 text-slate-300 font-semibold">Service</th>
              <th className="py-3 px-4 text-slate-300 font-semibold">Category</th>
              <th className="py-3 px-4 text-slate-300 font-semibold">Basic</th>
              <th className="py-3 px-4 text-slate-300 font-semibold">Pro</th>
              <th className="py-3 px-4 text-slate-300 font-semibold">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {featured.map((s: Service) => (
              <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition">
                <td className="py-3 px-4">
                  <Link href={`/services/${s.id}`} className="text-purple-400 font-medium hover:underline">
                    {s.title}
                  </Link>
                </td>
                <td className="py-3 px-4 text-slate-400">{s.category}</td>
                <td className="py-3 px-4 text-slate-300">{s.pricing.basic}</td>
                <td className="py-3 px-4 text-slate-300">{s.pricing.pro}</td>
                <td className="py-3 px-4 text-slate-300">{s.pricing.enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
