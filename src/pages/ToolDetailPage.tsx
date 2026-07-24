import React, { useState } from 'react';
import { Heart, Star, Sparkles, CheckCircle2, ChevronDown, Share2, HelpCircle, ShieldCheck } from 'lucide-react';
import { ToolItem } from '../types/tool';
import { TOOLS } from '../data/toolsData';
import { CATEGORIES } from '../data/categoriesData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { AdComponent } from '../components/layout/AdComponent';
import { ToolRunner } from '../components/tools/ToolRunner';
import { ToolCard } from '../components/tools/ToolCard';
import { useHistory } from '../context/HistoryContext';

interface ToolDetailPageProps {
  slug: string;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ slug }) => {
  const tool = TOOLS.find((t) => t.slug === slug) || TOOLS[0];
  const category = CATEGORIES.find((c) => c.id === tool.category) || CATEGORIES[0];
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);

  const { isFavorite, toggleFavorite } = useHistory();
  const favorite = isFavorite(tool.slug);

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Normalize SEO content and detailed fields safely with fallbacks
  const pageH1 = tool.seoContent?.h1 || tool.title;
  const introText = tool.seoContent?.introduction || tool.introduction || tool.shortDescription;
  const howToSteps = tool.seoContent?.howTo || tool.howToUse || [];
  const featuresList = tool.seoContent?.features || tool.features || [];
  const benefitsList = tool.seoContent?.benefits || tool.benefits || [];
  
  const rawFaqs = tool.seoContent?.faqs || tool.faqs || [];
  const faqsList = rawFaqs.map((faq) => ({
    question: (faq as any).question || (faq as any).q || '',
    answer: (faq as any).answer || (faq as any).a || '',
  }));

  // Generate HowTo and FAQ schemas
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.title}`,
    description: tool.shortDescription,
    step: howToSteps.map((stepText, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: stepText,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SeoHead
        title={`${tool.title} - Free Online Tool`}
        description={tool.metaDescription || tool.shortDescription}
        jsonLd={[howToSchema, faqSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb Header */}
        <Breadcrumbs
          items={[
            { label: category.name, href: `/category/${category.slug}` },
            { label: tool.title },
          ]}
        />

        {/* Top Leaderboard Ad Slot */}
        <AdComponent type="top-banner" />
        <AdComponent type="mobile-banner" />

        {/* Main Grid: Tool Area + Sidebar Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Tool & Content Column */}
          <main className="lg:col-span-8 space-y-8">
            {/* Tool Header Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="capitalize">{category.name}</span>
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{tool.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{(tool.usesCount / 1000).toFixed(1)}k usages</span>

                  <button
                    onClick={() => toggleFavorite(tool.slug)}
                    className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 transition-colors ml-2"
                    title={favorite ? 'Saved in favorites' : 'Save to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {pageH1}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {introText}
              </p>

              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client-Side Privacy • Zero Data Sent To Remote Servers</span>
              </div>
            </div>

            {/* Interactive Tool Runner Component */}
            <ToolRunner tool={tool} />

            {/* In-Article Ad Slot */}
            <AdComponent type="in-article" />

            {/* How to Use Step-by-Step */}
            {howToSteps.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  How to Use {tool.title}
                </h2>
                <ol className="space-y-3">
                  {howToSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Key Features & Benefits */}
            {(featuresList.length > 0 || benefitsList.length > 0) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuresList.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {featuresList.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {benefitsList.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {benefitsList.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* FAQ Accordion */}
            {faqsList.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {faqsList.map((faq, idx) => (
                    <div key={idx} className="pt-3">
                      <button
                        onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-200 text-sm hover:text-indigo-600 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIdx === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                      </button>
                      {openFaqIdx === idx && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-6">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sidebar Ad Placement */}
            <AdComponent type="sidebar" />

            {/* Category Quick Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                More in {category.name}
              </h4>
              <div className="space-y-2">
                {TOOLS.filter((t) => t.category === category.id).slice(0, 6).map((t) => (
                  <a
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className={`block p-2.5 rounded-xl text-xs transition-colors ${
                      t.slug === tool.slug
                        ? 'bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Sidebar Ad Placement */}
            <AdComponent type="sidebar" />
          </aside>
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Related Online Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
