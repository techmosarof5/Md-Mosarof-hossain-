import React from 'react';
import { Video } from '../types';
import { Play, ExternalLink, Calendar, Eye, Bookmark } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface VideoCardProps {
  video: Video;
  onSelect?: (video: Video) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const { setActiveVideo } = useSite();

  const handlePlay = () => {
    if (onSelect) {
      onSelect(video);
    } else {
      setActiveVideo(video);
    }
  };

  const formattedDate = new Date(video.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="group bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col">
      {/* Thumbnail Container */}
      <div
        onClick={handlePlay}
        className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
          }}
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Play Icon Trigger */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-500 transition-all">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration (Corner Overlay) */}
        {video.duration && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-xs font-mono tabular-nums font-semibold bg-slate-950/80 text-white rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Metadata Discipline: Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-rose-400 font-medium mb-2">
            <span>{video.category || 'প্রযুক্তি ও ব্যাংকিং'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">{formattedDate}</span>
            {video.views ? (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-normal tabular-nums">
                  {video.views.toLocaleString('bn-BD')} ভিউ
                </span>
              </>
            ) : null}
          </div>

          {/* Video Title */}
          <h3
            onClick={handlePlay}
            className="text-base font-semibold text-slate-100 hover:text-rose-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {video.title}
          </h3>

          {/* Short Excerpt */}
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {video.description || 'সম্পূর্ণ ভিডিও দেখতে প্লে বাটনে ক্লিক করুন।'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            ভিডিও দেখুন
          </button>

          <div className="flex items-center gap-3">
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(video.videoId);
                }}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ${
                  isBookmarked ? 'text-rose-400' : ''
                }`}
                title={isBookmarked ? 'বুকমার্ক থেকে মুছুন' : 'সংরক্ষণ করুন'}
                aria-label="Bookmark video"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}

            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
              title="ইউটিউব সাইটে গিয়ে দেখুন"
            >
              <span>ইউটিউবে</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
