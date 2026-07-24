import React from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { BookOpen, Calendar, User } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  return (
    <>
      <SeoHead
        title="Blog & Guides - Free Online Tools Tips & SEO"
        description="Read comprehensive guides, tutorials, and tips on image compression, developer APIs, PDF conversion, and SEO optimization."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" /> OmniTools Blog & Guides
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            In-depth technical guides, SEO best practices, and image optimization tutorials written for web professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author.name}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.publishedAt}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
