import React, { useState } from 'react';
import { Type, Copy, Check, RefreshCw, FileText, AlignLeft, Hash, Search, ArrowRightLeft, Eye, Download } from 'lucide-react';

interface TextToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const TextTools: React.FC<TextToolsProps> = ({ toolSlug, onSuccess }) => {
  // Input State
  const [text, setText] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Find and Replace state
  const [findTerm, setFindTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [replaceCount, setReplaceCount] = useState<number | null>(null);

  // Lorem Ipsum generator state
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedLorem, setGeneratedLorem] = useState('');

  // Stats calculation for Word Counter & Text Analyzers
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
      .slice(0, 8);
  };

  const topKeywords = getTopKeywords();

  // Case Converter handlers
  const handleCaseChange = (type: string) => {
    if (!text) return;
    let result = text;
    if (type === 'upper') result = text.toUpperCase();
    if (type === 'lower') result = text.toLowerCase();
    if (type === 'title') {
      result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
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
    if (type === 'pascal') {
      result = text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, '');
    }
    setText(result);
    if (onSuccess) onSuccess(`Converted case to ${type}`);
  };

  // Find and replace handler
  const handleFindReplace = () => {
    if (!findTerm) return;
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(findTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    const newText = text.replace(regex, replaceTerm);
    setText(newText);
    setReplaceCount(count);
    if (onSuccess) onSuccess(`Replaced ${count} occurrences of "${findTerm}"`);
  };

  // Lorem Ipsum Generator Logic
  const handleGenerateLorem = () => {
    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
      'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
      'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
      'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const getRandomWord = () => loremWords[Math.floor(Math.random() * loremWords.length)];

    const makeSentence = (minWords = 8, maxWords = 15) => {
      const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
      const sentenceWords = Array.from({ length: len }, getRandomWord);
      sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
      return sentenceWords.join(' ') + '.';
    };

    const makeParagraph = (sentenceCount = 5) => {
      return Array.from({ length: sentenceCount }, () => makeSentence()).join(' ');
    };

    let result = '';
    if (loremType === 'paragraphs') {
      const paras = Array.from({ length: loremCount }, () => makeParagraph());
      if (startWithLorem && paras.length > 0) {
        paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      }
      result = paras.join('\n\n');
    } else if (loremType === 'sentences') {
      const sents = Array.from({ length: loremCount }, () => makeSentence());
      if (startWithLorem && sents.length > 0) {
        sents[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      }
      result = sents.join(' ');
    } else {
      const wList = Array.from({ length: loremCount }, getRandomWord);
      if (startWithLorem && wList.length >= 2) {
        wList[0] = 'lorem';
        wList[1] = 'ipsum';
      }
      result = wList.join(' ');
    }

    setGeneratedLorem(result);
    if (onSuccess) onSuccess(`Generated ${loremCount} ${loremType} of Lorem Ipsum`);
  };

  const handleCopyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Lorem Ipsum Generator */}
      {toolSlug === 'lorem-ipsum-generator' ? (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity ({loremCount})
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={loremCount}
                  onChange={(e) => setLoremCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={loremType}
                  onChange={(e) => setLoremType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
                >
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Start with 'Lorem ipsum'</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerateLorem}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Placeholder Text</span>
            </button>
          </div>

          {generatedLorem && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Generated Text Output</span>
                <button
                  onClick={() => handleCopyText(generatedLorem)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-lg flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              </div>
              <textarea
                value={generatedLorem}
                readOnly
                rows={8}
                className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm leading-relaxed"
              />
            </div>
          )}
        </div>
      ) : toolSlug === 'find-replace' ? (
        /* Find and Replace Tool */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 border p-4 rounded-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Find string</label>
              <input
                type="text"
                value={findTerm}
                onChange={(e) => setFindTerm(e.target.value)}
                placeholder="Search word..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Replace with</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Replacement..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-sm"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => setMatchCase(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Match case sensitive</span>
              </label>

              <button
                onClick={handleFindReplace}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow"
              >
                Replace All
              </button>
            </div>
            {replaceCount !== null && (
              <div className="sm:col-span-2 text-xs font-bold text-emerald-600">
                Found & replaced {replaceCount} matching instance(s).
              </div>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Type or paste your text to perform find & replace operations..."
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm leading-relaxed"
          />
        </div>
      ) : toolSlug === 'text-diff-checker' ? (
        /* Text Diff Checker Tool */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Original Text (A)</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Paste original text string here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Modified Text (B)</label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                rows={8}
                placeholder="Paste modified text string here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Comparison Summary</span>
            <div className="text-xs text-slate-200 font-mono">
              Text A length: {text.length} chars | Text B length: {textB.length} chars | Length Difference: {Math.abs(text.length - textB.length)} chars
            </div>
            {text === textB ? (
              <span className="text-xs font-bold text-emerald-400">✓ Texts are identical!</span>
            ) : (
              <span className="text-xs font-bold text-amber-400">⚠ Differences detected between Text A and Text B.</span>
            )}
          </div>
        </div>
      ) : (
        /* Standard Word Counter & Case Converter */
        <div className="space-y-6">
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

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Type or paste your text here to analyze words, characters, or convert case..."
              className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
            {text && (
              <button
                onClick={() => handleCopyText(text)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {topKeywords.length > 0 && (
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
                      {count}x ({((count / (words || 1)) * 100).toFixed(1)}%)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
