import React from 'react';

type AdType = 'top-banner' | 'mobile-banner' | 'sidebar' | 'in-article';

interface AdComponentProps {
  type: AdType;
  className?: string;
}

export const AdComponent: React.FC<AdComponentProps> = ({ type, className = '' }) => {
  if (type === 'top-banner') {
    return (
      <div className={`hidden md:flex flex-col items-center justify-center my-4 ${className}`}>
        <div className="w-[728px] h-[90px] bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono select-none">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">Advertisement</span>
          <span>Adsterra Leaderboard Slot (728 x 90)</span>
        </div>
      </div>
    );
  }

  if (type === 'mobile-banner') {
    return (
      <div className={`flex md:hidden flex-col items-center justify-center my-3 ${className}`}>
        <div className="w-[320px] h-[50px] bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono select-none">
          <span className="text-[9px] uppercase tracking-wider font-semibold mb-0.5">Advertisement</span>
          <span>Mobile Banner (320 x 50)</span>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
        <div className="w-[300px] h-[250px] bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono select-none p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">Advertisement</span>
          <span>Sidebar Rectangle Slot</span>
          <span className="text-[11px] mt-1 text-slate-400/80">(300 x 250)</span>
        </div>
      </div>
    );
  }

  // in-article
  return (
    <div className={`flex flex-col items-center justify-center my-6 ${className}`}>
      <div className="w-full max-w-[300px] sm:max-w-[336px] h-[250px] bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono select-none p-4 text-center">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">Advertisement</span>
        <span>In-Article Native Ad Placeholder</span>
        <span className="text-[11px] mt-1 text-slate-400/80">(300 x 250 / Responsive)</span>
      </div>
    </div>
  );
};
