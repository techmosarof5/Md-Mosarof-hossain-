import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserAccount, Video } from '../types';
import {
  ShieldCheck,
  Settings,
  Youtube,
  RefreshCw,
  Phone,
  Mail,
  Send,
  Facebook,
  Users,
  Film,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  Save,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const {
    settings,
    updateSettings,
    videos,
    syncVideos,
    deleteVideo,
    addOrUpdateVideo,
  } = useSite();

  const [activeTab, setActiveTab] = useState<'branding' | 'youtube' | 'footer' | 'videos' | 'users'>('branding');

  // Form states initialized with current settings
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);
  const [bio, setBio] = useState(settings.bio);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(settings.profilePhotoUrl);
  const [youtubeChannelId, setYoutubeChannelId] = useState(settings.youtubeChannelId);
  const [youtubeApiKey, setYoutubeApiKey] = useState(settings.youtubeApiKey || '');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [telegramUrl, setTelegramUrl] = useState(settings.telegramUrl);
  const [phone, setPhone] = useState(settings.phone || '');

  // Operation feedback states
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Users list state
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Manual Video Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideoId, setNewVideoId] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('ব্যাংকিং ও অর্থনীতি');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoFeatured, setNewVideoFeatured] = useState(false);

  // Update local form state when settings change
  useEffect(() => {
    setSiteName(settings.siteName);
    setSiteTagline(settings.siteTagline);
    setBio(settings.bio);
    setProfilePhotoUrl(settings.profilePhotoUrl);
    setYoutubeChannelId(settings.youtubeChannelId);
    setYoutubeApiKey(settings.youtubeApiKey || '');
    setContactEmail(settings.contactEmail);
    setYoutubeUrl(settings.youtubeUrl);
    setFacebookUrl(settings.facebookUrl);
    setTelegramUrl(settings.telegramUrl);
    setPhone(settings.phone || '');
  }, [settings]);

  // Fetch users when entering users tab
  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const snap = await getDocs(collection(db, 'users'));
          const list: UserAccount[] = [];
          snap.forEach((d) => {
            list.push(d.data() as UserAccount);
          });
          setUsersList(list);
        } catch (e) {
          console.warn('Could not read user list:', e);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  // Guard against non-admin access
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">অ্যাক্সেস সংরক্ষিত (Access Denied)</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          এই ড্যাশবোর্ডটি শুধুমাত্র অনুমোদিত অ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত। আপনার বর্তমান একাউন্টে এই সুবিধা নেই।
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          মূল পাতায় ফিরে যান
        </button>
      </div>
    );
  }

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      await updateSettings({
        siteName: siteName.trim(),
        siteTagline: siteTagline.trim(),
        bio: bio.trim(),
        profilePhotoUrl: profilePhotoUrl.trim(),
        youtubeChannelId: youtubeChannelId.trim(),
        youtubeApiKey: youtubeApiKey.trim(),
        contactEmail: contactEmail.trim(),
        youtubeUrl: youtubeUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        telegramUrl: telegramUrl.trim(),
        phone: phone.trim(),
      });
      setSaveSuccess('সকল সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'সেটিংস সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Profile Photo File Upload (Convert to Data URL / Cloud Path)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveError('ছবির আকার সর্বোচ্চ ২ মেগাবাইটের মধ্যে হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle YouTube Sync
  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setSyncError(null);

    try {
      const res = await syncVideos();
      setSyncStatus(res.message);
    } catch (err: any) {
      setSyncError(err.message || 'ভিডিও সিঙ্ক ব্যর্থ হয়েছে। অনুগ্রহ করে ইউটিউব ক্রেডেনশিয়াল চেক করুন।');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Add Manual Video
  const handleAddManualVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoId.trim() || !newVideoTitle.trim()) return;

    const vidId = newVideoId.trim();
    const video: Video = {
      id: vidId,
      videoId: vidId,
      title: newVideoTitle.trim(),
      description: newVideoDesc.trim(),
      thumbnailUrl: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
      publishedAt: new Date().toISOString(),
      category: newVideoCategory,
      duration: '14:20',
      views: 0,
      isFeatured: newVideoFeatured,
    };

    try {
      await addOrUpdateVideo(video);
      setShowAddModal(false);
      setNewVideoId('');
      setNewVideoTitle('');
      setNewVideoDesc('');
      setSaveSuccess('নতুন ভিডিও সফলভাবে যুক্ত করা হয়েছে!');
    } catch (err: any) {
      setSaveError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              অ্যাডমিন ড্যাশবোর্ড (Administrator Dashboard)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              সাইট ব্র্যান্ডিং, ইউটিউব অটো-সিঙ্ক, ভিডিও কন্টেন্ট ও যোগাযোগ তথ্য পরিচালনা
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-rose-900/30 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ইউটিউব সিঙ্ক করুন'}</span>
        </button>
      </div>

      {/* Global Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}
      {syncStatus && (
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800 text-sky-200 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}
      {syncError && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Tabs Navigation (Segmented Controls) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ব্র্যান্ডিং ও পরিচিতি</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'youtube'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Youtube className="w-4 h-4" />
          <span>ইউটিউব সিঙ্ক ও ক্রেডেনশিয়াল</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'footer'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>যোগাযোগ ও ফুটার লিঙ্ক</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'videos'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>ভিডিও পরিচালনা ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>নিবন্ধিত ব্যবহারকারী</span>
        </button>
      </div>

      {/* Tab 1: Branding & Profile Details */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-rose-500" />
              <span>ওয়েবসাইট ও ক্রিয়েটর পরিচিতি</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ওয়েবসাইটের নাম (Website Name)
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ট্যাগলাইন বা সাবটাইটেল (Tagline)
                </label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Profile Photo Upload / URL */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                অ্যাডমিন প্রোফাইল ছবি (Admin Profile Photo)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  <img
                    src={profilePhotoUrl || '/src/assets/images/mosarof_portrait_1793006296735.jpg'}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profilePhotoUrl}
                      onChange={(e) => setProfilePhotoUrl(e.target.value)}
                      placeholder="ছবির লিংক দিন (https://...)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
                    />
                    <label className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>ফাইল আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    সরাসরি ছবি আপলোড করতে পারেন অথবা যেকোনো পাবলিক ইমেজ URL বসাতে পারেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                মোঃ মোশারফ হোসেন এর সংক্ষিপ্ত বায়োগ্রাফি (Biography)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'ব্র্যান্ডিং সেটিংস সেভ করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: YouTube Channel ID & Data API Key */}
      {activeTab === 'youtube' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Youtube className="w-5 h-5 text-rose-500" />
              <span>ইউটিউব চ্যানেল কনফিগারেশন ও অটো-সিঙ্ক</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              আপনার ইউটিউব চ্যানেল আইডি (Channel ID) এবং গুগল ক্লাউড থেকে প্রাপ্ত YouTube Data API v3 কি এখানে কনফিগার করুন। &apos;Sync Now&apos; বাটনে চাপ দিলে অটোমেটিকভাবে আপনার চ্যানেলের ভিডিও ও মেটাডাটা সিস্টেমে যুক্ত হবে।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ইউটিউব চ্যানেল আইডি (Channel ID)
                </label>
                <input
                  type="text"
                  value={youtubeChannelId}
                  onChange={(e) => setYoutubeChannelId(e.target.value)}
                  placeholder="যেমন: UCxxxxxxxxxxxxxxxxxxxxxx"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  আপনার ইউটিউব স্টুডিও &gt; কাস্টমাইজেশন &gt; বেসিক ইনফো থেকে চ্যানেল আইডি পান।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  YouTube Data API v3 Key (গুগল ক্লাউড এপিআই কি)
                </label>
                <input
                  type="password"
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Google Cloud Console &gt; Credentials থেকে তৈরি করা ফ্রি YouTube Data API v3 কি।
                </p>
              </div>
            </div>

            {/* Sync Testing Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">ম্যানুয়াল ভিডিও সিঙ্ক টেস্ট</h4>
                  <p className="text-xs text-slate-400">
                    বর্তমান চ্যানেল আইডি ও এপিআই ব্যবহার করে নতুন ভিডিও আমদানি করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'সিঙ্ক চলছে...' : 'Sync Now (এখনই সিঙ্ক করুন)'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'ইউটিউব সেটিংস সেভ করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Footer Contact Information */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-rose-500" />
              <span>যোগাযোগ ও ফুটার সোশ্যাল মিডিয়া লিঙ্ক</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400">
              এখানকার যেকোনো তথ্য পরিবর্তন করলে তা সরাসরি সকল পাতার ফুটারে ও যোগাযোগ অংশে দৃশ্যমান হবে। সোর্স কোড পরিবর্তন করতে হবে না।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>যোগাযোগ ইমেইল (Contact Email)</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>মোবাইল / হেল্পলাইন নম্বর (Phone)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712-345678"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-rose-500" />
                  <span>ইউটিউব চ্যানেল লিংক (YouTube URL)</span>
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-500" />
                  <span>ফেসবুক পেজ বা প্রোফাইল (Facebook URL)</span>
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>টেলিগ্রাম চ্যানেল বা সাপোর্ট লিংক (Telegram URL)</span>
                </label>
                <input
                  type="url"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'ফুটার ও যোগাযোগ তথ্য সেভ করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Video Management */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">প্রকাশিত ভিডিওসমূহ ({videos.length})</h2>
              <p className="text-xs text-slate-400">ভিডিও ফিচার করুন বা সরাসরি নতুন ভিডিও যুক্ত করুন</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>ম্যানুয়াল ভিডিও যোগ করুন</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-4">থাম্বনেইল</th>
                    <th className="p-4">শিরোনাম ও ক্যাটাগরি</th>
                    <th className="p-4">প্রকাশকাল</th>
                    <th className="p-4">ফিচার্ড</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {videos.map((vid) => (
                    <tr key={vid.videoId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="w-20 aspect-video rounded-lg overflow-hidden bg-slate-950">
                          <img
                            src={vid.thumbnailUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="font-semibold text-white line-clamp-1">{vid.title}</p>
                        <p className="text-xs text-rose-400 mt-0.5">{vid.category}</p>
                        <span className="font-mono text-[11px] text-slate-500">
                          ID: {vid.videoId}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {new Date(vid.publishedAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            await addOrUpdateVideo({ ...vid, isFeatured: !vid.isFeatured });
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors ${
                            vid.isFeatured
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {vid.isFeatured ? 'হ্যাঁ (Featured)' : 'সাধারণ'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white"
                            title="ইউটিউবে দেখুন"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={async () => {
                              if (window.confirm('আপনি কি নিশ্চিতভাবে এই ভিডিওটি মুছতে চান?')) {
                                await deleteVideo(vid.videoId);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Registered Users */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">নিবন্ধিত ব্যবহারকারীর তালিকা</h2>
            <p className="text-xs text-slate-400">
              Firebase Authentication ও Firestore-এ সংরক্ষিত ব্যবহারকারীদের বিবরণ
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4 sm:p-6">
            {loadingUsers ? (
              <p className="text-sm text-slate-400 text-center py-8">তথ্য লোড হচ্ছে...</p>
            ) : usersList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3">নাম</th>
                      <th className="p-3">ইমেইল</th>
                      <th className="p-3">রোল</th>
                      <th className="p-3">নিবন্ধন তারিখ</th>
                      <th className="p-3 font-mono">UID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {usersList.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-white">{u.displayName || 'Unnamed'}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                              u.role === 'admin'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('bn-BD') : '-'}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                          {u.uid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-300">এখনো কোনো সাধারণ ব্যবহারকারী ডেটাবেজে নিবন্ধিত হয়নি।</p>
                <p className="text-xs text-slate-500">
                  দর্শকরা সাইন-আপ করলে তাদের তথ্য স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হবে।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">নতুন ইউটিউব ভিডিও যোগ করুন</h3>
            <form onSubmit={handleAddManualVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  YouTube Video ID (11 Character ID)
                </label>
                <input
                  type="text"
                  value={newVideoId}
                  onChange={(e) => setNewVideoId(e.target.value)}
                  placeholder="যেমন: dQw4w9WgXcQ"
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ভিডিও শিরোনাম (Video Title)
                </label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="ভিডিওর শিরোনাম লিখুন"
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ক্যাটাগরি (Category)
                </label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="ব্যাংকিং ও অর্থনীতি">ব্যাংকিং ও অর্থনীতি</option>
                  <option value="মোবাইল ব্যাংকিং ও ফিনটেক">মোবাইল ব্যাংকিং ও ফিনটেক</option>
                  <option value="ফ্রিল্যান্সিং ও রেমিট্যান্স">ফ্রিল্যান্সিং ও রেমিট্যান্স</option>
                  <option value="সাইবার নিরাপত্তা">সাইবার নিরাপত্তা</option>
                  <option value="প্রযুক্তি ও সফটওয়্যার">প্রযুক্তি ও সফটওয়্যার</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <textarea
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  rows={3}
                  placeholder="ভিডিওর বিষয়বস্তু লিখুন..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newVideoFeatured}
                  onChange={(e) => setNewVideoFeatured(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-rose-600 focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs text-slate-300">
                  হোমপেজে ফিচার্ড ভিডিও হিসেবে প্রদর্শন করুন
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
                >
                  ভিডিও সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
