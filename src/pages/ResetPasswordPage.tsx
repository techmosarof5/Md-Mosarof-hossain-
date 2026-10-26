import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (tab: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError('অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল ঠিকানাটি লিখুন।');
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>লগইনে ফিরে যান</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">পাসওয়ার্ড রিসেট</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            আপনার নিবন্ধিত ইমেইলে একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হবে
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm space-y-3">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>ইমেইল সফলভাবে পাঠানো হয়েছে!</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              <strong className="text-white">{email}</strong> ঠিকানায় পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইনবক্স অথবা স্প্যাম (Spam/Junk) ফোল্ডার চেক করুন।
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              লগইন পেজে যান
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {(localError || authError) && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{localError || authError}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                আপনার ইমেইল অ্যাড্রেস
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-rose-900/30"
            >
              {isSubmitting ? 'লিংক তৈরি করা হচ্ছে...' : 'রিসেট লিঙ্ক পাঠান'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
