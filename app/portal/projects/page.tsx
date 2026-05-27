// app/portal/projects/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Project Dashboard — Client Portal',
  description: 'Active project dashboards, milestones, and status updates.',
};

export default function ProjectsPage() {
  const projects = [
    { name: 'AI Customer Support Rollout', status: 'In Progress', progress: 65, color: 'bg-purple-500' },
    { name: 'Cloud Migration — Phase 2', status: 'Planning', progress: 15, color: 'bg-blue-500' },
    { name: 'Security Audit & Hardening', status: 'In Review', progress: 90, color: 'bg-purple-500' },
  ];

  return (
    <div className="container-page py-16">
      <Link href="/portal/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">&larr; Back to Client Portal</Link>
      <div className="glass-card max-w-2xl">
        <div className="text-5xl mb-4">&#x1F4CA;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Project Dashboard</h1>
        <p className="text-slate-400 mb-8">Track active projects, milestones, and status updates in real time.</p>
        <div className="space-y-4">
          {projects.map((p, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold">{p.name}</h3>
                <span className="text-xs font-semibold text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-full">{p.status}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`${p.color} h-full rounded-full`} style={{ width: `${p.progress}%` }} />
              </div>
              <p className="text-slate-500 text-xs mt-1.5">{p.progress}% complete</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-green-950/30 rounded-xl border border-green-500/20">
          <p className="text-green-300 text-sm">Need to request a change or check on a milestone? <a href="/contact/" className="underline hover:text-green-200">Contact your project manager</a> or call <a href="tel:+13024640950" className="underline">+1 302 464 0950</a>.</p>
        </div>
      </div>
    </div>
  );
}
