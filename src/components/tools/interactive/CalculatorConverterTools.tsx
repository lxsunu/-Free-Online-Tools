import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight, Calculator, Activity, Clock, Monitor, Edit3, Download, RefreshCw } from 'lucide-react';

interface CalculatorConverterToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const CalculatorConverterTools: React.FC<CalculatorConverterToolsProps> = ({ toolSlug, onSuccess }) => {
  // Unit Converter state
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [valFrom, setValFrom] = useState<number>(10);
  const [unitFrom, setUnitFrom] = useState<string>('m');
  const [unitTo, setUnitTo] = useState<string>('ft');

  // BMI state
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Drawing Pad state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#4f46e5');
  const [brushSize, setBrushSize] = useState(4);

  // Conversion computation
  const getConvertedUnit = () => {
    if (unitFrom === 'm' && unitTo === 'ft') return (valFrom * 3.28084).toFixed(2);
    if (unitFrom === 'ft' && unitTo === 'm') return (valFrom / 3.28084).toFixed(2);
    if (unitFrom === 'kg' && unitTo === 'lbs') return (valFrom * 2.20462).toFixed(2);
    if (unitFrom === 'lbs' && unitTo === 'kg') return (valFrom / 2.20462).toFixed(2);
    return (valFrom * 1.5).toFixed(2);
  };

  // BMI computation
  const bmiScore = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);

  // Drawing pad handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-6">
      {/* Unit Converter View */}
      {toolSlug === 'unit-converter' && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Value</label>
              <input
                type="number"
                value={valFrom}
                onChange={(e) => setValFrom(Number(e.target.value))}
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">From Unit</label>
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-semibold"
              >
                <option value="m">Meters (m)</option>
                <option value="ft">Feet (ft)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">To Unit</label>
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-semibold"
              >
                <option value="ft">Feet (ft)</option>
                <option value="m">Meters (m)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-indigo-600 text-white rounded-2xl text-center shadow-lg">
            <span className="text-xs uppercase font-bold tracking-wider opacity-80 block mb-1">Converted Result</span>
            <div className="text-3xl sm:text-4xl font-extrabold">{getConvertedUnit()} {unitTo}</div>
          </div>
        </div>
      )}

      {/* BMI Calculator View */}
      {toolSlug === 'bmi-calculator' && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Height ({heightCm} cm)</label>
              <input type="range" min="120" max="220" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Weight ({weightKg} kg)</label>
              <input type="range" min="30" max="150" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">Your BMI Score</span>
            <div className="text-4xl font-extrabold text-emerald-400">{bmiScore}</div>
            <span className="text-xs font-medium text-slate-300 mt-2 block">
              Status: {Number(bmiScore) < 18.5 ? 'Underweight' : Number(bmiScore) < 25 ? 'Normal Weight' : 'Overweight'}
            </span>
          </div>
        </div>
      )}

      {/* Drawing Pad / Whiteboard */}
      {toolSlug === 'drawing-pad-whiteboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <input type="range" min="2" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 accent-indigo-600" />
            </div>
            <button onClick={clearCanvas} className="px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold">
              Clear Canvas
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            onMouseDown={startDrawing}
            onMouseUp={() => setIsDrawing(false)}
            onMouseMove={draw}
            className="w-full h-72 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-inner cursor-crosshair"
          />
        </div>
      )}
    </div>
  );
};
