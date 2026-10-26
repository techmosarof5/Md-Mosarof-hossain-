import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { User, LogOut, ShieldCheck, Video, Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { settings } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="text-left group flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              {settings.siteName || 'Md Mosarof Hossain'}
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'home' ? 'text-rose-400 font-semibold' : ''
              }`}
            >
              হোম
            </button>
            <button
              onClick={() => handleNav('library')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'library' ? 'text-rose-400 font-semibold' : ''
              }`}
            >
              ভিডিও লাইব্রেরি
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'about' ? 'text-rose-400 font-semibold' : ''
              }`}
            >
              পরিচিতি ও লক্ষ্য
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'contact' ? 'text-rose-400 font-semibold' : ''
              }`}
            >
              যোগাযোগ
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'admin' ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                অ্যাডমিন ড্যাশবোর্ড
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200 hover:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-600/30 text-rose-400 flex items-center justify-center text-xs font-bold uppercase">
                    {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-xs sm:text-sm">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">সাইন-ইন করা আছে:</p>
                      <p className="text-xs font-semibold text-white truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[11px] text-rose-400 font-medium">
                          অ্যাডমিনিস্ট্রেটর
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      আমার প্রোফাইল
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-3 py-2 text-xs sm:text-sm text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-400" />
                        অ্যাডমিন ড্যাশবোর্ড
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={async () => {
                        await logout();
                        handleNav('home');
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      লগআউট (Sign Out)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-rose-900/30"
              >
                লগইন / সাইন-আপ
              </button>
            )}

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
              currentTab === 'home' ? 'bg-slate-900 text-rose-400 font-semibold' : 'text-slate-300'
            }`}
          >
            হোম
          </button>
          <button
            onClick={() => handleNav('library')}
            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
              currentTab === 'library' ? 'bg-slate-900 text-rose-400 font-semibold' : 'text-slate-300'
            }`}
          >
            ভিডিও লাইব্রেরি
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
              currentTab === 'about' ? 'bg-slate-900 text-rose-400 font-semibold' : 'text-slate-300'
            }`}
          >
            পরিচিতি ও লক্ষ্য
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
              currentTab === 'contact' ? 'bg-slate-900 text-rose-400 font-semibold' : 'text-slate-300'
            }`}
          >
            যোগাযোগ
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`block w-full text-left py-2 px-3 rounded-md text-sm text-rose-400 font-medium ${
                currentTab === 'admin' ? 'bg-rose-950/40' : ''
              }`}
            >
              অ্যাডমিন ড্যাশবোর্ড
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => handleNav('profile')}
              className={`block w-full text-left py-2 px-3 rounded-md text-sm ${
                currentTab === 'profile' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-300'
              }`}
            >
              আমার প্রোফাইল
            </button>
          )}
        </div>
      )}
    </header>
  );
};
