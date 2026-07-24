import React, { useState } from 'react';
import { Palette, Layers, Eye, Copy, Check, Sliders, Sun, ShieldCheck } from 'lucide-react';

interface ColorCssToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const ColorCssTools: React.FC<ColorCssToolsProps> = ({ toolSlug, onSuccess }) => {
  // Glassmorphism state
  const [blur, setBlur] = useState(12);
  const [transparency, setTransparency] = useState(25);
  const [copied, setCopied] = useState(false);

  // Box Shadow state
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(10);
  const [shadowBlur, setShadowBlur] = useState(25);
  const [shadowSpread, setShadowSpread] = useState(-5);
  const [shadowColor, setShadowColor] = useState('#0f172a');
  const [shadowOpacity, setShadowOpacity] = useState(20);

  // Contrast checker state
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Glassmorphism CSS code
  const glassCss = `background: rgba(255, 255, 255, ${(transparency / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;`;

  // Box Shadow CSS code
  const rgbaColor = `rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(
    shadowColor.slice(5, 7),
    16
  )}, ${(shadowOpacity / 100).toFixed(2)})`;
  const shadowCss = `box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgbaColor};`;

  // Luminance & Contrast Ratio calculation
  const getLuminance = (hex: string) => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ].map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(fgColor);
  const lum2 = getLuminance(bgColor);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  const contrastRatio = ratio.toFixed(2);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onSuccess) onSuccess('Copied CSS code to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Box Shadow Generator */}
      {toolSlug.includes('box-shadow') || toolSlug.includes('shadow') ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horizontal Offset ({shadowX}px)
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowX}
                  onChange={(e) => setShadowX(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vertical Offset ({shadowY}px)
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowY}
                  onChange={(e) => setShadowY(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blur Radius ({shadowBlur}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spread Radius ({shadowSpread}px)
                </label>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shadow Color</label>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-100 dark:bg-slate-950 p-8 rounded-2xl flex flex-col items-center justify-center relative min-h-[220px]">
            <div
              className="w-48 h-32 bg-white dark:bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all"
              style={{
                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgbaColor}`,
              }}
            >
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Box Shadow Preview</span>
            </div>

            <button
              onClick={() => handleCopy(shadowCss)}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Shadow CSS'}</span>
            </button>
          </div>
        </div>
      ) : toolSlug === 'color-contrast-checker' ? (
        /* Color Contrast Checker */
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="font-mono text-sm font-bold">{fgColor}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="font-mono text-sm font-bold">{bgColor}</span>
              </div>
            </div>
          </div>

          <div
            className="p-8 rounded-2xl border text-center space-y-3 shadow-sm transition-colors"
            style={{ color: fgColor, backgroundColor: bgColor }}
          >
            <h3 className="text-3xl font-extrabold tracking-tight">WCAG Contrast Preview</h3>
            <p className="text-sm max-w-md mx-auto">
              Verify legibility standards for WCAG AA and AAA accessibility compliance across text sizes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contrast Ratio</span>
              <div className="text-2xl font-extrabold text-indigo-400">{contrastRatio} : 1</div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">WCAG AA Normal</span>
              <div
                className={`text-sm font-bold ${
                  Number(contrastRatio) >= 4.5 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {Number(contrastRatio) >= 4.5 ? '✓ PASS' : '✗ FAIL'}
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">WCAG AAA Large</span>
              <div
                className={`text-sm font-bold ${
                  Number(contrastRatio) >= 7.0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {Number(contrastRatio) >= 7.0 ? '✓ PASS' : '⚠ PASS AA ONLY'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Glassmorphism Generator */
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
              <h4 className="font-bold text-lg">Frosted Glass Container</h4>
              <p className="text-xs text-white/80">
                Real-time glassmorphism component preview against vibrant background gradient.
              </p>
              <button
                onClick={() => handleCopy(glassCss)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Glass CSS' : 'Copy Glass CSS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
