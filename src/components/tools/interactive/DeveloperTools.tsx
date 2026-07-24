import React, { useState, useEffect } from 'react';
import { Key, Fingerprint, Hash, Link2, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface DeveloperToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ toolSlug, onSuccess }) => {
  const [inputText, setInputText] = useState<string>(
    toolSlug === 'jwt-decoder'
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggUml2ZXJhIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3Nzk5MDAwMDB9.signature'
      : 'Hello OmniTools World'
  );

  // JWT state
  const [jwtHeader, setJwtHeader] = useState<string>('');
  const [jwtPayload, setJwtPayload] = useState<string>('');
  const [jwtExpired, setJwtExpired] = useState<boolean | null>(null);

  // Cryptographic Hashes state
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string; sha512: string }>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });

  // UUID state
  const [uuids, setUuids] = useState<string[]>([]);
  const [uuidCount, setUuidCount] = useState<number>(5);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // JWT decoder effect
  useEffect(() => {
    if (toolSlug === 'jwt-decoder') {
      try {
        const parts = inputText.trim().split('.');
        if (parts.length >= 2) {
          const headerJson = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
          const payloadParsed = JSON.parse(atob(parts[1]));
          const payloadJson = JSON.stringify(payloadParsed, null, 2);

          setJwtHeader(headerJson);
          setJwtPayload(payloadJson);

          if (payloadParsed.exp) {
            setJwtExpired(Date.now() / 1000 > payloadParsed.exp);
          } else {
            setJwtExpired(null);
          }
        }
      } catch (e) {
        setJwtHeader('Invalid JWT Structure');
        setJwtPayload('');
      }
    }
  }, [inputText, toolSlug]);

  // Hash calculation effect using Web Crypto API
  useEffect(() => {
    if (toolSlug === 'hash-generator') {
      const computeHashes = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputText);

        const hashBuffer1 = await window.crypto.subtle.digest('SHA-1', data);
        const hashBuffer256 = await window.crypto.subtle.digest('SHA-256', data);
        const hashBuffer512 = await window.crypto.subtle.digest('SHA-512', data);

        const toHex = (buf: ArrayBuffer) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        setHashes({
          md5: 'Simulated-MD5-' + toHex(hashBuffer1).slice(0, 24),
          sha1: toHex(hashBuffer1),
          sha256: toHex(hashBuffer256),
          sha512: toHex(hashBuffer512),
        });
      };
      computeHashes();
    }
  }, [inputText, toolSlug]);

  // UUID generator effect
  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  };

  useEffect(() => {
    if (toolSlug === 'uuid-generator') {
      generateUuids();
    }
  }, [uuidCount, toolSlug]);

  const copyToClipboard = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* JWT Decoder View */}
      {toolSlug === 'jwt-decoder' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Encoded JWT Token</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder="Paste JWT token string here..."
              className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-400 rounded-xl border border-slate-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">HEADER: ALGORITHM & TOKEN TYPE</span>
              <pre className="font-mono text-xs text-slate-200 overflow-x-auto">{jwtHeader}</pre>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">PAYLOAD: DATA CLAIMS</span>
              <pre className="font-mono text-xs text-slate-200 overflow-x-auto">{jwtPayload}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Hash Generator View */}
      {toolSlug === 'hash-generator' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Input Text</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-3">
            {[
              { name: 'SHA-256', val: hashes.sha256 },
              { name: 'SHA-512', val: hashes.sha512 },
              { name: 'SHA-1', val: hashes.sha1 },
              { name: 'MD5', val: hashes.md5 },
            ].map((item) => (
              <div key={item.name} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">{item.name} Hash</span>
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate block">{item.val}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(item.val, item.name)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs font-medium shrink-0"
                >
                  {copiedKey === item.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UUID Generator View */}
      {toolSlug === 'uuid-generator' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quantity: {uuidCount} UUIDs</span>
            <button
              onClick={generateUuids}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow"
            >
              Generate New
            </button>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-emerald-400 space-y-2">
            {uuids.map((id, idx) => (
              <div key={idx} className="flex items-center justify-between hover:bg-slate-800/60 p-1.5 rounded">
                <span>{id}</span>
                <button
                  onClick={() => copyToClipboard(id, id)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded"
                >
                  {copiedKey === id ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
