import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LegalPage } from './pages/LegalPage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);

    // Intercept internal anchor link clicks for smooth SPA experience
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.getAttribute('download') &&
        target.target !== '_blank' &&
        !target.href.includes('#')
      ) {
        e.preventDefault();
        const path = target.getAttribute('href') || '/';
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const renderRoute = () => {
    const path = currentPath;

    if (path === '/' || path === '') {
      return <HomePage />;
    }

    if (path.startsWith('/tools/')) {
      const slug = path.replace('/tools/', '');
      return <ToolDetailPage slug={slug} />;
    }

    if (path.startsWith('/category/')) {
      const slug = path.replace('/category/', '');
      return <CategoryPage slug={slug} />;
    }

    if (path === '/blog') {
      return <BlogListPage />;
    }

    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return <BlogPostPage slug={slug} />;
    }

    if (path.startsWith('/legal/')) {
      const type = path.replace('/legal/', '') as any;
      return <LegalPage type={type} />;
    }

    if (path === '/sitemap' || path === '/sitemap.xml') {
      return <SitemapPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <ThemeProvider>
      <HistoryProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white font-sans">
          <Header />
          <div className="flex-1">{renderRoute()}</div>
          <Footer />
        </div>
      </HistoryProvider>
    </ThemeProvider>
  );
}

export default App;
