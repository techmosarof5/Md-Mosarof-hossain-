import React from 'react';
import { useSite } from '../context/SiteContext';
import { Youtube, Facebook, Send, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSite();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Creator Bio & Wordmark */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {settings.siteName || 'Md Mosarof Hossain'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {settings.siteTagline || 'প্রযুক্তি, ব্যাংকিং ও আধুনিক ডিজিটাল ফিনটেক গাইডলাইন।'}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              {settings.bio || 'বাংলাদেশের তরুণ ও সাধারণ নাগরিকদের আর্থিক সচেতনতা ও প্রযুক্তিগতভাবে দক্ষ করে গড়ে তোলাই আমাদের প্রধান অঙ্গীকার।'}
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-4">
              দ্রুত লিঙ্কসমূহ (Quick Links)
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  মূল পাতা (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  ভিডিও লাইব্রেরি (All Videos)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  পরিচিতি ও উদ্দেশ্য (About Creator)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  ব্যবহারের শর্তাবলী (Terms of Use)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Topics / Categories */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-4">
              প্রধান বিষয়বস্তু (Topics)
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  ডিজিটাল ব্যাংকিং ও লোন গাইড
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  বিকাশ, নগদ ও এমএফএস রেমিট্যান্স
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  ক্রেডিট কার্ড ও সিআইবি সচেতনতা
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  ফ্রিল্যান্সিং ডলার উইথড্রাল ও ট্যাক্স
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                >
                  সাইবার নিরাপত্তা ও ওটিপি হ্যাকিং প্রতিরোধ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Channels (Live editable from Admin) */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-4">
              যোগাযোগ ও সামাজিক মাধ্যম
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              {settings.contactEmail && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:text-white transition-colors truncate"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              )}

              {settings.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a
                    href={`tel:${settings.phone}`}
                    className="hover:text-white transition-colors font-mono tabular-nums"
                  >
                    {settings.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-3">আমাদের সাথে যুক্ত থাকুন:</p>
              <div className="flex items-center gap-3">
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-colors"
                    aria-label="YouTube Channel"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-colors"
                    aria-label="Facebook Page"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.telegramUrl && (
                  <a
                    href={settings.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition-colors"
                    aria-label="Telegram Channel"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Indicator */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.siteName || 'Md Mosarof Hossain'}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
