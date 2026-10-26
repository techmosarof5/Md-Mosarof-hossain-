import React from 'react';
import { useSite } from '../context/SiteContext';
import { VideoCard } from '../components/VideoCard';
import { Play, Youtube, ArrowRight, ShieldCheck, CheckCircle2, Tv, Sparkles, BookOpen } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings, videos, featuredVideos, setActiveVideo } = useSite();

  const heroVideo = featuredVideos[0] || videos[0];
  const recentVideos = videos.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Split Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column (Typographic Hierarchy) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>অফিশিয়াল ভিডিও ও নলেজ পোর্টাল</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">Md Mosarof Hossain</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
                ব্যাংকিং, ফিনটেক ও প্রযুক্তি নিয়ে সঠিক ও নির্ভরযোগ্য তথ্য
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {settings.bio ||
                  'সহজ বাংলায় বাংলাদেশের ডিজিটাল ব্যাংকিং, বিকাশ/নগদ রেমিট্যান্স, ক্রেডিট কার্ডের ব্যবহারবিধি, ফ্রিল্যান্সিং পেমেন্ট এবং সাইবার নিরাপত্তা সচেতনতা।'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('library')}
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors shadow-lg shadow-rose-900/30 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>সব ভিডিও দেখুন</span>
                </button>

                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Youtube className="w-5 h-5 text-rose-500" />
                    <span>ইউটিউবে সাবস্ক্রাইব</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: High-Impact Creator Portrait Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-600/30 via-amber-500/20 to-indigo-600/30 blur-xl opacity-60" />

                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 overflow-hidden">
                  <div className="aspect-[4/4.2] rounded-xl overflow-hidden bg-slate-950 relative">
                    <img
                      src={settings.profilePhotoUrl || '/src/assets/images/mosarof_portrait_1793006296735.jpg'}
                      alt={settings.siteName || 'Md Mosarof Hossain'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/src/assets/images/mosarof_portrait_1793006296735.jpg';
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                        <span>ভেরিফায়েড ক্রিয়েটর</span>
                      </div>
                      <h2 className="text-xl font-bold text-white mt-1">
                        {settings.siteName || 'Md Mosarof Hossain'}
                      </h2>
                      <p className="text-xs text-slate-300">
                        ব্যাংকিং ও প্রযুক্তি বিশেষজ্ঞ
                      </p>
                    </div>
                  </div>

                  {/* Micro stats under photo */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <p className="text-slate-500">চ্যানেল আইডি</p>
                      <p className="font-mono text-slate-300 text-[11px] truncate max-w-[140px]">
                        {settings.youtubeChannelId || '@MdMosarofHossain'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500">কন্টেন্ট ভাষা</p>
                      <p className="font-medium text-slate-300">বাংলা (Bengali)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Key Metrics Row (Adhering to layout rules: full-width row below hero split) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {videos.length}+
              </p>
              <p className="text-xs sm:text-sm text-slate-400">তথ্যবহুল ভিডিও</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
                ১.৫ লক্ষ+
              </p>
              <p className="text-xs sm:text-sm text-slate-400">মোট ভিডিও ভিউজ</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                ১০০%
              </p>
              <p className="text-xs sm:text-sm text-slate-400">সঠিক ও ভেরিফাইড গাইড</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
                ২৪/৭
              </p>
              <p className="text-xs sm:text-sm text-slate-400">ফ্রি ডিজিটাল শিক্ষা</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Video Spotlight */}
      {heroVideo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase font-semibold text-rose-400 tracking-wider">
                বিশেষ নির্বাচিত ভিডিও
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                আজকের সবচেয়ে গুরুত্বপূর্ণ আলোচনা
              </h2>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <span>সকল ভিডিও</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div
              onClick={() => setActiveVideo(heroVideo)}
              className="lg:col-span-7 relative aspect-video cursor-pointer overflow-hidden group bg-slate-950"
            >
              <img
                src={heroVideo.thumbnailUrl}
                alt={heroVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
              {heroVideo.duration && (
                <span className="absolute bottom-3 right-3 px-2 py-1 text-xs font-mono tabular-nums font-semibold bg-black/80 text-white rounded">
                  {heroVideo.duration}
                </span>
              )}
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
                  <span>{heroVideo.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400 font-normal">
                    {new Date(heroVideo.publishedAt).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3
                  onClick={() => setActiveVideo(heroVideo)}
                  className="text-xl sm:text-2xl font-bold text-white hover:text-rose-400 transition-colors cursor-pointer leading-snug"
                >
                  {heroVideo.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                  {heroVideo.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
                <button
                  onClick={() => setActiveVideo(heroVideo)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  ভিডিওটি চালু করুন
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${heroVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>ইউটিউব লিংক</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest Releases Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              সাম্প্রতিক প্রকাশিত ভিডিও
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              নিয়মিত আপডেটকৃত ব্যাংকিং ও প্রযুক্তি বিষয়ক টিউটোরিয়াল
            </p>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>সম্পূর্ণ লাইব্রেরি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => onNavigate('library')}
            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 hover:border-slate-700"
          >
            সকল ভিডিও দেখুন
          </button>
        </div>
      </section>

      {/* 5. Creator Story & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-semibold text-rose-400 tracking-wider">
                আমাদের উদ্দেশ্য
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                বাংলাদেশের প্রতিটি নাগরিকের কাছে ডিজিটাল জ্ঞান পৌঁছে দেওয়া
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                অনলাইন জালিয়াতি, ওটিপি চুরি, ক্রেডিট কার্ডের অতিরিক্ত সুদ এবং জটিল ব্যাংকিং নিয়মের কারণে অনেকেই ক্ষতিগ্রস্ত হন। মোঃ মোশারফ হোসেন (Md Mosarof Hossain) এই প্ল্যাটফর্মের মাধ্যমে স্বচ্ছ, প্রমাণনির্ভর ও ব্যবহারিক ভিডিও টিউটোরিয়াল তৈরি করেন—যাতে আপনি আপনার কষ্টার্জিত অর্থ নিরাপদে রাখতে ও স্মার্টভাবে পরিচালনা করতে পারেন।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>শতভাগ প্র্যাকটিক্যাল ডেমো ও স্ক্রিন রেকর্ড</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>বাংলাদেশ ব্যাংক ও আইন অনুযায়ী তথ্য</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>বিনামূল্যে যেকোনো সময় স্ট্রিমিং সুবিধা</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সরাসরি কমেন্টে প্রশ্নের উত্তর ও সহায়তা</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-3 w-full">
                <Tv className="w-10 h-10 text-rose-500 mx-auto" />
                <h4 className="text-base font-bold text-white">ইউটিউব চ্যানেলে যুক্ত হন</h4>
                <p className="text-xs text-slate-400">
                  নতুন ভিডিও আপলোড হওয়ার সাথে সাথে নোটিফিকেশন পেতে চ্যানেলটি সাবস্ক্রাইব করুন।
                </p>
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>ইউটিউব চ্যানেলে যান</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
