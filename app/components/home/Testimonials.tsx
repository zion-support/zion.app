type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'Zion Tech Group helped us reduce support ticket resolution time by 60% in the first quarter. Their AI chatbot integration was seamless and exceeded expectations.',
    name: 'Sarah Chen',
    role: 'VP of Operations',
    company: 'NovaBridge Solutions',
    initials: 'SC',
  },
  {
    quote:
      'The security audit uncovered critical vulnerabilities we had missed for months. Their team delivered a clear remediation plan and helped us implement every fix.',
    name: 'Marcus Rivera',
    role: 'CTO',
    company: 'DataPulse Analytics',
    initials: 'MR',
  },
  {
    quote:
      'We went from idea to production pilot in under three weeks. The engineering quality and delivery speed were unlike anything we experienced with previous vendors.',
    name: 'Emily Takahashi',
    role: 'Head of Product',
    company: 'ScaleForge AI',
    initials: 'ET',
  },
  {
    quote:
      'Their predictive analytics and supply chain optimizer cut our planning cycle by half. We now forecast demand with much higher accuracy and fewer stockouts.',
    name: 'David Okonkwo',
    role: 'Director of Supply Chain',
    company: 'RetailFlow Inc.',
    initials: 'DO',
  },
  {
    quote:
      'Zion delivered our AI document processing pipeline on time and within scope. The handoff documentation and training made it easy for our team to own and extend.',
    name: 'Jennifer Walsh',
    role: 'VP of Operations',
    company: 'ComplianceFirst Legal',
    initials: 'JW',
  },
  {
    quote:
      'We needed a partner who could move fast without cutting corners on security. Zion’s approach to governance and deployment gave us confidence to scale across regions.',
    name: 'Andre Santos',
    role: 'Head of Engineering',
    company: 'GlobalFin Tech',
    initials: 'AS',
  },
];

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '45%', label: 'Avg. Cost Reduction' },
  { value: '<48h', label: 'Discovery Kickoff' },
];

export default function Testimonials() {
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-900/30 to-slate-900/70 p-6 text-center backdrop-blur-sm transition hover:-translate-y-0.5"
          >
            <p className="text-4xl font-extrabold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-slate-200">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-purple-300">
          Trusted by teams building with AI
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          What our clients say
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-7 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/10"
          >
            <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-lg">
              &ldquo;
            </div>
            <div className="mb-4 flex gap-1 text-amber-400" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm leading-7 text-slate-200">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-700/70 pt-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 text-xs font-bold text-white">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-300">
                  {t.role}, {t.company}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
