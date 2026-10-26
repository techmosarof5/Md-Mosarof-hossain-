import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Mail, Phone, Send, Youtube, Facebook, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSite();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs uppercase font-semibold text-rose-400 tracking-wider">যোগাযোগ করুন</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          যেকোনো জিজ্ঞাসা বা পরামর্শের জন্য আমাদের লিখুন
        </h1>
        <p className="text-sm text-slate-400">
          ব্যাংকিং ও প্রযুক্তি বিষয়ক তথ্য, ভিডিও মতামত বা স্পন্সরশিপের জন্য নিচের ফর্মটি পূরণ করতে পারেন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white">সরাসরি যোগাযোগের ঠিকানা</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {settings.contactEmail && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">ইমেইল ঠিকানা</p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="font-medium text-white hover:text-rose-400 transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">ফোন / হোয়াটসঅ্যাপ</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="font-mono text-white hover:text-emerald-400 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.telegramUrl && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-500 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">টেলিগ্রাম চ্যানেল / গ্রুপ</p>
                    <a
                      href={settings.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-sky-400 transition-colors"
                    >
                      {settings.telegramUrl}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <p className="text-xs text-slate-400">সামাজিক যোগাযোগ মাধ্যম:</p>
              <div className="flex items-center gap-3">
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">বার্তাটি সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  আপনার মেসেজের জন্য ধন্যবাদ। মোঃ মোশারফ হোসেন বা আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">বার্তা পাঠান</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="মোঃ ..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">বিষয় (Subject)</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="বার্তার বিষয়বস্তু"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">বিস্তারিত বার্তা</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-rose-900/30"
                >
                  বার্তা পাঠান (Send Message)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
