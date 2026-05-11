import React, { memo } from 'react';

interface LoadingProps {
  className?: string;
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = memo(({ className = '', children }) => {
  return (
    <div
      className={`flex min-h-[40vh] items-center justify-center bg-slate-950 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {children ?? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      )}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;