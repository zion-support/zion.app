// app/careers/page.tsx — Improved Careers Page
import Link from 'next/link';

export const metadata = {
  title: 'Careers',
  description: 'Join Zion Tech Group. Remote-first roles in AI engineering, DevOps, and solution architecture.',
};

export default function CareersPage() {
  const jobs = [
    {
      title: 'Senior AI Engineer',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      desc: 'Design and deploy production AI systems — RAG pipelines, autonomous agents, fine-tuned LLMs, and ML infrastructure.',
      requirements: ['5+ years ML/AI experience', 'Python, PyTorch/TensorFlow', 'RAG, embeddings, vector DBs', 'LLM fine-tuning and deployment'],
    },
    {
      title: 'DevOps / Platform Engineer',
      location: 'Remote',
      type: 'Full-time',
      desc: 'Build and maintain cloud infrastructure, CI/CD pipelines, and observability systems for enterprise clients.',
      requirements: ['AWS/Azure/GCP expertise', 'Kubernetes, Terraform, Docker', 'CI/CD (GitHub Actions, GitLab)', 'Monitoring and incident response'],
    },
    {
      title: 'Solution Architect',
      location: 'Remote / Travel',
      type: 'Full-time',
      desc: 'Lead enterprise AI deployments from discovery to production. Bridge technical and business requirements.',
      requirements: ['Enterprise architecture experience', 'AI/ML solution design', 'Client-facing communication', 'Cloud migration expertise'],
    },
    {
      title: 'Full-Stack Developer',
      location: 'Remote',
      type: 'Full-time',
      desc: 'Build modern web applications, Micro SAAS platforms, and internal tools using Next.js, TypeScript, and cloud services.',
      requirements: ['Next.js, React, TypeScript', 'Node.js or Python backends', 'PostgreSQL, Redis', 'Cloud deployment (Vercel, AWS)'],
    },
  ];

  const benefits = [
    'Competitive salary + equity',
    'Remote-first culture',
    'Health, dental, vision insurance',
    '401(k) matching',
    'Conference & learning budget',
    'Open-source contribution time',
    'Flexible PTO',
    'Latest equipment & tools',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/about/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">← About</Link>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Careers at Zion Tech Group
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Build the future of AI & enterprise software. Remote-first, competitive compensation, open-source contributions welcome.
        </p>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Why Work With Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-green-400 mt-0.5">✓</span>
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.title} className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 hover:border-purple-500/60 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{job.title}</h3>
                    <p className="text-purple-400 text-sm">{job.location} · {job.type}</p>
                  </div>
                  <Link href="/contact/" className="btn-secondary whitespace-nowrap ml-4 text-sm">Apply</Link>
                </div>
                <p className="text-slate-400 text-sm mb-3">{job.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req) => (
                    <span key={req} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{req}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-10 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-slate-400 mb-6">
            We're always looking for talented people. Send us your resume and we'll keep you in mind.
          </p>
          <a href="mailto:kleber@ziontechgroup.com?subject=Career Inquiry" className="btn-primary">
            ✉ Send Your Resume
          </a>
        </section>
      </div>
    </div>
  );
}
