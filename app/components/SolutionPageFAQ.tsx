type FAQItem = { question: string; answer: string };

type SolutionPageFAQProps = {
  items: FAQItem[];
  industryName: string;
};

export default function SolutionPageFAQ({ items, industryName }: SolutionPageFAQProps) {
  if (!items.length) return null;
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">FAQ</p>
        <h2 className="mt-2 text-xl font-bold text-white">
          Common questions about {industryName} AI solutions
        </h2>
        <dl className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.question} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-100">{item.question}</dt>
              <dd className="mt-1 text-sm text-slate-300 leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
