import React, { useState, useEffect } from 'react';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const PasswordTools: React.FC<PasswordToolsProps> = ({ toolSlug, onSuccess }) => {
  const [mode, setMode] = useState<'password' | 'passphrase' | 'pin'>(
    toolSlug === 'passphrase-generator' ? 'passphrase' :
    toolSlug === 'pin-code-generator' ? 'pin' : 'password'
  );

  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);

  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');

  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const wordList = [
    'correct', 'horse', 'battery', 'staple', 'rocket', 'galaxy', 'silent', 'ocean',
    'furious', 'tiger', 'breeze', 'shadow', 'crystal', 'anchor', 'velvet', 'timber',
    'zenith', 'phoenix', 'orbital', 'monarch', 'harbor', 'emerald', 'beacon', 'boulder'
  ];

  const generate = () => {
    let result = '';

    if (mode === 'password') {
      let chars = '';
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (useNumbers) chars += '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else if (mode === 'passphrase') {
      const words: string[] = [];
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < wordCount; i++) {
        words.push(wordList[array[i] % wordList.length]);
      }
      result = words.join(separator);
    } else {
      // PIN
      const array = new Uint32Array(length > 12 ? 6 : length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < (length > 12 ? 6 : length); i++) {
        result += (array[i] % 10).toString();
      }
    }

    setGeneratedResult(result);
    setCopied(false);
    if (onSuccess) onSuccess('Generated new secure credentials');
  };

  useEffect(() => {
    generate();
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, wordCount, separator]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute password strength score (0 to 100)
  const getStrengthScore = () => {
    let score = 0;
    if (generatedResult.length >= 12) score += 40;
    else if (generatedResult.length >= 8) score += 20;

    if (/[A-Z]/.test(generatedResult)) score += 15;
    if (/[a-z]/.test(generatedResult)) score += 15;
    if (/[0-9]/.test(generatedResult)) score += 15;
    if (/[^A-Za-z0-9]/.test(generatedResult)) score += 15;

    return Math.min(100, score);
  };

  const strength = getStrengthScore();

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl text-xs max-w-md">
        <button
          onClick={() => setMode('password')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
            mode === 'password' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setMode('passphrase')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
            mode === 'passphrase' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500'
          }`}
        >
          XKCD Passphrase
        </button>
        <button
          onClick={() => setMode('pin')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
            mode === 'pin' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500'
          }`}
        >
          PIN Code
        </button>
      </div>

      {/* Result Display Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tracking-wider break-all selection:bg-emerald-500/30">
            {generatedResult}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generate}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Password'}</span>
            </button>
          </div>
        </div>

        {/* Strength meter bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {strength >= 80 ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <span>
              Strength Score: <strong className="text-slate-200">{strength}%</strong> (
              {strength >= 80 ? 'Ultra Strong' : strength >= 50 ? 'Moderate' : 'Weak'})
            </span>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                strength >= 80 ? 'bg-emerald-500' : strength >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        {mode === 'password' && (
          <>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Password Length: {length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Symbols (!@#$)
              </label>
            </div>
          </>
        )}

        {mode === 'passphrase' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Word Count ({wordCount} words)
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Word Separator
              </label>
              <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                maxLength={3}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
