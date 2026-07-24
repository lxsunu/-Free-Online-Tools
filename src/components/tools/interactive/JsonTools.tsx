import React, { useState } from 'react';
import { Brackets, Copy, Check, Download, AlertCircle, FileCode, Code, CheckCircle2 } from 'lucide-react';

interface JsonToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const JsonTools: React.FC<JsonToolsProps> = ({ toolSlug, onSuccess }) => {
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "name": "OmniTools",\n  "type": "Web Platform",\n  "version": "2.0",\n  "toolsCount": 200,\n  "features": ["JSON Formatter", "Validator", "Minifier"],\n  "active": true\n}'
  );
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFormat = () => {
    try {
      setErrorMessage(null);
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, indent);
      setJsonOutput(formatted);
      if (onSuccess) onSuccess('Formatted JSON successfully');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid JSON syntax');
      setJsonOutput('');
    }
  };

  const handleMinify = () => {
    try {
      setErrorMessage(null);
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonOutput(minified);
      if (onSuccess) onSuccess('Minified JSON successfully');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid JSON syntax');
      setJsonOutput('');
    }
  };

  const handleJsonToCsv = () => {
    try {
      setErrorMessage(null);
      const parsed = JSON.parse(jsonInput);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      if (array.length === 0) return;

      const keys = Object.keys(array[0]);
      const csvRows = [keys.join(',')];

      for (const row of array) {
        const values = keys.map((key) => {
          const val = row[key];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        });
        csvRows.push(values.join(','));
      }

      setJsonOutput(csvRows.join('\n'));
      if (onSuccess) onSuccess('Converted JSON to CSV');
    } catch (err: any) {
      setErrorMessage('Input must be an array of JSON objects for CSV conversion.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput || jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput || jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Brackets className="w-3.5 h-3.5" />
            <span>Format / Beautify</span>
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-lg transition-colors"
          >
            Minify JSON
          </button>
          <button
            onClick={handleJsonToCsv}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-lg transition-colors"
          >
            Convert to CSV
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
          >
            <option value={2}>2 Spaces Indent</option>
            <option value={4}>4 Spaces Indent</option>
          </select>
          <button
            onClick={handleCopy}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
            title="Copy Output"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Code Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">JSON Input Payload</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={14}
            className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Formatted / Minified Output</label>
          <textarea
            value={jsonOutput || (errorMessage ? '' : jsonInput)}
            readOnly
            rows={14}
            placeholder="Formatted output will appear here..."
            className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
