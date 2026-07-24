import React, { useState, useRef } from 'react';
import { ArrowLeftRight, Calculator, Activity, Clock, Monitor, Edit3, Download, RefreshCw, DollarSign, Calendar } from 'lucide-react';

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

  // Loan Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // Age Calculator state
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');

  // Drawing Pad state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#4f46e5');
  const [brushSize, setBrushSize] = useState(4);

  // Conversion computation
  const getConvertedUnit = () => {
    if (unitFrom === 'm' && unitTo === 'ft') return (valFrom * 3.28084).toFixed(2);
    if (unitFrom === 'ft' && unitTo === 'm') return (valFrom / 3.28084).toFixed(2);
    if (unitFrom === 'km' && unitTo === 'miles') return (valFrom * 0.621371).toFixed(2);
    if (unitFrom === 'miles' && unitTo === 'km') return (valFrom / 0.621371).toFixed(2);
    if (unitFrom === 'kg' && unitTo === 'lbs') return (valFrom * 2.20462).toFixed(2);
    if (unitFrom === 'lbs' && unitTo === 'kg') return (valFrom / 2.20462).toFixed(2);
    if (unitFrom === 'c' && unitTo === 'f') return ((valFrom * 9) / 5 + 32).toFixed(1);
    if (unitFrom === 'f' && unitTo === 'c') return (((valFrom - 32) * 5) / 9).toFixed(1);
    return (valFrom * 1.0).toFixed(2);
  };

  // BMI computation
  const bmiScore = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);

  // Loan Computation
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyPayment =
    monthlyInterestRate > 0
      ? (
          (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
          (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
        ).toFixed(2)
      : (loanAmount / totalPayments).toFixed(2);

  const totalPaid = (Number(monthlyPayment) * totalPayments).toFixed(2);
  const totalInterest = (Number(totalPaid) - loanAmount).toFixed(2);

  // Age Computation
  const calculateAgeDetails = () => {
    if (!birthDate) return { years: 0, months: 0, days: 0, totalDays: 0 };
    const bday = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - bday.getFullYear();
    let months = today.getMonth() - bday.getMonth();
    let days = today.getDate() - bday.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - bday.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  const ageData = calculateAgeDetails();

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

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whiteboard-drawing.png';
    a.click();
    if (onSuccess) onSuccess('Downloaded whiteboard drawing PNG');
  };

  return (
    <div className="space-y-6">
      {/* Loan / Mortgage Calculator */}
      {toolSlug.includes('loan') || toolSlug.includes('mortgage') || toolSlug.includes('finance') ? (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loan Principal Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loan Duration (Years)
                </label>
                <input
                  type="number"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-indigo-600 text-white rounded-2xl text-center shadow-lg">
              <span className="text-xs uppercase font-bold tracking-wider opacity-80 block mb-1">
                Estimated Monthly Payment
              </span>
              <div className="text-3xl font-extrabold">${monthlyPayment}</div>
            </div>

            <div className="p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Total Interest Payable
              </span>
              <div className="text-2xl font-extrabold text-amber-400">${totalInterest}</div>
            </div>

            <div className="p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Total Repayment Amount
              </span>
              <div className="text-2xl font-extrabold text-emerald-400">${totalPaid}</div>
            </div>
          </div>
        </div>
      ) : toolSlug.includes('age') ? (
        /* Age Calculator */
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Years</span>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{ageData.years}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Months</span>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{ageData.months}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Days</span>
              <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{ageData.days}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Days</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{ageData.totalDays}</div>
            </div>
          </div>
        </div>
      ) : toolSlug === 'bmi-calculator' ? (
        /* BMI Calculator View */
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Height ({heightCm} cm)</label>
              <input
                type="range"
                min="120"
                max="220"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Weight ({weightKg} kg)</label>
              <input
                type="range"
                min="30"
                max="150"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">Your BMI Score</span>
            <div className="text-4xl font-extrabold text-emerald-400">{bmiScore}</div>
            <span className="text-xs font-medium text-slate-300 mt-2 block">
              Status:{' '}
              {Number(bmiScore) < 18.5
                ? 'Underweight'
                : Number(bmiScore) < 25
                ? 'Normal Weight'
                : Number(bmiScore) < 30
                ? 'Overweight'
                : 'Obese'}
            </span>
          </div>
        </div>
      ) : toolSlug === 'drawing-pad-whiteboard' ? (
        /* Drawing Pad / Whiteboard */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Size: {brushSize}px</span>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg text-xs font-bold transition-colors"
              >
                Clear Canvas
              </button>
              <button
                onClick={downloadCanvas}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save Image
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            onMouseDown={startDrawing}
            onMouseUp={() => setIsDrawing(false)}
            onMouseMove={draw}
            className="w-full h-80 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-inner cursor-crosshair"
          />
        </div>
      ) : (
        /* Unit Converter Default */
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
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="c">Celsius (°C)</option>
                <option value="f">Fahrenheit (°F)</option>
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
                <option value="miles">Miles (mi)</option>
                <option value="km">Kilometers (km)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="f">Fahrenheit (°F)</option>
                <option value="c">Celsius (°C)</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-indigo-600 text-white rounded-2xl text-center shadow-lg">
            <span className="text-xs uppercase font-bold tracking-wider opacity-80 block mb-1">
              Converted Result
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold">
              {getConvertedUnit()} {unitTo}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
