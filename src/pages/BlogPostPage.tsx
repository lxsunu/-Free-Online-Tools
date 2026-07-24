import React from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { AdComponent } from '../components/layout/AdComponent';
import { Calendar, User, Clock, Share2, Sparkles } from 'lucide-react';
import { TOOLS } from '../data/toolsData';

interface BlogPostPageProps {
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  const relatedTools = TOOLS.slice(0, 4);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    datePublished: post.publishedAt,
  };

  return (
    <>
      <SeoHead
        title={`${post.title} | OmniTools Blog`}
        description={post.summary}
        jsonLd={articleSchema}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

        {/* Article Header */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider rounded-full">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-y border-slate-200 dark:border-slate-800 py-3">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-indigo-600" /> {post.author.name} ({post.author.role})</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </div>

        <AdComponent type="top-banner" />

        {/* Article Body */}
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <AdComponent type="in-article" />

        {/* Author Card */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{post.author.name}</h4>
            <p className="text-xs text-slate-500">{post.author.role}</p>
          </div>
        </div>
      </div>
    </>
  );
};
