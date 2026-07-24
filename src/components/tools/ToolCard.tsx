import React from 'react';
import { Heart, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { useHistory } from '../../context/HistoryContext';

interface ToolCardProps {
  tool: ToolItem;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite } = useHistory();
  const favorite = isFavorite(tool.slug);

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

      <div>
        {/* Top Bar: Category & Favorite */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles className="w-3 h-3" />
            <span className="capitalize">{tool.category.replace('-', ' ')}</span>
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tool.slug);
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Title and Arrow */}
        <a href={`/tools/${tool.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {tool.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {tool.shortDescription}
          </p>
        </a>
      </div>

      {/* Footer: Rating & Usage */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1 font-medium text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{tool.rating.toFixed(1)}</span>
        </div>
        <span className="text-[11px]">{(tool.usesCount / 1000).toFixed(1)}k uses</span>
      </div>
    </div>
  );
};
