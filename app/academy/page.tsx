// app/academy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Training Academy — Master AI & Technology | Zion Tech Group',
  description: 'Master AI, Machine Learning, Cloud, Cybersecurity, and Data Science with Zion Tech Group Academy. Expert-led courses, certifications, and corporate training programs.',
  keywords: 'AI training, machine learning course, cloud certification, cybersecurity training, data science academy, corporate training, AI certification, technology education',
  alternates: { canonical: 'https://ziontechgroup.com/academy' },
  openGraph: {
    title: 'AI Training Academy — Master AI & Technology | Zion Tech Group',
    description: 'Expert-led AI & technology training. Courses from $299. Industry certifications. Corporate packages available.',
    url: 'https://ziontechgroup.com/academy',
  },
};

// ─── Icon Components ────────────────────────────────────────────────────────
function BrainIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

function CloudIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

function ShieldIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function DatabaseIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

function BriefcaseIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function AcademicCapIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const courseCategories = [
  { name: 'AI & Machine Learning', icon: 'brain', count: 24, color: 'from-purple-500 to-violet-600', description: 'Deep learning, NLP, computer vision, generative AI, and MLOps' },
  { name: 'Cloud Computing', icon: 'cloud', count: 18, color: 'from-cyan-500 to-blue-600', description: 'AWS, Azure, GCP architecture, serverless, and multi-cloud strategies' },
  { name: 'Cybersecurity', icon: 'shield', count: 15, color: 'from-red-500 to-rose-600', description: 'Penetration testing, SOC operations, zero trust, and compliance' },
  { name: 'Data Science', icon: 'database', count: 20, color: 'from-emerald-500 to-teal-600', description: 'Analytics, big data, visualization, statistical modeling, and ML pipelines' },
  { name: 'Business & Leadership', icon: 'briefcase', count: 12, color: 'from-amber-500 to-orange-600', description: 'Digital transformation, AI strategy, product management, and agile' },
];

const featuredCourses = [
  { title: 'Generative AI Masterclass', subtitle: 'GPT, LLaMA, Stable Diffusion & Beyond', price: 2999, originalPrice: 3999, duration: '12 weeks', level: 'Advanced', students: 2840, rating: 4.9, reviews: 487, badge: 'Best Seller', gradient: 'from-purple-600 to-indigo-700' },
  { title: 'Machine Learning Engineering', subtitle: 'From Theory to Production ML Systems', price: 1999, originalPrice: 2799, duration: '10 weeks', level: 'Intermediate', students: 4520, rating: 4.8, reviews: 823, badge: 'Most Popular', gradient: 'from-cyan-600 to-blue-700' },
  { title: 'Cloud Architect Professional', subtitle: 'Multi-Cloud Design & Implementation', price: 1499, originalPrice: 1999, duration: '8 weeks', level: 'Intermediate', students: 3180, rating: 4.8, reviews: 612, badge: '', gradient: 'from-emerald-600 to-teal-700' },
  { title: 'Ethical Hacking & Pentesting', subtitle: 'Offensive Security for Defenders', price: 1299, originalPrice: 1799, duration: '8 weeks', level: 'Intermediate', students: 2100, rating: 4.9, reviews: 398, badge: 'New', gradient: 'from-red-600 to-rose-700' },
  { title: 'Data Engineering Fundamentals', subtitle: 'Pipelines, Warehouses & Real-time Data', price: 799, originalPrice: 1099, duration: '6 weeks', level: 'Beginner', students: 5670, rating: 4.7, reviews: 1042, badge: '', gradient: 'from-amber-600 to-orange-700' },
  { title: 'AI for Business Leaders', subtitle: 'Strategy, ROI & Implementation Playbook', price: 299, originalPrice: 499, duration: '4 weeks', level: 'Beginner', students: 8940, rating: 4.9, reviews: 1567, badge: 'Top Rated', gradient: 'from-pink-600 to-fuchsia-700' },
];

const certifications = [
  { name: 'Zion Certified AI Engineer', code: 'ZCAE', modules: 8, examHours: 3, validity: '2 years', price: 599, color: 'border-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Zion Certified Cloud Architect', code: 'ZCCA', modules: 6, examHours: 2.5, validity: '2 years', price: 499, color: 'border-cyan-500', bg: 'bg-cyan-500/10' },
  { name: 'Zion Certified Security Professional', code: 'ZCSP', modules: 7, examHours: 3, validity: '2 years', price: 549, color: 'border-red-500', bg: 'bg-red-500/10' },
  { name: 'Zion Certified Data Scientist', code: 'ZCDS', modules: 6, examHours: 2.5, validity: '2 years', price: 499, color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
];

const learningPaths = [
  { title: 'AI Engineer Path', duration: '6 months', courses: 5, outcome: 'Production-ready ML engineer', skills: ['Python', 'TensorFlow', 'MLOps', 'LLM Fine-tuning', 'Deployment'], gradient: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
  { title: 'Full-Stack Cloud Path', duration: '5 months', courses: 4, outcome: 'Multi-cloud certified architect', skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevOps'], gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
  { title: 'Security Analyst Path', duration: '4 months', courses: 4, outcome: 'SOC analyst to pentester', skills: ['SIEM', 'Threat Hunting', 'Forensics', 'Red Team', 'Compliance'], gradient: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30' },
  { title: 'Data Science Path', duration: '5 months', courses: 5, outcome: 'End-to-end data scientist', skills: ['Statistics', 'Python', 'Spark', 'Visualization', 'ML'], gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
];

const instructors = [
  { name: 'Dr. Sarah Chen', role: 'Head of AI Curriculum', bio: 'Former Google Brain researcher. PhD in ML from Stanford. 15+ years in AI research and education.', specialty: 'Deep Learning & NLP', students: '12,000+', rating: 4.9 },
  { name: 'Marcus Williams', role: 'Cloud Architecture Lead', bio: 'Ex-AWS Solutions Architect. 5x certified across AWS, Azure, and GCP. Built systems serving 100M+ users.', specialty: 'Multi-Cloud & DevOps', students: '8,500+', rating: 4.8 },
  { name: 'Elena Vasquez', role: 'Cybersecurity Director', bio: 'Former NSA analyst and CISSP. Led security teams at Fortune 100 companies. Published author on threat intelligence.', specialty: 'Offensive Security', students: '6,200+', rating: 4.9 },
  { name: 'James Okafor', role: 'Data Science Lead', bio: 'Ex-Meta data scientist. Built recommendation engines serving billions. Expert in large-scale data systems.', specialty: 'Big Data & Analytics', students: '9,800+', rating: 4.8 },
];

const testimonials = [
  { name: 'Alex Rodriguez', role: 'ML Engineer at Tesla', text: 'The Generative AI Masterclass completely transformed my career. Within 3 months of completing the course, I landed my dream role. The hands-on projects were incredibly relevant.', rating: 5, path: 'AI Engineer Path' },
  { name: 'Priya Sharma', role: 'Cloud Architect at Deloitte', text: 'Zion Academy gave me the confidence and skills to architect multi-cloud solutions. The certification is recognized across the industry. Best investment I ever made.', rating: 5, path: 'Cloud Architect Path' },
  { name: 'David Kim', role: 'Security Lead at JPMorgan', text: 'The cybersecurity program is world-class. Real-world scenarios, expert instructors, and a community that keeps you motivated long after graduation.', rating: 5, path: 'Security Analyst Path' },
  { name: 'Maria Santos', role: 'VP Engineering at Stripe', text: 'We enrolled our entire engineering team in the corporate program. The ROI was incredible — productivity up 40% and we launched our AI product line within 6 months.', rating: 5, path: 'Corporate Training' },
  { name: 'Thomas Weber', role: 'CTO at FinTech Startup', text: 'As a business leader, the AI Strategy course gave me the framework to make smart technology decisions. No fluff — just actionable insights that drove real results.', rating: 5, path: 'AI for Business' },
  { name: 'Aisha Johnson', role: 'Data Scientist at Netflix', text: 'From complete beginner to data scientist in 5 months. The learning path structure and mentorship made all the difference. The capstone project became my portfolio centerpiece.', rating: 5, path: 'Data Science Path' },
];

const corporatePackages = [
  { name: 'Starter', price: '5,000', perUser: '$299/user', seats: '10-25 seats', features: ['Access to all courses', 'Progress dashboard', 'Monthly reports', 'Email support', 'Course completion certificates'], highlight: false, gradient: 'from-slate-700 to-slate-800' },
  { name: 'Professional', price: '15,000', perUser: '$249/user', seats: '25-100 seats', features: ['Everything in Starter', 'Custom learning paths', 'Dedicated account manager', 'Live Q&A sessions', 'Priority support', 'Team analytics & insights', 'Quarterly strategy calls'], highlight: true, gradient: 'from-purple-700 to-indigo-800' },
  { name: 'Enterprise', price: 'Custom', perUser: 'Volume pricing', seats: '100+ seats', features: ['Everything in Professional', 'Custom course development', 'On-site training options', 'API access & LMS integration', 'Executive coaching', 'Dedicated instructors', 'SLA guarantees', 'White-label options'], highlight: false, gradient: 'from-emerald-700 to-teal-800' },
];

const freeResources = [
  { title: 'AI Foundations E-Book', type: 'PDF Guide', description: 'Comprehensive 200-page guide covering AI fundamentals, terminology, and real-world applications.' },
  { title: 'Cloud Migration Checklist', type: 'Template', description: 'Step-by-step checklist for planning and executing enterprise cloud migrations successfully.' },
  { title: 'ML Model Deployment Guide', type: 'Tutorial', description: 'Learn to deploy ML models to production using Docker, Kubernetes, and CI/CD pipelines.' },
  { title: 'Cybersecurity Audit Framework', type: 'Framework', description: 'Complete framework for conducting security audits aligned with NIST and ISO 27001 standards.' },
  { title: 'Data Strategy Playbook', type: 'Playbook', description: 'Build a data-driven organization with our proven data strategy and governance framework.' },
  { title: 'AI ROI Calculator', type: 'Tool', description: 'Calculate the potential return on investment for AI initiatives in your organization.' },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-950 to-cyan-900/40" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <AcademicCapIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Zion Tech Group Academy</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Master AI & Technology
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              World-class training programs designed by industry experts. From beginner to enterprise — 
              accelerate your career with cutting-edge AI, cloud, security, and data science education.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="#courses" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
                Explore Courses
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#corporate" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                Corporate Training
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '50,000+', label: 'Students Enrolled' },
                { value: '89', label: 'Expert Courses' },
                { value: '98%', label: 'Completion Rate' },
                { value: '4.9/5', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COURSE CATEGORIES ═══ */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Course Categories</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Five specialized tracks covering the most in-demand technology skills of 2026
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((cat) => (
              <div key={cat.name} className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 p-8 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} mb-5`}>
                  {cat.icon === 'brain' && <BrainIcon className="w-7 h-7 text-white" />}
                  {cat.icon === 'cloud' && <CloudIcon className="w-7 h-7 text-white" />}
                  {cat.icon === 'shield' && <ShieldIcon className="w-7 h-7 text-white" />}
                  {cat.icon === 'database' && <DatabaseIcon className="w-7 h-7 text-white" />}
                  {cat.icon === 'briefcase' && <BriefcaseIcon className="w-7 h-7 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-slate-400 mb-4">{cat.description}</p>
                <span className="text-sm font-medium text-purple-400">{cat.count} courses available →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED COURSES ═══ */}
      <section id="courses" className="py-20 lg:py-28 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Featured Courses</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Industry-leading programs with hands-on projects, mentorship, and career support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.title} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1">
                {/* Course header gradient */}
                <div className={`h-2 bg-gradient-to-r ${course.gradient}`} />
                
                <div className="p-6">
                  {/* Badge */}
                  {course.badge && (
                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-3">
                      {course.badge}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{course.subtitle}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span>{course.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{course.level}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">{course.rating}</span>
                    <span className="text-sm text-slate-500">({course.reviews.toLocaleString()} reviews)</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${course.price.toLocaleString()}</span>
                      <span className="ml-2 text-sm text-slate-500 line-through">${course.originalPrice.toLocaleString()}</span>
                    </div>
                    <button className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-600/30 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATION PROGRAMS ═══ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Certification Programs</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Industry-recognized certifications that validate your expertise and accelerate your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {certifications.map((cert) => (
              <div key={cert.code} className={`relative overflow-hidden rounded-2xl ${cert.bg} border ${cert.color}/30 p-8 hover:shadow-xl transition-all`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-flex px-3 py-1 rounded-lg ${cert.bg} border ${cert.color}/30 mb-3`}>
                      <span className="text-xs font-mono font-bold text-slate-300">{cert.code}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{cert.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${cert.price}</div>
                    <span className="text-xs text-slate-400">exam fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-slate-900/50">
                    <div className="text-lg font-bold text-white">{cert.modules}</div>
                    <div className="text-xs text-slate-400">Modules</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-900/50">
                    <div className="text-lg font-bold text-white">{cert.examHours}h</div>
                    <div className="text-xs text-slate-400">Exam Duration</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-900/50">
                    <div className="text-lg font-bold text-white">{cert.validity}</div>
                    <div className="text-xs text-slate-400">Validity</div>
                  </div>
                </div>

                <button className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 font-medium text-white hover:bg-white/10 transition-colors">
                  Get Certified
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LEARNING PATHS ═══ */}
      <section className="py-20 lg:py-28 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Learning Paths</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Structured roadmaps that take you from beginner to job-ready professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {learningPaths.map((path) => (
              <div key={path.title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${path.gradient} border ${path.border} p-8 hover:shadow-xl transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{path.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-slate-300">{path.duration}</span>
                </div>

                <p className="text-slate-300 mb-4">{path.courses} courses • {path.outcome}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {path.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-slate-900/50 text-sm text-slate-300 border border-slate-700/50">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    View Path <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTRUCTOR PROFILES ═══ */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Learn From the Best</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our instructors are industry veterans from Google, AWS, Meta, and top security firms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor) => (
              <div key={instructor.name} className="group text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/5">
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white">
                    {instructor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{instructor.name}</h3>
                <p className="text-sm text-purple-400 font-medium mb-3">{instructor.role}</p>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{instructor.bio}</p>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span>⭐ {instructor.rating}</span>
                  <span>👥 {instructor.students}</span>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  <span className="px-2 py-1 rounded bg-slate-800">{instructor.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STUDENT TESTIMONIALS ═══ */}
      <section className="py-20 lg:py-28 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">What Our Students Say</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join 50,000+ professionals who transformed their careers with Zion Academy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
                {/* Stars */}
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">{testimonial.path}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORPORATE TRAINING PACKAGES ═══ */}
      <section id="corporate" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Corporate Training</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upskill your entire organization with tailored training programs and dedicated support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {corporatePackages.map((pkg) => (
              <div key={pkg.name} className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${pkg.gradient} border ${pkg.highlight ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10 scale-105' : 'border-slate-700/50'} p-8`}>
                {pkg.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                )}
                {pkg.highlight && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-purple-500 text-white">Most Popular</span>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-white">
                    {pkg.price === 'Custom' ? 'Custom' : `$${pkg.price}`}
                  </span>
                  {pkg.price !== 'Custom' && <span className="text-slate-400">/year</span>}
                </div>
                <p className="text-sm text-slate-400 mb-6">{pkg.perUser} • {pkg.seats}</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-medium transition-all ${pkg.highlight ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                  {pkg.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FREE RESOURCES ═══ */}
      <section className="py-20 lg:py-28 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Free Resources</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Start learning today with our complimentary guides, templates, and tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeResources.map((resource) => (
              <div key={resource.title} className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
                    FREE
                  </span>
                  <span className="text-xs text-slate-500">{resource.type}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{resource.description}</p>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Download Free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT INFORMATION ═══ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Get In Touch</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Ready to start your learning journey? Contact us for enrollment, corporate packages, or custom training solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {/* Email */}
            <div className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
              <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                kleber@ziontechgroup.com
              </a>
              <p className="text-sm text-slate-500 mt-2">We respond within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
              <a href="tel:+13024640950" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                +1 302 464 0950
              </a>
              <p className="text-sm text-slate-500 mt-2">Mon-Fri, 9am-6pm EST</p>
            </div>

            {/* Address */}
            <div className="text-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Visit Us</h3>
              <p className="text-emerald-400 font-medium">
                364 E Main St STE 1008
              </p>
              <p className="text-sm text-slate-400 mt-1">Middletown, DE 19709</p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/20 p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Career?
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                Join thousands of professionals who chose Zion Academy. Start with a free consultation 
                and build your personalized learning path today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:kleber@ziontechgroup.com" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25">
                  Schedule Free Consultation
                </a>
                <a href="tel:+13024640950" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                  📞 Call +1 302 464 0950
                </a>
              </div>
            </div>
          </div>

          {/* Footer contact bar */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Zion Tech Group Academy • 364 E Main St STE 1008, Middletown, DE 19709 • 
              <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400 hover:text-purple-300 mx-1">kleber@ziontechgroup.com</a> • 
              <a href="tel:+13024640950" className="text-cyan-400 hover:text-cyan-300 mx-1">+1 302 464 0950</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
