import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Testimonials & Case Studies',
  description: 'See what our clients say about our AI services, IT solutions, and consulting engagements. Real results from real businesses.',
  alternates: { canonical: '/testimonials' },};

const testimonials = [
  {
    name: 'Marcus Chen',
    title: 'VP of Engineering, TechFlow Inc.',
    avatar: 'MC',
    bgColor: 'from-cyan-500/20',
    text: 'Zion Tech Group transformed our data infrastructure. Their MLOps consulting engagement reduced our model deployment time from weeks to hours. The ROI was evident within the first quarter — we saved over $2M in operational costs.'
  },
  {
    name: 'Sarah Williams',
    title: 'CTO, HealthBridge Analytics',
    avatar: 'SW',
    bgColor: 'from-blue-500/20',
    text: 'The AI-powered predictive analytics platform they built for us revolutionized patient care. We can now identify at-risk patients 48 hours earlier, reducing readmission rates by 30%. Truly life-changing technology.'
  },
  {
    name: 'James Rodriguez',
    title: 'Director of Digital Transformation, LogiCorp',
    avatar: 'JR',
    bgColor: 'from-emerald-500/20',
    text: 'Their supply chain optimization AI reduced our delivery times by 22% and fuel costs by 18%. The team understood our industry inside and out — they delivered a solution that actually works in production.'
  },
  {
    name: 'Emily Nakamura',
    title: 'Founder & CEO, RetailIQ',
    avatar: 'EN',
    bgColor: 'from-purple-500/20',
    text: 'As a startup, we needed enterprise-grade technology without enterprise budgets. Zion built us a custom e-commerce recommendation engine that increased our average order value by 28%. Their no-code tools let our team iterate without developers.'
  },
  {
    name: 'David Okafor',
    title: 'CISO, FinSecure Global',
    avatar: 'DO',
    bgColor: 'from-amber-500/20',
    text: 'The cybersecurity assessment uncovered 47 critical vulnerabilities we didn\'t know existed. Their remediation roadmap was actionable and prioritized — we achieved SOC 2 compliance 3 months ahead of schedule.'
  },
  {
    name: 'Lisa Thompson',
    title: 'COO, Midwest Manufacturing Group',
    avatar: 'LT',
    bgColor: 'from-rose-500/20',
    text: 'Our predictive maintenance system has prevented 12 major equipment failures in the past 6 months alone. The digital twin integration lets us simulate changes before implementing them — it\'s like having a crystal ball for our factory.'
  }
];

const caseStudies = [
  {
    title: 'AI-Driven Fraud Detection for National Bank',
    industry: 'Financial Services',
    result: '85% reduction in false positives, $4.2M saved annually',
    tech: ['Machine Learning', 'Real-time Streaming', 'Graph Analytics']
  },
  {
    title: 'Smart Factory Digital Transformation',
    industry: 'Manufacturing',
    result: '45% downtime reduction, 20% productivity increase',
    tech: ['IoT Sensors', 'Predictive ML', 'Digital Twins']
  },
  {
    title: 'Healthcare Predictive Analytics Platform',
    industry: 'Healthcare',
    result: '30% readmission reduction, 48-hour early warning',
    tech: ['Deep Learning', 'FHIR API', 'HIPAA Compliance']
  },
  {
    title: 'E-Commerce Personalization Engine',
    industry: 'Retail',
    result: '35% revenue increase, 40% engagement boost',
    tech: ['NLP', 'Recommendation ML', 'A/B Testing']
  }
];

const contactInfo = {
  mobile: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown, DE 19709',
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Testimonials & Case Studies
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Don&apos;t take our word for it — hear from the businesses we&apos;ve helped transform with AI, IT, and consulting solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${t.bgColor} border border-slate-700/50 rounded-2xl p-8 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.bgColor.replace('/20','/50')} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.title}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed italic text-lg">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex text-purple-400 mt-4">
                {'★★★★★'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Case Studies</h2>
        <div className="space-y-8">
          {caseStudies.map((cs, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{cs.title}</h3>
                  <span className="inline-block bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                    {cs.industry}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{cs.result.split(',')[0]}</div>
                  <div className="text-sm text-slate-400">{cs.result.split(',').slice(1).join(',')}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {cs.tech.map((tech, ti) => (
                  <span key={ti} className="bg-slate-800/50 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                <strong className="text-white">Result:</strong> {cs.result}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Be Our Next Success Story?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let us show you what&apos;s possible. Schedule a free consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact/" className="inline-flex items-center gap-2 bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition">
              Start Your Project →
            </Link>
            <a href={`tel:${contactInfo.mobile}`} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              📞 {contactInfo.mobile}
            </a>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            📍 {contactInfo.address}
          </p>
        </div>
      </section>
    </main>
  );
}