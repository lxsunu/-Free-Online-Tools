import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Star, ShieldCheck, Zap, ArrowRight, Layers, HelpCircle, BookOpen, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/categoriesData';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { ToolCard } from '../components/tools/ToolCard';
import { AdComponent } from '../components/layout/AdComponent';
import { useHistory } from '../context/HistoryContext';
import { SeoHead } from '../components/common/SeoHead';

export const HomePage: React.FC = () => {
  const { history, favorites } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTools = TOOLS.filter((t) => t.isTrending || t.isFeatured).slice(0, 8);
  const popularTools = TOOLS.filter((t) => t.isPopular).slice(0, 8);

  const homeFaqs = [
    {
      q: 'Are these online tools completely free to use?',
      a: 'Yes, 100% free with unlimited usage. No subscription, credit card, or user registration required.',
    },
    {
      q: 'Is my data and files kept private?',
      a: 'Absolutely! All calculations, image compression, QR code rendering, and formatting run locally inside your web browser. Your data never touches remote servers.',
    },
    {
      q: 'How many online tools are available on OmniTools?',
      a: 'OmniTools offers over 200+ tools spanning Image processing, PDF, Text, Developer utilities, SEO, Color palettes, Calculators, and Unit Converters.',
    },
  ];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OmniTools',
    url: window.location.origin,
    description: '200+ free online web tools for developers, designers, and SEO creators.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SeoHead
        title="OmniTools - 200+ Free Online Web Tools"
        description="Fast, free, and 100% private online tools for image compression, PDF, text formatting, developer JSON, password generation, unit conversion, and calculators."
        jsonLd={websiteSchema}
      />

      <div className="space-y-16 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Over 200+ Free Online Utilities</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Smart Web Tools for Developers, Designers & SEO Experts
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Compress images, format JSON, generate vector QR codes, calculate formulas, and convert files. <strong className="text-slate-800 dark:text-slate-200 font-semibold">100% Client-Side & Private.</strong>
            </p>

            {/* Hero Instant Search */}
            <div className="max-w-2xl mx-auto relative shadow-2xl rounded-2xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 200+ tools (e.g. image compressor, qr code, json, password)..."
                  className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 shadow-inner"
                />
                <button className="absolute right-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all">
                  Search
                </button>
              </div>
            </div>

            {/* Stats Trust Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Server Delay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-purple-500" />
                <span>200+ Web Tools</span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Leaderboard Ad Slot */}
        <div className="max-w-7xl mx-auto px-4">
          <AdComponent type="top-banner" />
          <AdComponent type="mobile-banner" />
        </div>

        {/* Search Results Filter Overlay if typing in Hero */}
        {searchQuery.trim() && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Search Results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOOLS.filter(
                (t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Featured & Trending Tools */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Trending & Popular Tools
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Browse Tools by Category
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Explore 21 specialized tool categories designed to streamline your daily workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.badgeColor} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate text-sm">
                      {cat.name}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
                    {cat.count} tools →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Popular Tools */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Most Used Online Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* In-Article Ad Slot */}
        <div className="max-w-7xl mx-auto px-4">
          <AdComponent type="in-article" />
        </div>

        {/* History / Favorites Section */}
        {favorites.length > 0 && (
          <section id="history" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Your Saved Favorite Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOOLS.filter((t) => favorites.includes(t.slug)).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Blog Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Latest Articles & Guides
              </h2>
            </div>
            <a href="/blog" className="text-xs font-bold text-indigo-600 hover:underline">
              View All Posts →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.author.name}</span>
                  <span>{post.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-600" /> Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about our free web tools and client-side processing.
            </p>
          </div>

          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
