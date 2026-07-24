import React, { useState } from 'react';
import { Wrench, Heart, Mail, Check, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../data/categoriesData';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          <div className="lg:col-span-5 space-y-4">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                OmniTools
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A comprehensive collection of 200+ free online developer tools, image utilities, unit converters, PDF tools, and calculators. All tools process data 100% locally in your web browser for total privacy.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Private Client-Side Processing • Zero Uploads</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-800/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-white font-bold text-base mb-1">
                Subscribe for New Tool Updates
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Get notified when new free web tools, converters, and developer utilities are added.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Subscribe Free</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Categories Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <div key={cat.id} className="space-y-2">
              <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                {cat.name}
              </h5>
              <ul className="space-y-1.5 font-medium text-slate-400">
                <li>
                  <a href={`/category/${cat.slug}`} className="hover:text-indigo-400 transition-colors">
                    Browse {cat.name}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Legal Links & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="/legal/about" className="hover:text-white transition-colors">About Us</a>
            <a href="/legal/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/legal/terms" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/legal/dmca" className="hover:text-white transition-colors">DMCA</a>
            <a href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            <span>© {new Date().getFullYear()} OmniTools. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
