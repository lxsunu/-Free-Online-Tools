import React, { useState } from 'react';
import { Palette, Layers, Eye, Copy, Check, Sliders } from 'lucide-react';

interface ColorCssToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const ColorCssTools: React.FC<ColorCssToolsProps> = ({ toolSlug, onSuccess }) => {
  // Glassmorphism state
  const [blur, setBlur] = useState(12);
  const [transparency, setTransparency] = useState(25);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  // Contrast checker state
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Glassmorphism CSS code
  const glassCss = `background: rgba(255, 255, 255, ${(transparency / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onSuccess) onSuccess('Copied CSS code to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Glassmorphism Generator */}
      {toolSlug === 'css-glassmorphism-generator' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Backdrop Blur ({blur}px)
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transparency ({transparency}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={transparency}
                onChange={(e) => setTransparency(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col justify-between p-8 rounded-2xl relative overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl">
            <div
              className="p-6 text-white shadow-2xl relative z-10 space-y-3"
              style={{
                background: `rgba(255, 255, 255, ${transparency / 100})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
              }}
            >
              <h4 className="font-bold text-lg">Frosted Glass Card</h4>
              <p className="text-xs text-white/80">Real-time glassmorphic UI container preview against colorful gradient backdrop.</p>
              <button
                onClick={() => handleCopy(glassCss)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied CSS' : 'Copy Glass CSS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Contrast Checker */}
      {toolSlug === 'color-contrast-checker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <span className="font-mono text-sm">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <span className="font-mono text-sm">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border text-center space-y-2 shadow-sm" style={{ color: fgColor, backgroundColor: bgColor }}>
            <h3 className="text-2xl font-bold">Contrast Legibility Preview</h3>
            <p className="text-sm">This text is rendered using your selected foreground and background colors.</p>
          </div>
        </div>
      )}
    </div>
  );
};
