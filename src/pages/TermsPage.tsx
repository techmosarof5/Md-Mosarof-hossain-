import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span>ব্যবহারের নিয়মনীতি</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          ব্যবহারের শর্তাবলী (Terms of Use)
        </h1>
        <p className="text-xs text-slate-400">কার্যকরী তারিখ: মার্চ ২০২৬</p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>আর্থিক ও আইনি সতর্কতা:</strong> মোঃ মোশারফ হোসেন (Md Mosarof Hossain)-এর প্রকাশিত সকল ভিডিও ও কন্টেন্ট শুধুমাত্র তথ্য ও সাধারণ সচেতনতামূলক শিক্ষার জন্য প্রণীত। এটি কোনো প্রাতিষ্ঠানিক আর্থিক বা বিনিয়োগ পরামর্শ নয়। কোনো ব্যাংক লোন, ক্রেডিট কার্ড বা আর্থিক সিদ্ধান্ত নেওয়ার পূর্বে সংশ্লিষ্ট ব্যাংক বা আর্থিক প্রতিষ্ঠানের অফিশিয়াল পরামর্শ গ্রহণ করুন।
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">১. শর্তাবলী অনুমোদন</h2>
          <p>
            এই ওয়েবসাইটে প্রবেশ বা ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী এবং প্রযোজ্য সকল জাতীয় ও আন্তর্জাতিক সাইবার আইন মেনে চলার অঙ্গীকার ব্যক্ত করছেন।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">২. বৌদ্ধিক সম্পত্তি ও ভিডিও স্ট্রিমিং</h2>
          <p>
            ওয়েবসাইটে প্রদর্শিত সকল ভিডিও ইউটিউব অফিসিয়াল এম্বেড প্লেয়ারের মাধ্যমে সরাসরি ইউটিউব চ্যানেল থেকে স্ট্রিম করা হয়। ভিডিওর মূল স্বত্বাধিকারী মোঃ মোশারফ হোসেন। অনুমতি ছাড়া ভিডিও ডাউনলোড, পুনঃআপলোড বা বাণিজ্যিকভাবে বিক্রি করা সম্পূর্ণ নিষিদ্ধ।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">৩. ব্যবহারকারী একাউন্ট ও নিরাপত্তা</h2>
          <p>
            ব্যবহারকারীরা তাদের একাউন্টের পাসওয়ার্ডের গোপনীয়তা বজায় রাখতে দায়বদ্ধ। অননুমোদিত অ্যাক্সেস বা নিরাপত্তা লঙ্ঘনের ক্ষেত্রে অবিলম্বে অ্যাডমিনিস্ট্রেটরকে অবহিত করতে হবে।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">৪. পরিবর্তনের অধিকার</h2>
          <p>
            কর্তৃপক্ষ যেকোনো সময় পূর্বঘোষণা ছাড়াই এই শর্তাবলী বা ওয়েবসাইটের যেকোনো ফিচার পরিবর্তন, সংযোজন বা পরিমার্জন করার অধিকার সংরক্ষণ করে।
          </p>
        </section>
      </div>
    </div>
  );
};
