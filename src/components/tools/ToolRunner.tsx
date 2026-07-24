import React, { useState } from 'react';
import { ToolItem } from '../../types/tool';
import { ImageTools } from './interactive/ImageTools';
import { PdfTools } from './interactive/PdfTools';
import { QrCodeTools } from './interactive/QrCodeTools';
import { PasswordTools } from './interactive/PasswordTools';
import { JsonTools } from './interactive/JsonTools';
import { TextTools } from './interactive/TextTools';
import { DeveloperTools } from './interactive/DeveloperTools';
import { ColorCssTools } from './interactive/ColorCssTools';
import { CalculatorConverterTools } from './interactive/CalculatorConverterTools';
import { useHistory } from '../../context/HistoryContext';
import { Copy, Share2, RotateCcw, Check } from 'lucide-react';

interface ToolRunnerProps {
  tool: ToolItem;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool }) => {
  const { addHistory } = useHistory();
  const [copied, setCopied] = useState(false);

  const handleToolSuccess = (summary?: string) => {
    addHistory({
      toolId: tool.id,
      toolSlug: tool.slug,
      toolTitle: tool.title,
      summary: summary || 'Used tool successfully',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tool.title,
        text: tool.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderInteractiveEngine = () => {
    const slug = tool.slug;
    const cat = tool.category;

    if (cat === 'pdf' || slug.includes('pdf')) {
      return <PdfTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (
      cat === 'image' ||
      slug === 'image-compressor' ||
      slug === 'png-to-jpg' ||
      slug === 'jpg-to-png' ||
      slug === 'image-resizer' ||
      slug === 'color-extractor' ||
      slug === 'image-watermark'
    ) {
      return <ImageTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'qr-code' || slug === 'qr-code-generator' || slug.includes('qr')) {
      return <QrCodeTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'password' || slug === 'password-generator' || slug.includes('passphrase') || slug.includes('pin')) {
      return <PasswordTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'json' || slug === 'json-formatter' || slug.includes('json')) {
      return <JsonTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'text' || slug === 'word-counter' || slug === 'case-converter' || slug === 'lorem-ipsum-generator') {
      return <TextTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'developer' || cat === 'security' || slug === 'jwt-decoder' || slug === 'hash-generator' || slug === 'uuid-generator') {
      return <DeveloperTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'color' || cat === 'css' || slug.includes('glassmorphism') || slug.includes('contrast')) {
      return <ColorCssTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    if (cat === 'unit-converter' || cat === 'calculator' || slug.includes('converter') || slug.includes('calculator') || slug.includes('pad')) {
      return <CalculatorConverterTools toolSlug={slug} onSuccess={handleToolSuccess} />;
    }

    // Default Fallback Text Runner
    return <TextTools toolSlug={slug} onSuccess={handleToolSuccess} />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
      {/* Tool Runner Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Interactive Local Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1.5"
            title="Reset Tool"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1.5"
            title="Share Tool"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Engine Body */}
      <div>{renderInteractiveEngine()}</div>
    </div>
  );
};
