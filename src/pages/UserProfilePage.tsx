import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { VideoCard } from '../components/VideoCard';
import { User, Mail, Shield, Calendar, LogOut, CheckCircle2, Bookmark, Video as VideoIcon } from 'lucide-react';

interface UserProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { videos } = useSite();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <User className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন</h2>
        <p className="text-xs text-slate-400">
          আপনার সংরক্ষিত ভিডিও এবং একাউন্ট তথ্য পরিচালনা করতে সাইন ইন প্রয়োজন।
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs sm:text-sm"
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  // Sample or bookmarked videos (take first 3 as user watch list)
  const savedVideos = videos.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-lg shadow-rose-900/20">
              {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {currentUser.displayName || 'ব্যবহারকারী'}
                </h1>
                {isAdmin ? (
                  <span className="text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-0.5 rounded-full">
                    অ্যাডমিনিস্ট্রেটর
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
                    সদস্য
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                অ্যাডমিন প্যানেল
              </button>
            )}
            <button
              onClick={async () => {
                await logout();
                onNavigate('home');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Account Details Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs">
          <div className="space-y-1">
            <p className="text-slate-500">ইউজার আইডি (UID)</p>
            <p className="font-mono text-slate-300 text-[11px] truncate">{currentUser.uid}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500">নিবন্ধন তারিখ</p>
            <p className="text-slate-300">
              {currentUser.metadata.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'উপলব্ধ নয়'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500">ইমেইল স্ট্যাটাস</p>
            <p className="text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firebase Auth সুরক্ষিত</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarked / Recently Watched Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-rose-500" />
            <h2 className="text-lg font-bold text-white">আমার বুকমার্ক ও সাম্প্রতিক ভিডিও</h2>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs text-rose-400 hover:underline cursor-pointer"
          >
            লাইব্রেরি থেকে আরও দেখুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};
