import React from 'react';
import { CATEGORIES } from '../data/categoriesData';
import { TOOLS } from '../data/toolsData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { ToolCard } from '../components/tools/ToolCard';
import { AdComponent } from '../components/layout/AdComponent';
import { Sparkles, Layers } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
  const categoryTools = TOOLS.filter((t) => t.category === category.id);

  return (
    <>
      <SeoHead
        title={`${category.name} Tools - Free Online Utilities`}
        description={category.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={[{ label: category.name }]} />

        {/* Category Hero */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {category.name} Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {category.description} Free, fast, and secure client-side online tools with zero registration needed.
          </p>

          <span className="inline-block text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/30">
            {categoryTools.length} tools available
          </span>
        </div>

        <AdComponent type="top-banner" />

        {/* Tools Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" /> All {category.name} Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
