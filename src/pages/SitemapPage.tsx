import React from 'react';
import { CATEGORIES } from '../data/categoriesData';
import { TOOLS } from '../data/toolsData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { FileCode, Download } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const downloadSitemapXml = () => {
    const urls = [
      'https://omnitools.app/',
      'https://omnitools.app/blog',
      ...CATEGORIES.map((c) => `https://omnitools.app/category/${c.slug}`),
      ...TOOLS.map((t) => `https://omnitools.app/tools/${t.slug}`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SeoHead
        title="HTML Sitemap Feed - All 200+ Free Web Tools"
        description="Index of all 200+ free online web tools, categories, and blog guides on OmniTools."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={[{ label: 'Sitemap' }]} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-8 h-8 text-indigo-600" /> Complete Website Sitemap
            </h1>
            <p className="text-sm text-slate-500">
              Full directory index of all {TOOLS.length} online tools and categories.
            </p>
          </div>

          <button
            onClick={downloadSitemapXml}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download sitemap.xml
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3"
              >
                <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  {cat.name} ({catTools.length})
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {catTools.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`/tools/${t.slug}`}
                        className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        • {t.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
