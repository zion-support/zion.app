// StepsIndicator — progress tracker for wizard
'use client';

interface Step { id: string; label: string; }
export default function StepsIndicator({ steps, current }: { steps: Step[]; current: string }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => {
        const isActive = s.id === current;
        const isCompleted = steps.findIndex(x => x.id === current) > i;
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition
              ${isActive ? 'bg-purple-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {isCompleted ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${isActive ? 'text-white' : 'text-slate-500'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="mx-4 h-0.5 w-12 bg-slate-700" />}
          </div>
        );
      })}
    </div>
  );
}
