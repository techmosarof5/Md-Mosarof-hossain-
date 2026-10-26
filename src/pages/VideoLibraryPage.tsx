import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { VideoCard } from '../components/VideoCard';
import { VideoCategory } from '../types';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Video as VideoIcon, RefreshCw } from 'lucide-react';

const CATEGORIES: VideoCategory[] = [
  'সব',
  'ব্যাংকিং ও অর্থনীতি',
  'মোবাইল ব্যাংকিং ও ফিনটেক',
  'ফ্রিল্যান্সিং ও রেমিট্যান্স',
  'সাইবার নিরাপত্তা',
  'প্রযুক্তি ও সফটওয়্যার',
];

export const VideoLibraryPage: React.FC = () => {
  const { videos, loading } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('সব');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter & Sort
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          (v.category && v.category.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'সব') {
      result = result.filter((v) => v.category === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

    return result;
  }, [videos, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(start, start + itemsPerPage);
  }, [filteredVideos, currentPage, itemsPerPage]);

  const handleCategoryChange = (cat: VideoCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase font-semibold text-rose-400 tracking-wider">
          ভিডিও আর্কাইভ ও টিউটোরিয়াল
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ভিডিও লাইব্রেরি (Video Library)
        </h1>
        <p className="text-sm text-slate-400">
          মোঃ মোশারফ হোসেন-এর সকল ইউটিউব ভিডিও এক নজরে খুঁজুন ও স্ট্রিম করুন।
        </p>
      </div>

      {/* Search & Sort Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ভিডিও শিরোনাম বা বিষয়বস্তু দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">সাজান:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="newest">নতুন আপলোড (Newest First)</option>
            <option value="popular">সর্বাধিক ভিউ (Most Popular)</option>
            <option value="oldest">পুরাতন আপলোড (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Category Segmented Filter Buttons (Allowed per Section 1.A: Functional Segmented Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result Count and Quick Stat */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>
          মোট <span className="font-semibold text-white font-mono tabular-nums">{filteredVideos.length}</span> টি ভিডিও পাওয়া গেছে
        </p>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('সব');
            }}
            className="text-rose-400 hover:underline cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Videos Grid */}
      {paginatedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-3">
          <VideoIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-300">কোনো ভিডিও পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ভিডিও পাওয়া যায়নি। অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ক্যাটাগরি পরিবর্তন করুন।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('সব');
            }}
            className="mt-2 px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            সব ভিডিও দেখুন
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs sm:text-sm text-slate-300 font-medium font-mono tabular-nums">
            পৃষ্ঠা {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
