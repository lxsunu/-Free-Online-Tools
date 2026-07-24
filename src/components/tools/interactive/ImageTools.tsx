import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, Sliders, CheckCircle2, Shield, Eye, Palette } from 'lucide-react';

interface ImageToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ toolSlug, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setOriginalSize(file.size);

      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        setCompressedSrc(null);

        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setTargetWidth(img.width);
          setTargetHeight(img.height);
          if (toolSlug === 'color-extractor') {
            extractColorsFromImage(img);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = targetWidth || img.width;
      canvas.height = targetHeight || img.height;

      // Handle PNG to JPG fill color
      if (toolSlug === 'png-to-jpg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Watermark processing
      if (toolSlug === 'image-watermark') {
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
      }

      let mimeType = 'image/jpeg';
      if (toolSlug === 'jpg-to-png' || toolSlug === 'webp-to-png') {
        mimeType = 'image/png';
      } else if (toolSlug === 'image-compressor') {
        mimeType = selectedFile?.type === 'image/png' ? 'image/png' : 'image/jpeg';
      }

      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      setCompressedSrc(dataUrl);

      // Estimate compressed size
      const head = `data:${mimeType};base64,`;
      const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setCompressedSize(sizeInBytes);

      setIsProcessing(false);
      if (onSuccess) {
        onSuccess(`Processed image (${(sizeInBytes / 1024).toFixed(1)} KB)`);
      }
    };
    img.src = imageSrc;
  };

  const extractColorsFromImage = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;
    const colorCounts: Record<string, number> = {};

    for (let i = 0; i < data.length; i += 16) {
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
    setExtractedPalette(sorted.slice(0, 6));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (keepAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-indigo-50/50 dark:bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Upload Your Image
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Supports PNG, JPG, WebP, GIF, SVG up to 50MB
          </p>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all">
            Browse File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {selectedFile?.name || 'Uploaded Image'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Original: {originalDimensions.width}x{originalDimensions.height} px ({formatSize(originalSize)})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setImageSrc(null);
                  setCompressedSrc(null);
                  setSelectedFile(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                Change Image
              </button>
            </div>

            {/* Quality Slider for Compression */}
            {(toolSlug === 'image-compressor' || toolSlug === 'png-to-jpg') && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Compression Quality: {quality}%</span>
                  <span className="text-slate-400">Higher % = Better Quality / Bigger File</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            {/* Dimension Sliders for Image Resizer */}
            {toolSlug === 'image-resizer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                    disabled={keepAspectRatio}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Watermark text */}
            {toolSlug === 'image-watermark' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                />
              </div>
            )}

            {/* Process Button */}
            <div className="pt-2">
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sliders className="w-4 h-4" />
                )}
                <span>Process & Preview</span>
              </button>
            </div>
          </div>

          {/* Color Extractor Palette Output */}
          {toolSlug === 'color-extractor' && extractedPalette.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" /> Extracted Color Palette
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {extractedPalette.map((hex) => (
                  <div
                    key={hex}
                    onClick={() => navigator.clipboard.writeText(hex)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-mono font-bold">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
                Original Image ({formatSize(originalSize)})
              </span>
              <img
                src={imageSrc}
                alt="Original"
                className="max-h-64 mx-auto rounded-lg object-contain shadow"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
                  Processed Result {compressedSize > 0 && `(${formatSize(compressedSize)})`}
                </span>
                {compressedSrc ? (
                  <img
                    src={compressedSrc}
                    alt="Processed"
                    className="max-h-64 mx-auto rounded-lg object-contain shadow"
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed rounded-lg">
                    Click "Process & Preview" to generate output
                  </div>
                )}
              </div>

              {compressedSrc && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href={compressedSrc}
                    download={`processed-${selectedFile?.name || 'image.jpg'}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Image</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
