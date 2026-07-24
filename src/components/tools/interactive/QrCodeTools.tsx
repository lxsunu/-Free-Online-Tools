import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Wifi, UserCheck, Mail, MessageSquare, Link, Code } from 'lucide-react';

interface QrCodeToolsProps {
  toolSlug: string;
  onSuccess?: (summary: string) => void;
}

export const QrCodeTools: React.FC<QrCodeToolsProps> = ({ toolSlug, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'wifi' | 'vcard' | 'sms' | 'email' | 'text'>(
    toolSlug === 'wifi-qr-code-generator' ? 'wifi' :
    toolSlug === 'vcard-qr-generator' ? 'vcard' :
    toolSlug === 'sms-qr-generator' ? 'sms' :
    toolSlug === 'email-qr-generator' ? 'email' : 'url'
  );

  // Form states
  const [url, setUrl] = useState('https://omnitools.app');
  const [wifiSsid, setWifiSsid] = useState('Home_WiFi_5G');
  const [wifiPassword, setWifiPassword] = useState('SecretPass123!');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  
  const [vFirstName, setVFirstName] = useState('Alex');
  const [vLastName, setVLastName] = useState('Rivera');
  const [vPhone, setVPhone] = useState('+1 (555) 019-2834');
  const [vEmail, setVEmail] = useState('alex@example.com');
  const [vCompany, setVCompany] = useState('OmniTools Tech');

  const [smsPhone, setSmsPhone] = useState('+15550192834');
  const [smsMessage, setSmsMessage] = useState('Hello! Checking out your service.');

  const [emailTo, setEmailTo] = useState('support@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry regarding services');

  const [plainText, setPlainText] = useState('Scan to view content');

  // Custom styling
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Compute QR Payload string
  const getQrPayload = () => {
    switch (activeTab) {
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nFN:${vFirstName} ${vLastName}\nTEL:${vPhone}\nEMAIL:${vEmail}\nORG:${vCompany}\nEND:VCARD`;
      case 'sms':
        return `SMSTO:${smsPhone}:${smsMessage}`;
      case 'email':
        return `MATMSG:TO:${emailTo};SUB:${emailSubject};;`;
      case 'text':
      default:
        return plainText;
    }
  };

  const payload = getQrPayload();

  useEffect(() => {
    const generateQr = async () => {
      try {
        const pngUrl = await QRCode.toDataURL(payload, {
          width: 320,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
        const svgStr = await QRCode.toString(payload, {
          type: 'svg',
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
        setQrDataUrl(pngUrl);
        setQrSvgString(svgStr);
      } catch (err) {
        console.error('Error generating QR:', err);
      }
    };
    generateQr();
  }, [payload, fgColor, bgColor]);

  const handleDownloadSvg = () => {
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(blobUrl);
    if (onSuccess) onSuccess('Downloaded SVG vector QR Code');
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onSuccess) onSuccess('Copied QR code payload');
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'url' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Link className="w-3.5 h-3.5" /> Website Link
        </button>
        <button
          onClick={() => setActiveTab('wifi')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'wifi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" /> WiFi Network
        </button>
        <button
          onClick={() => setActiveTab('vcard')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'vcard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> vCard Contact
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'sms' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> SMS Text
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'email' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Controls Form */}
        <div className="md:col-span-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {activeTab === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WiFi Password
                </label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'vcard' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input type="text" value={vFirstName} onChange={(e) => setVFirstName(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input type="text" value={vLastName} onChange={(e) => setVLastName(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input type="text" value={vPhone} onChange={(e) => setVPhone(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" value={vEmail} onChange={(e) => setVEmail(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm" />
              </div>
            </div>
          )}

          {/* Color pickers */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dots Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer"
                />
                <span className="text-xs font-mono">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Output Render Card */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center flex flex-col items-center justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-600" /> Vector QR Code Preview
            </h4>

            <div className="p-3 bg-white border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner inline-block mb-4">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 object-contain rounded"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={qrDataUrl}
                download="qr-code.png"
                className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> PNG
              </a>
              <button
                onClick={handleDownloadSvg}
                className="py-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium text-xs rounded-xl hover:bg-indigo-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Code className="w-4 h-4" /> SVG Vector
              </button>
            </div>

            <button
              onClick={handleCopyPayload}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Payload' : 'Copy Payload String'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
