import React from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>আইনি ও সুরক্ষামূলক নীতিমালা</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-xs text-slate-400">সর্বশেষ আপডেট: মার্চ ২০২৬</p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">১. ভূমিকা ও তথ্যের সুরক্ষা</h2>
          <p>
            মোঃ মোশারফ হোসেন (Md Mosarof Hossain) এর অফিশিয়াল ভিডিও স্ট্রিমিং ও নলেজ ওয়েবসাইটে আপনাকে স্বাগতম। আমরা আমাদের ভিজিটর এবং নিবন্ধিত ব্যবহারকারীদের তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিয়ে বিবেচনা করি। এই নীতিমালার মাধ্যমে জানানো হচ্ছে আমরা কোন ধরনের তথ্য সংগ্রহ করি এবং কীভাবে তা নিরাপদ রাখা হয়।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">২. সংগৃহীত তথ্যাবলী</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>
              <strong className="text-slate-200">ব্যবহারকারী একাউন্ট তথ্য:</strong> যখন আপনি ইমেইল ও পাসওয়ার্ড দিয়ে নিবন্ধন করেন, আমরা আপনার নাম ও ইমেইল ঠিকানা Firebase Authentication-এর সুরক্ষিত পরিবেশে সংরক্ষণ করি। আপনার পাসওয়ার্ড কখনোই প্লেইন টেক্সট হিসেবে সংরক্ষিত হয় না এবং আমাদের কাছে দৃশ্যমান নয়।
            </li>
            <li>
              <strong className="text-slate-200">সংরক্ষিত ভিডিও ও প্রেফারেন্স:</strong> আপনার ওয়াচলিস্ট বা বুকমার্ক করা ভিডিওর আইডি আপনার অ্যাকাউন্টে ক্লাউড ফায়ারস্টোরে সংরক্ষিত থাকে।
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">৩. ইউটিউব এপিআই সার্ভিসেস (YouTube API Services)</h2>
          <p>
            আমাদের ওয়েবসাইটটি ইউটিউব চ্যানেল থেকে সর্বজনীন ভিডিও মেটাডাটা (যেমন: শিরোনাম, থাম্বনেইল, ভিডিও আইডি, প্রকাশকাল) প্রদর্শনের জন্য অফিশিয়াল YouTube Data API v3 এবং অফিশিয়াল YouTube Embedded Player ব্যবহার করে।
          </p>
          <p>
            এই সেবা ব্যবহারের মাধ্যমে আপনি{' '}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:underline inline-flex items-center gap-1"
            >
              YouTube Terms of Service
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            এবং{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:underline inline-flex items-center gap-1"
            >
              Google Privacy Policy
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            এর সাথে একমত প্রকাশ করছেন। আমরা ব্যবহারকারীর কোনো ব্যক্তিগত ইউটিউব বা গুগল ডেটা সংগ্রহ বা বিক্রি করি না।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">৪. কুকিজ ও লোকাল স্টোরেজ</h2>
          <p>
            লগইন সেশন বজায় রাখা এবং ব্যবহারকারীর সুবিধার জন্য নিরাপদ কুকি ও লোকাল সেশন টোকেন ব্যবহৃত হয়। তৃতীয় পক্ষের ট্র্যাকার বা বিজ্ঞাপনী কুকি দ্বারা অবাঞ্ছিত ট্র্যাকিং পরিহার করা হয়।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">৫. যোগাযোগ</h2>
          <p>
            গোপনীয়তা নীতিমালা সম্পর্কিত যেকোনো প্রশ্ন বা আপনার একাউন্ট ডিলিট করার অনুরোধ জানাতে আমাদের অফিসিয়াল ইমেইলে যোগাযোগ করতে পারেন: <strong className="text-white">techmosarof5@gmail.com</strong>।
          </p>
        </section>
      </div>
    </div>
  );
};
