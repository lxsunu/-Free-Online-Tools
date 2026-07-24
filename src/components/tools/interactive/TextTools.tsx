import React, { useState } from 'react';
import { Type, Copy, Check, RefreshCw, FileText, AlignLeft, Hash } from 'lucide-react';

interface TextToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const TextTools: React.FC<TextToolsProps> = ({ toolSlug, onSuccess }) => {
  const [text, setText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. Online web tools empower developers, writers, and SEO creators around the world.'
  );
  const [textB, setTextB] = useState<string>('The fast brown fox jumps over the sleepy dog.');
  const [copied, setCopied] = useState(false);

  // Stats calculation for Word Counter
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpace = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim()).length : 0;
  const readingTimeMin = (words / 200).toFixed(1);

  // Keyword Density
  const getTopKeywords = () => {
    if (!text.trim()) return [];
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const tokens = clean.split(/\s+/).filter((w) => w.length > 3);
    const freq: Record<string, number> = {};
    tokens.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  };

  const topKeywords = getTopKeywords();

  // Case Converter handlers
  const handleCaseChange = (type: string) => {
    let result = text;
    if (type === 'upper') result = text.toUpperCase();
    if (type === 'lower') result = text.toLowerCase();
    if (type === 'title') {
      result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (type === 'camel') {
      result = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
    if (type === 'snake') {
      result = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    if (type === 'kebab') {
      result = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    setText(result);
    if (onSuccess) onSuccess(`Converted case to ${type}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Live Counter Stats Grid (If Word Counter or General Text) */}
      {(toolSlug === 'word-counter' || toolSlug === 'case-converter') && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Words</span>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{words}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Chars</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{charsWithSpace}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sentences</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{sentences}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Paragraphs</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{paragraphs}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Read Time</span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{readingTimeMin} m</div>
          </div>
        </div>
      )}

      {/* Case Converter Toolbar */}
      {toolSlug === 'case-converter' && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs">
          <button onClick={() => handleCaseChange('upper')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            UPPERCASE
          </button>
          <button onClick={() => handleCaseChange('lower')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            lowercase
          </button>
          <button onClick={() => handleCaseChange('title')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            Title Case
          </button>
          <button onClick={() => handleCaseChange('camel')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            camelCase
          </button>
          <button onClick={() => handleCaseChange('snake')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            snake_case
          </button>
          <button onClick={() => handleCaseChange('kebab')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg hover:bg-indigo-50 font-semibold">
            kebab-case
          </button>
        </div>
      )}

      {/* Textarea Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Type or paste your text here..."
          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Keyword Density Breakdown */}
      {toolSlug === 'word-counter' && topKeywords.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Keyword Density</h4>
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(([word, count]) => (
              <span
                key={word}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span>{word}</span>
                <span className="px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold">
                  {count}x ({((count / words) * 100).toFixed(1)}%)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
