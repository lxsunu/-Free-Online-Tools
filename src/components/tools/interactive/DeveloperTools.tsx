import React, { useState, useEffect } from 'react';
import { Key, Fingerprint, Hash, Link2, Copy, Check, ShieldCheck, AlertCircle, Code2, Database } from 'lucide-react';

interface DeveloperToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

// Pure JS MD5 Implementation for 100% accurate client-side hashing
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binl2hex(binarray: number[]) {
    const hexTab = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str +=
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0x0f) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0x0f);
    }
    return str;
  }

  function rstr2binl(inputStr: string) {
    const output: number[] = Array(inputStr.length >> 2);
    for (let i = 0; i < output.length; i++) output[i] = 0;
    for (let i = 0; i < inputStr.length * 8; i += 8) {
      output[i >> 5] |= (inputStr.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    return output;
  }

  const utf8 = unescape(encodeURIComponent(input));
  const x = rstr2binl(utf8);
  const len = utf8.length * 8;
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a; const oldb = b; const oldc = c; const oldd = d;

    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -144468057);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894980106);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return binl2hex([a, b, c, d]);
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ toolSlug, onSuccess }) => {
  const [inputText, setInputText] = useState<string>('');

  // Base64 / URL Encoder state
  const [encMode, setEncMode] = useState<'encode' | 'decode'>('encode');
  const [encResult, setEncResult] = useState('');
  const [encError, setEncError] = useState<string | null>(null);

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

  // SQL Formatter state
  const [formattedSql, setFormattedSql] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Base64 / URL Effect
  useEffect(() => {
    if (toolSlug.includes('base64')) {
      if (!inputText) {
        setEncResult('');
        setEncError(null);
        return;
      }
      try {
        if (encMode === 'encode') {
          setEncResult(btoa(unescape(encodeURIComponent(inputText))));
        } else {
          setEncResult(decodeURIComponent(escape(atob(inputText))));
        }
        setEncError(null);
      } catch (e) {
        setEncError('Invalid Base64 string input');
        setEncResult('');
      }
    } else if (toolSlug.includes('url')) {
      if (!inputText) {
        setEncResult('');
        return;
      }
      try {
        if (encMode === 'encode') {
          setEncResult(encodeURIComponent(inputText));
        } else {
          setEncResult(decodeURIComponent(inputText));
        }
        setEncError(null);
      } catch (e) {
        setEncError('Invalid URL encoding format');
      }
    }
  }, [inputText, encMode, toolSlug]);

  // JWT decoder effect
  useEffect(() => {
    if (toolSlug === 'jwt-decoder') {
      if (!inputText.trim()) {
        setJwtHeader('');
        setJwtPayload('');
        setJwtExpired(null);
        return;
      }
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

  // Hash calculation effect
  useEffect(() => {
    if (toolSlug === 'hash-generator') {
      if (!inputText) {
        setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
        return;
      }
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
          md5: md5(inputText),
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
    if (onSuccess) onSuccess(`Generated ${uuidCount} UUIDs`);
  };

  useEffect(() => {
    if (toolSlug === 'uuid-generator') {
      generateUuids();
    }
  }, [uuidCount, toolSlug]);

  // SQL Formatter
  useEffect(() => {
    if (toolSlug.includes('sql') && inputText) {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'UPDATE', 'DELETE', 'SET', 'VALUES'];
      let formatted = inputText;
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${kw}`);
      });
      setFormattedSql(formatted.trim());
    } else {
      setFormattedSql('');
    }
  }, [inputText, toolSlug]);

  const copyToClipboard = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Base64 / URL Encoder Decoder */}
      {(toolSlug.includes('base64') || toolSlug.includes('url')) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit text-xs font-semibold">
            <button
              onClick={() => setEncMode('encode')}
              className={`px-4 py-2 rounded-lg transition-colors ${encMode === 'encode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}
            >
              Encode
            </button>
            <button
              onClick={() => setEncMode('decode')}
              className={`px-4 py-2 rounded-lg transition-colors ${encMode === 'decode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}
            >
              Decode
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Input String ({encMode === 'encode' ? 'Plain Text' : 'Encoded String'})
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder={encMode === 'encode' ? 'Enter plain text to encode...' : 'Paste encoded string to decode...'}
              className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {encError && <div className="p-3 bg-rose-50 text-rose-600 font-semibold text-xs rounded-xl">{encError}</div>}

          {encResult && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">Output Result</span>
                <button
                  onClick={() => copyToClipboard(encResult, 'enc')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded-lg"
                >
                  {copiedKey === 'enc' ? 'Copied' : 'Copy Result'}
                </button>
              </div>
              <textarea
                value={encResult}
                readOnly
                rows={4}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800"
              />
            </div>
          )}
        </div>
      )}

      {/* JWT Decoder View */}
      {toolSlug === 'jwt-decoder' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Encoded JWT Token String</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder="Paste JWT token string (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
              className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-400 rounded-xl border border-slate-800 focus:outline-none"
            />
          </div>

          {jwtHeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">
                  HEADER: ALGORITHM & TOKEN TYPE
                </span>
                <pre className="font-mono text-xs text-slate-200 overflow-x-auto">{jwtHeader}</pre>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">
                  PAYLOAD: DATA CLAIMS
                </span>
                <pre className="font-mono text-xs text-slate-200 overflow-x-auto">{jwtPayload}</pre>
                {jwtExpired !== null && (
                  <div className={`mt-3 text-xs font-bold ${jwtExpired ? 'text-rose-400' : 'text-emerald-400'}`}>
                    Token Status: {jwtExpired ? 'Expired' : 'Valid Active Expiration'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cryptographic Hash Generator View */}
      {toolSlug === 'hash-generator' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Input Text String</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste input string to hash..."
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
            />
          </div>

          {inputText && (
            <div className="space-y-3">
              {[
                { name: 'MD5', val: hashes.md5 },
                { name: 'SHA-1', val: hashes.sha1 },
                { name: 'SHA-256', val: hashes.sha256 },
                { name: 'SHA-512', val: hashes.sha512 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
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
          )}
        </div>
      )}

      {/* UUID Generator View */}
      {toolSlug === 'uuid-generator' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quantity:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={uuidCount}
                onChange={(e) => setUuidCount(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs font-bold text-center"
              />
            </div>
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

      {/* SQL Formatter View */}
      {toolSlug.includes('sql') && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Raw SQL Query</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="SELECT u.id, u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC;"
              className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>

          {formattedSql && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">Formatted SQL Query</span>
                <button
                  onClick={() => copyToClipboard(formattedSql, 'sql')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded-lg"
                >
                  {copiedKey === 'sql' ? 'Copied' : 'Copy Formatted SQL'}
                </button>
              </div>
              <textarea
                value={formattedSql}
                readOnly
                rows={8}
                className="w-full p-4 font-mono text-xs bg-slate-900 text-indigo-300 rounded-xl border border-slate-800 leading-relaxed"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
