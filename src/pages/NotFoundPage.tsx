import React from 'react';
import { Wrench, Home, Search } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SeoHead title="Page Not Found | OmniTools" description="The requested tool or page could not be found." />

      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-3xl shadow-xl">
          404
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Tool or Page Not Found
        </h1>

        <p className="text-sm text-slate-500 max-w-md">
          The requested page may have been moved or updated. Try searching our 200+ free online tools index.
        </p>

        <a
          href="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Back to Home
        </a>
      </div>
    </>
  );
};
