import React from 'react';
import { useSite } from '../context/SiteContext';
import { ShieldCheck, Award, Tv, Youtube, CheckCircle, Mail, Phone, BookOpen, Terminal } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSite();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Intro */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl p-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={settings.profilePhotoUrl || '/src/assets/images/mosarof_portrait_1793006296735.jpg'}
                alt={settings.siteName || 'Md Mosarof Hossain'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/src/assets/images/mosarof_portrait_1793006296735.jpg';
                }}
              />
            </div>
            <div className="p-3 text-center">
              <h2 className="text-lg font-bold text-white">{settings.siteName || 'Md Mosarof Hossain'}</h2>
              <p className="text-xs text-rose-400 font-medium">প্রযুক্তি ও ব্যাংকিং কনটেন্ট ক্রিয়েটর</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <Award className="w-4 h-4 text-rose-500" />
            <span>পরিচিতি ও লক্ষ্য</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            সহজ ভাষায় সাধারণ মানুষের জন্য ডিজিটাল ফাইন্যান্স ও প্রযুক্তি শিক্ষা
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {settings.bio ||
              'আমি মোঃ মোশারফ হোসেন (Md Mosarof Hossain)—প্রযুক্তি ও ব্যাংকিং কনটেন্ট ক্রিয়েটর। বাংলাদেশের আধুনিক ব্যাংকিং ব্যবস্থা, ডিজিটাল ওয়ালেট (বিকাশ, নগদ, রকেট), আন্তর্জাতিক রেমিট্যান্স, ফ্রিল্যান্সিং পেমেন্ট গেটওয়ে এবং সাইবার নিরাপত্তা সচেতনতা নিয়ে সহজ বাংলায় প্র্যাকটিক্যাল ভিডিও তৈরি করি।'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('library')}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm cursor-pointer"
            >
              ভিডিও লাইব্রেরি দেখুন
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm cursor-pointer"
            >
              সরাসরি যোগাযোগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Expertise Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">যেসব বিষয়ে দিকনির্দেশনা প্রদান করি</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            বাস্তব অভিজ্ঞতা ও নির্ভরযোগ্য তথ্যের সমন্বয়ে তৈরি ভিডিও গাইডলাইন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">ডিজিটাল ব্যাংকিং ও রেগুলেশন</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলাদেশ ব্যাংকের নীতিমালা, ব্যাংক একাউন্ট নির্বাচন, ডিপিএস, এফডিআর ও আধুনিক ডিজিটাল ব্যাংক অনুমোদন সংক্রান্ত খুঁটিনাটি।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">এমএফএস ও রেমিট্যান্স প্রণোদনা</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              বিকাশ, নগদ, রকেটের গোপন চার্জ এড়িয়ে লেনদেন এবং প্রবাসীদের জন্য বৈধ উপায়ে রেমিট্যান্স পাঠিয়ে সরকারি নগদ বোনাস নিশ্চিত করা।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-500 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">সাইবার নিরাপত্তা ও ওটিপি সতর্কতা</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              অনলাইন প্রতারণা, ফিশিং এসএমএস, ভুয়া ব্যাংক কল ও ফেসবুক হ্যাকিং থেকে আপনার একাউন্ট ও ব্যক্তিগত তথ্য রক্ষা করার টেকনিক।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
